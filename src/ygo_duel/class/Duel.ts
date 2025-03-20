import { type IDeckInfo } from "@ygo/class/DeckInfo";
import { Duelist, type TDuelistType } from "@ygo_duel/class/Duelist";
import { type IDuelistProfile } from "@ygo/class/DuelistProfile";
import { DuelField } from "./DuelField";
import DuelLog from "@ygo_duel/class/DuelLog";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelViewController } from "@ygo_duel_view/class/DuelViewController";
import { DuelClock } from "./DuelClock";
import DuelCardActionLog from "./DuelCardActionLog";
import {
  cardActionNonChainBlockTypes,
  convertCardActionToString,
  type CardAction,
  type ChainBlockInfo,
  type ICardAction,
  type TCardActionType,
  type TSpellSpeed,
} from "./DuelCardAction";
export type TDuelPhase = "draw" | "standby" | "main1" | "battle" | "main2" | "end";
export type TDuelPhaseStep = "start" | "battle" | "damage" | "end" | undefined;
export const seats = ["Above", "Below"] as const;
export type TSeat = (typeof seats)[number];
export type DuelistResponse = {
  phaseChange?: TDuelPhase;
  selectedEntities?: DuelEntity[];
  sendMessage?: string;
  action?: ICardAction<unknown>;
  attack?: [DuelEntity, DuelEntity | undefined];
  cancel?: boolean;
  surrender?: boolean;
};

export class DuelEnd extends Error {
  public readonly winner: Duelist | undefined;
  public constructor(winner?: Duelist) {
    const message = winner ? `デュエルが終了した。勝者：${winner.profile.name}` : "デュエルが終了した。ドロー。";
    super(message);
    this.winner = winner;
  }
}
export class SystemError extends Error {
  public readonly message: string;
  public readonly items: unknown[];
  public constructor(message: string, ...items: unknown[]) {
    super(message);
    this.message = message;
    this.items = items;
  }
}
export class IllegalCancelError extends SystemError {
  public constructor(...items: unknown[]) {
    super("キャンセル不可のアクションがキャンセルされた。", ...items);
  }
}
export class Duel {
  public readonly view: DuelViewController;
  public readonly log: DuelLog;
  public readonly cardActionLog: DuelCardActionLog;
  public clock: DuelClock;
  public phase: TDuelPhase;
  public phaseStep: TDuelPhaseStep;
  public nextPhaseList: TDuelPhase[];
  public field: DuelField;
  public attackingMonster: DuelEntity | undefined;
  public targetForAttack: DuelEntity | undefined;
  private _chainBlockInfos: ChainBlockInfo<unknown>[];
  public get chainBlockInfos() {
    return this._chainBlockInfos as Readonly<ChainBlockInfo<unknown>[]>;
  }
  public readonly duelists: { [key in TSeat]: Duelist };
  public get firstPlayer() {
    return this.coin ? this.duelists.Below : this.duelists.Above;
  }
  public get secondPlayer() {
    return !this.coin ? this.duelists.Below : this.duelists.Above;
  }
  public priorityHolder: Duelist;

  public isEnded: boolean;
  private coin = false;
  public constructor(
    duelist1: IDuelistProfile,
    duelist1Type: TDuelistType,
    deck1: IDeckInfo,
    duelist2: IDuelistProfile,
    duelist2Type: TDuelistType,
    deck2: IDeckInfo
  ) {
    this.phase = "end";
    this.clock = new DuelClock();
    this.nextPhaseList = [];
    this.isEnded = false;
    this.duelists = {
      Below: new Duelist(this, "Below", duelist1, duelist1Type, deck1),
      Above: new Duelist(this, "Above", duelist2, duelist2Type, deck2),
    };
    this.priorityHolder = this.firstPlayer;
    this._chainBlockInfos = [];
    this.field = new DuelField(this);
    this.clock.onTotalProcSeqChange.append(this.field.procFilterPool.distributeAll);
    this.clock.onTotalProcSeqChange.append(this.field.cardRelationPool.distributeAll);
    this.clock.onTotalProcSeqChange.append(this.field.numericStateOperatorPool.distributeAll);
    this.clock.onTotalProcSeqChange.append(this.field.numericStateOperatorPool.calcStateAll);

    this.view = new DuelViewController(this);
    this.log = new DuelLog(this);
    this.cardActionLog = new DuelCardActionLog(this);
  }

  public readonly getTurnPlayer = (): Duelist => {
    return this.clock.turn % 2 === 0 ? this.secondPlayer : this.firstPlayer;
  };
  public readonly getNonTurnPlayer = (): Duelist => {
    return this.clock.turn % 2 === 0 ? this.firstPlayer : this.secondPlayer;
  };

  public readonly main = async () => {
    console.info("main start!");

    this.coin = Math.random() > 0.5;

    this.priorityHolder = this.firstPlayer;
    this.log.info("【デュエル開始】");
    this.log.info(`先攻：${this.firstPlayer.profile.name}`);

    // 下の三行はまとめても良いが、ログ的に交互にやったほうがそれっぽいのでこのままにする。
    Object.values(this.duelists).forEach((duelist) => duelist.pushDeck());
    Object.values(this.duelists).forEach((duelist) => duelist.shuffleDeck());
    await Promise.all(Object.values(this.duelists).map((duelist) => duelist.draw(5, undefined, undefined)));

    this.moveNextPhase("draw");
    this.view.requireUpdate();

    try {
      while (!this.isEnded) {
        if (this.phase === "draw") {
          await this.procDrawPhase();
        } else if (this.phase === "standby") {
          await this.procStanbyPhase();
        } else if (this.phase === "main1") {
          await this.procMainPhase();
        } else if (this.phase === "battle") {
          await this.procBattlePhase();
        } else if (this.phase === "main2") {
          await this.procMainPhase();
        } else if (this.phase === "end") {
          await this.procEndPhase();
        }
        if (this.clock.turn > 1000) {
          break;
        }
      }
    } catch (error) {
      if (error instanceof DuelEnd) {
        console.info(error);
        this.isEnded = true;
        this.log.info(error.winner ? `デュエル終了。勝者${error.winner.profile.name}` : "引き分け");
      } else if (error instanceof Error) {
        this.log.error(error);
      }
    } finally {
      this.view.requireUpdate();
      this.view.dispose();
      this.log.dispose();
    }
  };

  public readonly moveNextPhase = (next: TDuelPhase) => {
    if (this.clock.turn < 1) {
      this.phase = "draw";
    } else if (next === "draw") {
      this.log.info(`ターン終了。`, this.getTurnPlayer());
    } else {
      this.log.info(`フェイズ移行（${this.phase}→${next}）`, this.getTurnPlayer());
    }
    if (next === "draw") {
      this.clock.incrementTurn();
    } else {
      this.clock.incrementPhaseSeq();
    }
    this.phase = next;
    this.phaseStep = undefined;
    if (this.phase === "main2" || this.clock.turn === 1) {
      this.nextPhaseList = ["end"];
    } else if (this.phase === "battle") {
      this.nextPhaseList = ["main2"];
    } else if (this.phase === "main1") {
      this.nextPhaseList = ["battle", "end"];
    } else {
      this.nextPhaseList = [];
    }
  };

  public readonly declareAnAttack = (attacker: DuelEntity, defender: DuelEntity): void => {
    this.attackingMonster = attacker;
    this.targetForAttack = defender;
    attacker.info.attackCount++;
    this.log.info(`攻撃宣言：${attacker.status.name} ⇒ ${defender.status.name}`, attacker.controller);
  };

  private readonly procDrawPhase = async () => {
    Object.values(this.duelists).forEach((duelist) => duelist.initForDrawPhase());
    this.log.info("ドローフェイズ開始。", this.getTurnPlayer());
    if (this.clock.turn === 1) {
      this.log.info("先攻プレイヤーはドローできない。", this.getTurnPlayer());
    } else {
      await this.getTurnPlayer().draw(1, undefined, undefined);
    }
    // TODO フェイズ強制処理
    while (await this.procChainBlock(undefined, undefined)) {
      //
    }
    this.field.getEntiteisOnField().forEach((m) => m.initForTurn());
    this.moveNextPhase("standby");
  };
  private readonly procStanbyPhase = async () => {
    // TODO フェイズ強制処理

    while (await this.procChainBlock(undefined, undefined)) {
      //
    }
    this.moveNextPhase("main1");
  };
  private readonly procMainPhase = async () => {
    while (true) {
      this.priorityHolder = this.getTurnPlayer();

      // ユーザー入力を待つ。
      const response = await this.view.waitFieldAction(
        this.getEnableActions(
          ["NormalSummon", "SpellTrapSet", "SpecialSummon", "ChangeBattlePosition", "IgnitionEffect", "QuickEffect", "CardActivation"],
          ["Normal", "Quick", "Counter"],
          []
        ),
        "あなたの手番です。"
      );

      console.log(response);

      // ユーザー入力がカードアクションだった場合、チェーンブロックを作るか作らないかで処理を分ける
      if (response && response.action) {
        if (([...cardActionNonChainBlockTypes] as string[]).includes(response.action.playType)) {
          console.log("is not chainable", response);

          //チェーンに乗らない処理を実行し、処理番号をインクリメント
          const chainBlockInfo = await response.action.prepare(response.action.cell, [], true);

          if (chainBlockInfo === undefined) {
            continue;
          }

          await response.action.execute(chainBlockInfo, this.chainBlockInfos);

          this.clock.incrementChainSeq();
        } else {
          console.log("is chainable", response);

          //チェーンに積んで、チェーン処理へ
          await this.procChainBlock(response.action, undefined);
        }
        while (await this.procChainBlock(undefined, undefined)) {
          //
        }
        continue;
      }

      const nextPhase = response.phaseChange;
      // フェイズ移行前に、相手に優先権が移る。
      if (nextPhase) {
        this.priorityHolder = this.getNonTurnPlayer();
        const action = await this.view.waitQuickEffect(this.getEnableActions(["QuickEffect", "TriggerEffect"], ["Quick", "Counter"], []), "", true);

        // 相手が行動した場合、フェイズ移行はキャンセル。
        if (action) {
          await this.procChainBlock(action, undefined);
          while (await this.procChainBlock(undefined, undefined)) {
            //
          }
          continue;
        }
        this.moveNextPhase(nextPhase);
        return;
      }
    }
  };
  private readonly procBattlePhase = async () => {
    await this.procBattlePhaseStartStep();
    await this.procBattlePhaseBattleStep();
    await this.procBattlePhaseEndStep();
  };
  private readonly procBattlePhaseStartStep = async () => {
    this.phaseStep = "start";
    this.priorityHolder = this.getTurnPlayer();

    this.attackingMonster = undefined;
    this.targetForAttack = undefined;

    // TODO ステップ強制処理
    while (await this.procChainBlock(undefined, undefined)) {
      //
    }
  };
  private readonly procBattlePhaseBattleStep = async () => {
    while (true) {
      this.phaseStep = "battle";
      this.priorityHolder = this.getTurnPlayer();
      const response = await this.view.waitFieldAction(this.getEnableActions(["Battle"], ["Normal"], []), "攻撃モンスターと対象を選択。");

      if (response.phaseChange) {
        //エンドステップへ（※優先権の移動はない）
        break;
      }
      if (response.action) {
        const info = await response.action.prepare(response.action.cell, [], true);
        if (!info) {
          continue;
        }
        //チェーンに乗らない処理を実行し、処理番号をインクリメント
        await response.action.execute(info, []);
        this.clock.incrementChainSeq();

        //フリーチェーン処理へ
        while (await this.procChainBlock(undefined, undefined)) {
          //
        }

        //ダメージステップ処理へ
        this.clock.incrementStepSeq();
        await this.procBattlePhaseDamageStep(info);
      }
    }
    this.clock.incrementStepSeq();
  };
  private readonly procBattlePhaseDamageStep = async (chainBlockInfo: ChainBlockInfo<unknown>) => {
    this.phaseStep = "damage";
    const attacker = this.attackingMonster;
    const defender = this.targetForAttack;

    if (!attacker || attacker.atk === undefined) {
      throw new SystemError("想定されない状態", this.attackingMonster, this.targetForAttack);
    }
    if (!defender) {
      throw new SystemError("想定されない状態", this.attackingMonster, this.targetForAttack);
    }

    //ダメージステップ開始時
    this.log.info("ダメージステップ開始時", this.getTurnPlayer());
    //TODO エフェクト処理

    //ダメージ計算前
    this.log.info("ダメージ計算前", this.getTurnPlayer());
    if (defender?.battlePotion === "Set") {
      await defender.setBattlePosition("Defense");
    }
    //TODO エフェクト処理

    //ダメージ計算時
    this.log.info("ダメージ計算時", this.getTurnPlayer());
    //TODO エフェクト処理

    //ダメージ計算
    const atkPoint = attacker.atk;
    const defPoint = (defender.battlePotion === "Attack" ? defender.atk : defender.def) ?? 0;
    if (defender.entityType === "Duelist") {
      attacker.controller.getOpponentPlayer().battleDamage(atkPoint - defPoint, attacker);
    } else {
      // 戦闘ダメージ計算
      if (atkPoint > 0 && atkPoint > defPoint && defender.battlePotion === "Attack") {
        attacker.controller.getOpponentPlayer().battleDamage(atkPoint - defPoint, attacker);
      } else if (atkPoint < defPoint) {
        // 絶対防御将軍が守備表示で攻撃しても反射ダメージが発生するとのこと。
        attacker.controller.battleDamage(defPoint - atkPoint, defender);
      }

      // 戦闘破壊計算
      if (atkPoint > 0 && (atkPoint > defPoint || (atkPoint === defPoint && defender.battlePotion === "Attack"))) {
        defender.tryDestoryByBattle(attacker.controller, attacker, chainBlockInfo.action);
      }
      if (defender.battlePotion === "Attack" && atkPoint <= defPoint) {
        attacker.tryDestoryByBattle(attacker.controller, defender, chainBlockInfo.action);
      }
    }

    const losers = Object.values(this.duelists).filter((duelist) => duelist.lp <= 0);

    if (losers.length > 0) {
      throw new DuelEnd(
        Object.values(this.duelists)
          .filter((duelist) => !losers.includes(duelist))
          .pop()
      );
    }
    //戦闘破壊墓地送り実施
    await this.field.waitCorpseDisposal();

    // チェーン番号を加算
    this.clock.incrementChainSeq();

    //ダメージ計算後
    this.log.info("ダメージ計算後", this.getTurnPlayer());
    while (await this.procChainBlock(undefined, undefined)) {
      //
    }

    //ダメージステップ終了時
    this.log.info("ダメージステップ終了時", this.getTurnPlayer());

    //TODO エフェクト処理

    this.clock.incrementStepSeq();
  };
  private readonly procBattlePhaseEndStep = async () => {
    this.phaseStep = "end";
    this.priorityHolder = this.getTurnPlayer();

    // TODO ステップ強制処理
    while (await this.procChainBlock(undefined, undefined)) {
      //
    }
    this.moveNextPhase("main2");
  };
  private readonly procEndPhase = async () => {
    // TODO フェイズ強制処理
    while (await this.procChainBlock(undefined, undefined)) {
      //
    }
    while (true) {
      const hand = this.getTurnPlayer().getHandCell();
      const qty = hand.cardEntities.length;
      if (qty < 7) {
        break;
      }
      await this.getTurnPlayer().discard(qty - 6, ["Rule"]);
      // TODO トリガー効果のみ発動可能
    }

    // このタイミングではフリーチェーンを発動できない。

    this.moveNextPhase("draw");
    return;
  };

  /**
   * チェーンが発生しうる場合の処理
   * @param action
   * @param triggerEffects
   * @param chainBlockInfos
   * @returns チェーンが発生したかどうか
   */
  private readonly procChainBlock = async (action: ICardAction<unknown> | undefined, triggerEffects: ICardAction<unknown>[] | undefined): Promise<boolean> => {
    // チェーン開始判定
    const isStartPoint = this.clock.chainBlockSeq === 0;

    //両方のプレイヤーの誘発効果を収集する。
    //    ※誘発効果の収集は一回のみ
    let _triggerEffets =
      triggerEffects ??
      Object.values(this.duelists).flatMap((duelist) => {
        this.priorityHolder = duelist;
        return this.getEnableActions(["TriggerMandatoryEffect", "TriggerEffect"], ["Normal"], []);
      });

    // 返却値 チェーンが発生したかどうか
    let result = false;
    // この呼び出しで積むチェーンブロック
    let chainBlock: ICardAction<unknown> | undefined;

    // 起点の効果がある場合、最初に積む。
    if (action) {
      chainBlock = action;
      result = true;
    } else if (_triggerEffets.length > 0) {
      // 次に誘発効果が存在する場合、まずそちらからチェーンを積む
      const triggerEffect = await this.selectTriggerEffect(_triggerEffets);

      // 誘発効果が選択された場合、積む
      if (triggerEffect) {
        _triggerEffets = _triggerEffets.filter((effect) => effect !== triggerEffect);
        chainBlock = triggerEffect;
        result = true;
      }
    }

    // ここまででチェーンブロックが積まれていない場合、任意効果のクイックエフェクト
    if (!result) {
      // 任意効果のクイックエフェクト
      let skipCount = 0;
      while (skipCount < 2) {
        this.priorityHolder = this.priorityHolder.getOpponentPlayer();
        const action = await this.view.waitQuickEffect(
          this.getEnableActions(["QuickEffect", "CardActivation"], ["Quick", "Counter"], this.chainBlockInfos),
          "クイックエフェクト発動タイミング。効果を発動しますか？",
          true
        );

        // どちらかのプレイヤーが効果を発動する場合、チェーン処理へ。
        if (action) {
          chainBlock = action;
          result = true;
          break;
        }
        skipCount++;
      }
    }

    console.info("selected action: ", chainBlock);

    if (chainBlock) {
      // この時点のコントローラーが効果処理を行う
      const activator = chainBlock.entity.controller;

      const chainCount = this.clock.chainBlockSeq + 1;

      this.log.info(`チェーン${chainCount}: ${convertCardActionToString(chainBlock)}を発動`, activator);

      // コスト処理
      const chainBlockInfo = await chainBlock.prepare(chainBlock.cell, this.chainBlockInfos, false);

      if (!chainBlockInfo) {
        throw new IllegalCancelError(chainBlock);
      }

      this._chainBlockInfos.push(chainBlockInfo);

      console.log(this.chainBlockInfos);

      this.clock.incrementProcSeq();
      this.clock.incrementChainBlockSeq();

      await this.procChainBlock(
        undefined,
        _triggerEffets.filter((e) => e.seq !== chainBlock?.seq)
      );

      this.log.info(`チェーン${chainCount}: ${convertCardActionToString(chainBlock)}の効果処理。`, activator);
      console.log(chainBlockInfo);
      if (chainBlockInfo.isNegatedActivationBy) {
        // 発動無効時は全ての処理を行わない
        this.log.info(
          `チェーン${chainCount}: ${convertCardActionToString(chainBlock)}を${convertCardActionToString(chainBlockInfo.isNegatedActivationBy)}によって発動を無効にした。`,
          chainBlockInfo.activator
        );
      } else {
        // 効果無効時は後処理のみ行う
        if (chainBlockInfo.isNegatedEffectBy) {
          this.log.info(
            `チェーン${chainCount}: ${convertCardActionToString(chainBlock)}を${convertCardActionToString(chainBlockInfo.isNegatedEffectBy)}によって効果を無効にした。`,
            chainBlockInfo.activator
          );
        } else {
          await chainBlock.execute(chainBlockInfo, this.chainBlockInfos);
        }
        await chainBlock.settle(chainBlockInfo, this.chainBlockInfos);
      }

      this.clock.incrementProcSeq();

      if (isStartPoint) {
        // 効果を発動した魔法罠は墓地送り（光の護封剣などを除く）
        await this.field.waitCorpseDisposal();
        // チェーン情報を破棄
        this._chainBlockInfos.reset();
        // チェーン番号を加算。
        this.clock.incrementChainSeq();
      }
    }

    return result;
  };
  private readonly selectTriggerEffect = async (triggerEffects: ICardAction<unknown>[]): Promise<ICardAction<unknown> | undefined> => {
    // 誘発効果の処理順に従って効果を抽出する。
    if (triggerEffects.length > 0) {
      for (const triggerType of ["TriggerMandatoryEffect", "TriggerEffect"] as TCardActionType[]) {
        for (const duelist of [this.getTurnPlayer(), this.getNonTurnPlayer()]) {
          // 誘発効果を抽出
          this.priorityHolder = duelist;
          const effects = triggerEffects.filter((effect) => effect.playType === triggerType && effect.entity.controller === duelist);

          // なければ次の条件へ
          if (effects.length === 0) {
            continue;
          }

          // 強制効果が残り１の場合、選択をスキップ
          if (effects.length === 1 && triggerType === "TriggerMandatoryEffect") {
            console.log(effects[0]);
            return effects[0] as CardAction<unknown>;
          }

          // 任意効果の場合、スキップ可能
          const _action = await this.view.waitQuickEffect(effects, "効果を選択。", triggerType === "TriggerEffect");

          if (_action) {
            return _action;
          }
        }
      }
    }
  };
  private readonly getEnableActions = (
    enableCardPlayTypes: TCardActionType[],
    enableSpellSpeeds: TSpellSpeed[],
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>
  ): CardAction<unknown>[] => {
    let actions = this.field
      .getAllCardEntities()
      .filter((entity) => entity.controller === this.priorityHolder)
      .flatMap((entity) => entity.actions)
      .filter((action) => action.executableCells.includes(action.entity.fieldCell.cellType))
      .filter((action) => enableCardPlayTypes.includes(action.playType))
      .filter((action) => enableSpellSpeeds.includes(action.spellSpeed));
    if (this.phaseStep === "damage") {
      actions = actions.filter((action) => action.canExecuteOnDamageStep);
    }
    return actions.filter((action) => action.validate(chainBlockInfos));
  };
}

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
import { playFieldCellTypes } from "./DuelFieldCell";
import type { TDuelPhase } from "./DuelPeriod";
export type TDuelStartMode = "PlayFirst" | "DrawFirst" | "Random";
export const duelStartModeDic: { [key in TDuelStartMode]: string } = {
  PlayFirst: "先攻",
  DrawFirst: "後攻",
  Random: "ランダム",
};
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
  public get phase() {
    return this.clock.period.phase;
  }
  public get step() {
    return this.clock.period.step;
  }
  public get stage() {
    return this.clock.period.stage;
  }

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
  private readonly startMode: TDuelStartMode;
  public constructor(
    duelist1: IDuelistProfile,
    duelist1Type: TDuelistType,
    deck1: IDeckInfo,
    hand1: string[] = [],
    duelist2: IDuelistProfile,
    duelist2Type: TDuelistType,
    deck2: IDeckInfo,
    hand2: string[] = [],
    startMode: TDuelStartMode = "Random"
  ) {
    this.clock = new DuelClock();
    this.nextPhaseList = [];
    this.isEnded = false;
    this.startMode = startMode;
    this.duelists = {
      Below: new Duelist(this, "Below", duelist1, duelist1Type, deck1, hand1),
      Above: new Duelist(this, "Above", duelist2, duelist2Type, deck2, hand2),
    };
    this.priorityHolder = this.firstPlayer;
    this._chainBlockInfos = [];
    this.field = new DuelField(this);
    this.clock.onTotalProcSeqChange.append(this.distributeOperators);

    this.view = new DuelViewController(this);
    this.log = new DuelLog(this);
    this.cardActionLog = new DuelCardActionLog(this);
  }

  public readonly distributeOperators = (totalProcSeq: number) => {
    console.info(`[totalProcSeq]:${totalProcSeq}`);
    let loopCount = 0;

    while (true) {
      loopCount++;

      if (loopCount > 10) {
        throw new SystemError("無限ループ発生");
      }

      // フィルター最優先
      if (!this.field.procFilterPool.distributeAll(this)) {
        continue;
      }

      // TODO これより先の順番
      if (!this.field.statusOperatorPool.distributeAll(this)) {
        continue;
      }

      if (!this.field.cardRelationPool.distributeAll(this)) {
        continue;
      }

      if (!this.field.numericStateOperatorPool.distributeAll(this)) {
        continue;
      }

      return;
    }
  };

  public readonly getTurnPlayer = (): Duelist => {
    return this.clock.turn % 2 === 0 ? this.secondPlayer : this.firstPlayer;
  };
  public readonly getNonTurnPlayer = (): Duelist => {
    return this.clock.turn % 2 === 0 ? this.firstPlayer : this.secondPlayer;
  };

  public readonly main = async () => {
    console.info("main start!");

    this.coin = this.startMode === "PlayFirst" ? true : this.startMode === "DrawFirst" ? false : Math.random() > 0.5;

    this.priorityHolder = this.firstPlayer;
    this.log.info("【デュエル開始】");
    this.log.info(`先攻：${this.firstPlayer.profile.name}`);

    // 下の三行はまとめても良いが、ログ的に交互にやったほうがそれっぽいのでこのままにする。
    Object.values(this.duelists).forEach((duelist) => duelist.pushDeck());
    Object.values(this.duelists).forEach((duelist) => duelist.getDeckCell().shuffle());

    Object.values(this.duelists).forEach((duelist) => {
      if (duelist.initHand.length) {
        duelist.initHand.forEach((name) => {
          const card = duelist.getDeckCell().cardEntities.find((card) => card.origin.name === name);
          if (!card) {
            this.log.info(`初手操作により${name}を手札に加えようとしたが、デッキに存在しない。`);
            return;
          }
          card.addToHand(["System"], undefined, undefined);
          this.log.info(`初手操作により${card.toString()}を手札に加えた`, duelist);
        });
      }
    });

    await Promise.all(Object.values(this.duelists).map((duelist) => duelist.draw(5 - duelist.getHandCell().cardEntities.length, undefined, undefined)));

    this.moveNextPhase("draw");
    this.view.requireUpdate();

    try {
      while (!this.isEnded) {
        if (this.clock.period.phase === "draw") {
          await this.procDrawPhase();
        } else if (this.phase === "standby") {
          await this.procStanbyPhase();
        } else if (this.phase === "main1") {
          await this.procMainPhase();
        } else if (this.phase === "battle1") {
          await this.procBattlePhase();
        } else if (this.phase === "battle2") {
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
    this.clock.setPhase(this, next);

    if (this.phase === "main2" || this.clock.turn === 1) {
      this.nextPhaseList = ["end"];
    } else if (this.phase === "battle1" || this.phase === "battle2") {
      this.nextPhaseList = ["main2"];
    } else if (this.phase === "main1") {
      this.nextPhaseList = ["battle1", "end"];
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
          this.priorityHolder,
          [
            "NormalSummon",
            "SpellTrapSet",
            "SpecialSummon",
            "ChangeBattlePosition",
            "IgnitionEffect",
            "MandatoryIgnitionEffect",
            "QuickEffect",
            "CardActivation",
          ],
          ["Normal", "Quick", "Counter"],
          []
        )
      );

      // ユーザー入力がカードアクションだった場合、チェーンブロックを作るか作らないかで処理を分ける
      if (response && response.action) {
        if (([...cardActionNonChainBlockTypes] as string[]).includes(response.action.playType)) {
          //チェーンに乗らない処理を実行し、処理番号をインクリメント
          const chainBlockInfo = await response.action.prepare(this.priorityHolder, response.action.cell, [], true);

          if (chainBlockInfo === undefined) {
            continue;
          }

          await response.action.execute(chainBlockInfo, this.chainBlockInfos);

          this.clock.incrementChainSeq();
        } else {
          //チェーンに積んで、チェーン処理へ
          await this.procChainBlock({ activator: this.priorityHolder, action: response.action }, undefined);
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
        const action = await this.view.waitQuickEffect(
          this.priorityHolder,
          this.getEnableActions(this.priorityHolder, ["QuickEffect", "TriggerEffect"], ["Quick", "Counter"], []),
          [],
          "",
          true
        );

        // 相手が行動した場合、フェイズ移行はキャンセル。
        if (action) {
          await this.procChainBlock({ activator: this.priorityHolder, action }, undefined);
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
    this.clock.setStep(this, "start");
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
      this.clock.setStep(this, "battle");
      this.priorityHolder = this.getTurnPlayer();
      const response = await this.view.waitFieldAction(this.getEnableActions(this.priorityHolder, ["Battle"], ["Normal"], []));

      if (response.phaseChange) {
        //エンドステップへ（※優先権の移動はない）
        break;
      }
      if (response.action) {
        console.log(response.action, response.action.cell);
        const info = await response.action.prepare(this.priorityHolder, response.action.cell, [], true);
        if (!info) {
          continue;
        }
        //チェーンに乗らない処理を実行し、処理番号をインクリメント
        await response.action.execute(info, []);
        this.clock.incrementChainSeq();

        let damageStepFlg = true;

        while (true) {
          const oldMonsterTotalProcSeqList = this.getNonTurnPlayer()
            .getMonstersOnField()
            .map((monster) => [monster.seq, monster.moveLog.latestRecord.movedAt.totalProcSeq]) as [monSeq: number, procSec: number][];

          //フリーチェーン処理へ
          while (await this.procChainBlock(undefined, undefined)) {
            //
          }

          if (!this.attackingMonster) {
            throw new SystemError("想定されない状態");
          }

          if (!this.attackingMonster.isOnField) {
            this.log.info(`${this.attackingMonster.toString()}がフィールドにいなくなったため、戦闘が中断された。`);
            damageStepFlg = false;
          } else if (this.attackingMonster.face === "FaceDown") {
            this.log.info(`${this.attackingMonster.toString()}が裏側守備表示になったため、戦闘が中断された。`);
            damageStepFlg = false;
          } else if (this.attackingMonster.orientation === "Horizontal") {
            // TODO 絶対防御将軍などの考慮
            this.log.info(`${this.attackingMonster.toString()}が守備表示になったため、戦闘が中断された。`);
            damageStepFlg = false;
          }

          const newMonsterTotalProcSeqList = this.getNonTurnPlayer()
            .getMonstersOnField()
            .map((monster) => [monster.seq, monster.moveLog.latestRecord.movedAt.totalProcSeq]) as [monSeq: number, procSec: number][];

          if (oldMonsterTotalProcSeqList.length !== newMonsterTotalProcSeqList.length) {
            this.log.info(`モンスターの数が増減したためバトルステップの巻き戻しが発生。`);
            throw new SystemError("巻き戻し未実装");
          }
          if (
            oldMonsterTotalProcSeqList.some(([oldMonSeq, oldProcSeq]) =>
              newMonsterTotalProcSeqList.every(([newMonSeq, newProcSeq]) => newMonSeq !== oldMonSeq || newProcSeq !== oldProcSeq)
            )
          ) {
            this.log.info(`モンスターの数が増減したためバトルステップの巻き戻しが発生。`);
            throw new SystemError("巻き戻し未実装");
          }
          break;
        }

        if (!damageStepFlg) {
          continue;
        }
        //ダメージステップ処理へ
        await this.procBattlePhaseDamageStep(info);
      }
    }
  };
  private readonly procBattlePhaseDamageStep = async (chainBlockInfo: ChainBlockInfo<unknown>) => {
    if (!this.attackingMonster || !this.targetForAttack) {
      throw new SystemError("想定されない状態", this.attackingMonster, this.targetForAttack);
    }

    await this.procBattlePhaseDamageStep1();
    await this.procBattlePhaseDamageStep2(this.attackingMonster, this.targetForAttack);
    await this.procBattlePhaseDamageStep3(chainBlockInfo, this.attackingMonster, this.targetForAttack);
    await this.procBattlePhaseDamageStep4();
    await this.procBattlePhaseDamageStep5();
  };
  private readonly procBattlePhaseDamageStep1 = async () => {
    this.clock.setStage(this, "start");
    //ダメージステップ開始時 ※「ダメージ計算を行わずに」などと記載されたものなど
    //TODO エフェクト処理
    while (await this.procChainBlock(undefined, undefined)) {
      //
    }
  };
  private readonly procBattlePhaseDamageStep2 = async (attacker: DuelEntity, defender: DuelEntity) => {
    this.clock.setStage(this, "beforeDmgCalc");
    //ダメージ計算前 ※裏側守備表示モンスターを表にする
    if (defender?.battlePosition === "Set") {
      defender.setBattlePosition("Defense", ["Flip", "FlipByBattle"], attacker, attacker.controller);
    }
    //TODO 「ライトロード・モンク エイリン」「ドリルロイド」等、
    while (await this.procChainBlock(undefined, undefined)) {
      //
    }
  };
  private readonly procBattlePhaseDamageStep3 = async (chainBlockInfo: ChainBlockInfo<unknown>, attacker: DuelEntity, defender: DuelEntity) => {
    if (attacker.atk === undefined) {
      throw new SystemError("想定されない状態", this.attackingMonster, this.targetForAttack);
    }

    //ダメージ計算時①永続効果（チェーンを組まない効果）の適用『開始』。 ※《メタル化・魔法反射装甲》など
    this.clock.setStage(this, "dmgCalc");
    //ダメージ計算時

    //ダメージ計算時②各種効果の発動 ※《プライドの咆哮》など
    // TODO １つ目のチェーンのみ、「ダメージ計算時」を条件とする効果を発動できる
    while (await this.procChainBlock(undefined, undefined)) {
      //
    }

    //ダメージ計算時③ダメージ計算 ～ ④ダメージ数値確定 ～ ⑤戦闘ダメージの発生
    const atkPoint = attacker.atk;
    const defPoint = (defender.battlePosition === "Attack" ? defender.atk : defender.def) ?? 0;

    if (defender.entityType === "Duelist") {
      attacker.controller.getOpponentPlayer().battleDamage(atkPoint - defPoint, attacker);
    } else {
      // 戦闘ダメージ計算
      if (atkPoint > 0 && atkPoint > defPoint && defender.battlePosition === "Attack") {
        attacker.controller.getOpponentPlayer().battleDamage(atkPoint - defPoint, attacker);
      } else if (atkPoint < defPoint) {
        // 絶対防御将軍が守備表示で攻撃しても反射ダメージが発生するとのこと。
        attacker.controller.battleDamage(defPoint - atkPoint, defender);
      }

      const promiseList: Promise<boolean>[] = [];

      //ダメージ計算時 ⑥戦闘破壊確定 ※被破壊側の永続効果の終了、破壊側（混沌の黒魔術師、ハデスなど）の永続効果の適用
      if (atkPoint > 0 && (atkPoint > defPoint || (atkPoint === defPoint && defender.battlePosition === "Attack"))) {
        promiseList.push(defender.tryDestory("BattleDestroy", attacker.controller, attacker, chainBlockInfo.action));
      }
      if (defender.battlePosition === "Attack" && atkPoint <= defPoint) {
        promiseList.push(attacker.tryDestory("BattleDestroy", attacker.controller, defender, chainBlockInfo.action));
      }

      await Promise.all(promiseList);
    }

    const losers = Object.values(this.duelists).filter((duelist) => duelist.lp <= 0);

    if (losers.length > 0) {
      throw new DuelEnd(
        Object.values(this.duelists)
          .filter((duelist) => !losers.includes(duelist))
          .pop()
      );
    }
  };
  private readonly procBattlePhaseDamageStep4 = async () => {
    this.clock.setStage(this, "afterDmgCalc");
    //ダメージ計算後
    // ダメージ発生、戦闘発生をトリガーとする効果、またはダメージ計算後を直接指定する効果
    while (await this.procChainBlock(undefined, undefined)) {
      //
    }
  };
  private readonly procBattlePhaseDamageStep5 = async () => {
    this.clock.setStage(this, "end");
    // 戦闘破壊・墓地送り実施
    await DuelEntity.waitCorpseDisposal(this);
    // チェーン番号を加算
    this.clock.incrementChainSeq();
    //ダメージステップ終了時
    // 戦闘破壊されて墓地に送られた場合の効果
    while (await this.procChainBlock(undefined, undefined)) {
      //
    }
  };
  private readonly procBattlePhaseEndStep = async () => {
    this.clock.setStep(this, "end");
    this.priorityHolder = this.getTurnPlayer();

    // フェイズ強制処理
    await this.procSpellSpeed1();

    this.moveNextPhase("main2");
  };
  private readonly procEndPhase = async () => {
    // フェイズ強制処理
    await this.procSpellSpeed1();

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

  private readonly procSpellSpeed1 = async () => {
    this.priorityHolder = this.getTurnPlayer();
    let skipCount = 0;

    while (skipCount < 2) {
      this.priorityHolder = this.priorityHolder.getOpponentPlayer();
      const actions = this.getEnableActions(
        this.priorityHolder,
        ["IgnitionEffect", "MandatoryIgnitionEffect", "QuickEffect", "CardActivation"],
        ["Normal", "Quick", "Counter"],
        []
      );

      // 強制効果が残っていて、お互いにキャンセルすることの防止
      const cancelable = actions.every((action) => action.playType !== "MandatoryIgnitionEffect") || skipCount < 2;

      let action = actions.find((action) => action.playType === "MandatoryIgnitionEffect") as ICardAction<unknown> | undefined;

      if (actions.length !== 1 || actions[0].playType !== "MandatoryIgnitionEffect") {
        action = await this.view.waitQuickEffect(
          this.priorityHolder,
          this.getEnableActions(
            this.priorityHolder,
            ["IgnitionEffect", "MandatoryIgnitionEffect", "QuickEffect", "CardActivation"],
            ["Normal", "Quick", "Counter"],
            []
          ),
          [],
          cancelable ? "" : "まだ発動しなければならない効果が残っている。",
          cancelable
        );
      }

      // どちらかのプレイヤーが効果を発動する場合、チェーン処理へ。
      if (action) {
        //チェーンに積んで、チェーン処理へ
        await this.procChainBlock({ activator: this.priorityHolder, action }, undefined);

        // フリーチェーン処理
        await this.procFreeChain();

        // ターンプレイヤーに優先権が戻る
        this.priorityHolder = this.getTurnPlayer();

        skipCount = 0;
        continue;
      }
      skipCount++;
    }
  };

  private readonly procFreeChain = async () => {
    // フリーチェーン処理
    while (await this.procChainBlock(undefined, undefined)) {
      //
    }
  };

  /**
   * チェーンが発生しうる場合の処理
   * @param firstBlock
   * @param triggerEffects
   * @param chainBlockInfos
   * @returns チェーンが発生したかどうか
   */
  private readonly procChainBlock = async (
    firstBlock: { activator: Duelist; action: ICardAction<unknown> } | undefined,
    triggerEffects: { activator: Duelist; action: CardAction<unknown> }[] | undefined
  ): Promise<boolean> => {
    // チェーン開始判定
    const isStartPoint = this.clock.chainBlockSeq === 0;

    //両方のプレイヤーの誘発効果を収集する。
    //    ※誘発効果の収集は一回のみ
    //    ※フェイズ
    let _triggerEffets =
      triggerEffects ??
      Object.values(this.duelists).flatMap((activator) => {
        // この効果の収拾のみ、優先権が移らない。
        return this.getEnableActions(activator, ["MandatoryTriggerEffect", "TriggerEffect"], ["Normal"], []).map((action) => {
          console.log(activator, action);
          return { activator, action };
        });
      });

    // 返却値 チェーンが発生したかどうか
    let result = false;
    // この呼び出しで積むチェーンブロック
    let chainBlock: { activator: Duelist; action: ICardAction<unknown> } | undefined;

    // 起点の効果がある場合、最初に積む。
    if (firstBlock) {
      chainBlock = firstBlock;
      this.priorityHolder = chainBlock.activator;
      result = true;
    } else if (_triggerEffets.length > 0) {
      // 次に誘発効果が存在する場合、まずそちらからチェーンを積む
      const triggerEffect = await this.selectTriggerEffect(_triggerEffets);

      // 誘発効果が選択された場合、積む
      if (triggerEffect) {
        _triggerEffets = _triggerEffets.filter((effect) => effect !== triggerEffect);
        chainBlock = triggerEffect;
        // 誘発効果は優先権を無視してチェーンブロックを積むが、その次のブロックは優先権に従うので都度更新しておく。
        // クイックエフェクトのループの先頭で反転する点に注意
        this.priorityHolder = chainBlock.activator;
        result = true;
      }
    }

    // ここまででチェーンブロックが積まれていない場合、任意効果のクイックエフェクト
    if (!result) {
      // 任意効果のクイックエフェクト
      let skipCount = 0;
      while (skipCount < 2) {
        this.priorityHolder = this.priorityHolder.getOpponentPlayer();

        const spellSpeeds: TSpellSpeed[] = ["Counter"];

        if (this.chainBlockInfos.every((info) => info.action.spellSpeed !== "Counter")) {
          spellSpeeds.push("Quick");
        }

        const msg = this.chainBlockInfos.length ? "" : "クイックエフェクト発動タイミング。効果を発動しますか？";

        const action = await this.view.waitQuickEffect(
          this.priorityHolder,
          this.getEnableActions(this.priorityHolder, ["QuickEffect", "CardActivation"], spellSpeeds, this.chainBlockInfos),
          this.chainBlockInfos,
          msg,
          true
        );

        // どちらかのプレイヤーが効果を発動する場合、チェーン処理へ。
        if (action) {
          chainBlock = { activator: this.priorityHolder, action };
          result = true;
          break;
        }
        skipCount++;
      }
    }

    console.info("selected action: ", chainBlock);

    if (chainBlock) {
      const activator = chainBlock.activator;

      const chainCount = this.clock.chainBlockSeq + 1;

      this.log.info(`チェーン${chainCount}: ${convertCardActionToString(chainBlock.action)}を発動`, activator);

      // コスト処理
      const chainBlockInfo = await chainBlock.action.prepare(activator, chainBlock.action.cell, this.chainBlockInfos, false);

      if (!chainBlockInfo) {
        throw new IllegalCancelError(chainBlock);
      }

      // エフェクト・ヴェーラーなどによる強い無効
      const isNagatedStrongly = chainBlockInfo.action.entity.isNagatedStrongly && playFieldCellTypes.find((ct) => ct === chainBlockInfo.isActivatedIn.cellType);

      // 対象に取っていた場合、ログを出力
      if (chainBlockInfo.selectedEntities.length) {
        this.log.info(`対象⇒${chainBlockInfo.selectedEntities.map((e) => e.toString()).join(" ")}`);
      }

      this._chainBlockInfos.push(chainBlockInfo);

      this.clock.incrementProcSeq();
      this.clock.incrementChainBlockSeq();

      // 再帰実行
      await this.procChainBlock(
        undefined,
        _triggerEffets.filter((e) => e.action.seq !== chainBlock?.action.seq)
      );

      this.log.info(`チェーン${chainCount}: ${convertCardActionToString(chainBlockInfo.action)}の効果処理。`, activator);

      // 有効無効判定
      if (chainBlockInfo.isNegatedActivationBy) {
        // 発動無効時は全ての処理を行わない
        this.log.info(
          `チェーン${chainCount}: ${convertCardActionToString(chainBlock.action)}を${convertCardActionToString(chainBlockInfo.isNegatedActivationBy)}によって発動を無効にした。`,
          chainBlockInfo.activator
        );
      } else {
        // 効果無効時は後処理のみ行う

        // カードの効果が有効かどうか
        let isEffective = chainBlockInfo.action.entity.isEffective;
        let nagationText = `チェーン${chainCount}: カードの効果が無効となっているため${convertCardActionToString(chainBlock.action)}の効果処理を行えない。`;

        if (isEffective) {
          if (chainBlockInfo.isNegatedEffectBy) {
            // うららなどの効果処理のみ無効にするタイプ
            nagationText = `チェーン${chainCount}: ${convertCardActionToString(chainBlockInfo.action)}を${convertCardActionToString(chainBlockInfo.isNegatedEffectBy)}によって効果を無効にした。`;
            isEffective = false;
          } else if (isNagatedStrongly) {
            // 発動時にエフェクト・ヴェーラーなどによる強い無効が適用されていた場合、移動ログを検索する。
            const moveLogRecord = chainBlockInfo.action.entity.moveLog.records.findLast((rec) => rec.face === "FaceDown" && rec.orientation === "Horizontal");

            // 同じチェーン中に、一度以上裏守備を経由していればいいはず
            // TODO 要検討
            isEffective = (moveLogRecord && this.clock.isSameChain(moveLogRecord.movedAt)) ?? false;
          }
        }

        // 有効であれば、効果処理を行う。
        if (isEffective) {
          await chainBlockInfo.action.execute(chainBlockInfo, this.chainBlockInfos);
        } else {
          this.log.info(nagationText, chainBlockInfo.activator);
        }

        // 誓約効果などの適用
        await chainBlock.action.settle(chainBlockInfo, this.chainBlockInfos);
      }

      this.clock.incrementProcSeq();

      if (isStartPoint) {
        // このチェーンでカードの発動を行った、永続類ではない魔法罠を全て墓地送りにする。
        await DuelEntity.sendManyToGraveyardForTheSameReason(
          this._chainBlockInfos
            .filter((info) => info.action.playType === "CardActivation")
            .filter((info) => !info.action.isLikeContinuousSpell)
            .map((info) => info.action.entity)
            .filter((card) => card.isOnField)
            .filter((card) => card.face === "FaceUp"),
          ["Rule"],
          undefined,
          undefined
        );
        // チェーン情報を破棄
        this._chainBlockInfos.reset();
        // チェーン番号を加算。
        this.clock.incrementChainSeq();
      }
    }

    return result;
  };
  private readonly selectTriggerEffect = async (
    triggerEffects: { activator: Duelist; action: CardAction<unknown> }[]
  ): Promise<{ activator: Duelist; action: CardAction<unknown> } | undefined> => {
    // 誘発効果の処理順に従って効果を抽出する。
    if (triggerEffects.length > 0) {
      for (const triggerType of ["MandatoryTriggerEffect", "TriggerEffect"] as TCardActionType[]) {
        for (const activator of [this.getTurnPlayer(), this.getNonTurnPlayer()]) {
          // 誘発効果を抽出
          const effects = triggerEffects.filter((effect) => effect.action.playType === triggerType && effect.activator === activator);

          // なければ次の条件へ
          if (effects.length === 0) {
            continue;
          }

          // 強制効果が残り１の場合、選択をスキップ
          if (effects.length === 1 && triggerType === "MandatoryTriggerEffect") {
            return effects[0];
          }

          // 任意効果の場合、スキップ可能
          const _action = await this.view.waitQuickEffect(
            activator,
            effects.map((obj) => obj.action),
            this.chainBlockInfos,
            "誘発効果を選択。",
            triggerType === "TriggerEffect"
          );

          if (_action) {
            return { activator, action: _action };
          }
        }
      }
    }
  };
  private readonly getEnableActions = (
    duelist: Duelist,
    enableCardPlayTypes: TCardActionType[],
    enableSpellSpeeds: TSpellSpeed[],
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>
  ): CardAction<unknown>[] => {
    return this.field
      .getAllCardEntities()
      .flatMap((entity) => entity.actions)
      .filter((action) => action.executableCells.includes(action.entity.fieldCell.cellType))
      .filter((action) => action.executablePeriods.includes(this.clock.period.key))
      .filter((action) => enableCardPlayTypes.includes(action.playType))
      .filter((action) => enableSpellSpeeds.includes(action.spellSpeed))
      .filter((action) => action.executableDuelists.includes(duelist))
      .filter((action) => action.validate(duelist, chainBlockInfos));
  };
}

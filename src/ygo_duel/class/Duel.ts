import { type IDeckInfo } from "@ygo/class/DeckInfo";
import Duelist, { type TDuelistType } from "@ygo_duel/class/Duelist";
import { type IDuelistProfile } from "@ygo/class/DuelistProfile";
import { DuelField } from "./DuelField";
import DuelLog from "@ygo_duel/class/DuelLog";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelViewController } from "@ygo_duel_view/class/DuelViewController";
import { DuelClock } from "./DuelClock";
import DuelCardActionLog from "./DuelCardActionLog";
import { cardActionNonChainBlockTypes, type CardAction, type ICardAction, type TCardActionType, type TSpellSpeed } from "./DuelCardAction";
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
    super("message");
    this.message = message;
    this.items = items;
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
    this.field = new DuelField(this);

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

    Object.values(this.duelists).forEach(this.field.pushDeck);
    Object.values(this.duelists).forEach((duelist) => duelist.shuffleDeck());
    await Promise.all(Object.values(this.duelists).map(this.field.prepareHands));

    console.log("hoge");
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
    attacker.status.attackCount++;
    this.log.info(`攻撃宣言：${attacker.status.name} ⇒ ${defender.status.name}`, attacker.controller);
  };

  private readonly procDrawPhase = async () => {
    Object.values(this.duelists).forEach((duelist) => {
      duelist.normalSummonCount = 0;
      duelist.specialSummonCount = 0;
    });
    this.log.info("ドローフェイズ開始。", this.getTurnPlayer());
    if (this.clock.turn === 1) {
      this.log.info("先攻プレイヤーはドローできない。", this.getTurnPlayer());
    } else {
      await this.field.draw(this.getTurnPlayer(), 1);
    }
    // TODO フェイズ強制処理
    while (await this.procChainBlock()) {
      //
    }
    this.field.getMonstersOnField().forEach((m) => {
      m.status.attackCount = 0;
      m.status.battlePotisionChangeCount = 0;
    });
    this.moveNextPhase("standby");
  };
  private readonly procStanbyPhase = async () => {
    // TODO フェイズ強制処理

    while (await this.procChainBlock()) {
      //
    }
    this.moveNextPhase("main1");
  };
  private readonly procMainPhase = async () => {
    while (true) {
      this.priorityHolder = this.getTurnPlayer();

      // ユーザー入力を待つ。
      const action = await this.view.waitFieldAction(
        this.getEnableActions(
          ["NormalSummon", "SpellTrapSet", "SpecialSummon", "ChangeBattlePosition", "IgnitionEffect", "QuickEffect", "CardActivation"],
          ["Normal", "Quick", "Counter"]
        ),
        "あなたの手番です。"
      );

      console.log(action);

      // ユーザー入力がカードアクションだった場合、チェーンブロックを作るか作らないかで処理を分ける
      if (action.action) {
        if (([...cardActionNonChainBlockTypes] as string[]).includes(action.action.playType)) {
          //チェーンに乗らない処理を実行し、処理番号をインクリメント
          const prepared = await action.action.prepare(action.action.cell, true);

          if (!prepared) {
            continue;
          }

          await action.action.execute(this.priorityHolder, action.action.cell, prepared);
          this.clock.incrementProcSeq();
        } else {
          console.log(action);
          //チェーンに積んで、チェーン処理へ
          await this.procChainBlock(action.action);
        }
        while (await this.procChainBlock()) {
          //
        }
        continue;
      }

      const nextPhase = action.phaseChange;
      // フェイズ移行前に、相手に優先権が移る。
      if (nextPhase) {
        this.priorityHolder = this.getNonTurnPlayer();
        const action = await this.view.waitQuickEffect(this.getEnableActions(["QuickEffect", "TriggerEffect"], ["Quick", "Counter"]), "", true);

        // 相手が行動した場合、フェイズ移行はキャンセル。
        if (action) {
          this.procChainBlock();
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
    while (await this.procChainBlock()) {
      //
    }
  };
  private readonly procBattlePhaseBattleStep = async () => {
    while (true) {
      this.phaseStep = "battle";
      this.priorityHolder = this.getTurnPlayer();
      const action = await this.view.waitFieldAction(this.getEnableActions(["Battle"], ["Normal"]), "攻撃モンスターと対象を選択。");

      console.log(action);
      if (action.phaseChange) {
        //エンドステップへ（※優先権の移動はない）
        break;
      }
      if (action.action) {
        //チェーンに乗らない処理を実行し、処理番号をインクリメント
        await action.action.execute(this.priorityHolder, action.action.cell);
        this.clock.incrementProcSeq();

        //フリーチェーン処理へ
        while (await this.procChainBlock()) {
          //
        }

        //ダメージステップ処理へ
        this.clock.incrementStepSeq();
        await this.procBattlePhaseDamageStep();
      }
    }
    this.clock.incrementStepSeq();
  };
  private readonly procBattlePhaseDamageStep = async () => {
    this.phaseStep = "damage";
    const attacker = this.attackingMonster;
    const defender = this.targetForAttack;

    if (!attacker || !attacker.atk) {
      throw new SystemError("想定されない状態", this.attackingMonster, this.targetForAttack);
    }

    //ダメージステップ開始時
    this.log.info("ダメージステップ開始時", this.getTurnPlayer());
    //TODO エフェクト処理

    //ダメージ計算前
    this.log.info("ダメージ計算前", this.getTurnPlayer());
    if (defender?.battlePotion === "Set") {
      defender.setBattlePosition("Defense");
    }
    //TODO エフェクト処理

    //ダメージ計算時
    this.log.info("ダメージ計算時", this.getTurnPlayer());
    //TODO エフェクト処理

    //ダメージ計算
    const atkPoint = attacker.atk;
    const defPoint = (defender?.battlePotion === "Attack" ? defender.atk : defender?.def) || 0;
    if (!defender || defender.entityType === "Duelist") {
      attacker.controller.getOpponentPlayer().battleDamage(atkPoint - defPoint, attacker);
    } else if (atkPoint > 0 && atkPoint > defPoint) {
      if (defender.battlePotion === "Attack") {
        attacker.controller.getOpponentPlayer().battleDamage(atkPoint - defPoint, attacker);
      }
      defender.isDying = true;
    } else if (atkPoint < defPoint) {
      // 絶対防御将軍が守備表示で攻撃しても反射ダメージが発生するとのこと。
      attacker.controller.battleDamage(defPoint - atkPoint, defender);
      if (defender.battlePotion === "Attack") {
        attacker.isDying = true;
      }
    } else if (atkPoint === defPoint && defender.battlePotion === "Attack") {
      attacker.isDying = true;
      defender.isDying = true;
    }

    const losers = Object.values(this.duelists).filter((duelist) => duelist.lp <= 0);

    if (losers.length > 0) {
      throw new DuelEnd(
        Object.values(this.duelists)
          .filter((duelist) => !losers.includes(duelist))
          .pop()
      );
    }

    // 破壊が確定していたモンスターは墓地に送られる。
    if (attacker.isDying) {
      await this.field.destroyMany([attacker], ["BattleDestroy"], defender);
    }
    if (defender?.isDying) {
      await this.field.destroyMany([defender], ["BattleDestroy"], attacker);
    }

    //ダメージ計算後
    this.log.info("ダメージ計算後", this.getTurnPlayer());
    //TODO エフェクト処理

    //ダメージステップ終了時
    this.log.info("ダメージステップ終了時", this.getTurnPlayer());

    //TODO エフェクト処理

    this.clock.incrementStepSeq();
  };
  private readonly procBattlePhaseEndStep = async () => {
    this.phaseStep = "end";
    this.priorityHolder = this.getTurnPlayer();

    // TODO ステップ強制処理
    while (await this.procChainBlock()) {
      //
    }
    this.moveNextPhase("main2");
  };
  private readonly procEndPhase = async () => {
    // TODO フェイズ強制処理
    while (await this.procChainBlock()) {
      //
    }
    while (true) {
      const hand = this.getTurnPlayer().getHandCell();
      const qty = hand.cardEntities.length;
      if (qty < 7) {
        break;
      }
      await this.field.discard(this.getTurnPlayer(), qty - 6, ["Rule"]);
      // TODO トリガー効果のみ発動可能
    }

    // このタイミングではフリーチェーンを発動できない。

    this.moveNextPhase("draw");
    return;
  };

  /**
   * チェーンが発生しうる場合の処理
   */
  private readonly procChainBlock = async (action?: ICardAction<unknown>, triggerEffects?: ICardAction<unknown>[]): Promise<boolean> => {
    // チェーン開始判定
    const isStartPoint = this.clock.chainBlockSeq === 0;

    let chainBlock: ICardAction<unknown> | undefined;

    console.log(triggerEffects?.length);

    //両方のプレイヤーの誘発効果を収集する。
    let _triggerEffets =
      triggerEffects ??
      Object.values(this.duelists).flatMap((duelist) => {
        this.priorityHolder = duelist;
        return this.getEnableActions(["TriggerMandatoryEffect", "TriggerEffect"], ["Normal"]);
      });

    console.log(_triggerEffets.length);

    try {
      // 起点の効果がある場合、最初に積む。
      if (action) {
        chainBlock = action;

        return true;
      }

      //誘発効果が存在する場合、まずそちらからチェーンを積む
      if (_triggerEffets.length > 0) {
        const triggerEffect = await this.selectTriggerEffect(_triggerEffets);

        // 誘発効果が選択された場合、次のチェーンを積みに行く
        if (triggerEffect) {
          console.log(_triggerEffets.length);

          _triggerEffets = _triggerEffets.filter((effect) => effect !== triggerEffect);
          console.log(_triggerEffets.length);

          chainBlock = triggerEffect;
          return true;
        }
      }

      // 任意効果のクイックエフェクト
      let skipCount = 0;
      while (skipCount < 2) {
        this.priorityHolder = this.priorityHolder.getOpponentPlayer();
        const action = await this.view.waitQuickEffect(
          this.getEnableActions(["QuickEffect"], ["Normal", "Quick", "Counter"]),
          "クイックエフェクト発動タイミング。効果を発動しますか？",
          true
        );

        // どちらかのプレイヤーが効果を発動する場合、チェーン処理へ。
        if (action) {
          chainBlock = action;
          return true;
        }
        skipCount++;
      }
      return false;
    } finally {
      console.log(chainBlock);

      if (chainBlock) {
        // この時点のコントローラーが効果処理を行う
        const activater = chainBlock.entity.controller;
        if (chainBlock.playType === "CardActivation") {
          this.log.info(`${chainBlock.entity.nm}を発動`, activater);
        } else {
          this.log.info(`${chainBlock.entity.nm}«${chainBlock.title}»を発動`, activater);
        }
        const prepared = await chainBlock.prepare(chainBlock.cell);

        this.clock.incrementProcSeq();
        this.clock.incrementChainBlockSeq();
        await this.procChainBlock(
          undefined,
          _triggerEffets.filter((e) => e.seq !== chainBlock?.seq)
        );
        this.log.info(`${chainBlock.entity.nm}«${chainBlock.title}»の効果処理`, activater);

        await chainBlock.execute(activater, chainBlock.cell, prepared);
        this.clock.incrementProcSeq();
        if (isStartPoint) {
          await Promise.all(
            this.field
              .getAllCells()
              .filter((c) => c.cellType === "SpellAndTrapZone")
              .flatMap((c) => c.entities)
              .filter((e) => e.isDying)
              .map((e) => e.sendGraveyard(["Rule"]))
          );
          this.clock.incrementChainSeq();
        }
      }
    }
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
  private readonly getEnableActions = (enableCardPlayTypes: TCardActionType[], enableSpellSpeeds: TSpellSpeed[]): CardAction<unknown>[] => {
    return this.field
      .getAllCardEntities()
      .filter((entity) => entity.controller === this.priorityHolder)
      .flatMap((entity) => entity.actions)
      .filter((action) => action.executableCells.includes(action.entity.fieldCell.cellType))
      .filter((action) => enableCardPlayTypes.includes(action.playType))
      .filter((action) => enableSpellSpeeds.includes(action.spellSpeed))
      .filter((action) => action.validate());
  };
}

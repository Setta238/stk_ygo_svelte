import {} from "@ygo_duel/class/DuelistShortHands";
import { type IDeckInfo } from "@ygo/class/DeckInfo";
import { Duelist, type TDuelistType } from "@ygo_duel/class/Duelist";
import { type IDuelistProfile } from "@ygo/class/DuelistProfile";
import { DuelField } from "./DuelField";
import DuelLog from "@ygo_duel/class/DuelLog";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelViewController } from "@ygo_duel_view/class/DuelViewController";
import { DuelClock, type IDuelClock } from "./DuelClock";
import DuelChainBlockLog from "./DuelChainBlockLog";
import {
  cardActionChainBlockTypes,
  cardActionNonChainBlockTypes,
  cardActionRuleSummonTypes,
  type CardAction,
  type ChainBlockInfo,
  type ICardAction,
  type TCardActionType,
  type TSpellSpeed,
} from "./DuelCardAction";
import type { TDuelPhase } from "./DuelPeriod";
import { DuelEntityShortHands } from "./DuelEntityShortHands";
export const duelStartModes = ["PlayFirst", "DrawFirst", "Random"] as const;
export type TDuelStartMode = (typeof duelStartModes)[number];
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
  public readonly chainBlockLog: DuelChainBlockLog;
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
    this.clock.onProcSeqChange.append(this.distributeOperators);
    this.clock.onStageChange.append(this.executeSystemPeriodActions);

    this.view = new DuelViewController(this);
    this.log = new DuelLog(this);
    this.chainBlockLog = new DuelChainBlockLog(this);
  }

  public readonly distributeOperators = (clock: IDuelClock) => {
    console.info(`[totalProcSeq]:${clock.totalProcSeq}`);
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

      if (!this.field.numericStateOperatorPool.distributeAll(this)) {
        continue;
      }

      // これは最後で良い。
      if (!this.field.summonFilterPool.distributeAll(this)) {
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

    // 下の三行はまとめても良いが、ログ的に交互にやったほうがそれっぽいのでこのままにする。
    for (const duelist of Object.values(this.duelists)) {
      duelist.pushDeck();
      duelist.getDeckCell().shuffle();
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
      await duelist.draw(5 - duelist.getHandCell().cardEntities.length, undefined, undefined);
    }

    this.log.info(`【デュエル開始】${this.firstPlayer.profile.name} V.S. ${this.secondPlayer.profile.name}`);
    this.log.info(`先攻：${this.firstPlayer.profile.name} 後攻：${this.secondPlayer.profile.name}`);
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
    let def = " (" + (defender.battlePosition === "Attack" ? defender.atk : defender.def)?.toString() + ")";
    if (defender.face === "FaceDown") {
      def = " (????)";
    }

    if (defender.entityType === "Duelist") {
      def = "";
    }

    attacker.info.attackCount++;
    this.log.info(`攻撃宣言：${attacker.toString()} (${attacker.atk})⇒ ${defender.toString()}${def}`, attacker.controller);
  };

  private readonly procDrawPhase = async () => {
    Object.values(this.duelists).forEach((duelist) => duelist.initForDrawPhase());
    this.log.info("ドローフェイズ開始。", this.getTurnPlayer());
    if (this.clock.turn === 1) {
      this.log.info("先攻プレイヤーはドローできない。", this.getTurnPlayer());
    } else {
      await this.getTurnPlayer().draw(1, undefined, undefined);
    }
    this.field.getCardsOnField().forEach((m) => m.initForTurn());
    // フェイズ強制処理
    await this.procSpellSpeed1();
    this.moveNextPhase("standby");
  };
  private readonly procStanbyPhase = async () => {
    // フェイズ強制処理
    await this.procSpellSpeed1();

    this.moveNextPhase("main1");
  };
  private readonly procMainPhase = async () => {
    while (true) {
      this.priorityHolder = this.getTurnPlayer();

      // ユーザー入力を待つ。
      const response = await this.view.waitFieldAction(
        this.getEnableActions(
          this.priorityHolder,
          ["NormalSummon", "SpellTrapSet", "SpecialSummon", "FlipSummon", "ChangeBattlePosition", "IgnitionEffect", "QuickEffect", "CardActivation"],
          ["Normal", "Quick", "Counter"],
          []
        )
      );

      // ユーザー入力がカードアクションだった場合、チェーンブロックを作るか作らないかで処理を分ける
      if (response && response.action) {
        if (([...cardActionNonChainBlockTypes] as string[]).includes(response.action.playType)) {
          //チェーンに乗らない処理を実行し、処理番号をインクリメント
          const chainBlockInfo = await response.action.prepare(this.priorityHolder, response.action.cell, undefined, [], true, false);

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

    // フェイズ強制処理
    await this.procSpellSpeed1();
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
        const info = await response.action.prepare(this.priorityHolder, response.action.cell, undefined, [], true, false);
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

    if (this.targetForAttack.entityType !== "Duelist" && !this.targetForAttack.isOnFieldAsMonster) {
      console.log("想定されない状態", this.attackingMonster, this.targetForAttack);
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
      chainBlockInfo.activator.writeInfoLog(`ダメージ計算：${attacker.toString()} (${atkPoint}) ⇒ ${defender.toString()}`);
      attacker.controller.getOpponentPlayer().battleDamage(atkPoint - defPoint, attacker);
    } else {
      chainBlockInfo.activator.writeInfoLog(`ダメージ計算：${attacker.toString()} (${atkPoint}) ⇒ ${defender.toString()} (${defPoint})`);
      // 戦闘ダメージ計算
      if (atkPoint > 0 && atkPoint > defPoint && defender.battlePosition === "Attack") {
        attacker.controller.getOpponentPlayer().battleDamage(atkPoint - defPoint, attacker);
      } else if (atkPoint < defPoint) {
        // 絶対防御将軍が守備表示で攻撃しても反射ダメージが発生するとのこと。
        attacker.controller.battleDamage(defPoint - atkPoint, defender);
      }

      //ダメージ計算時 ⑥戦闘破壊確定
      // ※被破壊側の永続効果の終了、破壊側（混沌の黒魔術師、ハデスなど）の永続効果の適用
      // ※墓地送りはprocBattlePhaseDamageStep5で行う。
      if (atkPoint > 0 && (atkPoint > defPoint || (atkPoint === defPoint && defender.battlePosition === "Attack"))) {
        await DuelEntityShortHands.tryMarkForDestory([defender], chainBlockInfo);
      }
      if (defender.battlePosition === "Attack" && atkPoint <= defPoint) {
        await DuelEntityShortHands.tryMarkForDestory([attacker], chainBlockInfo);
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
    console.log(this.clock.period.key, this.clock.toString());
    // 戦闘破壊・墓地送り実施
    await DuelEntity.waitCorpseDisposal(this);
    console.log(this.clock.period.key, this.clock.toString());

    // チェーン番号を加算
    this.clock.incrementChainSeq();
    console.log(this.clock.period.key, this.clock.toString());

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
    // ターンプレイヤーから処理を行う
    this.priorityHolder = this.getTurnPlayer();

    // 強制効果が処理し終わり、お互いにキャンセルしたら終了
    let skipCount = 0;

    const mandatoryCount: { [seat in TSeat]: number } = {
      Above: Number.MAX_VALUE,
      Below: Number.MAX_VALUE,
    };

    while (Object.values(mandatoryCount).some((count) => count !== 0)) {
      // 優先権保持者の可能な処理をリストアップ
      const actions = this.getEnableActions(
        this.priorityHolder,
        ["IgnitionEffect", "QuickEffect", "CardActivation", "LingeringEffect"],
        ["Normal", "Quick", "Counter"],
        []
      );

      mandatoryCount[this.priorityHolder.seat] = actions.filter((action) => action.isMandatory).length;

      // 強制効果を適当にピックアップしておく
      let action = actions.find((action) => action.isMandatory);

      // 強制効果が残っていて、お互いにキャンセルすることの防止
      let cancelable = Boolean(!action);

      if (this.priorityHolder.isTurnPlayer) {
        if (skipCount === 0) {
          cancelable = true;
        }
      } else {
        if (mandatoryCount[this.priorityHolder.getOpponentPlayer().seat] >= 0) {
          cancelable = true;
        }
      }

      // 0件または強制効果1件のときのみ効果選択をスキップ
      // TODO 強制効果1件のときも一回まではキャンセルできるので、考慮が必要。
      if (actions.length && (actions.length > 1 || !action)) {
        action = await this.view.waitQuickEffect(
          this.priorityHolder,
          actions,
          [],
          cancelable ? "" : "まだ発動しなければならない効果が残っている。",
          cancelable
        );
      }

      // どちらかのプレイヤーが効果を発動する場合、チェーン処理へ。
      if (action) {
        if (cardActionChainBlockTypes.some((tp) => tp === action.playType)) {
          //チェーンに積んで、チェーン処理へ
          await this.procChainBlock({ activator: this.priorityHolder, action }, undefined);
        } else {
          const info = await action.prepare(this.priorityHolder, undefined, undefined, [], true, false);
          if (!info) {
            continue;
          }
          await action.execute(info, []);
          await action.settle(info, []);
          this.clock.incrementChainSeq();
        }

        // フリーチェーン処理
        await this.procFreeChain();

        // ターンプレイヤーに優先権が戻る
        this.priorityHolder = this.getTurnPlayer();

        skipCount = 0;
        continue;
      }
      this.priorityHolder = this.priorityHolder.getOpponentPlayer();
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
    triggerEffects: { activator: Duelist; action: CardAction<unknown>; targetChainBlock: ChainBlockInfo<unknown> | undefined }[] | undefined
  ): Promise<boolean> => {
    // チェーン開始判定
    const isStartPoint = this.chainBlockInfos.length === 0;

    // 起点となる効果がない場合、両方のプレイヤーのトリガーエフェクトを収集する。
    //    ※トリガーエフェクトの収集はタイミングごとに一回のみ
    //    ※フェイズのトリガーエフェクトは起動効果として設定しているのでここでは収集しない。
    let _triggerEffets = firstBlock
      ? []
      : (triggerEffects ??
        Object.values(this.duelists).flatMap((activator) => {
          // この効果の収拾のみ、優先権が移らない。
          return this.getEnableActions(activator, ["TriggerEffect"], [this.chainBlockInfos.length ? "Quick" : "Normal"], this.chainBlockInfos).map((action) => {
            return { activator, action, targetChainBlock: this.chainBlockInfos.slice(-1)[0] };
          });
        }));

    // 返却値 チェーンが発生したかどうか
    let result = false;
    // この呼び出しで積むチェーンブロック
    let chainBlock: { activator: Duelist; action: ICardAction<unknown>; targetChainBlock: ChainBlockInfo<unknown> | undefined } | undefined;

    // 起点の効果がある場合、最初に積む。
    if (firstBlock) {
      chainBlock = { ...firstBlock, targetChainBlock: undefined };
      this.priorityHolder = chainBlock.activator;
      result = true;
    } else if (_triggerEffets.length > 0) {
      // 次にトリガーエフェクトが存在する場合、まずそちらからチェーンを積む
      const triggerEffect = await this.selectTriggerEffect(_triggerEffets);

      // トリガーエフェクトが選択された場合、積む
      if (triggerEffect) {
        _triggerEffets = _triggerEffets.filter((effect) => effect !== triggerEffect);
        chainBlock = triggerEffect;
        // トリガーエフェクトは優先権を無視してチェーンブロックを積むが、その次のブロックは優先権に従うので都度更新しておく。
        // クイックエフェクトのループの先頭で反転する点に注意
        this.priorityHolder = chainBlock.activator;
        result = true;
      } else {
        // トリガーエフェクトが選択されなかった場合、リストをリセットする。
        _triggerEffets = [];
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

        const msg = this.chainBlockInfos.length ? "※メッセージ考え中※" : "クイックエフェクト発動タイミング。効果を発動しますか？";

        const action = await this.view.waitQuickEffect(
          this.priorityHolder,
          this.getEnableActions(this.priorityHolder, ["QuickEffect", "CardActivation"], spellSpeeds, this.chainBlockInfos),
          this.chainBlockInfos,
          msg,
          true
        );

        // どちらかのプレイヤーが効果を発動する場合、チェーン処理へ。
        if (action) {
          chainBlock = { activator: this.priorityHolder, action, targetChainBlock: this.chainBlockInfos.slice(-1)[0] };
          result = true;
          // トリガーエフェクトが選択されなかった場合、リストをリセットする。
          break;
        }
        skipCount++;
      }
    }

    console.info("selected action: ", chainBlock);

    if (chainBlock) {
      const activator = chainBlock.activator;

      // コスト処理
      const chainBlockInfo = await chainBlock.action.prepare(
        activator,
        chainBlock.action.cell,
        chainBlock.targetChainBlock,
        this.chainBlockInfos,
        false,
        false
      );

      if (!chainBlockInfo) {
        throw new IllegalCancelError(chainBlock);
      }

      this.chainBlockLog.push(chainBlockInfo);

      // エフェクト・ヴェーラーなどに発動場所を参照する無効を処理するため、この時点の情報をコピー
      const enableCellTypes = [...chainBlockInfo.action.entity.info.isEffectiveIn];

      this._chainBlockInfos.push(chainBlockInfo);

      this.clock.incrementProcSeq();
      this.clock.incrementChainBlockSeq();

      // ★★★★★ 再帰実行 ★★★★★
      //   ※
      await this.procChainBlock(undefined, _triggerEffets.length ? _triggerEffets.filter((e) => e.action.seq !== chainBlock?.action.seq) : undefined);

      if (chainBlockInfo.chainNumber) {
        this.log.info(`チェーン${chainBlockInfo.chainNumber}: ${chainBlockInfo.action.toString()}の効果処理。`, activator);
      }

      // 有効無効判定
      if (chainBlockInfo.isNegatedActivationBy) {
        // 発動無効時は全ての処理を行わない
        if (chainBlockInfo.chainNumber) {
          this.log.info(
            `チェーン${chainBlockInfo.chainNumber}: ${chainBlockInfo.action.toString()}を${chainBlockInfo.action.toString()}によって発動を無効にした。`,
            chainBlockInfo.activator
          );
        }
      } else {
        // 効果無効時は後処理のみ行う

        // カードの効果が有効かどうか
        let isEffective = chainBlockInfo.action.entity.isEffective;

        // ログ出力するテキストを用意
        let nagationText = "";

        if (isEffective) {
          if (chainBlockInfo.isNegatedEffectBy) {
            // うららなどの効果処理のみ無効にするタイプ
            nagationText = `チェーン${chainBlockInfo.chainNumber}: ${chainBlockInfo.action.toString()}を${chainBlockInfo.action.toString()}によって効果を無効にした。`;
            isEffective = false;
          } else if (!enableCellTypes.includes(chainBlockInfo.isActivatedIn.cellType)) {
            // 発動時にエフェクト・ヴェーラーなどに発動場所を参照する無効が適用されていた場合、移動ログを検索する。
            const moveLogRecord = chainBlockInfo.action.entity.moveLog.records.findLast((rec) => rec.face === "FaceDown" && rec.orientation === "Horizontal");

            // 同じチェーン中に、一度以上裏守備を経由していればいいはず
            // TODO 要検討
            isEffective = (moveLogRecord && this.clock.isSameChain(moveLogRecord.movedAt)) ?? false;
          }
        }

        // 有効であれば、効果処理を行う。
        if (isEffective) {
          await chainBlockInfo.action.execute(chainBlockInfo, this.chainBlockInfos);
          chainBlockInfo.state = "done";
        } else {
          chainBlockInfo.state = "failed";
          if (chainBlockInfo.chainNumber) {
            nagationText =
              nagationText ||
              `チェーン${chainBlockInfo.chainNumber}: カードの効果が無効となっているため${chainBlockInfo.action.toString()}の効果処理を行えない。`;
          }

          this.log.info(nagationText, chainBlockInfo.activator);
        }

        // 誓約効果などの適用
        await chainBlock.action.settle(chainBlockInfo, this.chainBlockInfos);
      }

      console.log(this.clock.totalProcSeq);
      this.clock.incrementChainBlockSeq();
      console.log(this.clock.totalProcSeq);

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

        if (chainBlockInfo.nextAction) {
          // ★★★★★ 再帰実行 ★★★★★
          //   ※ 緊急同調など、直後にチェーンに乗らない特殊召喚を行う場合。チェーン１の場合、では昇天の角笛を発動できる。
          //   ※ ！重要！ チェーン番号は同じまま進める。このチェーンが終わったあとに、誘発効果の収拾を行うため。
          await this.procChainBlock({ activator: chainBlockInfo.activator, action: chainBlockInfo.nextAction }, undefined);
        }
        // チェーン番号を加算。
        this.clock.incrementChainSeq();
      } else if (chainBlockInfo.nextAction) {
        // ※ 緊急同調など、直後にチェーンに乗らない特殊召喚を行う場合
        await chainBlockInfo.nextAction.directExecute(chainBlockInfo.activator, false);
      }
    }

    return result;
  };
  private readonly selectTriggerEffect = async (
    triggerEffects: { activator: Duelist; action: CardAction<unknown>; targetChainBlock: ChainBlockInfo<unknown> | undefined }[]
  ): Promise<{ activator: Duelist; action: CardAction<unknown>; targetChainBlock: ChainBlockInfo<unknown> | undefined } | undefined> => {
    // トリガーエフェクトの処理順に従って効果を抽出する。
    if (triggerEffects.length > 0) {
      for (const isMandatory of [true, false]) {
        for (const activator of [this.getTurnPlayer(), this.getNonTurnPlayer()]) {
          // トリガーエフェクトを抽出
          const effects = triggerEffects.filter((effect) => effect.action.isMandatory === isMandatory && effect.activator === activator);

          // なければ次の条件へ
          if (effects.length === 0) {
            continue;
          }

          // 強制効果が残り１の場合、選択をスキップ
          if (effects.length === 1 && isMandatory) {
            return effects[0];
          }

          // 任意効果の場合、スキップ可能
          const _action = await this.view.waitQuickEffect(
            activator,
            effects.map((obj) => obj.action),
            this.chainBlockInfos,
            "トリガーエフェクトを選択。",
            !isMandatory
          );

          if (_action) {
            return effects.find((effect) => effect.action === _action);
          }
        }
      }
    }
  };
  private readonly executeSystemPeriodActions = (): void => {
    Object.values(this.duelists).flatMap((duelist) =>
      this.getEnableActions(duelist, ["SystemPeriodAction"], ["Normal"], []).map((action) => {
        return { duelist, action };
      })
    );
  };
  private readonly getEnableActions = (
    duelist: Duelist,
    enableCardPlayTypes: TCardActionType[],
    enableSpellSpeeds: TSpellSpeed[],
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>
  ): CardAction<unknown>[] => {
    const negateSummonOnly = cardActionRuleSummonTypes.some((type) => type === chainBlockInfos.slice(-1)[0]?.action.playType);

    return this.field
      .getAllCardEntities()
      .flatMap((entity) => entity.actions)
      .filter((action) => action.negateSummon || !negateSummonOnly)
      .filter((action) => action.executableCells.includes(action.entity.fieldCell.cellType))
      .filter((action) => action.executablePeriods.includes(this.clock.period.key))
      .filter((action) => enableCardPlayTypes.includes(action.playType))
      .filter((action) => enableSpellSpeeds.includes(action.spellSpeed))
      .filter((action) => action.validateDuelist(duelist))
      .filter((action) => action.validate(duelist, chainBlockInfos, false));
  };
}

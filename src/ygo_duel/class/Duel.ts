import { generateCardDefinitions } from "./DuelEntityDefinition";
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
  type EntityAction,
  type ChainBlockInfo,
  type TCardActionType,
  type TSpellSpeed,
  type ValidatedActionInfo,
  cardActionCreateChainTypes,
} from "./DuelEntityAction";
import type { TDuelPhase } from "./DuelPeriod";
import { DuelEntityShortHands } from "./DuelEntityShortHands";
import { StkEvent } from "@stk_utils/class/StkEvent";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { type DuelFieldCell } from "./DuelFieldCell";
import type { EntityDefinition } from "./DuelEntityDefinition";
export const duelStartModes = ["PlayFirst", "DrawFirst", "Random"] as const;
export type TDuelStartMode = (typeof duelStartModes)[number];
export const duelStartModeDic: { [key in TDuelStartMode]: string } = {
  PlayFirst: "先攻",
  DrawFirst: "後攻",
  Random: "ランダム",
};
export const seats = ["Above", "Below"] as const;
export type TSeat = (typeof seats)[number];

export type ResponseActionInfo = {
  action: EntityAction<unknown>;
  dest?: DuelFieldCell;
  battlePosition?: TBattlePosition;
  originSeq: number;
};

export type DuelistResponse = {
  phaseChange?: TDuelPhase;
  selectedEntities?: DuelEntity[];
  sendMessage?: string;
  actionInfo?: ResponseActionInfo;
  cancel?: boolean;
  surrender?: boolean;
};

export class DuelEnd extends Error {
  public readonly winner: Duelist | undefined;
  public readonly message: string;
  public constructor(winner: Duelist | undefined, message: string) {
    super(winner ? `デュエルが終了した。勝者：${winner.profile.name}` : "デュエルが終了した。ドロー。");
    this.winner = winner;
    this.message = message;
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
  private onDuelEndEvent = new StkEvent<void>();
  public get onDuelEnd() {
    return this.onDuelEndEvent.expose();
  }
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
  public winner: Duelist | undefined;
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

      // 以下2つは最後で良い。
      if (!this.field.summonFilterPool.distributeAll(this)) {
        continue;
      }
      if (!this.field.damageFilterPool.distributeAll(this)) {
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

    const cardDefinitionsDic = generateCardDefinitions(
      ...Object.values(this.duelists)
        .flatMap((duelist) => duelist.deckInfo.cardNames)
        .getDistinct()
    ).reduce(
      (wip, definition) => {
        wip[definition.name] = definition;
        return { ...wip };
      },
      {} as { [name: string]: EntityDefinition }
    );

    for (const duelist of Object.values(this.duelists)) {
      duelist.pushDeck(cardDefinitionsDic);
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

    try {
      // エクゾディア判定
      for (const duelist of Object.values(this.duelists)) {
        for (const afterChainBlockEffect of this.getEnableActions(duelist, ["Exodia"], ["Normal"], [])) {
          await afterChainBlockEffect.action.directExecute(duelist, undefined, false);
        }
      }
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
        this.clock.incrementChainSeq();
        console.info(error);
        this.isEnded = true;
        this.winner = error.winner;
        this.log.info(error.winner ? `デュエル終了。勝者${error.winner.profile.name}。${error.message}` : `デュエル終了。引き分け。${error.message}`);
        this.onDuelEndEvent.trigger();
      } else if (error instanceof Error) {
        this.log.error(error);
      }
    } finally {
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
      // エクゾディア判定
      for (const afterChainBlockEffect of this.getEnableActions(this.getTurnPlayer(), ["Exodia"], ["Normal"], [])) {
        await afterChainBlockEffect.action.directExecute(this.getTurnPlayer(), undefined, false);
      }
    }
    this.field.getCardsOnFieldStrictly().forEach((m) => m.initForTurn());
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

      if (response.actionInfo) {
        // ユーザー入力がカードアクションだった場合、チェーン処理へ
        const result = await this.procChain({ activator: this.priorityHolder, actionInfo: response.actionInfo }, undefined);
        if (result === "cancel") {
          continue;
        }

        await this.procFreeChain();

        continue;
      }

      const nextPhase = response.phaseChange;
      // フェイズ移行前に、相手に優先権が移る。
      if (nextPhase) {
        this.priorityHolder = this.getNonTurnPlayer();
        let result = "done" as "done" | "pass" | "cancel";
        while (true) {
          const actionInfo = await this.view.waitQuickEffect(
            this.priorityHolder,
            this.getEnableActions(this.priorityHolder, ["QuickEffect", "CardActivation"], ["Quick", "Counter"], []),
            [],
            `相手がフェイズを終了しようとしている。`,
            true
          );

          // 相手が行動した場合、フェイズ移行はキャンセル。
          if (!actionInfo) {
            this.moveNextPhase(nextPhase);
            return;
          }
          result = await this.procChain({ activator: this.priorityHolder, actionInfo }, undefined);
          if (result === "done") {
            break;
          }
        }
        if (result === "done") {
          await this.procFreeChain();
          continue;
        }
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
      if (response.actionInfo) {
        const info = await response.actionInfo.action.prepare(this.priorityHolder, response.actionInfo.dest, undefined, [], true, false);
        if (!info) {
          continue;
        }
        //チェーンに乗らない処理を実行し、処理番号をインクリメント
        await response.actionInfo.action.execute(info, []);
        this.clock.incrementChainSeq();

        let damageStepFlg = true;
        let rollbackFlg = false;

        while (true) {
          // 巻き戻し計算のために値を控える。
          const oldTotalProcSeq = this.clock.totalProcSeq;
          const oldMonsters = this.getNonTurnPlayer().getMonstersOnField();

          //フリーチェーン処理。
          //一回のチェーンごとに、戦闘可否判定を行い、否であればループを抜ける。
          while (damageStepFlg) {
            const procChainResult = await this.procChain(undefined, undefined);
            if (!this.attackingMonster) {
              throw new SystemError("想定されない状態");
            }

            if (!this.attackingMonster.isOnFieldStrictly) {
              this.log.info(`${this.attackingMonster.toString()}がフィールドにいなくなったため、戦闘が中断された。`);
              damageStepFlg = false;
            } else if (this.attackingMonster.face === "FaceDown") {
              this.log.info(`${this.attackingMonster.toString()}が裏側守備表示になったため、戦闘が中断された。`);
              damageStepFlg = false;
            } else if (this.attackingMonster.orientation === "Horizontal") {
              // TODO 絶対防御将軍などの考慮
              this.log.info(`${this.attackingMonster.toString()}が守備表示になったため、戦闘が中断された。`);
              damageStepFlg = false;
            } else if (
              oldMonsters.some((monster) => !monster.isOnFieldAsMonsterStrictly) ||
              this.getNonTurnPlayer()
                .getMonstersOnField()
                .flatMap((monster) => monster.moveLog.records)
                .filter((record) => record.movedAt.totalProcSeq > oldTotalProcSeq)
                .some((record) => !record.cell.isMonsterZoneLikeCell)
            ) {
              this.log.info(`モンスターの数が増減したためバトルステップの巻き戻しが発生。`);
              this.targetForAttack = await this.getTurnPlayer().waitSelectEntity(this.attackingMonster.getAttackTargets(), "攻撃対象を選択。", true);
              rollbackFlg = true;
              break;
            }
            if (procChainResult === "pass") {
              break;
            }
          }
          if (rollbackFlg) {
            continue;
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

    if (this.targetForAttack.entityType !== "Duelist" && !this.targetForAttack.isOnFieldAsMonsterStrictly) {
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
    await this.procSpellSpeed1();
  };
  private readonly procBattlePhaseDamageStep2 = async (attacker: DuelEntity, defender: DuelEntity) => {
    this.clock.setStage(this, "beforeDmgCalc");
    //ダメージ計算前 ※裏側守備表示モンスターを表にする
    if (defender?.battlePosition === "Set") {
      defender.setBattlePosition("Defense", ["Flip", "FlipByBattle"], attacker, attacker.controller);
    }
    //TODO 「ライトロード・モンク エイリン」「ドリルロイド」等、
    await this.procSpellSpeed1();
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
    await this.procSpellSpeed1();

    //ダメージ計算時③ダメージ計算 ～ ④ダメージ数値確定 ～ ⑤戦闘ダメージの発生
    const atkPoint = attacker.atk;
    const defPoint = (defender.battlePosition === "Attack" ? defender.atk : defender.def) ?? 0;

    if (defender.entityType === "Duelist") {
      chainBlockInfo.activator.writeInfoLog(`ダメージ計算：${attacker.toString()} (${atkPoint}) ⇒ ${defender.toString()}`);
      attacker.controller.getOpponentPlayer().battleDamage(atkPoint - defPoint, attacker, defender, chainBlockInfo);
    } else {
      chainBlockInfo.activator.writeInfoLog(`ダメージ計算：${attacker.toString()} (${atkPoint}) ⇒ ${defender.toString()} (${defPoint})`);
      // 戦闘ダメージ計算
      if (atkPoint > 0 && atkPoint > defPoint) {
        if (defender.battlePosition === "Attack") {
          attacker.controller.getOpponentPlayer().battleDamage(atkPoint - defPoint, attacker, defender, chainBlockInfo);
        } else {
          attacker.status.piercingTo.getDistinct().forEach((duelist) => duelist.battleDamage(atkPoint - defPoint, attacker, defender, chainBlockInfo));
        }
      } else if (atkPoint < defPoint) {
        // 絶対防御将軍が守備表示で攻撃しても反射ダメージが発生するとのこと。
        attacker.controller.battleDamage(defPoint - atkPoint, defender, attacker, chainBlockInfo);
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

    attacker.info.battleLog.push({ enemy: defender, timestamp: this.clock.getClone() });
    defender.info.battleLog.push({ enemy: attacker, timestamp: this.clock.getClone() });

    const losers = Object.values(this.duelists).filter((duelist) => duelist.lp <= 0);

    if (losers.length) {
      if (losers.length === 1) {
        throw new DuelEnd(losers[0].getOpponentPlayer(), "戦闘ダメージによって、相手のライフポイントをゼロにした。");
      }
      throw new DuelEnd(undefined, "戦闘ダメージによって、お互いのライフポイントがゼロになった。");
    }
  };
  private readonly procBattlePhaseDamageStep4 = async () => {
    this.clock.setStage(this, "afterDmgCalc");
    //ダメージ計算後
    // ダメージ発生、戦闘発生をトリガーとする効果、またはダメージ計算後を直接指定する効果
    await this.procSpellSpeed1();
  };
  private readonly procBattlePhaseDamageStep5 = async () => {
    this.clock.setStage(this, "end");

    // 戦闘破壊・墓地送り実施
    await DuelEntityShortHands.waitCorpseDisposal(this);

    // チェーン番号を加算
    this.clock.incrementChainSeq();

    //ダメージステップ終了時
    // 戦闘破壊されて墓地に送られた場合の効果
    await this.procSpellSpeed1();
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

    while (true) {
      // 優先権保持者の可能な処理をリストアップ
      const actionInfos = this.getEnableActions(
        this.priorityHolder,
        ["IgnitionEffect", "QuickEffect", "CardActivation", "LingeringEffect"],
        ["Normal", "Quick", "Counter"],
        []
      );

      // 強制効果の数を更新
      mandatoryCount[this.priorityHolder.seat] = actionInfos.filter((info) => info.action.isMandatory).length;

      // 強制効果が残っておらず、お互いスキップしたならばループを抜ける。
      if (Object.values(mandatoryCount).every((count) => count === 0) && skipCount > 1) {
        break;
      }

      // 強制効果を適当にピックアップしておく
      const sample = actionInfos.find((info) => info.action.isMandatory);
      let actionInfo: ResponseActionInfo | undefined = sample
        ? {
            action: sample.action,
            originSeq: sample.action.seq,
          }
        : undefined;

      // 強制効果が残っていて、お互いにキャンセルすることの防止
      let cancelable = Boolean(!actionInfo);

      // ターンプレイヤーと非ターンプレイヤーではキャンセル可能条件が異なる
      if (this.priorityHolder.isTurnPlayer) {
        if (skipCount === 0) {
          cancelable = true;
        }
      } else {
        if (mandatoryCount[this.getTurnPlayer().seat]) {
          cancelable = true;
        }
      }

      // 0件または強制効果1件のときのみ効果選択をスキップ
      // TODO 強制効果1件のときも一回まではキャンセルできるので、考慮が必要。
      if (actionInfos.length && (actionInfos.length > 1 || !actionInfo)) {
        // この部分のチェーンチェックは、設定と状況によってスキップ可能とする。
        if (this.priorityHolder.chainConfig.noticeFreeChain || actionInfos.some((info) => info.action.isNoticedForcibly)) {
          actionInfo = await this.view.waitQuickEffect(
            this.priorityHolder,
            actionInfos,
            [],
            cancelable ? this.clock.period.name : "まだ発動しなければならない効果が残っている。",
            cancelable
          );
        }
      }

      // どちらかのプレイヤーが効果を発動する場合、チェーン処理へ。
      if (actionInfo) {
        const chainProcResult = await this.procChain({ activator: this.priorityHolder, actionInfo }, undefined);
        // 選択したアクションを取り消す場合、優先権を変えずにループの先頭に戻す。
        if (chainProcResult === "cancel") {
          continue;
        }

        // フリーチェーン処理
        await this.procFreeChain();
        // ターンプレイヤーに優先権が戻る
        this.priorityHolder = this.getTurnPlayer();

        // スキップカウントをリセット
        skipCount = 0;
        continue;
      }
      // 優先権プレイヤーを切り替え、スキップカウントを加算
      this.priorityHolder = this.priorityHolder.getOpponentPlayer();
      skipCount++;
    }
  };

  private readonly procFreeChain = async () => {
    // フリーチェーン処理
    while ((await this.procChain(undefined, undefined)) !== "pass") {
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
  private readonly procChain = async (
    firstBlock: { activator: Duelist; actionInfo: ResponseActionInfo } | undefined,
    triggerEffects: { activator: Duelist; actionInfo: ValidatedActionInfo; targetChainBlock: ChainBlockInfo<unknown> | undefined }[] | undefined
  ): Promise<"done" | "pass" | "cancel"> => {
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
          return this.getEnableActions(activator, ["TriggerEffect"], [this.chainBlockInfos.length ? "Quick" : "Normal"], this.chainBlockInfos).map(
            (actionInfo) => {
              return { activator, actionInfo, targetChainBlock: this.chainBlockInfos.slice(-1)[0] };
            }
          );
        }));

    // この呼び出しで積むチェーンブロック
    let chainBlock:
      | { activator: Duelist; action: EntityAction<unknown>; targetChainBlock: ChainBlockInfo<unknown> | undefined; dest?: DuelFieldCell }
      | undefined;

    // 起点の効果がある場合、最初に積む。
    if (firstBlock) {
      chainBlock = { activator: firstBlock.activator, action: firstBlock.actionInfo.action, dest: firstBlock.actionInfo.dest, targetChainBlock: undefined };
      this.priorityHolder = chainBlock.activator;
    } else if (_triggerEffets.length > 0) {
      // 次にトリガーエフェクトが存在する場合、まずそちらからチェーンを積む
      const triggerEffect = await this.selectTriggerEffect(_triggerEffets);

      // トリガーエフェクトが選択された場合、積む
      if (triggerEffect) {
        _triggerEffets = _triggerEffets.filter((effect) => effect !== triggerEffect);
        chainBlock = { ...triggerEffect, action: triggerEffect.actionInfo.action };
        // トリガーエフェクトは優先権を無視してチェーンブロックを積むが、その次のブロックは優先権に従うので都度更新しておく。
        // クイックエフェクトのループの先頭で反転する点に注意
        this.priorityHolder = chainBlock.activator;
      } else {
        // トリガーエフェクトが選択されなかった場合、リストをリセットする。
        _triggerEffets = [];
      }
    }

    // ここまででチェーンブロックが積まれていない場合、任意効果のクイックエフェクト
    if (!chainBlock) {
      // 任意効果のクイックエフェクト
      let skipCount = 0;
      while (skipCount < 2) {
        this.priorityHolder = this.priorityHolder.getOpponentPlayer();

        const spellSpeeds: TSpellSpeed[] = ["Counter"];

        if (this.chainBlockInfos.every((info) => info.action.spellSpeed !== "Counter")) {
          spellSpeeds.push("Quick");
        }

        // この部分のチェーンチェックは設定と状況によってスキップ可能とする

        // 先にアクションを収拾
        const actions = this.getEnableActions(this.priorityHolder, ["QuickEffect", "CardActivation"], spellSpeeds, this.chainBlockInfos);

        // 強制通知の効果がある、あるいは攻撃宣言中であれば通知
        let noticeflg = actions.some((info) => info.action.isNoticedForcibly) || Boolean(this.attackingMonster);

        if (!noticeflg) {
          if (this.chainBlockInfos.length) {
            // チェーンが積まれている場合、フラグと前チェーンの発動者で判断
            noticeflg = this.priorityHolder.chainConfig.noticeSelfChain || this.chainBlockInfos.slice(-1)[0].activator !== this.priorityHolder;
          } else {
            // チェーンが積まれていない場合、フラグで判断
            noticeflg = this.priorityHolder.chainConfig.noticeFreeChain;
          }
        }

        if (noticeflg) {
          const msg = this.chainBlockInfos.some((info) => info.action.isWithChainBlock)
            ? "チェーンして効果を発動しますか？"
            : "クイックエフェクト発動タイミング。効果を発動しますか？";

          const actionInfo = await this.view.waitQuickEffect(
            this.priorityHolder,
            this.getEnableActions(this.priorityHolder, ["QuickEffect", "CardActivation"], spellSpeeds, this.chainBlockInfos),
            this.chainBlockInfos,
            msg,
            true
          );

          // どちらかのプレイヤーが効果を発動する場合、チェーン処理へ。
          if (actionInfo) {
            chainBlock = { ...actionInfo, activator: this.priorityHolder, targetChainBlock: this.chainBlockInfos.slice(-1)[0] };
            // トリガーエフェクトが選択されなかった場合、リストをリセットする。
            break;
          }
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
        chainBlock.dest,
        chainBlock.targetChainBlock,
        this.chainBlockInfos,
        isStartPoint,
        false
      );
      if (!chainBlockInfo) {
        return "cancel";
      }

      this.chainBlockLog.push(chainBlockInfo);

      // エフェクト・ヴェーラーなどに発動場所を参照する無効を処理するため、この時点の情報をコピー
      const enableCellTypes = [...chainBlockInfo.action.entity.info.isEffectiveIn];

      this._chainBlockInfos.push(chainBlockInfo);

      this.clock.incrementProcSeq();
      this.clock.incrementChainBlockSeq();

      // 誘発効果のプールから、今回選んだものと、それによって回数超過するものを除外
      //   ※星杯の妖精リースを同時に特殊召喚した場合など
      _triggerEffets = _triggerEffets
        .filter((e) => e.actionInfo.action.seq !== chainBlock?.action.seq)
        .filter((e) => e.actionInfo.action.validateCount(e.activator, this.chainBlockInfos));

      if (cardActionCreateChainTypes.some((tp) => tp === chainBlockInfo.action.playType)) {
        // ★★★★★ 再帰実行 ★★★★★
        await this.procChain(undefined, _triggerEffets.length ? _triggerEffets : undefined);
      }

      if (chainBlockInfo.chainNumber) {
        this.log.info(`チェーン${chainBlockInfo.chainNumber}: ${chainBlockInfo.action.toString()}の効果処理。`, activator);
      }

      // 有効無効判定
      if (chainBlockInfo.isNegatedActivationBy) {
        // 発動無効時は全ての処理を行わない
        if (chainBlockInfo.chainNumber) {
          this.log.info(
            `チェーン${chainBlockInfo.chainNumber}: ${chainBlockInfo.action.toString()}を${chainBlockInfo.isNegatedActivationBy.toString()}によって発動を無効にした。`,
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
            nagationText = `チェーン${chainBlockInfo.chainNumber}: ${chainBlockInfo.action.toString()}を${chainBlockInfo.isNegatedEffectBy.toString()}によって効果を無効にした。`;
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

        if (chainBlockInfo.state === "done") {
          for (const duelist of [this.getTurnPlayer(), this.getNonTurnPlayer()]) {
            // エクゾディア判定
            for (const afterChainBlockEffect of this.getEnableActions(duelist, ["Exodia"], ["Normal"], [chainBlockInfo])) {
              await afterChainBlockEffect.action.directExecute(duelist, chainBlockInfo, false);
            }
            for (const afterChainBlockEffect of this.getEnableActions(duelist, ["AfterChainBlock"], ["Normal"], [chainBlockInfo])) {
              await afterChainBlockEffect.action.directExecute(duelist, chainBlockInfo, false);
              // エクゾディア判定
              for (const afterChainBlockEffect of this.getEnableActions(duelist, ["Exodia"], ["Normal"], [chainBlockInfo])) {
                await afterChainBlockEffect.action.directExecute(duelist, chainBlockInfo, false);
              }
            }
          }
        }
      }

      if (isStartPoint) {
        // このチェーンでカードの発動を行った、永続類ではない魔法罠を全て墓地送りにする。
        await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(
          this._chainBlockInfos
            .filter((info) => info.action.playType === "CardActivation")
            .filter((info) => !info.action.isLikeContinuousSpell)
            .map((info) => info.action.entity)
            .filter((card) => card.isOnFieldStrictly)
            .filter((card) => card.face === "FaceUp"),
          ["Rule"],
          undefined,
          undefined
        );
        // チェーン情報を破棄
        this._chainBlockInfos.reset();

        if (chainBlockInfo.nextActionInfo) {
          // ★★★★★ 再帰実行 ★★★★★
          //   ※ 緊急同調など、直後にチェーンに乗らない特殊召喚を行う場合。チェーン１の場合、では昇天の角笛を発動できる。
          //   ※ ！重要！ チェーン番号は同じまま進める。このチェーンが終わったあとに、誘発効果の収拾を行うため。
          await this.procChain({ activator: chainBlockInfo.activator, actionInfo: chainBlockInfo.nextActionInfo }, undefined);
        }
        // チェーン番号を加算。
        this.clock.incrementChainSeq();
      } else {
        if (chainBlockInfo.nextActionInfo) {
          // ※ 緊急同調など、直後にチェーンに乗らない特殊召喚を行う場合
          await chainBlockInfo.nextActionInfo.action.directExecute(chainBlockInfo.activator, undefined, false);
        }
        // チェーンブロック番号を加算。
        this.clock.incrementChainBlockSeq();
      }
    }

    return chainBlock ? "done" : "pass";
  };
  private readonly selectTriggerEffect = async (
    triggerEffects: { activator: Duelist; actionInfo: ValidatedActionInfo; targetChainBlock: ChainBlockInfo<unknown> | undefined }[]
  ): Promise<{ activator: Duelist; actionInfo: ValidatedActionInfo; targetChainBlock: ChainBlockInfo<unknown> | undefined } | undefined> => {
    // トリガーエフェクトの処理順に従って効果を抽出する。
    if (triggerEffects.length > 0) {
      for (const isMandatory of [true, false]) {
        for (const activator of [this.getTurnPlayer(), this.getNonTurnPlayer()]) {
          // トリガーエフェクトを抽出
          const effects = triggerEffects.filter((effect) => effect.actionInfo.action.isMandatory === isMandatory && effect.activator === activator);

          // なければ次の条件へ
          if (effects.length === 0) {
            continue;
          }

          // 強制効果が残り１の場合、選択をスキップ
          if (effects.length === 1 && isMandatory) {
            return effects[0];
          }

          // 任意効果の場合、スキップ可能
          const _actionInfo = await this.view.waitQuickEffect(
            activator,
            effects.map((obj) => obj.actionInfo),
            this.chainBlockInfos,
            "トリガーエフェクトを選択。",
            !isMandatory
          );

          if (_actionInfo) {
            return effects.find((effect) => effect.actionInfo.action === _actionInfo.action);
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
  ): ValidatedActionInfo[] => {
    const nextChainBlockFilter = chainBlockInfos.slice(-1)[0]?.nextChainBlockFilter ?? (() => true);

    return [...this.field.getAllCardEntities(), duelist.entity]
      .flatMap((entity) => entity.actions)
      .filter((action) => action.executableCells.includes(action.entity.fieldCell.cellType))
      .filter((action) => action.executablePeriods.includes(this.clock.period.key))
      .filter((action) => enableSpellSpeeds.includes(action.spellSpeed))
      .filter((action) => action.validateDuelist(duelist))
      .filter((action) => enableCardPlayTypes.includes(action.playType))
      .filter((action) => nextChainBlockFilter(duelist, action))
      .map((action) => action.validate(duelist, chainBlockInfos, false))
      .filter((info): info is ValidatedActionInfo => info !== undefined);
  };
}

import { type IDuelistProfile } from "@ygo/class/DuelistProfile";
import { type IDeckInfo } from "@ygo/class/DeckInfo";
import { Duel, DuelEnd, SystemError, type TSeat } from "./Duel";
import { DuelEntity, type SummonArg, type TDuelCauseReason, type TSummonRuleCauseReason } from "./DuelEntity";
import type { DuelClock } from "./DuelClock";
import type { DuelFieldCell } from "./DuelFieldCell";
import { cardInfoDic } from "@ygo/class/CardInfo";
import {} from "@stk_utils/funcs/StkArrayUtils";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import {
  CardAction,
  type CardActionDefinitionAttr,
  type ChainBlockInfo,
  type ICardAction,
  type SummonMaterialInfo,
  type TCardActionType,
} from "./DuelCardAction";
import { max, min } from "@stk_utils/funcs/StkMathUtils";
import type { TBanishProcType } from "@ygo_duel/class_continuous_effect/DuelProcFilter";

type TLifeLogReason = "BattleDamage" | "EffectDamage" | "Heal" | "Lost" | "Pay" | "Set";
export type TDuelistType = "NPC" | "Player";

type LifeLogRecord = {
  clock: DuelClock;
  reason: TLifeLogReason;
  beforeLp: number;
  afterLp: number;
  entity: DuelEntity | undefined;
};

export type DuelistInfo = {
  maxRuleNormalSummonCount: number; //サモンチェーン、時を裂く魔瞳
  ruleNormalSummonCount: number;
  ruleNormalSummonCountQty: number;
  effectNormalSummonCount: number;
  effectNormalSummonCountQty: number;
  specialSummonCount: number;
  specialSummonCountQty: number;
};

export type DuelistStatus = {
  maxSpecialSummonCount: number; //ミドラーシュ
  canDrawByEffect: boolean; //ドロバ
  canSearchFromDeck: boolean; //ドロバ、手違い
  canDiscardAsCost: boolean; //強欲ゴブリン
  canDiscardAsEffect: boolean;
};

export type SummonChoice = { summoner: Duelist; monster: DuelEntity; posList: Readonly<TBattlePosition[]>; cells: DuelFieldCell[] };

export class Duelist {
  public static readonly summonMany = async (
    effectOwner: Duelist,
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
    summonChoices: SummonChoice[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean,
    validator: (summoned: DuelEntity[]) => boolean,
    cancelable: boolean,
    msg: string = "特殊召喚するモンスターを選択。"
  ) => {
    const summoners = summonChoices.map((choice) => choice.summoner).getDistinct();
    const summonArgs: SummonArg[] = [];
    for (const summoner of summoners) {
      summonArgs.push(
        ...(await summoner.prepareToSummonMany(
          effectOwner,
          summonType,
          moveAs,
          actDefAttr,
          summonChoices.filter((choice) => choice.summoner === summoner),
          materialInfos,
          ignoreSummoningConditions,
          validator,
          cancelable,
          msg
        ))
      );
    }

    if (!summonArgs.length) {
      return;
    }

    // 召喚素材をエンティティにセット
    summonArgs.forEach((args) => args.monster.info.materials.reset(...materialInfos));

    await DuelEntity.moveToXyzOwner(
      summonArgs[0].dest,
      materialInfos.map((info) => info.material).filter((monster) => monster.status.kind === "XyzMaterial"),
      ["XyzMaterial", "Rule"],
      summonArgs[0].monster,
      effectOwner
    );

    await DuelEntity.summonMany(summonArgs, summonType, moveAs, actDefAttr.entity, effectOwner);

    return summonArgs.map((arg) => arg.monster);
  };

  public readonly duel: Duel;
  public readonly seat: TSeat;
  public get entity() {
    const avatar = this.getHandCell().entities.find((entity) => entity.entityType === "Duelist");
    if (avatar) {
      return avatar;
    }
    return DuelEntity.createPlayerEntity(this);
  }
  public _entity: DuelEntity | undefined;
  public readonly profile: IDuelistProfile;
  public readonly deckInfo: IDeckInfo;
  public info: DuelistInfo;
  public readonly infoOrigin: DuelistInfo;
  public status: DuelistStatus;
  public readonly statusOrigin: DuelistStatus;
  public readonly duelistType: TDuelistType;
  public readonly lifeLog: LifeLogRecord[];
  private readonly actionBlackListForNPC: Readonly<TCardActionType[]>;
  private _lp: number;
  public readonly initHand: Readonly<string[]>;
  public constructor(duel: Duel, seat: TSeat, profile: IDuelistProfile, duelistType: TDuelistType, deckInfo: IDeckInfo, hand: string[] = []) {
    this.duel = duel;
    this.seat = seat;
    this.profile = profile;
    this.duelistType = duelistType;
    this.deckInfo = deckInfo;
    this.initHand = hand;
    this.lifeLog = [];
    this.infoOrigin = {
      maxRuleNormalSummonCount: 1,
      ruleNormalSummonCount: 0,
      ruleNormalSummonCountQty: 0,
      effectNormalSummonCount: 0,
      effectNormalSummonCountQty: 0,
      specialSummonCount: 0,
      specialSummonCountQty: 0,
    };
    this.info = { ...this.infoOrigin };
    this.statusOrigin = {
      maxSpecialSummonCount: Number.MAX_VALUE,
      canDrawByEffect: true,
      canSearchFromDeck: true,
      canDiscardAsCost: true,
      canDiscardAsEffect: true,
    };
    this.status = { ...this.statusOrigin };

    this._lp = 8000;

    const tmp: TCardActionType[] = [];

    if (this.duelistType === "NPC") {
      if (this.profile.npcLvl < 1) {
        tmp.push("CardActivation", "IgnitionEffect", "TriggerEffect", "QuickEffect");
      }
      if (this.profile.npcLvl < 101) {
        tmp.push("Battle");
      }
    }
    this.actionBlackListForNPC = tmp;
  }
  public get lp() {
    return this._lp;
  }
  public get isTurnPlayer() {
    return this.duel.getTurnPlayer() === this;
  }
  public get canDraw() {
    // TODO
    return true;
  }
  public get canAddToHandFromDeck() {
    // TODO
    return true;
  }

  public readonly writeInfoLog = (text: string) => {
    this.duel.log.info(text, this);
  };

  public readonly initForDrawPhase = () => {
    this.info = { ...this.infoOrigin };
  };
  public readonly canDiscard = (entities: DuelEntity[]) => {
    console.log(entities);
    // TODO
    return true;
  };
  public readonly canSendToGraveyard = (entities: DuelEntity[]) => {
    console.log(entities);
    // TODO
    return true;
  };
  public readonly canRelease = (entities: DuelEntity[]) => {
    console.log(entities);
    // TODO
    return true;
  };

  /**
   * 対象の耐性などを考慮せず、行為を行えるかどうかの判定
   * @param target
   * @param procType
   * @param chainBlockInfo
   */
  public readonly canTryBanish = (target: DuelEntity, procType: TBanishProcType, action: CardActionDefinitionAttr): boolean => {
    return this.entity.procFilterBundle.operators.filter((pf) => pf.procTypes.includes(procType)).every((pf) => pf.filter(this, this.entity, action, [target]));
  };

  public readonly battleDamage = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp - point, entity, "BattleDamage");
  };
  public readonly effectDamage = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp - point, entity, "EffectDamage");
  };
  public readonly lostLp = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp - point, entity, "Lost");
  };
  public readonly payLp = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp - point, entity, "Pay");
  };
  public readonly heal = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp + point, entity, "Heal");
  };
  public readonly setLp = (lp: number, entity?: DuelEntity, reason?: TLifeLogReason): LifeLogRecord => {
    const log = {
      clock: this.duel.clock,
      reason: reason || "Set",
      beforeLp: this._lp,
      afterLp: lp,
      entity: entity,
    };
    this.lifeLog.push(log);
    this._lp = lp;

    this.writeInfoLog(`ライフポイント変動：${log.afterLp - log.beforeLp}（${log.beforeLp} ⇒ ${log.afterLp}）`);

    return log;
  };
  public readonly getOpponentPlayer = (): Duelist => {
    return this.duel.firstPlayer === this ? this.duel.secondPlayer : this.duel.firstPlayer;
  };
  public readonly getHandCell = (): DuelFieldCell => {
    return this.duel.field.getCells("Hand").filter((cell) => cell.owner === this)[0];
  };
  public readonly getDeckCell = (): DuelFieldCell => {
    return this.duel.field.getCells("Deck").filter((cell) => cell.owner === this)[0];
  };
  public readonly getExtraDeck = (): DuelFieldCell => {
    return this.duel.field.getCells("ExtraDeck").filter((cell) => cell.owner === this)[0];
  };
  public readonly getGraveyard = (): DuelFieldCell => {
    return this.duel.field.getCells("Graveyard").filter((cell) => cell.owner === this)[0];
  };
  public readonly getFieldZone = (): DuelFieldCell => {
    return this.duel.field.getCells("FieldSpellZone").filter((cell) => cell.owner === this)[0];
  };
  public readonly getBanished = (): DuelFieldCell => {
    return this.duel.field.getCells("Banished").filter((cell) => cell.owner === this)[0];
  };
  public readonly getMonsterZones = (): DuelFieldCell[] => {
    return this.duel.field.getCells("MonsterZone").filter((cell) => cell.owner === this);
  };
  public readonly getExtraMonsterZones = (): DuelFieldCell[] => {
    return this.duel.field.getCells("ExtraMonsterZone").filter((cell) => cell.cardEntities[0]?.controller === this);
  };
  public readonly getSpellTrapZones = (): DuelFieldCell[] => {
    return this.duel.field.getCells("SpellAndTrapZone").filter((cell) => cell.owner === this);
  };
  public readonly getXyzMaterialZone = (): DuelFieldCell => {
    return this.duel.field.getCells("XyzMaterialZone").filter((cell) => cell.owner === this)[0];
  };
  public readonly getEmptyMonsterZones = (): DuelFieldCell[] => {
    return this.getMonsterZones().filter((cell) => cell.cardEntities.length === 0);
  };
  public readonly getEmptyExtraZones = (): DuelFieldCell[] => {
    return this.getExtraMonsterZones().length === 0 ? this.getMonsterZones().filter((cell) => cell.cardEntities.length === 0) : [];
  };
  public readonly getAvailableMonsterZones = (): DuelFieldCell[] => {
    return this.getMonsterZones().filter((cell) => cell.isAvailable);
  };
  public readonly getAvailableExtraZones = (): DuelFieldCell[] => {
    // TODOエクストラリンク
    return this.getExtraMonsterZones().length === 0 ? this.duel.field.getCells("ExtraMonsterZone").filter((cell) => cell.isAvailable) : [];
  };
  public readonly getAvailableSpellTrapZones = (): DuelFieldCell[] => {
    return this.getSpellTrapZones().filter((cell) => cell.isAvailable);
  };
  public readonly getReleasableMonsters = (): DuelEntity[] => {
    // TODO : クロス・ソウルと帝王の烈旋の考慮
    return this.getMonstersOnField();
  };
  public readonly getMonstersOnField = (): DuelEntity[] => {
    return this.duel.field.getMonstersOnField().filter((monster) => monster.controller === this);
  };
  public readonly getEntiteisOnField = (): DuelEntity[] => {
    return this.duel.field.getCardsOnField().filter((card) => card.controller === this);
  };

  public readonly pushDeck = (): void => {
    this.deckInfo.cardNames
      .map((name) => cardInfoDic[name])
      .filter((info) => info)
      .forEach((info) => DuelEntity.createCardEntity(this, info));
    this.duel.log.info(`デッキをセット。メイン${this.getDeckCell().cardEntities.length}枚。エクストラ${this.getExtraDeck().cardEntities.length}枚。`, this);
    return;
  };

  public readonly draw = async (times: number, causedBy: DuelEntity | undefined, causedByWhome: Duelist | undefined): Promise<void> => {
    if (times < 1) {
      return;
    }
    const deckCell = this.getDeckCell();
    const cardNames = [] as string[];

    this.writeInfoLog(`デッキからカードを${times}枚ドロー。`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of Array(times)) {
      if (!deckCell.cardEntities.length) {
        this.writeInfoLog(
          cardNames.length > 0
            ? `デッキからカードを${times}枚ドローしようとしたが、${cardNames.length}枚しかドローできなかった。${cardNames}`
            : "デッキからカードをドローできなかった。"
        );
        this.duel.isEnded = true;
        this.setLp(0);
        throw new DuelEnd(this.getOpponentPlayer());
      }
      const card = deckCell.cardEntities[0];
      await card.draw(causedBy ? ["Effect"] : ["Rule"], causedBy, causedByWhome);

      cardNames.push(card.origin?.name || "!名称取得失敗!");
    }

    return;
  };

  public readonly discard = async (
    qty: number,
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    chooser?: Duelist,
    filter?: (entity: DuelEntity) => boolean,
    causedByWhome?: Duelist
  ): Promise<DuelEntity[]> => {
    const _filter: (entity: DuelEntity) => boolean = filter || (() => true);
    const choices = this.getHandCell().cardEntities.filter(_filter);

    if (choices.length < qty) {
      return [];
    }
    let selectedList = [] as DuelEntity[];
    if ((chooser || this).duelistType === "NPC") {
      // NPCに選択権がある場合、ランダムに手札を捨てる。
      selectedList = choices.randomPickMany(qty);
    } else {
      selectedList =
        (await this.duel.view.waitSelectEntities(chooser || this, choices, qty, (list) => list.length === qty, `${qty}枚カードを捨てる。`, false)) || [];
    }
    this.writeInfoLog(`手札からカードを${selectedList.length}枚捨てた。${selectedList.map((e) => e.origin?.name)}。`);

    await DuelEntity.discardManyForTheSameReason(selectedList, ["Discard", ...moveAs], causedBy, causedByWhome);

    return selectedList;
  };

  public readonly getEnableSummonList = (
    effectOwner: Duelist,
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
    summonChoices: Omit<SummonChoice, "summoner">[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean
  ): SummonChoice[] => {
    const extraMonsterZones = this.duel.field.getCells("ExtraMonsterZone");

    // 自分が使用しているエクストラモンスターゾーンを抽出。
    const usedExtraMonsterZone = extraMonsterZones
      .filter((cell) => !materialInfos.map((info) => info.material).includes(cell.cardEntities[0]))
      .filter((cell) => cell.owner === this);

    // エクストラリンクを成立させることができるときにのみ使用することができるセルを抽出。
    const onlyForExtraLinkCells: DuelFieldCell[] = [];

    if (usedExtraMonsterZone.length) {
      onlyForExtraLinkCells.push(...extraMonsterZones.filter((cell) => !usedExtraMonsterZone.includes(cell)).filter((cell) => cell.isAvailable));
    }

    return summonChoices
      .map((item) => {
        return { ...item, summoner: this };
      })
      .map((item) => {
        if (!this.duel.field.canExtraLink(item.monster, materialInfos)) {
          // エクストラリンクを成立させることができるときにのみ使用することができるセルを除外。
          item.cells = item.cells.filter((cell) => !onlyForExtraLinkCells.includes(cell));
        }
        if (item.monster.status.monsterCategories?.includes("Link")) {
          // リンクモンスターは守備表示にできない。
          item.posList = item.posList.filter((pos) => pos === "Attack");
        }
        return item;
      })
      .map((item) => {
        // 空く予定がないセルを除外
        return {
          ...item,
          cells: item.cells.filter((cell) => cell.cardEntities.length === 0 || materialInfos.some((info) => info.material === cell.cardEntities[0])),
        };
      })
      .filter((item) => item.cells.length && item.posList.length)
      .map((item) => this.entity.summonFilterBundle.filter(effectOwner, summonType, moveAs, actDefAttr, item, materialInfos, ignoreSummoningConditions))
      .filter((item) => item.cells.length && item.posList.length)
      .map((item) => item.monster.summonFilterBundle.filter(effectOwner, summonType, moveAs, actDefAttr, item, materialInfos, ignoreSummoningConditions))
      .filter((item) => item.cells.length && item.posList.length)
      .map((item) =>
        materialInfos
          .map((info) => info.material.summonFilterBundle)
          .reduce((wip, bundle) => bundle.filter(effectOwner, summonType, moveAs, actDefAttr, item, materialInfos, ignoreSummoningConditions), item)
      )
      .filter((item) => item.cells.length && item.posList.length);
  };

  private readonly prepareToSummonMany = async (
    effectOwner: Duelist,
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
    summonChoices: SummonChoice[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean,
    validator: (summoned: DuelEntity[]) => boolean,
    cancelable: boolean,
    msg: string = "特殊召喚するモンスターを選択。"
  ): Promise<SummonArg[]> => {
    const choices = this.getEnableSummonList(effectOwner, summonType, moveAs, actDefAttr, summonChoices, materialInfos, ignoreSummoningConditions);

    if (!choices.length) {
      return [];
    }

    let monsters = choices.map((item) => item.monster);

    console.log(summonChoices, validator([]));

    if (summonChoices.length !== 1 || validator([])) {
      monsters = (await this.duel.view.waitSelectEntities(this, monsters, undefined, validator, msg, cancelable)) ?? [];
    }

    console.log(choices, monsters);

    const summonArgs: SummonArg[] = [];
    for (const choice of choices.filter((item) => monsters.includes(item.monster))) {
      const selectableCells = choice.cells.filter((cell) => !summonArgs.map((arg) => arg.dest).includes(cell));
      if (!selectableCells.length) {
        continue;
      }
      let pos: TBattlePosition = [...choice.posList].randomPick();
      let dest: DuelFieldCell = selectableCells.randomPick();

      if (selectableCells.length > 1 || choice.posList.length > 1) {
        if (this.duelistType !== "NPC") {
          const msg = selectableCells.length > 1 ? "カードを召喚先へドラッグ。" : "表示形式を選択。";
          const dammyActions = choice.posList.map((pos) => CardAction.createDammyAction(choice.monster, pos, selectableCells, pos));
          const p1 = this.duel.view.modalController.selectAction(this.duel.view, {
            title: msg,
            activator: this,
            actions: dammyActions as ICardAction<unknown>[],
            cancelable: false,
          });
          const p2 = this.duel.view.waitSubAction(this, dammyActions as ICardAction<unknown>[], msg, cancelable).then((res) => res.action);

          const action = await Promise.any([p1, p2]);

          if (!action) {
            throw new SystemError("想定されない状態", choices, monsters, summonArgs);
          }
          dest = action.cell || dest;
          pos = action.pos || pos;
        }
      }
      summonArgs.push({ summoner: this, monster: choice.monster, pos, dest });
    }

    return summonArgs;
  };

  public readonly summonAll = (
    effectOwner: Duelist,
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
    summonChoices: Omit<SummonChoice, "summoner">[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean,
    cancelable: boolean,
    msg?: string
  ) =>
    this.summonMany(
      effectOwner,
      summonType,
      moveAs,
      actDefAttr,
      summonChoices,
      materialInfos,
      ignoreSummoningConditions,
      (summoned) => summoned.length === summonChoices.length,
      cancelable,
      msg
    );

  public readonly summonMany = (
    effectOwner: Duelist,
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
    summonChoices: Omit<SummonChoice, "summoner">[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean,
    validator: (summoned: DuelEntity[]) => boolean,
    cancelable: boolean,
    msg?: string
  ) =>
    Duelist.summonMany(
      effectOwner,
      summonType,
      moveAs,
      actDefAttr,
      summonChoices.map((choice) => {
        return { ...choice, summoner: this };
      }),
      materialInfos,
      ignoreSummoningConditions,
      validator,
      cancelable,
      msg
    );
  public readonly selectAttackTargetForNPC = (attacker: DuelEntity, action: CardAction<unknown>): DuelEntity | undefined => {
    // 攻撃力と攻撃対象を抽出。
    const atk = attacker.atk ?? 0;
    const enemies = attacker.getAttackTargets();

    if (!enemies.length) {
      return;
    }

    const opponent = enemies.find((enemy) => enemy.entityType === "Duelist");

    // 直接攻撃可能かつ、勝利可能または1600以上なら直接攻撃する。
    if (opponent && (atk >= min(1600, this.getOpponentPlayer().lp) || attacker.info.battlePotisionChangeCount > 0)) {
      return opponent;
    }

    return enemies.find((enemy) => {
      // 相手が攻撃表示なら、相打ち以上で攻撃
      if (enemy.battlePosition === "Attack") {
        return atk >= (enemy.atk ?? 0);
      }
      // 守備表示なら、ステータスが超過していない場合攻撃しない
      if (atk < (enemy.battlePosition === "Set" ? 1000 : (enemy.def ?? 0))) {
        return false;
      }
      // 戦闘破壊可能であれば、攻撃する。
      return enemy.validateDestory("BattleDestroy", this, attacker, action);
    });
  };

  public readonly selectActionForNPC = (
    enableActions: CardAction<unknown>[],
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>
  ): CardAction<unknown> | undefined => {
    // 発動可能な効果がなければ何もしない
    if (!enableActions.length) {
      return;
    }

    // 強制効果がある場合、最優先で選択 ※重要
    const mandatoryEffects = enableActions.filter((action) => action.isMandatory);
    if (mandatoryEffects.length) {
      return mandatoryEffects.randomPick();
    }

    let _enableActions = enableActions.filter((action) => !this.actionBlackListForNPC.includes(action.playType));

    // 優先度高を発動
    const highPriorities = _enableActions
      .filter((action) => !Number.isNaN(action.priorityForNPC))
      .shuffle()
      .sort((left, right) => left.priorityForNPC - right.priorityForNPC);
    if (highPriorities.length) {
      return highPriorities[0];
    }

    // 誘発効果は発動しておけの精神
    const triggerEffects = _enableActions.filter((action) => action.playType === "TriggerEffect");
    if (triggerEffects.length) {
      return triggerEffects.randomPick();
    }

    // メインフェイズ以外の起動効果は発動しておけの精神
    if (this.duel.phase !== "main1" && this.duel.phase !== "main2") {
      const ignitionEffect = _enableActions.filter((action) => action.playType === "IgnitionEffect");
      if (ignitionEffect.length) {
        return ignitionEffect.randomPick();
      }
    }

    // 攻撃宣言がある場合、攻撃力の低いモンスターから戦闘破壊可能なモンスターを攻撃できるかチェックし、選択する
    const battleActions = _enableActions
      .filter((action) => action.playType === "Battle")
      .sort((left, right) => (left.entity.atk ?? 0) - (right.entity.atk ?? 0));

    // 攻撃宣言のタイミングは、攻撃宣言しかできないのでここでreturnする。
    if (battleActions.length) {
      return battleActions.find((action) => this.selectAttackTargetForNPC(action.entity, action));
    }

    // 攻撃宣言は（念の為）この時点でフィルタリング
    _enableActions = _enableActions.filter((action) => action.playType !== "Battle");

    // 一つ前のブロックの発動者が自分ではない場合、無効化効果を探して実行する。
    const previousBlock = _enableActions.length ? chainBlockInfos.slice(-1)[0] : undefined;
    const negationEffects = _enableActions.filter((action) => action.negatePreviousBlock);
    if (previousBlock && previousBlock.activator !== this && negationEffects) {
      return negationEffects.randomPick();
    }

    // それ以外の場合、無効化効果は発動しないようにフィルタリング
    _enableActions = _enableActions.filter((action) => !action.negatePreviousBlock);

    // 発動可能な効果がなければ何もしない
    if (!_enableActions.length) {
      return;
    }

    // 相手フィールドの状態取得
    const maxEnemyAtk = max(
      ...this.getOpponentPlayer()
        .getMonstersOnField()
        .filter((enemy) => enemy.battlePosition === "Attack")
        .map((enemy) => enemy.atk ?? 0),
      1600
    );
    const minEnemyAtkDef = min(
      ...this.getOpponentPlayer()
        .getMonstersOnField()
        .map((enemy) => (enemy.battlePosition === "Set" ? 1500 : ((enemy.battlePosition === "Attack" ? enemy.atk : enemy.def) ?? 0))),
      1500
    );

    const allies = this.getMonstersOnField();
    const maxAllyAtk = max(...allies.filter((enemy) => enemy.battlePosition === "Attack").map((enemy) => enemy.atk ?? 0), 0);

    // 攻撃表示への変更判断はメイン１、メイン２両方行う
    let posActions = _enableActions
      .filter((action) => action.playType !== "ChangeBattlePosition")
      .filter((action) => action.entity.battlePosition !== "Attack")
      .filter((action) => (action.entity.atk ?? 0) >= maxEnemyAtk || ((action.entity.atk ?? 0) > minEnemyAtkDef && (action.entity.atk ?? 0) > 2300));
    if (posActions.length) {
      return posActions.randomPick();
    }

    // 魔法罠のセットと、表示形式の変更、手札誘発持ちの召喚特殊召喚は一旦選択肢から除外する
    _enableActions = _enableActions
      .filter((action) => action.playType !== "ChangeBattlePosition")
      .filter((action) => action.playType !== "SpellTrapSet")
      .filter(
        (action) =>
          action.entity.actions
            .filter((otherAction) => otherAction.playType !== "NormalSummon" && otherAction.playType !== "SpecialSummon")
            .flatMap((otherAction) => otherAction.executableCells)
            .every((ct) => ct !== "Hand") ||
          (action.playType !== "NormalSummon" && action.playType !== "SpecialSummon")
      );

    // 手札効果なし、リリースなしで通常召喚できるモンスターが居るなら出しとけの精神
    // 手札効果なし、特殊召喚できるモンスターも出しておけの精神
    // アドバンス召喚は、最大攻撃力以上であれば出す
    // 表側表示で使える効果は使っておけの精神
    const effects = [
      ..._enableActions.filter((action) => action.playType === "NormalSummon").filter((action) => (action.entity.lvl ?? 12) < 5),
      ..._enableActions.filter((action) => action.playType === "SpecialSummon"),
      ..._enableActions
        .filter((action) => action.playType === "NormalSummon")
        .filter((action) => (action.entity.atk ?? 0) > 2600 || ((action.entity.atk ?? 0) > 2300 && (action.entity.lvl ?? 12) < 7))
        .filter((action) => (action.entity.atk ?? 0) >= maxAllyAtk),
      ..._enableActions.filter((action) => action.entity.face === "FaceUp").filter((action) => action.entity.isOnField),
    ];

    if (effects.length) {
      return effects.randomPick();
    }

    // 召喚特殊召喚は除外
    _enableActions = _enableActions.filter((action) => action.playType !== "NormalSummon").filter((action) => action.playType !== "SpecialSummon");

    // メイン２である場合
    if (this.duel.phase === "main2") {
      // 守備表示への変更判断はメイン２のみ
      posActions = enableActions
        .filter((action) => action.playType === "ChangeBattlePosition")
        .filter((action) => action.entity.battlePosition === "Attack")
        .filter((action) => (action.entity.atk ?? 0) < maxEnemyAtk || ((action.entity.atk ?? 0) > minEnemyAtkDef && (action.entity.atk ?? 0) > 2300));
      if (posActions.length) {
        return posActions.randomPick();
      }

      // 空きが二箇所以上なら、魔法罠のセットを行う
      if (this.getAvailableSpellTrapZones.length > 1) {
        return enableActions
          .filter((action) => action.playType === "SpellTrapSet")
          .filter((action) => action.entity.status.kind !== "Spell" || action.entity.status.spellCategory === "QuickPlay")
          .randomPick();
      }
    }

    // 残った行動を、残り数に応じてランダムに実行する。
    if (Math.random() < _enableActions.length / 4) {
      return _enableActions.randomPick();
    }
  };
}

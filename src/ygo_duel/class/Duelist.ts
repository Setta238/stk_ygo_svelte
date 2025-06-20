import { type IDuelistProfile } from "@ygo/class/DuelistProfile";
import { type IDeckInfo } from "@ygo/class/DeckInfo";
import { Duel, DuelEnd, SystemError, type ResponseActionInfo, type TSeat } from "./Duel";
import { DuelEntity, type SummonArg, type TDuelCauseReason, type TSummonKindCauseReason } from "./DuelEntity";
import type { IDuelClock } from "./DuelClock";
import type { DuelFieldCell, DuelFieldCellType } from "./DuelFieldCell";
import { getSequenceNumbers } from "@stk_utils/funcs/StkArrayUtils";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import {
  EntityAction,
  type CardActionDefinitionAttrs,
  type ChainBlockInfo,
  type SummonMaterialInfo,
  type TSpellSpeed,
  type ValidatedActionInfo,
} from "./DuelEntityAction";
import { min } from "@stk_utils/funcs/StkMathUtils";
import type { TBanishProcType } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
import { DuelEntityShortHands } from "./DuelEntityShortHands";
import type { EntityDefinition } from "./DuelEntityDefinition";
import { calcBattleDamage, calcEffectDamage } from "@ygo_duel/class_continuous_effect/DuelDamageFilter";
import type { TEntityActionType } from "./DuelEntityActionBase";

export type TDuelistType = "NPC" | "Player";

export const chainConfigKeys = ["noticeSelfChain", "noticeFreeChain"] as const;
export type TChainConfigKey = (typeof chainConfigKeys)[number];
export type ChainConfig = {
  [key in TChainConfigKey]: boolean;
};
export const chainConfigDic: {
  [key in TChainConfigKey]: string;
} = {
  noticeSelfChain: "セルフチェーン",
  noticeFreeChain: "フリーチェーン",
} as const;

export type TLifeLogReason = "BattleDamage" | "EffectDamage" | "Heal" | "Lost" | "Pay" | "Set";

type LifeLogRecord = {
  duelist: Duelist;
  clock: IDuelClock;
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
    summonType: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
    summonChoices: SummonChoice[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean,
    qty: number | undefined,
    validator: (summoned: DuelEntity[]) => boolean,
    cancelable: boolean,
    msg: string = "特殊召喚するモンスターを選択。"
  ) =>
    Duelist._summonMany(
      effectOwner,
      summonType,
      movedAs,
      actDefAttr,
      summonChoices
        .map((choice) => choice.summoner)
        .getDistinct()
        .map((summoner) => ({ summoner, summonChoices: summonChoices.filter((summonChoice) => summonChoice.summoner === summoner) })),
      materialInfos,
      ignoreSummoningConditions,
      qty,
      validator,
      cancelable,
      msg
    );
  private static readonly _summonMany = async (
    effectOwner: Duelist,
    summonType: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
    groupedSummonChoices: { summoner: Duelist; msg?: string; summonChoices: Omit<SummonChoice, "summoner">[] }[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean,
    qty: number | undefined,
    validator: (summoned: DuelEntity[]) => boolean,
    cancelable: boolean,
    msg: string = "特殊召喚するモンスターを選択。"
  ) => {
    const summonArgs: SummonArg[] = [];

    for (const item of groupedSummonChoices) {
      const _item = { ...item };
      _item.summonChoices = _item.summonChoices.filter((sc) => !summonArgs.map((sa) => sa.monster).includes(sc.monster));
      const selected = await _item.summoner.prepareToSummonMany(
        effectOwner,
        summonType,
        movedAs,
        actDefAttr,
        _item.summonChoices.map((sc) => ({ ...sc, summoner: _item.summoner })),
        materialInfos,
        ignoreSummoningConditions,
        qty,
        validator,
        cancelable,
        _item.msg ?? msg
      );

      summonArgs.push(...selected);
    }

    if (!summonArgs.length) {
      return;
    }

    // 召喚素材をエンティティにセット
    summonArgs.forEach((args) => args.monster.info.materials.reset(...materialInfos));

    await DuelEntityShortHands.moveToXyzOwner(
      summonArgs[0].dest,
      summonArgs[0].monster,
      materialInfos.map((info) => info.material).filter((monster) => monster.kind === "XyzMaterial"),
      ["XyzMaterial", "Rule"],
      summonArgs[0].monster,
      effectOwner
    );

    await DuelEntity.summonMany(summonArgs, summonType, movedAs, actDefAttr.entity, effectOwner);

    return summonArgs.map((arg) => arg.monster);
  };
  public static readonly effectDamage = (args: { to: Duelist; point: number }[], chainBlockInfo: ChainBlockInfo<unknown>) => {
    if (!args.length) {
      return [];
    }

    const result = args.flatMap((item) => item.to._effectDamage(item.point, chainBlockInfo));

    const survivors = Object.values(args[0].to.duel.duelists).filter((duelist) => duelist.lp > 0);

    if (survivors.length === 1) {
      throw new DuelEnd(survivors[0], `${chainBlockInfo.action.toFullString()}により、${survivors[0].getOpponentPlayer().name}のライフポイントが0になった。`);
    }

    if (!survivors.length) {
      throw new DuelEnd(undefined, `${chainBlockInfo.action.toFullString()}により、お互いのライフポイントが0になった。`);
    }

    return result;
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
  public get name() {
    return this.profile.name;
  }
  public readonly profile: IDuelistProfile;
  public readonly deckInfo: IDeckInfo;
  public info: DuelistInfo;
  public readonly infoOrigin: DuelistInfo;
  public status: DuelistStatus;
  public readonly statusOrigin: DuelistStatus;
  public readonly duelistType: TDuelistType;
  public readonly lifeLog: LifeLogRecord[];
  private readonly actionBlackListForNPC: Readonly<TEntityActionType[]>;
  private _lp: number;
  public readonly initHand: Readonly<string[]>;
  public readonly chainConfig: ChainConfig;
  public constructor(duel: Duel, seat: TSeat, profile: IDuelistProfile, duelistType: TDuelistType, deckInfo: IDeckInfo, hand: string[] = []) {
    this.duel = duel;
    this.seat = seat;
    this.profile = profile;
    this.chainConfig = profile.chainConfig ?? {
      noticeSelfChain: true,
      noticeFreeChain: true,
    };
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

    const tmp: TEntityActionType[] = [];

    if (this.duelistType === "NPC") {
      if (this.profile.npcLvl < 0) {
        tmp.push("NormalSummon", "SpecialSummon", "SpellTrapSet");
      }
      if (this.profile.npcLvl < 1) {
        tmp.push("CardActivation", "IgnitionEffect", "TriggerEffect", "QuickEffect");
      }
      if (this.profile.npcLvl < 101) {
        tmp.push("DeclareAttack");
      }
      if (this.profile.npcLvl === Number.MAX_SAFE_INTEGER) {
        tmp.push("NormalSummon", "SpecialSummon", "SpellTrapSet", "DeclareAttack");
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
  public get canAddToHandFromGraveyard() {
    // TODO
    return true;
  }

  public readonly writeInfoLog = (text: string) => this.duel.log.info(text, this);

  public readonly writeChainBlockHeaderLog = (chainNumber: number, text: string) => this.duel.log.pushChainBlockHeaderLog(this, chainNumber, text);

  public readonly initForDrawPhase = () => {
    this.info = { ...this.infoOrigin };
  };
  public readonly canDiscard = (entities: DuelEntity[]) => {
    if (this.status.canDiscardAsCost)
      // TODO
      console.log(entities);
    return true;
  };
  public readonly canSendToGraveyard = (entities: DuelEntity[]) => {
    // TODO
    console.log(entities);
    return true;
  };
  public readonly canRelease = (entities: DuelEntity[]) => {
    // TODO
    console.log(entities);
    return true;
  };
  public get canSet() {
    // TODO
    return true;
  }

  /**
   * 対象の耐性などを考慮せず、行為を行えるかどうかの判定
   * @param target
   * @param procType
   * @param chainBlockInfo
   */
  public readonly canTryBanish = (target: DuelEntity, procType: TBanishProcType, action: CardActionDefinitionAttrs): boolean => {
    return this.entity.procFilterBundle.filter([procType], this, this.entity, action, [target]);
  };

  public readonly battleDamage = (
    point: number,
    damageSource: DuelEntity,
    suppressor: DuelEntity,
    chainBlockInfo: ChainBlockInfo<unknown>
  ): LifeLogRecord[] => {
    //MEMO 戦闘ダメージの場合、攻撃宣言したモンスターがダメージ元とは限らない
    const damageInfo = calcBattleDamage(point, chainBlockInfo.activator, this, damageSource, suppressor, chainBlockInfo.action);

    return this.damage(damageSource, damageInfo);
  };
  public readonly effectDamage = (point: number, chainBlockInfo: ChainBlockInfo<unknown>) => Duelist.effectDamage([{ to: this, point }], chainBlockInfo);

  private readonly _effectDamage = (point: number, chainBlockInfo: ChainBlockInfo<unknown>) =>
    this.damage(chainBlockInfo.action.entity, calcEffectDamage(point, chainBlockInfo, this));

  private readonly damage = (damageSource: DuelEntity, damageInfo: ReturnType<typeof calcBattleDamage>): LifeLogRecord[] => {
    const result: LifeLogRecord[] = [];

    if (damageInfo.point) {
      const diff = damageInfo.damageType === "Heal" ? damageInfo.point : damageInfo.point * -1;
      result.push(this.setLp(this._lp + diff, damageSource, damageInfo.damageType));
    }
    if (damageInfo.damageToOpponent1) {
      result.push(this.getOpponentPlayer().setLp(this._lp - damageInfo.damageToOpponent1, damageSource, damageInfo.damageType));
    }
    if (damageInfo.damageToOpponent2) {
      result.push(this.getOpponentPlayer().setLp(this._lp - damageInfo.damageToOpponent2, damageSource, damageInfo.damageType));
    }

    return result;
  };
  public readonly lostLp = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp - point, entity, "Lost");
  };
  public readonly payLp = (point: number, entity: DuelEntity): LifeLogRecord => {
    const records = this.setLp(this._lp - point, entity, "Pay");

    if (this.lp <= 0) {
      throw new DuelEnd(this.getOpponentPlayer(), `${entity.toString()}へのライフポイント支払いにより、${this.name}のライフポイントが0になった。`);
    }

    return records;
  };
  public readonly heal = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp + point, entity, "Heal");
  };
  public readonly setLp = (lp: number, entity?: DuelEntity, reason?: TLifeLogReason): LifeLogRecord => {
    const log = {
      duelist: this,
      clock: this.duel.clock.getClone(),
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
  public readonly getCells = (...cellTypeList: Readonly<DuelFieldCellType[]>): DuelFieldCell[] => {
    return this.duel.field.getCells(...cellTypeList).filter((cell) => cell.owner === this || cell.cardEntities[0]?.controller === this);
  };
  public readonly getHandCell = (): DuelFieldCell => {
    return this.getCells("Hand")[0];
  };
  public readonly getDeckCell = (): DuelFieldCell => {
    return this.getCells("Deck")[0];
  };
  public readonly getExtraDeck = (): DuelFieldCell => {
    return this.getCells("ExtraDeck")[0];
  };
  public readonly getGraveyard = (): DuelFieldCell => {
    return this.getCells("Graveyard")[0];
  };
  public readonly getFieldZone = (): DuelFieldCell => {
    return this.getCells("FieldSpellZone")[0];
  };
  public readonly getBanished = (): DuelFieldCell => {
    return this.getCells("Banished")[0];
  };
  public readonly getMonsterZones = (): DuelFieldCell[] => {
    return this.getCells("MonsterZone");
  };
  public readonly getExtraMonsterZones = (): DuelFieldCell[] => {
    return this.getCells("ExtraMonsterZone");
  };
  public readonly getSpellTrapZones = (): DuelFieldCell[] => {
    return this.getCells("SpellAndTrapZone");
  };
  public readonly getXyzMaterialZone = (): DuelFieldCell => {
    return this.getCells("XyzMaterialZone")[0];
  };
  public readonly getEmptyMonsterZones = (): DuelFieldCell[] => {
    return this.getMonsterZones().filter((cell) => cell.cardEntities.length === 0);
  };
  public readonly getAvailableMonsterZones = (): DuelFieldCell[] => {
    return this.getMonsterZones().filter((cell) => cell.isAvailable);
  };
  public readonly getAvailableExtraMonsterZones = (): DuelFieldCell[] => {
    // TODOエクストラリンク
    return this.getExtraMonsterZones().length === 0 ? this.duel.field.getCells("ExtraMonsterZone").filter((cell) => cell.isAvailable) : [];
  };
  public readonly getAvailableSpellTrapZones = (): DuelFieldCell[] => {
    return this.getSpellTrapZones().filter((cell) => cell.isAvailable);
  };
  public readonly getMonstersOnField = (): DuelEntity[] => {
    return this.duel.field.getMonstersOnFieldStrictly().filter((monster) => monster.controller === this);
  };
  public readonly getSpellTrapsOnField = (): DuelEntity[] => {
    return this.duel.field.getSpellTrapsOnFieldStrictly().filter((spelltrap) => spelltrap.controller === this);
  };
  public readonly getPendingMonstersOnField = (): DuelEntity[] => {
    return this.duel.field.getPendingMonstersOnField().filter((monster) => monster.controller === this);
  };
  public readonly getPendulumScaleMonsters = (): DuelEntity[] => {
    return this.duel.field
      .getCardsOnFieldStrictly()
      .filter((card) => card.isPendulumScale)
      .filter((card) => card.controller === this);
  };
  public readonly getPendulumScales = () => {
    const monsters = this.getPendulumScaleMonsters();
    if (monsters.length < 2) {
      return undefined;
    }

    const left = monsters.find((monster) => monster.cell.column === (this.seat === "Below" ? 1 : 5));
    const right = monsters.find((monster) => monster.cell.column === (this.seat === "Below" ? 5 : 1));

    if (!left || !right) {
      throw new SystemError("想定されない状態", monsters);
    }

    const psL = left.psR;
    const psR = right.psL;

    if (psL === undefined || psR === undefined) {
      throw new SystemError("想定されない状態", monsters);
    }

    return psL > psR ? { upperBound: psL, lowerBound: psR } : { upperBound: psR, lowerBound: psL };
  };
  public readonly getEntiteisOnField = (): DuelEntity[] => {
    return this.duel.field.getCardsOnFieldStrictly().filter((card) => card.controller === this);
  };

  public readonly pushDeck = (cardDefinitionsDic: { [name: string]: EntityDefinition }): void => {
    this.deckInfo.cardNames
      .map((name) => cardDefinitionsDic[name])
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
        throw new DuelEnd(this.getOpponentPlayer(), `${this.name}がデッキからカードをドローできなかった。`);
      }
      const card = deckCell.cardEntities[0];
      await card.draw(causedBy ? ["Effect"] : ["Rule"], causedBy, causedByWhome);

      cardNames.push(card.origin?.name || "!名称取得失敗!");
    }

    return;
  };
  public readonly summon = async (
    summonKind: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
    monster: DuelEntity,
    posList: Readonly<TBattlePosition[]>,
    cells: DuelFieldCell[],
    materialInfos: SummonMaterialInfo[],
    cancelable: boolean
  ): Promise<DuelEntity | undefined> => {
    const monsters =
      (await this.summonMany(
        this,
        summonKind,
        movedAs,
        actDefAttr,
        [{ monster, posList, cells }],
        materialInfos,
        false,
        1,
        (selected) => selected.length === 1,
        cancelable
      )) ?? [];
    return monsters[0];
  };
  public readonly waitSelectNumberFromRange = (title: string, min: number, max: number, cancelable: boolean) =>
    this.waitSelectNumber(title, getSequenceNumbers(min, max), cancelable);
  public readonly waitSelectNumber = (title: string, list: number[], cancelable: boolean) => this.duel.view.waitSelectNumber(this, title, list, cancelable);

  public readonly waitSelectEntities = (
    choices: DuelEntity[],
    qty: number | undefined,
    validator: (selected: DuelEntity[]) => boolean,
    message: string,
    cancelable: boolean = false
  ): Promise<DuelEntity[] | undefined> => {
    return this.duel.view.waitSelectEntities(this, { selectables: choices, qty, validator, cancelable }, message);
  };

  public readonly waitSelectEntity = async (choices: DuelEntity[], message: string, cancelable: boolean = false): Promise<DuelEntity | undefined> => {
    const selected = await this.waitSelectEntities(choices, 1, (selected) => selected.length === 1, message, cancelable);
    return selected ? selected[0] : undefined;
  };

  public readonly waitYesNo = (title: string) => this.duel.view.waitYesOrNo(this, title);
  public readonly waitSelectText = <C extends { seq: number; text: string }>(
    choises: C[],
    title: string,
    cancelable: boolean = false
  ): Promise<C | undefined> => this.duel.view.waitSelectText(this, choises, title, cancelable);

  public readonly getEnableActions = (
    enableCardPlayTypes: TEntityActionType[],
    enableSpellSpeeds: TSpellSpeed[],
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>
  ): ValidatedActionInfo[] => {
    const nextChainBlockFilter = chainBlockInfos.slice(-1)[0]?.nextChainBlockFilter ?? (() => true);

    return [...this.duel.field.getAllCardEntities(), this.entity]
      .flatMap((entity) => entity.actions)
      .filter((action) => action.canExecute(this))
      .filter((action) => enableSpellSpeeds.includes(action.spellSpeed))
      .filter((action) => enableCardPlayTypes.includes(action.playType))
      .filter((action) => !action.isWithChainBlock || nextChainBlockFilter(this, action))
      .map((action) => action.validate(this, chainBlockInfos))
      .filter((info): info is ValidatedActionInfo => info !== undefined);
  };

  public readonly discard = async (
    qty: number,
    reason: "Rule" | "Cost" | "Effect",
    filter: (entity: DuelEntity) => boolean = () => true,
    causedBy?: DuelEntity,
    activator?: Duelist,
    chooser?: Duelist,
    cancelable: boolean = false
  ): Promise<DuelEntity[] | undefined> => {
    const choices = this.getHandCell().cardEntities.filter(filter);

    if (choices.length < qty) {
      return [];
    }
    let selectedList = [] as DuelEntity[];
    if (choices.length === qty) {
      selectedList = choices;
    } else if ((chooser || this).duelistType === "NPC") {
      // NPCに選択権がある場合、ランダムに手札を捨てる。
      selectedList = choices.randomPickMany(qty);
    } else {
      const _selectedList = await this.duel.view.waitSelectEntities(
        chooser || this,
        { selectables: choices, qty, validator: (list) => list.length === qty, cancelable },
        `${qty}枚カードを捨てる。`
      );
      if (!_selectedList) {
        return;
      }
      selectedList = _selectedList;
    }
    this.writeInfoLog(`手札からカードを${selectedList.length}枚捨てた。${selectedList.map((e) => e.toString())}。`);

    await DuelEntityShortHands.discardManyForTheSameReason(selectedList, ["Discard", reason], causedBy, activator);

    return selectedList;
  };

  public readonly getEnableSummonList = (
    effectOwner: Duelist,
    summonType: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
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
        if (summonType !== "LinkSummon" || !this.duel.field.canExtraLink(item.monster, materialInfos)) {
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
      .map((item) => {
        if (item.monster.cell.cellType === "ExtraDeck") {
          // エクストラデッキからの特殊召喚の場合
          if (item.monster.status.monsterCategories?.includes("Link") || item.monster.status.monsterCategories?.includes("Pendulum")) {
            // リンクモンスターまたはペンデュラムモンスターの場合、エクストラモンスターゾーンまたはリンクマーカーの先にしか特殊召喚できない
            return {
              ...item,
              cells: item.cells.filter(
                (cell) =>
                  cell.cellType === "ExtraMonsterZone" ||
                  cell.linkArrowSources.filter((linkMonster) => !materialInfos.map((info) => info.material).includes(linkMonster)).length
              ),
            };
          }
        } else {
          //エクストラモンスターゾーンはエクストラデッキからの特殊召喚のみ使用可能
          return {
            ...item,
            cells: item.cells.filter((cell) => cell.cellType !== "ExtraMonsterZone"),
          };
        }
        return item;
      })
      .filter((item) => item.cells.length && item.posList.length)
      .map((item) => this.entity.summonFilterBundle.filter(effectOwner, summonType, movedAs, actDefAttr, item, materialInfos, ignoreSummoningConditions))
      .filter((item) => item.cells.length && item.posList.length)
      .map((item) => item.monster.summonFilterBundle.filter(effectOwner, summonType, movedAs, actDefAttr, item, materialInfos, ignoreSummoningConditions))
      .filter((item) => item.cells.length && item.posList.length)
      .map((item) =>
        materialInfos
          .map((info) => info.material.summonFilterBundle)
          .reduce((wip, bundle) => bundle.filter(effectOwner, summonType, movedAs, actDefAttr, wip, materialInfos, ignoreSummoningConditions), item)
      )
      .filter((item) => item.cells.length && item.posList.length);
  };

  private readonly prepareToSummonMany = async (
    effectOwner: Duelist,
    summonType: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
    summonChoices: SummonChoice[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean,
    qty: number | undefined,
    validator: (summoned: DuelEntity[]) => boolean,
    cancelable: boolean,
    msg: string = "特殊召喚するモンスターを選択。"
  ): Promise<SummonArg[]> => {
    const choices = this.getEnableSummonList(effectOwner, summonType, movedAs, actDefAttr, summonChoices, materialInfos, ignoreSummoningConditions);

    if (!choices.length) {
      return [];
    }

    let _choices = choices.map((choice) => {
      return { ...choice, cells: [...choice.cells], posList: [...choice.posList] };
    });
    const summonArgs: SummonArg[] = [];
    while (_choices.length && summonArgs.length < (qty ?? Number.MAX_SAFE_INTEGER)) {
      // キャンセル可能でまだ選択していないとき、または条件を満たしているときキャンセル可能
      const _cancelable = (cancelable && !summonArgs.length) || validator(summonArgs.map((arg) => arg.monster));
      let choice = _choices.randomPick();
      if (_choices.length > 1) {
        const monster = await this.waitSelectEntity(
          _choices.map((item) => item.monster),
          msg,
          _cancelable
        );

        if (!monster) {
          return summonArgs;
        }

        choice = _choices.find((choice) => choice.monster === monster) ?? choice;
      }
      let pos: TBattlePosition = [...choice.posList].randomPick();
      let dest: DuelFieldCell = [...choice.cells].randomPick();

      if (choice.cells.length || choice.posList.length) {
        // TODO NPCの場合
        if (this.duelistType !== "NPC") {
          const item = await this.duel.view.waitSelectSummonDestination(choice.summoner, choice.monster, choice.cells, choice.posList, _cancelable);
          if (!item) {
            return summonArgs;
          }
          dest = item.dest;
          pos = item.battlePosition;
        }
      }
      summonArgs.push({ summoner: this, monster: choice.monster, pos, dest });
      // 一足飛びにエクストラリンク成立まで進むことはありえないので、EXゾーンを使ったら以後は残りのEXゾーンも使用できない。
      const isExZoneFilled = dest.cellType === "ExtraMonsterZone";

      _choices.forEach((choice) => {
        choice.cells = choice.cells.filter((cell) => !summonArgs.map((arg) => arg.dest).includes(cell));
        if (isExZoneFilled) {
          choice.cells = choice.cells.filter((cell) => cell.cellType !== "ExtraMonsterZone");
        }
      });
      _choices = _choices.filter((_choice) => _choice !== choice).filter((_choice) => _choice.cells.length);
    }

    return summonArgs;
  };

  public readonly summonAll = (
    effectOwner: Duelist,
    summonType: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
    summonChoices: Omit<SummonChoice, "summoner">[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean,
    cancelable: boolean,
    msg?: string
  ) =>
    this.summonMany(
      effectOwner,
      summonType,
      movedAs,
      actDefAttr,
      summonChoices,
      materialInfos,
      ignoreSummoningConditions,
      summonChoices.length,
      (summoned) => summoned.length === summonChoices.length,
      cancelable,
      msg
    );
  public readonly summonOne = async (
    effectOwner: Duelist,
    summonType: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
    summonChoices: Omit<SummonChoice, "summoner">[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean,
    cancelable: boolean,
    msg?: string
  ) => {
    const result = await this.summonMany(
      effectOwner,
      summonType,
      movedAs,
      actDefAttr,
      summonChoices,
      materialInfos,
      ignoreSummoningConditions,
      1,
      (summoned) => summoned.length === 1,
      cancelable,
      msg
    );
    if (!result) {
      return;
    }
    return result[0];
  };

  public readonly summonMany = (
    effectOwner: Duelist,
    summonType: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
    summonChoices: Omit<SummonChoice, "summoner">[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean,
    qty: number | undefined,
    validator: (summoned: DuelEntity[]) => boolean,
    cancelable: boolean,
    msg?: string
  ) =>
    Duelist.summonMany(
      effectOwner,
      summonType,
      movedAs,
      actDefAttr,
      summonChoices.map((choice) => {
        return { ...choice, summoner: this };
      }),
      materialInfos,
      ignoreSummoningConditions,
      qty,
      validator,
      cancelable,
      msg
    );

  public readonly summonEachFields = (
    effectOwner: Duelist,
    summonType: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
    summonChoices: Omit<SummonChoice, "summoner">[],
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean,
    qty: number | undefined,
    validator: (summoned: DuelEntity[]) => boolean,
    cancelable: boolean
  ) =>
    Duelist._summonMany(
      effectOwner,
      summonType,
      movedAs,
      actDefAttr,
      [
        { duelist: this, msg: "自分" },
        { duelist: this.getOpponentPlayer(), msg: "相手" },
      ].map((item) => ({
        summoner: this,
        msg: `${item.msg}フィールドに特殊召喚するモンスターを選択。`,
        summonChoices: summonChoices.map((sc) => ({ ...sc, cells: sc.cells.filter((cell) => cell.owner === item.duelist) })),
      })),
      materialInfos,
      ignoreSummoningConditions,
      qty,
      validator,
      cancelable
    );
  public readonly selectAttackTargetForNPC = (attacker: DuelEntity, action: EntityAction<unknown>): DuelEntity | undefined => {
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
      return enemy.validateDestroy("Battle", this, attacker, action);
    });
  };

  public readonly selectActionForNPC = (
    actionInfos: ValidatedActionInfo[],
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>
  ): ResponseActionInfo | undefined => {
    // 発動可能な効果がなければ何もしない
    if (!actionInfos.length) {
      return;
    }

    // 強制効果がある場合、最優先で選択 ※重要
    const mandatoryEffects = actionInfos.filter((info) => info.action.isMandatory);
    if (mandatoryEffects.length) {
      return mandatoryEffects.randomPick();
    }

    let _actionInfos = actionInfos.filter((info) => !this.actionBlackListForNPC.includes(info.action.playType));
    // 優先度高を発動
    const highPriorities = _actionInfos
      .filter((info) => !Number.isNaN(info.action.priorityForNPC))
      .shuffle()
      .sort((left, right) => left.action.priorityForNPC - right.action.priorityForNPC);
    if (highPriorities.length) {
      return highPriorities[0];
    }

    // 誘発効果は発動しておけの精神
    const triggerEffects = _actionInfos.filter((info) => info.action.playType === "TriggerEffect");
    if (triggerEffects.length) {
      return triggerEffects.randomPick();
    }

    // メインフェイズ以外の起動効果は発動しておけの精神
    if (this.duel.phase !== "main1" && this.duel.phase !== "main2") {
      const ignitionEffect = _actionInfos.filter((info) => info.action.playType === "IgnitionEffect");
      if (ignitionEffect.length) {
        return ignitionEffect.randomPick();
      }
    }

    // 攻撃宣言がある場合、攻撃力の低いモンスターから戦闘破壊可能なモンスターを攻撃できるかチェックし、選択する
    const battleActions = _actionInfos
      .filter((info) => info.action.playType === "DeclareAttack")
      .sort((left, right) => (left.action.entity.atk ?? 0) - (right.action.entity.atk ?? 0));

    // 攻撃宣言のタイミングは、攻撃宣言しかできないのでここでreturnする。
    if (battleActions.length) {
      return battleActions.find((info) => this.selectAttackTargetForNPC(info.action.entity, info.action));
    }

    // 攻撃宣言は（念の為）この時点でフィルタリング
    _actionInfos = _actionInfos.filter((info) => info.action.playType !== "DeclareAttack");

    // 一つ前のブロックの発動者が自分ではない場合、無効化効果を探して実行する。
    const previousBlock = _actionInfos.length ? chainBlockInfos.slice(-1)[0] : undefined;
    const negationEffects = _actionInfos.filter((info) => info.action.negatePreviousBlock);
    if (previousBlock && previousBlock.activator !== this && negationEffects.length) {
      return negationEffects.randomPick();
    }

    // それ以外の場合、無効化効果は発動しないようにフィルタリング
    _actionInfos = _actionInfos.filter((info) => !info.action.negatePreviousBlock);

    // 発動可能な効果がなければ何もしない
    if (!_actionInfos.length) {
      return;
    }

    // 相手フィールドの状態取得
    const maxEnemyAtk =
      this.getOpponentPlayer()
        .getMonstersOnField()
        .filter((enemy) => enemy.battlePosition === "Attack")
        .map((enemy) => enemy.atk ?? 0)
        .max() ?? 1600;
    const minEnemyAtkDef =
      this.getOpponentPlayer()
        .getMonstersOnField()
        .map((enemy) => (enemy.battlePosition === "Set" ? 1500 : ((enemy.battlePosition === "Attack" ? enemy.atk : enemy.def) ?? 0)))
        .min() ?? 1500;

    const allies = this.getMonstersOnField();
    const maxAllyAtk =
      allies
        .filter((enemy) => enemy.battlePosition === "Attack")
        .map((enemy) => enemy.atk ?? 0)
        .max() ?? 0;

    // 攻撃表示への変更判断はメイン１、メイン２両方行う
    let posActions = _actionInfos
      .filter((info) => info.action.playType !== "ChangeBattlePosition")
      .filter((info) => info.action.entity.battlePosition !== "Attack")
      .filter(
        (info) => (info.action.entity.atk ?? 0) >= maxEnemyAtk || ((info.action.entity.atk ?? 0) > minEnemyAtkDef && (info.action.entity.atk ?? 0) > 2300)
      );
    if (posActions.length) {
      return posActions.randomPick();
    }

    // 魔法罠のセットと、表示形式の変更、手札誘発持ちの召喚特殊召喚は一旦選択肢から除外する
    _actionInfos = _actionInfos
      .filter((info) => info.action.playType !== "ChangeBattlePosition")
      .filter((info) => info.action.playType !== "SpellTrapSet")
      .filter(
        (info) =>
          info.action.entity.actions
            .filter((otherAction) => otherAction.playType !== "NormalSummon" && otherAction.playType !== "SpecialSummon")
            .flatMap((otherAction) => otherAction.executableCells)
            .every((ct) => ct !== "Hand") ||
          (info.action.playType !== "NormalSummon" && info.action.playType !== "SpecialSummon")
      );

    // 手札効果なし、リリースなしで通常召喚できるモンスターが居るなら出しとけの精神
    // 手札効果なし、特殊召喚できるモンスターも出しておけの精神
    // アドバンス召喚は、最大攻撃力以上であれば出す
    // 表側表示で使える効果は使っておけの精神
    const effects = [
      ..._actionInfos.filter((info) => info.action.playType === "NormalSummon").filter((info) => (info.action.entity.lvl ?? 12) < 5),
      ..._actionInfos.filter((info) => info.action.playType === "SpecialSummon"),
      ..._actionInfos
        .filter((info) => info.action.playType === "NormalSummon")
        .filter((info) => (info.action.entity.atk ?? 0) > 2600 || ((info.action.entity.atk ?? 0) > 2300 && (info.action.entity.lvl ?? 12) < 7))
        .filter((info) => (info.action.entity.atk ?? 0) >= maxAllyAtk),
      ..._actionInfos.filter((info) => info.action.entity.face === "FaceUp").filter((info) => info.action.entity.isOnFieldStrictly),
    ];

    if (effects.length) {
      return effects.randomPick();
    }

    // 召喚特殊召喚は除外
    _actionInfos = _actionInfos.filter((info) => info.action.playType !== "NormalSummon").filter((info) => info.action.playType !== "SpecialSummon");

    // メイン２である場合
    if (this.duel.phase === "main2") {
      // 守備表示への変更判断はメイン２のみ
      posActions = actionInfos
        .filter((info) => info.action.playType === "ChangeBattlePosition")
        .filter((info) => info.action.entity.battlePosition === "Attack")
        .filter(
          (info) => (info.action.entity.atk ?? 0) < maxEnemyAtk || ((info.action.entity.atk ?? 0) > minEnemyAtkDef && (info.action.entity.atk ?? 0) > 2300)
        );
      if (posActions.length) {
        return posActions.randomPick();
      }

      // 空きが二箇所以上なら、魔法罠のセットを行う
      if (this.getAvailableSpellTrapZones().length > 1) {
        return actionInfos
          .filter((info) => info.action.playType === "SpellTrapSet")
          .filter((info) => info.action.entity.kind !== "Spell" || info.action.entity.status.spellCategory === "QuickPlay")
          .randomPick();
      }
    }
    console.log(_actionInfos);

    // 残った行動を、残り数に応じてランダムに実行する。
    if (Math.random() < _actionInfos.length / 4) {
      return _actionInfos.randomPick();
    }
  };
}

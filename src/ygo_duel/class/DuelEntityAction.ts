import { faceupBattlePositions, type TBattlePosition } from "@ygo/class/YgoTypes";
import type { DuelFieldCell, DuelFieldCellType } from "./DuelFieldCell";
import { type Duelist } from "./Duelist";
import { DuelEntity, type TArrivalCauseReason } from "./DuelEntity";
import {
  cardActionChainableTypes,
  cardActionChainBlockTypes,
  cardActionRuleSummonTypes,
  EntityActionBase,
  type EntityActionDefinitionBase,
} from "./DuelEntityActionBase";
import type { IDuelClock } from "./DuelClock";
import { SystemError, type ResponseActionInfo } from "./Duel";
import { max } from "@stk_utils/funcs/StkMathUtils";
import { Statable, type IStatable } from "./DuelUtilTypes";

export const executableDuelistTypes = ["Controller", "Opponent"] as const;
export type TExecutableDuelistType = (typeof executableDuelistTypes)[number];

export type TSpellSpeed = "Normal" | "Quick" | "Counter" | "Dammy";
export const actionArrivalTriggerTags = [
  "IfNormarlSummonSucceed",
  "IfAdvanceSummonSucceed",
  "IfSpecialSummonSucceed",
  "IfFusionSummonSucceed",
  "IfRitualSummonSucceed",
  "IfSynchroSummonSucceed",
  "IfXyzSummonSucceed",
  "IfPendulumSummonSucceed",
  "IfLinkSummonSucceed",
  "IfFlipSummonSucceed",
  "IfFlip",
] as const;
export type TActionArrivalTriggerTags = (typeof actionArrivalTriggerTags)[number];

// TODO 要否検討
// const arrivalTagToReason: { [tag in TActionArrivalTriggerTags]: TArrivalCauseReason } = {
//   IfNormarlSummonSucceed: "NormalSummon",
//   IfAdvanceSummonSucceed: "AdvanceSummon",
//   IfSpecialSummonSucceed: "SpecialSummon",
//   IfFusionSummonSucceed: "FusionSummon",
//   IfRitualSummonSucceed: "RitualSummon",
//   IfSynchroSummonSucceed: "SynchroSummon",
//   IfXyzSummonSucceed: "XyzSummon",
//   IfPendulumSummonSucceed: "PendulumSummon",
//   IfLinkSummonSucceed: "LinkSummon",
//   IfFlipSummonSucceed: "FlipSummon",
//   IfFlip: "Flip",
// } as const;

// TODO 要否検討
// const arrivalReasonToTriggerTag = actionArrivalTriggerTags.reduce(
//   (wip, current) => {
//     wip[arrivalTagToReason[current]] = current;
//     return wip;
//   },
//   {} as { [tag in TArrivalCauseReason]: TActionArrivalTriggerTags }
// );

// TODO 要否検討
export const actionTriggerTags = [...actionArrivalTriggerTags, "IfDestroyed", "IfDoneByBattle", "IfDoneByEffect"] as const;
export type TActionTriggerTag = (typeof actionTriggerTags)[number];

export const actionTags = [
  "NormalSummon",
  "AdvanceSummon",
  "SpecialSummon",
  "SpecialSummonFromDeck", //うらら
  "SendToGraveyardFromDeck", //うらら
  "Draw", //うらら
  "SearchFromDeck", //うらら
  "BanishFromDeck", //今のところない？
  "BanishFromGraveyard", //わらし
  "AddToHandFromGraveyard", //わらし
  "ReturnToDeckFromGraveyard", //わらし
  "SpecialSummonFromGraveyard", //わらし
  "SpecialSummonFromBanished", //
  "ReturnToHandFromGraveyard", //
  "ReturnToHandFromField", //
  "BanishFromField", //今のところない？
  "BanishFromHand", //今のところない？
  "Destroy",
  "DestroyMultiple",
  "DestroyOnField", //スタダ
  "DestroyMultipleOnField", //大革命返し
  "DestroyOnOpponentField",
  "DestroyMultipleOnOpponentField", //スタロ
  "DestroyMonsterOnField", //悲劇の引き金（要対象確認）
  "DestroyMonstersOnField", //我が身を盾に
  "DestroySpellTrapOnField", //アヌビスの裁き
  "DestroySpellTrapsOnField", //アヌビスの裁き
  "SpecialSummonFromHand",
  "SpecialSummonFromExtraDeck",
  "SpecialSummonToken",
  "DamageToOpponent", //地獄の扉越し銃
  "DamageToSelf", //地獄の扉越し銃（セルフチェーン）
  "PayLifePoint", //キャッシュバック
  "DiscordAsCost",
  "DiscordAsEffect",
  "RollDice", //ダイスインパクト
  "BounceToHand", //リ・バウンド
  "NegateCardEffect",
  "NegateCardActivation",
  "NegateNormalSummon",
  "NegateSpecialSummon",
  ...actionTriggerTags,
] as const;
export type TActionTag = (typeof actionTags)[number];

export type SummonMaterialInfo = {
  material: DuelEntity;
  cell: DuelFieldCell;
  level?: number;
  link?: number;
  isAsTuner?: boolean;
  name?: string;
  isAsEffectCost?: boolean;
};
export const summonMaterialCostTypes = ["summonMaterialInfos"] as const;
export type TSummonMaterialCostType = (typeof summonMaterialCostTypes)[number];
export const NumericCostTypes = ["lifePoint", "xyzMaterial", "counter"] as const;
export type TNumericCostType = (typeof NumericCostTypes)[number];
export const entityCostTypes = ["discard", "banish", "release", "returnToDeck", "returnToHand", "sendToGraveyard"] as const;
export type TEntityCostType = (typeof entityCostTypes)[number];
export const CostTypes = [...NumericCostTypes, ...entityCostTypes, ...summonMaterialCostTypes] as const;
export type TCostType = (typeof CostTypes)[number];

export type ActionCostInfo = {
  [key in TCostType]?: key extends TNumericCostType ? number : key extends TSummonMaterialCostType ? SummonMaterialInfo[] : DuelEntity[];
};

export type DummyActionInfo = {
  action: ICardAction;
  dests: DuelFieldCell[];
  dest?: DuelFieldCell;
  battlePosition?: TBattlePosition;
  originSeq: number;
};
type TChainBlockInfoState = "unloaded" | "ready" | "processing" | "done" | "failed" | "nagated";
export type ChainBlockInfoBase<T> = {
  /**
   * 配列上のindex
   */
  index: number;
  /**
   * 表示上の番号
   */
  chainNumber: number | undefined;
  action: EntityAction<T>;
  activator: Duelist;
  targetChainBlock: ChainBlockInfo<unknown> | undefined;
  state: TChainBlockInfoState;
  dest: DuelFieldCell | undefined;
  ignoreCosts: boolean;
  data?: T;
};

export type ChainBlockInfoPreparing<T> = ChainBlockInfoBase<T> & {
  isActivatedIn: DuelFieldCell;
  isActivatedAt: IDuelClock;
  isNegatedActivationBy?: EntityAction<unknown>;
  isNegatedEffectBy?: EntityAction<unknown>;
  costInfo: ActionCostInfo;
  enableCellTypes: DuelFieldCellType[];
};

export type ChainBlockInfoPrepared = {
  selectedEntities: DuelEntity[];
  chainBlockTags: TActionTag[];
  appendix?: string[];
  /** 緊急同調など */
  nextActionInfo?: ResponseActionInfo;
  /** 超融合など */
  nextChainBlockFilter?: (activator: Duelist, action: EntityAction<unknown>) => boolean;
};
export type ChainBlockInfo<T> = ChainBlockInfoPreparing<T> & ChainBlockInfoPrepared & IStatable<TChainBlockInfoState>;

export type TriggerPatternBase = {
  triggerType: "Arrival" | "Departure";
  causerFilter?: (me: DuelEntity, causer: DuelEntity) => boolean;
  from?: Readonly<DuelFieldCellType[]>;
  needsJustNow?: boolean;
  needsByOpponent?: boolean;
  needsByEffect?: boolean;
};
export type ArrivalTriggerPattern = TriggerPatternBase & {
  triggerType: "Arrival";
  arrivalReasons: TArrivalCauseReason[];
  battlePositions?: TBattlePosition[];
};

export type DepartureTriggerPattern = TriggerPatternBase & {
  triggerType: "Departure";
  needsByDestory?: boolean;
  needsByBattle?: boolean;
};

export type TriggerPattern = ArrivalTriggerPattern | DepartureTriggerPattern;

export const isArrivalTriggerPattern = (triggerPattern: TriggerPattern): triggerPattern is ArrivalTriggerPattern => triggerPattern.triggerType === "Arrival";
export const isDepartureTriggerPattern = (triggerPattern: TriggerPattern): triggerPattern is DepartureTriggerPattern =>
  triggerPattern.triggerType === "Departure";

export type IrregularExecuteInfo = {
  executeBy: DuelEntity;
  costInfo: ActionCostInfo;
};

export type CardActionDefinitionAttrs = EntityActionDefinitionBase & {
  spellSpeed: TSpellSpeed;
  triggerPattern?: TriggerPattern;
  fixedTags?: TActionTag[];
  hasToTargetCards?: boolean;
  /**
   * コスト払う必要があるかどうか（コピー効果用）
   */
  needsToPayRegularCost?: boolean;
  /**
   * 光の護封剣などの例外のみ指定が必要
   */
  isLikeContinuousSpell?: boolean;

  /**
   *NPC用プロパティ
   */
  negatePreviousBlock?: boolean;

  /**
   * チェーンに乗らない召喚特殊召喚を無効にできるかどうか
   */
  negateSummon?: boolean;

  /**
   * チェーンチェック設定を無視して通知する
   */
  isNoticedForcibly?: boolean;
  /**
   * NPC用プロパティ
   */
  priorityForNPC?: number;

  // 夢幻泡影など
  canActivateCardDirectly?: boolean;
};

export type CardActionDefinitionFunctions<T> = {
  getEnableMaterialPatterns?: (myInfo: ChainBlockInfoBase<T>) => Generator<SummonMaterialInfo[]>;
  /**
   * コストの支払い可否判断
   * @param myInfo
   * @param chainBlockInfos
   * @returns
   */
  canPayCosts?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => boolean;
  /**
   * 発動条件判断
   * ※「自分フィールドに「ブラック・マジシャン」が存在する場合に発動できる。」など、コピー時に無視できることがある条件判断
   * @param myInfo
   * @param chainBlockInfos
   * @returns
   */
  meetsConditions?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => boolean;
  /**
   * 空撃ち判断など、発動に際して無視できない条件判断
   * @param myInfo
   * @param chainBlockInfos
   * @returns
   */
  canExecute?: (
    myInfo: ChainBlockInfoBase<T>,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    irregularExecuteInfo?: IrregularExecuteInfo
  ) => boolean | "RemoveMe";

  getTargetableEntities?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => DuelEntity[];

  /**
   * 発動時にドラッグ・アンド・ドロップ可能である場合の選択肢のcellを返す。
   * @param myInfo
   * @param chainBlockInfos
   * @returns 発動時にドラッグ・アンド・ドロップ可能である場合、選択肢のcellが返る。
   */
  getDests?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => DuelFieldCell[];

  payCosts?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => Promise<ActionCostInfo | undefined>;
  /**
   * 対象に取るなど
   * @param myInfo
   * @param chainBlockInfos
   * @param cancelable
   * @returns
   */
  prepare: (
    myInfo: ChainBlockInfoPreparing<T>,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    cancelable: boolean
  ) => Promise<Partial<ChainBlockInfoPrepared> | undefined>;
  /**
   * 実際の処理部分
   * @param myInfo
   * @param chainBlockInfos
   * @returns
   */
  execute: (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => Promise<boolean>;
  settle: (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => Promise<boolean>;
};

export type CardActionDefinition<T> = CardActionDefinitionAttrs & CardActionDefinitionFunctions<T>;
export type ValidatedActionInfo = {
  action: EntityAction<unknown>;
  dests: DuelFieldCell[];
  originSeq: number;
};

export interface ICardAction {
  title: string;
  entity: DuelEntity;
  seq: number;
  getClone: () => ICardAction;
}

export class EntityAction<T> extends EntityActionBase implements ICardAction {
  public static readonly createNew = <T>(entity: DuelEntity, definition: CardActionDefinition<T>) => {
    return new EntityAction<T>("AutoSeq", entity, definition);
  };

  private static readonly validateArrivalTrigger = (entity: DuelEntity, arrivalTriggerPattern: ArrivalTriggerPattern): boolean => {
    // タイミングを逃すかどうかのフラグ
    const needsJustNow = arrivalTriggerPattern.needsJustNow ?? false;

    if (!entity.hasBeenArrivalNow(arrivalTriggerPattern.arrivalReasons, arrivalTriggerPattern.battlePositions ?? faceupBattlePositions, needsJustNow)) {
      return false;
    }
    const record = entity.moveLog.latestArrivalRecord;
    if (!record) {
      throw new SystemError("想定されない状態");
    }
    if (arrivalTriggerPattern.needsByOpponent) {
      if (record.chooser === entity.controller) {
        return false;
      }
    }

    if (arrivalTriggerPattern.needsByEffect) {
      if (!record.movedAs.includes("Effect")) {
        return false;
      }
    }

    if (arrivalTriggerPattern.causerFilter) {
      if (!record.movedBy) {
        return false;
      }
      if (!arrivalTriggerPattern.causerFilter(entity, record.movedBy)) {
        return false;
      }
    }

    return true;
  };

  private static readonly validateDepartureTrigger = (entity: DuelEntity, departureTriggerPattern: DepartureTriggerPattern): boolean => {
    // タイミングを逃すかどうかのフラグ
    const needsJustNow = departureTriggerPattern.needsJustNow ?? false;
    // こちらの場合は最後のmoveLogをみるだけでいい（はず）
    const record = entity.moveLog.latestRecord;

    console.log(entity.toString(), entity.duel.clock.toFullString(), record.movedAt);
    if (!entity.duel.clock.isPreviousChain(record.movedAt)) {
      return false;
    }

    if (needsJustNow && !entity.duel.clock.isPreviousProc(record.movedAt)) {
      return false;
    }

    if (departureTriggerPattern.from) {
      if (!departureTriggerPattern.from.includes(entity.wasMovedFrom.cellType)) {
        return false;
      }
    }

    if (entity.cell.cellType === "Graveyard" && entity.wasMovedFrom.cellType === "Banished") {
      return false;
    }

    if (departureTriggerPattern.needsByDestory) {
      if (!record.movedAs.includes("Destroy")) {
        return false;
      }
    }
    if (departureTriggerPattern.needsByBattle || departureTriggerPattern.needsByEffect) {
      let flg = false;
      if (departureTriggerPattern.needsByBattle && record.movedAs.includes("Battle")) {
        flg = true;
      } else if (departureTriggerPattern.needsByEffect && record.movedAs.includes("Effect")) {
        flg = true;
      }
      if (!flg) {
        return false;
      }
    }
    if (departureTriggerPattern.needsByOpponent) {
      if (entity.wasMovedFrom.owner === entity.controller.getOpponentPlayer()) {
        return false;
      }

      if (record.actionOwner === entity.controller && !record.movedAs.includes("Battle")) {
        return false;
      }
    }

    if (departureTriggerPattern.causerFilter) {
      if (!record.movedBy) {
        return false;
      }
      if (!departureTriggerPattern.causerFilter(entity, record.movedBy)) {
        return false;
      }
    }

    return true;
  };
  /**
   * @param entity
   * @param title
   * @param cells
   * @param pos
   * @returns
   */
  public static readonly createDummyAction = (
    entity: DuelEntity,
    title: string,
    dests: DuelFieldCell[],
    battlePosition?: TBattlePosition,
    origin?: EntityActionBase
  ): DummyActionInfo => {
    const action = EntityAction.createNew(entity, {
      title: title,
      isMandatory: false,
      executableCells: [],
      executablePeriods: [],
      executableDuelistTypes: [],
      playType: "Dammy",
      spellSpeed: "Dammy",
      getDests: () => dests,
      prepare: async () => undefined,
      execute: async () => false,
      settle: async () => false,
    }) as ICardAction;

    // TODO   tmp.dragAndDropOnly = cells.length > 1;

    return { action, dests, battlePosition, originSeq: origin?.seq ?? -1 };
  };
  public override get definition() {
    return super.definition as Readonly<CardActionDefinition<T>>;
  }
  public get playType() {
    return this.definition.playType;
  }

  public get spellSpeed() {
    return this.definition.spellSpeed;
  }
  public get needsToPayRegularCosts() {
    return this.definition.needsToPayRegularCost ?? false;
  }

  public get hasToTargetCards() {
    return this.definition.hasToTargetCards ?? false;
  }

  public get isWithChainBlock() {
    return cardActionChainBlockTypes.some((t) => t === this.playType);
  }
  public get isChainable() {
    return cardActionChainableTypes.some((t) => t === this.playType);
  }
  public readonly getTargetableEntities = (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
    if (this.definition.hasToTargetCards && !this.definition.getTargetableEntities) {
      throw new SystemError(`処理定義が矛盾している。${this.toFullString()}`, this);
    }
    if (!this.definition.getTargetableEntities) {
      return [];
    }
    return this.definition.getTargetableEntities(myInfo, chainBlockInfos);
  };
  public get isLikeContinuousSpell() {
    return this.definition.isLikeContinuousSpell || (this.entity.isLikeContinuousSpell && this.playType === "CardActivation");
  }

  public get isNoticedForcibly() {
    return (
      this.isMandatory ||
      this.definition.playType === "TriggerEffect" ||
      this.definition.playType === "LingeringEffect" ||
      this.negatePreviousBlock ||
      this.negateSummon
    );
  }

  public get negatePreviousBlock() {
    return this.definition.negatePreviousBlock ?? false;
  }

  public get negateSummon() {
    return this.definition.negateSummon ?? false;
  }

  public get priorityForNPC() {
    return this.definition.priorityForNPC ?? Number.NaN;
  }

  public readonly toString = () => {
    if (this.playType === "CardActivation") {
      return "カードの発動";
    }
    if (this.isWithChainBlock) {
      return `«${this.title}»`;
    }
    return this.title;
  };
  public readonly toFullString = () => {
    return `${this.entity.toString()}の${this.toString()}`;
  };

  /**
   * 素材情報に制限を加えて実行するときに使用する。
   */
  private readonly addhocMaterialLimitation: (materialInfos: SummonMaterialInfo[]) => boolean;

  protected constructor(
    seq: "AutoSeq" | number,
    entity: DuelEntity,
    definition: CardActionDefinition<T>,
    addhocMaterialLimitation?: (materialInfos: SummonMaterialInfo[]) => boolean
  ) {
    super(seq, entity, definition);
    this.addhocMaterialLimitation = addhocMaterialLimitation ?? (() => true);
  }

  public readonly getClone = (addhocMateriallimitation?: (materialInfos: SummonMaterialInfo[]) => boolean) => {
    return new EntityAction<T>(this.seq, this.entity, this.definition, addhocMateriallimitation);
  };

  public *getEnableMaterialPatterns(myInfo: ChainBlockInfoBase<T>) {
    if (this.definition.getEnableMaterialPatterns) {
      yield* this.definition.getEnableMaterialPatterns(myInfo).filter(this.addhocMaterialLimitation);
    }
  }

  public readonly validate = (
    activator: Duelist,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    options: ("IgnoreRegularCosts" | "IgnoreConditions" | "CopyEffectOnly" | "")[] = [],
    irregularExecuteInfo?: {
      executeBy: DuelEntity;
      costInfo: ActionCostInfo;
    }
  ): ValidatedActionInfo | undefined => {
    const ignoreRegularCosts = options.includes("IgnoreRegularCosts");
    const ignoreConditions = options.includes("IgnoreConditions");
    const copyEffectOnly = options.includes("CopyEffectOnly");

    if (this.isWithChainBlock && !this.entity.status.canActivateEffect) {
      return;
    }

    if (ignoreRegularCosts && this.needsToPayRegularCosts) {
      return;
    }

    if (!this.validateCount(activator, chainBlockInfos, irregularExecuteInfo)) {
      return;
    }

    const maxChainNumber = max(0, ...chainBlockInfos.map((info) => info.chainNumber ?? -1));

    const myInfo: ChainBlockInfoBase<T> = {
      index: chainBlockInfos.length,
      chainNumber: this.isWithChainBlock ? maxChainNumber + 1 : undefined,
      action: this,
      activator: activator,
      targetChainBlock: chainBlockInfos.slice(-1)[0],
      state: "unloaded",
      dest: undefined,
      ignoreCosts: false,
    };

    if (this.definition.canPayCosts && !ignoreRegularCosts) {
      if (!this.definition.canPayCosts(myInfo, this.playType === "AfterChainBlock" ? [] : chainBlockInfos)) {
        return;
      }
    }
    if (this.definition.triggerPattern) {
      if (isArrivalTriggerPattern(this.definition.triggerPattern)) {
        if (!EntityAction.validateArrivalTrigger(this.entity, this.definition.triggerPattern)) {
          return;
        }
      } else if (isDepartureTriggerPattern(this.definition.triggerPattern)) {
        if (!EntityAction.validateDepartureTrigger(this.entity, this.definition.triggerPattern)) {
          return;
        }
      }
    }
    if (this.definition.meetsConditions && !ignoreConditions) {
      if (!this.definition.meetsConditions(myInfo, this.playType === "AfterChainBlock" ? [] : chainBlockInfos)) {
        return;
      }
    }
    if (this.definition.canExecute) {
      const canExecute = this.definition.canExecute(myInfo, this.playType === "AfterChainBlock" ? [] : chainBlockInfos, irregularExecuteInfo);
      if (canExecute === "RemoveMe") {
        this.entity.actions.reset(...this.entity.actions.filter((action) => action.seq !== this.seq));
        return;
      }
      if (!canExecute) {
        return;
      }
    }

    const dests: DuelFieldCell[] = [];
    if (this.definition.getDests) {
      dests.push(...this.definition.getDests(myInfo, this.playType === "AfterChainBlock" ? [] : chainBlockInfos));
    }

    if (this.playType === "CardActivation" && !copyEffectOnly) {
      const _dests = this.getDestForCardActivation(activator);
      if (!_dests) {
        return;
      }
      dests.push(..._dests);
    } else if (this.playType === "SpellTrapSet") {
      if (this.entity.status.spellCategory === "Field") {
        dests.push(activator.getFieldZone());
      } else {
        dests.push(...activator.getAvailableSpellTrapZones());
      }
    }
    return { action: this as EntityAction<unknown>, dests, originSeq: this.seq };
  };

  public readonly validateCount = (
    activator: Duelist,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    irregularExecuteInfo?: IrregularExecuteInfo
  ): boolean => {
    // TODO https://yugioh-wiki.net/index.php?%A5%AB%A1%BC%A5%C9%CC%BE%A4%F2%BB%D8%C4%EA%A4%B7%A4%BF%A3%B1%A5%BF%A1%BC%A5%F3%A4%CB%A3%B1%C5%D9
    if (irregularExecuteInfo) {
      return true;
    }

    // このチェーン上で、同一の効果が発動している回数をカウント。
    const currentChainCount = chainBlockInfos.filter((info) => this.isSameGroup(info.action)).length;
    if (this.isOnlyNTimesPerDuel > 0) {
      if (
        this.entity.field.duel.chainBlockLog.records
          .filter((rec) => !rec.chainBlockInfo.isNegatedActivationBy)
          .filter((rec) => this.isSameGroup(rec.chainBlockInfo.action))
          .filter((rec) => rec.chainBlockInfo.activator === activator).length +
          currentChainCount >=
        this.isOnlyNTimesPerDuel
      ) {
        return false;
      }
    }
    if (this.isOnlyNTimesPerTurn > 0) {
      if (
        this.entity.field.duel.chainBlockLog.records
          .filter((rec) => !rec.chainBlockInfo.isNegatedActivationBy)
          .filter((rec) => this.isSameGroup(rec.chainBlockInfo.action))
          .filter((rec) => rec.clock.turn === this.entity.field.duel.clock.turn)
          .filter((rec) => rec.chainBlockInfo.activator === activator).length +
          currentChainCount >=
        this.isOnlyNTimesPerTurn
      ) {
        return false;
      }
    }
    if (this.isOnlyNTimesPerChain > 0 && currentChainCount >= this.isOnlyNTimesPerChain) {
      return false;
    }

    // このターンに発動した回数を加算
    const count = currentChainCount + this.entity.counterHolder.getActionCount(this);

    if (this.isOnlyNTimesPerTurnIfFaceup > 0 && count >= this.isOnlyNTimesPerTurnIfFaceup) {
      return false;
    }
    if (this.isOnlyNTimesIfFaceup > 0 && count >= this.isOnlyNTimesIfFaceup) {
      return false;
    }
    return true;
  };

  private readonly getDestForCardActivation = (activator: Duelist): DuelFieldCell[] | undefined => {
    // 発動待機中は不可
    if (this.entity.info.isPending) {
      return;
    }
    // 破壊予定の場合は不可
    if (this.entity.info.isDying) {
      return;
    }
    // セットされたターンは発動不可
    if (this.entity.info.isSettingSickness) {
      return;
    }
    // フィールドの場合、セット状態であれば可、それ以外は不可
    if (this.entity.isOnFieldAsSpellTrapStrictly) {
      return this.entity.face === "FaceDown" ? [] : undefined;
    }

    // フィールドにも手札にもない場合、不可
    if (this.entity.cell.cellType !== "Hand") {
      return;
    }

    //手札からの発動はレッド・リブートなどの特別な場合か、ターンプレイヤーのみ可能
    if (this.definition.canActivateCardDirectly || !activator.isTurnPlayer) {
      return;
    }

    // フィールド魔法は可
    if (this.entity.status.spellCategory === "Field") {
      return [activator.getFieldZone()];
    }

    let availableCells = activator.getAvailableSpellTrapZones();
    if (this.entity.status.monsterCategories?.includes("Pendulum")) {
      // ペンデュラムの場合、発動先はペンデュラムゾーンのみ
      availableCells = availableCells.filter((cell) => cell.isAvailableForPendulum);
    }
    return availableCells;
  };

  public readonly prepare = async (
    activator: Duelist,
    dest: DuelFieldCell | undefined,
    targetChainBlock: ChainBlockInfo<unknown> | undefined,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    cancelable: boolean,
    ignoreCosts: boolean
  ): Promise<ChainBlockInfo<T> | undefined> => {
    /**
     * ドラッグ・アンド・ドロップで指定されたセル。魔法罠の発動セット位置に使用された場合、以降の処理には伝達しない
     */
    let _dest = dest;

    /**
     * キャンセル可能かどうか。キャンセル不可となる処理以降はfalseに設定される。
     * 例えば、魔法・罠カードの発動やセットは、コスト支払い前に移動処理を行うため、キャンセル不可となる。
     */
    let _cancelable = cancelable;

    // チェーン番号を設定
    const chainNumber = this.isWithChainBlock ? max(0, ...chainBlockInfos.map((info) => info.chainNumber ?? -1)) + 1 : undefined;

    // 発動ログの書き出し用変数
    let logText = "";

    // 発動ログの順番を操作するため、一旦callbackを配列に格納しておく。
    const setupCallbacks: (() => Promise<unknown>)[] = [];

    if (this.playType === "CardActivation" || this.playType === "SpellTrapSet") {
      if (this.entity.cell.cellType === "Hand") {
        //魔法・罠・ペンデュラムスケールのカードの発動またはセットの場合、コスト支払いの前に移動処理を行う。

        let availableCells = this.entity.status.spellCategory === "Field" ? [activator.getFieldZone()] : activator.getAvailableSpellTrapZones();

        if (this.entity.status.monsterCategories?.includes("Pendulum")) {
          // ペンデュラムの場合、発動先はペンデュラムゾーンのみ
          availableCells = availableCells.filter((cell) => cell.isAvailableForPendulum);
        }
        if (_dest && availableCells.includes(_dest)) {
          // ドラッグ・アンド・ドロップが移動先の指定として行われていた場合、置き換え
          availableCells = [_dest];
          // 以降の処理に渡さないために初期化
          _dest = undefined;
        }

        if (this.entity.status.spellCategory === "Field") {
          // フィールド魔法を手札から発動する場合、既存のフィールドがあれば上書き
          const olds = activator.getFieldZone().cardEntities;
          if (olds.length) {
            const oldOne = olds[0];
            setupCallbacks.push(async () => {
              await oldOne.sendToGraveyard(["Rule"], this.entity, activator);
              activator.writeInfoLog(`フィールド魔法の上書きにより、${oldOne.toString()}は墓地に送られた。`);
            });
            _cancelable = false;
          }
        }

        let dest = availableCells[0];

        if (availableCells.length > 1) {
          dest = availableCells.randomPick();
          const actionTitle = this.playType === "SpellTrapSet" ? "セット" : "カードの発動";
          const _dest = await this.duel.view.waitSelectDestination(
            activator,
            this.entity,
            availableCells,
            "カードを移動先へドラッグ",
            actionTitle,
            _cancelable
          );
          if (!_dest) {
            return;
          }
          dest = _dest;
        }

        logText += `手札から`;
        if (this.playType === "SpellTrapSet") {
          logText += "魔法・罠カードをセット。";
        } else {
          logText += `${this.entity.toString()}を発動。`;
        }

        _cancelable = false;
        if (this.playType === "CardActivation") {
          this.entity.info.isPending = true;
        }
        if (this.entity.status.monsterCategories?.includes("Pendulum")) {
          setupCallbacks.push(() => this.entity.activateAsPendulumScale(dest, ["CardActivation"], this.entity, activator));
        } else if (this.playType === "CardActivation") {
          setupCallbacks.push(() => this.entity.activateSpellTrapFromHand(dest, this.entity.kind, ["CardActivation"], this.entity, activator));
        } else {
          setupCallbacks.push(() => this.entity.setAsSpellTrap(dest, this.entity.kind, ["SpellTrapSet"], this.entity, activator));
        }
      } else if (this.entity.isOnField && this.entity.face === "FaceDown") {
        logText += `セットされていた${this.entity.toString()}を発動。`;

        _cancelable = false;
        if (this.playType === "CardActivation") {
          this.entity.info.isPending = true;
        }

        // セット状態からの発動ならば、表にする。
        setupCallbacks.push(() => this.entity.setNonFieldMonsterPosition(this.entity.origin.kind, "FaceUp", ["Rule"]));
      } else {
        logText = "";
      }
    } else if (chainNumber !== undefined) {
      logText += `${this.toFullString()}を発動。`;
    }

    // キャンセルされる可能性があるので、ログの書き出しを保留状態にする。
    using logTransaction = this.duel.log.openTransaction();

    // 発動ログの書き出し
    if (logText && chainNumber) {
      activator.writeChainBlockHeaderLog(chainNumber, logText);
    }
    // プールしていた処理を実行する。
    for (const callback of setupCallbacks) {
      await callback();
    }

    // チェーンブロック情報の準備
    const myInfo: ChainBlockInfoPreparing<T> = {
      index: chainBlockInfos.length,
      chainNumber,
      action: this,
      activator: activator,
      targetChainBlock,
      isActivatedIn: this.entity.cell,
      isActivatedAt: this.duel.clock.getClone(),
      enableCellTypes: [...this.entity.info.isEffectiveIn],
      costInfo: {},
      state: "ready",
      dest: _dest,
      ignoreCosts: false,
    };

    if (this.definition.payCosts && !ignoreCosts) {
      const costInfo = await this.definition.payCosts(myInfo, chainBlockInfos, _cancelable);
      if (!costInfo) {
        return;
      }
      myInfo.costInfo = costInfo;
      _cancelable = false;
    }

    // 準備
    const prepared = await this.definition.prepare(myInfo, chainBlockInfos, _cancelable);
    if (prepared === undefined) {
      return;
    }

    // ここまでの情報を元に、ChainBlockInfoを作成する。
    const _prepared = { ...prepared };
    _prepared.selectedEntities = _prepared.selectedEntities ?? [];
    _prepared.chainBlockTags = [...(_prepared.chainBlockTags ?? []), ...(this.definition.fixedTags ?? [])];

    if (_prepared.chainBlockTags.some((tag) => tag.startsWith("SpecialSummon"))) {
      _prepared.chainBlockTags.push("SpecialSummon");
    }

    _prepared.chainBlockTags = _prepared.chainBlockTags.getDistinct();

    if (cardActionRuleSummonTypes.some((type) => type === this.playType)) {
      const tmpFilter = prepared.nextChainBlockFilter ?? (() => true);
      _prepared.nextChainBlockFilter = (activator, action) => action.negateSummon && tmpFilter(activator, action);
    }

    const _result: Partial<ChainBlockInfo<T>> = new Statable<TChainBlockInfoState>(myInfo.state);
    const temp = { ..._prepared, ...myInfo };
    (Object.keys(temp) as (keyof typeof temp)[])
      .filter((key) => key !== "state")
      .forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        _result[key] = temp[key];
      });
    const result = _result as ChainBlockInfo<T>;

    // ログの書き出し停止を解除
    logTransaction.commit();

    return result;
  };

  public readonly execute = async (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, options?: { indirectly?: boolean }) => {
    const indirectly = options?.indirectly ?? false;

    if (myInfo.action.isLikeContinuousSpell && (myInfo.action.entity.face === "FaceDown" || !myInfo.action.entity.isOnField)) {
      // 永続魔法類は、フィールドに表側表示で存在しないと処理できない。
      this.entity.info.isPending = false;
      myInfo.state = "failed";
      return false;
    }

    myInfo.state = "processing";

    let result = false;

    if (!indirectly && myInfo.chainNumber) {
      myInfo.activator.writeChainBlockHeaderLog(myInfo.chainNumber, `${myInfo.action.toFullString()}の効果処理。`);
    }

    // 有効無効判定
    if (myInfo.isNegatedActivationBy) {
      myInfo.state = "nagated";
      // 発動無効時は全ての処理を行わない
      if (myInfo.chainNumber) {
        myInfo.activator.writeInfoLog(
          `チェーン${myInfo.chainNumber}: ${myInfo.action.toFullString()}を${myInfo.isNegatedActivationBy.toFullString()}によって発動が無効にされた。`
        );
      }
    } else {
      // 効果無効時は後処理のみ行う

      // カードの効果が有効かどうか
      let isEffective = myInfo.action.entity.isEffective;

      // ログ出力するテキストを用意
      let nagationText = "";

      if (isEffective) {
        if (myInfo.isNegatedEffectBy) {
          // うららなどの効果処理のみ無効にするタイプ
          nagationText = `チェーン${myInfo.chainNumber}: ${myInfo.action.toFullString()}を${myInfo.isNegatedEffectBy.toFullString()}によって効果を無効にした。`;
          isEffective = false;
        } else if (this.isWithChainBlock && !myInfo.enableCellTypes.includes(myInfo.isActivatedIn.cellType)) {
          // 発動時にエフェクト・ヴェーラーなどに発動場所を参照する無効が適用されていた場合、移動ログを検索する。
          const moveLogRecord = myInfo.action.entity.moveLog.records.findLast((rec) => rec.face === "FaceDown" && rec.orientation === "Horizontal");

          // 同じチェーン中に、一度以上裏守備を経由していればいいはず
          // TODO 要検討
          isEffective = (moveLogRecord && myInfo.activator.duel.clock.isSameChain(moveLogRecord.movedAt)) ?? false;
        }
      }

      // 有効であれば、効果処理を行う。
      if (isEffective) {
        result = await this.definition.execute(myInfo, chainBlockInfos);
        myInfo.state = result ? "done" : "failed";
      } else {
        myInfo.state = "nagated";
        if (myInfo.chainNumber) {
          nagationText =
            nagationText || `チェーン${myInfo.chainNumber}: カードの効果が無効となっているため${myInfo.action.toFullString()}の効果処理を行えない。`;
        }
        myInfo.activator.writeInfoLog(nagationText);
      }

      // TODO 確認：永続魔法類の発動時の効果処理と適用開始はどちらが先か？
      // 一旦、早すぎた埋葬に便利なので、効果処理を先に行う。
      await this.entity.determine();

      // 誓約効果などの適用
      if (this.isOnlyNTimesPerTurnIfFaceup > 0) {
        this.entity.counterHolder.incrementActionCountPerTurn(this);
      } else if (this.isOnlyNTimesIfFaceup > 0) {
        this.entity.counterHolder.incrementActionCount(this);
      }
      this.definition.settle(myInfo, chainBlockInfos);
    }
    return result;
  };
  /**
   * 緊急同調など
   * @param activator
   * @param ignoreCost
   * @returns
   */
  public readonly directExecute = async (activator: Duelist, targetChainBlock: ChainBlockInfo<unknown> | undefined, ignoreCost: boolean) => {
    // チェーンブロック情報の準備
    const myInfo = await this.prepare(activator, undefined, targetChainBlock, [], false, ignoreCost);
    if (!myInfo) {
      throw new SystemError("想定されない状態", this, activator, ignoreCost);
    }
    activator.duel.chainBlockLog.push(myInfo);
    return await this.execute(myInfo, []);
  };

  public readonly isSame = (other: EntityAction<unknown>) => this.entity.origin.name === other.entity.origin.name && this.title === other.title;
  public readonly isSameGroup = (other: EntityAction<unknown>) =>
    this.actionGroupName ? this.entity.origin.name === other.entity.origin.name && this.actionGroupName === other.actionGroupName : this.isSame(other);

  public readonly calcChainBlockTagsForDestroy = (activator: Duelist, entities: DuelEntity[]): TActionTag[] => {
    if (!actionTags.length) {
      return [];
    }
    const tags: TActionTag[] = ["Destroy"];

    if (actionTags.length > 1) {
      tags.push("DestroyMultiple");
    }

    const cardsOnFields = entities.filter((card) => card.isOnFieldStrictly);

    if (cardsOnFields.length) {
      tags.push("DestroyOnField");
      if (cardsOnFields.length > 1) {
        tags.push("DestroyMultipleOnField");
      }
    }
    const monstersOnField = cardsOnFields.filter((card) => card.kind === "Monster");

    if (monstersOnField.length) {
      tags.push("DestroyMonsterOnField");
      if (monstersOnField.length > 1) {
        tags.push("DestroyMonstersOnField");
      }
    }

    const spellTraps = cardsOnFields.filter((card) => card.kind !== "Monster");
    if (spellTraps.length) {
      tags.push("DestroySpellTrapOnField");
      if (monstersOnField.length > 1) {
        tags.push("DestroySpellTrapsOnField");
      }
    }
    const cardsOnOpponentField = cardsOnFields.filter((card) => card.controller !== activator);
    if (cardsOnOpponentField.length) {
      tags.push("DestroyOnOpponentField");
      if (cardsOnOpponentField.length > 1) {
        tags.push("DestroyMultipleOnOpponentField");
      }
    }

    return tags;
  };
}

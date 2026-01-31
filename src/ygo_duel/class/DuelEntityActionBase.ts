import { type TExecutableDuelistType } from "@ygo_duel/class/DuelEntityAction";
import { duelEntityFaces, type DuelEntity, type TDuelEntityFace } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import type { Duelist } from "@ygo_duel/class/Duelist";
import type { TDuelPeriodKey } from "@ygo_duel/class/DuelPeriod";

export const cardActionRuleSummonTypes = ["NormalSummon", "SpecialSummon", "FlipSummon"] as const;
export type TCardActionRuleSummonType = (typeof cardActionRuleSummonTypes)[number];

export const cardActionChainBlockTypes = ["IgnitionEffect", "TriggerEffect", "QuickEffect", "CardActivation"] as const;
export type TCardActionChainBlockType = (typeof cardActionChainBlockTypes)[number];
export const cardActionChainableTypes = [...cardActionRuleSummonTypes, ...cardActionChainBlockTypes, "DeclareAttack"] as const;
export type TCardActionChainableTypes = (typeof cardActionChainableTypes)[number];
export const cardActionNonChainBlockTypes = ["ChangeBattlePosition", "SpellTrapSet", "LingeringEffect", "Battle", "ContinuousPeriodAction"] as const;
export type TCardActionNonChainBlockType = (typeof cardActionNonChainBlockTypes)[number];
export type TCardActionType =
  | TCardActionChainableTypes
  | TCardActionNonChainBlockType
  | "Dammy"
  | "RuleDraw"
  | "SystemPeriodAction"
  | "AfterChainBlock"
  | "Exodia";
export type TEntityActionType = TCardActionType | "ContinuousEffect";
export const effectActiovationTypes = ["CardActivation", "EffectActivation", "NonActivate"] as const;
export type TEffectActiovationType = (typeof effectActiovationTypes)[number];
export const getEffectActiovationType = (actionType: TEntityActionType): TEffectActiovationType => {
  if (actionType === "CardActivation") {
    return "CardActivation";
  }

  if (cardActionChainBlockTypes.some((at) => at === actionType)) {
    return "EffectActivation";
  }

  return "NonActivate";
};

export const effectCountUpperBoundKeys = [
  "isOnlyNTimesPerTurn",
  "isOnlyNTimesPerDuel",
  "isOnlyNTimesPerTurnIfFaceup",
  "isOnlyNTimesPerChain",
  "isOnlyNTimesIfFaceup",
] as const;
export type TEffectCountUpperBoundKey = (typeof effectCountUpperBoundKeys)[number];

export type EntityActionDefinitionBase = {
  title: string;
  playType: TEntityActionType;
  isMandatory: boolean;
  executableFaces?: Readonly<TDuelEntityFace[]>;
  executableCells: Readonly<DuelFieldCellType[]>;
  executablePeriods: Readonly<TDuelPeriodKey[]>;
  executableDuelistTypes?: Readonly<TExecutableDuelistType[]>;
  actionGroupName?: string;
} & { [key in TEffectCountUpperBoundKey]?: number };

export type EntityActionExecuteInfo = {
  action: EntityActionBase;
  activator: Duelist;
  selectedEntities: DuelEntity[];
};

export class EntityActionBase {
  private static nextSeq = 0;
  public readonly seq: number;
  public readonly entity: DuelEntity;
  private readonly _definition: EntityActionDefinitionBase;
  protected get definition() {
    return this._definition;
  }
  public get title() {
    return this.definition.title;
  }
  public get playType() {
    return this.definition.playType;
  }
  public get isMandatory() {
    return this.definition.isMandatory;
  }
  public get executableCells() {
    return this.definition.executableCells;
  }
  public get executablePeriods() {
    return this.definition.executablePeriods;
  }
  public get executableFaces() {
    return this.definition.executableFaces ?? duelEntityFaces;
  }
  public get executableDuelistTypes() {
    return this.definition.executableDuelistTypes ?? ["Controller"];
  }
  public get isOnlyNTimesPerDuel() {
    return this.definition.isOnlyNTimesPerDuel ?? 0;
  }

  public get isOnlyNTimesPerTurn() {
    return this.definition.isOnlyNTimesPerTurn ?? 0;
  }
  public get isOnlyNTimesPerTurnIfFaceup() {
    return this.definition.isOnlyNTimesPerTurnIfFaceup ?? 0;
  }
  public get isOnlyNTimesIfFaceup() {
    return this.definition.isOnlyNTimesIfFaceup ?? 0;
  }
  public get isOnlyNTimesPerChain() {
    return this.definition.isOnlyNTimesPerChain ?? 0;
  }

  /**
   * 表示用。複合条件を考慮していないので、処理の判定に使用するのは不可
   */
  public get actionCountUpperBoundKey() {
    return effectCountUpperBoundKeys.find((key) => this[key]);
  }

  /**
   * 表示用。複合条件を考慮していないので、処理の判定に使用するのは不可
   */
  public get actionCountUpperBound() {
    const key = this.actionCountUpperBoundKey;

    if (!key) {
      return undefined;
    }

    return this[key];
  }

  /**
   * 表示用。複合条件を考慮していないので、処理の判定に使用するのは不可
   */
  public get actionCount(): number | undefined {
    const key = this.actionCountUpperBoundKey;

    if (!key) {
      return undefined;
    }

    if (key === "isOnlyNTimesIfFaceup" || key === "isOnlyNTimesPerTurnIfFaceup") {
      return this.entity.counterHolder.getActionCount(this);
    }

    // このチェーン上で、同一の効果が発動している回数をカウント。
    const currentChainCount = this.duel.chainBlockInfos.filter((info) => this.isSameGroup(info.action)).length;

    if (key === "isOnlyNTimesPerChain") {
      return currentChainCount;
    }

    let records = this.duel.chainBlockLog.records;

    if (key === "isOnlyNTimesPerTurn") {
      records = records.filter((rec) => rec.clock.turn === this.duel.clock.turn);
    }

    const count = records
      .filter((rec) => !rec.chainBlockInfo.isNegatedActivationBy)
      .filter((rec) => this.isSameGroup(rec.chainBlockInfo.action))
      .filter((rec) => rec.chainBlockInfo.activator === this.entity.controller).length;
    return count + currentChainCount;
  }

  public get actionGroupName() {
    return this.definition.actionGroupName;
  }

  public get duel() {
    return this.entity.duel;
  }
  public readonly validateDuelist = (duelist: Duelist) =>
    this.entity.controller === duelist ? this.executableDuelistTypes.includes("Controller") : this.executableDuelistTypes.includes("Opponent");

  protected constructor(seq: "AutoSeq" | number, entity: DuelEntity, definition: EntityActionDefinitionBase) {
    this.seq = seq === "AutoSeq" ? EntityActionBase.nextSeq++ : seq;
    this.entity = entity;
    this._definition = definition;
  }

  public readonly isSame = (other: EntityActionBase) => this.entity.origin.name === other.entity.origin.name && this.title === other.title;
  public readonly isSameGroup = (other: EntityActionBase) =>
    this.actionGroupName ? this.entity.origin.name === other.entity.origin.name && this.actionGroupName === other.actionGroupName : this.isSame(other);

  public readonly canExecute = (duelist?: Duelist): boolean =>
    this.executableCells.includes(this.entity.cell.cellType) &&
    this.executableFaces.includes(this.entity.face) &&
    this.executablePeriods.includes(this.entity.duel.clock.period.key) &&
    this.validateDuelist(duelist ?? this.entity.controller);
}

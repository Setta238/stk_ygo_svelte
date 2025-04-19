import type { TExecutableDuelistType } from "./DuelCardAction";
import type { DuelEntity } from "./DuelEntity";
import type { DuelFieldCellType } from "./DuelFieldCell";
import type { Duelist } from "./Duelist";
import type { TDuelPeriodKey } from "./DuelPeriod";

export type CardActionDefinitionBase = {
  title: string;
  isMandatory: boolean;
  executableCells: Readonly<DuelFieldCellType[]>;
  executablePeriods: Readonly<TDuelPeriodKey[]>;
  executableDuelistTypes: TExecutableDuelistType[];
  isOnlyNTimesPerTurn?: number;
  isOnlyNTimesPerDuel?: number;
  isOnlyNTimesPerTurnIfFaceup?: number;
  isOnlyNTimesPerChain?: number;
  isOnlyNTimesIfFaceup?: number;
  actionGroupName?: string;
};

export class CardActionBase {
  private static nextSeq = 0;
  public readonly seq: number;
  public readonly entity: DuelEntity;
  private readonly _definition: CardActionDefinitionBase;
  protected get definition() {
    return this._definition;
  }
  public get title() {
    return this.definition.title;
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
  public get executableDuelistTypes() {
    return this.definition.executableDuelistTypes;
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
  public get actionGroupName() {
    return this.definition.actionGroupName;
  }

  public get duel() {
    return this.entity.duel;
  }
  public readonly validateDuelist = (duelist: Duelist) =>
    this.entity.controller === duelist
      ? this.definition.executableDuelistTypes.includes("Controller")
      : this.definition.executableDuelistTypes.includes("Opponent");

  protected constructor(seq: "AutoSeq" | number, entity: DuelEntity, definition: CardActionDefinitionBase) {
    this.seq = seq === "AutoSeq" ? CardActionBase.nextSeq++ : seq;
    this.entity = entity;
    this._definition = definition;
  }
}

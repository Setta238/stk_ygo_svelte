import type { DuelEntity, TSummonPosCauseReason, TSummonRuleCauseReason } from "./DuelEntity";
import { type Duelist } from "./Duelist";

export const procTypes = [
  "BattleDestory",
  "BattleTarget",
  "EffectDestroy",
  "EffectTarget",
  "Effect",
  "SendToGraveyardAsEffect",
  "SendToGraveyardAsCost",
  "BanishAsEffect",
  "BanishAsCost",
] as const;
export type TProcType = (typeof procTypes)[number] | TSummonRuleCauseReason | TSummonPosCauseReason;
export const removeTriggers = ["Set", "LeavesTheField", "Clock"] as const;
export type TRemoveTrigger = (typeof removeTriggers)[number];

export class ProcFilter {
  public readonly title: string;
  public readonly procType: TProcType;
  public readonly filter: (activator: Duelist, entity: DuelEntity, effectedEntites: DuelEntity[]) => boolean;
  public readonly validateAlive: () => boolean;
  public readonly removeTriggers: TRemoveTrigger[];
  public readonly isSpawnedBy: DuelEntity;
  public constructor(
    title: string,
    procType: TProcType,
    filter: (activator: Duelist, entity: DuelEntity, effectedEntites: DuelEntity[]) => boolean,
    validateAlive: () => boolean,
    removeTriggers: TRemoveTrigger[],
    isSpawnedBy: DuelEntity
  ) {
    this.title = title;
    this.procType = procType;
    this.filter = filter;
    this.validateAlive = validateAlive;
    this.removeTriggers = removeTriggers;
    this.isSpawnedBy = isSpawnedBy;
  }
}
export class BroadProcFilter extends ProcFilter {
  public readonly isApplicableTo: (entity: DuelEntity) => boolean;
  public constructor(
    title: string,
    procType: TProcType,
    filter: (activator: Duelist, entity: DuelEntity, effectedEntites: DuelEntity[]) => boolean,
    validateAlive: () => boolean,
    removeTriggers: TRemoveTrigger[],
    isSpawnedBy: DuelEntity,
    isApplicableTo: (entity: DuelEntity) => boolean
  ) {
    super(title, procType, filter, validateAlive, removeTriggers, isSpawnedBy);
    this.isApplicableTo = isApplicableTo;
  }
}

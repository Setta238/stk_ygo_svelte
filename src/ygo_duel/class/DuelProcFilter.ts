import type { CardAction } from "./DuelCardAction";
import { StickyEffectOperatorBase, getStickyEffectOperatorBundleClass, type IBroadOperator } from "./DuelStickyEffectOperatorBase";
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

export class ProcFilterBundle extends getStickyEffectOperatorBundleClass<ProcFilter, BroadProcFilter>() {}
export class ProcFilter extends StickyEffectOperatorBase {
  public readonly procType: TProcType;
  public readonly filter: (activator: Duelist, entity: DuelEntity, action: CardAction<unknown>, effectedEntites: DuelEntity[]) => boolean;
  public constructor(
    title: string,
    validateAlive: () => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    procType: TProcType,
    filter: (activator: Duelist, entity: DuelEntity, action: CardAction<unknown>, effectedEntites: DuelEntity[]) => boolean
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy);
    this.procType = procType;
    this.filter = filter;
  }
}
export class BroadProcFilter extends ProcFilter implements IBroadOperator {
  public readonly isApplicableTo: (entity: DuelEntity) => boolean;
  public constructor(
    title: string,
    validateAlive: () => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    procType: TProcType,
    filter: (activator: Duelist, entity: DuelEntity, action: CardAction<unknown>, effectedEntites: DuelEntity[]) => boolean,
    isApplicableTo: (entity: DuelEntity) => boolean
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, procType, filter);
    this.isApplicableTo = isApplicableTo;
  }
}

import type { CardAction } from "../class/DuelCardAction";
import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool } from "./DuelStickyEffectOperatorBase";
import type { DuelEntity, TSummonPosCauseReason, TSummonRuleCauseReason } from "../class/DuelEntity";
import { type Duelist } from "../class/Duelist";

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

export class ProcFilterPool extends StickyEffectOperatorPool<ProcFilter, ProcFilterBundle> {}

export class ProcFilterBundle extends StickyEffectOperatorBundle<ProcFilter> {
  protected readonly beforePush: (ope: ProcFilter) => void = () => {};
}
export class ProcFilter extends StickyEffectOperatorBase {
  public readonly procType: TProcType;
  public readonly filter: (activator: Duelist, entity: DuelEntity, action: CardAction<unknown>, effectedEntites: DuelEntity[]) => boolean;
  public constructor(
    title: string,
    validateAlive: (spawner: DuelEntity) => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (spawner: DuelEntity, target: DuelEntity) => boolean,
    procType: TProcType,
    filter: (activator: Duelist, entity: DuelEntity, action: CardAction<unknown>, effectedEntites: DuelEntity[]) => boolean
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, isApplicableTo);
    this.procType = procType;
    this.filter = filter;
  }
}

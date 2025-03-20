import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool } from "./DuelStickyEffectOperatorBase";
import type { DuelEntity, TSummonPosCauseReason, TSummonRuleCauseReason } from "../class/DuelEntity";

export const relationTypes = ["Equip", "XyzMaterial"] as const;
export type TRelationType = (typeof relationTypes)[number] | TSummonRuleCauseReason | TSummonPosCauseReason;
export const removeTriggers = ["Set", "LeavesTheField", "Clock"] as const;
export type TRemoveTrigger = (typeof removeTriggers)[number];

export class CardRelationPool extends StickyEffectOperatorPool<CardRelation, CardRelationBundle> {}

export class CardRelationBundle extends StickyEffectOperatorBundle<CardRelation> {
  protected readonly beforePush: (ope: CardRelation) => void = () => {};
}
export class CardRelation extends StickyEffectOperatorBase {
  public readonly relationType: TRelationType;
  public readonly target: DuelEntity;
  public constructor(
    title: string,
    validateAlive: () => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (entity: DuelEntity) => boolean,
    relationType: TRelationType,
    target: DuelEntity
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, isApplicableTo);
    this.relationType = relationType;
    this.target = target;
  }
}

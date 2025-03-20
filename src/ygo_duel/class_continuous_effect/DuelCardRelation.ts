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
  public static readonly createRegularEquipRelation = (
    title: string,
    validateAlive: (spawner: DuelEntity) => boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (spawner: DuelEntity, target: DuelEntity) => boolean
  ) => {
    return new CardRelation(
      title,
      validateAlive,
      true,
      isSpawnedBy,
      (spawner: DuelEntity, target: DuelEntity) => {
        console.log(target);
        return target.isOnField && target.face === "FaceUp" && isApplicableTo(spawner, target);
      },
      "Equip",
      isSpawnedBy.info.effectTargets[title][0],
      (spawner: DuelEntity, target: DuelEntity) => {
        console.log("beforeRemove", spawner, target);
        // 装備できない状態でフィールドに残っている場合、ルールにより破壊される。
        if (spawner.isOnField && !spawner.info.isDying) {
          spawner.info.isDying = true;
          spawner.info.causeOfDeath = ["RuleDestroy"];
          spawner.duel.log.info(`装備対象${target.toString()}不在により${spawner.toString()}は破壊された。`);
        }
        spawner.info.effectTargets[title] = [];
      }
    );
  };
  public readonly relationType: TRelationType;
  public readonly target: DuelEntity;
  public beforeRemove: () => void;
  public constructor(
    title: string,
    validateAlive: (spawner: DuelEntity) => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (spawner: DuelEntity, entity: DuelEntity) => boolean,
    relationType: TRelationType,
    target: DuelEntity,
    beforeRemove: (spawner: DuelEntity, target: DuelEntity) => void
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, isApplicableTo);
    this.relationType = relationType;
    this.target = target;

    this.beforeRemove = () => beforeRemove(this.isSpawnedBy, this.target);
  }
}

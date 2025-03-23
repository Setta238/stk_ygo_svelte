import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool } from "./DuelStickyEffectOperatorBase";
import type { DuelEntity, TSummonPosCauseReason, TSummonRuleCauseReason } from "../class/DuelEntity";
import type { CardActionBaseAttr } from "@ygo_duel/class/DuelCardAction";

export const relationTypes = ["Equip", "XyzMaterial"] as const;
export type TRelationType = (typeof relationTypes)[number] | TSummonRuleCauseReason | TSummonPosCauseReason;
export const removeTriggers = ["Set", "LeavesTheField", "Clock"] as const;
export type TRemoveTrigger = (typeof removeTriggers)[number];

export class CardRelationPool extends StickyEffectOperatorPool<CardRelation, CardRelationBundle> {
  protected afterDistributeAll = () => true;
}

export class CardRelationBundle extends StickyEffectOperatorBundle<CardRelation> {
  protected readonly beforePush: (ope: CardRelation) => void = () => {};
}
export class CardRelation extends StickyEffectOperatorBase {
  public static readonly createRegularEquipRelation = (
    title: string,
    validateAlive: (spawner: DuelEntity) => boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionBaseAttr>,
    isApplicableTo: (spawner: DuelEntity, target: DuelEntity) => boolean,
    beforeRemove: (relation: CardRelation) => boolean = () => true
  ) => {
    return new CardRelation(
      title,
      validateAlive,
      true,
      isSpawnedBy,
      actionAttr,
      (spawner: DuelEntity, target: DuelEntity) => {
        console.log(target);
        return target.isOnField && target.face === "FaceUp" && isApplicableTo(spawner, target);
      },
      "Equip",
      isSpawnedBy.info.effectTargets[title][0],
      (relation: CardRelation) => {
        console.log("beforeRemove", relation.isSpawnedBy, relation.target);
        if (!beforeRemove(relation)) {
          return;
        }

        // 装備できない状態でフィールドに残っている場合、ルールにより破壊される。
        if (relation.isSpawnedBy.isOnField && !relation.isSpawnedBy.info.isDying) {
          relation.isSpawnedBy.info.isDying = true;
          relation.isSpawnedBy.info.causeOfDeath = ["RuleDestroy"];
          relation.isSpawnedBy.duel.log.info(
            `装備対象${relation.target.toString()}不在により${relation.isSpawnedBy.toString()}は破壊された。`,
            relation.effectOwner
          );
        }

        relation.isSpawnedBy.info.effectTargets[title] = [];
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
    actionAttr: Partial<CardActionBaseAttr>,
    isApplicableTo: (spawner: DuelEntity, entity: DuelEntity) => boolean,
    relationType: TRelationType,
    target: DuelEntity,
    beforeRemove: (relation: CardRelation) => void
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, actionAttr, isApplicableTo);
    this.relationType = relationType;
    this.target = target;

    this.beforeRemove = () => beforeRemove(this);
  }
}

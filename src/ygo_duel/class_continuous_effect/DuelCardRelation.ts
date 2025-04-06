import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool } from "./DuelStickyEffectOperatorBase";
import type { DuelEntity, TSummonPosCauseReason, TSummonRuleCauseReason } from "../class/DuelEntity";
import type { CardActionDefinitionAttr } from "@ygo_duel/class/DuelCardAction";
import { SystemError } from "@ygo_duel/class/Duel";

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
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttr>,
    isApplicableTo: (operator: StickyEffectOperatorBase, target: DuelEntity) => boolean,
    beforeRemove: (relation: CardRelation) => boolean = () => true
  ) => {
    if (!isSpawnedBy.info.equipedBy) {
      throw new SystemError("想定されない状態", title, validateAlive, isSpawnedBy, actionAttr, isApplicableTo, beforeRemove);
    }

    return new CardRelation(
      title,
      validateAlive,
      true,
      isSpawnedBy,
      actionAttr,
      (operator: StickyEffectOperatorBase, target: DuelEntity) => {
        return target.isOnFieldAsMonster && target.face === "FaceUp" && isApplicableTo(operator, target);
      },
      "Equip",
      isSpawnedBy.info.equipedBy,
      (relation: CardRelation) => {
        if (!beforeRemove(relation)) {
          return;
        }

        // TODO 全体的に見直し必要

        // 装備できない状態でフィールドに残っている場合、ルールにより破壊される。
        if (relation.isSpawnedBy.isOnFieldAsMonster && !relation.isSpawnedBy.info.isDying) {
          relation.isSpawnedBy.info.isDying = true;
          relation.isSpawnedBy.info.causeOfDeath = ["RuleDestroy"];
          relation.isSpawnedBy.duel.log.info(
            `装備対象${relation.target.toString()}不在により${relation.isSpawnedBy.toString()}は破壊された。`,
            relation.effectOwner
          );
        }

        //TODO 共通処理で処理できるので不要
        relation.isSpawnedBy.info.equipedBy = undefined;
      }
    );
  };
  public readonly relationType: TRelationType;
  public readonly target: DuelEntity;
  public beforeRemove: () => void;
  public constructor(
    title: string,
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttr>,
    isApplicableTo: (operator: StickyEffectOperatorBase, target: DuelEntity) => boolean,
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

import {} from "@stk_utils/funcs/StkArrayUtils";
import { type TBattlePosition } from "@ygo/class/YgoTypes";
import { destoryCauseReasonDic, DuelEntity, posToSummonPos, type TDestoryCauseReason, type TSummonRuleCauseReason } from "./DuelEntity";
import type { Duelist } from "./Duelist";
import type { CardAction } from "./DuelCardAction";
import { SystemError } from "./Duel";

declare module "./DuelEntity" {
  interface DuelEntity {
    hasBeenSummonedNow(summonRules: TSummonRuleCauseReason[], posList?: TBattlePosition[]): boolean;
    canBeTargetOfEffect(activator: Duelist, causedBy: DuelEntity, action: CardAction<unknown>): boolean;
    canBeSpecialSummoned(summmonRule: TSummonRuleCauseReason, activator: Duelist, causedBy: DuelEntity, action: CardAction<unknown>): boolean;
    canBeTargetOfBattle(activator: Duelist, entity: DuelEntity, action: CardAction<unknown>): boolean;
    tryDestory(destroyType: TDestoryCauseReason, activator: Duelist, entity: DuelEntity, action: CardAction<unknown> | undefined): boolean;
    canBeMaterials(summmonRule: TSummonRuleCauseReason, action: CardAction<unknown>, materials: DuelEntity[]): boolean;
    getIndexInCell(): number;
  }
  interface DuelEntityConstructor {
    isEmpty(value: string): boolean;
  }
}

DuelEntity.prototype.hasBeenSummonedNow = function (summonRules: TSummonRuleCauseReason[], posList: TBattlePosition[] = ["Attack", "Defense"]): boolean {
  const entity = this as DuelEntity;
  const _posList = posList.map(posToSummonPos);
  const movedAs = entity.moveLog.latestRecord.movedAs;
  if (!entity.wasMovedAtPreviousChain) {
    return false;
  }
  if (!movedAs.union(summonRules).length) {
    return false;
  }
  if (!movedAs.union(_posList).length) {
    return false;
  }
  return true;
};

DuelEntity.prototype.canBeTargetOfEffect = function (activator: Duelist, causedBy: DuelEntity, action: CardAction<unknown>): boolean {
  const entity = this as DuelEntity;
  return entity.procFilterBundle.operators
    .filter((pf) => pf.procTypes.some((t) => t === "EffectTarget"))
    .every((pf) => pf.filter(activator, causedBy, action, [this]));
};

DuelEntity.prototype.canBeSpecialSummoned = function (
  summmonRule: TSummonRuleCauseReason,
  activator: Duelist,
  causedBy: DuelEntity,
  action: CardAction<unknown>
): boolean {
  const entity = this as DuelEntity;
  // 特殊召喚できないモンスター（※神、スピリットなど）
  if (entity.origin.monsterCategories?.includes("NormalSummonOnly")) {
    return false;
  }

  // 特殊召喚モンスターかつ蘇生制限を満たしていないモンスター
  if (
    entity.origin.monsterCategories?.includes("SpecialSummon") &&
    !entity.status.canReborn &&
    !entity.info.isRebornable &&
    (entity.fieldCell.cellType === "Graveyard" || this.fieldCell.cellType === "Banished")
  ) {
    return false;
  }

  return entity.procFilterBundle.operators
    .filter((pf) => pf.procTypes.some((t) => t === "SpecialSummon" || t === summmonRule))
    .every((pf) => pf.filter(activator, causedBy, action, [entity]));
};

DuelEntity.prototype.canBeTargetOfBattle = function (activator: Duelist, causedBy: DuelEntity, action: CardAction<unknown>): boolean {
  const entity = this as DuelEntity;
  return entity.procFilterBundle.operators
    .filter((pf) => pf.procTypes.some((t) => t === "BattleTarget"))
    .every((pf) => pf.filter(activator, causedBy, action, [entity]));
};
DuelEntity.prototype.tryDestory = function (
  destroyType: TDestoryCauseReason,
  activator: Duelist,
  causedBy: DuelEntity,
  action: CardAction<unknown> | undefined
): boolean {
  const entity = this as DuelEntity;
  entity.info.isDying = entity.procFilterBundle.operators
    .filter((pf) => pf.procTypes.some((t) => t === destroyType))
    .every((pf) => pf.filter(activator, causedBy, action, [entity]));
  if (entity.info.isDying) {
    entity.duel.log.info(`${entity.toString()}を${destoryCauseReasonDic[destroyType]}`, causedBy.controller);
    entity.info.causeOfDeath = [destroyType];
    entity.info.isKilledBy = causedBy;
    entity.info.isKilledByWhom = causedBy.controller;
  }
  return entity.info.isDying;
};

DuelEntity.prototype.canBeMaterials = function (summmonRule: TSummonRuleCauseReason, action: CardAction<unknown>, materials: DuelEntity[]): boolean {
  const entity = this as DuelEntity;

  return entity.procFilterBundle.operators
    .filter((pf) => pf.procTypes.some((t) => t === summmonRule))
    .every((pf) => pf.filter(action.entity.controller, action.entity, action, materials));
};

DuelEntity.prototype.getIndexInCell = function (): number {
  const entity = this as DuelEntity;

  if (entity.info.isVanished) {
    return -1;
  }

  const index = entity.fieldCell.cardEntities.indexOf(entity);

  if (index < 0) {
    throw new SystemError("エンティティとセルの状態が矛盾している。", [entity, entity.fieldCell]);
  }

  return index;
};

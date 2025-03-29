import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { SystemError } from "./Duel";
import type { CardActionBaseAttr, CardAction, ChainBlockInfo } from "./DuelCardAction";
import { DuelEntity, type TSummonRuleCauseReason, posToSummonPos, type TDestoryCauseReason, destoryCauseReasonDic } from "./DuelEntity";
import type { Duelist } from "./Duelist";

declare module "./DuelEntity" {
  interface DuelEntity {
    hasBeenSummonedNow(summonRules: (TSummonRuleCauseReason | "FlipSummon")[], posList?: TBattlePosition[]): boolean;
    getAttackTargets(): DuelEntity[];
    /**
     * 相手側の状態を考慮せず、攻撃できる状態か判定
     */
    hasAttackRight(): boolean;
    /**
     * モンスターへ攻撃できる状態かどうか判定
     */
    canAttackToMonster(): boolean;
    /**
     * 直接攻撃できる状態かどうか判定
     */
    canDirectAttack(): boolean;
    canBeEffected(activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionBaseAttr>): boolean;
    canBeTargetOfEffect(activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionBaseAttr>): boolean;
    canBeSpecialSummoned(summmonRule: TSummonRuleCauseReason, activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionBaseAttr>): boolean;
    canBeTargetOfBattle(activator: Duelist, entity: DuelEntity): boolean;
    tryDestory(destroyType: TDestoryCauseReason, activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionBaseAttr>): Promise<boolean>;
    validateDestory(destroyType: TDestoryCauseReason, activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionBaseAttr>): boolean;
    canBeMaterials(summmonRule: TSummonRuleCauseReason, action: Partial<CardActionBaseAttr>, materials: DuelEntity[]): boolean;
    getIndexInCell(): number;
  }
  interface DuelEntityConstructor {
    isEmpty(value: string): boolean;
  }
}

DuelEntity.prototype.hasBeenSummonedNow = function (
  summonRules: (TSummonRuleCauseReason | "FlipSummon")[],
  posList: TBattlePosition[] = ["Attack", "Defense"]
): boolean {
  const entity = this as DuelEntity;
  const _posList = posList.map(posToSummonPos);
  const movedAs = entity.moveLog.latestRecord.movedAs;
  console.log(entity, entity.moveLog.records);
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

DuelEntity.prototype.getAttackTargets = function (): DuelEntity[] {
  if (!this.hasAttackRight()) {
    return [];
  }

  // ダイレクトアタックを阻害しうるモンスターを抽出
  const enemies = this.duel.field
    .getMonstersOnField()
    .filter((enemy) => enemy.status.isSelectableForAttack)
    .filter((enemy) => enemy.controller !== this.controller);

  if (this.status.canDirectAttack || !enemies.length) {
    enemies.push(this.controller.getOpponentPlayer().entity);
  }

  // 自分、相手ともにフィルタリングが必要。
  return enemies
    .filter((enemy) => enemy.canBeTargetOfBattle(this.controller, this))
    .filter((enemy) =>
      this.procFilterBundle.operators.filter((pf) => pf.procTypes.includes("BattleTarget")).every((pf) => pf.filter(this.controller, this, {}, [enemy]))
    );
};
DuelEntity.prototype.canDirectAttack = function (): boolean {
  return this.getAttackTargets().some((enemy) => enemy.entityType === "Duelist");
};

DuelEntity.prototype.canAttackToMonster = function (): boolean {
  return this.getAttackTargets().some((enemy) => enemy.entityType !== "Duelist");
};

DuelEntity.prototype.hasAttackRight = function (): boolean {
  // TODO 連続攻撃モンスター、絶対防御将軍などの考慮
  return this.battlePosition === "Attack" && this.info.attackCount === 0 && this.status.canAttack;
};

DuelEntity.prototype.canBeEffected = function (activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionBaseAttr>): boolean {
  const entity = this as DuelEntity;
  return entity.procFilterBundle.operators
    .filter((pf) => pf.procTypes.some((t) => t === "Effect"))
    .every((pf) => pf.filter(activator, causedBy, action, [this]));
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

DuelEntity.prototype.canBeTargetOfBattle = function (activator: Duelist, causedBy: DuelEntity): boolean {
  const entity = this as DuelEntity;
  return entity.procFilterBundle.operators
    .filter((pf) => pf.procTypes.some((t) => t === "BattleTarget"))
    .every((pf) => pf.filter(activator, causedBy, {}, [entity]));
};

DuelEntity.prototype.tryDestory = async function (
  destroyType: "BattleDestroy" | "EffectDestroy",
  activator: Duelist,
  causedBy: DuelEntity,
  action: Partial<CardActionBaseAttr>
): Promise<boolean> {
  const entity = this as DuelEntity;
  // TODO 身代わり効果
  entity.info.isDying = entity.validateDestory(destroyType, activator, causedBy, action);
  if (entity.info.isDying) {
    entity.duel.log.info(`${entity.toString()}を${destoryCauseReasonDic[destroyType]}`, causedBy.controller);
    entity.info.causeOfDeath = [destroyType];
    entity.info.isKilledBy = causedBy;
    entity.info.isKilledByWhom = causedBy.controller;
  }
  return entity.info.isDying;
};

DuelEntity.prototype.validateDestory = function (
  destroyType: "BattleDestroy" | "EffectDestroy",
  activator: Duelist,
  causedBy: DuelEntity,
  action: Partial<CardActionBaseAttr>
): boolean {
  const entity = this as DuelEntity;
  return entity.procFilterBundle.operators
    .filter((pf) => pf.procTypes.includes(destroyType))
    .every((pf) => pf.filter(activator, causedBy, action ?? {}, [entity]));
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

export class DuelEntityShortHands {
  public static readonly tryDestroy = async (cards: DuelEntity[], chainBlockInfo: ChainBlockInfo<unknown>): Promise<DuelEntity[]> => {
    const _cards = cards.filter((card) => !card.info.isDying);
    await Promise.all(_cards.map((card) => card.tryDestory("EffectDestroy", chainBlockInfo.activator, chainBlockInfo.action.entity, chainBlockInfo.action)));
    const result = _cards.filter((card) => card.info.isDying);

    await DuelEntity.waitCorpseDisposal(chainBlockInfo.activator.duel);

    return result;
  };

  private constructor() {}
}

// class Piyo<T> {
//   private static nextSeq: 0;
//   public readonly seq: number;
//   public readonly t: T;
//   constructor(t: T) {
//     this.seq = Piyo.nextSeq++;
//     this.t = t;
//   }
// }

// type Hoge = {
//   text: string;
//   piyos: Piyo<unknown>[];
// };

// const piyoUnknown = new Piyo(undefined as unknown);
// const piyoNever = new Piyo(undefined as never);
// const piyoString = new Piyo("piyo");
// const piyoNumber = new Piyo(123);

// const hoge: Hoge = {
//   text: "hoge",
//   piyos: [piyoUnknown, piyoNever, piyoString, piyoNumber],
// };

// const getPiyoSeqArray_1 = (piyos: Piyo<unknown>[]) => {
//   return piyos.map((piyo) => piyo.seq);
// };
// const getPiyoSeqArray_2 = (piyos: Piyo<never>[]) => {
//   return piyos.map((piyo) => piyo.seq);
// };
// const getPiyoSeqArray_3 = <T>(piyos: Piyo<T>[]) => {
//   return piyos.map((piyo) => piyo.seq);
// };

// getPiyoSeqArray_1([piyoUnknown, piyoNever, piyoString, piyoNumber]);
// getPiyoSeqArray_2([piyoUnknown, piyoNever, piyoString, piyoNumber]);
// getPiyoSeqArray_3([piyoUnknown, piyoNever, piyoString, piyoNumber]);

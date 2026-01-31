import type { CardActionDefinitionAttrs, ChainBlockInfo } from "@ygo_duel/class/DuelEntityAction";
import {
  StickyEffectOperatorBase,
  StickyEffectOperatorBundle,
  StickyEffectOperatorPool,
  type StickyEffectOperatorArgs,
} from "@ygo_duel/class_continuous_effect/DuelStickyEffectOperatorBase";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { type Duelist, type TLifeLogReason } from "@ygo_duel/class/Duelist";
/*
  https://yugioh-wiki.net/index.php?%C0%EF%C6%AE%A5%C0%A5%E1%A1%BC%A5%B8
  https://yugioh-wiki.net/index.php?%B8%FA%B2%CC%A5%C0%A5%E1%A1%BC%A5%B8
  01:倍の戦闘ダメージを与える
  02:戦闘ダメージはお互いに受ける
  03:自分への戦闘ダメージは相手も受ける、戦闘ダメージは代わりに自分／相手が受ける
  04:戦闘ダメージは効果ダメージとして扱う
  05:戦闘ダメージの数値分だけＬＰを回復する
  06:戦闘ダメージは０になる
  07:戦闘ダメージは半分になる
  08:戦闘ダメージは倍になる
  09:戦闘ダメージは○○○（一定の値）になる
  10:○○○以上／以下の戦闘ダメージを受けない

  ※01と08、02と03は別。
  ※07と09は相殺する。
*/
type DamageCalcTypeFlags = {
  double_typeA: boolean;
  eachOther_typeA: boolean;
  eachOther_typeB: "EachOther" | "Substitude" | undefined;
  asEffectDamage: boolean;
  heal: boolean;
  zero_typeA: boolean;
  half: boolean;
  double_typeB: boolean;
  fix: number | undefined;
  zero_typeB: boolean;
};

export type CalculatedDamageInfo = {
  damageSource: DuelEntity;
  point: number;
  damageToOpponent1: number;
  damageToOpponent2: number;
  damageType: TLifeLogReason;
};

export class DamageFilterPool extends StickyEffectOperatorPool<DamageFilter, DamageFilterBundle> {
  protected afterDistributeAll = () => true;
}

export class DamageFilterBundle extends StickyEffectOperatorBundle<DamageFilter> {
  protected override beforePush = () => {};
  protected override readonly afterPush = () => {};
}

export type DamageFilterArgs = StickyEffectOperatorArgs & {
  calcType: keyof DamageCalcTypeFlags;
  filter: (filter: DamageFilter, ...args: Parameters<typeof DamageFilter.prototype.filter>) => Partial<DamageCalcTypeFlags>;
};
export class DamageFilter extends StickyEffectOperatorBase {
  public beforeRemove: () => void = () => {};
  public readonly calcType: keyof DamageCalcTypeFlags;
  public readonly filter: (
    point: number,
    activator: Duelist,
    damageTo: Duelist,
    damageSource: DuelEntity,
    suppressor: DuelEntity | undefined,
    damageType: TLifeLogReason,
    actionAttr: CardActionDefinitionAttrs,
  ) => Partial<DamageCalcTypeFlags>;
  public constructor(args: DamageFilterArgs) {
    super(args);
    this.calcType = args.calcType;
    this.filter = (..._args) => args.filter(this, ..._args);
  }
}

const calcFlags = (
  damageFilters: DamageFilter[],
  calcTypes: (keyof DamageCalcTypeFlags)[],
  ...args: Parameters<typeof DamageFilter.prototype.filter>
): Partial<DamageCalcTypeFlags> =>
  damageFilters
    .filter((ope) => calcTypes.includes(ope.calcType))
    .reduce((wip, ope) => {
      return {
        ...wip,
        ...ope.filter(...args),
      };
    }, {});

const calcDamage = (...args: Parameters<typeof DamageFilter.prototype.filter>): CalculatedDamageInfo => {
  const [point, activator, damageTo, damageSource, suppressor, damageType, actionAttr] = args;

  const damageFilters = [damageTo.entity, damageSource, suppressor]
    .filter((entity): entity is DuelEntity => Boolean(entity))
    .flatMap((entity) => entity.damageFilterBundle.effectiveOperators);

  let flags: Partial<DamageCalcTypeFlags> = calcFlags(damageFilters, ["double_typeA", "eachOther_typeA", "eachOther_typeB", "asEffectDamage"], ...args);

  const result = { damageSource, point, damageToOpponent1: 0, damageToOpponent2: 0, damageType };
  if (flags.double_typeA) {
    result.point *= 2;
  }
  if (flags.asEffectDamage) {
    result.damageType = "EffectDamage";
  }

  flags = {
    ...calcFlags(
      damageFilters,
      ["heal", "zero_typeA", "half", "double_typeB", "fix"],
      result.point,
      activator,
      damageTo,
      damageSource,
      suppressor,
      result.damageType,
      actionAttr,
    ),
    ...flags,
  };

  if (flags.fix !== undefined) {
    result.point = flags.fix;
  } else if (flags.zero_typeA) {
    result.point = 0;
  } else {
    if (flags.half) {
      result.point = Math.round(result.point / 2);
    }
    if (flags.double_typeA) {
      result.point *= 2;
    }
  }

  flags = {
    ...calcFlags(damageFilters, ["zero_typeB"], result.point, activator, damageTo, damageSource, suppressor, result.damageType, actionAttr),
    ...flags,
  };
  if (flags.zero_typeB) {
    result.point = 0;
  }

  if (flags.heal) {
    result.damageType = "Heal";
  } else {
    if (flags.eachOther_typeA) {
      result.damageToOpponent1 = result.point;
    }
    if (flags.eachOther_typeB) {
      result.damageToOpponent2 = result.point;
      if (flags.eachOther_typeB === "Substitude") {
        result.point = 0;
      }
    }
  }

  return result;
};

export const calcEffectDamage = (point: number, chainBlockInfo: ChainBlockInfo<unknown>, damageTo: Duelist) =>
  calcDamage(point, chainBlockInfo.activator, damageTo, chainBlockInfo.action.entity, undefined, "EffectDamage", chainBlockInfo.action);

export const calcBattleDamage = (
  point: number,
  activator: Duelist,
  damageTo: Duelist,
  damageSource: DuelEntity,
  suppressor: DuelEntity,
  actionAttr: CardActionDefinitionAttrs,
) => calcDamage(point, activator, damageTo, damageSource, suppressor.entityType === "Duelist" ? undefined : suppressor, "BattleDamage", actionAttr);

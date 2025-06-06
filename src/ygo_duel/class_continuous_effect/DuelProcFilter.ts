import type { CardActionDefinitionAttrs } from "../class/DuelEntityAction";
import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool, type StickyEffectOperatorArgs } from "./DuelStickyEffectOperatorBase";
import { type DuelEntity, type TMaterialCauseReason } from "../class/DuelEntity";
import { type Duelist } from "../class/Duelist";

export const banishProcType = ["BanishAsEffect", "BanishAsCost"] as const;
export type TBanishProcType = (typeof banishProcType)[number];

export const procTypes = [
  "BattleDestroy",
  "EffectDestroy",
  "BattleTarget",
  "EffectTarget",
  "Effect",
  "SendToGraveyardAsEffect",
  "SendToGraveyardAsCost",
  "ReleaseAsCost",
  "ReleaseAsEffect",
  ...banishProcType,
] as const;
export type TProcType = (typeof procTypes)[number] | TMaterialCauseReason;
export const removeTriggers = ["Set", "LeavesTheField", "Clock"] as const;
export type TRemoveTrigger = (typeof removeTriggers)[number];

export class ProcFilterPool extends StickyEffectOperatorPool<ProcFilter, ProcFilterBundle> {
  // 「効果を受けない」フィルターを再度全適用する。
  protected readonly afterDistributeAll = () => this.bundles.every((bundle) => bundle.applyEffectFilter());
}

export class ProcFilterBundle extends StickyEffectOperatorBundle<ProcFilter> {
  // 「効果を受けない」フィルターのうち、永続効果のものを再適用する。
  public readonly applyEffectFilter = () => {
    const len = this.entity.allStickyEffectOperators.length;
    const list: number[] = [];

    while (true) {
      // 後続は取り除かれる可能性があるので、毎回取り出す
      const pf = this.effectiveOperators
        .filter((pf) => pf.procTypes.includes("Effect"))
        .filter((pf) => pf.isContinuous)
        .find((pf) => !list.includes(pf.seq));
      if (!pf) {
        break;
      }
      list.push(pf.seq);
      pf.eraseOperators(this.entity);
    }

    return this.entity.allStickyEffectOperators.length === len;
  };

  public readonly filter = (
    procTypes: TProcType[],
    activator: Duelist,
    entity: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttrs>,
    effectedEntites: DuelEntity[]
  ) =>
    this.effectiveOperators
      .filter((pf) => pf.procTypes.union(procTypes).length)
      .every((pf) => pf.filter(this.entity, activator, entity, actionAttr, effectedEntites));

  protected override readonly beforePush = (pf: ProcFilter) => pf.eraseOperators(this.entity);
  protected override readonly afterPush = () => {};
}

export type ProcFilterArgs = StickyEffectOperatorArgs & {
  procTypes: TProcType[];
  filter: typeof ProcFilter.prototype.filter;
};

export class ProcFilter extends StickyEffectOperatorBase {
  public static readonly createContinuous = (
    title: string,
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (operator: StickyEffectOperatorBase, target: DuelEntity) => boolean,
    procTypes: TProcType[],
    filter: typeof ProcFilter.prototype.filter
  ) => {
    return new ProcFilter({ title, validateAlive, isContinuous: true, isSpawnedBy, actionAttr: {}, isApplicableTo, procTypes, filter });
  };
  public static readonly createLingering = (
    title: string,
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttrs>,
    isApplicableTo: (operator: StickyEffectOperatorBase, target: DuelEntity) => boolean,
    procTypes: TProcType[],
    filter: typeof ProcFilter.prototype.filter
  ) => {
    return new ProcFilter({ title, validateAlive, isContinuous: false, isSpawnedBy, actionAttr, isApplicableTo, procTypes, filter });
  };
  public beforeRemove: () => void = () => {};
  public readonly procTypes: TProcType[];
  public readonly filter: (
    bundleOwner: DuelEntity,
    activator: Duelist,
    entity: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttrs>,
    effectedEntites: DuelEntity[]
  ) => boolean;
  public constructor(args: ProcFilterArgs) {
    super(args);
    this.procTypes = args.procTypes;
    this.filter = args.filter;
  }

  public readonly eraseOperators = (entity: DuelEntity) => {
    if (!this.procTypes.includes("Effect")) {
      return 0;
    }

    // 効果処理をフィルタリングする場合、既存の永続型でフィルタリング対象のオペレータを全て除去する
    const expireds = entity.allStickyEffectOperators
      .filter((ope) => ope.isContinuous)
      .filter((ope) => !this.filter(entity, ope.effectOwner, ope.isSpawnedBy, ope.actionAttr, []))
      .map((ope) => ope.seq);

    expireds.forEach(entity.procFilterBundle.removeItem);
    expireds.forEach(entity.statusOperatorBundle.removeItem);
    expireds.forEach(entity.numericOprsBundle.removeItem);

    return expireds.length;
  };
}

import type { CardActionDefinitionAttr } from "../class/DuelCardAction";
import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool } from "./DuelStickyEffectOperatorBase";
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
      const pf = this.operators
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

  protected readonly beforePush = (pf: ProcFilter) => pf.eraseOperators(this.entity);
}
export class ProcFilter extends StickyEffectOperatorBase {
  public beforeRemove: () => void = () => {};
  public readonly procTypes: TProcType[];
  public readonly filter: (activator: Duelist, entity: DuelEntity, actionAttr: Partial<CardActionDefinitionAttr>, effectedEntites: DuelEntity[]) => boolean;
  public constructor(
    title: string,
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttr>,

    isApplicableTo: (operator: StickyEffectOperatorBase, target: DuelEntity) => boolean,
    procTypes: TProcType[],
    filter: (activator: Duelist, entity: DuelEntity, actionAttr: Partial<CardActionDefinitionAttr>, effectedEntites: DuelEntity[] | undefined) => boolean
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, actionAttr, isApplicableTo);
    this.procTypes = procTypes;
    this.filter = filter;
  }

  public readonly eraseOperators = (entity: DuelEntity) => {
    if (!this.procTypes.includes("Effect")) {
      return 0;
    }

    console.log("ここはまだ通らない想定");

    // 効果処理をフィルタリングする場合、既存の永続型でフィルタリング対象のオペレータを全て除去する
    const expireds = entity.allStickyEffectOperators
      .filter((ope) => ope.isContinuous)
      .filter((ope) => !this.filter(ope.effectOwner, ope.isSpawnedBy, ope.actionAttr, []))
      .map((ope) => ope.seq);

    expireds.forEach(entity.procFilterBundle.removeItem);
    expireds.forEach(entity.statusOperatorBundle.removeItem);
    expireds.forEach(entity.numericOprsBundle.removeItem);

    return expireds.length;
  };
}

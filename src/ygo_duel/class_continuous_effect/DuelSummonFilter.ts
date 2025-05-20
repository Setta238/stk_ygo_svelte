import type { CardActionDefinitionAttrs, SummonMaterialInfo } from "../class/DuelEntityAction";
import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool, type StickyEffectOperatorArgs } from "./DuelStickyEffectOperatorBase";
import { type DuelEntity, type TDuelCauseReason, type TSummonKindCauseReason } from "../class/DuelEntity";
import { type Duelist, type SummonChoice } from "../class/Duelist";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type { TBattlePosition } from "@ygo/class/YgoTypes";

export class SummonFilterPool extends StickyEffectOperatorPool<SummonFilter, SummonFilterBundle> {
  protected afterDistributeAll = () => true;
}

export class SummonFilterBundle extends StickyEffectOperatorBundle<SummonFilter> {
  protected beforePush = () => {};
  public readonly filter = (
    effectOwner: Duelist,
    summonKind: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
    summonChoice: SummonChoice,
    materialInfos: SummonMaterialInfo[],
    ignoreSummoningConditions: boolean
  ) =>
    this.effectiveOperators
      .filter((ope) => ope.summonKinds.includes(summonKind))
      .reduce((wip, ope) => {
        return {
          ...wip,
          ...ope.filter(
            this.entity,
            effectOwner,
            summonChoice.summoner,
            [summonKind, ...movedAs],
            actDefAttr,
            summonChoice.monster,
            materialInfos,
            wip.posList,
            wip.cells,
            ignoreSummoningConditions
          ),
        };
      }, summonChoice);
}

export type SummonFilterArgs = StickyEffectOperatorArgs & {
  summonKinds: Readonly<TSummonKindCauseReason[]>;
  filter: (filter: SummonFilter, ...args: Parameters<typeof SummonFilter.prototype.filter>) => ReturnType<typeof SummonFilter.prototype.filter>;
};

export class SummonFilter extends StickyEffectOperatorBase {
  public beforeRemove: () => void = () => {};
  public readonly summonKinds: Readonly<TSummonKindCauseReason[]>;
  public readonly filter: (
    bundleOwner: DuelEntity,
    effectOwner: Duelist,
    summoner: Duelist,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
    monster: DuelEntity,
    materialInfos: SummonMaterialInfo[],
    posList: Readonly<TBattlePosition[]>,
    cells: DuelFieldCell[],
    ignoreSummoningConditions: boolean
  ) => {
    posList: Readonly<TBattlePosition[]>;
    cells: DuelFieldCell[];
  };
  public constructor(args: SummonFilterArgs) {
    super(args);
    this.summonKinds = args.summonKinds;
    this.filter = (..._args) => args.filter(this, ..._args);
  }
}

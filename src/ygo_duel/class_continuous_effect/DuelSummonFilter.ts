import type { CardActionDefinitionAttr, SummonMaterialInfo } from "../class/DuelCardAction";
import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool } from "./DuelStickyEffectOperatorBase";
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
    actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
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

export class SummonFilter extends StickyEffectOperatorBase {
  public beforeRemove: () => void = () => {};
  public readonly summonKinds: Readonly<TSummonKindCauseReason[]>;
  public readonly filter: (
    filterTarget: DuelEntity,
    effectOwner: Duelist,
    summoner: Duelist,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
    monster: DuelEntity,
    materialInfos: SummonMaterialInfo[],
    posList: Readonly<TBattlePosition[]>,
    cells: DuelFieldCell[],
    ignoreSummoningConditions: boolean
  ) => {
    posList: Readonly<TBattlePosition[]>;
    cells: DuelFieldCell[];
  };
  public constructor(
    title: string,
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttr>,
    isApplicableTo: (operator: StickyEffectOperatorBase, target: DuelEntity) => boolean,
    summonKinds: Readonly<TSummonKindCauseReason[]>,
    filter: (
      filter: SummonFilter,
      filterTarget: DuelEntity,
      effectOwner: Duelist,
      summoner: Duelist,
      movedAs: TDuelCauseReason[],
      actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
      monster: DuelEntity,
      materialInfos: SummonMaterialInfo[],
      posList: Readonly<TBattlePosition[]>,
      cells: DuelFieldCell[],
      ignoreSummoningConditions: boolean
    ) => {
      posList: Readonly<TBattlePosition[]>;
      cells: DuelFieldCell[];
    }
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, actionAttr, isApplicableTo);
    this.summonKinds = summonKinds;
    this.filter = (...args) => filter(this, ...args);
  }
}

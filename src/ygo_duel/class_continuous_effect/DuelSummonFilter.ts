import type { CardActionDefinitionAttr } from "../class/DuelCardAction";
import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool } from "./DuelStickyEffectOperatorBase";
import { type DuelEntity, type TDuelCauseReason, type TSummonRuleCauseReason } from "../class/DuelEntity";
import { type Duelist, type SummonChoice } from "../class/Duelist";
import type { MaterialInfo } from "@ygo_duel/cards/CardDefinitions";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type { TBattlePosition } from "@ygo/class/YgoTypes";

export class SummonFilterPool extends StickyEffectOperatorPool<SummonFilter, SummonFilterBundle> {
  protected afterDistributeAll = () => true;
}

export class SummonFilterBundle extends StickyEffectOperatorBundle<SummonFilter> {
  protected beforePush = () => {};
  public readonly filter = (
    effectOwner: Duelist,
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
    summonChoice: SummonChoice,
    materialInfos: MaterialInfo[],
    ignoreSummoningConditions: boolean
  ) =>
    this.operators
      .filter((ope) => ope.summonTypes.includes(summonType))
      .reduce((wip, ope) => {
        return {
          ...wip,
          ...ope.filter(
            this.entity,
            effectOwner,
            summonChoice.summoner,
            moveAs,
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
  public readonly summonTypes: Readonly<TSummonRuleCauseReason[]>;
  public readonly filter: (
    filterTarget: DuelEntity,
    effectOwner: Duelist,
    summoner: Duelist,
    moveAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
    monster: DuelEntity,
    materialInfos: MaterialInfo[],
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
    summonTypes: Readonly<TSummonRuleCauseReason[]>,
    filter: (
      filter: SummonFilter,
      filterTarget: DuelEntity,
      effectOwner: Duelist,
      summoner: Duelist,
      moveAs: TDuelCauseReason[],
      actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
      monster: DuelEntity,
      materialInfos: MaterialInfo[],
      posList: Readonly<TBattlePosition[]>,
      cells: DuelFieldCell[],
      ignoreSummoningConditions: boolean
    ) => {
      posList: Readonly<TBattlePosition[]>;
      cells: DuelFieldCell[];
    }
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, actionAttr, isApplicableTo);
    this.summonTypes = summonTypes;
    this.filter = (...args) => filter(this, ...args);
  }
}

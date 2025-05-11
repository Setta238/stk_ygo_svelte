import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool } from "./DuelStickyEffectOperatorBase";
import type { DuelEntity, EntityStatus } from "../class/DuelEntity";
import type { CardActionDefinitionAttrs } from "../class/DuelEntityAction";
import type { Duel } from "@ygo_duel/class/Duel";

export class StatusOperatorPool extends StickyEffectOperatorPool<StatusOperator, StatusOperatorBundle> {
  protected readonly afterDistributeAll = (duel: Duel) => {
    return duel.field
      .getAllEntities()
      .map((entity) => entity.statusOperatorBundle)
      .every((bundle) => bundle.calcStatus());
  };
}

export class StatusOperatorBundle extends StickyEffectOperatorBundle<StatusOperator> {
  public readonly calcStatus = (): boolean => {
    const wasEffective = this.entity.isEffective;
    this.entity.resetStatus();
    // 対象ステータスのオペレータを抽出
    this.entity.status = this._operators
      .filter((ope) => ope.isSpawnedBy.isEffective || !ope.isContinuous)
      .reduce((wip, ope) => {
        return { ...wip, ...ope.statusCalculator(ope, wip) };
      }, this.entity.status);
    // 有効無効が切り替わったとき、再計算が必要
    return this.entity.isEffective === wasEffective;
  };
  protected readonly beforePush: (ope: StatusOperator) => void = () => {};
}
export class StatusOperator extends StickyEffectOperatorBase {
  public beforeRemove: () => void = () => {};
  public readonly statusCalculator: (operator: StickyEffectOperatorBase, wipStatus: EntityStatus) => Partial<EntityStatus>;
  public constructor(
    title: string,
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttrs>,
    isApplicableTo: (operator: StickyEffectOperatorBase, target: DuelEntity) => boolean,
    statusCalculator: (operator: StickyEffectOperatorBase, wipStatus: EntityStatus) => Partial<EntityStatus>
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, actionAttr, isApplicableTo);
    this.statusCalculator = statusCalculator;
  }
}

import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool } from "./DuelStickyEffectOperatorBase";
import type { DuelEntity, EntityStatus } from "../class/DuelEntity";
import type { CardActionBaseAttr } from "@ygo_duel/class/DuelCardAction";
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
    //    this.entity.resetStatus();
    // 対象ステータスのオペレータを抽出
    const oldStatus = { ...this.entity.status };
    const newStatus = this._operators.reduce((wip, ope) => {
      return ope.statusCalculator(ope, wip);
    }, oldStatus);
    this.entity.status = newStatus;

    // 有効無効が切り替わったとき、再計算が必要
    return this.entity.isEffective === wasEffective;
  };
  protected readonly beforePush: (ope: StatusOperator) => void = () => {};
}
export class StatusOperator extends StickyEffectOperatorBase {
  public beforeRemove: () => void = () => {};
  public readonly statusCalculator: (operator: StickyEffectOperatorBase, wipStatus: EntityStatus) => EntityStatus;
  public constructor(
    title: string,
    validateAlive: (spawner: DuelEntity) => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionBaseAttr>,
    isApplicableTo: (spawner: DuelEntity, target: DuelEntity) => boolean,
    statusCalculator: (operator: StickyEffectOperatorBase, wipStatus: EntityStatus) => EntityStatus
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, actionAttr, isApplicableTo);
    this.statusCalculator = statusCalculator;
  }
}

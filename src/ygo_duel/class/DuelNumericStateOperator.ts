import type { DuelEntity } from "./DuelEntity";
import { getStickyEffectOperatorBundleClass, StickyEffectOperatorBase, type IBroadOperator } from "./DuelStickyEffectOperatorBase";

export const flexibleStatus = ["Level", "Rank", "PendulumScale", "Attack", "Defense"] as const;
type TFlexibleState = (typeof flexibleStatus)[number];
export const stateOperationTypes = ["Addition", "Multiplication", "Fixation"] as const;
type TStateOperationType = (typeof stateOperationTypes)[number];

export class NumericStateOperatorBundle extends getStickyEffectOperatorBundleClass<NumericStateOperator, BroadNumericStateOperator>() {}
export class NumericStateOperator extends StickyEffectOperatorBase {
  public static readonly createContinuous = (
    title: string,
    targetState: TFlexibleState,
    stateOperationType: TStateOperationType,
    getValue: () => number,
    validateAlive: () => boolean,
    isSpawnedBy: DuelEntity
  ) => {
    return new NumericStateOperator(title, validateAlive, true, isSpawnedBy, targetState, stateOperationType, getValue);
  };
  public static readonly createLingering = (
    title: string,
    targetState: TFlexibleState,
    stateOperationType: TStateOperationType,
    value: number,
    validateAlive: () => boolean,
    isSpawnedBy: DuelEntity
  ) => {
    return new NumericStateOperator(title, validateAlive, false, isSpawnedBy, targetState, stateOperationType, () => value);
  };

  public readonly targetState: TFlexibleState;
  public readonly stateOperationType: TStateOperationType;
  public readonly getValue: () => number;

  protected constructor(
    title: string,
    validateAlive: () => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    targetState: TFlexibleState,
    stateOperationType: TStateOperationType,
    getValue: () => number
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy);
    this.targetState = targetState;
    this.stateOperationType = stateOperationType;
    this.getValue = getValue;
  }
}

export class BroadNumericStateOperator extends NumericStateOperator implements IBroadOperator {
  public static readonly createBroadContinuous = (
    title: string,
    targetState: TFlexibleState,
    stateOperationType: TStateOperationType,
    getValue: () => number,
    validateAlive: () => boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (entity: DuelEntity) => boolean
  ) => {
    return new BroadNumericStateOperator(title, validateAlive, true, isSpawnedBy, targetState, stateOperationType, getValue, isApplicableTo);
  };
  public static readonly createBroadLingering = (
    title: string,
    targetState: TFlexibleState,
    stateOperationType: TStateOperationType,
    value: number,
    validateAlive: () => boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (entity: DuelEntity) => boolean
  ) => {
    return new BroadNumericStateOperator(title, validateAlive, false, isSpawnedBy, targetState, stateOperationType, () => value, isApplicableTo);
  };

  public readonly isApplicableTo: (entity: DuelEntity) => boolean;
  public constructor(
    title: string,
    validateAlive: () => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    targetState: TFlexibleState,
    stateOperationType: TStateOperationType,
    getValue: () => number,
    isApplicableTo: (entity: DuelEntity) => boolean
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, targetState, stateOperationType, getValue);
    this.isApplicableTo = isApplicableTo;
  }
}

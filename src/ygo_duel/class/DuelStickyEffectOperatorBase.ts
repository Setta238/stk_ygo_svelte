import type { DuelEntity } from "./DuelEntity";

export interface IBroadOperator {
  isApplicableTo: (entity: DuelEntity) => boolean;
}

// 「静的メンバーはクラスの型パラメーターを参照できません。」を回避するために、関数に型パラメータを定義してclassは静的にする。
export const getStickyEffectOperatorBundleClass = <L extends StickyEffectOperatorBase, B extends L & IBroadOperator>() => {
  // 型パラメータを関数が持っているので、classの型パラメータが不要になる
  return class StickyEffectOperatorBundle {
    // 広域適用の作用素
    private static _broadOperators: B[] = [];
    public static get broadOperators() {
      return StickyEffectOperatorBundle._broadOperators;
    }
    public static readonly excludesExpired = () =>
      (StickyEffectOperatorBundle._broadOperators = StickyEffectOperatorBundle.broadOperators.filter((ope) => ope.validateAlive()));

    public static readonly removeItem = (isSpawnedBy: DuelEntity, title: string): void => {
      this._broadOperators = this.broadOperators.filter((ope) => ope.isSpawnedBy !== isSpawnedBy && ope.title !== title);
    };

    public readonly entity: DuelEntity;

    // 個別適用の作用素
    private _localOperators: L[];
    public get localOperators() {
      return this._localOperators;
    }
    public *getAllOperators() {
      yield* this.localOperators;
      yield* StickyEffectOperatorBundle.broadOperators.filter((ope) => ope.isApplicableTo(this.entity));
    }

    public constructor(entity: DuelEntity) {
      this.entity = entity;
      this._localOperators = [];
    }
    public readonly excludesExpired = () => (this._localOperators = this.localOperators.filter((ope) => ope.validateAlive()));
    public readonly removeItem = (isSpawnedBy: DuelEntity, title: string): void => {
      this._localOperators = this.localOperators.filter((ope) => ope.isSpawnedBy !== isSpawnedBy && ope.title !== title);
    };
  };
};

export abstract class StickyEffectOperatorBase {
  public readonly title: string;
  public readonly validateAlive: () => boolean;
  public readonly isContinuous: boolean;
  public readonly isSpawnedBy: DuelEntity;

  protected constructor(title: string, validateAlive: () => boolean, isContinuous: boolean, isSpawnedBy: DuelEntity) {
    this.title = title;
    this.validateAlive = validateAlive;
    this.isContinuous = isContinuous;
    this.isSpawnedBy = isSpawnedBy;
  }
}

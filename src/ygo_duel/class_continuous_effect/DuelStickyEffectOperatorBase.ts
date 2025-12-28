import type { Duelist } from "@ygo_duel/class/Duelist";
import { type Duel } from "@ygo_duel/class/Duel";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { type CardActionDefinitionAttrs } from "@ygo_duel/class/DuelEntityAction";
import type { IDuelClock } from "@ygo_duel/class/DuelClock";
import { getEffectActiovationType, type TEffectActiovationType } from "@ygo_duel/class/DuelEntityActionBase";
export interface IOperatorPool<OPE extends StickyEffectOperatorBase> {
  push: (ope: OPE) => void;
  append(bundle: StickyEffectOperatorBundle<OPE>): void; // NOTE error回避のため、bivariantになるメソッド記法で定義
  removeItem: (seq: number) => void;
  excludesExpired: () => void;
}
export interface IOperatorBundle<OPE extends StickyEffectOperatorBase> {
  operators: OPE[];
}
export abstract class StickyEffectOperatorPool<OPE extends StickyEffectOperatorBase, Bundle extends StickyEffectOperatorBundle<OPE>> {
  // 以降に出現したエンティティのために、オペレータをプールしておく
  private pooledOperators: OPE[] = [];
  protected bundles: Bundle[] = [];

  public readonly excludesExpired = () => {
    this.bundles.forEach((bundle) => bundle.excludesExpired());
    this.pooledOperators = this.pooledOperators.filter((ope) => ope.validateAlive());
  };

  public readonly append = (bundle: Bundle) => {
    this.bundles.push(bundle);
  };

  /**
   * 配布開始以後も適用対象が増える可能性のある永続効果はstatic側で受け取る。
   * @param ope
   */
  public readonly push = (ope: OPE) => {
    // 追加の前に、期限切れを削除
    this.excludesExpired();

    // 配布
    this.distribute(ope);

    // 今後適用対象になるもののために、オペレータをプールする。
    this.pooledOperators.push(ope);
  };

  public readonly distributeAll = (duel: Duel): boolean => {
    // 追加の前に、期限切れを削除
    this.excludesExpired();

    // 配布（※適用順は発生順という理解）
    this.pooledOperators
      .flatMap(this.distribute)
      .getDistinct()
      .forEach((bundle) => bundle.operators.sort((left, right) => left.seq - right.seq));

    return this.afterDistributeAll(duel);
  };

  protected abstract readonly afterDistributeAll: (duel: Duel) => boolean;

  public readonly distribute = (ope: OPE) => {
    // まだ配布されていないオペレータを配布する。
    return this.bundles
      .filter((bundle) => bundle.entity.exist)
      .filter((bundle) => bundle.operators.every((_ope) => _ope.seq !== ope.seq))
      .filter((bundle) => ope.isApplicableTo(bundle.entity))
      .filter((bundle) => bundle.entity.canBeEffected(ope.effectOwner, ope.isSpawnedBy, ope.actionAttr))
      .map((bundle) => {
        bundle.push(ope);
        return bundle;
      });
  };

  public readonly removeItem = (seq: number): void => {
    this.pooledOperators = this.pooledOperators.filter((ope) => ope.seq !== seq);
  };
}
export abstract class StickyEffectOperatorBundle<OPE extends StickyEffectOperatorBase> {
  public readonly pool: IOperatorPool<OPE>;
  public readonly entity: DuelEntity;

  // 各エンティティに適用されたオペレータ
  protected _operators: OPE[];

  public get operators() {
    return this._operators;
  }
  public get effectiveOperators() {
    return this.operators.filter((ope) => ope.isSpawnedBy.isEffective || !ope.isContinuous);
  }

  public constructor(pool: IOperatorPool<OPE>, entity: DuelEntity) {
    this.pool = pool;
    this.entity = entity;
    this._operators = [];
    // 広域オペレータを配布してもらうために、static側の配列に投入する。
    this.pool.append(this);
  }
  public readonly excludesExpired = () => {
    this._operators = this._operators.filter((ope) => {
      const isAlive = ope.validateAlive() && ope.isApplicableTo(this.entity);
      if (!isAlive) {
        console.info(`before remove ${this.entity.toString} ${ope.title}`);
        ope.beforeRemove(this);
      }
      return isAlive;
    });
  };
  protected abstract readonly beforePush: (ope: OPE) => void;
  protected abstract readonly afterPush: (ope: OPE) => void;

  public readonly push = (...opes: OPE[]) => {
    // ProcFilterで弾かれる場合は追加しない。

    opes.forEach((ope) => {
      if (!this.entity.procFilterBundle.filter(["Effect"], ope.effectOwner, ope.isSpawnedBy, ope.actionAttr, [])) {
        return false;
      }

      this.beforePush(ope);

      this._operators.push(ope);

      this.afterPush(ope);
    });
    return true;
  };

  public readonly removeItem = (seq: number): void => {
    this._operators = this._operators.filter((ope) => {
      if (ope.seq !== seq) {
        return true;
      }
      ope.beforeRemove(this);

      return false;
    });
  };
}

export type StickyEffectOperatorArgs = {
  title: string;
  validateAlive: (operator: StickyEffectOperatorBase) => boolean;
  isContinuous: boolean;
  isSpawnedBy: DuelEntity;
  actionAttr: Partial<CardActionDefinitionAttrs>;
  isApplicableTo: (operator: StickyEffectOperatorBase, target: DuelEntity) => boolean;
};

export abstract class StickyEffectOperatorBase {
  private static nextSeq = 0;

  public readonly seq: number;
  public readonly title: string;
  public readonly validateAlive: () => boolean;
  public readonly isContinuous: boolean;
  public readonly isSpawnedBy: DuelEntity;
  public readonly isSpawnedAt: IDuelClock;
  public readonly activateType: TEffectActiovationType;
  public readonly actionAttr: Partial<CardActionDefinitionAttrs>;
  public readonly isApplicableTo: (target: DuelEntity) => boolean;
  public readonly effectOwner: Duelist;
  public get duel() {
    return this.effectOwner.duel;
  }
  public abstract readonly beforeRemove: <OPE extends StickyEffectOperatorBase>(bundle: IOperatorBundle<OPE>) => void;

  public get isEffective() {
    if (!this.isContinuous) {
      return true;
    }
    if (this.activateType === "NonActivate") {
      return true;
    }

    return this.isSpawnedBy.isEffective;
  }

  protected constructor(args: StickyEffectOperatorArgs) {
    this.seq = StickyEffectOperatorBase.nextSeq++;
    this.title = args.title;
    this.validateAlive = () => args.validateAlive(this);
    this.isContinuous = args.isContinuous;
    this.isSpawnedBy = args.isSpawnedBy;
    this.isSpawnedAt = args.isSpawnedBy.duel.clock.getClone();
    this.isApplicableTo = (target: DuelEntity) => args.isApplicableTo(this, target);
    this.actionAttr = args.actionAttr;
    this.activateType = this.actionAttr.playType ? getEffectActiovationType(this.actionAttr.playType) : "NonActivate";
    this.effectOwner = this.isSpawnedBy.controller;
  }
}

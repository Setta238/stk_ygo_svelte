import { SystemError } from "../class/Duel";
import type { DuelEntity } from "../class/DuelEntity";
export interface IOperatorPool<OPE extends StickyEffectOperatorBase> {
  push: (ope: OPE) => void;
  append(bundle: StickyEffectOperatorBundle<OPE>): void; // NOTE error回避のため、bivariantになるメソッド記法で定義
  removeItem: (isSpawnedBy: DuelEntity, title: string) => void;
  excludesExpired: () => void;
}
export abstract class StickyEffectOperatorPool<OPE extends StickyEffectOperatorBase, Bundle extends StickyEffectOperatorBundle<OPE>> {
  // 以降に出現したエンティティのために、オペレータをプールしておく
  private pooledOperators: OPE[] = [];
  protected bundles: Bundle[] = [];

  public readonly excludesExpired = () => {
    this.bundles = this.bundles.filter((bundle) => !bundle.entity.hasDisappeared);
    this.pooledOperators = this.pooledOperators.filter((ope) => ope.validateAlive(ope.isSpawnedBy));
  };

  public readonly append = (bundle: Bundle) => {
    this.bundles.push(bundle);
  };

  /**
   * 配布開始以後も適用対象が増える可能性のある永続効果はstatic側で受け取る。
   * @param ope
   */
  public readonly push = (ope: OPE) => {
    if (!ope.isContinuous) {
      throw new SystemError("staticへの追加は永続以外不可", ope);
    }

    // 追加の前に、期限切れを削除
    this.excludesExpired();

    // 配布
    this.distribute(ope);

    // 今後適用対象になるもののために、オペレータをプールする。
    this.pooledOperators.push(ope);
  };

  public readonly distributeAll = () => {
    // 追加の前に、期限切れを削除
    this.excludesExpired();

    // 配布
    this.pooledOperators.flatMap(this.distribute);
    // ソートは不要？
    //       .getDistinct();
    //        .forEach((bundle) => bundle._operators.sort((left, right) => left.seq - right.seq));
  };
  public readonly distribute = (ope: OPE) => {
    console.log(this, ope);

    // まだ配布されていないオペレータを配布する。
    return this.bundles
      .filter((bundle) => bundle.operators.every((_ope) => _ope.seq !== ope.seq))
      .filter((bundle) => ope.isApplicableTo(ope.isSpawnedBy, bundle.entity))
      .map((bundle) => {
        bundle.push(ope);
        return bundle;
      });
  };

  public readonly removeItem = (spawner: DuelEntity, title: string): void => {
    this.pooledOperators = this.pooledOperators.filter((ope) => ope.isSpawnedBy !== spawner && ope.title !== title);
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

  public constructor(pool: IOperatorPool<OPE>, entity: DuelEntity) {
    this.pool = pool;
    this.entity = entity;
    this._operators = [];
    // 広域オペレータを配布してもらうために、static側の配列に投入する。
    this.pool.append(this);
  }
  public readonly excludesExpired = () => (this._operators = this._operators.filter((ope) => ope.validateAlive(ope.isSpawnedBy)));
  protected abstract readonly beforePush: (ope: OPE) => void;

  public readonly push = (ope: OPE) => {
    this.beforePush(ope);
    this._operators.push(ope);
  };

  public readonly removeItem = (spawner: DuelEntity, title: string): void => {
    this._operators = this._operators.filter((ope) => ope.isSpawnedBy !== spawner && ope.title !== title);
  };
}

export abstract class StickyEffectOperatorBase {
  private static nextSeq = 0;

  public readonly seq: number;
  public readonly title: string;
  public readonly validateAlive: (spawner: DuelEntity) => boolean;
  public readonly isContinuous: boolean;
  public readonly isSpawnedBy: DuelEntity;
  public readonly isApplicableTo: (spawner: DuelEntity, target: DuelEntity) => boolean;

  protected constructor(
    title: string,
    validateAlive: (spawner: DuelEntity) => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (spawner: DuelEntity, target: DuelEntity) => boolean
  ) {
    this.seq = StickyEffectOperatorBase.nextSeq++;
    this.title = title;
    this.validateAlive = validateAlive;
    this.isContinuous = isContinuous;
    this.isSpawnedBy = isSpawnedBy;
    this.isApplicableTo = isApplicableTo;
  }
}

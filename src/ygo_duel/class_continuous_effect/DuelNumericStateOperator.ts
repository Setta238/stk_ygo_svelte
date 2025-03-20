import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool } from "@ygo_duel/class_continuous_effect/DuelStickyEffectOperatorBase";
import { SystemError } from "@ygo_duel/class/Duel";
import { entityFlexibleStatusKeys, type TEntityFlexibleStatusGen, type TEntityFlexibleStatusKey } from "@ygo/class/YgoTypes";

export const stateOperationTypes = ["Addition", "Fixation", "THE_DEVILS_DREAD-ROOT", "THE_DEVILS_AVATAR", "Gradius'_Option"] as const;
type TStateOperationType = (typeof stateOperationTypes)[number];

// https://yugioh-wiki.net/index.php?%A5%B9%A5%C6%A1%BC%A5%BF%A5%B9#change
// 基本的には以下の処理となる。
//    「元々の攻撃力・守備力」を変える効果と「攻撃力・守備力」を変える効果は干渉せず、それぞれ適用される。
//    具体的には「攻撃力・守備力」を変える効果は一旦飛ばし、「元々の攻撃力・守備力」を変える効果を全て計算し終えてから、「攻撃力・守備力」を変える効果の計算に移る。
//    それぞれの中で効果が被った場合、後の効果が「アップ・ダウンする」ならそのまま計算し、「○○になる」ならその数値で上書きする。
// 例外として以下の処理がある。
//    「発動して攻撃力・守備力が指定された数値になる効果」の後に「発動して元々の攻撃力・守備力が指定された数値になる効果」がかかった場合、本来は干渉しないはずだが、後者の値で上書きされる。(23/11/17)
//    「発動して攻撃力・守備力が指定された数値になる効果」の後に「永続的な効果で元々の攻撃力・守備力が指定された数値になる効果」がかかった場合、本来は干渉しないはずだが、後者の値で上書きされる。(23/12/18)
//    「永続的な効果で攻撃力・守備力をアップ・ダウンする効果」の後に「永続的な効果で攻撃力・守備力が指定された数値になる効果」がかかった場合、「○○になる」ではあるが上書きせず、後者を計算した後に前者を計算する。(24/01/19)

// ★上ページの分類が便利なので、順番を変えて番号をふり、邪神アバターと邪神ドレッド・ルートを加える
//    発動して元々の攻撃力・守備力が指定された数値になる効果      →  発動元々指定 O-L-F
//    永続的な効果で元々の攻撃力・守備力が指定された数値になる効果  → 永続元々指定 O-C-F
//    発動して攻撃力・守備力が指定された数値になる効果            →  発動攻守指定 L-F
//    永続的な効果で攻撃力・守備力が指定された数値になる効果      →   永続攻守指定 C-F
//    発動して攻撃力・守備力がアップ・ダウンする効果              →  発動攻守上下 L-A
//    永続的な効果で攻撃力・守備力がアップ・ダウンする効果        →   永続攻守上下 C-A
//    邪神アバター、邪神ドレッド・ルート、オプション、オプション・トークン                             枠外

export class NumericStateOperatorPool extends StickyEffectOperatorPool<NumericStateOperator, NumericStateOperatorBundle> {
  public readonly calcStateAll = (): void => this.bundles.forEach((bundle) => bundle.calcStateAll());
}
export class NumericStateOperatorBundle extends StickyEffectOperatorBundle<NumericStateOperator> {
  public dominantOperators: { [key in TEntityFlexibleStatusKey]: NumericStateOperator | undefined } = {
    level: undefined,
    rank: undefined,
    attack: undefined,
    defense: undefined,
    pendulumScaleR: undefined,
    pendulumScaleL: undefined,
  };

  /**
   * 新しくオペレータが追加された場合
   * @param ope
   * @returns
   */
  protected readonly beforePush = (ope: NumericStateOperator) => {
    // 邪神アバター、オプション類の場合、計算が他者依存なので何もしない
    if (ope.stateOperationType === "THE_DEVILS_AVATAR" || ope.stateOperationType === "Gradius'_Option") {
      return;
    }

    // カード記載の攻撃力
    const originState = (this.entity.origin[ope.targetState] as number) ?? 0;
    // 元々の攻撃力
    const originStateWIP = this.entity.status["origin"][ope.targetState] ?? 0;
    // 永続効果適用前の攻撃力
    const currentStateWIP = this.entity.status["current"][ope.targetState] ?? 0;
    // 永続効果適用後の攻撃力（※前回計算時）
    const currentState = this.entity.status["calculated"][ope.targetState] ?? 0;
    // 現在支配的なオペレータ
    const domiOpe = this.dominantOperators[ope.targetState];

    // 邪神ドレッド・ルートの場合、現在値を半分にして終了
    if (ope.stateOperationType === "THE_DEVILS_DREAD-ROOT") {
      this.entity.status["calculated"][ope.targetState] = ope.calcValue(this.entity, currentState);
      return;
    }

    // 加算減算タイプ（L-A or C-A）
    if (ope.stateOperationType === "Addition") {
      // 加算減算タイプに元々の攻守を対象にするものはない
      if (ope.targetStateGen === "origin") {
        throw new SystemError("ありえない組合せ", ope);
      }
      // その場で加算
      if (!ope.isContinuous) {
        // L-A
        this.entity.status["current"][ope.targetState] = ope.calcValue(this.entity, currentStateWIP);
      }

      this.entity.status["calculated"][ope.targetState] = ope.calcValue(this.entity, currentStateWIP);
      return;
    }

    if (ope.targetStateGen === "origin") {
      // 元々の値を書き換えるタイプ(O-C-F or O-L-F)
      const tmp = ope.calcValue(this.entity, originState);

      // 例外１ or 例外２ の判定
      //    ※支配的な効果がL-Fの場合、情報が破壊されているためリセットの必要があるのだと思われる
      if (domiOpe && !domiOpe.isContinuous && domiOpe.targetStateGen !== "current") {
        // 例外１ or 例外２の場合、現在値も書き換え。
        this.entity.status["current"][ope.targetState] = tmp;
        // 支配的な効果を一旦undefinedに
        this.dominantOperators[ope.targetState] = undefined;
      }
      this.entity.status["origin"][ope.targetState] = tmp;
      // 支配的な効果がundefinedにであれば、支配的な効果を更新
      this.dominantOperators[ope.targetState] = domiOpe ?? ope;
    } else if (ope.isContinuous) {
      // 永続型の固定値タイプのうち、現在値を書き換え(C-F)
      //   ※下と違い、常に再計算の可能性があるため、永続的な加算減算と共存でき、固定にならなず例外３が発生するのだと思われる。
      this.entity.status["current"][ope.targetState] = ope.calcValue(this.entity, originStateWIP);

      // 支配的な効果を更新
      this.dominantOperators[ope.targetState] = ope;
    } else {
      // 発動型の固定値タイプのうち、現在値を書き換え(L-F)
      //   ※ゲイル、ブラックガーデンなどのタイプ。色々計算したあとの現在の値を書き換えるため、値が固定になる。
      //   ※多分この際に情報が破壊され、これが例外１と例外２の原因となったと思われる。
      this.entity.status["current"][ope.targetState] = ope.calcValue(this.entity, currentState);
      // 支配的な効果を更新
      this.dominantOperators[ope.targetState] = ope;
    }
  };

  public readonly calcStateAll = (): void => entityFlexibleStatusKeys.forEach(this.calcState);

  public readonly calcState = (targetState: TEntityFlexibleStatusKey): void => {
    if (this.entity.status.kind !== "Monster") {
      return;
    }

    if (targetState !== "level" && !this.entity.isOnField) {
      this.entity.status.origin[targetState] = this.entity.origin[targetState];
      this.entity.status.current[targetState] = this.entity.origin[targetState];
      this.entity.status.calculated[targetState] = this.entity.origin[targetState];
      return;
    }

    // 対象ステータスのオペレータを抽出
    const opeList = this._operators.filter((ope) => ope.targetState === targetState);
    // 邪神アバター、オプション類の場合、計算を一度スキップする
    if (opeList.some((ope) => ope.stateOperationType === "THE_DEVILS_AVATAR" || ope.stateOperationType === "Gradius'_Option")) {
      this.entity.status.calculated[targetState] = Number.MIN_VALUE;
      return;
    }

    // 現在支配的なオペレータ
    const domiOpe = this.dominantOperators[targetState];
    // 現在の元々の値
    const originStateWIP = this.entity.status.origin[targetState] ?? 0;
    // 現在値（永続適用前）
    let currentValue = this.entity.status.current[targetState] ?? 0;
    // 再計算の起点
    let startIndex = -1;
    if (domiOpe) {
      if (domiOpe.targetStateGen === "current" && domiOpe.isContinuous) {
        // 例外３のため、C-Fの場合は少し戻る
        startIndex = opeList.findLastIndex((ope) => ope.stateOperationType === "Fixation" && ope !== domiOpe);
        // 再計算
        currentValue = domiOpe.calcValue(this.entity, originStateWIP);
      } else {
        startIndex = opeList.findIndex((ope) => ope === domiOpe);
      }
    }
    // 一つ次から開始
    startIndex++;
    // 計算用work
    let wip = currentValue;

    if (startIndex < opeList.length) {
      for (let index = startIndex; index < opeList.length; index++) {
        const ope = opeList[index];
        if (ope.isContinuous) {
          if (ope.targetStateGen === "current") {
            if (ope.stateOperationType === "Addition") {
              wip = ope.calcValue(this.entity, wip);
            }
          }
        }
      }
    }
    // 邪神ドレッド・ルートのみ別計算
    opeList
      .filter((ope) => ope.stateOperationType === "THE_DEVILS_DREAD-ROOT")
      .forEach((ope) => {
        wip = ope.calcValue(this.entity, wip);
      });
    //結果を投入
    this.entity.status.calculated[targetState] = wip;
  };
}
export class NumericStateOperator extends StickyEffectOperatorBase {
  public static readonly createContinuous = (
    title: string,
    validateAlive: () => boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (entity: DuelEntity) => boolean,
    targetState: TEntityFlexibleStatusKey,
    targetStateGen: TEntityFlexibleStatusGen,
    stateOperationType: TStateOperationType,
    calcValue: (entity: DuelEntity, source: number) => number
  ) => {
    return new NumericStateOperator(title, validateAlive, true, isSpawnedBy, isApplicableTo, targetState, targetStateGen, stateOperationType, calcValue);
  };
  public static readonly createLingering = (
    title: string,
    validateAlive: () => boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (entity: DuelEntity) => boolean,
    targetState: TEntityFlexibleStatusKey,
    targetStateGen: TEntityFlexibleStatusGen,
    stateOperationType: TStateOperationType,
    value: number
  ) => {
    return new NumericStateOperator(title, validateAlive, false, isSpawnedBy, isApplicableTo, targetState, targetStateGen, stateOperationType, () => value);
  };

  public readonly targetState: TEntityFlexibleStatusKey;
  public readonly targetStateGen: TEntityFlexibleStatusGen;
  public readonly stateOperationType: TStateOperationType;
  public readonly calcValue: (entity: DuelEntity, source: number) => number;

  protected constructor(
    title: string,
    validateAlive: () => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (entity: DuelEntity) => boolean,
    targetState: TEntityFlexibleStatusKey,
    targetStateGen: TEntityFlexibleStatusGen,
    stateOperationType: TStateOperationType,
    calcValue: (entity: DuelEntity, source: number) => number
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, isApplicableTo);
    this.targetState = targetState;
    this.targetStateGen = targetStateGen;
    this.stateOperationType = stateOperationType;
    this.calcValue = calcValue;
  }
}

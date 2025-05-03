import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import {
  StickyEffectOperatorBase,
  StickyEffectOperatorBundle,
  StickyEffectOperatorPool,
  type IOperatorBundle,
} from "@ygo_duel/class_continuous_effect/DuelStickyEffectOperatorBase";
import { Duel, SystemError } from "@ygo_duel/class/Duel";
import { entityFlexibleStatusKeys, type TEntityFlexibleNumericStatusGen, type TEntityFlexibleNumericStatusKey } from "@ygo/class/YgoTypes";
import type { CardActionDefinitionAttr } from "@ygo_duel/class/DuelCardAction";

export const stateOperationTypes = ["Addition", "Fixation", "THE_DEVILS_DREAD-ROOT", "THE_DEVILS_AVATAR", "Gradius'_Option"] as const;
type TStateOperationType = (typeof stateOperationTypes)[number];

const minValueDic: { [key in TEntityFlexibleNumericStatusKey]: number } = {
  level: 1,
  rank: 1,
  attack: 0,
  defense: 0,
  pendulumScaleR: 0,
  pendulumScaleL: 0,
};

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
//    発動して攻撃力・守備力がアップ・ダウンする効果              →  発動攻守上下 L-A ※元に戻る事ができるかの判定が必要。
//    永続的な効果で攻撃力・守備力がアップ・ダウンする効果        →   永続攻守上下 C-A
//    銀幕の鏡壁、邪神ドレッド・ルート                          →   枠外 X-C-F
//    邪神アバター、オプション・トークン                        →     枠外 X-C-X

export class NumericStateOperatorPool extends StickyEffectOperatorPool<NumericStateOperator, NumericStateOperatorBundle> {
  public readonly afterDistributeAll = (duel: Duel) => {
    // 全てのステータスを再計算
    this.bundles.forEach((bundle) => bundle.calcStateAll());

    // 邪神アバター類のみ最後に計算
    //    ※邪神ドレッド・ルートがいると全体再計算が必要
    const needsRecalc = duel.field
      .getMonstersOnFieldStrictly()
      .flatMap((monster) => monster.numericOprsBundle)
      .flatMap((bundle) => bundle.effectiveOperators)
      .some((ope) => ope.targetStateGen === "calculated");

    if (needsRecalc) {
      // アバター類を一旦取り除いて最大値を出す。
      // ※少なくとも攻撃力はマイナスになるようマーキング済
      const otherMonsters = duel.field.getMonstersOnFieldStrictly().filter((monster) => (monster.atk ?? 0) >= 0);
      const maxAtk = otherMonsters.map((monster) => monster.atk ?? 0).reduce((wip, current) => (wip > current ? wip : current), 0);

      // フィールド上のモンスターのステータスを再計算
      duel.field.getMonstersOnFieldStrictly().forEach((monster) => {
        // オペレータのうち、例外三種を順番に適用
        monster.numericOprsBundle.effectiveOperators
          .filter((ope) => ope.targetStateGen === "calculated")
          .forEach((ope) => {
            // リンクモンスターが効果コピーしていた場合
            if (monster.status.monsterCategories?.includes("Link") && ope.targetState === "defense") {
              return;
            }
            if (ope.stateOperationType === "THE_DEVILS_AVATAR") {
              monster.numericStatus.calculated[ope.targetState] = maxAtk + 100;
              return;
            }

            monster.numericStatus.calculated[ope.targetState] = ope.calcValue(monster, monster.numericStatus.calculated[ope.targetState] ?? 0);
            return;
          });
      });
    }

    return true;
  };
}
export class NumericStateOperatorBundle extends StickyEffectOperatorBundle<NumericStateOperator> {
  /**
   * 新しくオペレータが追加された場合
   * @param ope
   * @returns
   */
  protected readonly beforePush = (ope: NumericStateOperator) => {
    // 対象ステータスのオペレータを抽出
    const opeList = this.effectiveOperators.filter((oldOpe) => oldOpe.targetState === ope.targetState).filter((oldOpe) => oldOpe.isEffective);

    // 発動する効果の無効化処理
    if (ope.kind === "O-L-F" || ope.kind === "O-C-F") {
      // 元々の数値を指定するものの場合

      // O-L-Fを全て無効化
      opeList.filter((oldOpe) => oldOpe.kind === "O-L-F").forEach((la) => la.negate());
      // 例外１の処理と例外２の処理
      opeList.filter((oldOpe) => oldOpe.kind === "L-F").forEach((la) => la.negate());
    } else if (ope.kind === "L-F" || ope.kind === "C-F") {
      // 現在の数値を指定するものの場合

      // L-AとL-Fを全て無効化。
      opeList.filter((oldOpe) => oldOpe.kind === "L-F" || oldOpe.kind === "L-A").forEach((la) => la.negate());
    } else if (ope.kind === "X-C-X") {
      // L系を全て無効化。
      opeList.filter((oldOpe) => !oldOpe.isContinuous).forEach((la) => la.negate());
    }

    // アバターまたはオプション類の効果が有効である場合、発動する効果は付着すらしない。
    if (opeList.filter((oldOpe) => oldOpe.isEffective).some((oldOpe) => oldOpe.kind === "X-C-X") && !ope.isContinuous) {
      return;
    }

    if (ope.stateOperationType !== "Addition" && ope.targetStateGen === "wip") {
      opeList.filter((oldOpe) => !oldOpe.isContinuous).forEach((la) => la.negate());
    }

    // 邪神アバター、オプション類の場合、計算が他者依存なので何もしない
    if (ope.stateOperationType === "THE_DEVILS_AVATAR" || ope.stateOperationType === "Gradius'_Option") {
      this.entity.numericStatus.calculated[ope.targetState] = -Number.MAX_VALUE;
      return;
    }

    // 永続効果適用後の攻撃力（※前回計算時）
    const currentState = this.entity.numericStatus["calculated"][ope.targetState] ?? 0;

    if (ope.stateOperationType === "THE_DEVILS_DREAD-ROOT") {
      // 邪神ドレッド・ルートの場合、現在値を半分にして終了
      this.entity.numericStatus["calculated"][ope.targetState] = ope.calcValue(this.entity, currentState);
      return;
    }

    if (ope.kind === "L-F") {
      // 発動型の固定値タイプのうち、現在値を書き換え(L-F)
      //   ※ゲイル、ブラックガーデンなどのタイプ。色々計算したあとの現在の値を書き換えるため、値が固定になる。
      //   ※多分この際に情報が破壊され、これが例外１と例外２の原因となったと思われる。

      this.entity.numericStatus["wip"][ope.targetState] = ope.calcValue(this.entity, currentState);
      return;
    }
  };

  public readonly calcStateAll = (): void => entityFlexibleStatusKeys.forEach(this.calcState);

  public readonly calcState = (targetState: TEntityFlexibleNumericStatusKey): void => {
    if (this.entity.kind !== "Monster" && !this.entity.isPendulumScale) {
      this.entity.numericStatus.calculated[targetState] = undefined;
      return;
    }

    if (!this.entity.status.monsterCategories) {
      this.entity.numericStatus.calculated[targetState] = undefined;
      return;
    }

    // TODO 検討⇒連想配列で定義したほうがいいかも？
    // リンクモンスターは攻撃力以外持たない
    if (this.entity.status.monsterCategories.includes("Link") && targetState !== "attack") {
      this.entity.numericStatus.calculated[targetState] = undefined;
      return;
    }

    // エクシーズモンスターはレベルを持たない
    if (this.entity.status.monsterCategories.includes("Xyz") && targetState === "level") {
      this.entity.numericStatus.calculated[targetState] = undefined;
      return;
    }

    // エクシーズモンスター以外はランクを持たない
    if (!this.entity.status.monsterCategories.includes("Xyz") && targetState === "rank") {
      this.entity.numericStatus.calculated[targetState] = undefined;
      return;
    }

    // ペンデュラムモンスター以外はペンデュラムスケールを持たない
    if (!this.entity.status.monsterCategories.includes("Pendulum") && (targetState === "pendulumScaleL" || targetState === "pendulumScaleR")) {
      this.entity.numericStatus.calculated[targetState] = undefined;
      return;
    }

    // レベル以外のステータスは、フィールドでのみ計算する。
    if (targetState !== "level" && !this.entity.isOnFieldStrictly) {
      this.entity.numericStatus.origin[targetState] = this.entity.origin[targetState];
      this.entity.numericStatus.wip[targetState] = this.entity.origin[targetState];
      this.entity.numericStatus.calculated[targetState] = this.entity.origin[targetState];
      return;
    }
    // カード記載の値
    const originValue = this.entity.origin[targetState] ?? 0;
    // 前回のwipの値
    const previousWipValue = this.entity.numericStatus.wip[targetState] ?? 0;

    // 対象ステータスのオペレータを抽出
    const opeList = this._operators.filter((ope) => ope.targetState === targetState).filter((oldOpe) => oldOpe.isEffective);

    // 邪神アバター、オプション類の場合、計算を一度スキップする
    if (opeList.some((ope) => ope.stateOperationType === "THE_DEVILS_AVATAR" || ope.stateOperationType === "Gradius'_Option") && this.entity.isEffective) {
      this.entity.numericStatus.calculated[targetState] = -Number.MAX_VALUE;
      return;
    }

    // 元々の値の計算
    const oOpe = opeList.filter((oldOpe) => oldOpe.targetState === targetState).findLast((oldOpe) => oldOpe.targetStateGen === "origin");

    // 値セット、ステータス更新
    const originValueWip = oOpe ? oOpe.calcValue(this.entity, originValue ?? 0) : originValue;
    this.entity.numericStatus.origin[targetState] = originValueWip;

    // 計算用work
    let wipValue = originValueWip;

    // 値の計算
    const fOpe = opeList
      .filter((oldOpe) => oldOpe.targetState === targetState)
      .filter((oldOpe) => oldOpe.targetStateGen === "wip")
      .findLast((oldOpe) => oldOpe.stateOperationType === "Fixation");

    if (!fOpe) {
      // fOpeがない場合、普通に計算し、wipステータスを更新する。
      wipValue = opeList.filter((ope) => ope.stateOperationType === "Addition").reduce((wip, ope) => ope.calcValue(this.entity, wip), wipValue);
      this.entity.numericStatus.wip[targetState] = wipValue;
    } else if (fOpe.isContinuous) {
      // C-Fの場合、C-Fを計算後、wipステータスを更新する。
      wipValue = fOpe.calcValue(this.entity, wipValue);
      wipValue = opeList.filter((ope) => ope.stateOperationType === "Addition").reduce((wip, ope) => ope.calcValue(this.entity, wip), wipValue);
      this.entity.numericStatus.wip[targetState] = wipValue;
    } else {
      // L-Fの場合、L-Fは計算せず、wipステータスを元にそれ以降を計算する。wipステータスは更新しない。
      let flg = false;
      wipValue = opeList
        .filter((ope) => {
          flg = flg || ope === fOpe;
          return flg && ope !== fOpe;
        })
        .filter((ope) => ope.stateOperationType === "Addition")
        .reduce((wip, ope) => ope.calcValue(this.entity, wip), previousWipValue);
    }

    // 最低値を割っている場合、上書き
    if (wipValue < minValueDic[targetState]) {
      wipValue = minValueDic[targetState];
    }

    //結果を投入
    this.entity.numericStatus.calculated[targetState] = wipValue;
  };
}
export class NumericStateOperator extends StickyEffectOperatorBase {
  public beforeRemove: <OPE extends StickyEffectOperatorBase>(bundle: IOperatorBundle<OPE>) => void = () => {};
  public static readonly createContinuous = (
    title: string,
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (operator: StickyEffectOperatorBase, target: DuelEntity) => boolean,
    targetState: TEntityFlexibleNumericStatusKey,
    targetStateGen: TEntityFlexibleNumericStatusGen,
    stateOperationType: TStateOperationType,
    calcValue: (spawner: DuelEntity, target: DuelEntity, current: number) => number
  ) => {
    return new NumericStateOperator(title, validateAlive, true, isSpawnedBy, {}, isApplicableTo, targetState, targetStateGen, stateOperationType, calcValue);
  };
  private static readonly createLingering = (
    title: string,
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttr>,
    targetState: TEntityFlexibleNumericStatusKey,
    stateOperationType: TStateOperationType,
    calcValue: (spawner: DuelEntity, target: DuelEntity, current: number) => number
  ) => {
    return new NumericStateOperator(
      title,
      validateAlive,
      false,
      isSpawnedBy,
      actionAttr,
      (operator, target) => target.isOnFieldAsMonsterStrictly,
      targetState,
      "wip",
      stateOperationType,
      calcValue
    );
  };
  public static readonly createLingeringFixation = (
    title: string,
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttr>,
    targetState: TEntityFlexibleNumericStatusKey,
    calcValue: (spawner: DuelEntity, target: DuelEntity, current: number) => number
  ) => {
    return NumericStateOperator.createLingering(title, validateAlive, isSpawnedBy, actionAttr, targetState, "Fixation", calcValue);
  };

  public static readonly createLingeringAddition = (
    title: string,
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttr>,
    targetState: TEntityFlexibleNumericStatusKey,
    calcValue: (spawner: DuelEntity, target: DuelEntity, current: number) => number
  ) => {
    return NumericStateOperator.createLingering(title, validateAlive, isSpawnedBy, actionAttr, targetState, "Addition", calcValue);
  };

  public readonly targetState: TEntityFlexibleNumericStatusKey;
  public readonly targetStateGen: TEntityFlexibleNumericStatusGen;
  public readonly stateOperationType: TStateOperationType;
  public readonly calcValue: (entity: DuelEntity, source: number) => number;
  private _isEffective: boolean;
  public override get isEffective() {
    return this._isEffective && super.isEffective;
  }

  public get kind() {
    if (this.targetStateGen === "origin") {
      if (this.stateOperationType === "Fixation") {
        return this.isContinuous ? "O-C-F" : "O-L-F";
      }
      throw new SystemError("矛盾したプロパティ", this);
    }
    if (this.targetStateGen === "wip") {
      if (this.stateOperationType === "Addition") {
        return this.isContinuous ? "C-A" : "L-A";
      }
      if (this.stateOperationType === "Fixation") {
        return this.isContinuous ? "C-F" : "L-F";
      }
      throw new SystemError("矛盾したプロパティ", this);
    }
    if (this.stateOperationType === "THE_DEVILS_DREAD-ROOT") {
      return "X-C-F";
    }
    if (this.stateOperationType === "THE_DEVILS_AVATAR" || this.stateOperationType === "Gradius'_Option") {
      return "X-C-X";
    }
    throw new SystemError("矛盾したプロパティ", this);
  }

  public constructor(
    title: string,
    validateAlive: (operator: StickyEffectOperatorBase) => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionDefinitionAttr>,
    isApplicableTo: (operator: StickyEffectOperatorBase, target: DuelEntity) => boolean,
    targetState: TEntityFlexibleNumericStatusKey,
    targetStateGen: TEntityFlexibleNumericStatusGen,
    stateOperationType: TStateOperationType,
    calcValue: (spawner: DuelEntity, target: DuelEntity, current: number) => number
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, actionAttr, isApplicableTo);
    this._isEffective = true;
    this.targetState = targetState;
    this.targetStateGen = targetStateGen;
    this.stateOperationType = stateOperationType;
    this.calcValue = (target: DuelEntity, current: number) => calcValue(this.isSpawnedBy, target, current);
  }

  public readonly negate = () => {
    this._isEffective = false;
  };
}

import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool } from "@ygo_duel/class_continuous_effect/DuelStickyEffectOperatorBase";
import { Duel, SystemError } from "@ygo_duel/class/Duel";
import { entityFlexibleStatusKeys, type TEntityFlexibleNumericStatusGen, type TEntityFlexibleNumericStatusKey } from "@ygo/class/YgoTypes";
import type { CardActionBaseAttr } from "@ygo_duel/class/DuelCardAction";

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
//    発動して攻撃力・守備力がアップ・ダウンする効果              →  発動攻守上下 L-A
//    永続的な効果で攻撃力・守備力がアップ・ダウンする効果        →   永続攻守上下 C-A
//    銀幕の鏡壁、邪神アバター、邪神ドレッド・ルート、オプション、オプション・トークン                             枠外

export class NumericStateOperatorPool extends StickyEffectOperatorPool<NumericStateOperator, NumericStateOperatorBundle> {
  public readonly afterDistributeAll = (duel: Duel) => {
    // 全てのステータスを再計算
    this.bundles.forEach((bundle) => bundle.calcStateAll());

    // 邪神アバター類のみ最後に計算
    //    ※邪神ドレッド・ルートがいると全体再計算が必要
    const needsRecalc = duel.field
      .getMonstersOnField()
      .flatMap((monster) => monster.numericOprsBundle)
      .flatMap((bundle) => bundle.operators)
      .some(
        (ope) =>
          ope.stateOperationType === "THE_DEVILS_AVATAR" || ope.stateOperationType === "THE_DEVILS_DREAD-ROOT" || ope.stateOperationType === "Gradius'_Option"
      );

    if (needsRecalc) {
      // アバター類を一旦取り除いて最大値を出す。
      // ※少なくとも攻撃力はマイナスになるようマーキング済
      const otherMonsters = duel.field.getMonstersOnField().filter((monster) => (monster.atk ?? 0) >= 0);
      const maxAtk = otherMonsters.map((monster) => monster.atk ?? 0).reduce((wip, current) => (wip > current ? wip : current), 0);

      // フィールド上のモンスターのステータスを再計算
      duel.field.getMonstersOnField().forEach((monster) => {
        // オプション類の場合、対象に取っているはずなので取得
        let gradius: DuelEntity | undefined = undefined;
        if (monster.info.effectTargets["Gradius'_Option"]) {
          gradius = monster.info.effectTargets["Gradius'_Option"][0];
        }

        // オペレータのうち、例外三種を順番に適用
        monster.numericOprsBundle.operators.forEach((ope) => {
          // リンクモンスターが効果コピーしていた場合
          if (monster.status.monsterCategories?.includes("Link") && ope.targetState === "defense") {
            return;
          }

          if (ope.stateOperationType === "Gradius'_Option") {
            monster.numericStatus.calculated[ope.targetState] = gradius?.numericStatus.calculated[ope.targetState] ?? 0;
            return;
          }
          if (ope.stateOperationType === "THE_DEVILS_AVATAR") {
            monster.numericStatus.calculated[ope.targetState] = maxAtk + 100;
            return;
          }
          if (ope.stateOperationType === "THE_DEVILS_DREAD-ROOT") {
            monster.numericStatus.calculated[ope.targetState] = ope.calcValue(ope.isSpawnedBy, monster, monster.numericStatus.calculated[ope.targetState] ?? 0);
            return;
          }
        });
      });
    }

    return true;
  };
}
export class NumericStateOperatorBundle extends StickyEffectOperatorBundle<NumericStateOperator> {
  public dominantOperators: { [key in TEntityFlexibleNumericStatusKey]: NumericStateOperator | undefined } = {
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
    const originStateWIP = this.entity.numericStatus["origin"][ope.targetState] ?? 0;
    // 永続効果適用前の攻撃力
    const currentStateWIP = this.entity.numericStatus["current"][ope.targetState] ?? 0;
    // 永続効果適用後の攻撃力（※前回計算時）
    const currentState = this.entity.numericStatus["calculated"][ope.targetState] ?? 0;
    // 現在支配的なオペレータ
    const domiOpe = this.dominantOperators[ope.targetState];

    // 邪神ドレッド・ルートの場合、現在値を半分にして終了
    if (ope.stateOperationType === "THE_DEVILS_DREAD-ROOT") {
      this.entity.numericStatus["calculated"][ope.targetState] = ope.calcValue(ope.isSpawnedBy, this.entity, currentState);
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
        this.entity.numericStatus["current"][ope.targetState] = ope.calcValue(ope.isSpawnedBy, this.entity, currentStateWIP);
      }

      this.entity.numericStatus["calculated"][ope.targetState] = ope.calcValue(ope.isSpawnedBy, this.entity, currentStateWIP);
      return;
    }

    if (ope.targetStateGen === "origin") {
      // 元々の値を書き換えるタイプ(O-C-F or O-L-F)
      const tmp = ope.calcValue(ope.isSpawnedBy, this.entity, originState);

      // 例外１ or 例外２ の判定
      //    ※支配的な効果がL-Fの場合、情報が破壊されているためリセットの必要があるのだと思われる
      if (domiOpe && !domiOpe.isContinuous && domiOpe.targetStateGen !== "current") {
        // 例外１ or 例外２の場合、現在値も書き換え。
        this.entity.numericStatus["current"][ope.targetState] = tmp;
        // 支配的な効果を一旦undefinedに
        this.dominantOperators[ope.targetState] = undefined;
      }
      this.entity.numericStatus["origin"][ope.targetState] = tmp;
      // 支配的な効果がundefinedにであれば、支配的な効果を更新
      this.dominantOperators[ope.targetState] = domiOpe ?? ope;
    } else if (ope.isContinuous) {
      // 永続型の固定値タイプのうち、現在値を書き換え(C-F)
      //   ※下と違い、常に再計算の可能性があるため、永続的な加算減算と共存でき、固定にならなず例外３が発生するのだと思われる。
      this.entity.numericStatus["current"][ope.targetState] = ope.calcValue(ope.isSpawnedBy, this.entity, originStateWIP);

      // 支配的な効果を更新
      this.dominantOperators[ope.targetState] = ope;
    } else {
      // 発動型の固定値タイプのうち、現在値を書き換え(L-F)
      //   ※ゲイル、ブラックガーデンなどのタイプ。色々計算したあとの現在の値を書き換えるため、値が固定になる。
      //   ※多分この際に情報が破壊され、これが例外１と例外２の原因となったと思われる。
      this.entity.numericStatus["current"][ope.targetState] = ope.calcValue(ope.isSpawnedBy, this.entity, currentState);
      // 支配的な効果を更新
      this.dominantOperators[ope.targetState] = ope;
    }
  };

  public readonly calcStateAll = (): void => entityFlexibleStatusKeys.forEach(this.calcState);

  public readonly calcState = (targetState: TEntityFlexibleNumericStatusKey): void => {
    if (this.entity.status.kind !== "Monster") {
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
    if (targetState !== "level" && !this.entity.isOnField) {
      this.entity.numericStatus.origin[targetState] = this.entity.origin[targetState];
      this.entity.numericStatus.current[targetState] = this.entity.origin[targetState];
      this.entity.numericStatus.calculated[targetState] = this.entity.origin[targetState];
      return;
    }

    // 対象ステータスのオペレータを抽出
    const opeList = this._operators.filter((ope) => ope.targetState === targetState);
    // 邪神アバター、オプション類の場合、計算を一度スキップする
    if (opeList.some((ope) => ope.stateOperationType === "THE_DEVILS_AVATAR" || ope.stateOperationType === "Gradius'_Option") && this.entity.isEffective) {
      this.entity.numericStatus.calculated[targetState] = -Number.MAX_VALUE;
      return;
    }

    // 現在支配的なオペレータ
    const domiOpe = this.dominantOperators[targetState];
    // 現在の元々の値
    const originStateWIP = this.entity.numericStatus.origin[targetState] ?? 0;
    // 現在値（永続適用前）
    let currentValue = this.entity.numericStatus.current[targetState] ?? 0;
    // 再計算の起点
    let startIndex = -1;
    if (domiOpe) {
      if (domiOpe.targetStateGen === "current" && domiOpe.isContinuous) {
        // 例外３のため、C-Fの場合は少し戻る
        startIndex = opeList.findLastIndex((ope) => ope.stateOperationType === "Fixation" && ope !== domiOpe);
        // 再計算
        currentValue = domiOpe.calcValue(domiOpe.isSpawnedBy, this.entity, originStateWIP);
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
              wip = ope.calcValue(ope.isSpawnedBy, this.entity, wip);
            }
          }
        }
      }
    }

    // 最低値を割っている場合、上書き
    if (wip < minValueDic[targetState]) {
      wip = minValueDic[targetState];
    }

    //結果を投入
    this.entity.numericStatus.calculated[targetState] = wip;
  };
}
export class NumericStateOperator extends StickyEffectOperatorBase {
  public beforeRemove: () => void = () => {};
  public static readonly createContinuous = (
    title: string,
    validateAlive: (spawner: DuelEntity) => boolean,
    isSpawnedBy: DuelEntity,
    isApplicableTo: (spawner: DuelEntity, target: DuelEntity) => boolean,
    targetState: TEntityFlexibleNumericStatusKey,
    targetStateGen: TEntityFlexibleNumericStatusGen,
    stateOperationType: TStateOperationType,
    calcValue: (spawner: DuelEntity, target: DuelEntity, current: number) => number
  ) => {
    return new NumericStateOperator(title, validateAlive, true, isSpawnedBy, {}, isApplicableTo, targetState, targetStateGen, stateOperationType, calcValue);
  };
  public static readonly createLingering = (
    title: string,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionBaseAttr>,
    targetState: TEntityFlexibleNumericStatusKey,
    targetStateGen: TEntityFlexibleNumericStatusGen,
    stateOperationType: TStateOperationType,
    calcValue: (spawner: DuelEntity, target: DuelEntity, current: number) => number
  ) => {
    return new NumericStateOperator(
      title,
      () => true,
      false,
      isSpawnedBy,
      actionAttr,
      () => true,
      targetState,
      targetStateGen,
      stateOperationType,
      calcValue
    );
  };

  public readonly targetState: TEntityFlexibleNumericStatusKey;
  public readonly targetStateGen: TEntityFlexibleNumericStatusGen;
  public readonly stateOperationType: TStateOperationType;
  public readonly calcValue: (spawner: DuelEntity, entity: DuelEntity, source: number) => number;

  protected constructor(
    title: string,
    validateAlive: (spawner: DuelEntity) => boolean,
    isContinuous: boolean,
    isSpawnedBy: DuelEntity,
    actionAttr: Partial<CardActionBaseAttr>,

    isApplicableTo: (spawner: DuelEntity, target: DuelEntity) => boolean,
    targetState: TEntityFlexibleNumericStatusKey,
    targetStateGen: TEntityFlexibleNumericStatusGen,
    stateOperationType: TStateOperationType,
    calcValue: (spawner: DuelEntity, target: DuelEntity, current: number) => number
  ) {
    super(title, validateAlive, isContinuous, isSpawnedBy, actionAttr, isApplicableTo);
    this.targetState = targetState;
    this.targetStateGen = targetStateGen;
    this.stateOperationType = stateOperationType;
    this.calcValue = calcValue;
  }
}

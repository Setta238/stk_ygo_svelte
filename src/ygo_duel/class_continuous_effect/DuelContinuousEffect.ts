import type { TCardKind } from "@ygo/class/YgoTypes";
import type { DuelEntity, TDuelEntityFace } from "../class/DuelEntity";
import { playFieldCellTypes, type DuelFieldCellType } from "../class/DuelFieldCell";
import { SystemError } from "../class/Duel";
import { type NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import type { IOperatorPool, StickyEffectOperatorBase, StickyEffectOperatorBundle } from "./DuelStickyEffectOperatorBase";
import type { ProcFilter } from "./DuelProcFilter";
import type { StatusOperator } from "./DuelStatusOperator";
import { duelPeriodKeys, type TDuelPeriodKey } from "@ygo_duel/class/DuelPeriod";
import type { DamageFilter } from "./DuelDamageFilter";

export type ContinuousEffectBase<T> = {
  title: string;
  appliableCellTypes: DuelFieldCellType[];
  appliableDuelPeriodKeys: Readonly<TDuelPeriodKey[]>;
  faceList: Readonly<TDuelEntityFace[]>;
  canStart: (source: DuelEntity) => boolean;
  start: (source: DuelEntity) => Promise<T>;
  finish: (source: DuelEntity, info: T) => Promise<void>;
};

/**
 * 正規の永続効果（フィールドで表側表示で存在する限り有効）以外も扱う
 * 開始終了の制御のみを行い、処理はactivate時に作成したオブジェクトで行う
 * 開始終了は効果の有効無効とは無関係
 */
export class ContinuousEffect<T> {
  public static readonly createNew = <T>(entity: DuelEntity, cdb: ContinuousEffectBase<T>) => new ContinuousEffect<T>(entity, cdb);
  public readonly entity: DuelEntity;
  public readonly isRegular: boolean;
  private _isStarted: boolean;
  public get isStarted() {
    return this._isStarted;
  }
  private info: T | undefined;
  private readonly continuousEffectBase: ContinuousEffectBase<T>;

  public get appliableCellTypes() {
    return this.continuousEffectBase.appliableCellTypes;
  }
  public get appliableDuelPeriodKeys() {
    return this.continuousEffectBase.appliableDuelPeriodKeys;
  }
  public get faceList() {
    return this.continuousEffectBase.faceList;
  }
  private constructor(entity: DuelEntity, continuousEffectBase: ContinuousEffectBase<T>) {
    this._isStarted = false;
    this.entity = entity;
    this.continuousEffectBase = continuousEffectBase;
    this.isRegular =
      this.appliableCellTypes.every((ct) => playFieldCellTypes.find((t) => t === ct)) && this.faceList.length === 1 && this.faceList[0] === "FaceUp";
  }

  public readonly updateState = async () => {
    if (this.hasToStart !== this.isStarted) {
      if (this.isStarted) {
        if (!this.info) {
          throw new SystemError("illegal state");
        }
        this._isStarted = false;
        await this.continuousEffectBase.finish(this.entity, this.info);
        this.info = undefined;
        return;
      }
      this.info = await this.continuousEffectBase.start(this.entity);
      this._isStarted = true;
    }
  };

  private get hasToStart() {
    if (!this.appliableCellTypes.includes(this.entity.cell.cellType)) {
      return false;
    }
    if (!this.appliableDuelPeriodKeys.includes(this.entity.duel.clock.period.key)) {
      return false;
    }

    if (!this.faceList.includes(this.entity.face)) {
      return false;
    }

    return this.continuousEffectBase.canStart(this.entity);
  }
}

/**
 * poolの必要がある正規の永続効果（フィールドで表側表示で存在する限り有効）を作成するラッパー関数
 * @param title
 * @param kind
 * @param canStart
 * @param opeListCreater
 * @param getPool
 * @returns
 */
export const createBroadRegularOperatorHandler = <OPE extends StickyEffectOperatorBase>(
  title: string,
  kind: TCardKind,
  opeListCreater: (source: DuelEntity) => OPE[],
  getPool: (source: DuelEntity) => IOperatorPool<OPE>
): ContinuousEffectBase<number[]> => {
  return {
    title: title,
    appliableCellTypes: kind === "Monster" ? ["MonsterZone", "ExtraMonsterZone"] : ["FieldSpellZone", "SpellAndTrapZone"],
    appliableDuelPeriodKeys: duelPeriodKeys,
    faceList: ["FaceUp"],
    canStart: (source) => !source.info.isPending && !source.info.isDying,
    start: async (entity: DuelEntity): Promise<number[]> => {
      const list = opeListCreater(entity);
      list.forEach(getPool(entity).push);
      return list.map((item) => item.seq);
    },
    finish: async (entity: DuelEntity, info: number[]): Promise<void> => {
      info.forEach((seq) => getPool(entity).removeItem(seq));
    },
  };
};

/**
 * poolの必要がない正規の永続効果（フィールドで表側表示で存在する限り有効）を作成するラッパー関数
 * @param title
 * @param kind
 * @param getTargets
 * @param canStart
 * @param opeListCreater
 * @param getBundle
 * @returns
 */
export const createRegularOperatorHandler = <OPE extends StickyEffectOperatorBase>(
  title: string,
  kind: TCardKind,
  getTargets: (source: DuelEntity) => DuelEntity[],
  opeListCreater: (source: DuelEntity) => OPE[],
  getBundle: (source: DuelEntity) => StickyEffectOperatorBundle<OPE>
): ContinuousEffectBase<{ targets: DuelEntity[]; seqList: number[] }> => {
  return {
    title: title,
    appliableCellTypes: kind === "Monster" ? ["MonsterZone", "ExtraMonsterZone"] : ["FieldSpellZone", "SpellAndTrapZone"],
    appliableDuelPeriodKeys: duelPeriodKeys,
    faceList: ["FaceUp"],
    canStart: (source) => !source.info.isPending && !source.info.isDying,
    start: async (source: DuelEntity): Promise<{ targets: DuelEntity[]; seqList: number[] }> => {
      const list = opeListCreater(source);
      const targets = getTargets(source);
      console.info(`start : ${source.toString()} ⇒ ${targets.map((e) => e.toString()).join(" ")} (${list.map((item) => item.title).join(" ")})`);
      targets.map(getBundle).forEach((bundle) => list.forEach(bundle.push));
      return { targets, seqList: list.map((item) => item.seq) };
    },
    finish: async (source: DuelEntity, info: { targets: DuelEntity[]; seqList: number[] }): Promise<void> => {
      info.targets.map(getBundle).forEach((bundle) => info.seqList.forEach((seq) => bundle.removeItem(seq)));
    },
  };
};

export const createBroadRegularProcFilterHandler = (title: string, kind: TCardKind, opeListCreater: (source: DuelEntity) => ProcFilter[]) => {
  return createBroadRegularOperatorHandler(title, kind, opeListCreater, (entity: DuelEntity) => entity.field.procFilterPool);
};
export const createRegularProcFilterHandler = (
  title: string,
  kind: TCardKind,
  getTargets: (source: DuelEntity) => DuelEntity[],
  opeListCreater: (source: DuelEntity) => ProcFilter[]
) => {
  return createRegularOperatorHandler(title, kind, getTargets, opeListCreater, (entity: DuelEntity) => entity.procFilterBundle);
};
export const createBroadRegularNumericStateOperatorHandler = (
  title: string,
  kind: TCardKind,
  opeListCreater: (source: DuelEntity) => NumericStateOperator[]
) => {
  return createBroadRegularOperatorHandler(title, kind, opeListCreater, (entity: DuelEntity) => entity.field.numericStateOperatorPool);
};
export const createRegularNumericStateOperatorHandler = (
  title: string,
  kind: TCardKind,
  getTargets: (source: DuelEntity) => DuelEntity[],
  opeListCreater: (source: DuelEntity) => NumericStateOperator[]
) => {
  return createRegularOperatorHandler(title, kind, getTargets, opeListCreater, (entity: DuelEntity) => entity.numericOprsBundle);
};

export const createRegularStatusOperatorHandler = (
  title: string,
  kind: TCardKind,
  getTargets: (source: DuelEntity) => DuelEntity[],
  statusOperatorCreator: (source: DuelEntity) => StatusOperator[]
) => {
  return createRegularOperatorHandler(title, kind, getTargets, statusOperatorCreator, (entity: DuelEntity) => entity.statusOperatorBundle);
};

export const createBroadRegularDamageFilterHandler = (title: string, kind: TCardKind, opeListCreater: (source: DuelEntity) => DamageFilter[]) => {
  return createBroadRegularOperatorHandler(title, kind, opeListCreater, (entity: DuelEntity) => entity.field.damageFilterPool);
};

export const createRegularDamageFilterHandler = (
  title: string,
  kind: TCardKind,
  getTargets: (source: DuelEntity) => DuelEntity[],
  opeListCreater: (source: DuelEntity) => DamageFilter[]
) => {
  return createRegularOperatorHandler(title, kind, getTargets, opeListCreater, (entity: DuelEntity) => entity.damageFilterBundle);
};

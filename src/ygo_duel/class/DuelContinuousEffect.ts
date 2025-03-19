import type { TCardKind } from "@ygo/class/YgoTypes";
import type { DuelEntity, TDuelEntityFace } from "./DuelEntity";
import { playFieldCellTypes, DuelFieldCell, type DuelFieldCellType } from "./DuelFieldCell";
import { SystemError } from "./Duel";
import { type NumericStateOperator } from "./DuelNumericStateOperator";
import type { IOperatorPool, StickyEffectOperatorBase, StickyEffectOperatorBundle } from "./DuelStickyEffectOperatorBase";
import type { ProcFilter } from "./DuelProcFilter";

export type ContinuousEffectBase<T> = {
  title: string;
  executableCellTypes: DuelFieldCellType[];
  faceList: TDuelEntityFace[];
  canStart: (entity: DuelEntity) => boolean;
  start: (entity: DuelEntity) => Promise<T>;
  finish: (entity: DuelEntity, info: T) => Promise<void>;
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

  public get executableCellTypes() {
    return this.continuousEffectBase.executableCellTypes;
  }
  public get faceList() {
    return this.continuousEffectBase.faceList;
  }
  private constructor(entity: DuelEntity, continuousEffectBase: ContinuousEffectBase<T>) {
    this._isStarted = false;
    this.entity = entity;
    this.continuousEffectBase = continuousEffectBase;
    this.isRegular =
      this.executableCellTypes.every((ct) => playFieldCellTypes.find((t) => t === ct)) && this.faceList.length === 1 && this.faceList[0] === "FaceUp";
  }
  public readonly canStart = (cell: DuelFieldCell, face: TDuelEntityFace): boolean => {
    if (this.isStarted) {
      return false;
    }

    if (!this.executableCellTypes.includes(cell.cellType)) {
      return false;
    }

    if (!this.faceList.includes(face)) {
      return false;
    }

    return this.continuousEffectBase.canStart(this.entity);
  };
  public readonly start = async (): Promise<void> => {
    this.info = await this.continuousEffectBase.start(this.entity);
  };
  public readonly finish = async (): Promise<void> => {
    if (!this.info) {
      throw new SystemError("illegal state");
    }
    this._isStarted = false;
    await this.continuousEffectBase.finish(this.entity, this.info);
    this.info = undefined;
  };
}

export const createBroadRegularOperators = <OPE extends StickyEffectOperatorBase>(
  title: string,
  kind: TCardKind,
  validate: (entity: DuelEntity) => boolean,
  opeListCreater: (entity: DuelEntity) => OPE[],
  getPool: (entity: DuelEntity) => IOperatorPool<OPE>
): ContinuousEffectBase<string[]> => {
  return {
    title: title,
    executableCellTypes: kind === "Monster" ? ["MonsterZone", "ExtraMonsterZone"] : ["FieldSpellZone", "SpellAndTrapZone"],
    faceList: ["FaceUp"],
    canStart: validate,
    start: async (entity: DuelEntity): Promise<string[]> => {
      const list = opeListCreater(entity);
      console.log(list);
      list.forEach(getPool(entity).push);
      return list.map((item) => item.title).getDistinct();
    },
    finish: async (entity: DuelEntity, info: string[]): Promise<void> => {
      info.forEach((title) => getPool(entity).removeItem(entity, title));
    },
  };
};

export const createRegularOperators = <OPE extends StickyEffectOperatorBase>(
  title: string,
  kind: TCardKind,
  getTargets: (entity: DuelEntity) => DuelEntity[],
  validate: (entity: DuelEntity) => boolean,
  opeListCreater: (entity: DuelEntity) => OPE[],
  getBundle: (entity: DuelEntity) => StickyEffectOperatorBundle<OPE>
): ContinuousEffectBase<{ entities: DuelEntity[]; titles: string[] }> => {
  return {
    title: title,
    executableCellTypes: kind === "Monster" ? ["MonsterZone", "ExtraMonsterZone"] : ["FieldSpellZone", "SpellAndTrapZone"],
    faceList: ["FaceUp"],
    canStart: validate,
    start: async (entity: DuelEntity): Promise<{ entities: DuelEntity[]; titles: string[] }> => {
      const list = opeListCreater(entity);
      const entities = getTargets(entity);
      entities.map(getBundle).forEach((bundle) => list.forEach(bundle.push));
      return { entities: entities, titles: list.map((item) => item.title).getDistinct() };
    },
    finish: async (entity: DuelEntity, info: { entities: DuelEntity[]; titles: string[] }): Promise<void> => {
      info.entities.map(getBundle).forEach((bundle) => info.titles.forEach((title) => bundle.removeItem(entity, title)));
    },
  };
};

export const createBroadRegularProcFilters = (
  title: string,
  kind: TCardKind,
  validate: (entity: DuelEntity) => boolean,
  opeListCreater: (entity: DuelEntity) => ProcFilter[]
): ContinuousEffectBase<string[]> => {
  return createBroadRegularOperators(title, kind, validate, opeListCreater, (entity: DuelEntity) => entity.field.procFilterPool);
};
export const createRegularProcFilters = (
  title: string,
  kind: TCardKind,
  getTargets: (entity: DuelEntity) => DuelEntity[],
  validate: (entity: DuelEntity) => boolean,
  opeListCreater: (entity: DuelEntity) => ProcFilter[]
): ContinuousEffectBase<{ entities: DuelEntity[]; titles: string[] }> => {
  return createRegularOperators(title, kind, getTargets, validate, opeListCreater, (entity: DuelEntity) => entity.procFilterBundle);
};
export const createBroadNumericStateOperators = (
  title: string,
  kind: TCardKind,
  validate: (entity: DuelEntity) => boolean,
  opeListCreater: (entity: DuelEntity) => NumericStateOperator[]
): ContinuousEffectBase<string[]> => {
  return createBroadRegularOperators(title, kind, validate, opeListCreater, (entity: DuelEntity) => entity.field.numericStateOperatorPool);
};

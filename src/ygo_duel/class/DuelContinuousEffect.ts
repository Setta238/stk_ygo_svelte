import type { TCardKind } from "@ygo/class/YgoTypes";
import type { DuelEntity, TDuelEntityFace } from "./DuelEntity";
import { playFieldCellTypes, DuelFieldCell, type DuelFieldCellType } from "./DuelFieldCell";
import type { BroadProcFilter, ProcFilter } from "./DuelProcFilter";
import { SystemError } from "./Duel";

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

export const createBroadProcFilterContinuousEffect = (
  title: string,
  kind: TCardKind,
  validate: (entity: DuelEntity) => boolean,
  filterCreater: (entity: DuelEntity) => BroadProcFilter
): ContinuousEffectBase<string> => {
  return {
    title: title,
    executableCellTypes: kind === "Monster" ? ["MonsterZone", "ExtraMonsterZone"] : ["FieldSpellZone", "SpellAndTrapZone"],
    faceList: ["FaceUp"],
    canStart: validate,
    start: async (entity: DuelEntity): Promise<string> => {
      const pf = filterCreater(entity);
      entity.field.procFilters.push(pf);
      return pf.title;
    },
    finish: async (entity: DuelEntity, info: string): Promise<void> => {
      entity.field.removeProcFilter(entity, info);
    },
  };
};

export const createProcFilterContinuousEffect = (
  title: string,
  kind: TCardKind,
  entitySelector: (entity: DuelEntity) => DuelEntity[],
  validate: (entity: DuelEntity) => boolean,
  filterCreater: (entity: DuelEntity) => ProcFilter
): ContinuousEffectBase<string> => {
  return {
    title: title,
    executableCellTypes: kind === "Monster" ? ["MonsterZone", "ExtraMonsterZone"] : ["FieldSpellZone", "SpellAndTrapZone"],
    faceList: ["FaceUp"],
    canStart: validate,
    start: async (entity: DuelEntity): Promise<string> => {
      const pf = filterCreater(entity);
      entitySelector(entity).forEach((target) => {
        target.procFilters.push(pf);
      });
      return pf.title;
    },
    finish: async (entity: DuelEntity, info: string): Promise<void> => {
      entity.field.removeProcFilter(entity, info);
    },
  };
};

export const createSelfProcFilterContinuousEffect = (
  title: string,
  kind: TCardKind,
  validate: (entity: DuelEntity) => boolean,
  filterCreater: (entity: DuelEntity) => ProcFilter
): ContinuousEffectBase<string> => createProcFilterContinuousEffect(title, kind, (entity: DuelEntity) => [entity], validate, filterCreater);

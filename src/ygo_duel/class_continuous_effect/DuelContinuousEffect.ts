import type { TCardKind } from "@ygo/class/YgoTypes";
import type { DuelEntity, TDuelEntityFace } from "../class/DuelEntity";
import { playFieldCellTypes, type DuelFieldCellType } from "../class/DuelFieldCell";
import { SystemError } from "../class/Duel";
import { type NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import type { IOperatorPool, StickyEffectOperatorBase, StickyEffectOperatorBundle } from "./DuelStickyEffectOperatorBase";
import type { ProcFilter } from "./DuelProcFilter";
import type { CardRelation } from "./DuelCardRelation";
import type { StatusOperator } from "./DuelStatusOperator";

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
    if (this.entity.info.isPending) {
      return false;
    }

    if (!this.executableCellTypes.includes(this.entity.fieldCell.cellType)) {
      return false;
    }

    if (!this.faceList.includes(this.entity.face)) {
      return false;
    }

    return this.continuousEffectBase.canStart(this.entity);
  }
}

export const createBroadRegularOperatorHandler = <OPE extends StickyEffectOperatorBase>(
  title: string,
  kind: TCardKind,
  validate: (source: DuelEntity) => boolean,
  opeListCreater: (source: DuelEntity) => OPE[],
  getPool: (source: DuelEntity) => IOperatorPool<OPE>
): ContinuousEffectBase<number[]> => {
  return {
    title: title,
    executableCellTypes: kind === "Monster" ? ["MonsterZone", "ExtraMonsterZone"] : ["FieldSpellZone", "SpellAndTrapZone"],
    faceList: ["FaceUp"],
    canStart: validate,
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

export const createRegularOperatorHandler = <OPE extends StickyEffectOperatorBase>(
  title: string,
  kind: TCardKind,
  getTargets: (source: DuelEntity) => DuelEntity[],
  validate: (source: DuelEntity) => boolean,
  opeListCreater: (source: DuelEntity) => OPE[],
  getBundle: (source: DuelEntity) => StickyEffectOperatorBundle<OPE>
): ContinuousEffectBase<{ targets: DuelEntity[]; seqList: number[] }> => {
  console.log(title, kind, getTargets, validate, opeListCreater, getBundle);
  return {
    title: title,
    executableCellTypes: kind === "Monster" ? ["MonsterZone", "ExtraMonsterZone"] : ["FieldSpellZone", "SpellAndTrapZone"],
    faceList: ["FaceUp"],
    canStart: validate,
    start: async (target: DuelEntity): Promise<{ targets: DuelEntity[]; seqList: number[] }> => {
      const list = opeListCreater(target);
      const entities = getTargets(target);
      console.info(`start : ${target.toString()} ⇒ ${entities.map((e) => e.toString()).join(" ")} (${list.map((item) => item.title).join(" ")})`);
      entities.map(getBundle).forEach((bundle) => {
        console.log(bundle);
        list.forEach(bundle.push);
      });
      return { targets: entities, seqList: list.map((item) => item.seq) };
    },
    finish: async (entity: DuelEntity, info: { targets: DuelEntity[]; seqList: number[] }): Promise<void> => {
      info.targets.map(getBundle).forEach((bundle) => info.seqList.forEach((seq) => bundle.removeItem(seq)));
    },
  };
};

export const createBroadRegularProcFilterHandler = (
  title: string,
  kind: TCardKind,
  validate: (source: DuelEntity) => boolean,
  opeListCreater: (source: DuelEntity) => ProcFilter[]
) => {
  return createBroadRegularOperatorHandler(title, kind, validate, opeListCreater, (entity: DuelEntity) => entity.field.procFilterPool);
};
export const createRegularProcFilterHandler = (
  title: string,
  kind: TCardKind,
  getTargets: (source: DuelEntity) => DuelEntity[],
  validate: (source: DuelEntity) => boolean,
  opeListCreater: (source: DuelEntity) => ProcFilter[]
) => {
  return createRegularOperatorHandler(title, kind, getTargets, validate, opeListCreater, (entity: DuelEntity) => entity.procFilterBundle);
};
export const createBroadRegularNumericStateOperatorHandler = (
  title: string,
  kind: TCardKind,
  validate: (source: DuelEntity) => boolean,
  opeListCreater: (source: DuelEntity) => NumericStateOperator[]
) => {
  return createBroadRegularOperatorHandler(title, kind, validate, opeListCreater, (entity: DuelEntity) => entity.field.numericStateOperatorPool);
};
export const createRegularNumericStateOperatorHandler = (
  title: string,
  kind: TCardKind,
  getTargets: (source: DuelEntity) => DuelEntity[],
  validate: (source: DuelEntity) => boolean,
  opeListCreater: (source: DuelEntity) => NumericStateOperator[]
) => {
  return createRegularOperatorHandler(title, kind, getTargets, validate, opeListCreater, (entity: DuelEntity) => entity.numericOprsBundle);
};
export const createRegularEquipRelationHandler = (
  title: string,
  kind: TCardKind,
  validate: (source: DuelEntity) => boolean,
  relartionsCreater: (source: DuelEntity) => CardRelation[]
) => {
  return createRegularOperatorHandler(
    title,
    kind,
    (source: DuelEntity) => {
      console.log(title, source, source.info, source.info.effectTargets);
      return source.info.effectTargets[title];
    },
    validate,
    relartionsCreater,
    (entity: DuelEntity) => entity.cardRelationBundle
  );
};

export const createRegularStatusOperatorHandler = (
  title: string,
  kind: TCardKind,
  validate: (source: DuelEntity) => boolean,
  statusOperatorCreator: (source: DuelEntity) => StatusOperator[]
) => {
  return createRegularOperatorHandler(
    title,
    kind,
    (source: DuelEntity) => {
      console.log(title, source, source.info, source.info.effectTargets);
      return source.info.effectTargets[title];
    },
    validate,
    statusOperatorCreator,
    (entity: DuelEntity) => entity.statusOperatorBundle
  );
};

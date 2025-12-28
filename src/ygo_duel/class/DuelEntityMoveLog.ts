import type { IDuelClock, TDuelClockSubKey } from "./DuelClock";
import type { DuelEntity, TDuelCauseReason, TDuelEntityFace, TDuelEntityOrientation } from "./DuelEntity";
import type { Duelist } from "./Duelist";
import { DuelFieldCell } from "./DuelFieldCell";
import { getIndex } from "@stk_utils/funcs/StkMathUtils";
import { DuelField } from "./DuelField";
import type { TCardKind } from "@ygo/class/YgoTypes";
import { DuelError } from "@ygo_duel/class_error/DuelError";
import type { Mutable } from "@stk_utils/funcs/StkTypeUtils";

const duelEntityShallowCopyKeys = ["seq", "entityType", "origin", "cell", "kind", "nm", "lvl", "rank", "attr", "types", "atk", "def"] as const;
type TDuelEntityShallowCopyKey = (typeof duelEntityShallowCopyKeys)[number];
export type DuelEntityShallowCopy = Pick<DuelEntity, TDuelEntityShallowCopyKey>;

const getEntityShallowCopy = (entity?: DuelEntity): DuelEntityShallowCopy | undefined => {
  if (!entity) {
    return;
  }
  const copy: Mutable<Partial<DuelEntityShallowCopy>> = {};
  for (const key of duelEntityShallowCopyKeys) {
    // @ts-expect-error 同じキーでアクセスしているため、型チェック不要
    copy[key] = entity[key] as DuelEntity[typeof key];
  }
  return copy as DuelEntityShallowCopy;
};

export type EntityMoveLogRecord = {
  entity: DuelEntity;
  kind: TCardKind;
  cell: DuelFieldCell;
  face: TDuelEntityFace;
  orientation: TDuelEntityOrientation;
  isPending: boolean;
  movedAt: IDuelClock;
  movedAs: TDuelCauseReason[];
  movedBy?: DuelEntityShallowCopy;
  actionOwner?: Duelist;
  chooser?: Duelist;
};

export class BroadEntityMoveLog {
  private readonly _field: DuelField;
  private readonly _records: EntityMoveLogRecord[] = [];
  constructor(field: DuelField) {
    this._field = field;
  }
  private getIndexOfStartPoint = (totalProcSeq: number): number =>
    getIndex(
      this._records.map((record) => record.movedAt.totalProcSeq),
      totalProcSeq
    );
  private *getTermLog(target: "Current" | "Previous", key: TDuelClockSubKey) {
    const startPoint = target === "Current" ? this._field.duel.clock.currentStartPoints[key] : this._field.duel.clock.previousStartPoints[key];
    for (let index = this.getIndexOfStartPoint(startPoint); index < this._records.length; index++) {
      yield this._records[index];
    }
  }
  public readonly push = (record: EntityMoveLogRecord) => {
    this._records.push(record);
  };
  public readonly getCurrentTurnLog = () => this.getTermLog("Current", "turn");

  public readonly getPriviousChainLog = () => this.getTermLog("Previous", "chainSeq");
}

export class EntityMoveLog {
  private readonly entity: DuelEntity;
  private readonly _records: EntityMoveLogRecord[];
  public get records(): Readonly<EntityMoveLogRecord[]> {
    return this._records;
  }

  public get latestRecord() {
    return this.records.slice(-1)[0];
  }
  public get previousPlaceRecord() {
    return this.records.findLast((rec) => rec.cell.cellType !== this.entity.cell.cellType) ?? this._records[0];
  }
  public get currentProcRecords() {
    return this.records.filter((rec) => rec.movedAt.totalProcSeq === this.entity.duel.clock.totalProcSeq);
  }

  public get latestArrivalRecord() {
    if (!this.entity.isOnFieldAsMonsterStrictly) {
      return undefined;
    }

    return this.records.findLast((rec) => rec.movedAs.union(["NormalSummon", "SpecialSummon", "FlipSummon", "Flip", "ComeBackAlive"]).length);
  }

  public constructor(entity: DuelEntity) {
    this.entity = entity;
    this._records = [];
  }

  private readonly _push = (record: EntityMoveLogRecord) => {
    this.entity.field.moveLog.push(record);
    this._records.push(record);
  };

  public readonly pushForRuleAction = (movedAs: TDuelCauseReason[]) => {
    this._push({
      entity: this.entity,
      kind: this.entity.origin.kind,
      cell: this.entity.cell,
      face: this.entity.face,
      orientation: this.entity.orientation,
      isPending: this.entity.info.isPending,
      movedAt: this.entity.duel.clock.getClone(),
      movedAs: [...movedAs, "Rule"],
    });
  };

  public readonly push = (kind: TCardKind, movedAs: TDuelCauseReason[], movedBy?: DuelEntity, actionOwner?: Duelist, chooser?: Duelist) => {
    let cell = this.entity.cell;

    // XYZ素材のみ、ログ上「XYZ素材ゾーン」にいたことにする。
    if (this.entity.kind === "XyzMaterial") {
      cell = this.entity.controller.getXyzMaterialZone();
    }

    this._push({
      entity: this.entity,
      kind,
      cell,
      face: this.entity.face,
      orientation: this.entity.orientation,
      isPending: this.entity.info.isPending,
      movedAt: this.entity.duel.clock.getClone(),
      movedAs: movedAs.getDistinct(),
      movedBy: getEntityShallowCopy(movedBy),
      actionOwner: actionOwner,
      chooser: chooser ?? actionOwner,
    });
  };

  public readonly finalize = () => {
    if (!this.latestRecord.isPending) {
      throw new DuelError("想定されない状況");
    }
    if (this.entity.info.isPending) {
      throw new DuelError("想定されない状況");
    }
    this._push({ ...this.latestRecord, isPending: false, movedAt: this.entity.duel.clock.getClone() });
  };

  public readonly negateSummon = (movedBy: DuelEntity, activator: Duelist) => {
    const latestRecord = this.records.slice(-1)[0];
    latestRecord.cell = this.entity.field.getWaitingRoomCell();
    latestRecord.movedBy = getEntityShallowCopy(movedBy);
    latestRecord.movedAs = ["SummonNegated"];
    latestRecord.actionOwner = activator;
  };

  // public readonly pushByChainBlockInfo = (chainBlockInfo: ChainBlockInfo<unknown>, movedAs: TDuelCauseReason[]) => {
  //   this.push(movedAs, chainBlockInfo.action.entity, chainBlockInfo.activator);
  // };
}

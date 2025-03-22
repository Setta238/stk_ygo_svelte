import type { IDuelClock } from "./DuelClock";
import type { DuelEntity, TDuelCauseReason, TDuelEntityFace, TDuelEntityOrientation } from "./DuelEntity";
import type { Duelist } from "./Duelist";
import type { ChainBlockInfo } from "./DuelCardAction";
import type { DuelFieldCell } from "./DuelFieldCell";

export type DuelEntityLogRecord = {
  cell: DuelFieldCell;
  face: TDuelEntityFace;
  orientation: TDuelEntityOrientation;
  movedAt: IDuelClock;
  movedAs: TDuelCauseReason[];
  movedBy?: DuelEntity;
  actionOwner?: Duelist;
  chooser?: Duelist;
};
export class DuelEntityLog {
  private readonly entity: DuelEntity;
  private readonly _records: DuelEntityLogRecord[];
  public get records(): Readonly<Readonly<DuelEntityLogRecord[]>> {
    return this._records;
  }

  public get latestRecord() {
    return this._records.slice(-1)[0];
  }
  public get previousPlaceRecord() {
    return this._records.findLast((rec) => rec.cell.cellType !== this.entity.fieldCell.cellType) ?? this._records[0];
  }

  public constructor(entity: DuelEntity) {
    this.entity = entity;
    this._records = [];
  }

  public readonly pushForRuleAction = (movedAs: TDuelCauseReason[]) => {
    this._records.push({
      cell: this.entity.fieldCell,
      face: this.entity.face,
      orientation: this.entity.orientation,
      movedAt: this.entity.duel.clock.getClone(),
      movedAs: [...movedAs, "Rule"],
    });
  };

  public readonly push = (movedAs: TDuelCauseReason[], movedBy?: DuelEntity, actionOwner?: Duelist, chooser?: Duelist) => {
    this._records.push({
      cell: this.entity.fieldCell,
      face: this.entity.face,
      orientation: this.entity.orientation,
      movedAt: this.entity.duel.clock.getClone(),
      movedAs: movedAs,
      movedBy: movedBy,
      actionOwner: actionOwner,
      chooser: chooser ?? actionOwner,
    });
  };

  public readonly pushByChainBlockInfo = (chainBlockInfo: ChainBlockInfo<unknown>, movedAs: TDuelCauseReason[]) => {
    this.push(movedAs, chainBlockInfo.action.entity, chainBlockInfo.activator);
  };
}

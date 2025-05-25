import { StkEvent } from "@stk_utils/class/StkEvent";
import { SystemError } from "./Duel";
import { Duel } from "./Duel";
import { type Duelist } from "./Duelist";
import type { IDuelClock } from "./DuelClock";
import type { DuelEntity } from "./DuelEntity";
import { type DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { EzTransactionController } from "./DuelUtilTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logLevels = ["info", "warn", "error"] as const;
type TLogLevel = (typeof logLevels)[number];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logTypes = ["System", "ChainBlockHeader", "EntityMove", "EntityAppear", "EntityDisappear", "LifePoint", "Message", "Others"] as const;
type TLogType = (typeof logTypes)[number];
type DuelLogRecordOptions = {
  chainNumber?: number | undefined;
  mainEntity?: DuelEntity | undefined;
  subEntities?: DuelEntity[];
  from?: DuelFieldCell | undefined;
  to?: DuelFieldCell | undefined;
};
export type DuelLogRecord = {
  seq: number;
  lvl: TLogLevel;
  type: TLogType;
  clock: IDuelClock;
  duelist: Duelist | undefined;
  text: string;
} & DuelLogRecordOptions;
export default class DuelLog {
  private onUpdateEvent = new StkEvent<number>();
  public get onUpdate() {
    return this.onUpdateEvent.expose();
  }
  private nextSeq: number;
  public readonly records: DuelLogRecord[] = [];
  private _state: "Opened" | "Pending" = "Opened";
  private pooledRecords: DuelLogRecord[] = [];
  public readonly duel: Duel;
  public get lastRecord() {
    return this.records.slice(-1)[0];
  }
  public constructor(duel: Duel) {
    this.nextSeq = 0;
    this.duel = duel;
  }

  public readonly openTransaction = () => {
    if (this._state !== "Opened") {
      console.info("ログの二重トランザクションを開始しようとしたため、ダミーを返す。");
      return new EzTransactionController(
        () => {},
        () => {}
      );
    }

    this._state = "Pending";
    return new EzTransactionController(this.closeTransaction, this.commit);
  };

  private readonly commit = () => {
    if (this._state !== "Pending") {
      throw new SystemError("DuelLog is not in Pending state.");
    }
    this.records.push(...this.pooledRecords);
    this.pooledRecords = [];
    this.onUpdateEvent.trigger(this.nextSeq - 1);
  };
  private readonly closeTransaction = () => {
    this._state = "Opened";
    this.pooledRecords = [];
    this.onUpdateEvent.trigger(this.nextSeq - 1);
  };
  public readonly dispose = () => {
    this.onUpdateEvent.clear();
  };
  public readonly error = (error: unknown) => {
    const lines = ["エラー発生"];

    if (error instanceof Error) {
      if (error instanceof SystemError) {
        lines.push("-- エラーメッセージ --");
        lines.push(error.message);
        lines.push("-- 関連オブジェクト --");
        error.items.forEach((item) => lines.push(JSON.stringify(item)));
      }
      lines.push("-- エラー名称 --");
      lines.push(error.name || "エラー名称取得失敗");
      lines.push("-- スタックトレース --");
      lines.push(error.stack || "スタックトレース取得失敗");
    } else {
      lines.push("-- エラー型特定失敗 --");
      lines.push(JSON.stringify(error));
    }
    console.error(error);
    console.error(lines);
    this.write("error", "System", lines, undefined);
  };

  public readonly warn = (text: string) => {
    this.write("warn", "System", ["【注意】", text], undefined);
  };

  public readonly info = (text: string, duelist?: Duelist) => {
    this.write("info", "Others", [text], duelist);
  };

  public readonly pushChainBlockHeaderLog = (duelist: Duelist, chainNumber: number, text: string) => {
    this.write("info", "ChainBlockHeader", [text], duelist, { chainNumber });
  };

  public readonly pushMoveLog = (duelist: Duelist | undefined, entity: DuelEntity, from: DuelFieldCell, to: DuelFieldCell) => {
    const _from = from.cellType === "WaitingRoom" ? undefined : from;
    const _to = to.cellType === "WaitingRoom" ? undefined : to;
    if (!_from && !_to) {
      throw new SystemError("移動元、移動先ともにWaitingRoomが指定されている。", duelist, entity, from, to);
    }

    const type = _from && _to ? "EntityMove" : _to ? "EntityAppear" : "EntityDisappear";
    this.write("info", type, [], duelist, { mainEntity: entity, from: _from, to: _to });
  };

  private readonly write = (lvl: TLogLevel, type: TLogType, lines: string[], duelist: Duelist | undefined, options: DuelLogRecordOptions = {}) => {
    const text = lines.join("\n");
    const newRecord: DuelLogRecord = {
      seq: this.nextSeq++,
      lvl,
      type,
      clock: this.duel.clock.getClone(),
      text,
      duelist,
      subEntities: [],
      ...options,
    };
    if (this._state === "Opened" || lvl !== "info") {
      this.records.push(newRecord);
      this.onUpdateEvent.trigger(this.nextSeq - 1);
    } else {
      this.pooledRecords.push(newRecord);
    }
  };
}

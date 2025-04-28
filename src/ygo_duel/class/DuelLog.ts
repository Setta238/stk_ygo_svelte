import { StkEvent } from "@stk_utils/class/StkEvent";
import { SystemError } from "./Duel";
import { Duel } from "./Duel";
import { type Duelist } from "./Duelist";
import type { IDuelClock } from "./DuelClock";
import type { DuelEntity } from "./DuelEntity";
import type DuelFieldCell from "@ygo_duel_view/components/DuelFieldCell.svelte";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logLevels = ["info", "warn", "error"] as const;
type TLogLevel = (typeof logLevels)[number];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logTypes = ["System", "EntityMove", "LifePoint", "Message", "Others"] as const;
type TLogType = (typeof logTypes)[number];
export type DuelLogRecord = {
  seq: number;
  lvl: TLogLevel;
  type: TLogType;
  clock: IDuelClock;
  duelist: Duelist | undefined;
  text: string;
  mainEntity: DuelEntity | undefined;
  subEntities: DuelEntity[];
  from: DuelFieldCell | undefined;
  to: DuelFieldCell | undefined;
};
export default class DuelLog {
  private onUpdateEvent = new StkEvent<number>();
  public get onUpdate() {
    return this.onUpdateEvent.expose();
  }
  private nextSeq: number;
  public readonly records: DuelLogRecord[] = [];
  public readonly duel: Duel;
  public get lastRecord() {
    return this.records.slice(-1)[0];
  }
  public constructor(duel: Duel) {
    this.nextSeq = 0;
    this.duel = duel;
  }
  public readonly dispose = () => {
    this.onUpdateEvent.clear();
  };
  public readonly error = (error: unknown) => {
    console.error(error);
    const lines = ["エラー発生"];

    if (error instanceof Error) {
      if (error instanceof SystemError) {
        lines.push("-- エラーメッセージ --");
        lines.push(error.message);
        lines.push("-- 関連オブジェクト --");
        error.items.forEach((item) => lines.push(JSON.stringify(item)));
        console.error(error.items);
      }
      lines.push("-- エラー名称 --");
      lines.push(error.name || "エラー名称取得失敗");
      lines.push("-- スタックトレース --");
      lines.push(error.stack || "スタックトレース取得失敗");
    } else {
      lines.push("-- エラー型特定失敗 --");
      lines.push(JSON.stringify(error));
    }
    this.write("error", "System", lines, undefined, undefined, undefined, undefined, undefined);
  };

  public readonly warn = (text: string) => {
    this.write("warn", "System", ["【注意】", text], undefined, undefined, undefined, undefined, undefined);
  };

  public readonly info = (text: string, duelist?: Duelist) => {
    this.write("info", "Others", [text], duelist, undefined, undefined, undefined, undefined);
  };

  public readonly pushMoveLog = (duelist: Duelist | undefined, entity: DuelEntity, from: DuelFieldCell, to: DuelFieldCell) => {
    this.write("info", "EntityMove", ["移動"], duelist, entity, undefined, from, to);
  };

  private readonly write = (
    lvl: TLogLevel,
    type: TLogType,
    lines: string[],
    duelist: Duelist | undefined,
    mainEntity: DuelEntity | undefined,
    subEntities: DuelEntity[] | undefined,
    from: DuelFieldCell | undefined,
    to: DuelFieldCell | undefined
  ) => {
    const text = lines.join("\n");

    this.records.push({
      seq: this.nextSeq++,
      lvl,
      type,
      clock: this.duel.clock.getClone(),
      text,
      duelist,
      mainEntity,
      subEntities: subEntities ?? [],
      from,
      to,
    });
    this.onUpdateEvent.trigger(this.nextSeq - 1);
  };
}

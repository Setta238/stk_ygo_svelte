import StkEvent from "@stk_utils/class/StkEvent";
import { SystemError } from "./Duel";
import { Duel } from "./Duel";
import { type Duelist } from "./Duelist";
import type { DuelClock } from "./DuelClock";
import type { TDuelPeriodKey } from "./DuelPeriod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logLevels = ["info", "warn", "error"] as const;
type TLogLevel = (typeof logLevels)[number];

type DuelLogRecord = {
  seq: number;
  lvl: TLogLevel;
  turn: number;
  periodKey: TDuelPeriodKey;
  clock: DuelClock;
  duelist: Duelist | undefined;
  text: string;
};
export default class DuelLog {
  private onUpdateEvent = new StkEvent<void>();
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
      }
      lines.push("-- エラー名称 --");
      lines.push(error.name || "エラー名称取得失敗");
      lines.push("-- スタックトレース --");
      lines.push(error.stack || "スタックトレース取得失敗");
    } else {
      lines.push("-- エラー型特定失敗 --");
      lines.push(JSON.stringify(error));
    }
    this.write("error", lines);
  };

  public readonly warn = (text: string) => {
    this.write("warn", ["【注意】", text]);
  };

  public readonly info = (text: string, duelist?: Duelist) => {
    this.write("info", [text], duelist);
  };
  private readonly write = (lvl: TLogLevel, text: string[], duelist?: Duelist) => {
    const _text = Array.isArray(text) ? text.join("\n") : text;

    this.records.push({
      seq: this.nextSeq++,
      lvl: lvl,
      turn: this.duel.clock.turn,
      periodKey: this.duel.clock.period.key,
      clock: this.duel.clock,
      duelist: duelist,
      text: _text,
    });
    this.onUpdateEvent.trigger();
  };
}

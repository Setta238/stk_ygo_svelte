import StkEvent from "@stk_utils/class/StkEvent";
import { SystemError, type TDuelPhase, type TDuelPhaseStep } from "./Duel";
import { Duel } from "./Duel";
import { type Duelist } from "./Duelist";
import type { DuelClock } from "./DuelClock";

type DuelLogRecord = {
  seq: number;
  turn: number;
  phase: TDuelPhase;
  phaseStep: TDuelPhaseStep;
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
    this.info(lines);
  };

  public readonly info = (text: string | string[], duelist?: Duelist) => {
    const _text = Array.isArray(text) ? text.join("\n") : text;

    this.records.push({
      seq: this.nextSeq++,
      turn: this.duel.clock.turn,
      phase: this.duel.phase,
      phaseStep: this.duel.phaseStep,
      clock: this.duel.clock,
      duelist: duelist,
      text: _text,
    });
    this.onUpdateEvent.trigger();
  };
}

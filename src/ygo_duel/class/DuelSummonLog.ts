import { StkEvent } from "@stk_utils/class/StkEvent";
import { Duel } from "@ygo_duel/class/Duel";
import { type Duelist } from "@ygo_duel/class/Duelist";
import type { DuelClock } from "@ygo_duel/class/DuelClock";
import type { TDuelPeriodKey } from "@ygo_duel/class/DuelPeriod";

type DuelSummonLogRecord = {
  seq: number;
  turn: number;
  periodKey: TDuelPeriodKey;
  clock: DuelClock;
  duelist: Duelist | undefined;
  text: string;
};
export default class SummonLog {
  private onUpdateEvent = new StkEvent<void>();
  public get onUpdate() {
    return this.onUpdateEvent.expose();
  }
  private nextSeq: number;
  public readonly records: DuelSummonLogRecord[] = [];
  public readonly duel: Duel;
  public constructor(duel: Duel) {
    this.nextSeq = 0;
    this.duel = duel;
  }
  public readonly dispose = () => {
    this.onUpdateEvent.clear();
  };
  public readonly write = (text: string, duelist?: Duelist) => {
    this.records.push({
      seq: this.nextSeq++,
      turn: this.duel.clock.turn,
      periodKey: this.duel.clock.period.key,
      clock: this.duel.clock,
      duelist: duelist,
      text: text,
    });
    this.onUpdateEvent.trigger();
  };
}

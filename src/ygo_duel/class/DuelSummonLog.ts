import StkEvent from "@stk_utils/class/StkEvent";
import type { ProcKey, TDuelPhase, TDuelPhaseStep } from "./Duel";
import { Duel } from "./Duel";
import type Duelist from "./Duelist";

type DuelSummonLogRecord = {
  seq: number;
  turn: number;
  phase: TDuelPhase;
  phaseStep: TDuelPhaseStep;
  procKey: ProcKey;
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
      turn: this.duel.turn,
      phase: this.duel.phase,
      phaseStep: this.duel.phaseStep,
      procKey: this.duel.procKey,
      duelist: duelist,
      text: text,
    });
    console.log(text);
    this.onUpdateEvent.trigger();
  };
}

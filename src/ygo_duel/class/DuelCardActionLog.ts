import { Duel } from "./Duel";
import type { CardAction } from "./DuelCardAction";
import type Duelist from "./Duelist";

type CardActionLogRecord = {
  seq: number;
  turn: number;
  duelist: Duelist | undefined;
  cardAction: CardAction<unknown>;
};
export default class DuelCardActionLog {
  private nextSeq: number;
  public readonly records: CardActionLogRecord[] = [];
  public readonly duel: Duel;
  public constructor(duel: Duel) {
    this.nextSeq = 0;
    this.duel = duel;
  }
  public readonly push = (activater: Duelist, action: CardAction<unknown>): void => {
    this.records.push({
      seq: this.nextSeq++,
      turn: this.duel.clock.turn,
      duelist: activater,
      cardAction: action,
    });
  };
}

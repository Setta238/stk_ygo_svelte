import { Duel } from "./Duel";
import type { CardAction } from "./DuelCardAction";
import type { IDuelClock } from "./DuelClock";
import { type Duelist } from "./Duelist";

type CardActionLogRecord = {
  seq: number;
  clock: IDuelClock;
  activator: Duelist | undefined;
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
  public readonly push = <T>(activator: Duelist, action: CardAction<T>): void => {
    this.records.push({
      seq: this.nextSeq++,
      clock: this.duel.clock.getClone(),
      activator: activator,
      cardAction: action as CardAction<unknown>,
    });
  };
}

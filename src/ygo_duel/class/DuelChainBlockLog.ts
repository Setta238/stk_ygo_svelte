import { Duel } from "./Duel";
import type { ChainBlockInfo } from "./DuelEntityAction";
import type { IDuelClock } from "./DuelClock";
import { StkEvent } from "@stk_utils/class/StkEvent";
export type ChainBlockLogRecord = {
  seq: number;
  clock: IDuelClock;
  chainBlockInfo: ChainBlockInfo<unknown>;
};
export default class DuelChainBlockLog {
  private onInsertEvent = new StkEvent<ChainBlockLogRecord>();
  public get onInsert() {
    return this.onInsertEvent.expose();
  }
  private nextSeq: number;
  public readonly records: ChainBlockLogRecord[] = [];
  public readonly duel: Duel;
  public constructor(duel: Duel) {
    this.nextSeq = 0;
    this.duel = duel;
  }
  public readonly push = <T>(chainBlockInfo: ChainBlockInfo<T>): void => {
    const record = {
      seq: this.nextSeq++,
      clock: this.duel.clock.getClone(),
      chainBlockInfo: chainBlockInfo as ChainBlockInfo<unknown>,
    };
    this.records.push(record);
    this.onInsertEvent.trigger(record);
  };
}

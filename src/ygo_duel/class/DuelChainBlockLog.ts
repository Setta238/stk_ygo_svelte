import { Duel } from "./Duel";
import type { ChainBlockInfo } from "./DuelEntityAction";
import type { IDuelClock } from "./DuelClock";

type ChainBlockLogRecord = {
  seq: number;
  clock: IDuelClock;
  chainBlockInfo: ChainBlockInfo<unknown>;
};
export default class DuelChainBlockLog {
  private nextSeq: number;
  public readonly records: ChainBlockLogRecord[] = [];
  public readonly duel: Duel;
  public constructor(duel: Duel) {
    this.nextSeq = 0;
    this.duel = duel;
  }
  public readonly push = <T>(chainBlockInfo: ChainBlockInfo<T>): void => {
    this.records.push({
      seq: this.nextSeq++,
      clock: this.duel.clock.getClone(),
      chainBlockInfo: chainBlockInfo as ChainBlockInfo<unknown>,
    });
  };
}

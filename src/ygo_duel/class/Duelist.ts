import DuelistProfile from "@ygo/class/DuelistProfile";
import DeckInfo from "@ygo/class/DeckInfo";
import { Duel, type ProcKey, type TSeat } from "./Duel";
import type DuelEntity from "./DuelEntity";

type TLifeLogReason = "Damege" | "Heal" | "Lost" | "Pay" | "Set";
export type TDuelistType = "NPC" | "Player";

type LifeLogRecord = {
  procKey: ProcKey;
  reason: TLifeLogReason;
  beforeLp: number;
  afterLp: number;
  entity: DuelEntity | undefined;
};

export default class Duelist {
  public readonly duel: Duel;
  public readonly seat: TSeat;
  public readonly profile: DuelistProfile;
  public readonly deckInfo: DeckInfo;
  public readonly duelistType: TDuelistType;
  public readonly lifeLog: LifeLogRecord[];
  public normalSummonCount: number;
  public readonly maxNormalSummonCount: number;
  private lp: number;
  public constructor(duel: Duel, seat: TSeat, profile: DuelistProfile, duelistType: TDuelistType, deckInfo: DeckInfo) {
    this.duel = duel;
    this.seat = seat;
    this.profile = profile;
    this.duelistType = duelistType;
    this.deckInfo = deckInfo;
    this.lifeLog = [];
    this.normalSummonCount = 0;
    this.maxNormalSummonCount = 1;
    this.lp = 8000;
  }
  public readonly damage = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this.lp - point, entity, "Damege");
  };
  public readonly lostLp = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this.lp - point, entity, "Lost");
  };
  public readonly payLp = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this.lp - point, entity, "Pay");
  };
  public readonly heal = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this.lp + point, entity, "Heal");
  };
  public readonly setLp = (lp: number, entity?: DuelEntity, reason?: TLifeLogReason): LifeLogRecord => {
    const log = {
      procKey: this.duel.procKey,
      reason: reason || "Set",
      beforeLp: this.lp,
      afterLp: lp,
      entity: entity,
    };
    this.lifeLog.push(log);
    this.lp = lp;

    return log;
  };
  public readonly getLp = () => this.lp;
}

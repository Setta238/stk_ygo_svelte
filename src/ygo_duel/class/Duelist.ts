import DuelistProfile from "@ygo/class/DuelistProfile";
import DeckInfo from "@ygo/class/DeckInfo";
import { Duel, type TSeat } from "./Duel";
import { DuelEntity } from "./DuelEntity";
import type { DuelClock } from "./DuelClock";

type TLifeLogReason = "BattleDamage" | "EffectDamage" | "Heal" | "Lost" | "Pay" | "Set";
export type TDuelistType = "NPC" | "Player";

type LifeLogRecord = {
  clock: DuelClock;
  reason: TLifeLogReason;
  beforeLp: number;
  afterLp: number;
  entity: DuelEntity | undefined;
};

export default class Duelist {
  public readonly duel: Duel;
  public readonly seat: TSeat;
  public get entity() {
    return this._entity as DuelEntity;
  }
  public _entity: DuelEntity | undefined;
  public readonly profile: DuelistProfile;
  public readonly deckInfo: DeckInfo;
  public readonly duelistType: TDuelistType;
  public readonly lifeLog: LifeLogRecord[];
  public normalSummonCount: number;
  public specialSummonCount: number;
  public readonly maxNormalSummonCount: number;
  private _lp: number;
  public constructor(duel: Duel, seat: TSeat, profile: DuelistProfile, duelistType: TDuelistType, deckInfo: DeckInfo) {
    this.duel = duel;
    this.seat = seat;
    this.profile = profile;
    this.duelistType = duelistType;
    this.deckInfo = deckInfo;
    this.lifeLog = [];
    this.normalSummonCount = 0;
    this.specialSummonCount = 0;
    this.maxNormalSummonCount = 1;
    this._lp = 8000;
  }
  public readonly initEntity = () => {
    this._entity = DuelEntity.createPlayerEntity(this);
  };
  public readonly battleDamage = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp - point, entity, "BattleDamage");
  };
  public readonly effectDamage = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp - point, entity, "EffectDamage");
  };
  public readonly lostLp = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp - point, entity, "Lost");
  };
  public readonly payLp = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp - point, entity, "Pay");
  };
  public readonly heal = (point: number, entity: DuelEntity): LifeLogRecord => {
    return this.setLp(this._lp + point, entity, "Heal");
  };
  public readonly setLp = (lp: number, entity?: DuelEntity, reason?: TLifeLogReason): LifeLogRecord => {
    const log = {
      clock: this.duel.clock,
      reason: reason || "Set",
      beforeLp: this._lp,
      afterLp: lp,
      entity: entity,
    };
    this.lifeLog.push(log);
    this._lp = lp;

    this.duel.log.info(`ライフポイント変動：${log.afterLp - log.beforeLp}（${log.beforeLp} ⇒ ${log.afterLp}）`, this);

    return log;
  };
  public get lp() {
    return this._lp;
  }
  public get isTurnPlayer() {
    return this.duel.getTurnPlayer() === this;
  }
}

import { type IDuelistProfile } from "@ygo/class/DuelistProfile";
import { type IDeckInfo } from "@ygo/class/DeckInfo";
import { Duel, DuelEnd, type TSeat } from "./Duel";
import { DuelEntity, type TDuelCauseReason } from "./DuelEntity";
import type { DuelClock } from "./DuelClock";
import type { DuelFieldCell } from "./DuelFieldCell";
import { cardInfoDic } from "@ygo/class/CardInfo";

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
    const avatar = this.getHandCell().entities.find((entity) => entity.entityType === "Duelist");
    if (avatar) {
      return avatar;
    }
    return DuelEntity.createPlayerEntity(this);
  }
  public _entity: DuelEntity | undefined;
  public readonly profile: IDuelistProfile;
  public readonly deckInfo: IDeckInfo;
  public readonly duelistType: TDuelistType;
  public readonly lifeLog: LifeLogRecord[];
  public normalSummonCount: number;
  public specialSummonCount: number;
  public readonly maxNormalSummonCount: number;
  private _lp: number;
  public constructor(duel: Duel, seat: TSeat, profile: IDuelistProfile, duelistType: TDuelistType, deckInfo: IDeckInfo) {
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
  public readonly getOpponentPlayer = (): Duelist => {
    return this.duel.firstPlayer === this ? this.duel.secondPlayer : this.duel.firstPlayer;
  };
  public readonly getHandCell = (): DuelFieldCell => {
    return this.duel.field.getCells("Hand").filter((cell) => cell.owner === this)[0];
  };
  public readonly getDeckCell = (): DuelFieldCell => {
    return this.duel.field.getCells("Deck").filter((cell) => cell.owner === this)[0];
  };
  public readonly getExtraDeck = (): DuelFieldCell => {
    return this.duel.field.getCells("ExtraDeck").filter((cell) => cell.owner === this)[0];
  };
  public readonly getGraveyard = (): DuelFieldCell => {
    return this.duel.field.getCells("Graveyard").filter((cell) => cell.owner === this)[0];
  };
  public readonly getFieldZone = (): DuelFieldCell => {
    return this.duel.field.getCells("FieldSpellZone").filter((cell) => cell.owner === this)[0];
  };
  public readonly getBanished = (): DuelFieldCell => {
    return this.duel.field.getCells("Banished").filter((cell) => cell.owner === this)[0];
  };
  public readonly getMonsterZones = (): DuelFieldCell[] => {
    return this.duel.field.getCells("MonsterZone").filter((cell) => cell.owner === this);
  };
  public readonly getExtraMonsterZones = (): DuelFieldCell[] => {
    return this.duel.field.getCells("ExtraMonsterZone").filter((cell) => cell.cardEntities[0]?.controller === this);
  };
  public readonly getSpellTrapZones = (): DuelFieldCell[] => {
    return this.duel.field.getCells("SpellAndTrapZone").filter((cell) => cell.owner === this);
  };
  public readonly getEmptyMonsterZones = (): DuelFieldCell[] => {
    return this.getMonsterZones().filter((cell) => cell.cardEntities.length === 0);
  };
  public readonly getEmptyExtraZones = (): DuelFieldCell[] => {
    return this.getExtraMonsterZones().length === 0 ? this.getMonsterZones().filter((cell) => cell.cardEntities.length === 0) : [];
  };
  public readonly getAvailableMonsterZones = (): DuelFieldCell[] => {
    return this.getMonsterZones().filter((cell) => cell.isAvailable);
  };
  public readonly getAvailableExtraZones = (): DuelFieldCell[] => {
    // TODOエクストラリンク
    return this.getExtraMonsterZones().length === 0 ? this.duel.field.getCells("ExtraMonsterZone").filter((cell) => cell.isAvailable) : [];
  };
  public readonly getAvailableSpellTrapZones = (): DuelFieldCell[] => {
    return this.getSpellTrapZones().filter((cell) => cell.isAvailable);
  };
  public readonly getReleasableMonsters = (): DuelEntity[] => {
    // TODO : クロス・ソウルと帝王の烈旋の考慮
    return this.getMonstersOnField();
  };
  public readonly getMonstersOnField = (): DuelEntity[] => {
    // TODO : クロス・ソウルと帝王の烈旋の考慮
    return this.duel.field.getMonstersOnField().filter((monster) => monster.controller === this);
  };

  public readonly getAttackTargetMonsters = (): DuelEntity[] => {
    return this.duel.field.getMonstersOnField().filter((monster) => monster.status.isSelectableForAttack && monster.controller !== this);
  };

  public readonly pushDeck = (): void => {
    this.deckInfo.cardNames
      .map((name) => cardInfoDic[name])
      .filter((info) => info)
      .forEach((info) => DuelEntity.createCardEntity(this, info));
    this.duel.log.info(`デッキをセット。メイン${this.getDeckCell().cardEntities.length}枚。エクストラ${this.getExtraDeck().cardEntities.length}枚。`, this);
    return;
  };

  public readonly draw = async (times: number, causedBy: DuelEntity | undefined, causedByWhome: Duelist | undefined): Promise<void> => {
    if (times < 1) {
      return;
    }
    const deckCell = this.getDeckCell();
    const cardNames = [] as string[];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of Array(times)) {
      if (!deckCell.cardEntities.length) {
        this.duel.log.info(
          cardNames.length > 0
            ? `デッキからカードを${times}枚ドローしようとしたが、${cardNames.length}枚しかドローできなかった。${cardNames}`
            : "デッキからカードをドローできなかった。",
          this
        );
        this.duel.isEnded = true;
        this.setLp(0);
        throw new DuelEnd(this.getOpponentPlayer());
      }
      const card = deckCell.cardEntities[0];
      await card.draw(causedBy ? ["Effect"] : ["Rule"], causedBy, causedByWhome);
      cardNames.push(card.origin?.name || "!名称取得失敗!");
    }
    this.duel.log.info(`デッキからカードを${cardNames.length}枚ドロー。${cardNames}。`, this);

    return;
  };

  public readonly shuffleDeck = (): void => {
    const deckCell = this.getDeckCell();
    deckCell.shuffle();
    this.duel.log.info(`デッキをシャッフル。`, this);
  };
  public readonly discard = async (
    qty: number,
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    chooser?: Duelist,
    filter?: (entity: DuelEntity) => boolean,
    causedByWhome?: Duelist
  ): Promise<DuelEntity[]> => {
    const _filter: (entity: DuelEntity) => boolean = filter || (() => true);
    const choices = this.getHandCell().cardEntities.filter(_filter);

    if (choices.length < qty) {
      return [];
    }
    let selectedList = [] as DuelEntity[];
    if ((chooser || this).duelistType === "NPC") {
      // NPCに選択権がある場合、ランダムに手札を捨てる。
      selectedList = choices.randomPick(qty);
    } else {
      selectedList =
        (await this.duel.view.waitSelectEntities(chooser || this, choices, qty, (list) => list.length === qty, `${qty}枚カードを捨てる。`, false)) || [];
    }

    for (const card of selectedList) {
      await card.sendToGraveyard(["Discard", ...moveAs], causedBy, causedByWhome);
    }

    this.duel.log.info(`手札からカードを${selectedList.length}枚捨てた。${selectedList.map((e) => e.origin?.name)}。`, this);

    return selectedList;
  };
}

import {
  cardKinds,
  exMonsterCategories,
  specialMonsterCategories,
  type TBattlePosition,
  type TCardInfoBase,
  type TCardInfoJson,
  type TEntityStatus,
  type TNonBattlePosition,
} from "@ygo/class/YgoTypes";
import { SystemError } from "./Duel";
import { playFieldCellTypes, type DuelFieldCell, type TDuelEntityMovePos } from "./DuelFieldCell";
import type Duelist from "./Duelist";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { IDuelClock } from "./DuelClock";

import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultNormalSummonAction } from "@ygo_duel/functions/DefaultCardAction";
import { cardDefinitions, cardInfoDic } from "@ygo/class/CardInfo";
import { CardAction, type CardActionBase, type ICardAction } from "./DuelCardAction";

export type TDuelEntity = "Card" | "Token";
export type TDuelEntityFace = "FaceUp" | "FaceDown";
export type TDuelEntityOrientation = "Horizontal" | "Vertical";
export const duelSummonRuleCauseReason = [
  "AdvanceSummon",
  "NormalSummon",
  "FusionSummon",
  "SyncroSummon",
  "XyzSummon",
  "PendulumSummon",
  "LinkSummon",
  "SpecialSummon",
] as const;
export const destoryCauseReasons = ["BattleDestroy", "EffectDestroy", "RuleDestroy"] as const;
export type TDestoryCauseReason = (typeof destoryCauseReasons)[number];
export const summonPosCauseReasons = ["AttackSummon", "SetSummon", "DefenseSummon"] as const;
export type TSummonRuleCauseReason = (typeof duelSummonRuleCauseReason)[number];
export type TSummonPosCauseReason = (typeof summonPosCauseReasons)[number];
export type TDuelCauseReason =
  | TSummonRuleCauseReason
  | TSummonPosCauseReason
  | TDestoryCauseReason
  | "Draw"
  | "Destroy"
  | "Effect"
  | "Release"
  | "AdvanceSummonRelease"
  | "SpecialSummonMaterial"
  | "FusionMaterial"
  | "SyncroMaterial"
  | "EyzMaterial"
  | "RitualMaterial"
  | "Cost"
  | "Discard"
  | "Rule"
  | "SpellTrapSet"
  | "SpellTrapActivate";

export const duelEntityCardTypes = ["Card", "Token", "Avatar"] as const;
export type TDuelEntityCardType = (typeof duelEntityCardTypes)[number];
export const duelEntityDammyTypes = ["Duelist", "Squatter"] as const;
export type TDuelEntityDammyType = (typeof duelEntityDammyTypes)[number];
export type TDuelEntityType = TDuelEntityCardType | TDuelEntityDammyType;
export type TDuelEntityInfoDetail = {
  name: string;
  entityType: TDuelEntityType;
  cardPlayList: Array<CardAction<unknown>>;
};
export type TDuelEntityInfo = TCardInfoBase & TDuelEntityInfoDetail;
export const CardSorter = (left: TCardInfoJson, right: TCardInfoJson): number => {
  // エクストラデッキのモンスターは、魔法罠よりも下
  const leftCatList = left.monsterCategories ?? [];
  const rightCatList = right.monsterCategories ?? [];

  for (const cat of exMonsterCategories.toReversed()) {
    if (leftCatList.includes(cat) && !rightCatList.includes(cat)) {
      return 1;
    }
    if (!leftCatList.includes(cat) && rightCatList.includes(cat)) {
      return -1;
    }
  }

  if (left.kind === right.kind) {
    if (left.kind === "Monster") {
      if ((left.link ?? 0) !== (right.link ?? 0)) {
        return (left.link ?? 0) - (right.link ?? 0);
      }
      if ((left.rank ?? 0) !== (right.rank ?? 0)) {
        return (left.rank ?? 0) - (right.rank ?? 0);
      }
      if ((left.level ?? 0) !== (right.level ?? 0)) {
        return (left.level ?? 0) - (right.level ?? 0);
      }
      if ((left.attack ?? 0) !== (right.attack ?? 0)) {
        return (left.attack ?? 0) - (right.attack ?? 0);
      }
      if ((left.defense ?? 0) !== (right.defense ?? 0)) {
        return (left.defense ?? 0) - (right.defense ?? 0);
      }
    }
    return left.name.localeCompare(right.name, "Ja");
  }

  for (const kind of cardKinds) {
    if (left.kind === kind) {
      return -1;
    }
    if (right.kind === kind) {
      return 1;
    }
  }

  // 到達しないコード
  return left.name.localeCompare(right.name, "Ja");
};
export const CardEntitySorter = (left: DuelEntity, right: DuelEntity): number => {
  return CardSorter(left.origin, right.origin);
};

export type DuelEntityInfomation = {
  isDying: boolean;
  isVanished: boolean;
  isRebornable: boolean;
  isSettingSickness: boolean;
  materials: DuelEntity[];
  willBeBanished: boolean;
  willReturnToDeck: boolean;
  attackCount: number;
  battlePotisionChangeCount: number;
};

export class DuelEntity {
  private static nextActionSeq = 0;
  private static nextEntitySeq = 0;
  public static actionDic: { [seq: number]: CardAction<unknown> } = {};
  public readonly seq: number;
  public readonly origin: TCardInfoJson;
  public readonly entityType: TDuelEntityType;
  public face: TDuelEntityFace;
  public isUnderControl: boolean;
  private _battlePosition: TBattlePosition | undefined;
  public orientation: TDuelEntityOrientation;
  public controller: Duelist;
  public readonly owner: Duelist;
  public get field() {
    return this.owner.duel.field;
  }
  public fieldCell: DuelFieldCell;
  public wasMovedBy: DuelEntity | undefined;
  public wasMovedByWhom: Duelist | undefined;
  public readonly wasMovedAs: TDuelCauseReason[];
  public wasMovedFrom: DuelFieldCell | undefined;
  public wasMovedAt: IDuelClock;

  private _status: TEntityStatus;
  private _info: DuelEntityInfomation;

  public readonly actions: CardAction<unknown>[] = [];

  public get status() {
    return this._status;
  }
  public get info() {
    return this._info;
  }

  public get nm() {
    return this.status.name;
  }
  public get atk() {
    return this.status.attack;
  }
  public get def() {
    return this.status.defense;
  }
  public get lvl() {
    return this.status.level;
  }
  public get rank() {
    return this.status.rank;
  }
  public get attr() {
    return this.status.attribute ? [this.status.attribute] : [];
  }
  public get type() {
    return this.status.type ? [this.status.type] : [];
  }
  public get psL() {
    return [this.status.pendulumScaleL];
  }
  public get psR() {
    return [this.status.pendulumScaleR];
  }
  public get isMoveAtPreviousChain() {
    return this.field.duel.clock.isPreviousChain(this.wasMovedAt);
  }

  public get battlePotion() {
    return this._battlePosition;
  }
  /**
   *
   * @param owner
   * @param controller エクストラモンスターゾーンだとコントローラーが確定しないので、念の為引数として残しておく
   * @param fieldCell
   * @param entityType
   * @param cardInfo
   * @param face
   * @param isVisibleForController
   * @param orientation
   */
  protected constructor(
    owner: Duelist,
    controller: Duelist,
    fieldCell: DuelFieldCell,
    entityType: TDuelEntityType,
    cardInfo: TCardInfoJson,
    face: TDuelEntityFace,
    isVisibleForController: boolean,
    orientation: TDuelEntityOrientation
  ) {
    this.seq = DuelEntity.nextEntitySeq++;
    this.owner = owner;
    this.controller = controller;
    this.fieldCell = fieldCell;
    this.entityType = entityType;
    this.origin = cardInfo;
    this._status = JSON.parse(JSON.stringify(cardInfo));
    this.resetStatus();
    this._info = {
      attackCount: 0,
      battlePotisionChangeCount: 0,
      isDying: false,
      isVanished: false,
      isRebornable: true,
      isSettingSickness: false,
      materials: [],
      willBeBanished: false,
      willReturnToDeck: false,
    };
    this.resetInfo();
    this.face = face;
    this.isUnderControl = isVisibleForController;
    this.orientation = orientation;
    this.wasMovedAs = ["Rule"];
    this.wasMovedAt = this.field.duel.clock;
    this.wasMovedByWhom = owner;

    fieldCell.acceptEntities([this], "Top");
  }
  private static readonly createCardActionList = (entity: DuelEntity, baseList: CardActionBase<unknown>[]): CardAction<unknown>[] => {
    const result = baseList.map((b) => new CardAction(DuelEntity.nextActionSeq++, entity, b));

    result.forEach((act) => (DuelEntity.actionDic[act.seq] = act));

    return result;
  };

  /**
   * 直接攻撃のときに面倒なので、プレイヤーをエンティティ扱いで手札においておく
   * @param field
   * @param duelist
   * @returns
   */
  public static readonly createPlayerEntity = (duelist: Duelist): DuelEntity => {
    const hand = duelist.getHandCell();
    return new DuelEntity(duelist, duelist, hand, "Duelist", { name: duelist.profile.name, kind: "Monster" }, "FaceUp", true, "Vertical");
  };
  public static readonly createCardEntity = (owner: Duelist, cardInfo: TCardInfoJson): DuelEntity => {
    // cardはデッキまたはEXデッキに生成
    const fieldCell = cardInfo.monsterCategories && cardInfo.monsterCategories.union(exMonsterCategories).length ? owner.getExtraDeck() : owner.getDeckCell();
    const newCard = new DuelEntity(owner, owner, fieldCell, "Card", cardInfo, "FaceDown", false, "Vertical");
    if (!Object.hasOwn(cardInfoDic, newCard.origin.name)) {
      owner.duel.log.info(`未実装カード${cardInfo.name}がデッキに投入された。`, owner);
    }
    const info = cardInfoDic[newCard.origin.name];

    if (info.kind === "Monster" && info.monsterCategories?.includes("Normal")) {
      newCard.actions.push(
        ...DuelEntity.createCardActionList(newCard, [
          defaultNormalSummonAction,
          defaultAttackAction,
          defaultBattlePotisionChangeAction,
        ] as CardActionBase<unknown>[])
      );
    } else {
      newCard.actions.push(...DuelEntity.createCardActionList(newCard, cardDefinitions.get(newCard.origin.name) || []));
    }
    return newCard;
  };

  /**
   * @param entity
   * @param title
   * @param cells
   * @param pos
   * @returns
   */
  public static readonly createDammyAction = (entity: DuelEntity, title: string, cells: DuelFieldCell[], pos?: TBattlePosition): ICardAction<void> => {
    return {
      seq: DuelEntity.nextActionSeq++,
      title: title,
      entity: entity,
      playType: "Dammy",
      spellSpeed: "Dammy",
      executableCells: [entity.fieldCell.cellType],
      hasToTargetCards: false,
      isOnlyNTimesPerDuel: 0,
      isOnlyNTimesPerTurn: 0,
      getClone: function () {
        return this;
      },
      validate: () => cells,
      prepare: async () => undefined,
      execute: async () => false,
      settle: async () => false,
      pos: pos,
      cell: cells[0],
      dragAndDropOnly: cells.length > 1,
    };
  };

  public readonly getIndexInCell = (): number => {
    const index = this.fieldCell.cardEntities.indexOf(this);

    if (index < 0) {
      throw new SystemError("エンティティとセルの状態が矛盾している。", [this, this.fieldCell]);
    }

    return index;
  };

  public readonly setBattlePosition = (pos: TBattlePosition): void => {
    this._battlePosition = pos;
    this.orientation = pos === "Attack" ? "Vertical" : "Horizontal";
    this.face = pos === "Set" ? "FaceDown" : "FaceUp";
    this.isUnderControl = true;
  };
  public readonly setNonFieldPosition = (pos: TNonBattlePosition, isUnderControl: boolean): void => {
    this._battlePosition = undefined;
    this.orientation = pos === "XysMaterial" ? "Horizontal" : "Vertical";
    this.face = pos === "FaceUp" ? "FaceUp" : "FaceDown";
    this.isUnderControl = isUnderControl;
  };
  public readonly summon = async (
    to: DuelFieldCell,
    pos: TBattlePosition,
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    movedByWhom: Duelist | undefined
  ): Promise<void> => {
    const moveAsDic: { [pos in TBattlePosition]: TDuelCauseReason } = {
      Attack: "AttackSummon",
      Defense: "DefenseSummon",
      Set: "SetSummon",
    };
    if (!to.isAvailable) {
      return;
    }
    this.setBattlePosition(pos);

    if (summonType === "SyncroSummon") {
      this.field.duel.log.info(`${this.nm}をシンクロ召喚！`, this.controller);
    }

    await this._moveTo(to, "Top", [summonType, moveAsDic[pos], ...moveAs], movedBy, movedByWhom);

    // 召喚ターンには表示形式の変更ができない
    this.info.battlePotisionChangeCount = 1;
  };
  public readonly setAsSpellTrap = async (
    to: DuelFieldCell,
    moveAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    movedByWhom: Duelist | undefined
  ): Promise<void> => {
    await this._moveTo(to, "Top", [...moveAs, "SpellTrapSet"], movedBy, movedByWhom);
    this.setNonFieldPosition("Set", true);
  };
  public readonly activateSpellTrapFromHand = async (
    to: DuelFieldCell,
    moveAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    movedByWhom: Duelist | undefined
  ): Promise<void> => {
    this.setNonFieldPosition("FaceUp", true);
    await this._moveTo(to, "Top", [...moveAs, "SpellTrapActivate"], movedBy, movedByWhom);
  };
  public readonly activateSpellTrapOnField = async (): Promise<void> => {
    this.setNonFieldPosition("FaceUp", true);
  };
  public readonly draw = async (moveAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, movedByWhom: Duelist | undefined): Promise<void> => {
    await this._moveTo(this.owner.getHandCell(), "Bottom", [...moveAs, "Draw"], movedBy, movedByWhom);
    this.setNonFieldPosition("Set", true);
  };
  public readonly addToHand = async (moveAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, movedByWhom: Duelist | undefined): Promise<void> => {
    await this._moveTo(this.owner.getHandCell(), "Bottom", moveAs, movedBy, movedByWhom);
    this.setNonFieldPosition("Set", true);
  };
  public readonly release = async (moveAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, movedByWhom: Duelist | undefined): Promise<void> => {
    await this.sendToGraveyard([...moveAs, "Release"], movedBy, movedByWhom);
  };
  public readonly destroy = async (
    by: TDestoryCauseReason,
    moveAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    movedByWhom: Duelist | undefined
  ): Promise<void> => {
    await this.sendToGraveyard([...moveAs, by, "Destroy"], movedBy, movedByWhom);
  };
  public readonly sendToGraveyard = async (moveAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, movedByWhom: Duelist | undefined): Promise<void> => {
    if (this.info.willBeBanished) {
      return await this.banish(moveAs, movedBy, movedByWhom);
    }
    if (this.info.willReturnToDeck) {
      return await this.banish(moveAs, movedBy, movedByWhom);
    }

    this.info.isDying = false;
    this.setNonFieldPosition("FaceUp", true);
    const graveyard = this.owner.getGraveyard();

    await this._moveTo(graveyard, "Top", moveAs, movedBy, movedByWhom);
  };
  public readonly banish = async (moveAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, movedByWhom: Duelist | undefined): Promise<void> => {
    if (this.info.willReturnToDeck) {
      return await this.banish(moveAs, movedBy, movedByWhom);
    }

    this.info.isDying = false;
    this.setNonFieldPosition("FaceUp", true);

    const banished = this.owner.getBanished();

    await this._moveTo(banished, "Top", moveAs, movedBy, movedByWhom);
    this.info.willBeBanished = false;
  };
  public readonly banishTemporarily = async (moveAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, movedByWhom: Duelist | undefined): Promise<void> => {
    if (this.info.willBeBanished) {
      return await this.banish(moveAs, movedBy, movedByWhom);
    }
    if (this.info.willReturnToDeck) {
      return await this.banish(moveAs, movedBy, movedByWhom);
    }

    this.initForTurn();

    throw new Error("not implemented");
  };
  public readonly returnToDeck = async (
    pos: TDuelEntityMovePos,
    moveAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    movedByWhom: Duelist | undefined
  ): Promise<DuelFieldCell | undefined> => {
    if (this.info.willBeBanished) {
      await this.banish(moveAs, movedBy, movedByWhom);
      return this.owner.getBanished();
    }

    const dest =
      this.origin.monsterCategories && this.origin.monsterCategories.union(exMonsterCategories).length ? this.owner.getExtraDeck() : this.owner.getDeckCell();
    this.setNonFieldPosition("Set", false);
    this.resetInfo();
    this.resetStatus();
    return await this._moveTo(dest, pos, moveAs, movedBy, movedByWhom);
  };
  private readonly _moveTo = async (
    to: DuelFieldCell,
    pos: TDuelEntityMovePos,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    movedByWhom: Duelist | undefined
  ): Promise<DuelFieldCell | undefined> => {
    if (!to) {
      // ミスで一回あったので念の為おいておく
      throw new Error("illegal argument: to");
    }

    if (this.field.duel.clock.turn > 0) {
      await this.field.duel.view.waitAnimation({ entity: this, to: to, index: pos, count: 0 });
    }
    this.fieldCell.releaseEntities([this]);

    // 同じ種類のセルを移動したとき、情報を再セットしない
    if (this.fieldCell.cellType !== to.cellType || (this.fieldCell.cellType === "ExtraMonsterZone" && to.cellType === "MonsterZone")) {
      this.wasMovedAs.reset(...new Set(movedAs));
      this.wasMovedAt = this.field.duel.clock.getClone();
      this.wasMovedBy = movedBy;
      this.wasMovedFrom = this.fieldCell;
      this.wasMovedByWhom = movedByWhom;
    }
    if (this.entityType === "Token" && playFieldCellTypes.every((t) => t !== this.fieldCell.cellType)) {
      this.field.duel.log.info(`${this.nm}は消滅した。`, this.controller);
      return;
    }

    if (to.owner) {
      this.controller = to.owner;
    }
    to.acceptEntities([this], pos);
  };

  public readonly initForTurn = () => {
    this.info.isSettingSickness = false;
    this.info.attackCount = 0;
    this.info.battlePotisionChangeCount = 0;
  };

  private readonly resetInfo = () => {
    this._info = {
      isDying: false,
      isVanished: false,
      isRebornable: this.origin.monsterCategories?.union(specialMonsterCategories).length === 0 || (this.origin.canReborn ?? false),
      isSettingSickness: false,
      materials: [],
      willBeBanished: false,
      willReturnToDeck: false,
      attackCount: 0,
      battlePotisionChangeCount: 0,
    };
  };

  private readonly resetStatus = () => {
    this._status = {
      ...JSON.parse(JSON.stringify(this.origin)),
      canAttack: true,
      isEffective: true,
      canDirectAttack: false,
      attackCount: 0,
      isSelectableForAttack: true,
      canBeSyncroMaterial: true,
      willBeBanished: false,
    };
  };
}

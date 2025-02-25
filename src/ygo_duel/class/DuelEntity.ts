import { exMonsterCategories, type TBattlePosition, type TCardInfoBase, type TCardInfoJson, type TEntityStatus } from "@ygo/class/YgoTypes";
import { SystemError, type ProcKey } from "./Duel";
import type { DuelField } from "./DuelField";
import type { DuelFieldCell } from "./DuelFieldCell";
import type Duelist from "./Duelist";

import {} from "@stk_utils/funcs/StkArrayUtils";
import { getCardActions } from "@ygo/class/CardInfo";
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
export const duelSummonPosCauseReason = ["AttackSummon", "SetSummon", "DefenseSummon"] as const;
export type TDuelSummonRuleCauseReason = (typeof duelSummonRuleCauseReason)[number];
export type TDuelSummonPosCauseReason = (typeof duelSummonPosCauseReason)[number];
export type TDuelCauseReason =
  | TDuelSummonRuleCauseReason
  | TDuelSummonPosCauseReason
  | "Draw"
  | "Destroy"
  | "Effect"
  | "Release"
  | "AdvanceSummonRelease"
  | "FusionMaterial"
  | "SynchroMaterial"
  | "EyzMaterial"
  | "RitualMaterial"
  | "Cost"
  | "Discard"
  | "BattleDestroy"
  | "EffectDestroy"
  | "RuleDestroy"
  | "Rule";
export const cardActionChainBlockTypes = ["TriggerEffect", "TriggerMandatoryEffect", "MandatoryEffect", "QuickEffect", "IgnitionEffect"] as const;
export type TCardActionChainBlockType = (typeof cardActionChainBlockTypes)[number];
export const cardActionNonChainBlockTypes = ["NormalSummon", "SpecialSummon", "ChangeBattlePosition", "Battle"] as const;
export type TCardActionNonChainBlockType = (typeof cardActionNonChainBlockTypes)[number];
export type TCardActionType = TCardActionChainBlockType | TCardActionNonChainBlockType | "Dammy";
export type TSpellSpeed = "Normal" | "Quick" | "Counter" | "Dammy";
export type CardActionBase<T> = {
  title: string;
  playType: TCardActionType;
  spellSpeed: TSpellSpeed;
  validate: (entity: DuelEntity) => DuelFieldCell[] | undefined;
  prepare: (entity: DuelEntity, cell?: DuelFieldCell) => Promise<T>;
  execute: (entity: DuelEntity, cell?: DuelFieldCell, prepared?: T) => Promise<boolean>;
};
export type CardAction<T> = {
  title: string;
  entity: DuelEntity;
  seq: number;
  playType: TCardActionType;
  spellSpeed: TSpellSpeed;
  validate: () => DuelFieldCell[] | undefined;
  prepare: (cell?: DuelFieldCell) => Promise<T>;
  execute: (cell?: DuelFieldCell, prepared?: T) => Promise<boolean>;
  autoWord?: string;
};
export type CardActionWIP<T> = CardAction<T> & { cell?: DuelFieldCell; pos: TBattlePosition };
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
  public field: DuelField;
  public fieldCell: DuelFieldCell;
  public movedBy: DuelEntity | undefined;
  public readonly movedAs: TDuelCauseReason[];
  public movedFrom: DuelFieldCell | undefined;
  public movedAt: ProcKey;

  public readonly status: TEntityStatus;
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
    return [this.status.attribute];
  }
  public get type() {
    return [this.status.type];
  }
  public get psL() {
    return [this.status.pendulumScaleL];
  }
  public get psR() {
    return [this.status.pendulumScaleR];
  }

  public readonly actions: CardAction<unknown>[] = [];

  public get battlePotion() {
    return this._battlePosition;
  }
  protected constructor(
    owner: Duelist,
    controller: Duelist,
    field: DuelField,
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
    this.field = field;
    this.fieldCell = fieldCell;
    this.entityType = entityType;
    this.origin = cardInfo;
    this.status = JSON.parse(JSON.stringify(cardInfo));
    this.status.canAttack = true;
    this.status.canDirectAttack = true;
    this.status.attackCount = 0;
    this.status.isSelectableForAttack = true;
    this.face = face;
    this.isUnderControl = isVisibleForController;
    this.orientation = orientation;
    this.movedAs = ["Rule"];
    this.movedAt = field.duel.procKey;
    fieldCell.acceptEntities([this], "Top");
  }
  public static readonly createCardPlayList = (entity: DuelEntity, baseList: CardActionBase<unknown>[]): CardAction<unknown>[] => {
    const result = baseList.map((b) => {
      return {
        seq: DuelEntity.nextActionSeq++,
        title: b.title,
        entity: entity,
        playType: b.playType,
        spellSpeed: b.spellSpeed,
        validate: () => b.validate(entity),
        prepare: (cell?: DuelFieldCell) => b.prepare(entity, cell),
        execute: (cell?: DuelFieldCell, prepared?: unknown) => b.execute(entity, cell, prepared),
      };
    });

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
    const hand = duelist.duel.field.getHandCell(duelist);
    return new DuelEntity(duelist, duelist, duelist.duel.field, hand, "Duelist", { name: duelist.profile.name, kind: "Monster" }, "FaceUp", true, "Vertical");
  };
  public static readonly createCardEntity = (field: DuelField, owner: Duelist, cardInfo: TCardInfoJson): DuelEntity => {
    // cardはデッキまたはEXデッキに生成
    const fieldCell = exMonsterCategories.filter((cat) => cardInfo.monsterCategories?.includes(cat)) ? field.getDeckCell(owner) : field.getExtraDeck(owner);
    const newCard = new DuelEntity(owner, owner, field, fieldCell, "Card", cardInfo, "FaceDown", false, "Vertical");
    newCard.actions.push(...DuelEntity.createCardPlayList(newCard, getCardActions(newCard.origin.name)));
    if (!newCard.actions) {
      field.duel.log.info(`未実装カード${cardInfo.name}がデッキに投入された。`, owner);
    }
    return newCard;
  };

  /**
   * ドラッグ・アンド・ドロップ可能で選択不可能なCardActionを作成する。
   * @param entity
   * @param title
   * @param cells
   * @param pos
   * @returns
   */
  public static readonly createDammyAction = (entity: DuelEntity, title: string, cells: DuelFieldCell[], pos: TBattlePosition): CardActionWIP<void> => {
    return {
      seq: DuelEntity.nextActionSeq++,
      title: title,
      entity: entity,
      playType: "Dammy",
      spellSpeed: "Dammy",
      validate: () => cells,
      prepare: async () => {},
      execute: async () => false,
      pos: pos,
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
  public readonly setNonFieldPosition = (face: TDuelEntityFace, isUnderControl: boolean): void => {
    this._battlePosition = undefined;
    this.orientation = "Vertical";
    this.face = face;
    this.isUnderControl = isUnderControl;
  };
  private readonly summon = async (
    to: DuelFieldCell,
    pos: TBattlePosition,
    summonType: TDuelSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity
  ): Promise<DuelFieldCell | undefined> => {
    const moveAsDic: { [pos in TBattlePosition]: TDuelCauseReason } = {
      Attack: "AttackSummon",
      Defense: "DefenseSummon",
      Set: "SetSummon",
    };
    if (!to.isAvailable) {
      return;
    }
    this.fieldCell.releaseEntities([this], [summonType, moveAsDic[pos], ...moveAs], causedBy);
    this.setBattlePosition(pos);
    to.acceptEntities([this], "Top");
    this.status.battlePotisionChangeCount = 1;
    return to;
  };
  public readonly release = async (moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<DuelFieldCell | undefined> => {
    return await this.sendGraveyard([...moveAs, "Destroy"], causedBy);
  };
  public readonly destroy = async (
    by: "BattleDestroy" | "EffectDestroy" | "RuleDestroy",
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity
  ): Promise<DuelFieldCell | undefined> => {
    return await this.sendGraveyard([...moveAs, by, "Destroy"], causedBy);
  };
  public readonly sendGraveyard = async (moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<DuelFieldCell | undefined> => {
    this.setNonFieldPosition("FaceUp", true);
    this.fieldCell.releaseEntities([this], moveAs, causedBy);

    if (this.entityType === "Token") {
      this.field.duel.log.info(`${this.nm}は消滅した。`, causedBy?.controller);
      return;
    }
    const graveyard = this.field.getGraveyard(this.owner);
    graveyard.acceptEntities([this], "Top");
    return graveyard;
  };
}

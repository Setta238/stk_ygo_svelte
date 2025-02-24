import {
  exMonsterCategories,
  specialMonsterCategories,
  type TBattlePosition,
  type TCardInfoBase,
  type TCardInfoJson,
  type TEntityStatus,
} from "@ygo/class/YgoTypes";
import { SystemError, type ProcKey } from "./Duel";
import type { DuelField } from "./DuelField";
import type { DuelFieldCell } from "./DuelFieldCell";
import type Duelist from "./Duelist";

import {} from "@stk_utils/funcs/StkArrayUtils";
import {
  defaultAttackRule,
  defaultBattlePotisionChangeRule,
  defaultNormalAttackSummonRule,
  defaultNormalSetSummonRule,
} from "@ygo_duel/functions/DefaultCardAction";
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
  | "Release"
  | "AdvanceSummonRelease"
  | "FusionMaterial"
  | "SynchroMaterial"
  | "EyzMaterial"
  | "RitualMaterial"
  | "Discard"
  | "Battle"
  | "Rule";
export const cardActionChainBlockTypes = ["TriggerEffect", "TriggerMandatoryEffect", "MandatoryEffect", "QuickEffect", "IgnitionEffect"] as const;
export type TCardActionChainBlockType = (typeof cardActionChainBlockTypes)[number];
export const cardActionNonChainBlockTypes = ["Summon", "ChangeBattlePosition", "Battle"] as const;
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
};
export type CardActionWIP<T> = CardAction<T> & { cell?: DuelFieldCell; pos: TBattlePosition };
export type TDuelEntityType = "Card" | "Token" | "CardClone" | "Squatter";
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
  public static readonly createCardEntity = (field: DuelField, owner: Duelist, cardInfo: TCardInfoJson): DuelEntity => {
    // cardはデッキまたはEXデッキに生成
    const fieldCell = exMonsterCategories.filter((cat) => cardInfo.monsterCategories?.includes(cat)) ? field.getDeckCell(owner) : field.getExtraDeck(owner);
    const newCard = new DuelEntity(owner, owner, field, fieldCell, "Card", cardInfo, "FaceDown", false, "Vertical");
    if (newCard.origin?.kind === "Monster" && newCard.origin.monsterCategories?.union([...specialMonsterCategories]).length === 0) {
      newCard.actions.push(
        ...DuelEntity.createCardPlayList(newCard, [
          defaultNormalAttackSummonRule,
          defaultNormalSetSummonRule,
          defaultAttackRule,
          defaultBattlePotisionChangeRule,
        ] as CardActionBase<unknown>[])
      );
    }
    fieldCell.acceptEntities([newCard], "Top");
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
    const index = this.fieldCell.entities.indexOf(this);

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
}

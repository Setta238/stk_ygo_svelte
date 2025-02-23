import {
  exMonsterCategories,
  specialMonsterCategories,
  type TBattlePosition,
  type TCardInfoBase,
  type TCardInfoJson,
  type TEntityStatus,
} from "@ygo/class/YgoTypes";
import type { ProcKey } from "./Duel";
import type { DuelField } from "./DuelField";
import type { DuelFieldCell } from "./DuelFieldCell";
import type Duelist from "./Duelist";

import {} from "@stk_utils/funcs/StkArrayUtils";
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
export const cardActionChainBlockTypes = ["TriggerEffect", "TriggerMandatoryEffect", "QuickEffect", "IgnitionEffect"] as const;
export type TCardActionChainBlockType = (typeof cardActionChainBlockTypes)[number];
export const cardActionNonChainBlockTypes = ["Summon", "ChangeBattlePosition", "Battle", "IgnitionEffect"] as const;
export type TCardActionNonChainBlockType = (typeof cardActionNonChainBlockTypes)[number];
export type TCardActionType = TCardActionChainBlockType | TCardActionNonChainBlockType | "Dammy";
export type TSpellSpeed = "Normal" | "Quick" | "Counter" | "Dammy";
export type CardActionBase = {
  title: string;
  playType: TCardActionType;
  spellSpeed: TSpellSpeed;
  validate: (entity: DuelEntity) => DuelFieldCell[] | undefined;
  execute: (entity: DuelEntity, cell?: DuelFieldCell) => Promise<boolean>;
};
export type CardAction = {
  title: string;
  entity: DuelEntity;
  seq: number;
  playType: TCardActionType;
  spellSpeed: TSpellSpeed;
  validate: () => DuelFieldCell[] | undefined;
  execute: (cell?: DuelFieldCell) => Promise<boolean>;
};
export type DammyCardAction<T> = CardAction & {
  data: T;
};
export type TDuelEntityType = "Card" | "Token" | "CardClone" | "Squatter";
export type TDuelEntityInfoDetail = {
  name: string;
  entityType: TDuelEntityType;
  cardPlayList: Array<CardAction>;
};
export type TDuelEntityInfo = TCardInfoBase & TDuelEntityInfoDetail;
const defaultNormalSummonValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  if (entity.fieldCell.cellType !== "Hand") {
    return;
  }

  // レベルがないモンスターは通常召喚不可
  if (!entity.status.level) {
    return;
  }
  const emptyCells = entity.field.getEmptyMonsterZones(entity.controller);

  // 4以下は空きセルが必要
  if (entity.status.level < 5) {
    return emptyCells.length > 0 ? emptyCells : undefined;
  }

  const releasableMonsters = entity.field.getReleasableMonsters(entity.controller);

  // リリース可能なモンスターが不足する場合、アドバンス召喚不可
  if (releasableMonsters.length < (entity.status.level < 7 ? 1 : 2)) {
    return undefined;
  }

  return [];

  // TODO : クロス・ソウルの「しなければならない」の制限の考慮。エクストラモンスターゾーンまたは相手モンスターゾーンにしかリリース可能なモンスターがいない場合、空きが必要。
  // if (emptyCells.length > 0 || releasableMonsters.filter((m) => m.controller === entity.controller && m.fieldCell.cellType === "MonsterZone")) {
  //   return true;
  // }
};

const defaultNormalSummonExecute = async (entity: DuelEntity, pos: TBattlePosition, cell?: DuelFieldCell) => {
  if (!entity.status.level) {
    return false;
  }
  const causedBy: TDuelCauseReason[] = ["Rule", "NormalSummon"];
  if (entity.status.level > 4) {
    const releasableMonsters = entity.field.getReleasableMonsters(entity.controller);
    const exZoneMonsters = entity.field.getExtraMonsterZones(entity.controller);
    const qty = entity.status.level < 7 ? 1 : 2;

    if (exZoneMonsters.length >= qty) {
      releasableMonsters.filter((monster) => monster.fieldCell.cellType !== "ExtraMonsterZone");
    }
    await entity.field.release(entity.controller, entity.field.getReleasableMonsters(entity.controller), qty, ["AdvanceSummonRelease", "Rule"], entity);

    causedBy.push("AdvanceSummon");
  }

  const emptyCells = entity.field.getEmptyMonsterZones(entity.controller);
  await entity.field.summon(entity, [pos], cell ? [cell] : emptyCells, causedBy, entity);
  return true;
};

const defaultNormalAttackSummonRule: CardActionBase = {
  title: "召喚",
  playType: "Summon",
  spellSpeed: "Normal",
  validate: defaultNormalSummonValidate,
  execute: (entity, cell) => defaultNormalSummonExecute(entity, "Attack", cell),
};
const defaultNormalSetSummonRule: CardActionBase = {
  title: "裏守備",
  playType: "Summon",
  spellSpeed: "Normal",
  validate: defaultNormalSummonValidate,
  execute: (entity, cell) => defaultNormalSummonExecute(entity, "Set", cell),
};

export default class DuelEntity {
  private static nextActionSeq = 0;
  private static nextEntitySeq = 0;
  public static actionDic: { [seq: number]: CardAction } = {};
  public readonly seq: number;
  public readonly origin: TCardInfoJson;
  public readonly entityType: TDuelEntityType;
  public face: TDuelEntityFace;
  public isUnderControl: boolean;
  public battlePotion: TBattlePosition | undefined;
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

  public readonly actions: CardAction[] = [];
  public isSelectable = false;

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
    this.face = face;
    this.isUnderControl = isVisibleForController;
    this.orientation = orientation;
    this.movedAs = ["Rule"];
    this.movedAt = field.duel.procKey;
  }
  public static readonly createCardPlayList = (entity: DuelEntity, baseList: CardActionBase[]): CardAction[] => {
    const result = baseList.map((b) => {
      return {
        seq: DuelEntity.nextActionSeq++,
        title: b.title,
        entity: entity,
        playType: b.playType,
        spellSpeed: b.spellSpeed,
        validate: () => b.validate(entity),
        execute: (cell?: DuelFieldCell) => b.execute(entity, cell),
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
      newCard.actions.push(...DuelEntity.createCardPlayList(newCard, [defaultNormalAttackSummonRule, defaultNormalSetSummonRule]));
    }
    fieldCell.acceptEntities([newCard], "Top");
    return newCard;
  };

  public static readonly createDammyAction = <T>(entity: DuelEntity, title: string, cells: DuelFieldCell[], data: T): DammyCardAction<T> => {
    return {
      seq: DuelEntity.nextActionSeq++,
      title: title,
      entity: entity,
      playType: "Dammy",
      spellSpeed: "Dammy",
      validate: () => cells,
      execute: async () => false,
      data: data,
    };
  };

  public readonly setBattlePosition = (pos: TBattlePosition): void => {
    this.battlePotion = pos;
    this.orientation = pos === "Attack" ? "Vertical" : "Horizontal";
    this.face = pos === "Set" ? "FaceDown" : "FaceUp";
    this.isUnderControl = true;
  };
  public readonly setNonFieldPosition = (face: TDuelEntityFace, isUnderControl: boolean): void => {
    this.battlePotion = undefined;
    this.orientation = "Vertical";
    this.face = face;
    this.isUnderControl = isUnderControl;
  };

  public readonly getEnableActions = () => {
    if (this.field.duel.priorityHolder !== this.controller) {
      return [];
    }
    return this.field.duel.enableActions.filter((action) => this === action.entity);
  };
}

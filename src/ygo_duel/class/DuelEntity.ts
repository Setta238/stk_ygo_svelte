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
import type { DuelField } from "./DuelField";
import type { DuelFieldCell, DuelFieldCellType, TDuelEntityMovePos } from "./DuelFieldCell";
import type Duelist from "./Duelist";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { DuelClock } from "./DuelClock";

import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalAttackSummonAction,
  defaultNormalSetSummonAction,
} from "@ygo_duel/functions/DefaultCardAction";
import { cardDefinitions, cardInfoDic } from "@ygo/class/CardInfo";
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
  | "SyncroMaterial"
  | "EyzMaterial"
  | "RitualMaterial"
  | "Cost"
  | "Discard"
  | "BattleDestroy"
  | "EffectDestroy"
  | "RuleDestroy"
  | "Rule"
  | "SpellTrapSet"
  | "SpellTrapActivate";
export const cardActionChainBlockTypes = [
  "TriggerEffect",
  "TriggerMandatoryEffect",
  "MandatoryEffect",
  "QuickEffect",
  "IgnitionEffect",
  "CardActivation",
] as const;
export type TCardActionChainBlockType = (typeof cardActionChainBlockTypes)[number];
export const cardActionNonChainBlockTypes = ["NormalSummon", "SpecialSummon", "ChangeBattlePosition", "Battle", "SpellTrapSet", "SpellTrapActivate"] as const;
export type TCardActionNonChainBlockType = (typeof cardActionNonChainBlockTypes)[number];
export type TCardActionType = TCardActionChainBlockType | TCardActionNonChainBlockType | "Dammy" | "RuleDraw";
export type TSpellSpeed = "Normal" | "Quick" | "Counter" | "Dammy";
export type CardActionBase<T> = {
  title: string;
  playType: TCardActionType;
  spellSpeed: TSpellSpeed;
  hasToTargetCards?: boolean;
  executableCells: DuelFieldCellType[];
  /**
   * 発動可能かどうかの検証
   * @param entity
   * @returns 発動時にドラッグ・アンド・ドロップ可能である場合、選択肢のcellが返る。
   */
  validate: (entity: DuelEntity) => DuelFieldCell[] | undefined;
  /**
   * コストの支払い、対象に取るなど
   * フィールドに残らない魔法罠の場合、isDyingの設定が必要
   * @param entity
   * @param cell
   * @returns
   */
  prepare: (entity: DuelEntity, cell?: DuelFieldCell, cancelable?: boolean) => Promise<T | undefined>;
  /**
   * 実際の処理部分
   * @param entity
   * @param activater
   * @param cell
   * @param prepared
   * @returns
   */
  execute: (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell, prepared?: T) => Promise<boolean>;
};
export type CardAction<T> = {
  title: string;
  entity: DuelEntity;
  seq: number;
  playType: TCardActionType;
  spellSpeed: TSpellSpeed;
  hasToTargetCards?: boolean;

  executableCells: DuelFieldCellType[];
  /**
   *
   * @returns 発動時にドラッグ・アンド・ドロップ可能である場合、選択肢のcellが返る。
   */
  validate: () => DuelFieldCell[] | undefined;
  /**
   * チェーンに乗る処理の場合、コストの支払いや対象に取る処理までを行う。
   * @param cell 効果発動時にドラッグ・アンド・ドロップなどで指定されたセルがある場合、値が入る。
   * @returns 実行時に必要な任意の情報
   */
  prepare: (cell?: DuelFieldCell, cancelable?: boolean) => Promise<T | undefined>;
  /**
   *
   * @param activater 効果発動時のコントローラー
   * @param cell 効果発動時にドラッグ・アンド・ドロップなどで指定されたセルがある場合、値が入る。
   * @param prepared 実行時に必要な任意の情報
   * @returns 不発の場合、false
   */
  execute: (activater: Duelist, cell?: DuelFieldCell, prepared?: T) => Promise<boolean>;
  autoWord?: string;
  cell?: DuelFieldCell;
  pos?: TBattlePosition;
  dragAndDropOnly?: boolean;
};
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
  return left.name.localeCompare(right.name);
};
export const CardEntitySorter = (left: DuelEntity, right: DuelEntity): number => {
  const hoge = CardSorter(left.origin, right.origin);
  console.log(left.nm, right.nm, hoge);
  return hoge;
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
  public field: DuelField;
  public fieldCell: DuelFieldCell;
  public movedBy: DuelEntity | undefined;
  public readonly movedAs: TDuelCauseReason[];
  public movedFrom: DuelFieldCell | undefined;
  public movedAt: DuelClock;
  public isDying: boolean;
  public isVanished: boolean;
  public canReborn: boolean;
  public materials: DuelEntity[];

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
    this.status = {
      ...JSON.parse(JSON.stringify(cardInfo)),
      canAttack: true,
      isEffective: true,
      canDirectAttack: false,
      attackCount: 0,
      isSelectableForAttack: true,
      canBeSyncroMaterial: true,
    };
    this.face = face;
    this.isUnderControl = isVisibleForController;
    this.orientation = orientation;
    this.movedAs = ["Rule"];
    this.movedAt = field.duel.clock;
    this.isDying = false;
    this.isVanished = false;
    this.canReborn = this.origin.monsterCategories?.union(specialMonsterCategories).length === 0;
    this.materials = [];
    fieldCell.acceptEntities([this], "Top");
  }
  private static readonly createCardActionList = (entity: DuelEntity, baseList: CardActionBase<unknown>[]): CardAction<unknown>[] => {
    const result = baseList.map((b) => {
      return {
        seq: DuelEntity.nextActionSeq++,
        title: b.title,
        entity: entity,
        playType: b.playType,
        spellSpeed: b.spellSpeed,
        executableCells: b.executableCells,
        validate: () => b.validate(entity),
        prepare: (cell?: DuelFieldCell) => b.prepare(entity, cell),
        execute: (activater: Duelist, cell?: DuelFieldCell, prepared?: unknown) => b.execute(entity, activater, cell, prepared),
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
    const hand = duelist.getHandCell();
    return new DuelEntity(duelist, duelist, duelist.duel.field, hand, "Duelist", { name: duelist.profile.name, kind: "Monster" }, "FaceUp", true, "Vertical");
  };
  public static readonly createCardEntity = (field: DuelField, owner: Duelist, cardInfo: TCardInfoJson): DuelEntity => {
    // cardはデッキまたはEXデッキに生成
    const fieldCell = cardInfo.monsterCategories && cardInfo.monsterCategories.union(exMonsterCategories).length ? owner.getExtraDeck() : owner.getDeckCell();
    const newCard = new DuelEntity(owner, owner, field, fieldCell, "Card", cardInfo, "FaceDown", false, "Vertical");
    if (!Object.hasOwn(cardInfoDic, newCard.origin.name)) {
      field.duel.log.info(`未実装カード${cardInfo.name}がデッキに投入された。`, owner);
    }
    const info = cardInfoDic[newCard.origin.name];

    if (info.kind === "Monster" && info.monsterCategories?.includes("Normal")) {
      newCard.actions.push(
        ...DuelEntity.createCardActionList(newCard, [
          defaultNormalAttackSummonAction,
          defaultNormalSetSummonAction,
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
   * ドラッグ・アンド・ドロップ可能で選択不可能なCardActionを作成する。
   * @param entity
   * @param title
   * @param cells
   * @param pos
   * @returns
   */
  public static readonly createDammyAction = (entity: DuelEntity, title: string, cells: DuelFieldCell[], pos?: TBattlePosition): CardAction<void> => {
    return {
      seq: DuelEntity.nextActionSeq++,
      title: title,
      entity: entity,
      playType: "Dammy",
      spellSpeed: "Dammy",
      executableCells: [entity.fieldCell.cellType],
      validate: () => cells,
      prepare: async () => {},
      execute: async () => false,
      pos: pos,
      dragAndDropOnly: true,
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
    summonType: TDuelSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity
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
    await this._moveTo(to, "Top", [summonType, moveAsDic[pos], ...moveAs], causedBy);
    this.status.battlePotisionChangeCount = 1;
  };
  public readonly release = async (moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<void> => {
    await this.sendGraveyard([...moveAs, "Release"], causedBy);
  };
  public readonly destroy = async (by: "BattleDestroy" | "EffectDestroy" | "RuleDestroy", moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<void> => {
    await this.sendGraveyard([...moveAs, by, "Destroy"], causedBy);
  };
  public readonly sendGraveyard = async (moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<void> => {
    this.setNonFieldPosition("FaceUp", true);
    const graveyard = this.owner.getGraveyard();

    await this._moveTo(graveyard, "Top", moveAs, causedBy);
  };
  public readonly setAsSpellTrap = async (to: DuelFieldCell, moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<void> => {
    await this._moveTo(to, "Top", [...moveAs, "SpellTrapSet"], causedBy);
    this.setNonFieldPosition("Set", true);
  };
  public readonly activateSpellTrapFromHand = async (to: DuelFieldCell, moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<void> => {
    this.setNonFieldPosition("FaceUp", true);
    await this._moveTo(to, "Top", [...moveAs, "SpellTrapActivate"], causedBy);
    this.isDying = true;
  };
  public readonly activateSpellTrapOnField = async (): Promise<void> => {
    this.setNonFieldPosition("FaceUp", true);
    this.isDying = true;
  };
  public readonly draw = async (moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<void> => {
    await this._moveTo(this.owner.getHandCell(), "Bottom", [...moveAs, "Draw"], causedBy);
    this.setNonFieldPosition("Set", true);
  };
  public readonly addToHand = async (moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<void> => {
    await this._moveTo(this.owner.getHandCell(), "Bottom", moveAs, causedBy);
    this.setNonFieldPosition("Set", true);
  };
  private readonly _moveTo = async (to: DuelFieldCell, pos: TDuelEntityMovePos, moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<void> => {
    if (this.field.duel.clock.turn > 0) {
      await this.field.duel.view.waitAnimation({ entity: this, to: to, index: pos, count: 0 });
    }
    this.fieldCell.releaseEntities([this], moveAs, causedBy);
    if (this.entityType === "Token" && this.fieldCell.cellType !== "MonsterZone") {
      this.field.duel.log.info(`${this.nm}は消滅した。`, causedBy?.controller);
      return;
    }

    to.acceptEntities([this], pos);
  };
  // private readonly moveToOtherCell = async (pos:TBattlePosition|TNonBattlePosition, moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<DuelFieldCell | undefined> => {
  //   this.setNonFieldPosition("FaceUp", true);
  //   this.fieldCell.releaseEntities([this], moveAs, causedBy);

  //   if (this.entityType === "Token") {
  //     this.field.duel.log.info(`${this.nm}は消滅した。`, causedBy?.controller);
  //     return;
  //   }
  //   const graveyard = this.field.getGraveyard(this.owner);
  //   graveyard.acceptEntities([this], "Top");
  //   return graveyard;
  // };
}

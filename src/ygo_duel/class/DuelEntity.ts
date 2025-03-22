import {
  battlePositionDic,
  cardKinds,
  exMonsterCategories,
  specialMonsterCategories,
  type TBattlePosition,
  type CardInfoDescription,
  type CardInfoJson,
  type EntityStatus,
  type TNonBattlePosition,
  type EntityStatusBase,
  getSubsetAsEntityStatusBase,
  entityFlexibleStatusKeys,
  type TEntityFlexibleStatusKey,
} from "@ygo/class/YgoTypes";
import { SystemError } from "./Duel";
import { deckCellTypes, playFieldCellTypes, type DuelFieldCell, type TBundleCellType, type TDuelEntityMovePos } from "./DuelFieldCell";
import { type Duelist } from "./Duelist";

import {} from "@stk_utils/funcs/StkArrayUtils";

import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultNormalSummonAction } from "@ygo_duel/functions/DefaultCardAction_Monster";
import { cardDefinitionDic, cardInfoDic } from "@ygo/class/CardInfo";
import { CardAction, type CardActionBase } from "./DuelCardAction";
import { ProcFilterBundle } from "../class_continuous_effect/DuelProcFilter";
import { ContinuousEffect, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperatorBundle } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { CardRelationBundle } from "@ygo_duel/class_continuous_effect/DuelCardRelation";
import type { DuelField } from "./DuelField";
import { DuelEntityLog } from "./DuelEntityLog";

export type TDuelEntityFace = "FaceUp" | "FaceDown";
export type TDuelEntityOrientation = "Horizontal" | "Vertical";
export const namedSummonRuleCauseReasons = ["FusionSummon", "SyncroSummon", "XyzSummon", "PendulumSummon", "LinkSummon"] as const;
export type TNamedSummonRuleCauseReason = (typeof namedSummonRuleCauseReasons)[number];
export const summonNameDic: { [key in TNamedSummonRuleCauseReason]: string } = {
  FusionSummon: "融合召喚",
  SyncroSummon: "シンクロ召喚",
  XyzSummon: "エクシーズ召喚",
  PendulumSummon: "ペンデュラム召喚",
  LinkSummon: "リンク召喚",
};
export const summonRuleCauseReasons = [...namedSummonRuleCauseReasons, "AdvanceSummon", "NormalSummon", "SpecialSummon"] as const;
export type TSummonRuleCauseReason = (typeof summonRuleCauseReasons)[number];
export const destoryCauseReasons = ["BattleDestroy", "EffectDestroy", "RuleDestroy"] as const;
export type TDestoryCauseReason = (typeof destoryCauseReasons)[number];
export const summonPosCauseReasons = ["AttackSummon", "SetSummon", "DefenseSummon"] as const;
export const posToSummonPos = (pos: TBattlePosition) => (pos + "Summon") as TSummonPosCauseReason;
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
  | "Spawn"
  | "SpellTrapSet"
  | "SpellTrapActivate"
  | "Flip"
  | "FlipByBattle"
  | "FlipSummon";

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
export type TDuelEntityInfo = CardInfoDescription & TDuelEntityInfoDetail;
export const CardSorter = (left: EntityStatusBase, right: EntityStatusBase): number => {
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
  isPending: boolean;
  isDying: boolean;
  causeOfDeath: (TDestoryCauseReason | "SpellTrapActivate")[];
  isKilledBy: DuelEntity | undefined;
  isKilledByWhom: Duelist | undefined;
  isVanished: boolean;
  isRebornable: boolean;
  isSettingSickness: boolean;
  materials: DuelEntity[];
  effectTargets: { [effectKey: string]: DuelEntity[] };
  willBeBanished: boolean;
  willReturnToDeck: TDuelEntityMovePos | undefined;
  attackCount: number;
  battlePotisionChangeCount: number;
};

export class DuelEntity {
  private static nextEntitySeq = 0;

  public static readonly splitBattlePos = (pos: TBattlePosition): { face: TDuelEntityFace; orientation: TDuelEntityOrientation } => {
    return { face: pos === "Set" ? "FaceDown" : "FaceUp", orientation: pos === "Attack" ? "Vertical" : "Horizontal" };
  };

  public static readonly recreateArray = (field: DuelField, entites: DuelEntity[]): DuelEntity[] => {
    if (!entites.length) {
      return [];
    }
    const allEntites = field.getAllCells().flatMap((cell) => cell.entities);

    return entites
      .map((entity) => entity.seq)
      .map((seq) => allEntites.find((entity) => entity.seq === seq))
      .filter((entity) => entity !== undefined);
  };
  /**
   * 直接攻撃のときに面倒なので、プレイヤーをエンティティ扱いで手札においておく
   * @param field
   * @param duelist
   * @returns
   */
  public static readonly createPlayerEntity = (duelist: Duelist): DuelEntity => {
    const hand = duelist.getHandCell();
    return new DuelEntity(
      duelist,
      hand,
      "Duelist",
      { name: duelist.profile.name, kind: "Monster", wikiEncodedName: "%A5%D7%A5%EC%A5%A4%A5%E4%A1%BC" },
      "FaceUp",
      "Vertical"
    );
  };
  public static readonly createCardEntity = (owner: Duelist, cardInfo: CardInfoJson): DuelEntity => {
    // cardはデッキまたはEXデッキに生成
    const fieldCell = cardInfo.monsterCategories && cardInfo.monsterCategories.union(exMonsterCategories).length ? owner.getExtraDeck() : owner.getDeckCell();

    const newCard = new DuelEntity(owner, fieldCell, "Card", getSubsetAsEntityStatusBase(cardInfo), "FaceDown", "Vertical");
    if (!Object.hasOwn(cardInfoDic, newCard.origin.name)) {
      owner.duel.log.info(`未実装カード${cardInfo.name}がデッキに投入された。`, owner);
    }
    const info = cardInfoDic[newCard.origin.name];
    let actionBases: CardActionBase<unknown>[] = [];
    let continuousEffectBases: ContinuousEffectBase<unknown>[] = [];
    if (info.kind === "Monster" && info.monsterCategories?.includes("Normal")) {
      actionBases = [defaultNormalSummonAction, defaultAttackAction, defaultBattlePotisionChangeAction] as CardActionBase<unknown>[];
    } else {
      const def = cardDefinitionDic.get(newCard.origin.name);
      if (def) {
        actionBases = def.actions;
        continuousEffectBases = def.continuousEffects ?? [];
      }
    }
    newCard.actions.push(...actionBases.map((b) => CardAction.createNew(newCard, b)));
    newCard.continuousEffects.push(...continuousEffectBases.map((b) => ContinuousEffect.createNew(newCard, b)));

    return newCard;
  };

  public static readonly sendManyToGraveyardForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCellForTheSameReason("Graveyard", "Top", entities, movedAs, movedBy, activator);
  };
  public static readonly banishManyForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCellForTheSameReason("Banished", "Top", entities, movedAs, movedBy, activator);
  };
  public static readonly returnManyToDeckForTheSameReason = (
    pos: TDuelEntityMovePos,
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCellForTheSameReason("Deck", pos, entities, movedAs, movedBy, activator);
  };

  /**
   *
   * @param items
   * @param excludedList 再帰処理時のみ指定する想定
   */
  public static readonly sendManyToGraveyard = (
    items: {
      entity: DuelEntity;
      causedAs: TDuelCauseReason[];
      causedBy: DuelEntity | undefined;
      activator: Duelist | undefined;
    }[],
    excludedList?: DuelEntity[]
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCell("Graveyard", "Top", items, excludedList);
  };

  /**
   *
   * @param items
   * @param excludedList 再帰処理時のみ指定する想定
   */
  public static readonly banishMany = (
    items: {
      entity: DuelEntity;
      causedAs: TDuelCauseReason[];
      causedBy: DuelEntity | undefined;
      activator: Duelist | undefined;
    }[],
    excludedList?: DuelEntity[]
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCell("Banished", "Top", items, excludedList);
  };

  public static readonly bringManyToSameCellForTheSameReason = (
    to: TBundleCellType,
    pos: TDuelEntityMovePos,
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCell(
      to,
      pos,
      entities.map((newOne) => {
        return {
          entity: newOne,
          causedAs: movedAs,
          causedBy: movedBy,
          activator: activator,
        };
      })
    );
  };
  public static readonly bringManyToSameCell = (
    to: TBundleCellType,
    pos: TDuelEntityMovePos,
    items: {
      entity: DuelEntity;
      causedAs: TDuelCauseReason[];
      causedBy: DuelEntity | undefined;
      activator: Duelist | undefined;
    }[],
    excludedList?: DuelEntity[]
  ): Promise<void> => {
    return DuelEntity.moveMany(
      items.map((item) => [
        item.entity,
        item.entity.field.getCells(to).filter((cell) => cell.owner === item.entity.owner)[0],
        "FaceUp",
        "Vertical",
        pos,
        item.causedAs,
        item.causedBy,
        item.activator,
        item.activator,
      ]),
      excludedList
    );
  };

  /**
   *
   * @param items
   * @param excludedList 再帰処理時のみ指定する想定
   */
  public static readonly moveMany = async (
    items: [entity: DuelEntity, ...Parameters<typeof DuelEntity.prototype.move>][],
    excludedList?: DuelEntity[]
  ): Promise<void> => {
    if (!items.length) {
      return;
    }

    const duel = items[0][0].duel;

    // 対象を配列にしておく
    const targets = items.map(([entity]) => entity).filter((entity) => !(excludedList ?? []).includes(entity));
    const _excludedList = [...targets, ...duel.field.getEntiteisOnField().filter((entity) => entity.info.isDying)];
    console.log(targets);
    // 目的地ごとに仕分ける
    const destMap = new Map<DuelFieldCell, [entity: DuelEntity, ...Parameters<typeof DuelEntity.prototype.move>][]>();
    items.forEach(([entity, to, ...rest]) => {
      let dest = to;
      if (entity.info.willBeBanished) {
        dest = entity.owner.getBanished();
      }
      if (entity.info.willReturnToDeck) {
        dest = entity.isBelongTo;
      }
      if (entity.isBelongTo.cellType === "ExtraDeck") {
        if (dest.cellType === "Hand" || dest.cellType === "Deck") {
          dest = entity.isBelongTo;
        }
      }
      destMap.set(dest, [[entity, to, ...rest], ...(destMap.get(dest) ?? [])]);
    });

    // 取り出せなくなるまでループ
    while (true) {
      // 一つずつ取り出す
      const promises = Array.from(destMap.values())
        .map((array) => array.pop())
        .filter((e) => e !== undefined)
        .map(([entity, ...rest]) => entity.move(...rest));

      // 取り出せなくなったら終了
      if (!promises.length) {
        break;
      }

      // 取り出せたらアニメーションを全て待機
      await Promise.all(promises);

      // 装備対象不在で破壊されるものを更新
      duel.field.cardRelationPool.excludesExpired();

      // 新しく発生したものを検知（※ここまでのどこかで対象だったものを除く）
      const newTargets = duel.field
        .getEntiteisOnField()
        .filter((entity) => entity.info.isDying)
        .filter((newOne) => !_excludedList.includes(newOne))
        .map((newOne) => {
          return {
            entity: newOne,
            causedAs: newOne.info.causeOfDeath ?? [],
            causedBy: newOne.info.isKilledBy,
            activator: newOne.info.isKilledByWhom,
          };
        });

      // 新しく発生したものがあれば、全て墓地送り（※間接的な再帰実行）
      if (newTargets.length) {
        await this.sendManyToGraveyard(newTargets, _excludedList);
      }
    }
  };

  public static readonly summonMany = async (
    items: {
      entity: DuelEntity;
      to: DuelFieldCell;
      pos: TBattlePosition;
      chooser: Duelist;
    }[],
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    actionOwner: Duelist
  ): Promise<void> => {
    const moveAsDic: { [pos in TBattlePosition]: TDuelCauseReason } = {
      Attack: "AttackSummon",
      Defense: "DefenseSummon",
      Set: "SetSummon",
    };

    await Promise.all(
      items.map(async ({ entity, to, pos, chooser }) => {
        if (summonType === "NormalSummon" || summonType === "AdvanceSummon") {
          const advance = summonType === "AdvanceSummon" ? "アドバンス" : "";
          if (pos === "Attack") {
            entity.field.duel.log.info(`${entity.toString()}を${advance}召喚`, chooser);
          } else {
            entity.duel.log.info(`${entity.toString()}を${advance}セット`, chooser);
          }
          if (moveAs.includes("Rule")) {
            chooser.info.ruleNormalSummonCountQty++;
          } else {
            chooser.info.effectNormalSummonCountQty++;
          }
        } else {
          if (summonType === "SpecialSummon") {
            entity.duel.log.info(`${entity.toString()}を${battlePositionDic[pos]}で特殊召喚`, chooser);
          } else {
            entity.duel.log.info(`${entity.toString()}を${battlePositionDic[pos]}で${summonNameDic[summonType]}！`, chooser);
          }
          chooser.info.specialSummonCountQty++;
        }
        // 召喚ターンには表示形式の変更ができない
        entity.info.battlePotisionChangeCount = 1;

        // 移動処理
        const { face, orientation } = DuelEntity.splitBattlePos(pos);
        await entity.move(to, face, orientation, "Top", [summonType, moveAsDic[pos], ...moveAs], movedBy, actionOwner, chooser);
      })
    );

    // 召喚回数を加算
    items
      .map((item) => item.chooser)
      .forEach((duelist) => {
        if (summonType === "NormalSummon" || summonType === "AdvanceSummon") {
          if (moveAs.includes("Rule")) {
            duelist.info.ruleNormalSummonCount++;
          } else {
            duelist.info.effectNormalSummonCount++;
          }
        } else {
          duelist.info.specialSummonCount++;
        }
      });
  };

  public readonly seq: number;
  public readonly origin: EntityStatusBase;
  public readonly entityType: TDuelEntityType;
  public readonly procFilterBundle: ProcFilterBundle;
  public readonly numericOprsBundle: NumericStateOperatorBundle;
  public readonly cardRelationBundle: CardRelationBundle;
  public readonly moveLog: DuelEntityLog;
  public face: TDuelEntityFace;
  public get isUnderControl() {
    return this.face === "FaceUp" || deckCellTypes.every((t) => t !== this.fieldCell.cellType);
  }

  public orientation: TDuelEntityOrientation;
  public get controller() {
    return this.fieldCell.owner ?? this.owner;
  }
  public readonly owner: Duelist;
  public get field() {
    return this.owner.duel.field;
  }
  public get duel() {
    return this.owner.duel.field.duel;
  }
  public fieldCell: DuelFieldCell;

  private _status: EntityStatus;
  private _info: DuelEntityInfomation;

  public readonly actions: CardAction<unknown>[] = [];
  public readonly continuousEffects: ContinuousEffect<unknown>[] = [];
  private _hasDisappeared = false;
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
    return this.status.calculated.attack;
  }
  public get def() {
    return this.status.calculated.defense;
  }
  public get lvl() {
    return this.status.calculated.level;
  }
  public get rank() {
    return this.status.calculated.rank;
  }
  public get attr() {
    return this.status.attribute ? [this.status.attribute] : [];
  }
  public get type() {
    return this.status.type ? [this.status.type] : [];
  }
  public get psL() {
    return this.status.calculated.pendulumScaleL;
  }
  public get psR() {
    return this.status.calculated.pendulumScaleR;
  }
  public get battlePosition() {
    if (!this.isOnField) {
      return undefined;
    }
    if (this.status.kind !== "Monster") {
      return undefined;
    }
    if (this.orientation === "Vertical") {
      return "Attack";
    }
    return this.face === "FaceUp" ? "Defense" : "Set";
  }
  public get wasMovedAtCurrentChain() {
    return this.field.duel.clock.isSameChain(this.moveLog.latestRecord.movedAt) && this.moveLog.records.slice(-2)[0].cell.cellType !== this.fieldCell.cellType;
  }
  public get wasMovedAtPreviousChain() {
    return (
      this.field.duel.clock.isPreviousChain(this.moveLog.latestRecord.movedAt) && this.moveLog.records.slice(-2)[0].cell.cellType !== this.fieldCell.cellType
    );
  }
  public get wasMovedFrom() {
    return this.moveLog.previousPlaceRecord.cell;
  }

  public get isOnField() {
    return playFieldCellTypes.some((t) => t === this.fieldCell.cellType);
  }
  public get isLikeContinuousSpell() {
    return (
      this.status.spellCategory === "Continuous" ||
      this.status.spellCategory === "Field" ||
      this.status.spellCategory === "Equip" ||
      this.status.trapCategory === "Continuous"
    );
  }
  public get isBelongTo() {
    return this.origin.monsterCategories && this.origin.monsterCategories.union(exMonsterCategories).length
      ? this.owner.getExtraDeck()
      : this.owner.getDeckCell();
  }

  public get hasDisappeared() {
    return this._hasDisappeared;
  }
  /**
   *
   * @param owner
   * @param fieldCell
   * @param entityType
   * @param cardInfo
   * @param face
   * @param isVisibleForController
   * @param orientation
   */
  protected constructor(
    owner: Duelist,
    fieldCell: DuelFieldCell,
    entityType: TDuelEntityType,
    cardInfo: EntityStatusBase,
    face: TDuelEntityFace,
    orientation: TDuelEntityOrientation
  ) {
    this.seq = DuelEntity.nextEntitySeq++;
    this.owner = owner;
    this.fieldCell = fieldCell;
    this.entityType = entityType;

    this.origin = cardInfo;
    this._status = JSON.parse(JSON.stringify(cardInfo));

    this.resetStatus();
    this._info = {
      attackCount: 0,
      battlePotisionChangeCount: 0,
      isDying: false,
      isPending: false,
      causeOfDeath: [],
      isKilledBy: undefined,
      isKilledByWhom: undefined,
      isVanished: false,
      isRebornable: true,
      isSettingSickness: false,
      materials: [],
      effectTargets: {},
      willBeBanished: false,
      willReturnToDeck: undefined,
    };
    this.resetInfo();
    this.face = face;
    this.orientation = orientation;
    this.procFilterBundle = new ProcFilterBundle(fieldCell.field.procFilterPool, this);
    this.numericOprsBundle = new NumericStateOperatorBundle(fieldCell.field.numericStateOperatorPool, this);
    this.cardRelationBundle = new CardRelationBundle(fieldCell.field.cardRelationPool, this);
    fieldCell.acceptEntities([this], "Top");
    this.moveLog = new DuelEntityLog(this);
    this.moveLog.pushForRuleAction(["Spawn"]);
  }

  public readonly toString = () => `《${this.nm}》`;

  public readonly canBeTargetOfEffect = (activator: Duelist, entity: DuelEntity, action: CardAction<unknown>): boolean =>
    this.procFilterBundle.operators.filter((pf) => pf.procType === "EffectTarget").every((pf) => pf.filter(activator, entity, action, [this]));

  public readonly canBeTargetOfBattle = (activator: Duelist, entity: DuelEntity, action: CardAction<unknown>): boolean =>
    this.procFilterBundle.operators.filter((pf) => pf.procType === "BattleTarget").every((pf) => pf.filter(activator, entity, action, [this]));

  public readonly tryDestoryByBattle = (activator: Duelist, entity: DuelEntity, action: CardAction<unknown>): boolean => {
    this.info.isDying = this.procFilterBundle.operators
      .filter((pf) => pf.procType === "BattleDestory")
      .every((pf) => pf.filter(activator, entity, action, [this]));
    if (this.info.isDying) {
      this.duel.log.info(`${this.toString()}を戦闘破壊`, entity.controller);
      this.info.causeOfDeath = ["BattleDestroy"];
      this.info.isKilledBy = entity;
      this.info.isKilledByWhom = entity.controller;
    }
    return this.info.isDying;
  };

  public readonly canBeSyncroMaterials = (action: CardAction<unknown>, materials: DuelEntity[]) => {
    return this.procFilterBundle.operators
      .filter((pf) => pf.procType === "SyncroSummon")
      .every((pf) => pf.filter(action.entity.controller, action.entity, action, materials));
  };

  public readonly getIndexInCell = (): number => {
    if (this.info.isVanished) {
      return -1;
    }

    const index = this.fieldCell.cardEntities.indexOf(this);

    if (index < 0) {
      throw new SystemError("エンティティとセルの状態が矛盾している。", [this, this.fieldCell]);
    }

    return index;
  };

  public readonly setBattlePosition = async (pos: TBattlePosition, movedAs: TDuelCauseReason[], movedBy?: DuelEntity, actionOwner?: Duelist): Promise<void> => {
    this.move(
      this.fieldCell,
      pos === "Set" ? "FaceDown" : "FaceUp",
      pos === "Attack" ? "Vertical" : "Horizontal",
      "Top",
      movedAs,
      movedBy,
      actionOwner,
      actionOwner
    );
  };

  public readonly setNonFieldMonsterPosition = async (
    pos: TNonBattlePosition,
    movedAs: TDuelCauseReason[],
    movedBy?: DuelEntity,
    actionOwner?: Duelist
  ): Promise<void> => {
    this.move(
      this.fieldCell,
      pos === "FaceUp" ? "FaceUp" : "FaceDown",
      pos === "XysMaterial" ? "Horizontal" : "Vertical",
      "Top",
      movedAs,
      movedBy,
      actionOwner,
      actionOwner
    );
  };

  public readonly setAsSpellTrap = async (
    to: DuelFieldCell,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined
  ): Promise<void> => {
    await this.move(to, "FaceDown", "Vertical", "Top", [...movedAs, "SpellTrapSet"], movedBy, actionOwner, actionOwner);
  };
  public readonly activateSpellTrapFromHand = async (
    to: DuelFieldCell,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined
  ): Promise<void> => {
    await this.move(to, "FaceUp", "Vertical", "Top", [...movedAs, "SpellTrapActivate"], movedBy, actionOwner, actionOwner);
  };

  public readonly activateSpellTrapOnField = async (
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined
  ): Promise<void> => {
    await this.move(this.fieldCell, "FaceUp", "Vertical", "Top", [...movedAs, "SpellTrapActivate"], movedBy, actionOwner, actionOwner);
  };
  public readonly draw = async (
    moveAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined
  ): Promise<DuelFieldCell | undefined> => {
    return await this.addToHand([...moveAs, "Draw"], movedBy, actionOwner);
  };
  public readonly addToHand = async (
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined
  ): Promise<DuelFieldCell | undefined> => {
    return await this.move(this.owner.getHandCell(), "FaceDown", "Vertical", "Bottom", [...movedAs], movedBy, actionOwner, actionOwner);
  };
  public readonly release = async (
    moveAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    movedByWhom: Duelist | undefined
  ): Promise<DuelFieldCell | undefined> => {
    await this.sendToGraveyard([...moveAs, "Release"], movedBy, movedByWhom);
    return this.info.isVanished ? undefined : this.fieldCell;
  };

  public readonly sendToGraveyard = (movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, activator: Duelist | undefined): Promise<void> => {
    return DuelEntity.sendManyToGraveyardForTheSameReason([this], movedAs, movedBy, activator);
  };
  public readonly returnToDeck = (
    pos: TDuelEntityMovePos,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.returnManyToDeckForTheSameReason(pos, [this], movedAs, movedBy, activator);
  };
  public readonly banish = (movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, activator: Duelist | undefined): Promise<void> => {
    return DuelEntity.banishManyForTheSameReason([this], movedAs, movedBy, activator);
  };
  public readonly summon = (
    to: DuelFieldCell,
    pos: TBattlePosition,
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    actionOwner: Duelist,
    chooser?: Duelist
  ): Promise<void> => {
    return DuelEntity.summonMany([{ entity: this, to, chooser: chooser ?? actionOwner, pos }], summonType, moveAs, movedBy, actionOwner);
  };

  private readonly move = async (
    to: DuelFieldCell,
    face: TDuelEntityFace,
    orientation: TDuelEntityOrientation,
    pos: TDuelEntityMovePos,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined,
    chooser: Duelist | undefined
  ): Promise<DuelFieldCell | undefined> => {
    if (!to) {
      // ミスで一回あったので念の為おいておく
      throw new Error("illegal argument: to");
    }

    this.face = face;
    this.orientation = orientation;

    if (this.field.duel.clock.turn > 0) {
      await this.field.duel.view.waitAnimation({ entity: this, to: to, index: pos, count: 0 });
    }

    if (to !== this.fieldCell) {
      this.fieldCell.releaseEntities([this]);

      if (this.entityType === "Token" && playFieldCellTypes.every((t) => t !== this.fieldCell.cellType)) {
        this._hasDisappeared = true;
        this.field.duel.log.info(`${this.nm}は消滅した。`, this.controller);
        return;
      }

      to.acceptEntities([this], pos);

      if (to === this.isBelongTo || to.cellType === "Hand" || to.cellType === "Banished" || this.face === "FaceDown") {
        this.resetInfo();
      }
    }
    this.moveLog.push(movedAs, movedBy, actionOwner, chooser);

    for (const ce of this.continuousEffects) {
      await ce.updateState();
    }

    return to;
  };
  public readonly initForTurn = () => {
    this.info.isSettingSickness = false;
    this.info.attackCount = 0;
    this.info.battlePotisionChangeCount = 0;
  };

  private readonly resetInfo = () => {
    this._info = {
      isDying: false,
      isPending: false,
      causeOfDeath: [],
      isKilledBy: undefined,
      isKilledByWhom: undefined,
      isVanished: false,
      isRebornable: this.origin.monsterCategories?.union(specialMonsterCategories).length === 0 || (this.origin.canReborn ?? false),
      isSettingSickness: false,
      materials: [],
      effectTargets: {},
      willBeBanished: false,
      willReturnToDeck: undefined,
      attackCount: 0,
      battlePotisionChangeCount: 0,
    };
  };

  private readonly resetCauseOfDeath = () => {
    this.info.isDying = false;
    this.info.causeOfDeath = [];
    this.info.isKilledBy = undefined;
    this.info.isKilledByWhom = undefined;
  };
  private readonly resetStatus = () => {
    const master = entityFlexibleStatusKeys.reduce(
      (wip, key) => {
        wip[key] = this.origin[key];
        return wip;
      },
      {} as { [key in TEntityFlexibleStatusKey]: number | undefined }
    );

    this._status = {
      ...JSON.parse(JSON.stringify(this.origin)),
      origin: { ...master },
      current: { ...master },
      calculated: { ...master },
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

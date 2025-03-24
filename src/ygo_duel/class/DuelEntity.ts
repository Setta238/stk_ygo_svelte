import {
  battlePositionDic,
  cardKinds,
  exMonsterCategories,
  specialMonsterCategories,
  type TBattlePosition,
  type CardInfoDescription,
  type CardInfoJson,
  type TNonBattlePosition,
  type EntityStatusBase,
  getSubsetAsEntityStatusBase,
  entityFlexibleStatusKeys,
  type TEntityFlexibleStatusKey,
  type EntityNumericStatus,
} from "@ygo/class/YgoTypes";
import { Duel } from "./Duel";
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
import { CounterHolder, type TCounterName } from "./DuelCounter";
import { StatusOperatorBundle } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
export type EntityStatus = {
  canAttack: boolean;
  canDirectAttack: boolean;
  allowHandSyncro: boolean;
  isEffective: boolean;
  isSelectableForAttack: boolean /** falseのモンスターしかいない場合、ダイレクトアタックになる。《伝説のフィッシャーマン》など。 */;
  maxCounterQty: { [key in TCounterName]?: number };
} & EntityStatusBase;
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
export const destoryCauseReasonDic: { [key in TDestoryCauseReason]: string } = {
  BattleDestroy: "戦闘破壊",
  EffectDestroy: "効果破壊",
  RuleDestroy: "ルール破壊",
};
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
  | "FlipSummon"
  | "System";

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
  isEffective: boolean;
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

  public static readonly waitCorpseDisposal = (duel: Duel) => {
    return DuelEntity.sendManyToGraveyard(
      duel.field
        .getEntiteisOnField()
        .filter((entity) => entity.info.isDying)
        .map((entity) => {
          return {
            entity: entity,
            causedAs: entity.info.causeOfDeath ?? [],
            causedBy: entity.info.isKilledBy,
            activator: entity.info.isKilledByWhom,
          };
        })
    );
  };
  public static readonly sendManyToGraveyardForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCellForTheSameReason("Graveyard", "Top", entities, "FaceUp", "Vertical", movedAs, movedBy, activator);
  };
  public static readonly banishManyForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCellForTheSameReason("Banished", "Top", entities, "FaceDown", "Vertical", movedAs, movedBy, activator);
  };
  public static readonly returnManyToDeckForTheSameReason = (
    pos: TDuelEntityMovePos,
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCellForTheSameReason("Deck", pos, entities, "FaceDown", "Vertical", movedAs, movedBy, activator);
  };

  public static readonly returnManyToHandForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCellForTheSameReason("Hand", "Bottom", entities, "FaceDown", "Vertical", movedAs, movedBy, activator);
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
    return DuelEntity.bringManyToSameCell(
      "Graveyard",
      "Top",
      items.map((item) => {
        return { ...item, face: "FaceUp", orientation: "Vertical" };
      }),
      excludedList
    );
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
    return DuelEntity.bringManyToSameCell(
      "Banished",
      "Top",
      items.map((item) => {
        return { ...item, face: "FaceUp", orientation: "Vertical" };
      }),
      excludedList
    );
  };

  public static readonly bringManyToSameCellForTheSameReason = (
    to: TBundleCellType,
    pos: TDuelEntityMovePos,
    entities: DuelEntity[],
    face: TDuelEntityFace,
    orientation: TDuelEntityOrientation,
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
          face: face,
          orientation: orientation,
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
      face: TDuelEntityFace;
      orientation: TDuelEntityOrientation;
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
        item.face,
        item.orientation,
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
    items: [entity: DuelEntity, ...Parameters<typeof DuelEntity.prototype._move>][],
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
    const destMap = new Map<DuelFieldCell, [entity: DuelEntity, ...Parameters<typeof DuelEntity.prototype._move>][]>();
    items.forEach(([entity, to, face, orientation, pos, ...rest]) => {
      // 状態によって、行き先や表裏の情報を書き換える。
      let _to = to;
      let _face = face;
      let _pos = pos;
      let _orientation = orientation;
      if (entity.info.willBeBanished) {
        console.log(entity);
        _to = entity.owner.getBanished();
        _face = "FaceUp";
        _orientation = "Vertical";
      }
      if (entity.info.willReturnToDeck) {
        _to = entity.isBelongTo;
        _face = "FaceDown";
        _pos = entity.info.willReturnToDeck;
        _orientation = "Vertical";
      }
      if (entity.isBelongTo.cellType === "ExtraDeck") {
        if (_to.cellType === "Hand" || _to.cellType === "Deck") {
          _to = entity.isBelongTo;
          _face = "FaceDown";
          _orientation = "Vertical";
        }
      }
      destMap.set(_to, [[entity, _to, _face, _orientation, _pos, ...rest], ...(destMap.get(_to) ?? [])]);
    });

    // 取り出せなくなるまでループ
    while (true) {
      // 一つずつ取り出す
      const promises = Array.from(destMap.values())
        .map((array) => array.pop())
        .filter((e) => e !== undefined)
        .map(([entity, ...rest]) => entity._move(...rest));

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
    // 色々更新処理
    DuelEntity.settleEntityMove(duel);
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
    if (!items.length) {
      return;
    }

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
        await entity._move(to, face, orientation, "Top", [summonType, moveAsDic[pos], ...moveAs], movedBy, actionOwner, chooser);
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
    // 色々更新処理
    DuelEntity.settleEntityMove(items[0].entity.duel);
  };
  private static readonly settleEntityMove = (duel: Duel) => {
    duel.distributeOperators(duel.clock.totalProcSeq);
    const entities = duel.field.getAllEntities().filter((entity) => entity.wasMovedAtCurrentProc);
    entities.filter((entity) => !entity.isOnField).forEach((entity) => entity.resetInfo());
    entities.flatMap((entity) => entity.continuousEffects).forEach((ce) => ce.updateState());
  };

  public readonly seq: number;
  public readonly origin: EntityStatusBase;
  public readonly entityType: TDuelEntityType;
  public readonly procFilterBundle: ProcFilterBundle;
  public readonly numericOprsBundle: NumericStateOperatorBundle;
  public readonly cardRelationBundle: CardRelationBundle;
  public readonly statusOperatorBundle: StatusOperatorBundle;
  public readonly moveLog: DuelEntityLog;
  public readonly counterHolder: CounterHolder;
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
  private _numericStatus: EntityNumericStatus;
  private _info: DuelEntityInfomation;

  public readonly actions: CardAction<unknown>[] = [];
  public readonly continuousEffects: ContinuousEffect<unknown>[] = [];
  private _hasDisappeared = false;
  public get status() {
    return this._status;
  }
  public set status(newStatus) {
    console.log(newStatus);
    this._status = { ...newStatus };
  }
  public get numericStatus() {
    return this._numericStatus;
  }
  public get info() {
    return this._info;
  }

  public get nm() {
    return this.status.name;
  }
  public get atk() {
    return this._numericStatus.calculated.attack;
  }
  public get def() {
    return this._numericStatus.calculated.defense;
  }
  public get lvl() {
    return this._numericStatus.calculated.level;
  }
  public get rank() {
    return this._numericStatus.calculated.rank;
  }
  public get attr() {
    return this.status.attributes ?? [];
  }
  public get types() {
    return this.status.types ?? [];
  }
  public get psL() {
    return this._numericStatus.calculated.pendulumScaleL;
  }
  public get psR() {
    return this._numericStatus.calculated.pendulumScaleR;
  }
  public get isEffective() {
    return this.status.isEffective && this.info.isEffective;
  }
  /**
   * エフェクト・ヴェーラーなどによる強い無効
   */
  public get isNagatedStrongly() {
    return !this.info.isEffective;
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
  public get battlePositionName() {
    const bp = this.battlePosition;
    if (!bp) {
      return undefined;
    }
    return battlePositionDic[bp];
  }
  public get wasMovedAtCurrentProc() {
    return (
      this.field.duel.clock.totalProcSeq === this.moveLog.latestRecord.movedAt.totalProcSeq &&
      this.moveLog.records.slice(-2)[0].cell.cellType !== this.fieldCell.cellType
    );
  }
  public get wasMovedAtPreviousProc() {
    return (
      this.field.duel.clock.totalProcSeq === this.moveLog.latestRecord.movedAt.totalProcSeq + 1 &&
      this.moveLog.records.slice(-2)[0].cell.cellType !== this.fieldCell.cellType
    );
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

  public get allStickyEffectOperators() {
    return [...this.procFilterBundle.operators, ...this.numericOprsBundle.operators, ...this.cardRelationBundle.operators];
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
    this.counterHolder = new CounterHolder();

    this.owner = owner;
    this.fieldCell = fieldCell;
    this.entityType = entityType;

    this.origin = cardInfo;
    this._status = JSON.parse(JSON.stringify(cardInfo));
    this._numericStatus = JSON.parse(JSON.stringify(cardInfo));

    this.resetStatus();
    this._info = {
      isEffective: true,
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
    this.statusOperatorBundle = new StatusOperatorBundle(fieldCell.field.statusOperatorPool, this);

    fieldCell.acceptEntities([this], "Top");
    this.moveLog = new DuelEntityLog(this);
    this.moveLog.pushForRuleAction(["Spawn"]);
  }

  public readonly toString = () => `《${this.nm}》`;

  public readonly setBattlePosition = async (pos: TBattlePosition, movedAs: TDuelCauseReason[], movedBy?: DuelEntity, actionOwner?: Duelist): Promise<void> => {
    // ログテキストを準備
    let logText = `表示形式の変更：${this.toString()}（${this.battlePositionName}⇒${battlePositionDic[pos]}）`;
    const _movedAs = [...movedAs];

    // 反転召喚の判定
    if (this.battlePosition === "Set") {
      _movedAs.push("Flip");
      if (movedAs.includes("Rule")) {
        logText = `${this.toString()}を反転召喚`;
        _movedAs.push("FlipSummon");
      }
    }
    this.moveAlone(
      this.fieldCell,
      pos === "Set" ? "FaceDown" : "FaceUp",
      pos === "Attack" ? "Vertical" : "Horizontal",
      "Top",
      _movedAs,
      movedBy,
      actionOwner,
      actionOwner
    );
    this.duel.log.info(logText, actionOwner);
  };

  public readonly setNonFieldMonsterPosition = async (
    pos: TNonBattlePosition,
    movedAs: TDuelCauseReason[],
    movedBy?: DuelEntity,
    actionOwner?: Duelist
  ): Promise<void> => {
    this.moveAlone(
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
    await this.moveAlone(to, "FaceDown", "Vertical", "Top", [...movedAs, "SpellTrapSet"], movedBy, actionOwner, actionOwner);
  };
  public readonly activateSpellTrapFromHand = async (
    to: DuelFieldCell,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined
  ): Promise<void> => {
    await this.moveAlone(to, "FaceUp", "Vertical", "Top", [...movedAs, "SpellTrapActivate"], movedBy, actionOwner, actionOwner);
  };

  public readonly activateSpellTrapOnField = async (
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined
  ): Promise<void> => {
    await this.moveAlone(this.fieldCell, "FaceUp", "Vertical", "Top", [...movedAs, "SpellTrapActivate"], movedBy, actionOwner, actionOwner);
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
    return await this.moveAlone(this.owner.getHandCell(), "FaceDown", "Vertical", "Bottom", [...movedAs], movedBy, actionOwner, actionOwner);
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

  private readonly moveAlone = async (
    to: DuelFieldCell,
    face: TDuelEntityFace,
    orientation: TDuelEntityOrientation,
    pos: TDuelEntityMovePos,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined,
    chooser: Duelist | undefined
  ): Promise<DuelFieldCell | undefined> => {
    await DuelEntity.moveMany([[this, to, face, orientation, pos, movedAs, movedBy, actionOwner, chooser]], undefined);
    return this.fieldCell;
  };

  /**
   * 移動の処理のみのため、直接呼び出す場合は後処理を忘れないこと
   * @param to
   * @param face
   * @param orientation
   * @param pos
   * @param movedAs
   * @param movedBy
   * @param actionOwner
   * @param chooser
   * @returns
   */
  private readonly _move = async (
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
      // セルから自分自身を取り除く
      this.fieldCell.releaseEntities([this]);

      // 場を離れる場合の処理
      if (this.fieldCell.isPlayFieldCell && !to.isPlayFieldCell) {
        // カウンター類を全て除去
        this.counterHolder.clear();

        // 墓地送り予定情報を削除
        this.resetCauseOfDeath();

        // トークンが場を離れる場合、消滅
        if (this.entityType === "Token") {
          this._hasDisappeared = true;
          this.field.duel.log.info(`${this.nm}は消滅した。`, this.controller);
          return;
        }
      }

      // セルに自分を所属させる
      to.acceptEntities([this], pos);

      // 非公開情報になった場合、全ての情報をリセット
      if (to === this.isBelongTo || to.cellType === "Hand" || (to.cellType === "Banished" && this.face === "FaceDown")) {
        this.resetInfo();
        this.resetStatus();
      }
    }

    this.moveLog.push(movedAs, movedBy, actionOwner, chooser);

    return to;
  };
  public readonly initForTurn = () => {
    this.info.isSettingSickness = false;
    this.info.attackCount = 0;
    this.info.battlePotisionChangeCount = 0;

    this.counterHolder.corpseDisposal();
  };

  private readonly resetInfo = () => {
    this._info = {
      isDying: false,
      isPending: false,
      isEffective: true,
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

    this.counterHolder.clear();
  };

  private readonly resetStatus = () => {
    const master = entityFlexibleStatusKeys.reduce(
      (wip, key) => {
        wip[key] = this.origin[key];
        return wip;
      },
      {} as { [key in TEntityFlexibleStatusKey]: number | undefined }
    );

    this._numericStatus = {
      origin: { ...master },
      current: { ...master },
      calculated: { ...master },
    };
    this._status = {
      ...this.origin,
      canAttack: true,
      isEffective: true,
      canDirectAttack: false,
      isSelectableForAttack: true,
      allowHandSyncro: false,
      maxCounterQty: {},
    };
  };
  private readonly resetCauseOfDeath = () => {
    this.info.isDying = false;
    this.info.causeOfDeath = [];
    this.info.isKilledBy = undefined;
    this.info.isKilledByWhom = undefined;
  };
}

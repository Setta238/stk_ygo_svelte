import {
  battlePositionDic,
  exMonsterCategories,
  specialMonsterCategories,
  type TBattlePosition,
  type CardInfoDescription,
  type CardInfoJson,
  type TNonBattlePosition,
  type EntityStatusBase,
  getSubsetAsEntityStatusBase,
  entityFlexibleStatusKeys,
  type TEntityFlexibleNumericStatusKey,
  type EntityNumericStatus,
  cardSorter,
  type TCardKind,
} from "@ygo/class/YgoTypes";
import { Duel } from "./Duel";
import {
  deckCellTypes,
  duelFieldCellTypes,
  monsterZoneCellTypes,
  playFieldCellTypes,
  spellTrapZoneCellTypes,
  type DuelFieldCell,
  type DuelFieldCellType,
  type TBundleCellType,
  type TDuelEntityMovePos,
} from "./DuelFieldCell";
import { type Duelist } from "./Duelist";

import {} from "@stk_utils/funcs/StkArrayUtils";
import { cardDefinitionDic, cardInfoDic } from "@ygo/class/CardInfo";
import { CardAction, type CardActionDefinition, type ChainBlockInfo } from "./DuelCardAction";
import { ProcFilterBundle } from "../class_continuous_effect/DuelProcFilter";
import { ContinuousEffect, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperatorBundle } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { CardRelationBundle } from "@ygo_duel/class_continuous_effect/DuelCardRelation";
import type { DuelField } from "./DuelField";
import { DuelEntityLog } from "./DuelEntityLog";
import { CounterHolder, type TCounterName } from "./DuelCounter";
import { StatusOperatorBundle } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultNormalSummonAction } from "@ygo_duel/cards/DefaultCardAction_Monster";
import { StkAsyncEvent } from "@stk_utils/class/StkEvent";
import type { CardDefinition, MaterialInfo } from "@ygo_duel/cards/CardDefinitions";
import { SubstituteEffect } from "./DuelSubstituteEffect";
export type EntityStatus = {
  canAttack: boolean;
  canDirectAttack: boolean;
  allowHandSyncro: boolean;
  isEffective: boolean;
  /**
   * falseのモンスターしかいない場合、ダイレクトアタックになる。《伝説のフィッシャーマン》など。
   */
  isSelectableForAttack: boolean;
  maxCounterQty: { [key in TCounterName]?: number };
} & EntityStatusBase;

export type DuelEntityInfomation = {
  isEffectiveIn: DuelFieldCellType[];
  isPending: boolean;
  isDying: boolean;
  causeOfDeath: (TDestoryCauseReason | "CardActivation" | "LostXyzOwner" | "LostEquipOwner")[];
  isKilledBy: DuelEntity | undefined;
  isKilledByWhom: Duelist | undefined;
  isVanished: boolean;
  isRebornable: boolean;
  isSettingSickness: boolean;
  materials: MaterialInfo[];
  effectTargets: { [actionSeq: number]: DuelEntity[] };
  willBeBanished: boolean;
  willReturnToDeck: TDuelEntityMovePos | undefined;
  attackCount: number;
  battlePotisionChangeCount: number;
  equipedBy: DuelEntity | undefined;
  equipedAs: ChainBlockInfo<unknown> | undefined;
  validateEquipOwner: (owner: DuelEntity, equip: DuelEntity) => boolean;
  equipEntities: DuelEntity[];
};

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
export const materialCauseReason = [
  "AdvanceSummonRelease",
  "SpecialSummonMaterial",
  "FusionMaterial",
  "SyncroMaterial",
  "XyzMaterial",
  "RitualMaterial",
] as const;
export type TMaterialCauseReason = (typeof materialCauseReason)[number];
export type TDuelCauseReason =
  | TSummonRuleCauseReason
  | TSummonPosCauseReason
  | TMaterialCauseReason
  | TDestoryCauseReason
  | "Draw"
  | "Effect"
  | "Release"
  | "Cost"
  | "Discard"
  | "Rule"
  | "Spawn"
  | "SpellTrapSet"
  | "CardActivation"
  | "Flip"
  | "FlipByBattle"
  | "FlipSummon"
  | "System"
  | "LostXyzOwner"
  | "LostEquipOwner";

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

export const cardEntitySorter = (left: DuelEntity, right: DuelEntity): number => {
  return cardSorter(left.origin, right.origin);
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
      "Vertical",
      undefined
    );
  };
  public static readonly createCardEntity = (owner: Duelist, cardInfo: CardInfoJson): DuelEntity => {
    // cardはデッキまたはEXデッキに生成
    const fieldCell = cardInfo.monsterCategories && cardInfo.monsterCategories.union(exMonsterCategories).length ? owner.getExtraDeck() : owner.getDeckCell();

    const newCard = new DuelEntity(
      owner,
      fieldCell,
      "Card",
      getSubsetAsEntityStatusBase(cardInfo),
      "FaceDown",
      "Vertical",
      cardDefinitionDic.get(cardInfo.name)
    );
    if (!Object.hasOwn(cardInfoDic, newCard.origin.name)) {
      owner.duel.log.info(`未実装カード${cardInfo.name}がデッキに投入された。`, owner);
    }

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
  public static readonly discardManyForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCellForTheSameReason("Graveyard", "Top", entities, "FaceUp", "Vertical", ["Discard", ...movedAs], movedBy, activator);
  };
  public static readonly banishManyForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCellForTheSameReason("Banished", "Top", entities, "FaceUp", "Vertical", movedAs, movedBy, activator);
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

  public static readonly convertManyToXyzMaterials = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    activator: Duelist
  ): Promise<void> => {
    return DuelEntity.moveMany(
      entities.map((entity) => [entity, entity.fieldCell, "XyzMaterial", "FaceUp", "Vertical", "Top", movedAs, movedBy, activator, activator])
    );
  };
  public static readonly moveToXyzOwner = (
    dest: DuelFieldCell,
    xyzMaterials: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    activator: Duelist
  ): Promise<void> => {
    return DuelEntity.moveMany(
      xyzMaterials.map((entity) => [entity, dest, "XyzMaterial", "FaceUp", "Vertical", "Top", movedAs, movedBy, activator, activator])
    );
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
      entities.map((entity) => {
        return {
          entity: entity,
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
        item.entity.origin.kind,
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

    // 除外対象を配列にしておく
    // TODO 不要かも？
    const entitiesWithAnimation = items
      .filter(([entity, to]) => entity.fieldCell !== to)
      .map(([entity]) => entity)
      .filter((entity) => !(excludedList ?? []).includes(entity));
    const _excludedList = [...entitiesWithAnimation, ...duel.field.getEntiteisOnField().filter((entity) => entity.info.isDying)];

    // 目的地ごとに仕分ける
    const destMap = new Map<DuelFieldCell, [entity: DuelEntity, ...Parameters<typeof DuelEntity.prototype._move>][]>();
    items.forEach(([entity, to, kind, face, orientation, pos, ...rest]) => {
      // 状態によって、行き先や表裏の情報を書き換える。
      let _to = to;
      let _kind = kind;
      let _face = face;
      let _pos = pos;
      let _orientation = orientation;
      if (entity.info.willBeBanished) {
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

      if (!_to.isPlayFieldCell) {
        _kind = entity.origin.kind;
      }
      if (!_to.isMonsterZoneLikeCell) {
        _orientation = "Vertical";
      }

      destMap.set(_to, [[entity, _to, _kind, _face, _orientation, _pos, ...rest], ...(destMap.get(_to) ?? [])]);
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

      // 新しく発生したものを検知（※ここまでのどこかでアニメーションしたものを除く）
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
    console.log(items.map(([entity]) => entity.toString()));
    // 色々更新処理
    DuelEntity.settleEntityMove(duel);
    console.log(items.map(([entity]) => entity.toString()));
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
        await entity._move(to, "Monster", face, orientation, "Top", [summonType, moveAsDic[pos], ...moveAs], movedBy, actionOwner, chooser);
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
    entities.filter((entity) => !entity.isOnField).forEach((entity) => entity.resetInfoIfLeavesTheField());
    entities
      .filter((entity) => entity.face === "FaceDown")
      .filter((entity) => entity.fieldCell === entity.isBelongTo)
      .forEach((entity) => {
        entity.resetInfoAll();
        entity.resetStatusAll();
      });
    entities.flatMap((entity) => entity.continuousEffects).forEach((ce) => ce.updateState());
    duel.field
      .getAllCells()
      .filter((cell) => cell.needsShuffle)
      .map((cell) => cell.shuffle());
  };

  private readonly onBeforeMoveEvent = new StkAsyncEvent<{
    entity: DuelEntity;
    args: Readonly<Parameters<typeof DuelEntity.prototype._move>>;
  }>();
  public get onBeforeMove() {
    return this.onBeforeMoveEvent.expose();
  }
  private readonly onAfterMoveEvent = new StkAsyncEvent<DuelEntity>();
  public get onAfterMove() {
    return this.onAfterMoveEvent.expose();
  }

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

  public get actionLogRecords() {
    return this.duel.chainBlockLog.records.filter((rec) => rec.chainBlockInfo.action.entity === this);
  }

  public fieldCell: DuelFieldCell;

  private _status: EntityStatus;
  private _numericStatus: EntityNumericStatus;
  private _info: DuelEntityInfomation;

  public readonly actions: CardAction<unknown>[] = [];
  public readonly continuousEffects: ContinuousEffect<unknown>[] = [];
  public readonly substituteEffects: SubstituteEffect[] = [];
  public readonly canBeSummoned: <T>(
    activator: Duelist,
    action: CardAction<T>,
    summonType: TSummonRuleCauseReason,
    pos: TBattlePosition,
    materialInfos: MaterialInfo[],
    ignoreSummoningConditions: boolean
  ) => boolean;
  public readonly canBeMaterial: <T>(
    activator: Duelist,
    monster: DuelEntity,
    action: CardAction<T>,
    materialType: TMaterialCauseReason,
    pos: TBattlePosition,
    materialInfos: MaterialInfo[],
    ignoreSummoningConditions: boolean
  ) => boolean;
  public readonly canBeReleased = <T>(
    activator: Duelist,
    causedBy: DuelEntity,
    causedAs: (TMaterialCauseReason | "ReleaseAsCost" | "ReleaseAsEffect")[],
    action: CardAction<T>
  ): boolean => {
    return this.procFilterBundle.operators.filter((pf) => pf.procTypes.union(causedAs).length).every((pf) => pf.filter(activator, causedBy, action, [this]));
  };
  private _hasDisappeared = false;
  public get status() {
    return this._status as Readonly<EntityStatus>;
  }
  public set status(newStatus) {
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
    return this.status.isEffective && this.info.isEffectiveIn.includes(this.fieldCell.cellType);
  }

  /**
   * 現在無効状態だが、場所を変えれば有効になる
   */
  public get isEffectiveWeakly() {
    return this.status.isEffective;
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
    return this.field.duel.clock.totalProcSeq === this.moveLog.latestRecord.movedAt.totalProcSeq;
  }
  public get wasMovedAtPreviousProc() {
    return this.field.duel.clock.totalProcSeq === this.moveLog.latestRecord.movedAt.totalProcSeq + 1;
  }
  public get wasMovedAtCurrentChain() {
    return this.field.duel.clock.isSameChain(this.moveLog.latestRecord.movedAt);
  }
  public get wasMovedAtPreviousChain() {
    return this.field.duel.clock.isPreviousChain(this.moveLog.latestRecord.movedAt);
  }
  public get wasMovedFrom() {
    return this.moveLog.previousPlaceRecord.cell;
  }

  public get isOnField() {
    return playFieldCellTypes.some((t) => t === this.fieldCell.cellType);
  }
  public get isOnFieldAsMonster() {
    return monsterZoneCellTypes.some((t) => t === this.fieldCell.cellType);
  }
  public get isOnFieldAsSpellTrap() {
    return spellTrapZoneCellTypes.some((t) => t === this.fieldCell.cellType);
  }
  public get isLikeContinuousSpell() {
    return (
      this.status.spellCategory === "Continuous" ||
      this.status.spellCategory === "Field" ||
      this.status.spellCategory === "Equip" ||
      this.status.trapCategory === "Continuous" ||
      (this.status.monsterCategories ?? []).includes("Pendulum")
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
    orientation: TDuelEntityOrientation,
    cardDefinition: CardDefinition | undefined
  ) {
    this.seq = DuelEntity.nextEntitySeq++;
    this.counterHolder = new CounterHolder();

    this.owner = owner;
    this.fieldCell = fieldCell;
    this.entityType = entityType;

    this.origin = cardInfo;
    this._status = JSON.parse(JSON.stringify(cardInfo));
    this._numericStatus = JSON.parse(JSON.stringify(cardInfo));

    this.resetStatusAll();
    this._info = {
      isEffectiveIn: [...duelFieldCellTypes],
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
      equipedBy: undefined,
      equipedAs: undefined,
      validateEquipOwner: () => true,
      equipEntities: [],
    };
    this.resetInfoAll();
    this.face = face;
    this.orientation = orientation;
    this.procFilterBundle = new ProcFilterBundle(fieldCell.field.procFilterPool, this);
    this.numericOprsBundle = new NumericStateOperatorBundle(fieldCell.field.numericStateOperatorPool, this);
    this.cardRelationBundle = new CardRelationBundle(fieldCell.field.cardRelationPool, this);
    this.statusOperatorBundle = new StatusOperatorBundle(fieldCell.field.statusOperatorPool, this);

    fieldCell.acceptEntities([this], "Top");
    this.moveLog = new DuelEntityLog(this);
    this.moveLog.pushForRuleAction(["Spawn"]);

    let actionBases: CardActionDefinition<unknown>[] = [];
    let continuousEffectBases: ContinuousEffectBase<unknown>[] = [];

    if (this.origin.kind === "Monster" && this.origin.monsterCategories?.includes("Normal")) {
      actionBases = [defaultNormalSummonAction, defaultAttackAction, defaultBattlePotisionChangeAction] as CardActionDefinition<unknown>[];
    } else if (cardDefinition) {
      actionBases = cardDefinition.actions;
      continuousEffectBases = cardDefinition.continuousEffects ?? [];
      this.substituteEffects.push(...(cardDefinition.substituteEffects ?? []).map((base) => SubstituteEffect.createNew(this, base)));
    }
    this.actions.push(...actionBases.map((b) => CardAction.createNew(this, b)));
    this.continuousEffects.push(...continuousEffectBases.map((b) => ContinuousEffect.createNew(this, b)));

    const tmp = cardDefinition?.canBeSummoned ?? (() => true);

    this.canBeSummoned = (activator, action, summonType, pos, materialInfos, ignoreSummoningConditions) =>
      tmp(activator, this, action, summonType, pos, materialInfos, ignoreSummoningConditions);

    this.canBeMaterial = (activator, monster, action, materialType, pos, materialInfos, ignoreSummoningConditions) => {
      if (cardDefinition?.canBeMaterial) {
        if (!cardDefinition?.canBeMaterial(activator, monster, action, materialType, pos, materialInfos, ignoreSummoningConditions)) {
          return false;
        }
      }

      return this.procFilterBundle.operators
        .filter((pf) => pf.procTypes.some((t) => t === materialType))
        .every((pf) =>
          pf.filter(
            action.entity.controller,
            action.entity,
            action,
            materialInfos.map((info) => info.material)
          )
        );
    };
  }

  public readonly toString = () => (this.entityType === "Card" ? `《${this.nm}》` : this.nm);

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
        _movedAs.push("AttackSummon");
      }
    }
    this.duel.log.info(logText, actionOwner);
    await this.moveAlone(
      this.fieldCell,
      "Monster",
      pos === "Set" ? "FaceDown" : "FaceUp",
      pos === "Attack" ? "Vertical" : "Horizontal",
      "Top",
      _movedAs,
      movedBy,
      actionOwner,
      actionOwner
    );
  };

  public readonly activateAsPendulumScale = (pendulumZone: DuelFieldCell, movedAs: TDuelCauseReason[], movedBy?: DuelEntity, actionOwner?: Duelist) =>
    this.moveAlone(pendulumZone, "Spell", "FaceUp", "Vertical", "Top", ["CardActivation", ...movedAs], movedBy, actionOwner, actionOwner);

  public readonly setNonFieldMonsterPosition = async (
    kind: TCardKind,
    pos: TNonBattlePosition,
    movedAs: TDuelCauseReason[],
    movedBy?: DuelEntity,
    actionOwner?: Duelist
  ): Promise<void> => {
    this.moveAlone(this.fieldCell, kind, pos === "FaceUp" ? "FaceUp" : "FaceDown", "Vertical", "Top", movedAs, movedBy, actionOwner, actionOwner);
  };

  public readonly setAsSpellTrap = async (
    to: DuelFieldCell,
    kind: TCardKind,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined
  ): Promise<void> => {
    await this.moveAlone(to, kind, "FaceDown", "Vertical", "Top", [...movedAs, "SpellTrapSet"], movedBy, actionOwner, actionOwner);
  };
  public readonly activateSpellTrapFromHand = async (
    to: DuelFieldCell,
    kind: TCardKind,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined
  ): Promise<void> => {
    await this.moveAlone(to, kind, "FaceUp", "Vertical", "Top", [...movedAs, "CardActivation"], movedBy, actionOwner, actionOwner);
  };

  public readonly activateSpellTrapOnField = async (
    kind: TCardKind,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined
  ): Promise<void> => {
    await this.moveAlone(this.fieldCell, kind, "FaceUp", "Vertical", "Top", [...movedAs, "CardActivation"], movedBy, actionOwner, actionOwner);
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
    return await this.moveAlone(this.owner.getHandCell(), this.origin.kind, "FaceDown", "Vertical", "Bottom", [...movedAs], movedBy, actionOwner, actionOwner);
  };
  public readonly release = async (
    moveAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    movedByWhom: Duelist | undefined
  ): Promise<DuelFieldCell | undefined> => {
    await this.sendToGraveyard([...moveAs, "Release"], movedBy, movedByWhom);
    return this.info.isVanished ? undefined : this.fieldCell;
  };
  public readonly ruleDestory = async (): Promise<DuelFieldCell | undefined> => {
    await this.sendToGraveyard(["RuleDestroy"], undefined, undefined);
    return this.info.isVanished ? undefined : this.fieldCell;
  };

  public readonly sendToGraveyard = (movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, activator: Duelist | undefined): Promise<void> => {
    return DuelEntity.sendManyToGraveyardForTheSameReason([this], movedAs, movedBy, activator);
  };
  public readonly discard = (movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, activator: Duelist | undefined): Promise<void> => {
    return DuelEntity.discardManyForTheSameReason([this], movedAs, movedBy, activator);
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
    kind: TCardKind,
    face: TDuelEntityFace,
    orientation: TDuelEntityOrientation,
    pos: TDuelEntityMovePos,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined,
    chooser: Duelist | undefined
  ): Promise<DuelFieldCell | undefined> => {
    await DuelEntity.moveMany([[this, to, kind, face, orientation, pos, movedAs, movedBy, actionOwner, chooser]], undefined);
    return this.fieldCell;
  };

  /**
   * 移動の処理のみのため、直接呼び出す場合は後処理を忘れないこと
   * @param to
   * @param kind
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
    kind: TCardKind,
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

    await this.onBeforeMoveEvent.trigger({
      entity: this,
      args: [to, kind, face, orientation, pos, movedAs, movedBy, actionOwner, chooser],
    });
    this._status.kind = kind;
    this.face = face;
    this.orientation = orientation;

    // 異なるセルに移動する場合
    if (to !== this.fieldCell) {
      if (this.field.duel.clock.turn > 0) {
        await this.field.duel.view.waitAnimation({ entity: this, to: to, index: pos, count: 0 });
      }
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
      if (this.status.kind !== "XyzMaterial") {
        // モンスターゾーンを離れる時の処理
        if ((this.fieldCell.isMonsterZoneLikeCell && !to.isMonsterZoneLikeCell) || kind !== "Monster") {
          // 装備していたカードにマーキング
          this.info.equipEntities
            .filter((equip) => equip.isOnFieldAsSpellTrap)
            .forEach((equip) => {
              equip.info.isDying = true;
              equip.info.causeOfDeath = ["RuleDestroy"];
              this.controller.writeInfoLog(`装備対象${this.toString()}不在により${equip.toString()}は破壊された。`);
            });
          this.info.equipEntities = [];
          // XYZ素材にマーキング
          this.fieldCell.xyzMaterials.forEach((material) => {
            material.info.isDying = true;
            material.info.causeOfDeath = ["LostXyzOwner"];
            this.controller.writeInfoLog(`エクシーズモンスター${this.toString()}不在により${material.toString()}は墓地に送られた。`);
          });
        }
      }

      // 魔法罠を離れる時の処理
      if (this.fieldCell.cellType === "SpellAndTrapZone" && to.cellType !== "SpellAndTrapZone") {
        // 装備解除
        this.info.equipedBy = undefined;
        this.info.equipedAs = undefined;
      }

      // セルに自分を所属させる
      to.acceptEntities([this], pos);

      // ★情報のリセット、再セット
      //    後処理は後続で行う
      if (to === this.isBelongTo || to.cellType === "Hand" || (to.cellType === "Banished" && this.face === "FaceDown")) {
        // 非公開情報になった場合、全ての情報をリセット
        this.counterHolder.clear();
        this.resetInfoAll();
        this.resetStatusAll();
      }
    }

    if ((this.isOnField && this.face === "FaceDown") || kind === "XyzMaterial") {
      // セット状態になった場合、またはエクシーズ素材になった場合。

      // 装備していたカードにマーキング
      this.info.equipEntities.forEach((equip) => {
        equip.info.isDying = true;
        equip.info.causeOfDeath = ["RuleDestroy"];
        this.controller.writeInfoLog(`装備対象${this.toString()}不在により${equip.toString()}は破壊された。`);
      });

      // カウンター類を除去
      this.counterHolder.removeAllWhenfaceDown();
      // 素材情報を削除
      this.info.materials = [];

      // 無効化状態を解除
      this._status.isEffective = true;
      this.info.isEffectiveIn = [...duelFieldCellTypes];

      // フィールドから離れたとき除外される系のリセット
      this.info.willBeBanished = false;
      this.info.willReturnToDeck = undefined;

      //ステータスをリセット
      this.resetNumericStatus();

      // セットしたターンに発動できない制約を付与
      this.info.isSettingSickness = this.status.kind === "Trap" || this.status.spellCategory === "QuickPlay";
    }
    // 移動ログ追加
    this.moveLog.push(movedAs, movedBy, actionOwner, chooser);

    console.log(this.toString());
    await this.onAfterMoveEvent.trigger(this);

    return to;
  };
  public readonly initForTurn = () => {
    this.info.isSettingSickness = false;
    this.info.attackCount = 0;
    this.info.battlePotisionChangeCount = 0;

    this.counterHolder.corpseDisposal();
  };

  private readonly resetInfoIfLeavesTheField = () => {
    this._info = {
      ...this._info,
      isDying: false,
      isPending: false,
      causeOfDeath: [],
      isKilledBy: undefined,
      isKilledByWhom: undefined,
      effectTargets: {},
      attackCount: 0,
      battlePotisionChangeCount: 0,
      equipedBy: undefined,
      equipedAs: undefined,
      equipEntities: [],
    };

    this._info.isEffectiveIn.push(...playFieldCellTypes);
    this._info.isEffectiveIn.distinct();
  };

  private readonly resetInfoAll = () => {
    this._info = {
      isDying: false,
      isPending: false,
      isEffectiveIn: [...duelFieldCellTypes],
      causeOfDeath: [],
      isKilledBy: undefined,
      isKilledByWhom: undefined,
      isVanished: false,
      isRebornable: this.origin.monsterCategories?.union(specialMonsterCategories).length === 0,
      isSettingSickness: false,
      materials: [],
      effectTargets: {},
      willBeBanished: false,
      willReturnToDeck: undefined,
      attackCount: 0,
      battlePotisionChangeCount: 0,
      equipedBy: undefined,
      equipedAs: undefined,
      validateEquipOwner: () => true,
      equipEntities: [],
    };

    this.counterHolder.clear();
  };

  private readonly resetNumericStatus = () => {
    const master = entityFlexibleStatusKeys.reduce(
      (wip, key) => {
        wip[key] = this.origin[key];
        return wip;
      },
      {} as { [key in TEntityFlexibleNumericStatusKey]: number | undefined }
    );

    this._numericStatus = {
      origin: { ...master },
      wip: { ...master },
      calculated: { ...master },
    };
  };

  public readonly resetStatus = () => {
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
  private readonly resetStatusAll = () => {
    this.resetNumericStatus();
    this.resetStatus();
  };
  public readonly resetCauseOfDeath = () => {
    this.info.isDying = false;
    this.info.causeOfDeath = [];
    this.info.isKilledBy = undefined;
    this.info.isKilledByWhom = undefined;
  };
}

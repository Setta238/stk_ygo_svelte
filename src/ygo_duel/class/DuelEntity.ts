import {
  battlePositionDic,
  exMonsterCategories,
  specialSummonMonsterCategories,
  type TBattlePosition,
  type CardInfoDescription,
  type TNonBattlePosition,
  type EntityStatusBase,
  entityFlexibleNumericStatusKeys,
  type TEntityFlexibleNumericStatusKey,
  type EntityNumericStatus,
  cardSorter,
  type TCardKind,
  linkArrowDic,
  type LinkArrow,
  faceupBattlePositions,
} from "@ygo/class/YgoTypes";
import { Duel, SystemError } from "./Duel";
import {
  deckCellTypes,
  duelFieldCellTypes,
  playFieldCellTypes,
  type DuelFieldCell,
  type DuelFieldCellType,
  type TBundleCellType,
  type TDuelEntityMovePos,
} from "./DuelFieldCell";
import { type Duelist } from "./Duelist";

import { EntityAction, type CardActionDefinitionAttrs, type ChainBlockInfo, type ChainBlockInfoBase, type SummonMaterialInfo } from "./DuelEntityAction";
import { ProcFilterBundle, type TBanishProcType, type TProcType } from "../class_continuous_effect/DuelProcFilter";
import { ContinuousEffect, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperatorBundle } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import type { DuelField } from "./DuelField";
import { EntityMoveLog } from "./DuelEntityMoveLog";
import { CounterHolder, type TCounterName } from "./DuelCounter";
import { StatusOperator, StatusOperatorBundle } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";

import { createDuelistEntityDefinition, type EntityDefinition } from "./DuelEntityDefinition";
import { SubstituteEffect } from "./DuelSubstituteEffect";
import { SummonFilter, SummonFilterBundle } from "@ygo_duel/class_continuous_effect/DuelSummonFilter";
import { DuelEntityShortHands } from "./DuelEntityShortHands";
import type { IDuelClock } from "./DuelClock";
import { DamageFilterBundle } from "@ygo_duel/class_continuous_effect/DuelDamageFilter";
import { delay } from "@stk_utils/funcs/StkPromiseUtil";
import { ImmediatelyAction } from "./DuelEntityImmediatelyAction";
export type EntityStatus = {
  canAttack: boolean;
  canDirectAttack: boolean;
  canActivateEffect: boolean;
  canBattlePositionChange: boolean;
  allowHandSynchro: boolean;
  allowHandLink: boolean;
  isEffective: boolean;
  isFaithful: boolean;
  willBeBanished: boolean;
  willReturnToDeck: TDuelEntityMovePos | undefined;
  /**
   * 貫通ダメージ倍化は貫通と倍化で分けて処理する。
   */
  piercingTo: Duelist[];

  /**
   * falseのモンスターしかいない場合、ダイレクトアタックになる。《伝説のフィッシャーマン》など。
   */
  isSelectableForAttack: boolean;
  maxCounterQty: { [key in TCounterName]?: number };
  fusionSubstitute: boolean;
} & Omit<EntityStatusBase, "kind">;

export type DuelEntityInfomation = {
  kind: TCardKind;
  isEffectiveIn: DuelFieldCellType[];
  isPending: boolean;
  isDying: boolean;
  causeOfDeath: (TDestroyCauseReason | "CardActivation" | "LostXyzOwner" | "LostEquipOwner" | "LostDestinyBond" | "Destroy")[];
  isKilledBy: DuelEntity | undefined;
  isKilledByWhom: Duelist | undefined;
  isVanished: boolean;
  isRebornable: boolean;
  isSettingSickness: boolean;
  summonKinds: TSummonKindCauseReason[];
  materials: SummonMaterialInfo[];
  effectTargets: { [actionSeq: number]: DuelEntity[] };
  attackDeclareCount: number;
  battlePotisionChangeCount: number;
  equipedBy: DuelEntity | undefined;
  equipedAs: ChainBlockInfo<unknown> | undefined;
  validateEquipOwner: (owner: DuelEntity, equip: DuelEntity) => boolean;
  equipEntities: DuelEntity[];
  xyzOwner: DuelEntity | undefined;
  battleLog: { enemy: DuelEntity; timestamp: IDuelClock }[];
};

export const duelEntityFaces = ["FaceUp", "FaceDown"] as const;
export type TDuelEntityFace = (typeof duelEntityFaces)[number];
export type TDuelEntityOrientation = "Horizontal" | "Vertical";
export const namedSummonKindCauseReasons = [
  "FusionSummon",
  "SynchroSummon",
  "XyzSummon",
  "PendulumSummon",
  "LinkSummon",
  "RitualSummon",
  "FlipSummon",
] as const;

export type TNamedSummonKindCauseReason = (typeof namedSummonKindCauseReasons)[number];
export const summonNameDic: { [key in TNamedSummonKindCauseReason]: string } = {
  FusionSummon: "融合召喚",
  SynchroSummon: "シンクロ召喚",
  XyzSummon: "エクシーズ召喚",
  PendulumSummon: "ペンデュラム召喚",
  LinkSummon: "リンク召喚",
  RitualSummon: "儀式召喚",
  FlipSummon: "反転召喚",
};
export const summonKindCauseReasons = [...namedSummonKindCauseReasons, "AdvanceSummon", "NormalSummon", "SpecialSummon"] as const;
export type TSummonKindCauseReason = (typeof summonKindCauseReasons)[number];
export const arrivalCauseReasons = [...summonKindCauseReasons, "Flip", "FlipSummon", "TokenBirth", "ComeBackAlive"] as const;
export type TArrivalCauseReason = (typeof arrivalCauseReasons)[number];

export const DestroyCauseReasons = ["Battle", "Effect", "Rule"] as const;
export type TDestroyCauseReason = (typeof DestroyCauseReasons)[number];
export const summonPosCauseReasons = ["AttackSummon", "SetSummon", "DefenseSummon"] as const;
export const posToSummonPos = (pos: TBattlePosition) => (pos + "Summon") as TSummonPosCauseReason;
export type TSummonPosCauseReason = (typeof summonPosCauseReasons)[number];
export const materialCauseReason = [
  "AdvanceSummonRelease",
  "SpecialSummonMaterial",
  "FusionMaterial",
  "SynchroMaterial",
  "LinkMaterial",
  "XyzMaterial",
  "RitualMaterial",
] as const;
export type TMaterialCauseReason = (typeof materialCauseReason)[number];
export type TDuelCauseReason =
  | TArrivalCauseReason
  | TSummonPosCauseReason
  | TMaterialCauseReason
  | TDestroyCauseReason
  | "Draw"
  | "Effect"
  | "Release"
  | "Cost"
  | "Discard"
  | "Rule"
  | "Spawn"
  | "SpellTrapSet"
  | "CardActivation"
  | "System"
  | "LostXyzOwner"
  | "LostEquipOwner"
  | "LostDestinyBond"
  | "SummonNegated"
  | "PutDirectly"
  | "Excavate"
  | "Destroy";

export const duelEntityCardTypes = ["Card", "Token"] as const;
export type TDuelEntityCardType = (typeof duelEntityCardTypes)[number];
export const duelEntityDammyTypes = ["Duelist", "Squatter"] as const;
export type TDuelEntityDammyType = (typeof duelEntityDammyTypes)[number];
export type TDuelEntityType = TDuelEntityCardType | TDuelEntityDammyType;
export type TDuelEntityInfoDetail = {
  name: string;
  entityType: TDuelEntityType;
  cardPlayList: Array<EntityAction<unknown>>;
};
export type TDuelEntityInfo = CardInfoDescription & TDuelEntityInfoDetail;

export const cardEntitySorter = (left: DuelEntity, right: DuelEntity): number => {
  return cardSorter(left.origin, right.origin);
};

export type SummonArg = { summoner: Duelist; monster: DuelEntity; pos: TBattlePosition; dest: DuelFieldCell };

export type MoveParameters = {
  to: DuelFieldCell;
  kind: "Monster" | "Spell" | "Trap" | "XyzMaterial";
  face: "FaceUp" | "FaceDown";
  orientation: TDuelEntityOrientation;
  pos: TDuelEntityMovePos;
  movedAs: TDuelCauseReason[];
  movedBy: DuelEntity | undefined;
  actionOwner: Duelist | undefined;
  chooser: Duelist | undefined;
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
    return new DuelEntity(duelist, hand, "Duelist", createDuelistEntityDefinition(duelist), "FaceUp", "Vertical");
  };
  public static readonly createCardEntity = (owner: Duelist, definition: EntityDefinition): DuelEntity => {
    // cardはデッキまたはEXデッキに生成
    const fieldCell =
      definition.staticInfo.monsterCategories && definition.staticInfo.monsterCategories.union(exMonsterCategories).length
        ? owner.getExtraDeck()
        : owner.getDeckCell();

    return new DuelEntity(owner, fieldCell, "Card", definition, "FaceDown", "Vertical");
  };
  public static readonly createTokenEntity = (owner: Duelist, createdBy: DuelEntity, definition: EntityDefinition): DuelEntity => {
    return new DuelEntity(owner, owner.duel.field.getWaitingRoomCell(), "Token", definition, "FaceUp", "Vertical", createdBy);
  };

  /**
   *
   * @param items
   * @param excludedList 再帰処理時のみ指定する想定
   */
  public static readonly moveMany = async (items: ({ entity: DuelEntity } & MoveParameters)[], excludedList?: DuelEntity[]): Promise<void> => {
    if (!items.length) {
      return;
    }

    const duel = items[0].entity.duel;

    // 除外対象を配列にしておく
    // TODO 不要かも？
    const entitiesWithAnimation = items
      .filter((item) => item.entity.cell !== item.to)
      .map((item) => item.entity)
      .filter((entity) => !(excludedList ?? []).includes(entity));
    const _excludedList = [...entitiesWithAnimation, ...duel.field.getCardsOnFieldStrictly().filter((entity) => entity.info.isDying)];

    // 目的地ごとに仕分ける
    const destMap = new Map<DuelFieldCell, ({ entity: DuelEntity } & MoveParameters)[]>();
    items.forEach(({ entity, to, kind, face, orientation, pos, ...rest }) => {
      // 状態によって、行き先や表裏の情報を書き換える。
      let _to = to;
      let _kind = kind;
      let _face = face;
      let _pos = pos;
      let _orientation = orientation;
      if (entity.status.willBeBanished) {
        _to = entity.owner.getBanished();
        _face = "FaceUp";
        _orientation = "Vertical";
      } else if (entity.status.willReturnToDeck) {
        _to = entity.isBelongTo;
        _face = "FaceDown";
        _pos = entity.status.willReturnToDeck;
        _orientation = "Vertical";
      } else if (
        entity.status.monsterCategories?.includes("Pendulum") &&
        entity.isOnField &&
        !entity.info.isPending &&
        entity.kind !== "XyzMaterial" &&
        entity.face === "FaceUp" &&
        to.isTrashCell
      ) {
        _to = entity.owner.getExtraDeck();
        _face = "FaceUp";
        _pos = "Top";
        _orientation = "Vertical";
      }
      if (_to.cellType === "ExtraDeck") {
        _pos = _face === "FaceUp" ? "Top" : "Bottom";
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
        if (entity.entityType === "Token") {
          _to = entity.field.getWaitingRoomCell();
        }
      }

      if (!_to.isMonsterZoneLikeCell) {
        _orientation = "Vertical";
      }

      destMap.set(_to, [{ entity, to: _to, kind: _kind, face: _face, orientation: _orientation, pos: _pos, ...rest }, ...(destMap.get(_to) ?? [])]);
    });

    // 取り出せなくなるまでループ
    while (true) {
      // 一つずつ取り出す
      const promises = Array.from(destMap.values())
        .map((array) => array.pop())
        .filter((e) => e !== undefined)
        .map((item) => item.entity._move(item));

      // 取り出せなくなったら終了
      if (!promises.length) {
        break;
      }

      // 取り出せたらアニメーションを全て待機
      await Promise.all(promises);

      // 新しく発生したものを検知し、あれば、全て墓地送り（※間接的な再帰実行）
      await DuelEntityShortHands.waitCorpseDisposal(duel, { excludedList: _excludedList });
    }

    // 色々更新処理
    DuelEntity.settleEntityMove(duel);
  };

  public static readonly summonMany = async (
    items: SummonArg[],
    summonKind: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    actionOwner: Duelist
  ): Promise<void> => {
    if (!items.length) {
      return;
    }

    const duel = actionOwner.duel;

    const movedAsDic: { [pos in TBattlePosition]: TDuelCauseReason } = {
      Attack: "AttackSummon",
      Defense: "DefenseSummon",
      Set: "SetSummon",
    };

    const promises = items
      .map<{ entity: DuelEntity; args: MoveParameters }>(({ monster: entity, dest: to, pos, summoner: chooser }) => {
        entity.info.summonKinds = [summonKind];
        if (summonKind === "NormalSummon" || summonKind === "AdvanceSummon") {
          entity.info.summonKinds.push("NormalSummon");
          const advance = summonKind === "AdvanceSummon" ? "アドバンス" : "";
          if (pos === "Attack") {
            entity.field.duel.log.info(`${entity.toString()}を${advance}召喚`, chooser);
          } else {
            entity.duel.log.info(`${entity.toString()}を${advance}セット`, chooser);
          }
          if (movedAs.includes("Rule")) {
            chooser.info.ruleNormalSummonCountQty++;
          } else {
            chooser.info.effectNormalSummonCountQty++;
          }
        } else {
          if (summonKind === "SpecialSummon") {
            entity.duel.log.info(`${entity.toString()}を${battlePositionDic[pos]}で特殊召喚`, chooser);
          } else {
            entity.info.summonKinds.push("SpecialSummon");
            entity.duel.log.info(`${entity.toString()}を${battlePositionDic[pos]}で${summonNameDic[summonKind]}！`, chooser);
          }
          chooser.info.specialSummonCountQty++;
        }
        entity.info.summonKinds = entity.info.summonKinds.getDistinct();

        // 召喚ターンには表示形式の変更ができない
        entity.info.battlePotisionChangeCount = 1;

        // 移動処理
        const { face, orientation } = DuelEntity.splitBattlePos(pos);

        // チェーンに乗らない召喚、特殊召喚は無効にされる可能性がある。
        if (movedAs.includes("Rule")) {
          entity.info.isPending = true;
        }
        return {
          entity,
          args: {
            to,
            kind: "Monster",
            face,
            orientation,
            pos: "Top",
            movedAs: [summonKind, movedAsDic[pos], ...movedAs],
            movedBy,
            actionOwner,
            chooser,
          },
        };
      })
      .map((item) => item.entity._move(item.args));

    await Promise.all(promises);

    // 召喚回数を加算
    items
      .map((item) => item.summoner)
      .forEach((duelist) => {
        if (summonKind === "NormalSummon" || summonKind === "AdvanceSummon") {
          if (movedAs.includes("Rule")) {
            duelist.info.ruleNormalSummonCount++;
          } else {
            duelist.info.effectNormalSummonCount++;
          }
        } else {
          duelist.info.specialSummonCount++;
        }
      });

    // 新しく発生したものを検知し、あれば、全て墓地送り（※間接的な再帰実行）
    await DuelEntityShortHands.waitCorpseDisposal(duel);
    // 色々更新処理
    DuelEntity.settleEntityMove(items[0].monster.duel);
  };

  /**
   *
   * @param items
   * @param excludedList 再帰処理時のみ指定する想定
   */
  public static readonly sendManyToGraveyard = (
    items: {
      entity: DuelEntity;
      movedAs: TDuelCauseReason[];
      movedBy: DuelEntity | undefined;
      activator: Duelist | undefined;
    }[],
    excludedList?: DuelEntity[]
  ): Promise<DuelEntity[]> => {
    return DuelEntity.bringManyToSameCell(
      "Graveyard",
      "Top",
      items.map((item) => {
        return { ...item, face: "FaceUp", orientation: "Vertical" };
      }),
      excludedList
    );
  };

  public static readonly bringManyToSameCell = async (
    to: TBundleCellType,
    pos: TDuelEntityMovePos,
    items: {
      entity: DuelEntity;
      face: TDuelEntityFace;
      orientation: TDuelEntityOrientation;
      movedAs: TDuelCauseReason[];
      movedBy: DuelEntity | undefined;
      activator: Duelist | undefined;
    }[],
    excludedList?: DuelEntity[]
  ) => {
    await DuelEntity.moveMany(
      items.map((item) => {
        return {
          ...item,
          to: item.entity.field.getCells(to).filter((cell) => cell.owner === item.entity.owner)[0],
          kind: item.entity.origin.kind,
          pos,
          chooser: item.activator,
          actionOwner: item.activator,
        };
      }),
      excludedList
    );
    return items.map((item) => item.entity).filter((entity) => entity.cell.cellType === to);
  };
  private static readonly settleEntityMove = (duel: Duel) => {
    duel.field.recalcLinkArrows();
    duel.field.distributeOperators(duel.clock);
    const entities = duel.field.getAllEntities().filter((entity) => entity.wasMovedAtCurrentProc);
    entities.filter((entity) => !entity.isOnFieldStrictly && !entity.info.isPending).forEach((entity) => entity.resetInfoIfLeavesTheField());
    entities
      .filter((entity) => entity.face === "FaceDown")
      .filter((entity) => entity.cell === entity.isBelongTo)
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

  public readonly seq: number;
  public readonly origin: EntityStatusBase;
  public readonly entityType: TDuelEntityType;
  public readonly summonFilterBundle: SummonFilterBundle;
  public readonly procFilterBundle: ProcFilterBundle;
  public readonly numericOprsBundle: NumericStateOperatorBundle;
  public readonly statusOperatorBundle: StatusOperatorBundle;
  public readonly damageFilterBundle: DamageFilterBundle;
  public readonly moveLog: EntityMoveLog;
  public readonly counterHolder: CounterHolder;
  public readonly parent: DuelEntity | undefined;
  public face: TDuelEntityFace;
  public get isUnderControl() {
    return this.face === "FaceUp" || deckCellTypes.every((t) => t !== this.cell.cellType);
  }

  public orientation: TDuelEntityOrientation;
  public get controller() {
    return this.cell.owner ?? this.owner;
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

  public cell: DuelFieldCell;

  private _status: Readonly<EntityStatus>;
  public get status() {
    return this._status;
  }
  public set status(newStatus) {
    this._status = { ...newStatus };
  }
  private _numericStatus: EntityNumericStatus;
  public get numericStatus() {
    return this._numericStatus;
  }
  private _info: DuelEntityInfomation;
  public get info() {
    return this._info;
  }

  public readonly actions: EntityAction<unknown>[] = [];
  public readonly immediatelyActions: ImmediatelyAction[] = [];
  public readonly continuousEffects: ContinuousEffect<unknown>[] = [];
  public readonly substituteEffects: SubstituteEffect[] = [];
  public readonly canBeReleased = <T>(
    activator: Duelist,
    causedBy: DuelEntity,
    causedAs: ("AdvanceSummonRelease" | "ReleaseAsCost" | "ReleaseAsEffect" | "RitualMaterial")[],
    action: EntityAction<T>
  ): boolean => !this.isInTrashCell && this.procFilterBundle.filter(causedAs, activator, causedBy, action, [this]);

  public readonly canBeSentToGraveyard = <T>(
    activator: Duelist,
    causedBy: DuelEntity,
    causedAs: "SendToGraveyardAsEffect" | "SendToGraveyardAsCost",
    action: EntityAction<T>
  ): boolean => !this.status.willBeBanished && !this.status.willReturnToDeck && this.procFilterBundle.filter([causedAs], activator, causedBy, action, [this]);

  public get kind() {
    return this.info.kind;
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
  public get linkArrows() {
    let _linkArrows = (this.origin.linkArrowKeys ?? []).map((key) => linkArrowDic[key].linkArrow);

    if (this.controller.seat === "Above") {
      _linkArrows = _linkArrows.map((origin) => {
        return { offsetColumn: origin.offsetColumn * -1, offsetRow: origin.offsetRow * -1 } as LinkArrow;
      });
    }

    return _linkArrows;
  }

  public get linkArrowDests() {
    if (!this.origin.monsterCategories?.includes("Link")) {
      return [];
    }
    if (!this.isOnFieldAsMonsterStrictly) {
      return [];
    }
    return this.linkArrows
      .map((ah) => [this.cell.row + ah.offsetRow, this.cell.column + ah.offsetColumn])
      .map(([row, column]) => this.field.cells[row][column])
      .filter((cell) => cell.isMonsterZoneLikeCell);
  }

  public get linkedEntities(): DuelEntity[] {
    if (!this.isOnFieldAsMonsterStrictly) {
      return [];
    }

    return [...this.linkArrowDests.map((cell) => cell.cardEntities[0]).map((monster) => monster), ...this.cell.linkArrowSources].getDistinct();
  }
  public get coLinkedEntities(): DuelEntity[] {
    if (!this.isOnFieldAsMonsterStrictly) {
      return [];
    }
    if (!this.origin.monsterCategories?.includes("Link")) {
      return [];
    }

    return this.linkArrowDests
      .map((cell) => cell.cardEntities[0])
      .filter((monster) => monster)
      .union(this.cell.linkArrowSources);
  }

  public get isEffective() {
    return this.status.isEffective && this.info.isEffectiveIn.includes(this.cell.cellType);
  }
  public get canBeSet() {
    return this.entityType === "Card" && !this.status.monsterCategories?.includes("Link");
  }

  /**
   * 現在無効状態だが、場所を変えれば有効になる
   */
  public get isEffectiveWeakly() {
    return this.status.isEffective;
  }
  public get battlePosition() {
    if (!this.isOnFieldStrictly) {
      return undefined;
    }
    if (this.kind !== "Monster") {
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
  public get wasMovedAtCurrentTurn() {
    return this.field.duel.clock.isSameTurn(this.moveLog.latestRecord.movedAt);
  }
  public get wasMovedAtCurrentChain() {
    return this.field.duel.clock.isSameChain(this.moveLog.latestRecord.movedAt);
  }
  public get wasMovedAtPreviousChain() {
    return this.field.duel.clock.isPreviousChain(this.moveLog.latestRecord.movedAt);
  }
  public get wasMovedAtPreviousTurn() {
    return this.field.duel.clock.isPreviousTurn(this.moveLog.latestRecord.movedAt);
  }
  public get wasMovedFrom() {
    return this.moveLog.previousPlaceRecord.cell;
  }

  public get isPendulumScale() {
    if (!this.origin.monsterCategories?.includes("Pendulum")) {
      return false;
    }

    if (!this.isOnField) {
      return false;
    }

    if (!this.cell.isSpellTrapZoneLikeCell) {
      return false;
    }
    if (this.status.spellCategory) {
      return false;
    }
    return true;
  }

  public get isOnField() {
    return this.cell.isPlayFieldCell;
  }
  public get isOnFieldStrictly() {
    return this.isOnField && !this.info.isPending && !this.info.isDying && this.kind !== "XyzMaterial";
  }
  public get isOnFieldAsMonsterStrictly() {
    // フィールド上の場合、モンスターゾーンにいればモンスターである。
    return this.cell.isMonsterZoneLikeCell && this.isOnFieldStrictly;
  }
  public get isMonster() {
    // カードの種類がモンスターであるか、モンスターゾーンにいればモンスターである。
    return this.isOnFieldAsMonsterStrictly || this.kind === "Monster";
  }
  public get isOnFieldAsSpellTrapStrictly() {
    // フィールド上の場合、モンスターゾーンにいたとしても罠カードの可能性街あるため、カードの種類で識別する。
    return this.isOnFieldStrictly && (this.kind === "Spell" || this.kind === "Trap");
  }
  public get isInTrashCell() {
    return this.cell.isTrashCell;
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
  private _exists = true;
  public get exist() {
    return this._exists;
  }

  public get allStickyEffectOperators() {
    return [...this.procFilterBundle.effectiveOperators, ...this.numericOprsBundle.effectiveOperators];
  }

  public get fusionMaterialInfos() {
    return this.definition.fusionMaterialInfos ?? [];
  }
  public readonly validateFusionMaterials = (entities: DuelEntity[]): boolean => {
    if (!this.definition.fusionMaterialInfos) {
      return false;
    }
    if (!this.definition.validateFusionMaterials) {
      return true;
    }
    return this.definition.validateFusionMaterials(entities);
  };

  private readonly definition: EntityDefinition;
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
    definition: EntityDefinition,
    face: TDuelEntityFace,
    orientation: TDuelEntityOrientation,
    parent?: DuelEntity
  ) {
    this.seq = DuelEntity.nextEntitySeq++;
    this.counterHolder = new CounterHolder(this);
    this.definition = definition;
    this.owner = owner;
    this.cell = fieldCell;
    this.entityType = entityType;
    this.parent = parent;
    this.origin = definition.staticInfo;
    this._status = JSON.parse(JSON.stringify(definition.staticInfo));
    this._numericStatus = JSON.parse(JSON.stringify(definition.staticInfo));
    this.resetStatusAll();
    this._info = {
      kind: this.origin.kind,
      isEffectiveIn: [...duelFieldCellTypes],
      attackDeclareCount: 0,
      battlePotisionChangeCount: 0,
      isDying: false,
      isPending: false,
      causeOfDeath: [],
      isKilledBy: undefined,
      isKilledByWhom: undefined,
      isVanished: false,
      isRebornable: true,
      isSettingSickness: false,
      summonKinds: [],
      materials: [],
      effectTargets: {},
      equipedBy: undefined,
      equipedAs: undefined,
      validateEquipOwner: () => true,
      equipEntities: [],
      xyzOwner: undefined,
      battleLog: [],
    };
    this.resetInfoAll();
    this.face = face;
    this.orientation = orientation;
    this.summonFilterBundle = new SummonFilterBundle(fieldCell.field.summonFilterPool, this);
    this.procFilterBundle = new ProcFilterBundle(fieldCell.field.procFilterPool, this);
    this.numericOprsBundle = new NumericStateOperatorBundle(fieldCell.field.numericStateOperatorPool, this);
    this.statusOperatorBundle = new StatusOperatorBundle(fieldCell.field.statusOperatorPool, this);
    this.damageFilterBundle = new DamageFilterBundle(fieldCell.field.damageFilterPool, this);
    this._exists = this.entityType === "Card";

    fieldCell.acceptEntities(this, "Top");
    this.moveLog = new EntityMoveLog(this);
    this.moveLog.pushForRuleAction(["Spawn"]);

    let continuousEffectBases: ContinuousEffectBase<unknown>[] = [];

    continuousEffectBases = definition.continuousEffects ?? [];
    this.substituteEffects.push(...(definition.substituteEffects ?? []).map((base) => SubstituteEffect.createNew(this, base)));

    if (this.origin.kind === "Monster" && this.entityType === "Card" && definition.summonFilter) {
      this.summonFilterBundle.push(
        new SummonFilter({
          title: "default",
          validateAlive: () => true,
          isContinuous: true,
          isSpawnedBy: this,
          actionAttr: {},
          isApplicableTo: () => true,
          summonKinds: summonKindCauseReasons,
          filter: definition.summonFilter,
        })
      );
    }
    if (definition.defaultStatus) {
      this.statusOperatorBundle.push(
        new StatusOperator({
          title: "default",
          validateAlive: () => true,
          isContinuous: true,
          isSpawnedBy: this,
          actionAttr: {},
          isApplicableTo: () => true,
          statusCalculator: () => definition.defaultStatus ?? {},
        })
      );
    }
    this.actions.push(...definition.actions.map((b) => EntityAction.createNew(this, b)));
    this.immediatelyActions.push(...(definition.immediatelyActions ?? []).map((def) => ImmediatelyAction.createNew(this, def)));
    this.continuousEffects.push(...continuousEffectBases.map((b) => ContinuousEffect.createNew(this, b)));
  }

  public readonly toString = () => {
    let result = this.nm;
    if (this.nm !== this.origin.name) {
      result = `${result}(${this.origin.name})`;
    }

    return this.entityType === "Card" ? `《${result}》` : result;
  };

  public readonly onUsedAsMaterial = (chainBlockInfo: ChainBlockInfo<unknown>, monster: DuelEntity) => {
    if (!this.definition.onUsedAsMaterial) {
      return;
    }

    this.definition.onUsedAsMaterial(this, chainBlockInfo, monster);
  };

  public readonly setBattlePosition = async (pos: TBattlePosition, movedAs: TDuelCauseReason[], movedBy?: DuelEntity, actionOwner?: Duelist): Promise<void> => {
    // ログテキストを準備
    let logText = `表示形式の変更：${this.toString()}（${this.battlePositionName}⇒${battlePositionDic[pos]}）`;
    const _movedAs = [...movedAs];

    // 反転召喚の判定
    if (this.battlePosition === "Set") {
      //反転召喚は無効にされる可能性がある。
      _movedAs.push("Flip");
      if (movedAs.includes("Rule")) {
        this.info.isPending = true;
        logText = `${this.toString()}を反転召喚`;
        this.info.summonKinds.push("FlipSummon");
        _movedAs.push("FlipSummon");
        _movedAs.push("AttackSummon");
      }
    }
    this.duel.log.info(logText, actionOwner);
    await this.moveAlone(
      this.cell,
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
    this.moveAlone(this.cell, kind, pos === "FaceUp" ? "FaceUp" : "FaceDown", "Vertical", "Top", movedAs, movedBy, actionOwner, actionOwner);
  };

  public readonly setAsSpellTrap = async (
    to: DuelFieldCell,
    kind: TCardKind,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    actionOwner: Duelist
  ): Promise<void> => {
    await this.moveAlone(to, kind, "FaceDown", "Vertical", "Top", [...movedAs, "SpellTrapSet"], movedBy, actionOwner, actionOwner);
  };
  public readonly activateSpellTrapFromHand = async (
    to: DuelFieldCell,
    kind: TCardKind,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    actionOwner: Duelist
  ): Promise<void> => {
    await this.moveAlone(to, kind, "FaceUp", "Vertical", "Top", [...movedAs, "CardActivation"], movedBy, actionOwner, actionOwner);
  };
  public readonly putDirectly = async (
    to: DuelFieldCell,
    kind: TCardKind,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    actionOwner: Duelist
  ): Promise<void> => {
    await this.moveAlone(to, kind, "FaceUp", "Vertical", "Top", [...movedAs, "PutDirectly"], movedBy, actionOwner, actionOwner);
  };

  public readonly activateSpellTrapOnField = async (kind: TCardKind, movedAs: TDuelCauseReason[], movedBy: DuelEntity, actionOwner: Duelist): Promise<void> => {
    await this.moveAlone(this.cell, kind, "FaceUp", "Vertical", "Top", [...movedAs, "CardActivation"], movedBy, actionOwner, actionOwner);
  };

  public readonly draw = async (movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, actionOwner: Duelist | undefined): Promise<DuelFieldCell> => {
    return await this.addToHand([...movedAs, "Draw"], movedBy, actionOwner);
  };
  public readonly addToHand = async (
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    actionOwner: Duelist | undefined
  ): Promise<DuelFieldCell> => {
    return await this.moveAlone(this.owner.getHandCell(), this.origin.kind, "FaceDown", "Vertical", "Bottom", [...movedAs], movedBy, actionOwner, actionOwner);
  };
  public readonly summon = (
    to: DuelFieldCell,
    pos: TBattlePosition,
    summonKind: TSummonKindCauseReason,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    actionOwner: Duelist,
    chooser?: Duelist
  ): Promise<void> => {
    return DuelEntity.summonMany([{ monster: this, dest: to, summoner: chooser ?? actionOwner, pos }], summonKind, movedAs, movedBy, actionOwner);
  };
  public readonly moveForcibly = async (
    to: DuelFieldCell,
    face: TDuelEntityFace,
    orientation: TDuelEntityOrientation,
    pos: TDuelEntityMovePos,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    actionOwner: Duelist
  ): Promise<void> => {
    await this.moveAlone(to, this.origin.kind, face, orientation, pos, ["Rule", ...movedAs], movedBy, actionOwner, actionOwner);
  };

  public readonly excavate = async (movedAs: TDuelCauseReason[], movedBy: DuelEntity, activator: Duelist) =>
    this.moveAlone(this.cell, this.kind, "FaceUp", this.orientation, "Fix", ["Excavate", ...movedAs], movedBy, activator, undefined);

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
  ): Promise<DuelFieldCell> => {
    await DuelEntity.moveMany([{ entity: this, to, kind, face, orientation, pos, movedAs, movedBy, actionOwner, chooser }], undefined);
    return this.cell;
  };

  public readonly determine = async () => {
    if (!this.info.isPending) {
      return;
    }
    this.info.isPending = false;
    this.moveLog.finalize();
    this.continuousEffects.forEach((ce) => ce.updateState());
    await this.fireImmediatelyActions();
    await DuelEntityShortHands.waitCorpseDisposal(this.duel);
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
  private readonly _move = async (args: MoveParameters): Promise<DuelFieldCell | undefined> => {
    if (!args.to) {
      // ミスで一回あったので念の為おいておく
      throw new Error("illegal argument: to");
    }

    const oldProps = { cell: this.cell, status: this.status, info: this.info };

    this.face = args.face;
    this.orientation = args.orientation;
    let appearFlg = false;

    /**
     * ログ上の移動主体
     */
    let logOwner = args.actionOwner;

    if (!logOwner && args.movedAs.includes("LostDestinyBond")) {
      console.log(this.toString(), this.info.equipedBy?.toString(), this.info.xyzOwner?.toString());
      // 道連れ元を失っての移動の場合、ログ上の移動主体を道連れ元の移動主体とする。
      const destinyBond = this.info.equipedBy ?? this.info.xyzOwner;
      if (destinyBond) {
        logOwner = destinyBond.moveLog.latestRecord.actionOwner;
      }
    }

    // 異なるセルに移動する場合
    if (args.to !== this.cell) {
      this.duel.log.pushMoveLog(logOwner, this, this.cell, args.to);
      if (this.cell.cellType === "WaitingRoom") {
        appearFlg = true;
      } else if (args.to.cellType === "WaitingRoom") {
        this._exists = false;
        // ★★★★★ 消滅アニメーション ★★★★★
        await this.duel.view.waitTokenAnimation();
      } else if (this.field.duel.clock.turn) {
        // ★★★★★ 移動アニメーション ★★★★★
        await this.field.duel.view.waitAnimation({ entity: this, to: args.to, index: args.pos, count: 0 });
      }
    }

    if (args.to !== this.cell || args.pos === "Random") {
      // セルから自分自身を取り除く
      this.cell.releaseEntities(this);

      // 場を離れる場合の処理
      if (this.cell.isPlayFieldCell && !args.to.isPlayFieldCell) {
        // カウンター類を全て除去
        this.counterHolder.clear();

        // 墓地送り予定情報を削除
        this.resetCauseOfDeath();
      }
      if ((this.cell.isMonsterZoneLikeCell && !args.to.isMonsterZoneLikeCell) || args.kind !== "Monster") {
        // 数値ステータスをリセット
        // FIXME 情報リセットを一箇所に集約する
        this.resetNumericStatus();
        this.info.isEffectiveIn.push(...playFieldCellTypes);

        // モンスターゾーンを離れる時の処理
        // 装備していたカードにマーキング
        this.info.equipEntities
          .filter((equip) => equip.isOnFieldAsSpellTrapStrictly)
          .forEach((equip) => {
            equip.info.isDying = true;
            equip.info.causeOfDeath = ["Rule", "Destroy", "LostEquipOwner", "LostDestinyBond"];
            this.controller.writeInfoLog(`装備対象${this.toString()}不在により${equip.toString()}は破壊された。`);
          });
        this.info.equipEntities = [];

        if (this.kind !== "XyzMaterial") {
          // XYZ素材にマーキング
          this.cell.xyzMaterials.forEach((material) => {
            material.info.isDying = true;
            material.info.causeOfDeath = ["LostXyzOwner", "LostDestinyBond"];
            this.controller.writeInfoLog(`${this.toString()}不在により、XYZ素材${material.toString()}は墓地に送られた。`);
          });
        }
      } else if (this.cell.cellType === "SpellAndTrapZone" && args.to.cellType !== "SpellAndTrapZone") {
        // 魔法罠を離れる時の処理
        // 装備解除
        // FIXME 情報リセットを一箇所に集約する
        this.info.equipedBy = undefined;
        this.info.equipedAs = undefined;
        this.info.isEffectiveIn.push(...playFieldCellTypes);
      }

      // セルに自分を所属させる
      args.to.acceptEntities(this, args.pos);

      if (appearFlg) {
        // FIXME 一度awaitを掛けないと、生成アニメーションが上手く行かない。
        await delay(1);
        this._exists = true;
        // ★★★★★ 生成アニメーション ★★★★★
        await this.duel.view.waitTokenAnimation();
      }
      // ★情報のリセット、再セット
      //    後処理は後続で行う
      if (args.to === this.isBelongTo || args.to.cellType === "Hand" || (args.to.cellType === "Banished" && this.face === "FaceDown")) {
        // FIXME 情報リセットを一箇所に集約する
        // 非公開情報になった場合、全ての情報をリセット
        this.counterHolder.clear();
        this.resetInfoAll();
        this.resetStatusAll();
      }
    }

    if ((this.isOnFieldStrictly && this.face === "FaceDown") || args.kind === "XyzMaterial") {
      // セット状態になった場合、またはエクシーズ素材になった場合。

      // 装備していたカードにマーキング
      this.info.equipEntities.forEach((equip) => {
        equip.info.isDying = true;
        equip.info.causeOfDeath = ["Rule", "Destroy", "LostEquipOwner", "LostDestinyBond"];
        this.controller.writeInfoLog(`装備対象${this.toString()}不在により${equip.toString()}は破壊された。`);
      });

      // カウンター類を除去
      this.counterHolder.removeAllWhenfaceDown();
      // 素材情報を削除
      this.info.materials = [];

      // 無効化状態を解除
      this.status = { ...this._status, isEffective: true };
      this.info.isEffectiveIn = [...duelFieldCellTypes];

      //ステータスをリセット
      this.resetNumericStatus();

      // セットしたターンに発動できない制約を付与
      this.info.isSettingSickness = this.kind === "Trap" || this.status.spellCategory === "QuickPlay";
    }
    this._info.kind = args.kind;
    // 移動ログ追加
    this.moveLog.push(args.kind, args.movedAs, args.movedBy, args.actionOwner, args.chooser);

    // 永続の即時実行処理
    await this.fireImmediatelyActions(oldProps);

    return args.to;
  };

  private readonly fireImmediatelyActions = async (
    oldProps?: Readonly<{
      status: Readonly<EntityStatus>;
      info: Readonly<DuelEntityInfomation>;
      cell: DuelFieldCell;
    }>
  ) => {
    for (const immdAct of [this, ...this.field.getCardsOnFieldStrictly()]
      .getDistinct()
      .filter((card) => card.immediatelyActions.length)
      .toSorted((left, right) => left.hadArrivedToFieldAt().totalProcSeq - right.hadArrivedToFieldAt().totalProcSeq)
      .flatMap((card) => card.immediatelyActions)) {
      await immdAct.execute(this, oldProps);
    }
  };

  public readonly initForTurn = () => {
    this.info.isSettingSickness = false;
    this.info.attackDeclareCount = 0;
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
      attackDeclareCount: 0,
      battlePotisionChangeCount: 0,
      materials: [],
      equipedBy: undefined,
      equipedAs: undefined,
      equipEntities: [],
    };

    this._info.isEffectiveIn.push(...playFieldCellTypes);
    this._info.isEffectiveIn.distinct();
  };

  private readonly resetInfoAll = () => {
    this._info = {
      kind: this.origin.kind,
      isDying: false,
      isPending: false,
      isEffectiveIn: [...duelFieldCellTypes],
      causeOfDeath: [],
      isKilledBy: undefined,
      isKilledByWhom: undefined,
      isVanished: false,
      isRebornable: this.origin.monsterCategories?.union(specialSummonMonsterCategories).length === 0,
      isSettingSickness: false,
      summonKinds: [],
      materials: [],
      effectTargets: {},
      attackDeclareCount: 0,
      battlePotisionChangeCount: 0,
      equipedBy: undefined,
      equipedAs: undefined,
      validateEquipOwner: () => true,
      equipEntities: [],
      xyzOwner: undefined,
      battleLog: [],
    };

    this.counterHolder.clear();
  };

  private readonly resetNumericStatus = () => {
    const master = entityFlexibleNumericStatusKeys.reduce(
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
    this.status = {
      ...this.origin,
      canBattlePositionChange: true,
      canAttack: true,
      canDirectAttack: false,
      canActivateEffect: true,
      isEffective: true,
      isFaithful: false,
      isSelectableForAttack: true,
      allowHandSynchro: false,
      allowHandLink: false,
      willBeBanished: false,
      willReturnToDeck: undefined,
      fusionSubstitute: false,
      maxCounterQty: {},
      piercingTo: [],
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

declare module "./DuelEntity" {
  interface DuelEntity {
    hasBeenArrivalNow(summonKinds: TArrivalCauseReason[], posList?: Readonly<TBattlePosition[]>, justNow?: boolean): boolean;
    getAttackTargets(): DuelEntity[];

    canBeEffected(activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionDefinitionAttrs>): boolean;
    canBeBanished(procType: TBanishProcType, activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionDefinitionAttrs>): boolean;
    canBeTargetOfEffect<T>(chainBlockInfo: ChainBlockInfoBase<T>): boolean;
    canBeTargetOfBattle(activator: Duelist, entity: DuelEntity): boolean;
    validateDestroy(destroyType: TDestroyCauseReason, activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionDefinitionAttrs>): boolean;
    getIndexInCell(): number;
    getXyzMaterials(): DuelEntity[];
    wasMovedAfter(clock: IDuelClock): boolean;
    hadArrivedToFieldAt(): IDuelClock;
    release(movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, movedByWhom: Duelist | undefined): Promise<DuelFieldCell | undefined>;
    ruleDestroy(): Promise<DuelFieldCell | undefined>;
    sendToGraveyard(movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, activator: Duelist | undefined): Promise<void>;
    discard(movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, activator: Duelist | undefined): Promise<void>;
    returnToDeck(pos: TDuelEntityMovePos, movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, activator: Duelist | undefined): Promise<void>;
    banish(movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, activator: Duelist | undefined): Promise<void>;
  }
  interface DuelEntityConstructor {
    isEmpty(value: string): boolean;
  }
}

DuelEntity.prototype.hasBeenArrivalNow = function (summonKinds, posList = faceupBattlePositions, justNow = false): boolean {
  const _posList = posList.map(posToSummonPos);
  const latestArrivalRecord = this.moveLog.latestArrivalRecord;
  if (!latestArrivalRecord) {
    return false;
  }
  if (!this.field.duel.clock.isPreviousChain(latestArrivalRecord.movedAt)) {
    return false;
  } else if (justNow && !this.field.duel.clock.isPreviousProc(latestArrivalRecord.movedAt)) {
    return false;
  }
  const movedAs = latestArrivalRecord.movedAs;
  if (!movedAs.union(summonKinds).length) {
    return false;
  }
  if (!movedAs.union(_posList).length) {
    return false;
  }
  return true;
};

DuelEntity.prototype.getAttackTargets = function (): DuelEntity[] {
  // ダイレクトアタックを阻害しうるモンスターを抽出
  const enemies = this.controller
    .getOpponentPlayer()
    .getMonstersOnField()
    .filter((enemy) => enemy.status.isSelectableForAttack);

  if (this.status.canDirectAttack || !enemies.length) {
    enemies.push(this.controller.getOpponentPlayer().entity);
  }

  // 自分、相手ともにフィルタリングが必要。
  return enemies
    .filter((enemy) => enemy.canBeTargetOfBattle(this.controller, this))
    .filter((enemy) => this.procFilterBundle.filter(["BattleTarget"], this.controller, this, {}, [enemy]));
};

DuelEntity.prototype.canBeEffected = function (activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionDefinitionAttrs>): boolean {
  return this.procFilterBundle.filter(["Effect"], activator, causedBy, action, [this]);
};

const _canBeDoneSomethingByEffect = (
  entity: DuelEntity,
  procType: TProcType,
  activator: Duelist,
  causedBy: DuelEntity,
  action: Partial<CardActionDefinitionAttrs>
): boolean => entity.canBeEffected(activator, causedBy, action) && entity.procFilterBundle.filter([procType], activator, causedBy, action, [entity]);

DuelEntity.prototype.canBeTargetOfEffect = function <T>(chainBlockInfo: ChainBlockInfoBase<T>): boolean {
  return this.procFilterBundle.filter(["EffectTarget"], chainBlockInfo.activator, chainBlockInfo.action.entity, chainBlockInfo.action, [this]);
};

DuelEntity.prototype.canBeBanished = function (
  procType: TBanishProcType,
  activator: Duelist,
  causedBy: DuelEntity,
  action: Partial<CardActionDefinitionAttrs>
): boolean {
  if (this.cell.cellType === "Banished") {
    return false;
  }
  return _canBeDoneSomethingByEffect(this, procType, activator, causedBy, action);
};

DuelEntity.prototype.canBeTargetOfBattle = function (activator: Duelist, causedBy: DuelEntity): boolean {
  return this.procFilterBundle.filter(["BattleTarget"], activator, causedBy, {}, [this]);
};

DuelEntity.prototype.validateDestroy = function (
  destroyType: "Battle" | "Effect",
  activator: Duelist,
  causedBy: DuelEntity,
  action: Partial<CardActionDefinitionAttrs>
): boolean {
  let flg = this.procFilterBundle.filter([destroyType === "Battle" ? "BattleDestroy" : "EffectDestroy"], activator, causedBy, action ?? {}, [this]);

  if (flg && destroyType === "Effect") {
    flg = this.canBeEffected(activator, causedBy, action);
  }

  return flg;
};

DuelEntity.prototype.getIndexInCell = function (): number {
  const entity = this as DuelEntity;

  if (entity.info.isVanished) {
    return -1;
  }

  const index = entity.cell.cardEntities.indexOf(entity);

  if (index < 0) {
    throw new SystemError("エンティティとセルの状態が矛盾している。", [entity, entity.cell]);
  }

  return index;
};

DuelEntity.prototype.getXyzMaterials = function (): DuelEntity[] {
  const entity = this as DuelEntity;

  return (entity.status.monsterCategories ?? []).includes("Xyz") ? entity.cell.xyzMaterials : [];
};
DuelEntity.prototype.wasMovedAfter = function (clock: IDuelClock): boolean {
  return this.moveLog.latestRecord.movedAt.totalProcSeq > clock.totalProcSeq;
};

DuelEntity.prototype.hadArrivedToFieldAt = function (): IDuelClock {
  let result = this.moveLog.latestRecord.movedAt;
  this.moveLog.records.findLast((record) => {
    if (!record.cell.isPlayFieldCell) {
      return true;
    }
    if (record.isPending) {
      return true;
    }
    if (record.kind !== this.kind) {
      return true;
    }
    if (record.face === "FaceDown") {
      return true;
    }

    result = record.movedAt;
    return false;
  });
  return result;
};

DuelEntity.prototype.release = async function (
  movedAs: TDuelCauseReason[],
  movedBy: DuelEntity | undefined,
  movedByWhom: Duelist | undefined
): Promise<DuelFieldCell | undefined> {
  await this.sendToGraveyard([...movedAs, "Release"], movedBy, movedByWhom);
  return this.info.isVanished ? undefined : this.cell;
};
DuelEntity.prototype.ruleDestroy = async function (): Promise<DuelFieldCell | undefined> {
  await this.sendToGraveyard(["Rule", "Destroy"], undefined, undefined);
  return this.info.isVanished ? undefined : this.cell;
};

DuelEntity.prototype.sendToGraveyard = async function (
  movedAs: TDuelCauseReason[],
  movedBy: DuelEntity | undefined,
  activator: Duelist | undefined
): Promise<void> {
  await DuelEntityShortHands.sendManyToGraveyardForTheSameReason([this], movedAs, movedBy, activator);
};
DuelEntity.prototype.discard = async function (movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, activator: Duelist | undefined): Promise<void> {
  await DuelEntityShortHands.discardManyForTheSameReason([this], movedAs, movedBy, activator);
};
DuelEntity.prototype.returnToDeck = async function (
  pos: TDuelEntityMovePos,
  movedAs: TDuelCauseReason[],
  movedBy: DuelEntity | undefined,
  activator: Duelist | undefined
): Promise<void> {
  await DuelEntityShortHands.returnManyToDeckForTheSameReason(pos, [this], movedAs, movedBy, activator);
};
DuelEntity.prototype.banish = async function (movedAs: TDuelCauseReason[], movedBy: DuelEntity | undefined, activator: Duelist | undefined): Promise<void> {
  await DuelEntityShortHands.banishManyForTheSameReason([this], movedAs, movedBy, activator);
};

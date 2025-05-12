import { StkEvent } from "../../stk_utils/class/StkEvent";
import { SystemError } from "./Duel";
import { duelEntityCardTypes, duelEntityDammyTypes } from "./DuelEntity";
import type { DuelEntity } from "./DuelEntity";
import type { DuelField } from "./DuelField";
import { type Duelist } from "./Duelist";
export const deckCellTypes = ["Deck", "ExtraDeck"] as const;
export const trashCellTypes = ["Graveyard", "Banished"] as const;
export const stackCellTypes = [...deckCellTypes, ...trashCellTypes] as const;
export const bundleCellTypes = [...stackCellTypes, "Hand"] as const;
export type TBundleCellType = (typeof bundleCellTypes)[number];
export const monsterZoneCellTypes = ["MonsterZone", "ExtraMonsterZone"] as const;
export const spellTrapZoneCellTypes = ["SpellAndTrapZone", "FieldSpellZone"] as const;
/**
 * fieldCellTypesとしたいが、フィールドゾーンと誤解する可能性が高いので一旦playとつけておく
 */
export const playFieldCellTypes = [...monsterZoneCellTypes, ...spellTrapZoneCellTypes] as const;
export const disabledCellTypes = ["XyzMaterialZone", "WaitingRoom"] as const;
export const duelFieldCellTypes = [...bundleCellTypes, ...playFieldCellTypes, ...disabledCellTypes] as const;
export type DuelFieldCellType = (typeof duelFieldCellTypes)[number];
export type TDuelEntityMovePos = "Top" | "Bottom" | "Random" | "Fix";

export const cellTypeMaster = {
  0: {
    0: "Hand",
  },
  1: {
    0: "Deck",
    1: "SpellAndTrapZone",
    2: "SpellAndTrapZone",
    3: "SpellAndTrapZone",
    4: "SpellAndTrapZone",
    5: "SpellAndTrapZone",
    6: "ExtraDeck",
  },
  2: {
    0: "Graveyard",
    1: "MonsterZone",
    2: "MonsterZone",
    3: "MonsterZone",
    4: "MonsterZone",
    5: "MonsterZone",
    6: "FieldSpellZone",
  },
  3: {
    0: "Banished",
    1: "XyzMaterialZone",
    2: "ExtraMonsterZone",
    3: "WaitingRoom",
    4: "ExtraMonsterZone",
    5: "XyzMaterialZone",
    6: "Banished",
  },
  4: {
    0: "FieldSpellZone",
    1: "MonsterZone",
    2: "MonsterZone",
    3: "MonsterZone",
    4: "MonsterZone",
    5: "MonsterZone",
    6: "Graveyard",
  },
  5: {
    0: "ExtraDeck",
    1: "SpellAndTrapZone",
    2: "SpellAndTrapZone",
    3: "SpellAndTrapZone",
    4: "SpellAndTrapZone",
    5: "SpellAndTrapZone",
    6: "Deck",
  },
  6: {
    0: "Hand",
  },
} as { [row: number]: { [column: number]: DuelFieldCellType } };
export class DuelFieldCell {
  private onUpdateEvent = new StkEvent<void>();
  public get onUpdate() {
    return this.onUpdateEvent.expose();
  }
  public readonly field: DuelField;
  public readonly row: number;
  public readonly column: number;
  public readonly cellType: DuelFieldCellType;
  private readonly _owner: Duelist | undefined;
  public get owner() {
    return this._owner || this.cardEntities[0]?.owner;
  }
  private _requiresRecalcLinkArrows: boolean;
  public get requiresRecalcLinkArrows() {
    return this._requiresRecalcLinkArrows;
  }

  private _linkArrowSources: DuelEntity[];
  public get linkArrowSources() {
    return this._linkArrowSources;
  }
  public get needsShuffle() {
    return this._needsShuffle;
  }
  private _needsShuffle = false;
  public get entities() {
    return this._entities;
  }
  public get visibleEntities() {
    return this._entities.filter((e) => duelEntityCardTypes.find((t) => t === e.entityType));
  }
  public get cardEntities() {
    return this._entities.filter((e) => duelEntityCardTypes.find((t) => t === e.entityType)).filter((e) => e.kind !== "XyzMaterial");
  }
  public get xyzMaterials() {
    return this._entities.filter((e) => e.kind === "XyzMaterial");
  }
  public get targetForAttack() {
    return this.cellType === "Hand" ? this._entities.find((e) => e.entityType === "Duelist") : this.cardEntities[0];
  }
  public get isAvailable() {
    return this.cardEntities.length === 0 && this._entities.filter((e) => duelEntityDammyTypes.find((t) => t === e.entityType)).length === 0;
  }

  public get isAvailableForPendulum() {
    return this.isAvailable && this.isSpellTrapZoneLikeCell && (this.column === 1 || this.column === 5);
  }

  public get isStackCell() {
    return stackCellTypes.some((t) => t === this.cellType);
  }

  public get isPlayFieldCell() {
    return playFieldCellTypes.some((t) => t === this.cellType);
  }
  public get isMonsterZoneLikeCell() {
    return monsterZoneCellTypes.some((t) => t === this.cellType);
  }
  public get isSpellTrapZoneLikeCell() {
    return spellTrapZoneCellTypes.some((t) => t === this.cellType);
  }
  public get isDisabledCell() {
    return disabledCellTypes.some((t) => t === this.cellType);
  }
  public get isTrashCell() {
    return trashCellTypes.some((t) => t === this.cellType);
  }
  public get neighbors() {
    const rows = [this.row - 1, this.row, this.row + 1].filter((row) => row >= 0 && row <= 6);
    const columns = [this.column - 1, this.column, this.column + 1].filter((column) => column >= 0 && column <= 6);
    return rows
      .flatMap((row) => columns.map((column) => this.field.cells[row][column]))
      .filter((cell) => cell.isMonsterZoneLikeCell)
      .filter((cell) => cell !== this);
  }
  public readonly recalcLinkArrows = () => {
    if (!this.isMonsterZoneLikeCell) {
      return;
    }
    this._requiresRecalcLinkArrows = false;

    this._linkArrowSources = this.neighbors
      .filter((cell) => cell.isMonsterZoneLikeCell)
      .filter((cell) => cell.cardEntities.length)
      .filter((cell) => cell.cardEntities[0].linkArrows.some((ah) => this.row === cell.row + ah.offsetRow && this.column === cell.column + ah.offsetColumn))
      .map((cell) => cell.cardEntities[0]);
  };
  private _entities: DuelEntity[];
  public constructor(duelField: DuelField, row: number, column: number, owner?: Duelist) {
    this.field = duelField;
    this.row = row;
    this.column = column;
    this.cellType = cellTypeMaster[row][column];
    this._owner = owner;
    this._entities = [];
    this._linkArrowSources = [];
    this._requiresRecalcLinkArrows = false;
  }
  public readonly releaseEntities = (entity: DuelEntity): DuelEntity => {
    this._entities = this._entities.filter((e) => e !== entity);
    if (this.isMonsterZoneLikeCell && entity.origin.monsterCategories?.includes("Link")) {
      this._requiresRecalcLinkArrows = true;
    }

    this.onUpdateEvent.trigger();
    return entity;
  };
  public readonly acceptEntities = (entity: DuelEntity, pos: TDuelEntityMovePos) => {
    if (pos === "Fix") {
      if (!this._entities.includes(entity)) {
        throw new SystemError("引数とセルの状態が矛盾している。", this, entity, pos);
      }
    } else {
      if (pos === "Top") {
        this._entities.unshift(entity);
      } else {
        this._entities.push(entity);
      }

      if (pos === "Random") {
        console.log(this._needsShuffle, pos);
        this._needsShuffle = true;
      }
      this._entities.forEach((entity) => {
        entity.fieldCell = this;
      });

      if (this.isMonsterZoneLikeCell && entity.origin.monsterCategories?.includes("Link")) {
        this._requiresRecalcLinkArrows = true;
      }
    }
    this.onUpdateEvent.trigger();
  };
  public readonly shuffle = (): void => {
    this._entities = this.entities.shuffle();
    this._needsShuffle = false;
    this.field.duel.log.info(`デッキをシャッフル。`, this.owner);
  };
  public readonly toString = (): string => {
    if (this.isMonsterZoneLikeCell || this.cellType === "SpellAndTrapZone") {
      return `${this.cellType}(${this.row},${this.column})`;
    }

    return this.cellType;
  };
}

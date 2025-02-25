import StkEvent from "../../stk_utils/class/StkEvent";
import { duelEntityCardTypes, type TDuelCauseReason } from "./DuelEntity";
import type { DuelEntity } from "./DuelEntity";
import type { DuelField } from "./DuelField";
import type Duelist from "./Duelist";
export type DuelFieldCellType =
  | "Hand"
  | "Deck"
  | "MonsterZone"
  | "SpellAndTrapZone"
  | "Graveyard"
  | "FieldSpellZone"
  | "ExtraDeck"
  | "ExtraMonsterZone"
  | "Banished"
  | "PhaseButton"
  | "Disable";
type TDuelEntityPos = "Top" | "Bottom";

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
    1: "Disable",
    2: "ExtraMonsterZone",
    3: "Disable",
    4: "ExtraMonsterZone",
    5: "PhaseButton",
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
  public readonly owner: Duelist | undefined;
  public get entities() {
    return this._entities;
  }
  public get cardEntities() {
    return this._entities.filter((e) => duelEntityCardTypes.find((t) => t === e.entityType));
  }
  public get targetForAttack() {
    return this.cellType === "Hand" ? this._entities.find((e) => e.entityType === "Duelist") : this.cardEntities[0];
  }
  public get isAvailable() {
    return this._entities.length === 0;
  }
  private _entities: DuelEntity[];
  public constructor(duelField: DuelField, row: number, column: number, owner?: Duelist) {
    this.field = duelField;
    this.row = row;
    this.column = column;
    this.cellType = cellTypeMaster[row][column];
    this.owner = owner;
    this._entities = [];
  }
  public readonly releaseEntities = (entities: DuelEntity[], movedAs: TDuelCauseReason[], cousedBy?: DuelEntity): DuelEntity[] => {
    this._entities = this._entities.filter((e) => !entities.includes(e));
    entities.forEach((entity) => {
      entity.movedAs.splice(0);
      entity.movedAs.push(...new Set(movedAs));
      entity.movedAt = entity.field.duel.procKey;
      entity.movedBy = cousedBy;
      entity.movedFrom = this;
    });
    this.onUpdateEvent.trigger();
    return entities;
  };
  public readonly acceptEntities = (entities: DuelEntity[], pos: TDuelEntityPos) => {
    if (pos === "Bottom") {
      this._entities.push(...entities);
    } else if (pos === "Top") {
      this._entities.unshift(...entities);
    }
    this._entities.forEach((entity) => {
      entity.fieldCell = this;
    });
    this.onUpdateEvent.trigger();
  };
  public readonly shuffle = (): void => {
    this._entities = this.entities.shuffle();
  };
}

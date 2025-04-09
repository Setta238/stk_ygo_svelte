import { Duel, DuelEnd, SystemError } from "./Duel";
import { type TDuelCauseReason, DuelEntity } from "@ygo_duel/class/DuelEntity";

import { type Duelist } from "./Duelist";
import {} from "@stk_utils/funcs/StkArrayUtils";
import { cellTypeMaster, DuelFieldCell, monsterZoneCellTypes, playFieldCellTypes, type DuelFieldCellType } from "./DuelFieldCell";
import { ProcFilterPool } from "../class_continuous_effect/DuelProcFilter";
import { NumericStateOperatorPool } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { CardRelationPool } from "@ygo_duel/class_continuous_effect/DuelCardRelation";
import { StatusOperatorPool } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
export class DuelField {
  public readonly cells: DuelFieldCell[][];
  public readonly duel: Duel;
  public readonly procFilterPool: ProcFilterPool;
  public readonly numericStateOperatorPool: NumericStateOperatorPool;
  public readonly cardRelationPool: CardRelationPool;
  public readonly statusOperatorPool: StatusOperatorPool;
  public constructor(duel: Duel) {
    this.duel = duel;
    this.cells = [...Array(7)].map(() => []) as DuelFieldCell[][];
    for (const row of Object.keys(cellTypeMaster).map(Number)) {
      for (const column of Object.keys(cellTypeMaster[row]).map(Number)) {
        this.cells[row][column] = new DuelFieldCell(
          this,
          row,
          column,
          row < 3 ? duel.duelists.Above : row > 3 ? duel.duelists.Below : column < 2 ? duel.duelists.Above : column > 4 ? duel.duelists.Below : undefined
        );
      }
    }
    this.procFilterPool = new ProcFilterPool();
    this.numericStateOperatorPool = new NumericStateOperatorPool();
    this.cardRelationPool = new CardRelationPool();
    this.statusOperatorPool = new StatusOperatorPool();
  }

  public readonly getAllCells = (): DuelFieldCell[] => {
    return this.cells.flat();
  };

  public readonly getCells = (...cellTypeList: Readonly<DuelFieldCellType[]>): DuelFieldCell[] => {
    return this.getAllCells().filter((cell) => cellTypeList.includes(cell.cellType));
  };
  public readonly getAllEntities = (): DuelEntity[] => {
    return this.getAllCells()
      .map((cell) => cell.entities)
      .flat();
  };
  public readonly getAllCardEntities = (): DuelEntity[] => {
    return this.getAllCells()
      .map((cell) => cell.cardEntities)
      .flat();
  };
  public readonly getMonstersOnField = (): DuelEntity[] => {
    return this.getCells(...monsterZoneCellTypes)
      .map((cell) => cell.cardEntities)
      .filter((entities) => entities.length > 0)
      .map((entities) => entities[0]);
  };
  public readonly getEntiteisOnField = (): DuelEntity[] => {
    return this.getCells(...playFieldCellTypes)
      .map((cell) => cell.entities)
      .filter((entities) => entities.length > 0)
      .map((entities) => entities[0]);
  };
  public readonly getEntities = (duelist: Duelist): DuelEntity[] => {
    return this.getAllEntities().filter((entity) => entity.controller === duelist);
  };

  public readonly drawAtSameTime = async (
    duelist1: Duelist,
    times1: number,
    duelist2: Duelist,
    times2: number,
    causedBy: DuelEntity,
    causedByWhome: Duelist
  ): Promise<void> => {
    const winners: Duelist[] = [];
    const errors: unknown[] = [];

    const promises = [duelist1.draw(times1, causedBy, causedByWhome), duelist2.draw(times2, causedBy, causedByWhome)].map((p) =>
      p.catch((reason) => {
        if (reason instanceof DuelEnd) {
          if (reason.winner) {
            winners.push(reason.winner);
          }
        } else {
          errors.push(reason);
        }
      })
    );

    await Promise.all(promises);

    if (errors.length) {
      throw new SystemError("ドロー処理で想定されない例外が発生した。", duelist1, times1, duelist2, times2, causedBy, ...errors);
    }

    if (winners.length === 0) {
      return;
    }

    if (winners.length === 1) {
      throw new DuelEnd(winners[0]);
    }

    throw new DuelEnd();
  };

  public readonly sendToGraveyard = async (
    msg: string,
    chooser: Duelist,
    choices: DuelEntity[],
    qty: number,
    validator: (entites: DuelEntity[]) => boolean,
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    cancelable?: boolean
  ) => {
    if (qty > 0 && choices.length < qty) {
      return;
    }
    const targets: DuelEntity[] | undefined = await this.duel.view.waitSelectEntities(chooser, choices, qty, validator, msg, cancelable);

    if (!targets) {
      return;
    }

    await DuelEntity.sendManyToGraveyard(
      targets.map((target) => {
        return {
          entity: target,
          causedAs: moveAs,
          causedBy: causedBy,
          activator: chooser,
        };
      })
    );

    this.duel.log.info(`${targets.map((e) => e.status.name).join(", ")}を墓地に送った（${moveAs.getDistinct().join(", ")}）。`, chooser);
    return targets;
  };
}

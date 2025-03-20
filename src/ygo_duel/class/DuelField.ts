import { Duel, DuelEnd, SystemError } from "./Duel";
import { type TDuelCauseReason, DuelEntity } from "@ygo_duel/class/DuelEntity";

import { type Duelist } from "./Duelist";
import {} from "@stk_utils/funcs/StkArrayUtils";
import { cellTypeMaster, DuelFieldCell, monsterZoneCellTypes, playFieldCellTypes, type DuelFieldCellType } from "./DuelFieldCell";
import { CardAction } from "./DuelCardAction";
import { ProcFilterPool } from "../class_continuous_effect/DuelProcFilter";
import { NumericStateOperatorPool } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
export class DuelField {
  public readonly cells: DuelFieldCell[][];
  public readonly duel: Duel;
  public readonly procFilterPool: ProcFilterPool;
  public readonly numericStateOperatorPool: NumericStateOperatorPool;
  public constructor(duel: Duel) {
    this.duel = duel;
    this.cells = [...Array(7)].map(() => []) as DuelFieldCell[][];
    for (const row of Object.keys(cellTypeMaster).map(Number)) {
      for (const column of Object.keys(cellTypeMaster[row]).map(Number)) {
        this.cells[row][column] = new DuelFieldCell(
          this,
          row,
          column,
          row < 3 ? duel.duelists.Above : row > 3 ? duel.duelists.Below : column === 0 ? duel.duelists.Above : column === 6 ? duel.duelists.Below : undefined
        );
      }
    }
    this.procFilterPool = new ProcFilterPool();
    this.numericStateOperatorPool = new NumericStateOperatorPool();
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
      .map((cell) => cell.cardEntities)
      .filter((entities) => entities.length > 0)
      .map((entities) => entities[0]);
  };
  public readonly getEntities = (duelist: Duelist): DuelEntity[] => {
    return this.getAllEntities().filter((entity) => entity.controller === duelist);
  };

  /**
   *
   * @param items
   * @param excludedList 再帰処理時のみ指定する想定
   */
  public readonly sendGraveyardAtSameTime = async (
    items: {
      entity: DuelEntity;
      cousedAs: TDuelCauseReason[];
      causedBy: DuelEntity | undefined;
      activator: Duelist | undefined;
    }[],
    excludedList: DuelEntity[] = []
  ): Promise<void> => {
    // 対象を配列にしておく
    const targets = items.map((item) => item.entity).filter((entity) => !excludedList.includes(entity));
    const _excludedList = [...targets, ...this.duel.field.getEntiteisOnField().filter((entity) => entity.info.isDying)];
    console.log(targets);
    // 目的地ごとに仕分ける
    const destMap: Map<DuelFieldCell, DuelEntity[]> = new Map<DuelFieldCell, DuelEntity[]>();
    targets.forEach((target) => {
      let dest = target.owner.getGraveyard();
      if (target.info.willBeBanished) {
        dest = target.owner.getBanished();
      }
      if (target.info.willReturnToDeck) {
        dest = target.isBelongTo;
      }
      destMap.set(dest, [target, ...(destMap.get(dest) ?? [])]);
    });

    // 取り出せなくなるまでループ
    while (true) {
      // 一つずつ取り出す
      const promises = Array.from(destMap.values())
        .map((array) => array.pop())
        .filter((e) => e !== undefined)
        .map((target) => target.sendToGraveyard(target.info.causeOfDeath, target.info.isKilledBy, target.info.isKilledByWhom));

      // 取り出せなくなったら終了
      if (!promises.length) {
        break;
      }

      // 取り出せたらアニメーションを全て待機
      await Promise.all(promises);

      // 新しく発生したものを検知（※ここまでのどこかで対象だったものを除く）
      const newTargets = this.duel.field
        .getEntiteisOnField()
        .filter((entity) => entity.info.isDying)
        .filter((newOne) => !_excludedList.includes(newOne))
        .map((newOne) => {
          return {
            entity: newOne,
            cousedAs: newOne.info.causeOfDeath ?? [],
            causedBy: newOne.info.isKilledBy,
            activator: newOne.info.isKilledByWhom,
          };
        });

      // 新しく発生したものがあれば、再帰実行
      if (newTargets.length) {
        await this.sendGraveyardAtSameTime(newTargets, _excludedList);
      }
    }
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

  public readonly waitCorpseDisposal = () => {
    return this.duel.field.sendGraveyardAtSameTime(
      this.duel.field
        .getEntiteisOnField()
        .filter((entity) => entity.info.isDying)
        .map((entity) => {
          return {
            entity: entity,
            cousedAs: entity.info.causeOfDeath ?? [],
            causedBy: entity.info.isKilledBy,
            activator: entity.info.isKilledByWhom,
          };
        })
    );
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
    const target: DuelEntity[] | undefined = await this.duel.view.waitSelectEntities(chooser, choices, qty, validator, msg, cancelable);

    if (!target) {
      return;
    }

    for (const entity of target) {
      await entity.sendToGraveyard(moveAs, causedBy, chooser);
    }

    this.duel.log.info(`${target.map((e) => e.status.name).join(", ")}を墓地に送った（${moveAs.getDistinct().join(", ")}）。`, chooser);
    return target;
  };

  public readonly release = async (
    chooser: Duelist,
    choices: DuelEntity[],
    qty: number,
    by: "Cost" | "Effect",
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    allowZero?: boolean,
    cancelable?: boolean
  ): Promise<DuelEntity[] | undefined> => {
    if (qty > 0 && choices.length < qty) {
      return;
    }
    const target: DuelEntity[] | undefined = await this.duel.view.waitSelectEntities(
      chooser,
      choices,
      qty,
      (selected) => (allowZero || selected.length > 0) && (qty < 0 || selected.length === qty),
      "リリースするモンスターを選択",
      cancelable
    );

    if (!target) {
      return;
    }

    const entities: DuelEntity[] = [];
    for (const entity of target) {
      await entity.release(["Release", by, ...moveAs], causedBy, chooser);
      entities.push(entity);
    }

    this.duel.log.info(
      `${entities.map((e) => e.status.name).join(", ")}をリリース（${[...new Set(entities.flatMap((e) => e.wasMovedAs))].join(", ")}）。`,
      chooser
    );
    return entities;
  };

  public readonly activateSpellTrapFromHand = async (
    entity: DuelEntity,
    selectableCells: DuelFieldCell[],
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    chooser?: Duelist,
    cancelable: boolean = false
  ): Promise<DuelEntity | undefined> => {
    const _chooser = chooser ?? causedBy?.controller ?? entity.controller;
    let cell: DuelFieldCell = selectableCells.randomPick(1)[0];
    if (selectableCells.length > 1) {
      if (_chooser.duelistType !== "NPC") {
        const dammyActions = [CardAction.createDammyAction(entity, "カードの発動", selectableCells, undefined)];
        this.duel.view.modalController.selectAction(this.duel.view, {
          title: "カードを魔法罠ゾーンへドラッグ",
          actions: dammyActions as CardAction<unknown>[],
          cancelable: false,
        });
        const dAct = await this.duel.view.waitSubAction(_chooser, dammyActions as CardAction<unknown>[], "カードを魔法罠ゾーンへドラッグ。", cancelable);
        const action = dAct.action;
        if (!action && !cancelable) {
          throw new SystemError("", dAct);
        }
        if (!action) {
          return;
        }
        cell = action.cell || cell;
      }
    }

    await entity.activateSpellTrapFromHand(cell, moveAs, causedBy, _chooser);

    return entity;
  };
  public readonly setSpellTrap = async (
    entity: DuelEntity,
    cells: DuelFieldCell[],
    causedBy?: DuelEntity,
    chooser?: Duelist,
    cancelable: boolean = false
  ): Promise<DuelFieldCell | undefined> => {
    let targetCell = cells[0];

    const _chooser = chooser ?? causedBy?.controller ?? entity.controller;
    if (cells.length > 1) {
      if (_chooser.duelistType !== "NPC") {
        const dammyActions = [CardAction.createDammyAction(entity, "セット", cells)];
        const actionPromise = this.duel.view.modalController.selectAction(this.duel.view, {
          title: "カードをセット先へドラッグ",
          actions: dammyActions as CardAction<unknown>[],
          cancelable: cancelable,
        });
        const responsePromise = this.duel.view.waitSubAction(_chooser, dammyActions as CardAction<unknown>[], "カードをセット先へドラッグ", cancelable);

        const action = await Promise.any([actionPromise, responsePromise.then((res) => res.action)]);

        if (!action && !cancelable) {
          throw new SystemError("", action);
        }
        if (!action) {
          return;
        }
        targetCell = action.cell || targetCell;
      }
    }
    await entity.setAsSpellTrap(targetCell, ["SpellTrapSet"], causedBy, _chooser);
    this.duel.log.info(`${entity.status.name}をセット（${"SpellTrapSet"}）。`, chooser ?? causedBy?.controller ?? entity.controller);
    return targetCell;
  };
}

import { Duel, DuelEnd, SystemError, type TSeat } from "./Duel";
import { type TDuelCauseReason, type TSummonRuleCauseReason, DuelEntity } from "@ygo_duel/class/DuelEntity";

import type Duelist from "./Duelist";
import {} from "@stk_utils/funcs/StkArrayUtils";
import { cellTypeMaster, DuelFieldCell, monsterZoneCellTypes, playFieldCellTypes, type DuelFieldCellType } from "./DuelFieldCell";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { CardAction, ICardAction } from "./DuelCardAction";

export class DuelField {
  public readonly cells: DuelFieldCell[][];
  public readonly duel: Duel;
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

  public readonly sendGraveyardAtSameTime = async (
    entites: DuelEntity[],
    cousedAs: TDuelCauseReason[],
    causedBy: DuelEntity,
    activator: Duelist
  ): Promise<void> => {
    // 持ち主で仕分ける
    const grouped: { [seat in TSeat]: DuelEntity[] } = entites.reduce(
      (wip, entity) => {
        wip[entity.owner.seat].push(entity);
        return wip;
      },
      {
        Above: [] as DuelEntity[],
        Below: [] as DuelEntity[],
      }
    );

    // それぞれ墓地送りを連鎖させる
    const promises = Object.values(grouped).map(
      (entites) =>
        new Promise<void>((resolve) => {
          // 起点となるダミーのPromise
          let promise = new Promise<void>((r) => r());
          for (const entity of entites) {
            // thenでつなぐ
            promise = promise.then(() => entity.sendToGraveyard(cousedAs, causedBy, activator));
          }
          // すべて終わったら、大元のPromiseを終了させる
          promise.then(() => resolve());
        })
    );
    // 両方完了するのを待つ
    await Promise.all(promises);
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

  public readonly summonMany = async (
    entities: DuelEntity[],
    posFilter: (entity: DuelEntity) => TBattlePosition[],
    cellFilter: (entity: DuelEntity) => DuelFieldCell[],
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    chooserPicker?: (entity: DuelEntity) => Duelist
  ): Promise<DuelEntity[]> => {
    const result = await Promise.all(
      entities.map(async (entity) =>
        this._summon(entity, posFilter(entity), cellFilter(entity), summonType, moveAs, causedBy, chooserPicker ? chooserPicker(entity) : undefined)
      )
    );
    if (result.find((entity) => !entity)) {
      throw new SystemError("想定されない返却値", result);
    }
    return result as DuelEntity[];
  };
  public readonly summon = async (
    entity: DuelEntity,
    selectablePosList: TBattlePosition[],
    selectableCells: DuelFieldCell[],
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    chooser?: Duelist,
    cancelable: boolean = false
  ): Promise<DuelEntity | undefined> => {
    const result = await this._summon(entity, selectablePosList, selectableCells, summonType, moveAs, causedBy, chooser, cancelable);

    if (!result) {
      return;
    }
    this.duel.log.info(`${result.status.name}を召喚（${[...moveAs, summonType].join(",")}）。`, chooser ?? causedBy?.controller ?? entity.controller);
    return result;
  };

  private readonly _summon = async (
    entity: DuelEntity,
    selectablePosList: TBattlePosition[],
    selectableCells: DuelFieldCell[],
    summonType: TSummonRuleCauseReason,
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    chooser?: Duelist,
    cancelable: boolean = false
  ): Promise<DuelEntity | undefined> => {
    const _chooser = chooser ?? causedBy?.controller ?? entity.controller;
    let pos: TBattlePosition = selectablePosList.randomPick(1)[0];
    let cell: DuelFieldCell = selectableCells.randomPick(1)[0];

    if (selectableCells.length > 1 || selectablePosList.length > 1) {
      if (_chooser.duelistType !== "NPC") {
        const msg = selectableCells.length > 1 ? "カードを召喚先へドラッグ。" : "表示形式を選択。";
        const dammyActions = selectablePosList.map((pos) => DuelEntity.createDammyAction(entity, pos, selectableCells, pos));
        const p1 = this.duel.view.modalController.selectAction(this.duel.view, {
          title: msg,
          actions: dammyActions as ICardAction<unknown>[],
          cancelable: false,
        });
        const p2 = this.duel.view.waitSubAction(_chooser, dammyActions as ICardAction<unknown>[], msg, cancelable).then((res) => res.action);

        const action = await Promise.any([p1, p2]);

        if (!action && !cancelable) {
          throw new SystemError("", action);
        }
        if (!action) {
          return;
        }
        cell = action.cell || cell;
        pos = action.pos || pos;
      }
    }
    console.log(cell, pos, summonType, moveAs, causedBy);
    await entity.summon(cell, pos, summonType, moveAs, causedBy, _chooser);

    return entity;
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
        const dammyActions = [DuelEntity.createDammyAction(entity, "カードの発動", selectableCells, undefined)];
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
        const dammyActions = [DuelEntity.createDammyAction(entity, "セット", cells)];
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

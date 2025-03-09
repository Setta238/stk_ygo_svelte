import { Duel, DuelEnd, SystemError } from "./Duel";
import { type CardAction, type TDuelCauseReason, type TDuelSummonRuleCauseReason, DuelEntity } from "@ygo_duel/class/DuelEntity";

import { cardInfoDic } from "@ygo/class/CardInfo";
import type Duelist from "./Duelist";
import {} from "@stk_utils/funcs/StkArrayUtils";
import { cellTypeMaster, DuelFieldCell, type DuelFieldCellType } from "./DuelFieldCell";
import type { TBattlePosition } from "@ygo/class/YgoTypes";

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

  public readonly getCells = (...cellTypeList: DuelFieldCellType[]): DuelFieldCell[] => {
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
    return this.getCells("MonsterZone", "ExtraMonsterZone")
      .map((cell) => cell.cardEntities)
      .filter((entities) => entities.length > 0)
      .map((entities) => entities[0])
      .filter((entity) => entity.entityType !== "Squatter");
  };
  public readonly getEntities = (duelist: Duelist): DuelEntity[] => {
    return this.getAllEntities().filter((entity) => entity.controller === duelist);
  };

  public readonly pushDeck = (duelist: Duelist): void => {
    duelist.deckInfo.cardNames
      .map((name) => cardInfoDic[name])
      .filter((info) => info)
      .forEach((info) => DuelEntity.createCardEntity(this, duelist, info));
    this.duel.log.info(
      `デッキをセット。メイン${duelist.getDeckCell().cardEntities.length}枚。エクストラ${duelist.getExtraDeck().cardEntities.length}枚。`,
      duelist
    );
    return;
  };

  public readonly prepareHands = async (duelist: Duelist): Promise<boolean> => {
    return await this.draw(duelist, 5);
  };

  public readonly draw = async (duelist: Duelist, times: number, causedBy?: DuelEntity): Promise<boolean> => {
    const flg = await this._draw(duelist, times, causedBy);
    if (!flg) {
      throw new DuelEnd(duelist.getOpponentPlayer());
    }
    return flg;
  };

  public readonly drawSameTime = async (duelist1: Duelist, times1: number, duelist2: Duelist, times2: number, causedBy?: DuelEntity): Promise<boolean> => {
    const flg1 = await this._draw(duelist1, times1, causedBy);
    const flg2 = await this._draw(duelist2, times1, causedBy);
    if (flg1 && flg2) {
      return true;
    }

    if (flg1) {
      throw new DuelEnd(duelist1);
    }
    if (flg2) {
      throw new DuelEnd(duelist1);
    }
    throw new DuelEnd();
  };

  private readonly _draw = async (duelist: Duelist, times: number, causedBy?: DuelEntity): Promise<boolean> => {
    if (times < 1) {
      return true;
    }
    const deckCell = duelist.getDeckCell();
    const cardNames = [] as string[];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of Array(times)) {
      if (!deckCell.cardEntities.length) {
        this.duel.log.info(
          cardNames.length > 0
            ? `デッキからカードを${times}枚ドローしようとしたが、${cardNames.length}枚しかドローできなかった。${cardNames}`
            : "デッキからカードをドローできなかった。",
          duelist
        );
        this.duel.isEnded = true;
        duelist.setLp(0);
        return false;
      }
      const card = deckCell.cardEntities[0];
      await card.draw(causedBy ? ["Effect"] : ["Rule"], causedBy);
      cardNames.push(card.origin?.name || "!名称取得失敗!");
    }
    this.duel.log.info(`デッキからカードを${cardNames.length}枚ドロー。${cardNames}。`, duelist);

    return true;
  };

  public readonly payMonstersForSpecialSummonCost = async (
    chooser: Duelist,
    choices: DuelEntity[],
    qty: number,
    validator: (entites: DuelEntity[]) => boolean,
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    cancelable?: boolean
  ): Promise<DuelEntity[] | undefined> => {
    if (qty > 0 && choices.length < qty) {
      return;
    }
    const target: DuelEntity[] | undefined = await this.duel.view.waitSelectEntities(
      chooser,
      choices,
      qty,
      validator,
      "素材とするモンスターを選択",
      cancelable
    );

    console.log(target);

    if (!target) {
      return;
    }

    for (const entity of target) {
      await entity.release(["Release", ...moveAs], causedBy);
    }

    this.duel.log.info(`${target.map((e) => e.status.name).join(", ")}を素材とした（${[...new Set(target.flatMap((e) => e.movedAs))].join(", ")}）。`, chooser);
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
      await entity.release(["Release", by, ...moveAs], causedBy);
      entities.push(entity);
    }

    this.duel.log.info(
      `${entities.map((e) => e.status.name).join(", ")}をリリース（${[...new Set(entities.flatMap((e) => e.movedAs))].join(", ")}）。`,
      chooser
    );
    return entities;
  };

  public readonly discard = async (
    duelist: Duelist,
    qty: number,
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    chooser?: Duelist,
    filter?: (entity: DuelEntity) => boolean
  ): Promise<DuelEntity[]> => {
    const _filter: (entity: DuelEntity) => boolean = filter || (() => true);
    const choices = duelist.getHandCell().cardEntities.filter(_filter);

    if (choices.length < qty) {
      return [];
    }
    let target = [] as DuelEntity[];
    if ((chooser || duelist).duelistType === "NPC") {
      // NPCに選択権がある場合、ランダムに手札を捨てる。
      target = choices.randomPick(qty);
    } else {
      target =
        (await this.duel.view.waitSelectEntities(chooser || duelist, choices, qty, (list) => list.length === qty, `${qty}枚カードを捨てる。`, false)) || [];
    }

    await this._sendGraveyardMany(target, ["Discard", ...moveAs], causedBy);

    this.duel.log.info(`手札からカードを${target.length}枚捨てた。${target.map((e) => e.origin?.name)}。`, duelist);

    return target;
  };

  public readonly summonMany = async (
    entities: DuelEntity[],
    posFilter: (entity: DuelEntity) => TBattlePosition[],
    cellFilter: (entity: DuelEntity) => DuelFieldCell[],
    summonType: TDuelSummonRuleCauseReason,
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
    summonType: TDuelSummonRuleCauseReason,
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
    summonType: TDuelSummonRuleCauseReason,
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
          actions: dammyActions as CardAction<unknown>[],
          cancelable: false,
        });
        const p2 = this.duel.view.waitSubAction(_chooser, dammyActions as CardAction<unknown>[], msg, cancelable).then((res) => res.actionWIP);

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
    await entity.summon(cell, pos, summonType, moveAs, causedBy);

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
        const action = dAct.actionWIP;
        if (!action && !cancelable) {
          throw new SystemError("", dAct);
        }
        if (!action) {
          return;
        }
        cell = action.cell || cell;
      }
    }

    await entity.activateSpellTrapFromHand(cell, moveAs, causedBy);

    return entity;
  };
  public readonly destroyMany = async (entities: DuelEntity[], causedAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<DuelEntity[]> => {
    return await this._sendGraveyardMany(entities, [...causedAs, "Destroy"], causedBy);
  };
  public readonly sendGraveyardMany = async (entities: DuelEntity[], causedAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<DuelEntity[]> => {
    return await this._sendGraveyardMany(entities, causedAs, causedBy);
  };
  private readonly _sendGraveyardMany = async (entities: DuelEntity[], moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<DuelEntity[]> => {
    for (const entity of entities) {
      await entity.sendGraveyard(moveAs, causedBy);
    }

    return entities.filter((entity) => entity.entityType !== "Token");
  };
  public readonly setSpellTrap = async (
    entity: DuelEntity,
    cells: DuelFieldCell[],
    causedBy?: DuelEntity,
    chooser?: Duelist,
    cancelable: boolean = false
  ): Promise<DuelEntity | undefined> => {
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

        const action = await Promise.any([actionPromise, responsePromise.then((res) => res.actionWIP)]);

        if (!action && !cancelable) {
          throw new SystemError("", action);
        }
        if (!action) {
          return;
        }
        targetCell = action.cell || targetCell;
      }
    }
    await entity.setAsSpellTrap(targetCell, ["SpellTrapSet"], causedBy);
    this.duel.log.info(`${entity.status.name}をセット（${"SpellTrapSet"}）。`, chooser ?? causedBy?.controller ?? entity.controller);
  };
}

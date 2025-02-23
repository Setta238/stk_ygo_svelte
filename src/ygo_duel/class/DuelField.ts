import { Duel, DuelEnd } from "./Duel";
import DuelEntity, { type CardAction, type DammyCardAction, type TDuelCauseReason } from "./DuelEntity";
import cardInfoDic from "@ygo/class/CardInfo";
import type Duelist from "./Duelist";
import {} from "@stk_utils/funcs/StkArrayUtils";
import { modalController } from "@ygo_duel_modal/class/ModalController";
import { cellTypeMaster, DuelFieldCell, type DuelFieldCellType } from "./DuelFieldCell";
import type { TBattlePosition } from "@ygo/class/YgoTypes";

export class DuelField {
  public readonly cells: DuelFieldCell[][];
  public readonly duel: Duel;
  private draggingAction: CardAction | undefined;
  public constructor(duel: Duel) {
    this.duel = duel;
    this.cells = [...Array(7)].map(() => []) as DuelFieldCell[][];
    for (const row of Object.keys(cellTypeMaster).map(Number)) {
      for (const column of Object.keys(cellTypeMaster[row]).map(Number)) {
        this.cells[row][column] = new DuelFieldCell(this, row, column, row < 3 ? duel.duelists.Above : row > 3 ? duel.duelists.Below : undefined);
      }
    }
    console.log(this.cells);
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
  public readonly getEntities = (duelist: Duelist): DuelEntity[] => {
    return this.getAllEntities().filter((entity) => entity.controller === duelist);
  };

  public readonly getHandCell = (duelist: Duelist): DuelFieldCell => {
    return this.getCells("Hand").filter((cell) => cell.owner === duelist)[0];
  };
  public readonly getDeckCell = (duelist: Duelist): DuelFieldCell => {
    return this.getCells("Deck").filter((cell) => cell.owner === duelist)[0];
  };
  public readonly getExtraDeck = (duelist: Duelist): DuelFieldCell => {
    return this.getCells("ExtraDeck").filter((cell) => cell.owner === duelist)[0];
  };
  public readonly getGraveyard = (duelist: Duelist): DuelFieldCell => {
    return this.getCells("Graveyard").filter((cell) => cell.owner === duelist)[0];
  };
  public readonly getFieldZone = (duelist: Duelist): DuelFieldCell => {
    return this.getCells("FieldZone").filter((cell) => cell.owner === duelist)[0];
  };
  public readonly getBanished = (duelist: Duelist): DuelFieldCell => {
    return this.getCells("Banished").filter((cell) => cell.owner === duelist)[0];
  };
  public readonly getMonsterZones = (duelist: Duelist): DuelFieldCell[] => {
    return this.getCells("MonsterZone").filter((cell) => cell.owner === duelist);
  };
  public readonly getExtraMonsterZones = (duelist: Duelist): DuelFieldCell[] => {
    return this.getCells("ExtraMonsterZone").filter((cell) => cell.entities[0]?.controller === duelist);
  };
  public readonly getEmptyMonsterZones = (duelist: Duelist): DuelFieldCell[] => {
    return this.getMonsterZones(duelist).filter((cell) => cell.entities.length === 0);
  };
  public readonly getEmptyExtraZones = (duelist: Duelist): DuelFieldCell[] => {
    return this.getExtraMonsterZones(duelist).length === 0 ? this.getMonsterZones(duelist).filter((cell) => cell.entities.length === 0) : [];
  };

  public readonly getMonstersOnField = (): DuelEntity[] => {
    return this.getCells("MonsterZone", "ExtraMonsterZone")
      .map((cell) => cell.entities)
      .filter((entities) => entities.length > 0)
      .map((entities) => entities[0])
      .filter((entity) => entity.entityType !== "Squatter");
  };

  public readonly getReleasableMonsters = (duelist: Duelist): DuelEntity[] => {
    // TODO : クロス・ソウルと帝王の烈旋の考慮
    return this.getMonstersOnField().filter((monster) => monster.controller === duelist);
  };
  public readonly pushDeck = (duelist: Duelist): void => {
    duelist.deckInfo.cardNames.map((name) => cardInfoDic[name]).forEach((info) => DuelEntity.createCardEntity(this, duelist, info));
    this.duel.log.write(
      `デッキをセット。メイン${this.getDeckCell(duelist).entities.length}枚。エクストラ${this.getExtraDeck(duelist).entities.length}枚。`,
      duelist
    );
    return;
  };

  public readonly shuffleDeck = (duelist: Duelist): void => {
    const deckCell = this.getDeckCell(duelist);
    deckCell.entities = deckCell.entities.shuffle();
    this.duel.log.write(`デッキをシャッフル。`, duelist);
  };

  public readonly prepareHands = (duelist: Duelist): boolean => {
    return this.draw(duelist, 5);
  };

  public readonly draw = (duelist: Duelist, times: number, cousedBy?: DuelEntity): boolean => {
    const flg = this._draw(duelist, times, cousedBy);
    if (!flg) {
      throw new DuelEnd(this.duel.getOpponentPlayer(duelist));
    }
    return flg;
  };

  public readonly drawSameTime = (duelist1: Duelist, times1: number, duelist2: Duelist, times2: number, cousedBy?: DuelEntity): boolean => {
    const flg1 = this._draw(duelist1, times1, cousedBy);
    const flg2 = this._draw(duelist2, times1, cousedBy);
    if (flg1 && flg2) {
      return true;
    }

    if (!flg1) {
      throw new DuelEnd(this.duel.getOpponentPlayer(duelist1));
    }
    if (!flg2) {
      throw new DuelEnd(this.duel.getOpponentPlayer(duelist2));
    }
    throw new DuelEnd();
  };

  private readonly _draw = (duelist: Duelist, times: number, cousedBy?: DuelEntity): boolean => {
    if (times < 1) {
      return true;
    }
    const deckCell = this.getDeckCell(duelist);
    const handCell = this.getHandCell(duelist);
    const cardNames = [] as string[];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ of Array(times)) {
      if (!deckCell.entities.length) {
        this.duel.log.write(
          cardNames.length > 0
            ? `デッキからカードを${times}枚ドローしようとしたが、${cardNames.length}枚しかドローできなかった。${cardNames}`
            : "デッキからカードをドローできなかった。",
          duelist
        );
        this.duel.isEnded = true;
        duelist.setLp(0);
        return false;
      }
      const card = deckCell.releaseEntities([deckCell.entities[0]], ["Draw"], cousedBy)[0];
      card.setNonFieldPosition("FaceDown", true);
      handCell.acceptEntities([card], "Bottom");
      cardNames.push(card.origin?.name || "!名称取得失敗!");
    }
    this.duel.log.write(`デッキからカードを${cardNames.length}枚ドロー。${cardNames}。`, duelist);

    return true;
  };

  public readonly release = async (
    chooser: Duelist,
    choices: DuelEntity[],
    qty: number,
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    allowZero?: boolean,
    cancelable?: boolean
  ): Promise<DuelEntity[] | undefined> => {
    if (qty > 0 && choices.length < qty) {
      return;
    }
    const target: DuelEntity[] | undefined = await this.duel.waitUserSelectEntitiesOnField(
      chooser,
      choices,
      qty,
      (selected) => (allowZero || selected.length > 0) && (qty < 0 || selected.length === qty),
      cancelable || false,
      "リリースするモンスターを選択"
    );

    if (!target) {
      return;
    }

    const entities = await this._sendGraveyardMany(target, ["Release", ...moveAs], causedBy);
    this.duel.log.write(
      `${entities.map((e) => e.status.name).join(", ")}をリリース（${[...new Set(entities.flatMap((e) => e.movedAs))].join(", ")}）。`,
      chooser
    );
    return entities;
  };

  public readonly discard = async (
    duelist: Duelist,
    qty: number,
    moveAs: TDuelCauseReason[],
    cousedBy?: DuelEntity,
    chooser?: Duelist,
    filter?: (entity: DuelEntity) => boolean
  ): Promise<DuelEntity[]> => {
    const _filter: (entity: DuelEntity) => boolean = filter || (() => true);
    const choices = this.getHandCell(duelist).entities.filter(_filter);

    if (choices.length < qty) {
      return [];
    }
    let target = [] as DuelEntity[];
    if ((chooser || duelist).duelistType === "NPC") {
      // NPCに選択権がある場合、ランダムに手札を捨てる。
      target = choices.randomPick(qty);
    } else {
      target =
        (await modalController.selectDuelEntities(this.duel, {
          title: `${qty}枚のカードを捨てる。`,
          entities: choices,
          validator: (list) => list.length === qty,
          cancelable: false,
        })) || [];
    }
    console.log(target);

    this._sendGraveyardMany(target, ["Discard", ...moveAs], cousedBy);

    this.duel.log.write(`手札からカードを${target.length}枚捨てた。${target.map((e) => e.origin?.name)}。`, duelist);

    return target;
  };

  public readonly summonMany = async (
    entities: DuelEntity[],
    posFilter: (entity: DuelEntity) => TBattlePosition[],
    cellFilter: (entity: DuelEntity) => DuelFieldCell[],
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    chooserPicker?: (entity: DuelEntity) => Duelist
  ): Promise<DuelEntity[]> => {
    return Promise.all(
      entities.map(async (entity) =>
        this._summon(entity, posFilter(entity), cellFilter(entity), moveAs, causedBy, chooserPicker ? chooserPicker(entity) : undefined)
      )
    );
  };
  public readonly summon = async (
    entity: DuelEntity,
    selectablePosList: TBattlePosition[],
    selectableCells: DuelFieldCell[],
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    chooser?: Duelist
  ): Promise<DuelEntity> => {
    const result = await this._summon(entity, selectablePosList, selectableCells, moveAs, causedBy, chooser);
    this.duel.log.write(`${result.status.name}を召喚（${entity.movedAs.join(",")}）。`, chooser ?? causedBy?.controller ?? entity.controller);
    return result;
  };

  private readonly _summon = async (
    entity: DuelEntity,
    selectablePosList: TBattlePosition[],
    selectableCells: DuelFieldCell[],
    moveAs: TDuelCauseReason[],
    causedBy?: DuelEntity,
    chooser?: Duelist
  ): Promise<DuelEntity> => {
    const _chooser = chooser ?? causedBy?.controller ?? entity.controller;
    let pos = selectablePosList[0];
    let cell = selectableCells[0];

    if (selectableCells.length > 1 || selectablePosList.length > 1) {
      if (_chooser.duelistType !== "NPC") {
        const dammyActions = selectablePosList.map((pos) => DuelEntity.createDammyAction(entity, pos, selectableCells, pos));
        modalController.selectAction(this.duel, {
          title: "カードを召喚先へドラッグ。",
          actions: dammyActions,
          cancelable: false,
        });
        const dammyAction = await this.duel.waitUserSubAction(_chooser, dammyActions, "カードを召喚先へドラッグ。");

        cell = dammyAction.cell || cell;
        pos = (dammyAction.action as DammyCardAction<TBattlePosition>).data;
      }
    }

    if (!cell) {
      cell = selectableCells.randomPick(1)[0];
    }
    if (selectablePosList.length > 1) {
      pos = selectablePosList.randomPick(1)[0];
    }
    const moveAsDic: { [pos in TBattlePosition]: TDuelCauseReason } = {
      Attack: "AttackSummon",
      Defense: "DefenseSummon",
      Set: "SetSummon",
    };
    entity.fieldCell.releaseEntities([entity], [...moveAs, moveAsDic[pos]], causedBy);
    entity.setBattlePosition(pos);
    cell.acceptEntities([entity], "Top");

    return entity;
  };
  public readonly destroyMany = async (entities: DuelEntity[], causedBy?: DuelEntity): Promise<DuelEntity[]> => {
    return await this._sendGraveyardMany(entities, ["Destroy"], causedBy);
  };
  private readonly _sendGraveyardMany = async (entities: DuelEntity[], moveAs: TDuelCauseReason[], causedBy?: DuelEntity): Promise<DuelEntity[]> => {
    entities.forEach((entity) => {
      entity.setNonFieldPosition("FaceUp", true);
      entity.fieldCell.releaseEntities([entity], moveAs, causedBy);
    });

    return entities.filter((entity) => {
      if (entity.entityType === "Token") {
        this.duel.log.write(`${entity.origin.name}は消滅した。`, causedBy?.controller);
        return false;
      }
      this.getGraveyard(entity.owner).acceptEntities([entity], "Top");
      return true;
    });
  };
  public readonly getDraggingAction = (): CardAction | undefined => {
    return this.draggingAction;
  };
  public readonly setDraggingAction = (action: CardAction) => {
    this.draggingAction = action;
    const targetList = action.validate() || [];
    this.getAllCells().forEach((cell) => (cell.canAcceptDrop = targetList.includes(cell)));
    this.duel.requireUpdate();
  };
  public readonly removeDraggingAction = () => {
    this.getAllCells().forEach((cell) => (cell.canAcceptDrop = false));
    this.duel.requireUpdate();
  };
}

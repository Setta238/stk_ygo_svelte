import { Duel, DuelEnd, SystemError } from "./Duel";
import { type TDuelCauseReason, DuelEntity } from "@ygo_duel/class/DuelEntity";

import { type Duelist } from "./Duelist";

import { cellTypeMaster, DuelFieldCell, playFieldCellTypes, type DuelFieldCellType } from "./DuelFieldCell";
import { ProcFilterPool } from "../class_continuous_effect/DuelProcFilter";
import { NumericStateOperatorPool } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { StatusOperatorPool } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { SummonFilterPool } from "@ygo_duel/class_continuous_effect/DuelSummonFilter";
import { BroadEntityMoveLog } from "./DuelEntityMoveLog";
import type { SummonMaterialInfo } from "./DuelEntityAction";
import { DamageFilterPool } from "@ygo_duel/class_continuous_effect/DuelDamageFilter";
import type { IDuelClock } from "./DuelClock";
export class DuelField {
  public readonly cells: DuelFieldCell[][];
  public readonly duel: Duel;
  public readonly summonFilterPool: SummonFilterPool;
  public readonly procFilterPool: ProcFilterPool;
  public readonly numericStateOperatorPool: NumericStateOperatorPool;
  public readonly statusOperatorPool: StatusOperatorPool;
  public readonly damageFilterPool: DamageFilterPool;
  public get stickyOperatorPools() {
    return [this.procFilterPool, this.statusOperatorPool, this.numericStateOperatorPool, this.summonFilterPool, this.damageFilterPool];
  }

  public readonly moveLog: BroadEntityMoveLog;

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
    this.summonFilterPool = new SummonFilterPool();
    this.procFilterPool = new ProcFilterPool();
    this.numericStateOperatorPool = new NumericStateOperatorPool();
    this.statusOperatorPool = new StatusOperatorPool();
    this.damageFilterPool = new DamageFilterPool();
    this.moveLog = new BroadEntityMoveLog(this);
    this.duel.clock.onStageChange.append(this.distributeOperators);
  }

  public readonly distributeOperators = (clock: IDuelClock) => {
    console.info(`[totalProcSeq]:${clock.totalProcSeq}`);
    let loopCount = 0;

    while (true) {
      loopCount++;

      if (loopCount > 10) {
        throw new SystemError("無限ループ発生");
      }

      let isOk = true;

      for (const pool of this.stickyOperatorPools) {
        if (!pool.distributeAll(this.duel)) {
          isOk = false;
          break;
        }
      }

      if (!isOk) {
        continue;
      }
      return;
    }
  };

  public readonly getAllCells = (): DuelFieldCell[] => {
    return this.cells.flat();
  };

  public readonly getCells = (...cellTypeList: Readonly<DuelFieldCellType[]>): DuelFieldCell[] => {
    return this.getAllCells().filter((cell) => cellTypeList.includes(cell.cellType));
  };

  public readonly getAvailableExtraMonsterZones = (): DuelFieldCell[] => {
    return this.getCells("ExtraMonsterZone").filter((cell) => cell.isAvailable);
  };
  public readonly getWaitingRoomCell = (): DuelFieldCell => {
    return this.getCells("WaitingRoom")[0];
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
  public readonly getCardsOnFieldStrictly = (): DuelEntity[] => {
    return this.getCells(...playFieldCellTypes)
      .map((cell) => cell.cardEntities)
      .filter((entities) => entities.length > 0)
      .map((entities) => entities[0])
      .filter((card) => card.isOnFieldStrictly);
  };

  public readonly getMonstersOnFieldStrictly = (): DuelEntity[] => this.getCardsOnFieldStrictly().filter((monster) => monster.isOnFieldAsMonsterStrictly);
  public readonly getSpellTrapsOnFieldStrictly = (): DuelEntity[] =>
    this.getCardsOnFieldStrictly().filter((spellTrap) => spellTrap.isOnFieldAsSpellTrapStrictly);

  public readonly getPendulumScalesOnFieldStrictly = (): DuelEntity[] =>
    this.getCardsOnFieldStrictly()
      .filter((card) => card.origin.monsterCategories?.includes("Pendulum"))
      .filter((card) => card.isOnFieldAsSpellTrapStrictly)
      .filter((card) => !card.status.spellCategory);

  public readonly getPendingCardsOnField = (): DuelEntity[] => {
    return this.getCells(...playFieldCellTypes)
      .map((cell) => cell.cardEntities)
      .filter((entities) => entities.length > 0)
      .map((entities) => entities[0])
      .filter((card) => card.info.isPending);
  };
  public readonly getDyingCardsOnField = (): DuelEntity[] => {
    return this.getCells(...playFieldCellTypes)
      .flatMap((cell) => [...cell.cardEntities, ...cell.xyzMaterials])
      .filter((card) => card.info.isDying);
  };
  public readonly getPendingMonstersOnField = (): DuelEntity[] => this.getPendingCardsOnField().filter((monster) => monster.kind === "Monster");

  public readonly getEntities = (duelist: Duelist): DuelEntity[] => {
    return this.getAllEntities().filter((entity) => entity.controller === duelist);
  };

  public readonly recalcLinkArrows = () => {
    const monsterZones = this.getAllCells().filter((cell) => cell.isMonsterZoneLikeCell);

    if (monsterZones.some((cell) => cell.recalcLinkArrows)) {
      monsterZones.forEach((cell) => cell.recalcLinkArrows());
    }
  };

  /**
   * 新しくリンク召喚するモンスターでエクストラリンクを成立させることができるかどうか
   * @param newLinkMonster
   * @param materials
   * @returns
   */
  public readonly canExtraLink = (newLinkMonster: DuelEntity, materialInfos: SummonMaterialInfo[]): boolean => {
    if (!newLinkMonster.linkArrows.length) {
      return false;
    }

    const materials = materialInfos.map((info) => info.material);
    // 予定含む空のエクストラモンスターゾーンを抽出
    const emptyExZoneCells = this.getCells("ExtraMonsterZone").filter((cell) => cell.isAvailable || materials.includes(cell.cardEntities[0]));

    // 片方のみ埋まっている状態でなければならない
    if (emptyExZoneCells.length !== 1) {
      return false;
    }

    // 空いているEXモンスターゾーンを取得
    const emptyExZoneCell = emptyExZoneCells[0];

    // そのモンスターをリンク召喚師したときに、アローヘッドが向く先
    const newLinkArrowDests = newLinkMonster.linkArrows.map((ah) => this.cells[emptyExZoneCell.row + ah.offsetRow][emptyExZoneCell.column + ah.offsetColumn]);

    // 素材にするモンスター以外でそこにアローヘッドが向いているモンスターかつ、新しいリンクモンスターと相互リンクするモンスターを取得。
    let coLinkedMonsters = emptyExZoneCell.linkArrowSources
      .filter((monster) => !materials.includes(monster))
      .filter((monster) => newLinkArrowDests.includes(monster.cell));

    // 上の条件のモンスターが存在しない場合、エクストラリンク不可
    if (!coLinkedMonsters.length) {
      return false;
    }

    // 無限ループ防止用
    let previousLength = -1;

    while (previousLength !== coLinkedMonsters.length) {
      // 素材にするモンスター以外で、相互リンクモンスターをすべて拾う。
      const _tmp = coLinkedMonsters.flatMap((monster) => monster.coLinkedEntities).filter((monster) => !materials.includes(monster));

      // エクストラモンスターゾーンのものがいれば、エクストラリンク可能。
      if (_tmp.some((monster) => monster.cell.cellType === "ExtraMonsterZone")) {
        return true;
      }

      // チェックしたものを配列に追加し、ユニークを取る
      coLinkedMonsters = [...coLinkedMonsters, ..._tmp].getDistinct();
      // 無限ループ防止用
      previousLength = coLinkedMonsters.length;
    }
    return false;
  };

  /**
   * @deprecated
   * @param duelist1
   * @param times1
   * @param duelist2
   * @param times2
   * @param causedBy
   * @param causedByWhome
   * @returns
   */
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
      throw new DuelEnd(winners[0], `${winners[0].getOpponentPlayer().name}がデッキからドローできなかった。`);
    }

    throw new DuelEnd(undefined, "お互いにデッキからカードをドローできなかった。");
  };

  /**
   * @deprecated
   * @param msg
   * @param chooser
   * @param choices
   * @param qty
   * @param validator
   * @param movedAs
   * @param causedBy
   * @param cancelable
   * @returns
   */
  public readonly sendToGraveyard = async (
    msg: string,
    chooser: Duelist,
    choices: DuelEntity[],
    qty: number,
    validator: (entites: DuelEntity[]) => boolean,
    movedAs: TDuelCauseReason[],
    movedBy?: DuelEntity,
    cancelable?: boolean
  ) => {
    if (qty > 0 && choices.length < qty) {
      return;
    }
    const targets: DuelEntity[] | undefined = await this.duel.view.waitSelectEntities(
      chooser,
      { selectables: choices, qty, validator, cancelable: cancelable ?? false },
      msg
    );

    if (!targets) {
      return;
    }

    await DuelEntity.sendManyToGraveyard(
      targets.map((target) => {
        return {
          entity: target,
          movedAs,
          movedBy,
          activator: chooser,
        };
      })
    );

    this.duel.log.info(`${targets.map((e) => e.status.name).join(", ")}を墓地に送った（${movedAs.getDistinct().join(", ")}）。`, chooser);
    return targets;
  };
}

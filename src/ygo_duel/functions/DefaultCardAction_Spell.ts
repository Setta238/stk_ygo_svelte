import {
  CardAction,
  type CardActionBase,
  type ChainBlockInfo,
  type ChainBlockInfoBase,
  type ChainBlockInfoPrepared,
  type TEffectTag,
} from "@ygo_duel/class/DuelCardAction";
import { DuelEntity, type TDuelCauseReason } from "@ygo_duel/class/DuelEntity";
import { spellTrapZoneCellTypes, type DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
export const defaultSpellTrapSetValidate = (myInfo: ChainBlockInfoBase<{ dest: DuelFieldCell }>): DuelFieldCell[] | undefined => {
  if (myInfo.action.entity.status.spellCategory === "Field") {
    const fieldZone = myInfo.activator.getFieldZone();
    // TODO 盆回しなど
    return [fieldZone];
  }
  const availableCells = myInfo.activator.getAvailableSpellTrapZones();
  return availableCells.length > 0 ? availableCells : undefined;
};
export const defaultSpellTrapSetPrepare = async (
  myInfo: ChainBlockInfoBase<{ dest: DuelFieldCell }>,
  cell: DuelFieldCell | undefined
): Promise<ChainBlockInfoPrepared<{ dest: DuelFieldCell }> | undefined> => {
  if (myInfo.action.entity.status.spellCategory === "Field") {
    const fieldZone = myInfo.activator.getFieldZone();
    const oldOne = fieldZone.cardEntities[0];
    // TODO 盆回しなど
    await DuelEntity.sendManyToGraveyardForTheSameReason(fieldZone.cardEntities, ["Rule"], myInfo.action.entity, myInfo.activator);
    myInfo.activator.duel.log.info(`フィールド魔法の上書きにより、${oldOne.toString()}は墓地に送られた。`, myInfo.activator);

    return { selectedEntities: [], chainBlockTags: [], prepared: { dest: fieldZone } };
  }
  if (cell) {
    return { selectedEntities: [], chainBlockTags: [], prepared: { dest: cell } };
  }

  const availableCells = myInfo.activator.getAvailableSpellTrapZones();

  if (availableCells.length === 0) {
    return;
  }

  let targetCell = availableCells[0];

  if (availableCells.length > 1) {
    if (myInfo.activator.duelistType !== "NPC") {
      const dammyActions = [CardAction.createDammyAction(myInfo.action.entity, "セット", availableCells)];
      const actionPromise = myInfo.activator.duel.view.modalController.selectAction(myInfo.activator.duel.view, {
        title: "カードをセット先へドラッグ",
        activator: myInfo.activator,
        actions: dammyActions as CardAction<unknown>[],
        cancelable: true,
      });
      const responsePromise = myInfo.activator.duel.view.waitSubAction(
        myInfo.activator,
        dammyActions as CardAction<unknown>[],
        "カードをセット先へドラッグ",
        true
      );

      const dmyAction = await Promise.any([actionPromise, responsePromise.then((res) => res.action)]);

      if (!dmyAction) {
        return;
      }
      targetCell = dmyAction.cell || targetCell;
    }
  }
  return { selectedEntities: [], chainBlockTags: [], prepared: { dest: targetCell } };
};

export const defaultSpellTrapSetExecute = async (myInfo: ChainBlockInfo<{ dest: DuelFieldCell }>): Promise<boolean> => {
  await myInfo.action.entity.setAsSpellTrap(myInfo.prepared.dest, ["Rule", "SpellTrapSet"], myInfo.action.entity, myInfo.activator);

  myInfo.activator.duel.log.info(`${myInfo.action.entity.status.name}をセット（${"SpellTrapSet"}）。`, myInfo.activator);

  myInfo.action.entity.info.isSettingSickness = myInfo.action.entity.status.kind === "Trap" || myInfo.action.entity.status.spellCategory === "QuickPlay";
  return true;
};

export const defaultSpellTrapSetAction: CardActionBase<{ dest: DuelFieldCell }> = {
  title: "セット",
  playType: "SpellTrapSet",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  validate: defaultSpellTrapSetValidate,
  prepare: defaultSpellTrapSetPrepare,
  execute: defaultSpellTrapSetExecute,
  settle: async () => true,
};

export const defaultSpellTrapValidate = <T>(myInfo: ChainBlockInfoBase<T>): DuelFieldCell[] | undefined => {
  if (myInfo.action.entity.info.isPending) {
    return;
  }
  if (myInfo.action.entity.info.isDying) {
    return;
  }
  if (myInfo.action.entity.info.isSettingSickness) {
    return;
  }
  if (spellTrapZoneCellTypes.some((ct) => ct === myInfo.action.entity.fieldCell.cellType)) {
    return myInfo.action.entity.face === "FaceDown" ? [] : undefined;
  }
  if (!myInfo.activator.isTurnPlayer) {
    return;
  }
  if (myInfo.action.entity.status.spellCategory === "Field") {
    return [myInfo.activator.getFieldZone()];
  }
  const availableCells = myInfo.activator.getAvailableSpellTrapZones();
  return availableCells.length > 0 ? availableCells : undefined;
};
export const defaultUndefinedSpellTrapPrepare = (
  myInfo: ChainBlockInfoBase<undefined>,
  cell: DuelFieldCell | undefined,
  chainBlockInfos: Readonly<ChainBlockInfoPrepared<unknown>[]>,
  cancelable: boolean,
  chainBlockTags?: TEffectTag[],
  selectedEntities?: DuelEntity[]
): Promise<ChainBlockInfoPrepared<undefined> | undefined> =>
  defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, cancelable, chainBlockTags, selectedEntities, undefined);

export const defaultSpellTrapPrepare = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  cell: DuelFieldCell | undefined,
  chainBlockInfos: Readonly<ChainBlockInfoPrepared<unknown>[]>,
  cancelable: boolean,
  chainBlockTags: TEffectTag[] | undefined,
  selectedEntities: DuelEntity[] | undefined,
  prepared: T
): Promise<ChainBlockInfoPrepared<T> | undefined> => {
  if (spellTrapZoneCellTypes.some((ct) => ct === myInfo.action.entity.fieldCell.cellType) && myInfo.action.entity.face === "FaceDown") {
    await myInfo.action.entity.setNonFieldMonsterPosition("FaceUp", ["Rule"]);
    return { chainBlockTags: chainBlockTags ?? [], selectedEntities: selectedEntities ?? [], prepared };
  }
  if (myInfo.action.entity.status.spellCategory === "Field") {
    const olds = myInfo.activator.getFieldZone().cardEntities;
    if (olds.length) {
      const oldOne = olds[0];
      await DuelEntity.sendManyToGraveyardForTheSameReason(myInfo.activator.getFieldZone().cardEntities, ["Rule"], myInfo.action.entity, myInfo.activator);
      myInfo.activator.duel.log.info(`フィールド魔法の上書きにより、${oldOne.toString()}は墓地に送られた。`, myInfo.activator);
    }
  }

  if (myInfo.action.entity.fieldCell.cellType === "Hand") {
    const causedBy: TDuelCauseReason[] = ["SpellTrapActivate"];
    const availableCells = cell
      ? [cell]
      : myInfo.action.entity.status.spellCategory === "Field"
        ? [myInfo.activator.getFieldZone()]
        : myInfo.activator.getAvailableSpellTrapZones();
    await myInfo.action.entity.field.activateSpellTrapFromHand(
      myInfo.activator,
      myInfo.action.entity,
      availableCells,
      causedBy,
      myInfo.action.entity,
      myInfo.activator,
      cancelable
    );
    return { chainBlockTags: chainBlockTags ?? [], selectedEntities: selectedEntities ?? [], prepared };
  }
  return;
};

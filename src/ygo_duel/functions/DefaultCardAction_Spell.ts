import { CardAction, type CardActionBase, type ChainBlockInfo, type ChainBlockInfoBase, type TEffectTag } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity, type TDuelCauseReason } from "@ygo_duel/class/DuelEntity";
import { spellTrapZoneCellTypes, type DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
export const defaultSpellTrapSetValidate = (action: CardAction<{ dest: DuelFieldCell }>): DuelFieldCell[] | undefined => {
  if (action.entity.status.spellCategory === "Field") {
    const fieldZone = action.entity.controller.getFieldZone();
    // TODO 盆回しなど
    return [fieldZone];
  }
  const availableCells = action.entity.controller.getAvailableSpellTrapZones();
  return availableCells.length > 0 ? availableCells : undefined;
};
export const defaultSpellTrapSetPrepare = async (
  action: CardAction<{ dest: DuelFieldCell }>,
  cell: DuelFieldCell | undefined
): Promise<ChainBlockInfoBase<{ dest: DuelFieldCell }> | undefined> => {
  if (action.entity.status.spellCategory === "Field") {
    const fieldZone = action.entity.controller.getFieldZone();
    const oldOne = fieldZone.cardEntities[0];
    // TODO 盆回しなど
    await DuelEntity.sendManyToGraveyardForTheSameReason(fieldZone.cardEntities, ["Rule"], action.entity, action.entity.controller);
    action.entity.field.duel.log.info(`フィールド魔法の上書きにより、${oldOne.toString()}は墓地に送られた。`, action.entity.controller);

    return { selectedEntities: [], chainBlockTags: [], prepared: { dest: fieldZone } };
  }
  if (cell) {
    return { selectedEntities: [], chainBlockTags: [], prepared: { dest: cell } };
  }

  const availableCells = action.entity.controller.getAvailableSpellTrapZones();

  if (availableCells.length === 0) {
    return;
  }

  let targetCell = availableCells[0];

  if (availableCells.length > 1) {
    if (action.entity.controller.duelistType !== "NPC") {
      const dammyActions = [CardAction.createDammyAction(action.entity, "セット", availableCells)];
      const actionPromise = action.entity.field.duel.view.modalController.selectAction(action.entity.field.duel.view, {
        title: "カードをセット先へドラッグ",
        actions: dammyActions as CardAction<unknown>[],
        cancelable: true,
      });
      const responsePromise = action.entity.field.duel.view.waitSubAction(
        action.entity.controller,
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
  validate: defaultSpellTrapSetValidate,
  prepare: defaultSpellTrapSetPrepare,
  execute: defaultSpellTrapSetExecute,
  settle: async () => true,
};

export const defaultSpellTrapValidate = <T>(action: CardAction<T>): DuelFieldCell[] | undefined => {
  if (action.entity.info.isPending) {
    return;
  }
  if (action.entity.info.isDying) {
    return;
  }
  if (action.entity.info.isSettingSickness) {
    return;
  }
  if (spellTrapZoneCellTypes.some((ct) => ct === action.entity.fieldCell.cellType)) {
    return action.entity.face === "FaceDown" ? [] : undefined;
  }
  if (!action.entity.controller.isTurnPlayer) {
    return;
  }
  if (action.entity.status.spellCategory === "Field") {
    return [action.entity.controller.getFieldZone()];
  }
  const availableCells = action.entity.controller.getAvailableSpellTrapZones();
  return availableCells.length > 0 ? availableCells : undefined;
};
export const defaultSpellTrapPrepare = async <T>(
  action: CardAction<T>,
  cell: DuelFieldCell | undefined,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean,
  chainBlockTags: TEffectTag[] | undefined,
  selectedEntities: DuelEntity[] | undefined,
  prepared: T
): Promise<ChainBlockInfoBase<T> | undefined> => {
  if (spellTrapZoneCellTypes.some((ct) => ct === action.entity.fieldCell.cellType) && action.entity.face === "FaceDown") {
    await action.entity.setNonFieldMonsterPosition("FaceUp", ["Rule"]);
    return { chainBlockTags: chainBlockTags ?? [], selectedEntities: selectedEntities ?? [], prepared };
  }
  if (action.entity.status.spellCategory === "Field") {
    const olds = action.entity.controller.getFieldZone().cardEntities;
    if (olds.length) {
      const oldOne = olds[0];
      await DuelEntity.sendManyToGraveyardForTheSameReason(
        action.entity.controller.getFieldZone().cardEntities,
        ["Rule"],
        action.entity,
        action.entity.controller
      );
      action.entity.controller.duel.log.info(`フィールド魔法の上書きにより、${oldOne.toString()}は墓地に送られた。`, action.entity.controller);
    }
  }

  if (action.entity.fieldCell.cellType === "Hand") {
    const causedBy: TDuelCauseReason[] = ["SpellTrapActivate"];
    const availableCells = cell
      ? [cell]
      : action.entity.status.spellCategory === "Field"
        ? [action.entity.controller.getFieldZone()]
        : action.entity.controller.getAvailableSpellTrapZones();
    await action.entity.field.activateSpellTrapFromHand(action.entity, availableCells, causedBy, action.entity, action.entity.controller, cancelable);
    return { chainBlockTags: chainBlockTags ?? [], selectedEntities: selectedEntities ?? [], prepared };
  }
  return;
};

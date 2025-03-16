import { CardAction, type CardActionBase, type ChainBlockInfo, type ChainBlockInfoBase, type TEffectTag } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity, type TDuelCauseReason } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { type Duelist } from "@ygo_duel/class/Duelist";
export const defaultSpellTrapSetValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  if (entity.status.spellCategory === "Field") {
    const fieldZone = entity.controller.getFieldZone();
    return fieldZone.isAvailable ? [fieldZone] : undefined;
  }
  const availableCells = entity.controller.getAvailableSpellTrapZones();
  return availableCells.length > 0 ? availableCells : undefined;
};
export const defaultSpellTrapSetPrepare = async (
  entity: DuelEntity,
  cell: DuelFieldCell | undefined
): Promise<ChainBlockInfoBase<{ dest: DuelFieldCell }> | undefined> => {
  if (cell) {
    return { selectedEntities: [], chainBlockTags: [], prepared: { dest: cell } };
  }

  const availableCells = entity.controller.getAvailableSpellTrapZones();

  if (availableCells.length === 0) {
    return;
  }

  let targetCell = availableCells[0];

  if (availableCells.length > 1) {
    if (entity.controller.duelistType !== "NPC") {
      const dammyActions = [CardAction.createDammyAction(entity, "セット", availableCells)];
      const actionPromise = entity.field.duel.view.modalController.selectAction(entity.field.duel.view, {
        title: "カードをセット先へドラッグ",
        actions: dammyActions as CardAction<unknown>[],
        cancelable: true,
      });
      const responsePromise = entity.field.duel.view.waitSubAction(
        entity.controller,
        dammyActions as CardAction<unknown>[],
        "カードをセット先へドラッグ",
        true
      );

      const action = await Promise.any([actionPromise, responsePromise.then((res) => res.action)]);

      if (!action) {
        return;
      }
      targetCell = action.cell || targetCell;
    }
  }
  return { selectedEntities: [], chainBlockTags: [], prepared: { dest: targetCell } };
};

export const defaultSpellTrapSetExecute = async (entity: DuelEntity, activater: Duelist, myInfo: ChainBlockInfo<{ dest: DuelFieldCell }>): Promise<boolean> => {
  await entity.setAsSpellTrap(myInfo.prepared.dest, ["Rule", "SpellTrapSet"], entity, activater);

  activater.duel.log.info(`${entity.status.name}をセット（${"SpellTrapSet"}）。`, activater);

  entity.info.isSettingSickness = entity.status.kind === "Trap" || entity.status.spellCategory === "QuickPlay";
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

export const defaultSpellTrapValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  if (entity.info.isDying) {
    return;
  }
  if (entity.info.isSettingSickness) {
    return;
  }
  if (entity.fieldCell.cellType === "FieldSpellZone" && entity.face === "FaceDown") {
    return [];
  }

  const availableCells = entity.controller.getAvailableSpellTrapZones();
  return availableCells.length > 0 ? availableCells : undefined;
};
export const defaultSpellTrapPrepare = async <T>(
  entity: DuelEntity,
  cell: DuelFieldCell | undefined,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean,
  chainBlockTags: TEffectTag[],
  selectedEntities: DuelEntity[],
  prepared: T
): Promise<ChainBlockInfoBase<T> | undefined> => {
  entity.info.isDying = true;
  if (entity.fieldCell.cellType === "FieldSpellZone" && entity.face === "FaceDown") {
    entity.setNonFieldPosition("FaceUp", true);
    return { chainBlockTags, selectedEntities, prepared };
  }
  if (entity.fieldCell.cellType === "Hand") {
    const causedBy: TDuelCauseReason[] = ["SpellTrapActivate"];
    const availableCells = cell ? [cell] : entity.controller.getAvailableSpellTrapZones();
    await entity.field.activateSpellTrapFromHand(entity, availableCells, causedBy, entity, entity.controller, true);
    return { chainBlockTags, selectedEntities, prepared };
  }
  return;
};

export const getDefaultSearchSpellAction = (filter: (card: DuelEntity) => boolean): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    // デッキに対象カードが一枚以上必要。
    validate: (entity: DuelEntity) => {
      if (entity.controller.getDeckCell().cardEntities.filter(filter).length === 0) {
        return;
      }
      if (!entity.controller.canDraw) {
        return;
      }
      return defaultSpellTrapValidate(entity);
    },
    prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, ["AddToHandFromDeck"], [], undefined),
    execute: async (entity: DuelEntity, activater: Duelist) => {
      const monsters = activater.getDeckCell().cardEntities.filter(filter);
      if (monsters.length === 0) {
        return false;
      }
      const target = await entity.field.duel.view.waitSelectEntities(activater, monsters, 1, (list) => list.length === 1, "手札に加えるカードを選択", false);
      for (const monster of target ?? []) {
        await monster.addToHand(["Effect"], entity, activater);
      }
      activater.shuffleDeck();
      return true;
    },
    settle: async () => true,
  };
};
export const getDefaultSalvageSpellAction = (filter: (card: DuelEntity) => boolean, qty: number): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    hasToTargetCards: true,
    // 墓地にに対象カードが一枚以上必要。
    validate: (entity: DuelEntity) => {
      if (entity.controller.getGraveyard().cardEntities.filter(filter).length < qty) {
        return;
      }
      return defaultSpellTrapValidate(entity);
    },
    prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, ["AddToHandFromGraveyard"], [], undefined),
    execute: async (entity: DuelEntity, activater: Duelist) => {
      const monsters = activater.getGraveyard().cardEntities.filter(filter);
      if (monsters.length === 0) {
        return false;
      }
      const target = await entity.field.duel.view.waitSelectEntities(
        activater,
        monsters,
        qty,
        (list) => list.length === qty,
        "手札に加えるカードを選択",
        false
      );
      for (const monster of target ?? []) {
        await monster.addToHand(["Effect"], entity, activater);
      }
      return true;
    },
    settle: async () => true,
  };
};
export const getLikeTradeInAction = (filter: (card: DuelEntity) => boolean): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    // 手札に対象カードが一枚以上必要。
    validate: (entity: DuelEntity) => {
      if (entity.controller.getHandCell().cardEntities.filter(filter).length === 0) {
        return;
      }
      if (entity.controller.getDeckCell().cardEntities.length < 2) {
        return;
      }
      return defaultSpellTrapValidate(entity);
    },
    prepare: async (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => {
      await entity.controller.discard(1, ["Discard", "Cost"], entity, entity.controller, filter);

      return defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, ["AddToHandFromDeck"], [], undefined);
    },
    execute: async (entity: DuelEntity, activater: Duelist) => {
      await activater.draw(2, entity, activater);
      return true;
    },
    settle: async () => true,
  };
};

export const getDefaultHealBurnSpellAction = (calcDamage: (entity: DuelEntity) => [number, number]): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    validate: defaultSpellTrapValidate,
    prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => {
      const [toSelf, toOpponent] = calcDamage(entity);

      const tags: TEffectTag[] = [];
      if (toSelf < 0) {
        tags.push("DamageToSelf");
      }
      if (toOpponent < 0) {
        tags.push("DamageToOpponent");
      }

      return defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, tags, [], undefined);
    },
    execute: async (entity: DuelEntity, activater: Duelist) => {
      const [toSelf, toOpponent] = calcDamage(entity);
      if (toOpponent > 0) {
        activater.getOpponentPlayer().heal(toOpponent, entity);
      } else if (toOpponent < 0) {
        activater.getOpponentPlayer().effectDamage(Math.abs(toOpponent), entity);
      }
      if (toSelf > 0) {
        activater.heal(toSelf, entity);
      } else if (toSelf < 0) {
        activater.effectDamage(Math.abs(toSelf), entity);
      }
      return true;
    },
    settle: async () => true,
  };
};

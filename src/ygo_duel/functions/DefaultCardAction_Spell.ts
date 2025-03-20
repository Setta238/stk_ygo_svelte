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
    // TODO 盆回しなど
    for (const oldOne of fieldZone.cardEntities) {
      await oldOne.sendToGraveyard(["Rule"], action.entity, action.entity.controller);
      action.entity.field.duel.log.info(`フィールド魔法の上書きにより、${oldOne.toString()}は墓地に送られた。`, action.entity.controller);
    }

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
  if (!action.entity.isLikeContinuousSpell) {
    action.entity.info.isDying = true;
  }
  if (spellTrapZoneCellTypes.some((ct) => ct === action.entity.fieldCell.cellType) && action.entity.face === "FaceDown") {
    action.entity.setNonFieldPosition("FaceUp", true);
    return { chainBlockTags: chainBlockTags ?? [], selectedEntities: selectedEntities ?? [], prepared };
  }
  if (action.entity.status.spellCategory === "Field") {
    for (const oldOne of action.entity.controller.getFieldZone().cardEntities) {
      await oldOne.sendToGraveyard(["Rule"], action.entity, action.entity.controller);
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
    await action.entity.field.activateSpellTrapFromHand(action.entity, availableCells, causedBy, action.entity, action.entity.controller, true);
    return { chainBlockTags: chainBlockTags ?? [], selectedEntities: selectedEntities ?? [], prepared };
  }
  return;
};
export const defaultContinuousSpellTrapExecute = async (myInfo: ChainBlockInfo<unknown>): Promise<boolean> => {
  // 永続魔法的なものの場合、この時点で効果適用開始
  if (myInfo.action.playType === "CardActivation" && myInfo.action.entity.isOnField && myInfo.action.entity.isLikeContinuousSpell) {
    // 永続効果の適用
    for (const ce of myInfo.action.entity.continuousEffects.filter((ce) => ce.canStart(myInfo.action.entity.fieldCell, myInfo.action.entity.face))) {
      await ce.start();
    }
  }
  return true;
};
export const getDefaultSearchSpellAction = (filter: (card: DuelEntity) => boolean): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    // デッキに対象カードが一枚以上必要。
    validate: (action: CardAction<undefined>) => {
      if (action.entity.controller.getDeckCell().cardEntities.filter(filter).length === 0) {
        return;
      }
      if (!action.entity.controller.canDraw) {
        return;
      }
      return defaultSpellTrapValidate(action);
    },
    prepare: (action: CardAction<undefined>, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultSpellTrapPrepare(action, cell, chainBlockInfos, cancelable, ["SearchFromDeck"], [], undefined),
    execute: async (chainBlockInfo: ChainBlockInfo<undefined>) => {
      const monsters = chainBlockInfo.activator.getDeckCell().cardEntities.filter(filter);
      if (monsters.length === 0) {
        return false;
      }
      const target = await chainBlockInfo.action.entity.field.duel.view.waitSelectEntities(
        chainBlockInfo.activator,
        monsters,
        1,
        (list) => list.length === 1,
        "手札に加えるカードを選択",
        false
      );
      for (const monster of target ?? []) {
        await monster.addToHand(["Effect"], chainBlockInfo.action.entity, chainBlockInfo.activator);
      }
      chainBlockInfo.activator.shuffleDeck();
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
    validate: (action: CardAction<undefined>) => {
      if (action.entity.controller.getGraveyard().cardEntities.filter(filter).length < qty) {
        return;
      }
      return defaultSpellTrapValidate(action);
    },
    prepare: (action: CardAction<undefined>, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultSpellTrapPrepare(action, cell, chainBlockInfos, cancelable, ["AddToHandFromGraveyard"], [], undefined),
    execute: async (chainBlockInfo: ChainBlockInfo<undefined>) => {
      const monsters = chainBlockInfo.activator.getGraveyard().cardEntities.filter(filter);
      if (monsters.length === 0) {
        return false;
      }
      const target = await chainBlockInfo.action.entity.field.duel.view.waitSelectEntities(
        chainBlockInfo.activator,
        monsters,
        qty,
        (list) => list.length === qty,
        "手札に加えるカードを選択",
        false
      );
      for (const monster of target ?? []) {
        await monster.addToHand(["Effect"], chainBlockInfo.action.entity, chainBlockInfo.activator);
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
    validate: (action: CardAction<undefined>) => {
      if (action.entity.controller.getHandCell().cardEntities.filter(filter).length === 0) {
        return;
      }
      if (action.entity.controller.getDeckCell().cardEntities.length < 2) {
        return;
      }
      return defaultSpellTrapValidate(action);
    },
    prepare: async (
      action: CardAction<undefined>,
      cell: DuelFieldCell | undefined,
      chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
      cancelable: boolean
    ) => {
      await action.entity.controller.discard(1, ["Discard", "Cost"], action.entity, action.entity.controller, filter);

      return defaultSpellTrapPrepare(action, cell, chainBlockInfos, cancelable, ["SearchFromDeck"], [], undefined);
    },
    execute: async (chainBlockInfo: ChainBlockInfo<undefined>) => {
      await chainBlockInfo.activator.draw(2, chainBlockInfo.action.entity, chainBlockInfo.activator);
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
    prepare: (action: CardAction<undefined>, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => {
      const [toSelf, toOpponent] = calcDamage(action.entity);

      const tags: TEffectTag[] = [];
      if (toSelf < 0) {
        tags.push("DamageToSelf");
      }
      if (toOpponent < 0) {
        tags.push("DamageToOpponent");
      }

      return defaultSpellTrapPrepare(action, cell, chainBlockInfos, cancelable, tags, [], undefined);
    },
    execute: async (chainBlockInfo: ChainBlockInfo<undefined>) => {
      const [toSelf, toOpponent] = calcDamage(chainBlockInfo.action.entity);
      if (toOpponent > 0) {
        chainBlockInfo.activator.getOpponentPlayer().heal(toOpponent, chainBlockInfo.action.entity);
      } else if (toOpponent < 0) {
        chainBlockInfo.activator.getOpponentPlayer().effectDamage(Math.abs(toOpponent), chainBlockInfo.action.entity);
      }
      if (toSelf > 0) {
        chainBlockInfo.activator.heal(toSelf, chainBlockInfo.action.entity);
      } else if (toSelf < 0) {
        chainBlockInfo.activator.effectDamage(Math.abs(toSelf), chainBlockInfo.action.entity);
      }
      return true;
    },
    settle: async () => true,
  };
};

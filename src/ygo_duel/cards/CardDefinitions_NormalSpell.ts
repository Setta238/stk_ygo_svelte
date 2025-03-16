import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { type Duelist } from "@ygo_duel/class/Duelist";
import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase, ChainBlockInfo } from "@ygo_duel/class/DuelCardAction";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

import type { CardDefinition } from "./CardDefinitions";

export const createCardDefinitions_NormalSpell = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_強欲な壺 = {
    name: "強欲な壺",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: (entity: DuelEntity) => {
          if (entity.controller.getDeckCell().cardEntities.length < 2) {
            return;
          }
          if (!entity.controller.canDraw) {
            return;
          }
          if (!entity.controller.canAddToHandFromDeck) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
          defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, ["Draw", "AddToHandFromDeck"], [], undefined),
        execute: async (entity: DuelEntity, activater: Duelist) => {
          await activater.draw(2, entity, activater);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_強欲な壺);
  const def_貪欲な壺 = {
    name: "貪欲な壺",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: (entity: DuelEntity) => {
          if (
            entity.controller
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(entity.controller, entity)).length < 5
          ) {
            return;
          }
          if (!entity.controller.canDraw) {
            return;
          }
          if (!entity.controller.canAddToHandFromDeck) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: async (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => {
          const target = await entity.field.duel.view.waitSelectEntities(
            entity.controller,
            entity.controller
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(entity.controller, entity)),
            5,
            (selected) => selected.length === 5,
            "デッキに戻すモンスターを選択。",
            false
          );
          if (!target) {
            return;
          }

          return defaultSpellTrapPrepare(
            entity,
            cell,
            chainBlockInfos,
            cancelable,
            ["Draw", "AddToHandFromDeck", "ReturnToDeckFromGraveyard"],
            target,
            undefined
          );
        },
        execute: async (entity: DuelEntity, activater: Duelist, myInfo: ChainBlockInfo<DuelEntity[]>) => {
          // 同一チェーン中に墓地を離れていたら不可
          if (myInfo.prepared.some((monster) => activater.duel.clock.isSameChain(monster.wasMovedAt))) {
            return false;
          }
          const cells: DuelFieldCell[] = [];
          //デッキorエクストラデッキに戻す
          for (const card of myInfo.prepared) {
            const dest = await card.returnToDeck("Top", ["Effect"], entity, activater);
            if (dest) {
              cells.push(dest);
            }
          }

          //デッキに戻っていた場合、シャッフル。
          cells
            .getDistinct()
            .filter((cell) => cell.cellType === "Deck")
            .forEach((cell) => cell.shuffle());

          await activater.draw(2, entity, activater);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_貪欲な壺);
  const def_天使の施し = {
    name: "天使の施し",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: (entity: DuelEntity) => {
          if (entity.controller.getDeckCell().cardEntities.length < 3) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: (entity: DuelEntity, cell: DuelFieldCell, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) =>
          defaultSpellTrapPrepare(entity, cell, chainBlockInfos, false, ["Draw", "AddToHandFromDeck", "DiscordAsEffect"], [], undefined),
        execute: async (entity: DuelEntity, activater: Duelist) => {
          await activater.draw(3, entity, activater);
          await activater.discard(2, ["Effect", "Discard"], entity, activater);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_天使の施し);
  const def_成金ゴブリン = {
    name: "成金ゴブリン",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: (entity: DuelEntity) => {
          if (entity.controller.getDeckCell().cardEntities.length < 1) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: (entity: DuelEntity, cell: DuelFieldCell, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) =>
          defaultSpellTrapPrepare(entity, cell, chainBlockInfos, false, ["Draw", "AddToHandFromDeck"], [], undefined),

        execute: async (entity: DuelEntity, activater: Duelist) => {
          await activater.draw(1, entity, activater);
          // このドローは時の任意効果のトリガーにならない。
          entity.field.duel.clock.incrementProcSeq();
          activater.getOpponentPlayer().heal(1000, entity);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_成金ゴブリン);
  const def_おろかな埋葬 = {
    name: "おろかな埋葬",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        // デッキにモンスターが一枚以上必要。
        validate: (entity: DuelEntity) => {
          if (entity.controller.getDeckCell().cardEntities.filter((card) => card.status.kind === "Monster").length === 0) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: (entity: DuelEntity, cell: DuelFieldCell, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) =>
          defaultSpellTrapPrepare(entity, cell, chainBlockInfos, false, ["SendToGraveyardFromDeck"], [], undefined),

        execute: async (entity: DuelEntity, activater: Duelist) => {
          const monsters = activater.getDeckCell().cardEntities.filter((entity) => entity.status.kind === "Monster");
          if (monsters.length === 0) {
            return false;
          }
          const target = await entity.field.duel.view.waitSelectEntities(
            activater,
            monsters,
            1,
            (list) => list.length === 1,
            "墓地に送るモンスターを選択",
            false
          );
          for (const monster of target ?? []) {
            await monster.sendToGraveyard(["Effect"], entity, activater);
          }
          await activater.shuffleDeck();
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_おろかな埋葬);
  const def_おろかな副葬 = {
    name: "おろかな副葬",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        isOnlyNTimesPerTurn: 1,
        // デッキにモンスターが一枚以上必要。
        validate: (entity: DuelEntity) => {
          if (entity.controller.getDeckCell().cardEntities.filter((card) => card.status.kind !== "Monster").length === 0) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: (entity: DuelEntity, cell: DuelFieldCell, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) =>
          defaultSpellTrapPrepare(entity, cell, chainBlockInfos, false, ["SendToGraveyardFromDeck"], [], undefined),
        execute: async (entity: DuelEntity, activater: Duelist) => {
          const monsters = activater.getDeckCell().cardEntities.filter((entity) => entity.status.kind !== "Monster");
          if (monsters.length === 0) {
            return false;
          }
          const target = await entity.field.duel.view.waitSelectEntities(activater, monsters, 1, (list) => list.length === 1, "墓地に送る魔法罠を選択", false);
          for (const monster of target ?? []) {
            await monster.sendToGraveyard(["Effect"], entity, activater);
          }
          await activater.shuffleDeck();
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_おろかな副葬);
  const def_死者蘇生 = {
    name: "死者蘇生",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        hasToTargetCards: true,
        // 墓地に蘇生可能モンスター、場に空きが必要。
        validate: (entity: DuelEntity) => {
          if (
            entity.field
              .getCells("Graveyard")
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card.status.kind === "Monster")
              .filter((card) => card.info.isRebornable)
              .filter((card) => card.canBeTargetOfEffect(entity.controller, entity)).length === 0
          ) {
            return;
          }
          if (entity.controller.getAvailableMonsterZones().length === 0) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: async (entity: DuelEntity, cell: DuelFieldCell, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
          const target = await entity.field.duel.view.waitSelectEntities(
            entity.controller,
            entity.field
              .getCells("Graveyard")
              .flatMap((gy) => gy.cardEntities)
              .filter((card) => card.status.kind === "Monster")
              .filter((card) => card.info.isRebornable)
              .filter((card) => card.canBeTargetOfEffect(entity.controller, entity)),
            1,
            (list) => list.length === 1,
            "蘇生対象とするモンスターを選択",
            false
          );
          if (!target) {
            throw new IllegalCancelError(entity);
          }
          return await defaultSpellTrapPrepare(entity, cell, chainBlockInfos, false, ["SpecialSummonFromGraveyard"], target, undefined);
        },
        execute: async (entity: DuelEntity, activater: Duelist, myInfo: ChainBlockInfo<undefined>) => {
          const emptyCells = activater.getEmptyMonsterZones();
          const target = myInfo.selectedEntities[0];
          await activater.summon(target, ["Attack", "Defense"], emptyCells, "SpecialSummon", ["Effect"], entity, false);
          activater.info.specialSummonCount++;
          activater.info.specialSummonCountQty++;
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_死者蘇生);

  const def_手札抹殺 = {
    name: "手札抹殺",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: (entity: DuelEntity) => {
          if (
            entity.controller.getDeckCell().cardEntities.length < entity.controller.getHandCell().cardEntities.filter((card) => card.seq !== entity.seq).length
          ) {
            return;
          }
          if (
            entity.field
              .getAllCells()
              .filter((c) => c.cellType === "Hand")
              .flatMap((c) => c.cardEntities)
              .filter((card) => card.seq !== entity.seq).length === 0
          ) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: (entity: DuelEntity, cell: DuelFieldCell, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) =>
          defaultSpellTrapPrepare(entity, cell, chainBlockInfos, false, ["AddToHandFromDeck"], [], undefined),
        execute: async (entity: DuelEntity, activater: Duelist) => {
          const h1 = activater.getHandCell().cardEntities.length;
          const h2 = activater.getOpponentPlayer().getHandCell().cardEntities.length;

          await entity.field.sendGraveyardAtSameTime(
            entity.field.getCells("Hand").flatMap((hand) => hand.cardEntities),
            ["Effect", "Discard"],
            entity,
            activater
          );

          activater.duel.clock.incrementProcSeq();

          await entity.field.drawAtSameTime(activater, h1, activater.getOpponentPlayer(), h2, entity, activater);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };
  result.push(def_手札抹殺);

  const def_光の援軍 = {
    name: "光の援軍",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        // デッキに対象モンスターが一枚以上必要。
        validate: (entity: DuelEntity) => {
          if (entity.controller.getDeckCell().cardEntities.length < 4) {
            return;
          }
          if (
            entity.controller
              .getDeckCell()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((entity) => (entity.lvl ?? 13) < 5)
              .filter((entity) => entity.status.nameTags && entity.status.nameTags.includes("ライトロード")).length === 0
          ) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: async (entity: DuelEntity, cell: DuelFieldCell, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
          const deck = entity.controller.getDeckCell();

          Array(3).forEach(() => deck.cardEntities[0].sendToGraveyard(["Cost"], entity, entity.controller));

          return await defaultSpellTrapPrepare(entity, cell, chainBlockInfos, false, ["AddToHandFromDeck", "SendToGraveyardFromDeck"], [], undefined);
        },
        execute: async (entity: DuelEntity, activater: Duelist) => {
          const monsters = activater
            .getDeckCell()
            .cardEntities.filter((entity) => entity.status.kind === "Monster")
            .filter((entity) => (entity.lvl ?? 13) < 5)
            .filter((entity) => entity.status.nameTags && entity.status.nameTags.includes("ライトロード"));
          if (monsters.length === 0) {
            return false;
          }
          const target = await entity.field.duel.view.waitSelectEntities(
            activater,
            monsters,
            1,
            (list) => list.length === 1,
            "手札に加えるモンスターを選択",
            false
          );
          for (const monster of target ?? []) {
            await monster.addToHand(["Effect"], entity, activater);
          }
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_光の援軍);

  const def_調律 = {
    name: "調律",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        // デッキ二枚以上、対象モンスターが一枚以上必要。
        validate: (entity: DuelEntity) => {
          const cards = entity.controller.getDeckCell().cardEntities;
          if (cards.length < 2) {
            return;
          }
          if (
            cards.filter((card) => card.status.nameTags?.includes("シンクロン")).filter((card) => card.status.monsterCategories?.includes("Tuner")).length === 0
          ) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: (entity: DuelEntity, cell: DuelFieldCell, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) =>
          defaultSpellTrapPrepare(entity, cell, chainBlockInfos, false, ["AddToHandFromDeck", "SendToGraveyardFromDeck"], [], undefined),
        execute: async (entity: DuelEntity, activater: Duelist) => {
          const cards = activater.getDeckCell().cardEntities;
          if (cards.length < 2) {
            return;
          }
          const monsters = cards
            .filter((card) => card.status.nameTags?.includes("シンクロン"))
            .filter((card) => card.status.monsterCategories?.includes("Tuner"));
          if (monsters.length === 0) {
            return false;
          }
          const target = await entity.field.duel.view.waitSelectEntities(
            activater,
            monsters,
            1,
            (list) => list.length === 1,
            "手札に加えるモンスターを選択",
            false
          );
          for (const monster of target ?? []) {
            await monster.addToHand(["Effect"], entity, activater);
          }
          activater.duel.clock.incrementProcSeq();
          activater.getDeckCell().shuffle();

          await activater.getDeckCell().cardEntities[0].sendToGraveyard(["Effect"], entity, activater);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_調律);
  const def_ワン・フォー・ワン = {
    name: "ワン・フォー・ワン",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        // デッキ・手札に対象モンスターが一枚以上かつ、手札コストモンスターが必要。
        validate: (entity: DuelEntity) => {
          if (entity.controller.getDeckCell().cardEntities.filter((card) => card.lvl === 1).length === 0) {
            if (entity.controller.getHandCell().cardEntities.filter((card) => card.lvl === 1).length === 0) {
              return;
            }
            if (entity.controller.getHandCell().cardEntities.filter((card) => card.status.kind === "Monster").length < 2) {
              return;
            }
          } else if (entity.controller.getHandCell().cardEntities.filter((card) => card.status.kind === "Monster").length === 0) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: async (entity: DuelEntity, cell: DuelFieldCell, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
          let choices: DuelEntity[] = entity.controller.getHandCell().cardEntities.filter((card) => card.status.kind === "Monster");
          if (entity.controller.getDeckCell().cardEntities.filter((card) => card.lvl === 1).length === 0) {
            const monsters = entity.controller.getHandCell().cardEntities.filter((card) => card.lvl === 1);
            if (monsters.length === 1) {
              choices = choices.filter((card) => card !== monsters[0]);
            }
          }

          const cost = await entity.field.sendToGraveyard(
            "墓地送るモンスターを選択",
            entity.controller,
            choices,
            1,
            (selected) => selected.length === 1,
            ["Cost"],
            entity,
            true
          );

          if (!cost) {
            return;
          }

          return await defaultSpellTrapPrepare(entity, cell, chainBlockInfos, false, ["SpecialSummonFromDeck"], [], undefined);
        },
        execute: async (entity: DuelEntity, activater: Duelist) => {
          const monsters = [
            ...entity.controller.getDeckCell().cardEntities.filter((card) => card.lvl === 1),
            ...entity.controller.getHandCell().cardEntities.filter((card) => card.lvl === 1),
          ];
          if (monsters.length === 0) {
            return false;
          }
          const selectedList = await entity.field.duel.view.waitSelectEntities(
            activater,
            monsters,
            1,
            (list) => list.length === 1,
            "特殊召喚するモンスターを選択",
            false
          );

          if (!selectedList) {
            throw new Error("illegal state");
          }

          await activater.summon(selectedList[0], ["Attack", "Defense"], activater.getAvailableMonsterZones(), "SpecialSummon", ["Effect"], entity, false);

          activater.shuffleDeck();

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_ワン・フォー・ワン);

  return result;
};

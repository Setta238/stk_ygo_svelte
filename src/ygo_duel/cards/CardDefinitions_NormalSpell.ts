import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { monsterZoneCellTypes, spellTrapZoneCellTypes, type DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import { type CardAction, type CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

import type { CardDefinition } from "./CardDefinitions";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

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
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.length < 2) {
            return;
          }
          if (!myInfo.activator.canDraw) {
            return;
          }
          if (!myInfo.activator.canAddToHandFromDeck) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: (action, cell, chainBlockInfos, cancelable) =>
          defaultSpellTrapPrepare(action, cell, chainBlockInfos, cancelable, ["Draw", "SearchFromDeck"], [], undefined),
        execute: async (chainBlockInfo) => {
          await chainBlockInfo.activator.draw(2, chainBlockInfo.action.entity, chainBlockInfo.activator);
          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
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
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          // 墓地に対象に取れるモンスターが５体以上必要
          if (
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>)).length < 5
          ) {
            return;
          }
          if (!myInfo.activator.canDraw) {
            return;
          }
          if (!myInfo.activator.canAddToHandFromDeck) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async (myInfo, cell, chainBlockInfos, cancelable) => {
          const target = await myInfo.action.entity.field.duel.view.waitSelectEntities(
            myInfo.activator,
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>)),
            5,
            (selected) => selected.length === 5,
            "デッキに戻すモンスターを選択。",
            false
          );
          if (!target) {
            return;
          }

          return defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, cancelable, ["Draw", "SearchFromDeck", "ReturnToDeckFromGraveyard"], target, undefined);
        },
        execute: async (myInfo) => {
          // いずれかが同一チェーン中に墓地を離れていたら不可
          if (myInfo.selectedEntities.some((monster) => monster.wasMovedAtCurrentChain)) {
            return false;
          }

          //デッキorエクストラデッキに戻す
          await DuelEntity.returnManyToDeckForTheSameReason("Random", myInfo.selectedEntities, ["Effect"], myInfo.action.entity, myInfo.activator);

          await myInfo.activator.draw(2, myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
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
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.length < 3) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: (action, cell, chainBlockInfos) =>
          defaultSpellTrapPrepare(action, cell, chainBlockInfos, false, ["Draw", "SearchFromDeck", "DiscordAsEffect"], [], undefined),
        execute: async (myInfo) => {
          await myInfo.activator.draw(3, myInfo.action.entity, myInfo.activator);
          await myInfo.activator.discard(2, ["Effect", "Discard"], myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
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
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.length < 1) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: (action, cell, chainBlockInfos) => defaultSpellTrapPrepare(action, cell, chainBlockInfos, false, ["Draw", "SearchFromDeck"], [], undefined),

        execute: async (myInfo) => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          // このドローは時の任意効果のトリガーにならない。
          myInfo.action.entity.field.duel.clock.incrementProcSeq();
          myInfo.activator.getOpponentPlayer().heal(1000, myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
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
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        // デッキにモンスターが一枚以上必要。
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.filter((card) => card.status.kind === "Monster").length === 0) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: (action, cell, chainBlockInfos) => defaultSpellTrapPrepare(action, cell, chainBlockInfos, false, ["SendToGraveyardFromDeck"], [], undefined),

        execute: async (myInfo) => {
          const monsters = myInfo.activator.getDeckCell().cardEntities.filter((entity) => entity.status.kind === "Monster");
          if (monsters.length === 0) {
            return false;
          }
          const target = await myInfo.action.entity.field.duel.view.waitSelectEntities(
            myInfo.activator,
            monsters,
            1,
            (list) => list.length === 1,
            "墓地に送るモンスターを選択",
            false
          );
          if (!target) {
            throw new IllegalCancelError(myInfo);
          }
          await DuelEntity.sendManyToGraveyardForTheSameReason(target, ["Effect"], myInfo.action.entity, myInfo.activator);
          await myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
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
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        // デッキにモンスターが一枚以上必要。
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.filter((card) => card.status.kind !== "Monster").length === 0) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: (action, cell, chainBlockInfos) => defaultSpellTrapPrepare(action, cell, chainBlockInfos, false, ["SendToGraveyardFromDeck"], [], undefined),
        execute: async (myInfo) => {
          const monsters = myInfo.activator.getDeckCell().cardEntities.filter((entity) => entity.status.kind !== "Monster");
          if (monsters.length === 0) {
            return false;
          }
          const target = await myInfo.action.entity.field.duel.view.waitSelectEntities(
            myInfo.activator,
            monsters,
            1,
            (list) => list.length === 1,
            "墓地に送る魔法罠を選択",
            false
          );
          if (!target) {
            throw new IllegalCancelError(myInfo);
          }
          await DuelEntity.sendManyToGraveyardForTheSameReason(target, ["Effect"], myInfo.action.entity, myInfo.activator);
          await myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
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
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        hasToTargetCards: true,
        // 墓地に蘇生可能モンスター、場に空きが必要。
        validate: (myInfo) => {
          if (
            myInfo.action.entity.field
              .getCells("Graveyard")
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card.status.kind === "Monster")
              .filter((card) => card.info.isRebornable)
              .filter((card) => card.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>))
              .filter((card) => card.canBeSpecialSummoned("SpecialSummon", myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>))
              .length === 0
          ) {
            return;
          }
          if (myInfo.activator.getAvailableMonsterZones().length === 0) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async (myInfo, cell, chainBlockInfos) => {
          const target = await myInfo.action.entity.field.duel.view.waitSelectEntities(
            myInfo.activator,
            myInfo.action.entity.field
              .getCells("Graveyard")
              .flatMap((gy) => gy.cardEntities)
              .filter((card) => card.status.kind === "Monster")
              .filter((card) => card.info.isRebornable)
              .filter((card) => card.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>))
              .filter((card) => card.canBeSpecialSummoned("SpecialSummon", myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>)),
            1,
            (list) => list.length === 1,
            "蘇生対象とするモンスターを選択",
            false
          );
          if (!target) {
            throw new IllegalCancelError(myInfo);
          }
          return await defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, false, ["SpecialSummonFromGraveyard"], target, undefined);
        },
        execute: async (myInfo) => {
          const emptyCells = myInfo.activator.getEmptyMonsterZones();
          const target = myInfo.selectedEntities[0];
          await myInfo.activator.summon(target, ["Attack", "Defense"], emptyCells, "SpecialSummon", ["Effect"], myInfo.action.entity, false);
          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
  };

  result.push(def_死者蘇生);
  (
    [
      { name: "大嵐", cellTypes: spellTrapZoneCellTypes, isOnlyEnemies: false },
      { name: "ハーピィの羽根帚", cellTypes: spellTrapZoneCellTypes, isOnlyEnemies: true },
      { name: "ブラック・ホール", cellTypes: monsterZoneCellTypes, isOnlyEnemies: false },
      { name: "サンダー・ボルト", cellTypes: monsterZoneCellTypes, isOnlyEnemies: true },
    ] as { name: string; cellTypes: Readonly<DuelFieldCellType[]>; isOnlyEnemies: boolean }[]
  ).forEach((item) => {
    result.push({
      name: item.name,
      actions: [
        {
          title: "発動",
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          validate: (myInfo) => {
            let cards = myInfo.action.entity.field
              .getCells(...item.cellTypes)
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card !== myInfo.action.entity);
            if (item.isOnlyEnemies) {
              cards = cards.filter((card) => card.controller !== myInfo.activator);
            }
            if (!cards.length) {
              return;
            }

            return defaultSpellTrapValidate(myInfo);
          },
          prepare: async (myInfo, cell, chainBlockInfos) => {
            let cards = myInfo.action.entity.field
              .getCells(...item.cellTypes)
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card !== myInfo.action.entity);
            if (item.isOnlyEnemies) {
              cards = cards.filter((card) => card.controller !== myInfo.activator);
            }

            return await defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, false, myInfo.action.calcChainBlockTagsForDestroy(cards), [], undefined);
          },
          execute: async (myInfo) => {
            let cards = myInfo.action.entity.field
              .getCells(...item.cellTypes)
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card !== myInfo.action.entity);
            if (item.isOnlyEnemies) {
              cards = cards.filter((card) => card.controller !== myInfo.activator);
            }

            await DuelEntityShortHands.tryDestroy(cards, myInfo);

            return true;
          },
          settle: async () => true,
        } as CardActionBase<unknown>,
        defaultSpellTrapSetAction as CardActionBase<unknown>,
      ],
    });
  });

  const def_ハリケーン = {
    name: "ハリケーン",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          const cards = myInfo.action.entity.field
            .getCells("SpellAndTrapZone", "FieldSpellZone")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card !== myInfo.action.entity);

          if (!cards.length) {
            return;
          }

          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async (action, cell, chainBlockInfos) => {
          return await defaultSpellTrapPrepare(action, cell, chainBlockInfos, false, ["BounceToHand"], [], undefined);
        },
        execute: async (myInfo, chainBlockInfos) => {
          // 発動済の魔法罠はバウンスできない
          const activatedCards = chainBlockInfos
            .map((info) => info.action)
            .filter((action) => action.playType === "CardActivation")
            .map((action) => action.entity)
            .filter((entity) => entity.isOnField)
            .filter((card) => card.face === "FaceUp")
            .filter((card) => !card.isLikeContinuousSpell);

          // ※自分自身も上のリストに含まれているはず
          const cards = myInfo.action.entity.field
            .getCells("SpellAndTrapZone", "FieldSpellZone")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => !activatedCards.includes(card));

          await DuelEntity.returnManyToHandForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
  };
  result.push(def_ハリケーン);

  const def_手札抹殺 = {
    name: "手札抹殺",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (
            myInfo.activator.getDeckCell().cardEntities.length <
            myInfo.activator.getHandCell().cardEntities.filter((card) => card.seq !== myInfo.action.entity.seq).length
          ) {
            return;
          }
          if (
            myInfo.action.entity.field
              .getAllCells()
              .filter((c) => c.cellType === "Hand")
              .flatMap((c) => c.cardEntities)
              .filter((card) => card.seq !== myInfo.action.entity.seq).length === 0
          ) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: (action, cell, chainBlockInfos) => defaultSpellTrapPrepare(action, cell, chainBlockInfos, false, ["SearchFromDeck"], [], undefined),
        execute: async (myInfo) => {
          const h1 = myInfo.activator.getHandCell().cardEntities.length;
          const h2 = myInfo.activator.getOpponentPlayer().getHandCell().cardEntities.length;

          await DuelEntity.sendManyToGraveyardForTheSameReason(
            myInfo.action.entity.field.getCells("Hand").flatMap((hand) => hand.cardEntities),
            ["Effect", "Discard"],
            myInfo.action.entity,
            myInfo.activator
          );

          myInfo.activator.duel.clock.incrementProcSeq();

          await myInfo.action.entity.field.drawAtSameTime(
            myInfo.activator,
            h1,
            myInfo.activator.getOpponentPlayer(),
            h2,
            myInfo.action.entity,
            myInfo.activator
          );

          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
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
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        // デッキに対象モンスターが一枚以上必要。
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.length < 4) {
            return;
          }
          if (
            myInfo.activator
              .getDeckCell()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((entity) => (entity.lvl ?? 13) < 5)
              .filter((entity) => entity.status.nameTags && entity.status.nameTags.includes("ライトロード")).length === 0
          ) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async (myInfo, cell, chainBlockInfos) => {
          const deck = myInfo.activator.getDeckCell();

          await DuelEntity.sendManyToGraveyardForTheSameReason(deck.cardEntities.slice(0, 3), ["Cost"], myInfo.action.entity, myInfo.activator);

          return await defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, false, ["SearchFromDeck", "SendToGraveyardFromDeck"], [], undefined);
        },
        execute: async (myInfo) => {
          const monsters = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((entity) => entity.status.kind === "Monster")
            .filter((entity) => (entity.lvl ?? 13) < 5)
            .filter((entity) => entity.status.nameTags && entity.status.nameTags.includes("ライトロード"));
          if (monsters.length === 0) {
            return false;
          }
          const target = await myInfo.action.entity.field.duel.view.waitSelectEntities(
            myInfo.activator,
            monsters,
            1,
            (list) => list.length === 1,
            "手札に加えるモンスターを選択",
            false
          );
          for (const monster of target ?? []) {
            await monster.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          }
          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
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
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        // デッキ二枚以上、対象モンスターが一枚以上必要。
        validate: (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities;
          if (cards.length < 2) {
            return;
          }
          if (
            cards.filter((card) => card.status.nameTags?.includes("シンクロン")).filter((card) => card.status.monsterCategories?.includes("Tuner")).length === 0
          ) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: (action, cell, chainBlockInfos) =>
          defaultSpellTrapPrepare(action, cell, chainBlockInfos, false, ["SearchFromDeck", "SendToGraveyardFromDeck"], [], undefined),
        execute: async (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities;
          if (cards.length < 2) {
            return;
          }
          const monsters = cards
            .filter((card) => card.status.nameTags?.includes("シンクロン"))
            .filter((card) => card.status.monsterCategories?.includes("Tuner"));
          if (monsters.length === 0) {
            return false;
          }
          const target = await myInfo.action.entity.field.duel.view.waitSelectEntities(
            myInfo.activator,
            monsters,
            1,
            (list) => list.length === 1,
            "手札に加えるモンスターを選択",
            false
          );
          for (const monster of target ?? []) {
            await monster.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          }
          myInfo.activator.duel.clock.incrementProcSeq();
          myInfo.activator.getDeckCell().shuffle();

          await myInfo.activator.getDeckCell().cardEntities[0].sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
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
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        // デッキ・手札に対象モンスターが一枚以上かつ、手札コストモンスターが必要。
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.filter((card) => card.lvl === 1).length === 0) {
            if (myInfo.activator.getHandCell().cardEntities.filter((card) => card.lvl === 1).length === 0) {
              return;
            }
            if (myInfo.activator.getHandCell().cardEntities.filter((card) => card.status.kind === "Monster").length < 2) {
              return;
            }
          } else if (myInfo.activator.getHandCell().cardEntities.filter((card) => card.status.kind === "Monster").length === 0) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async (myInfo, cell, chainBlockInfos) => {
          let choices: DuelEntity[] = myInfo.activator.getHandCell().cardEntities.filter((card) => card.status.kind === "Monster");
          if (myInfo.activator.getDeckCell().cardEntities.filter((card) => card.lvl === 1).length === 0) {
            const monsters = myInfo.activator.getHandCell().cardEntities.filter((card) => card.lvl === 1);
            if (monsters.length === 1) {
              choices = choices.filter((card) => card !== monsters[0]);
            }
          }

          const cost = await myInfo.action.entity.field.sendToGraveyard(
            "墓地送るモンスターを選択",
            myInfo.activator,
            choices,
            1,
            (selected) => selected.length === 1,
            ["Cost"],
            myInfo.action.entity,
            true
          );

          if (!cost) {
            return;
          }

          return await defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, false, ["SpecialSummonFromDeck"], [], undefined);
        },
        execute: async (myInfo) => {
          const monsters = [
            ...myInfo.activator.getDeckCell().cardEntities.filter((card) => card.lvl === 1),
            ...myInfo.activator.getHandCell().cardEntities.filter((card) => card.lvl === 1),
          ];
          if (monsters.length === 0) {
            return false;
          }
          const selectedList = await myInfo.action.entity.field.duel.view.waitSelectEntities(
            myInfo.activator,
            monsters,
            1,
            (list) => list.length === 1,
            "特殊召喚するモンスターを選択",
            false
          );

          if (!selectedList) {
            throw new Error("illegal state");
          }

          await myInfo.activator.summon(
            selectedList[0],
            ["Attack", "Defense"],
            myInfo.activator.getAvailableMonsterZones(),
            "SpecialSummon",
            ["Effect"],
            myInfo.action.entity,
            false
          );

          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
  };

  result.push(def_ワン・フォー・ワン);

  return result;
};

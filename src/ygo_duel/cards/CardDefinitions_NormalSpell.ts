import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { duelFieldCellTypes, monsterZoneCellTypes, spellTrapZoneCellTypes, type DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import { type CardAction, type CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { IllegalCancelError, SystemError } from "@ygo_duel/class/Duel";

import type { CardDefinition } from "./CardDefinitions";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPrepare, getSystemAction } from "@ygo_duel/functions/DefaultCardAction";

export const createCardDefinitions_NormalSpell = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

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
        priorityForNPC: 40,

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
        priorityForNPC: 40,
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
        priorityForNPC: 40,
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
        priorityForNPC: 40,
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
        priorityForNPC: 40,
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

  const def_封印の黄金棺 = {
    name: "封印の黄金櫃",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          // デッキに除外できるカードが必要
          if (myInfo.activator.getDeckCell().cardEntities.every((card) => !myInfo.activator.canTryBanish(card, "BanishAsEffect", myInfo.action))) {
            return;
          }

          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async (myInfo, cell, chainBlockInfos) =>
          defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, false, ["BanishFromDeck", "Banish"], [], undefined),
        execute: async (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities.filter((card) => myInfo.activator.canTryBanish(card, "BanishAsEffect", myInfo.action));
          const selectedList = await myInfo.action.entity.field.duel.view.waitSelectEntities(
            myInfo.activator,
            cards,
            1,
            (list) => list.length === 1,
            "除外するカードを選択。",
            false
          );

          if (!selectedList) {
            throw new Error("illegal state");
          }

          const salvageables = await DuelEntityShortHands.tryBanish(selectedList, myInfo);

          //回収可能な場合、封印の黄金櫃カウンターを置く
          salvageables.forEach((card) => card.counterHolder.setQty("GoldSarcophagus", 0));

          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      getSystemAction("回収カウント進行", ["stanby"], (myInfo) => {
        if (!myInfo.activator.isTurnPlayer) {
          return;
        }

        console.log(myInfo);
        // 封印の黄金櫃カウンターを置く
        myInfo.action.entity.field
          .getCells("Banished")
          .flatMap((cell) => cell.cardEntities)
          .filter((card) => card.moveLog.latestRecord.movedBy === myInfo.action.entity)
          .filter((card) => card.moveLog.latestRecord.actionOwner === myInfo.activator)
          .forEach((card) => {
            card.counterHolder.add("GoldSarcophagus");
            const qty = card.counterHolder.getQty("GoldSarcophagus");
            if (qty < 3) {
              myInfo.activator.duel.log.info(`${card.toString()}のターンカウント：${qty - 1}⇒${qty}`);
            }
          });
      }),
      {
        title: "回収",
        playType: "MandatoryLingeringEffect",
        spellSpeed: "Normal",
        executableCells: duelFieldCellTypes, //回収効果はカード本体の状態に係わらず、使用可能
        executablePeriods: ["stanby"],
        executableDuelistTypes: ["Controller", "Opponent"],
        validate: (myInfo) => {
          console.log(myInfo);
          //発動者のスタンバイフェイズでカウント、カードは持ち主の手札に入る
          if (!myInfo.activator.isTurnPlayer) {
            return;
          }

          console.log(myInfo);
          // 封印の黄金櫃カウンターがちょうど二個のものを回収できる。
          return myInfo.action.entity.field
            .getCells("Banished")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.moveLog.latestRecord.movedBy === myInfo.action.entity)
            .filter((card) => card.moveLog.latestRecord.actionOwner === myInfo.activator)
            .some((card) => card.counterHolder.getQty("GoldSarcophagus") === 2)
            ? []
            : undefined;
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.action.entity.field
            .getCells("Banished")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.moveLog.latestRecord.movedBy === myInfo.action.entity)
            .filter((card) => card.moveLog.latestRecord.actionOwner === myInfo.activator)
            .filter((card) => card.counterHolder.getQty("GoldSarcophagus") === 2);
          if (!cards.length) {
            throw new SystemError("想定されない状態", myInfo);
          }

          let card = cards[0];

          if (cards.length > 1) {
            const selectedList = await myInfo.action.entity.field.duel.view.waitSelectEntities(
              myInfo.activator,
              cards,
              1,
              (list) => list.length === 1,
              "回収するカードを選択。",
              false
            );
            if (!selectedList || !selectedList.length) {
              throw new SystemError("想定されない状態", myInfo, selectedList);
            }

            card = selectedList[0];
          }

          await card.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
  };

  result.push(def_封印の黄金棺);

  return result;
};

import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
import {
  defaultSpellTrapPrepare,
  defaultSpellTrapSetAction,
  defaultSpellTrapValidate,
  getDefaultHealBurnSpellAction as getDefaultHealOrBurnSpellAction,
  getDefaultSalvageSpellAction,
  getDefaultSearchSpellAction,
  getLikeTradeInAction,
} from "@ygo_duel/functions/DefaultCardAction";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase, ChainBlockInfo } from "@ygo_duel/class/DuelCardAction";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

export type CardDefinition = {
  name: string;
  actions: CardActionBase<unknown>[];
};

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
          return defaultSpellTrapValidate(entity);
        },
        prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
          defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, ["AddToHandFromDeck"], [], undefined),
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
          if (entity.controller.getGraveyard().cardEntities.filter((card) => card.status.kind === "Monster").length < 5) {
            return;
          }
          return defaultSpellTrapValidate(entity);
        },
        prepare: async (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => {
          const target = await entity.field.duel.view.waitSelectEntities(
            entity.controller,
            entity.controller.getGraveyard().cardEntities.filter((card) => card.status.kind === "Monster"),
            5,
            (selected) => selected.length === 5,
            "デッキに戻すモンスターを選択。",
            false
          );
          if (!target) {
            return;
          }

          return defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, ["AddToHandFromDeck", "ReturnToDeckFromGraveyard"], target, undefined);
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
          defaultSpellTrapPrepare(entity, cell, chainBlockInfos, false, ["AddToHandFromDeck"], [], undefined),
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
          defaultSpellTrapPrepare(entity, cell, chainBlockInfos, false, ["AddToHandFromDeck"], [], undefined),

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
              .filter((card) => card.status.kind === "Monster" && card.info.isRebornable).length === 0
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
              .filter((card) => card.origin.kind === "Monster" && card.info.isRebornable),
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
          target.controller = activater;
          await myInfo.selectedEntities[0].field.summon(target, ["Attack", "Defense"], emptyCells, "SpecialSummon", ["Effect"], entity, undefined, false);
          activater.specialSummonCount++;
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

          await entity.field.summon(
            selectedList[0],
            ["Attack", "Defense"],
            activater.getAvailableMonsterZones(),
            "SpecialSummon",
            ["Effect"],
            entity,
            activater,
            false
          );

          activater.shuffleDeck();

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_ワン・フォー・ワン);

  [
    {
      name: "増援",
      filter: (card: DuelEntity) => card.origin.kind === "Monster" && card.origin.type === "Warrior" && (card.origin.level ?? 5) < 5,
    },
    {
      name: "化石調査",
      filter: (card: DuelEntity) => card.origin.kind === "Monster" && card.origin.type === "Dinosaur" && (card.origin.level ?? 6) < 6,
    },
    {
      name: "Ｅ－エマージェンシーコール",
      filter: (card: DuelEntity) => card.origin.kind === "Monster" && (card.origin.nameTags ?? []).includes("Ｅ・ＨＥＲＯ"),
    },
    {
      name: "召集の聖刻印",
      filter: (card: DuelEntity) => card.origin.kind === "Monster" && (card.origin.nameTags ?? []).includes("聖刻"),
    },
    {
      name: "召喚師のスキル",
      filter: (card: DuelEntity) => card.origin.kind === "Monster" && (card.origin.monsterCategories ?? []).includes("Normal") && (card.origin.level ?? 4) > 4,
    },
    {
      name: "トゥーンのもくじ",
      filter: (card: DuelEntity) => (card.origin.nameTags ?? []).includes("トゥーン"),
    },
    {
      name: "融合賢者",
      filter: (card: DuelEntity) => card.origin.name === "融合",
    },
    {
      name: "虹の架け橋",
      filter: (card: DuelEntity) => card.origin.kind !== "Monster" && (card.origin.nameTags ?? []).includes("宝玉"),
    },
    {
      name: "紫炎の狼煙",
      filter: (card: DuelEntity) => card.origin.kind === "Monster" && (card.origin.nameTags ?? []).includes("六武衆") && (card.origin.level ?? 4) < 4,
    },
    {
      name: "テラ・フォーミング",
      filter: (card: DuelEntity) => card.origin.kind === "Spell" && card.origin.spellCategory === "Field",
    },
    {
      name: "コール・リゾネーター",
      filter: (card: DuelEntity) => card.origin.kind === "Monster" && (card.origin.nameTags ?? []).includes("リゾネーター"),
    },
  ].forEach((item) => {
    result.push({
      name: item.name,
      actions: [getDefaultSearchSpellAction(item.filter), defaultSpellTrapSetAction] as CardActionBase<unknown>[],
    });
  });

  [
    {
      name: "戦士の生還",
      filter: (card: DuelEntity) => card.status.kind === "Monster" && card.type.includes("Warrior"),
      qty: 1,
    },
    {
      name: "ダーク・バースト",
      filter: (card: DuelEntity) => card.status.kind === "Monster" && card.attr.includes("Dark") && (card.atk ?? 9999) <= 1500,
      qty: 1,
    },
    {
      name: "悪夢再び",
      filter: (card: DuelEntity) => card.status.kind === "Monster" && card.attr.includes("Dark") && (card.def ?? 9999) === 0,
      qty: 2,
    },
    {
      name: "サルベージ",
      filter: (card: DuelEntity) => card.status.kind === "Monster" && card.attr.includes("Water") && (card.atk ?? 9999) <= 1500,
      qty: 2,
    },
    {
      name: "バッテリーリサイクル",
      filter: (card: DuelEntity) => card.status.kind === "Monster" && card.type.includes("Thunder") && (card.atk ?? 9999) <= 1500,
      qty: 2,
    },
    {
      name: "闇の量産工場",
      filter: (card: DuelEntity) => card.status.kind === "Monster" && (card.status.monsterCategories ?? []).includes("Normal"),
      qty: 2,
    },
  ].forEach((item) => {
    result.push({
      name: item.name,
      actions: [getDefaultSalvageSpellAction(item.filter, item.qty), defaultSpellTrapSetAction] as CardActionBase<unknown>[],
    });
  });
  [
    {
      name: "トレード・イン",
      filter: (card: DuelEntity) => card.status.kind === "Monster" && (card.lvl ?? 0) === 8,
    },
    {
      name: "調和の宝札",
      filter: (card: DuelEntity) =>
        card.status.kind === "Monster" && (card.origin.monsterCategories ?? []).includes("Tuner") && card.type.includes("Dragon") && (card.atk ?? 9999) <= 1000,
    },
    {
      name: "デステニー・ドロー",
      filter: (card: DuelEntity) => card.status.kind === "Monster" && (card.origin.nameTags ?? []).includes("Ｄ－ＨＥＲＯ"),
    },
  ].forEach((item) => {
    result.push({
      name: item.name,
      actions: [getLikeTradeInAction(item.filter), defaultSpellTrapSetAction] as CardActionBase<unknown>[],
    });
  });
  [
    {
      name: "火の粉",
      calcHeal: () => [0, -200] as [number, number],
    },
    {
      name: "雷鳴",
      calcHeal: () => [0, -300] as [number, number],
    },
    {
      name: "ファイヤー・ボール",
      calcHeal: () => [0, -500] as [number, number],
    },
    {
      name: "火あぶりの刑",
      calcHeal: () => [0, -600] as [number, number],
    },
    {
      name: "昼夜の大火事",
      calcHeal: () => [0, -800] as [number, number],
    },
    {
      name: "火炎地獄",
      calcHeal: () => [-500, -1000] as [number, number],
    },
    {
      name: "盗人ゴブリン",
      calcHeal: () => [500, -500] as [number, number],
    },
    {
      name: "ブルー・ポーション",
      calcHeal: () => [400, 0] as [number, number],
    },
    {
      name: "レッド・ポーション",
      calcHeal: () => [500, 0] as [number, number],
    },
    {
      name: "ゴブリンの秘薬",
      calcHeal: () => [600, 0] as [number, number],
    },
    {
      name: "天使の生き血",
      calcHeal: () => [800, 0] as [number, number],
    },
    {
      name: "治療の神 ディアン・ケト",
      calcHeal: () => [1000, 0] as [number, number],
    },
    {
      name: "恵みの雨",
      calcHeal: () => [1000, 1000] as [number, number],
    },
  ].forEach((item) => {
    result.push({
      name: item.name,
      actions: [getDefaultHealOrBurnSpellAction(item.calcHeal), defaultSpellTrapSetAction] as CardActionBase<unknown>[],
    });
  });
  return result;
};

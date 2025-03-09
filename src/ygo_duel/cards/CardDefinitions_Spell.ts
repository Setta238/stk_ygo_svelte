import { DuelEntity, type CardActionBase } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
import {
  defaultSpellTrapPrepare,
  defaultSpellTrapSetAction,
  defaultSpellTrapValidate,
  getDefaultHealBurnSpellAction as getDefaultHealOrBurnSpellAction,
  getDefaultSearchSpellAction,
  getLikeTradeInAction,
} from "@ygo_duel/functions/DefaultCardAction";

export type CardDefinition = {
  name: string;
  actions: CardActionBase<unknown>[];
};

export const createCardDefinitions_Spell = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_強欲な壺 = {
    name: "強欲な壺",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: defaultSpellTrapValidate,
        prepare: async (entity: DuelEntity, cell?: DuelFieldCell) => {
          entity.isDying = true;
          return await defaultSpellTrapPrepare(entity, undefined, cell);
        },
        execute: async (entity: DuelEntity, activater: Duelist) => {
          await entity.field.draw(activater, 2, entity);
          return true;
        },
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_強欲な壺);
  const def_天使の施し = {
    name: "天使の施し",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: defaultSpellTrapValidate,
        prepare: async (entity: DuelEntity, cell?: DuelFieldCell) => {
          entity.isDying = true;
          return await defaultSpellTrapPrepare(entity, undefined, cell);
        },
        execute: async (entity: DuelEntity, activater: Duelist) => {
          await entity.field.draw(entity.controller, 3, entity);
          await entity.field.discard(activater, 2, ["Effect", "Discard"], entity);
          return true;
        },
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
        validate: defaultSpellTrapValidate,
        prepare: async (entity: DuelEntity, cell?: DuelFieldCell) => {
          entity.isDying = true;
          return await defaultSpellTrapPrepare(entity, undefined, cell);
        },
        execute: async (entity: DuelEntity, activater: Duelist) => {
          await entity.field.draw(entity.controller, 1, entity);
          // このドローは時の任意効果のトリガーにならない。
          entity.field.duel.clock.incrementProcSeq();
          activater.getOpponentPlayer().heal(1000, entity);
          return true;
        },
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
        validate: (entity: DuelEntity) =>
          defaultSpellTrapValidate(entity, (e) => e.controller.getDeckCell().cardEntities.some((card) => card.status.kind === "Monster")),
        prepare: async (entity: DuelEntity, cell?: DuelFieldCell) => {
          entity.isDying = true;
          return await defaultSpellTrapPrepare(entity, undefined, cell);
        },
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
            await entity.field.sendGraveyardMany([monster], ["Effect"], entity);
          }
          await activater.shuffleDeck();
          return true;
        },
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_おろかな埋葬);
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
        validate: (entity: DuelEntity) =>
          defaultSpellTrapValidate(
            entity,
            (e) =>
              e.field
                .getCells("Graveyard")
                .flatMap((gy) => gy.cardEntities)
                .filter((card) => card.origin.kind === "Monster" && card.canReborn).length > 0 && e.controller.getAvailableMonsterZones().length > 0
          ),
        prepare: async (entity: DuelEntity, cell?: DuelFieldCell) => {
          entity.isDying = true;
          const target = await entity.field.duel.view.waitSelectEntities(
            entity.controller,
            entity.field
              .getCells("Graveyard")
              .flatMap((gy) => gy.cardEntities)
              .filter((card) => card.origin.kind === "Monster" && card.canReborn),
            1,
            (list) => list.length === 1,
            "蘇生対象とするモンスターを選択",
            false
          );
          await defaultSpellTrapPrepare(entity, undefined, cell);

          return target?.[0];
        },
        execute: async (entity: DuelEntity, activater: Duelist, cell: DuelFieldCell, prepared: DuelEntity) => {
          const emptyCells = activater.getEmptyMonsterZones();
          prepared.controller = activater;
          await entity.field.summon(prepared, ["Attack", "Defense"], emptyCells, "SpecialSummon", ["Effect"], entity, undefined, false);
          entity.controller.specialSummonCount++;
          return true;
        },
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_死者蘇生);

  const def_光の援軍 = {
    name: "光の援軍",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        // デッキに対象モンスターが一枚以上必要。
        validate: (entity: DuelEntity) =>
          defaultSpellTrapValidate(
            entity,
            (e) =>
              e.controller
                .getDeckCell()
                .cardEntities.filter((card) => card.status.kind === "Monster")
                .filter((entity) => (entity.lvl ?? 13) < 5)
                .some((entity) => entity.status.nameTags && entity.status.nameTags.includes("ライトロード")) &&
              e.controller.getDeckCell().cardEntities.length > 3
          ),
        prepare: async (entity: DuelEntity, cell?: DuelFieldCell) => {
          entity.isDying = true;
          const deck = entity.controller.getDeckCell();

          Array(3).forEach(() => deck.cardEntities[0].sendGraveyard(["Cost"], entity));

          return await defaultSpellTrapPrepare(entity, undefined, cell);
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
            await monster.addToHand(["Effect"], entity);
          }
          return true;
        },
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_光の援軍);

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
      name: "トレード・イン",
      filter: (card: DuelEntity) => card.status.kind === "Monster" && (card.status.level ?? 0) === 8,
    },
    {
      name: "調和の宝札",
      filter: (card: DuelEntity) =>
        card.status.kind === "Monster" &&
        (card.origin.monsterCategories ?? []).includes("Tuner") &&
        card.status.type === "Dragon" &&
        (card.status.attack ?? 9999) <= 1000,
    },
    {
      name: "デステニー・ドロー",
      filter: (card: DuelEntity) => card.status.kind === "Monster" && (card.origin.nameTags ?? []).includes("リゾネーター"),
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

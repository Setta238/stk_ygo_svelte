import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/cards/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase, TEffectTag } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";

const getDefaultSearchSpellAction = (filter: (card: DuelEntity) => boolean): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    priorityForNPC: 40,

    // デッキに対象カードが一枚以上必要。
    validate: (myInfo) => {
      if (myInfo.activator.getDeckCell().cardEntities.filter(filter).length === 0) {
        return;
      }
      if (!myInfo.activator.canDraw) {
        return;
      }
      return defaultSpellTrapValidate(myInfo);
    },
    prepare: (action, cell, chainBlockInfos, cancelable) =>
      defaultSpellTrapPrepare(action, cell, chainBlockInfos, cancelable, ["SearchFromDeck"], [], undefined),
    execute: async (myInfo) => {
      const monsters = myInfo.activator.getDeckCell().cardEntities.filter(filter);
      if (monsters.length === 0) {
        return false;
      }
      const target = await myInfo.action.entity.field.duel.view.waitSelectEntities(
        myInfo.activator,
        monsters,
        1,
        (list) => list.length === 1,
        "手札に加えるカードを選択",
        false
      );
      for (const monster of target ?? []) {
        await monster.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
      }

      myInfo.activator.getDeckCell().shuffle();
      return true;
    },
    settle: async () => true,
  };
};
const getDefaultSalvageSpellAction = (filter: (card: DuelEntity) => boolean, qty: number): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],

    hasToTargetCards: true,
    priorityForNPC: 40,
    // 墓地にに対象カードが一枚以上必要。
    validate: (myInfo) => {
      if (myInfo.activator.getGraveyard().cardEntities.filter(filter).length < qty) {
        return;
      }
      return defaultSpellTrapValidate(myInfo);
    },
    prepare: (action, cell, chainBlockInfos, cancelable) =>
      defaultSpellTrapPrepare(action, cell, chainBlockInfos, cancelable, ["AddToHandFromGraveyard"], [], undefined),
    execute: async (myInfo) => {
      const monsters = myInfo.activator.getGraveyard().cardEntities.filter(filter);
      if (monsters.length === 0) {
        return false;
      }
      const target = await myInfo.action.entity.field.duel.view.waitSelectEntities(
        myInfo.activator,
        monsters,
        qty,
        (list) => list.length === qty,
        "手札に加えるカードを選択",
        false
      );
      for (const monster of target ?? []) {
        await monster.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
      }
      return true;
    },
    settle: async () => true,
  };
};
const getLikeTradeInAction = (filter: (card: DuelEntity) => boolean): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    priorityForNPC: 40,

    // 手札に対象カードが一枚以上必要。
    validate: (myInfo) => {
      if (myInfo.activator.getHandCell().cardEntities.filter(filter).length === 0) {
        return;
      }
      if (myInfo.activator.getDeckCell().cardEntities.length < 2) {
        return;
      }
      return defaultSpellTrapValidate(myInfo);
    },
    prepare: async (myInfo, cell, chainBlockInfos, cancelable) => {
      const prepared = await defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, cancelable, ["Draw"], [], undefined);
      await myInfo.activator.discard(1, ["Discard", "Cost"], myInfo.action.entity, myInfo.activator, filter);

      return prepared;
    },
    execute: async (myInfo) => {
      await myInfo.activator.draw(2, myInfo.action.entity, myInfo.activator);
      return true;
    },
    settle: async () => true,
  };
};

const getDefaultHealBurnSpellAction = (calcDamage: (entity: DuelEntity) => [number, number]): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    validate: defaultSpellTrapValidate,
    prepare: (myInfo, cell, chainBlockInfos, cancelable) => {
      const [toSelf, toOpponent] = calcDamage(myInfo.action.entity);

      const tags: TEffectTag[] = [];
      if (toSelf < 0) {
        tags.push("DamageToSelf");
      }
      if (toOpponent < 0) {
        tags.push("DamageToOpponent");
      }

      return defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, cancelable, tags, [], undefined);
    },
    execute: async (myInfo) => {
      const [toSelf, toOpponent] = calcDamage(myInfo.action.entity);
      if (toOpponent > 0) {
        myInfo.activator.getOpponentPlayer().heal(toOpponent, myInfo.action.entity);
      } else if (toOpponent < 0) {
        myInfo.activator.getOpponentPlayer().effectDamage(Math.abs(toOpponent), myInfo.action.entity);
      }
      if (toSelf > 0) {
        myInfo.activator.heal(toSelf, myInfo.action.entity);
      } else if (toSelf < 0) {
        myInfo.activator.effectDamage(Math.abs(toSelf), myInfo.action.entity);
      }
      return true;
    },
    settle: async () => true,
  };
};

export const createCardDefinitions_NormalSpell_Preset = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  [
    {
      name: "増援",
      filter: (card: DuelEntity) => card.origin.kind === "Monster" && card.types.includes("Warrior") && (card.origin.level ?? 5) < 5,
    },
    {
      name: "化石調査",
      filter: (card: DuelEntity) => card.origin.kind === "Monster" && card.types.includes("Dinosaur") && (card.origin.level ?? 6) < 6,
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
      filter: (card: DuelEntity) => card.status.kind === "Monster" && card.types.includes("Warrior"),
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
      filter: (card: DuelEntity) => card.status.kind === "Monster" && card.types.includes("Thunder") && (card.atk ?? 9999) <= 1500,
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
        card.status.kind === "Monster" &&
        (card.origin.monsterCategories ?? []).includes("Tuner") &&
        card.types.includes("Dragon") &&
        (card.atk ?? 9999) <= 1000,
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
      actions: [getDefaultHealBurnSpellAction(item.calcHeal), defaultSpellTrapSetAction] as CardActionBase<unknown>[],
    });
  });
  return result;
};

import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import {
  defaultSpellTrapSetAction,
  getDefaultHealBurnSpellAction as getDefaultHealOrBurnSpellAction,
  getDefaultSalvageSpellAction,
  getDefaultSearchSpellAction,
  getLikeTradeInAction,
} from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";

export const createCardDefinitions_NormalSpell_Preset = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

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

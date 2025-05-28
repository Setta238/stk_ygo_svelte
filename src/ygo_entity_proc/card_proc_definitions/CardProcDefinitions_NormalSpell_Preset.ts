import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { CardActionDefinition, TActionTag } from "@ygo_duel/class/DuelEntityAction";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultCanPayDiscardCosts, defaultPayDiscardCosts, defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import type { TMonsterType } from "@ygo/class/YgoTypes";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export default function* generate(): Generator<EntityProcDefinition> {
  for (const item of [
    { name: "トゲトゲ神の殺虫剤", type: "Insect" },
    { name: "戦士抹殺", type: "Warrior" },
    { name: "酸の嵐", type: "Machine" },
    { name: "永遠の渇水", type: "Fish" },
    { name: "神の息吹", type: "Rock" },
    { name: "魔女狩り", type: "Spellcaster" },
    { name: "悪魔払い", type: "Fiend" },
  ] as { name: string; type: TMonsterType }[]) {
    yield {
      name: item.name,
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          canExecute: (myInfo) => myInfo.action.entity.field.getMonstersOnFieldStrictly().some((card) => card.types.includes(item.type)),
          prepare: async (myInfo) => {
            const cards = myInfo.action.entity.field.getMonstersOnFieldStrictly().filter((card) => card.types.includes(item.type));
            return { selectedEntities: [], chainBlockTags: myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, cards) };
          },
          execute: async (myInfo) => {
            const cards = myInfo.action.entity.field.getMonstersOnFieldStrictly().filter((card) => card.types.includes(item.type));
            await DuelEntityShortHands.tryDestroy(cards, myInfo);

            return true;
          },
          settle: async () => true,
        },
        defaultSpellTrapSetAction,
      ],
    };
  }
  yield* [
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
  ].map((item) => {
    return {
      name: item.name,
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          fixedTags: ["SearchFromDeck"],
          priorityForNPC: 40,
          canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some(item.filter) && myInfo.activator.canAddToHandFromDeck,
          prepare: defaultPrepare,
          execute: async (myInfo) => {
            const monsters = myInfo.activator.getDeckCell().cardEntities.filter(item.filter);
            if (!monsters.length) {
              return false;
            }
            const target = await myInfo.activator.waitSelectEntity(monsters, "手札に加えるカードを選択", false);
            if (!target) {
              return false;
            }
            await target.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
            myInfo.activator.getDeckCell().shuffle();
            return true;
          },
          settle: async () => true,
        } as CardActionDefinition<unknown>,
        defaultSpellTrapSetAction,
      ],
    };
  });

  yield* [
    {
      name: "戦士の生還",
      filter: (card: DuelEntity) => card.kind === "Monster" && card.types.includes("Warrior"),
      qty: 1,
    },
    {
      name: "ダーク・バースト",
      filter: (card: DuelEntity) => card.kind === "Monster" && card.attr.includes("Dark") && (card.atk ?? 9999) <= 1500,
      qty: 1,
    },
    {
      name: "悪夢再び",
      filter: (card: DuelEntity) => card.kind === "Monster" && card.attr.includes("Dark") && (card.def ?? 9999) === 0,
      qty: 2,
    },
    {
      name: "サルベージ",
      filter: (card: DuelEntity) => card.kind === "Monster" && card.attr.includes("Water") && (card.atk ?? 9999) <= 1500,
      qty: 2,
    },
    {
      name: "バッテリーリサイクル",
      filter: (card: DuelEntity) => card.kind === "Monster" && card.types.includes("Thunder") && (card.atk ?? 9999) <= 1500,
      qty: 2,
    },
    {
      name: "闇の量産工場",
      filter: (card: DuelEntity) => card.kind === "Monster" && (card.status.monsterCategories ?? []).includes("Normal"),
      qty: 2,
    },
  ].map((item) => {
    return {
      name: item.name,
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          hasToTargetCards: true,
          fixedTags: ["AddToHandFromGraveyard"],
          priorityForNPC: 40,
          canExecute: (myInfo) => myInfo.activator.getGraveyard().cardEntities.filter(item.filter).length >= item.qty,
          prepare: defaultPrepare,
          execute: async (myInfo) => {
            const monsters = myInfo.activator.getGraveyard().cardEntities.filter(item.filter);
            if (monsters.length === 0) {
              return false;
            }
            const target = await myInfo.activator.waitSelectEntities(monsters, item.qty, (list) => list.length === item.qty, "手札に加えるカードを選択", false);
            for (const monster of target ?? []) {
              await monster.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
            }
            return true;
          },
          settle: async () => true,
        } as CardActionDefinition<unknown>,
        defaultSpellTrapSetAction,
      ],
    };
  });
  yield* [
    {
      name: "トレード・イン",
      filter: (card: DuelEntity) => card.kind === "Monster" && (card.lvl ?? 0) === 8,
    },
    {
      name: "調和の宝札",
      filter: (card: DuelEntity) =>
        card.kind === "Monster" && (card.origin.monsterCategories ?? []).includes("Tuner") && card.types.includes("Dragon") && (card.atk ?? 9999) <= 1000,
    },
    {
      name: "デステニー・ドロー",
      filter: (card: DuelEntity) => card.kind === "Monster" && (card.origin.nameTags ?? []).includes("Ｄ－ＨＥＲＯ"),
    },
  ].map((item) => {
    return {
      name: item.name,
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          fixedTags: ["Draw"],
          priorityForNPC: 40,
          canPayCosts: (...args) => defaultCanPayDiscardCosts(...args, item.filter),
          canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 1,
          payCosts: async (...args) => defaultPayDiscardCosts(...args, item.filter),
          prepare: async () => {
            return { selectedEntities: [] };
          },
          execute: async (myInfo) => {
            await myInfo.activator.draw(2, myInfo.action.entity, myInfo.activator);
            return true;
          },
          settle: async () => true,
        } as CardActionDefinition<unknown>,
        defaultSpellTrapSetAction,
      ],
    };
  });
  yield* [
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
  ].map((item) => {
    return {
      name: item.name,
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          prepare: async () => {
            const [toSelf, toOpponent] = item.calcHeal();

            const tags: TActionTag[] = [];
            if (toSelf < 0) {
              tags.push("DamageToSelf");
            }
            if (toOpponent < 0) {
              tags.push("DamageToOpponent");
            }

            return { selectedEntities: [], chainBlockTags: tags };
          },
          execute: async (myInfo) => {
            const [toSelf, toOpponent] = item.calcHeal();
            if (toOpponent > 0) {
              myInfo.activator.getOpponentPlayer().heal(toOpponent, myInfo.action.entity);
            } else if (toOpponent < 0) {
              myInfo.activator.getOpponentPlayer().effectDamage(Math.abs(toOpponent), myInfo);
            }
            if (toSelf > 0) {
              myInfo.activator.heal(toSelf, myInfo.action.entity);
            } else if (toSelf < 0) {
              myInfo.activator.effectDamage(Math.abs(toSelf), myInfo);
            }
            return true;
          },
          settle: async () => true,
        } as CardActionDefinition<unknown>,
        defaultSpellTrapSetAction,
      ],
    };
  });
}

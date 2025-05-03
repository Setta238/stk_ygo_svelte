import { IllegalCancelError } from "@ygo_duel/class/Duel";
import type { CardAction, CardActionDefinition, TEffectTag } from "@ygo_duel/class/DuelCardAction";
import {} from "@ygo_duel/class/DuelEntityShortHands";

import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
  defaultRuleSpecialSummonValidate,
  defaultRuleSummonExecute,
  defaultRuleSummonPrepare,
  defaultSelfRebornExecute,
} from "@ygo_card/card_actions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { CardDefinition } from "@ygo_card/class/DuelCardDefinition";
import { createRegularProcFilterHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
import { damageStepPeriodKeys, duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { defaultEffectSpecialSummonExecute, defaultCanPaySelfBanishCosts, defaultPaySelfBanishCosts } from "../card_actions/DefaultCardAction";

export const createCardDefinitions_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  ["サイバー・ドラゴン", "六武衆のご隠居", "アンノウン・シンクロン"].forEach((name) =>
    result.push({
      name: name,
      actions: [
        defaultNormalSummonAction,
        defaultAttackAction,
        defaultBattlePotisionChangeAction,
        defaultFlipSummonAction,
        {
          title: "特殊召喚",
          isMandatory: false,
          playType: "SpecialSummon",
          spellSpeed: "Normal",
          executableCells: ["Hand"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          isOnlyNTimesPerDuel: name === "アンノウン・シンクロン" ? 1 : undefined,
          validate: (myInfo) => {
            const monsters = myInfo.action.entity.field.getMonstersOnFieldStrictly();
            if (monsters.length == 0 || monsters.some((m) => m.controller === myInfo.activator)) {
              return undefined;
            }

            return defaultRuleSpecialSummonValidate(myInfo, ["Attack", "Defense"], []);
          },
          prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "SpecialSummon", ["SpecialSummon", "Rule"], faceupBattlePositions),
          execute: defaultRuleSummonExecute,
          settle: async () => true,
        } as CardActionDefinition<unknown>,
      ] as CardActionDefinition<unknown>[],
    })
  );

  const def_ジャンク・フォアード = {
    name: "ジャンク・フォアード",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      {
        title: "特殊召喚",
        isMandatory: false,
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (myInfo.activator.getMonstersOnField().length) {
            return;
          }

          return defaultRuleSpecialSummonValidate(myInfo, faceupBattlePositions, []);
        },
        prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "SpecialSummon", ["SpecialSummon", "Rule"], faceupBattlePositions),
        execute: defaultRuleSummonExecute,
        settle: async () => true,
      } as CardActionDefinition<unknown>,
    ] as CardActionDefinition<unknown>[],
  };

  result.push(def_ジャンク・フォアード);

  const def_ディアボリックガイ = {
    name: "Ｄ－ＨＥＲＯ ディアボリックガイ",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      {
        title: "①リクルート",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        priorityForNPC: 10,
        canPayCosts: defaultCanPaySelfBanishCosts,
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.filter((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ").length === 0) {
            return;
          }

          const availableCells = myInfo.activator.getAvailableMonsterZones();
          return availableCells.length > 0 ? [] : undefined;
        },
        payCosts: defaultPaySelfBanishCosts,
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromDeck"], prepared: undefined };
        },
        execute: async (myInfo) => {
          const newOne = myInfo.activator.getDeckCell().cardEntities.find((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ");
          if (!newOne) {
            return false;
          }
          return defaultEffectSpecialSummonExecute(myInfo, [newOne]);
        },
        settle: async () => true,
      },
    ] as CardActionDefinition<unknown>[],
  };

  result.push(def_ディアボリックガイ);

  const def_ゾンビキャリア = {
    name: "ゾンビキャリア",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      {
        title: "①自己再生",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        canPayCosts: (myInfo) => myInfo.activator.getHandCell().cardEntities.length > 0,
        validate: (myInfo) => (myInfo.activator.getAvailableMonsterZones().length > 0 ? [] : undefined),
        payCosts: async (myInfo, chainBlockInfos, cancelable) => {
          const hands = myInfo.activator.getHandCell().cardEntities;
          const cost = await myInfo.activator.waitSelectEntity(hands, "デッキトップに戻すカードを一枚選択。", cancelable);
          if (!cost) {
            throw new IllegalCancelError(myInfo);
          }
          await cost.returnToDeck("Top", ["Cost"], myInfo.action.entity, myInfo.activator);
          return { returnToDeck: [cost] };
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
          myInfo.action.entity.info.willBeBanished = await defaultSelfRebornExecute(myInfo);
          return myInfo.action.entity.info.willBeBanished;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
    ] as CardActionDefinition<unknown>[],
  };

  result.push(def_ゾンビキャリア);

  const def_グローアップ・バルブ = {
    name: "グローアップ・バルブ",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      {
        title: "①自己再生",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerDuel: 1,
        canPayCosts: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0,
        validate: (myInfo) => (myInfo.activator.getAvailableMonsterZones().length > 0 ? [] : undefined),
        payCosts: async (myInfo) => {
          const cost = myInfo.activator.getDeckCell().cardEntities[0];
          await myInfo.activator.getDeckCell().cardEntities[0].sendToGraveyard(["Cost"], myInfo.action.entity, myInfo.activator);
          return { sendToGraveyard: [cost] };
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      } as CardActionDefinition<unknown>,
    ] as CardActionDefinition<unknown>[],
  };

  result.push(def_グローアップ・バルブ);
  const def_終末の騎士 = {
    name: "終末の騎士",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      {
        title: "①墓地送り",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (!myInfo.action.entity.hasBeenSummonedNow(["NormalSummon", "SpecialSummon", "FlipSummon"])) {
            return;
          }
          if (myInfo.activator.getDeckCell().cardEntities.filter((card) => card.attr.includes("Dark")).length === 0) {
            return;
          }
          return [];
        },
        prepare: async (myInfo) => {
          const tags = ["SendToGraveyardFromDeck"] as TEffectTag[];

          if (myInfo.action.entity.moveLog.latestRecord.movedAs.includes("NormalSummon")) {
            tags.push("IfNormarlSummonSucceed");
          } else {
            tags.push("IfSpecialSummonSucceed");
          }
          return { selectedEntities: [], chainBlockTags: tags, prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
          const choices = myInfo.activator.getDeckCell().cardEntities.filter((card) => card.attr.includes("Dark"));
          if (choices.length === 0) {
            return false;
          }
          await myInfo.action.entity.field.sendToGraveyard(
            "墓地に送るモンスターを選択",
            myInfo.activator,
            choices,
            1,
            (list) => list.length === 1,
            ["Effect"],
            myInfo.action.entity,
            false
          );
          myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<undefined>,
    ] as CardActionDefinition<unknown>[],
  };

  result.push(def_終末の騎士);
  const def_マスマティシャン = {
    name: "マスマティシャン",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      {
        title: "①墓地送り",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (!myInfo.action.entity.hasBeenSummonedNow(["NormalSummon"])) {
            return;
          }
          if (!myInfo.activator.getDeckCell().cardEntities.find((card) => (card.lvl ?? 5) < 5)) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["IfNormarlSummonSucceed", "SendToGraveyardFromDeck"], prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
          const choices = myInfo.activator.getDeckCell().cardEntities.filter((card) => (card.lvl ?? 5) < 5);
          if (choices.length === 0) {
            return false;
          }
          await myInfo.action.entity.field.sendToGraveyard(
            "墓地に送るモンスターを選択",
            myInfo.activator,
            choices,
            1,
            (list) => list.length === 1,
            ["Effect"],
            myInfo.action.entity,
            false
          );
          myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<undefined>,
      {
        title: "②ドロー",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (myInfo.action.entity.face === "FaceDown") {
            return;
          }
          if (!myInfo.action.entity.moveLog.latestRecord.movedAs.includes("BattleDestroy")) {
            return;
          }
          if (!myInfo.action.entity.wasMovedAtPreviousChain) {
            return;
          }
          if (myInfo.activator.getDeckCell().cardEntities.length === 0) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw"], prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<undefined>,
    ] as CardActionDefinition<unknown>[],
  };

  result.push(def_マスマティシャン);

  const def_ライトロード・ビーストウォルフ = {
    name: "ライトロード・ビースト ウォルフ",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      {
        title: "①自己再生",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          // 前回のチェーンで動いたかどうか
          if (!myInfo.action.entity.wasMovedAtPreviousChain) {
            return;
          }
          // 前回のチェーンで動いたとき、デッキからだったかどうか
          if (myInfo.action.entity.wasMovedFrom.cellType !== "Deck") {
            return;
          }
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            [{ monster: myInfo.action.entity, posList: faceupBattlePositions, cells }],
            [],
            false
          );

          return list.length ? [] : undefined;
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      },
    ] as CardActionDefinition<unknown>[],
  };
  result.push(def_ライトロード・ビーストウォルフ);

  const def_伝説の白石 = {
    name: "伝説の白石",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      defaultNormalSummonAction,
      {
        title: "①サーチ",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          // 前回のチェーンで動いたかどうか
          if (!myInfo.action.entity.wasMovedAtPreviousChain) {
            return;
          }
          // 前回のチェーンで動いたとき、除外から動いていたら対象外（※墓地に戻すではこの手の効果は発動しない）
          if (myInfo.action.entity.wasMovedFrom.cellType === "Banished") {
            return;
          }
          return myInfo.activator.getDeckCell().cardEntities.find((card) => card.nm === "青眼の白龍") ? [] : undefined;
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
          // 青眼の白龍固定なので、一枚見つけたらそれでよい。
          const monster = myInfo.activator.getDeckCell().cardEntities.find((card) => card.nm === "青眼の白龍");
          if (!monster) {
            return false;
          }
          await monster.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<undefined>,
    ] as CardActionDefinition<unknown>[],
  };
  result.push(def_伝説の白石);

  const def_うららわらし = [
    {
      name: "灰流うらら",
      chainBlockTags: ["Draw", "SearchFromDeck", "SendToGraveyardFromDeck", "SpecialSummonFromDeck"],
    },
    {
      name: "屋敷わらし",
      chainBlockTags: ["BanishFromGraveyard", "SpecialSummonFromGraveyard", "AddToHandFromGraveyard"],
    },
  ] as { name: string; chainBlockTags: TEffectTag[] }[];

  def_うららわらし.forEach((item) => {
    result.push({
      name: item.name,
      actions: [
        defaultAttackAction,
        defaultBattlePotisionChangeAction,
        defaultFlipSummonAction,
        defaultNormalSummonAction,
        {
          title: "①無効化",
          isMandatory: false,
          playType: "QuickEffect",
          spellSpeed: "Quick",
          executableCells: ["Hand"],
          executablePeriods: freeChainDuelPeriodKeys,
          executableDuelistTypes: ["Controller"],
          isOnlyNTimesPerTurn: 1,
          negatePreviousBlock: true,
          canPayCosts: (myInfo) => myInfo.activator.canDiscard([myInfo.action.entity]),
          validate: (myInfo, chainBlockInfos): DuelFieldCell[] | undefined => {
            if (chainBlockInfos.length === 0) {
              return;
            }

            const info = chainBlockInfos[myInfo.index - 1];

            return info.chainBlockTags.union(item.chainBlockTags).length > 0 ? [] : undefined;
          },
          payCosts: async (myInfo) => {
            await myInfo.action.entity.discard(["Cost"], myInfo.action.entity, myInfo.activator);
            return { sendToGraveyard: [myInfo.action.entity] };
          },
          prepare: async () => {
            return { selectedEntities: [], chainBlockTags: ["NegateCardEffect"], prepared: undefined };
          },
          execute: async (myInfo, chainBlockInfos): Promise<boolean> => {
            const info = chainBlockInfos[myInfo.index - 1];
            info.isNegatedEffectBy = myInfo.action as CardAction<unknown>;
            return true;
          },
          settle: async () => true,
        } as CardActionDefinition<undefined>,
      ] as CardActionDefinition<unknown>[],
    });
  });

  ["翻弄するエルフの剣士", "ロードランナー", "氷結界の修験者"].forEach((name) => {
    result.push({
      name: name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction, defaultNormalSummonAction] as CardActionDefinition<unknown>[],
      continuousEffects: [
        createRegularProcFilterHandler(
          "①戦闘破壊耐性",
          "Monster",
          (source) => [source],
          () => true,
          (source) => {
            return [
              new ProcFilter(
                "①戦闘破壊耐性",
                () => true,
                true,
                source,
                {},
                () => true,
                ["BattleDestroy"],
                (activator, enemy) => {
                  if (!source.isEffective) {
                    return true;
                  }

                  if ((enemy.atk ?? 0) < 1900) {
                    return true;
                  }

                  source.duel.log.info(`${source.toString()}は攻撃力1900以上のモンスターとの先頭では破壊されない。`, source.controller);
                  return false;
                }
              ),
            ];
          }
        ),
      ] as ContinuousEffectBase<unknown>[],
    });
  });

  return result;
};

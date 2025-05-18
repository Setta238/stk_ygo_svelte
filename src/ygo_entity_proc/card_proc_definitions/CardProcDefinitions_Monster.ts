import { IllegalCancelError } from "@ygo_duel/class/Duel";
import type { EntityAction, TEffectTag } from "@ygo_duel/class/DuelEntityAction";
import {} from "@ygo_duel/class/DuelEntityShortHands";

import {
  canSelfSepcialSummon,
  defaultRuleSummonExecute,
  defaultRuleSummonPrepare,
  defaultSelfRebornExecute,
  getDestsForSelfSpecialSummon,
} from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { createRegularProcFilterHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
import { damageStepPeriodKeys, duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";

export default function* generate(): Generator<EntityProcDefinition> {
  yield* ["サイバー・ドラゴン", "六武衆のご隠居", "アンノウン・シンクロン"].map((name): EntityProcDefinition => {
    return {
      name: name,
      actions: [
        {
          title: "特殊召喚",
          isMandatory: false,
          playType: "SpecialSummon",
          spellSpeed: "Normal",
          executableCells: ["Hand"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          isOnlyNTimesPerDuel: name === "アンノウン・シンクロン" ? 1 : undefined,
          canExecute: (myInfo) => {
            const monsters = myInfo.action.entity.field.getMonstersOnFieldStrictly();
            return (
              monsters.length > 0 &&
              monsters.every((m) => m.controller !== myInfo.activator) &&
              canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Rule"])
            );
          },
          getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Rule"]),
          prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "SpecialSummon", ["SpecialSummon", "Rule"], faceupBattlePositions),
          execute: defaultRuleSummonExecute,
          settle: async () => true,
        },
      ],
    };
  });
  yield {
    name: "ジャンク・フォアード",
    actions: [
      {
        title: "特殊召喚",
        isMandatory: false,
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        canExecute: (myInfo) => myInfo.activator.getMonstersOnField().length === 0 && canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Rule"]),
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Rule"]),
        prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "SpecialSummon", ["SpecialSummon", "Rule"], faceupBattlePositions),
        execute: defaultRuleSummonExecute,
        settle: async () => true,
      },
    ],
  };

  yield {
    name: "ゾンビキャリア",
    actions: [
      {
        title: "①自己再生",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        canPayCosts: (myInfo) => myInfo.activator.getHandCell().cardEntities.length > 0,
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
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
        execute: async (myInfo) => {
          if (!(await defaultSelfRebornExecute(myInfo))) {
            return false;
          }

          myInfo.action.entity.statusOperatorBundle.push(
            new StatusOperator(
              "除外予定",
              () => true,
              false,
              myInfo.action.entity,
              myInfo.action,
              (ope, target) => target.isOnFieldAsMonsterStrictly && target.face === "FaceUp",
              (ope, wip) => {
                return { ...wip, willBeBanished: true };
              }
            )
          );

          return true;
        },
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "グローアップ・バルブ",
    actions: [
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
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
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
      },
    ],
  };
  yield {
    name: "終末の騎士",
    actions: [
      {
        title: "①墓地送り",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenSummonedNow(["NormalSummon", "SpecialSummon", "FlipSummon"]),
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.attr.includes("Dark")),
        prepare: async (myInfo) => {
          const tags = ["SendToGraveyardFromDeck"] as TEffectTag[];

          if (myInfo.action.entity.moveLog.latestRecord.movedAs.includes("NormalSummon")) {
            tags.push("IfNormarlSummonSucceed");
          } else if (myInfo.action.entity.moveLog.latestRecord.movedAs.includes("SpecialSummon")) {
            tags.push("IfSpecialSummonSucceed");
          }
          return { selectedEntities: [], chainBlockTags: tags, prepared: undefined };
        },
        execute: async (myInfo) => {
          const choices = myInfo.activator.getDeckCell().cardEntities.filter((card) => card.attr.includes("Dark"));
          if (choices.length === 0) {
            return false;
          }

          const monster = await myInfo.activator.waitSelectEntity(choices, "墓地に送るモンスターを選択", false);
          if (!monster) {
            throw new IllegalCancelError(myInfo);
          }
          await monster.sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "マスマティシャン",
    actions: [
      {
        title: "①墓地送り",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenSummonedNow(["NormalSummon"]),
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.lvl && card.lvl < 5),
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["IfNormarlSummonSucceed", "SendToGraveyardFromDeck"], prepared: undefined };
        },
        execute: async (myInfo) => {
          const choices = myInfo.activator.getDeckCell().cardEntities.filter((card) => card.lvl && card.lvl < 5);
          if (choices.length === 0) {
            return false;
          }
          const monster = await myInfo.activator.waitSelectEntity(choices, "墓地に送るモンスターを選択", false);
          if (!monster) {
            throw new IllegalCancelError(myInfo);
          }
          await monster.sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
      {
        title: "②ドロー",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) =>
          myInfo.action.entity.moveLog.latestRecord.movedAs.includes("BattleDestroy") && myInfo.action.entity.wasMovedAtPreviousChain,
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0 && myInfo.activator.canDraw,
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw"], prepared: undefined };
        },
        execute: async (myInfo) => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "ライトロード・ビースト ウォルフ",
    actions: [
      {
        title: "①自己再生",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.action.entity.wasMovedFrom.cellType === "Deck" && myInfo.action.entity.wasMovedAtPreviousChain,
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "伝説の白石",
    actions: [
      {
        title: "①サーチ",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.action.entity.wasMovedAtPreviousChain && myInfo.action.entity.wasMovedFrom.cellType !== "Banished",
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.nm === "青眼の白龍") && myInfo.activator.canAddToHandFromDeck,
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
        execute: async (myInfo) => {
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
      },
    ],
  };

  for (const item of [
    {
      name: "灰流うらら",
      chainBlockTags: ["Draw", "SearchFromDeck", "SendToGraveyardFromDeck", "SpecialSummonFromDeck"],
    },
    {
      name: "屋敷わらし",
      chainBlockTags: ["BanishFromGraveyard", "SpecialSummonFromGraveyard", "AddToHandFromGraveyard"],
    },
  ] as { name: string; chainBlockTags: TEffectTag[] }[]) {
    yield {
      name: item.name,
      actions: [
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
          canExecute: (myInfo) => (myInfo.targetChainBlock && myInfo.targetChainBlock.chainBlockTags.union(item.chainBlockTags).length > 0) ?? false,
          payCosts: async (myInfo) => {
            await myInfo.action.entity.discard(["Cost"], myInfo.action.entity, myInfo.activator);
            return { sendToGraveyard: [myInfo.action.entity] };
          },
          prepare: async () => {
            return { selectedEntities: [], chainBlockTags: ["NegateCardEffect"], prepared: undefined };
          },
          execute: async (myInfo, chainBlockInfos) => {
            const info = chainBlockInfos[myInfo.index - 1];
            info.isNegatedEffectBy = myInfo.action as EntityAction<unknown>;
            return true;
          },
          settle: async () => true,
        },
      ],
    };
  }
  for (const name of ["翻弄するエルフの剣士", "ロードランナー", "氷結界の修験者"]) {
    yield {
      name: name,
      actions: [],
      continuousEffects: [
        createRegularProcFilterHandler(
          "①戦闘破壊耐性",
          "Monster",
          (source) => [source],
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
        ) as ContinuousEffectBase<unknown>,
      ],
    };
  }
}

import { IllegalCancelError, DuelError, IllegalActionError } from "@ygo_duel/class_error/DuelError";
import type { EntityAction, TActionTag } from "@ygo_duel/class/DuelEntityAction";
import {} from "@ygo_duel/class/DuelEntityShortHands";

import {
  canSelfSepcialSummon,
  defaultRuleSummonExecute,
  defaultRuleSummonPrepare,
  defaultSelfSpecialSummonExecute,
  getDestsForSelfSpecialSummon,
} from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { createRegularProcFilterHandler } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
import { damageStepPeriodKeys, duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";

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
        executableFaces: ["FaceUp"],
        fixedTags: ["SpecialSummonFromGraveyard"],
        canPayCosts: (myInfo) => myInfo.activator.getHandCell().cardEntities.length > 0,
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        payCosts: async (myInfo, chainBlockInfos, cancelable) => {
          const hands = myInfo.activator.getHandCell().cardEntities;
          const cost = await myInfo.activator.waitSelectEntity(hands, "デッキトップに戻すカードを一枚選択。", cancelable);
          if (!cost) {
            throw new IllegalCancelError(myInfo);
          }
          await cost.returnToDeck("Top", ["Cost"], myInfo.action.entity, myInfo.activator);
          return { returnToDeck: [{ cost, cell: myInfo.activator.getHandCell() }] };
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (!(await defaultSelfSpecialSummonExecute(myInfo))) {
            return false;
          }

          myInfo.action.entity.statusOperatorBundle.push(
            new StatusOperator({
              title: "除外予定",
              validateAlive: () => true,
              isContinuous: false,
              isSpawnedBy: myInfo.action.entity,
              actionAttr: myInfo.action,
              isApplicableTo: (ope, target) => target.isOnFieldAsMonsterStrictly && target.face === "FaceUp",
              statusCalculator: () => {
                return { willBeBanished: true };
              },
            }),
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
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerDuel: 1,
        fixedTags: ["SpecialSummonFromGraveyard"],
        canPayCosts: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0,
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        payCosts: async (myInfo) => {
          const cost = myInfo.activator.getDeckCell().cardEntities[0];
          const costInfo = { cost, cell: cost.cell };
          await cost.sendToGraveyard(["Cost"], myInfo.action.entity, myInfo.activator);
          return { sendToGraveyard: [costInfo] };
        },
        prepare: defaultPrepare,
        execute: (myInfo) => defaultSelfSpecialSummonExecute(myInfo),
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "スポーア",
    actions: [
      {
        title: "①自己再生",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerDuel: 1,
        fixedTags: ["SpecialSummonFromGraveyard"],
        canPayCosts: (myInfo) =>
          myInfo.activator
            .getGraveyard()
            .cardEntities.filter((monster) => monster.types.includes("Plant"))
            .filter((monster) => monster.kind === "Monster")
            .filter((monster) => (monster.lvl ?? 0) > 0)
            .filter((monster) => monster !== myInfo.action.entity)
            .some((plant) => plant.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action)),
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        payCosts: async (myInfo, chainBlockInfos, cancelable) => {
          const costs = myInfo.activator
            .getGraveyard()
            .cardEntities.filter((monster) => monster.types.includes("Plant"))
            .filter((monster) => monster.kind === "Monster")
            .filter((monster) => (monster.lvl ?? 0) > 0)
            .filter((monster) => monster !== myInfo.action.entity)
            .filter((plant) => plant.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action));
          const cost = await myInfo.activator.waitSelectEntity(costs, "コストとして除外するモンスターを選択。", cancelable);
          if (!cost) {
            return;
          }
          const costInfo = { cost, cell: cost.cell };
          await cost.banish(["Cost"], myInfo.action.entity, myInfo.activator);
          return { banish: [costInfo] };
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const costInfo = myInfo.costInfo.banish?.[0];

          if (!costInfo) {
            throw new IllegalActionError("IllegalActionCost", myInfo);
          }

          const lvl = costInfo.cost.lvl ?? 0;

          const result = await defaultSelfSpecialSummonExecute(myInfo);

          if (!result) {
            return false;
          }

          myInfo.action.entity.numericOprsBundle.push(
            NumericStateOperator.createLingeringAddition(
              "レベル上昇",
              (ope) => ope.isSpawnedBy.isEffective,
              myInfo.action.entity,
              myInfo.action,
              "level",
              (spawner, target, current) => current + lvl,
            ),
          );

          return result;
        },
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
        triggerPattern: { triggerType: "Arrival", arrivalReasons: ["NormalSummon", "SpecialSummon", "FlipSummon"] },
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.attr.includes("Dark")),
        prepare: async (myInfo) => {
          const tags = ["SendToGraveyardFromDeck"] as TActionTag[];

          if (myInfo.action.entity.moveLog.latestRecord.movedAs.includes("NormalSummon")) {
            tags.push("IfNormarlSummonSucceed");
          } else if (myInfo.action.entity.moveLog.latestRecord.movedAs.includes("SpecialSummon")) {
            tags.push("IfSpecialSummonSucceed");
          }
          return { selectedEntities: [], chainBlockTags: tags };
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
        triggerPattern: { triggerType: "Arrival", arrivalReasons: ["NormalSummon"] },
        fixedTags: ["IfNormarlSummonSucceed", "SendToGraveyardFromDeck"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.lvl && card.lvl < 5),
        prepare: defaultPrepare,
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
        triggerPattern: { triggerType: "Departure", needsByBattle: true, needsByDestory: true },
        fixedTags: ["Draw"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0 && myInfo.activator.canDraw,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);

          return true;
        },
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
        triggerPattern: { triggerType: "Departure" },
        fixedTags: ["SearchFromDeck"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.nm === "青眼の白龍") && myInfo.activator.canAddToHandFromDeck,
        prepare: defaultPrepare,
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
  ] as { name: string; chainBlockTags: TActionTag[] }[]) {
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
          fixedTags: ["NegateCardEffect"],
          canPayCosts: (myInfo) => myInfo.activator.canDiscard([myInfo.action.entity]),
          canExecute: (myInfo) => (myInfo.targetChainBlock && myInfo.targetChainBlock.chainBlockTags.union(item.chainBlockTags).length > 0) ?? false,
          payCosts: async (myInfo) => {
            await myInfo.action.entity.discard(["Cost"], myInfo.action.entity, myInfo.activator);
            return { sendToGraveyard: [{ cost: myInfo.action.entity, cell: myInfo.activator.getHandCell() }] };
          },
          prepare: defaultPrepare,
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
              ProcFilter.createContinuous(
                "①戦闘破壊耐性",
                () => true,
                source,
                () => true,
                ["BattleDestroy"],
                (bundleOwner, activator, enemy) => {
                  if (!source.isEffective) {
                    return true;
                  }

                  if ((enemy.atk ?? 0) < 1900) {
                    return true;
                  }

                  source.duel.log.info(`${source.toString()}は攻撃力1900以上のモンスターとの戦闘では破壊されない。`, source.controller);
                  return false;
                },
              ),
            ];
          },
        ),
      ],
    };
  }
}

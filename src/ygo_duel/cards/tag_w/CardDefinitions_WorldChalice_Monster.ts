import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
  defaultSelfReleaseCanPayCosts,
  defaultSelfReleasePayCosts,
} from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "@ygo_duel/cards/CardDefinitions";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { SystemError } from "@ygo_duel/class/Duel";
import { defaultCanPaySelfBanishCosts, defaultPaySelfBanishCosts, defaultPrepare } from "../DefaultCardAction";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export const createCardDefinitions_WorldChalice_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
    name: "星杯の妖精リース",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      defaultNormalSummonAction,
      {
        title: "①サーチ",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (!myInfo.action.entity.hasBeenSummonedNow(["NormalSummon", "SpecialSummon"])) {
            return;
          }
          if (
            myInfo.activator
              .getDeckCell()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.status.nameTags?.includes("星杯")).length === 0
          ) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
          const choices = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.kind === "Monster")
            .filter((card) => card.status.nameTags?.includes("星杯"));
          if (choices.length === 0) {
            return false;
          }
          const monster = await myInfo.activator.waitSelectEntity(choices, "手札に加えるモンスターを選択", false);
          if (!monster) {
            throw new SystemError("想定されない状態", myInfo);
          }

          await monster.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      {
        title: "②自己サルベージ",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        canPayCosts: (myInfo) =>
          myInfo.activator
            .getMonstersOnField()
            .some((monster) => monster.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, ["SendToGraveyardAsCost"], myInfo.action)),
        validate: () => [],
        payCosts: async (myInfo) => {
          const choices = myInfo.activator
            .getMonstersOnField()
            .filter((monster) => monster.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, ["SendToGraveyardAsCost"], myInfo.action));
          const cost = await myInfo.activator.waitSelectEntity(choices, "墓地に送るモンスターを選択。", true);
          if (!cost) {
            return;
          }
          await cost.sendToGraveyard(["Cost"], myInfo.action.entity, myInfo.activator);
          return { sendToGraveyard: [cost] };
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
        execute: async (myInfo) => {
          if (myInfo.action.entity.wasMovedAfter(myInfo.isActivatedAt)) {
            return false;
          }

          await myInfo.action.entity.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
    ],
  });
  result.push({
    name: "星遺物－『星杯』",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      defaultNormalSummonAction,
      {
        title: "①墓地送り",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        canPayCosts: defaultSelfReleaseCanPayCosts,
        validate: (myInfo) =>
          myInfo.activator.duel.field.moveLog
            .getPriviousChainLog()
            .filter((record) => record.movedAs.includes("SpecialSummon"))
            .map((record) => record.entity)
            .some((entity) => entity.wasMovedFrom.cellType === "ExtraDeck")
            ? []
            : undefined,
        payCosts: defaultSelfReleasePayCosts,
        prepare: defaultPrepare,
        execute: async (myInfo): Promise<boolean> => {
          const monsters = myInfo.activator.duel.field.moveLog
            .getPriviousChainLog()
            .filter((record) => record.movedAs.includes("SpecialSummon"))
            .map((record) => record.entity)
            .filter((entity) => entity.wasMovedFrom.cellType === "ExtraDeck")
            .filter((entity) => entity.isOnFieldAsMonster)
            .filter((entity) => entity.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action))
            .toArray();

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(monsters, ["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      {
        title: "②リクルート",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Hand", "Graveyard", "Banished"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (!myInfo.action.entity.wasMovedAtPreviousChain) {
            return;
          }
          if (!myInfo.action.entity.info.summonKinds.includes("NormalSummon")) {
            return;
          }
          if (myInfo.action.entity.moveLog.previousPlaceRecord.face === "FaceDown") {
            return;
          }
          const monsters = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.kind === "Monster")
            .filter((card) => card.status.nameTags?.includes("星杯"))
            .filter((card) => card.nm !== "星遺物－『星杯』");
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            monsters.map((monster) => {
              return {
                monster,
                cells,
                posList: faceupBattlePositions,
              };
            }),
            [],
            false
          );
          return list.length > 1 ? [] : undefined;
        },
        payCosts: defaultSelfReleasePayCosts,
        prepare: defaultPrepare,
        execute: async (myInfo): Promise<boolean> => {
          const monsters = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.kind === "Monster")
            .filter((card) => card.status.nameTags?.includes("星杯"))
            .filter((card) => card.nm !== "星遺物－『星杯』");
          const cells = myInfo.activator.getMonsterZones();
          const summoned =
            (await myInfo.activator.summonMany(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              monsters.map((monster) => {
                return {
                  monster,
                  cells,
                  posList: faceupBattlePositions,
                };
              }),
              [],
              false,
              (summoned) => summoned.length == 2,
              false
            )) ?? [];
          return summoned.length == 2;
        },
        settle: async () => true,
      },
      {
        title: "③サーチ",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        canPayCosts: defaultCanPaySelfBanishCosts,
        validate: (myInfo) => {
          if (myInfo.action.entity.wasMovedAtCurrentTurn) {
            return;
          }
          return myInfo.activator.getDeckCell().cardEntities.filter((card) => card.status.nameTags?.includes("星遺物")).length > 0 ? [] : undefined;
        },
        payCosts: defaultPaySelfBanishCosts,
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
        execute: async (myInfo) => {
          const selected = await myInfo.activator.waitSelectEntity(
            myInfo.activator.getDeckCell().cardEntities.filter((card) => card.status.nameTags?.includes("星遺物")),
            "手札に加えるカードを選択",
            false
          );

          if (!selected) {
            return false;
          }

          await selected.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
    ],
  });
  return result;
};

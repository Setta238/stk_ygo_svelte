import { defaultSelfReleaseCanPayCosts, defaultSelfReleasePayCosts } from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { SystemError } from "@ygo_duel/class/Duel";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { TActionTag } from "@ygo_duel/class/DuelEntityAction";
import { getPaySelfBanishCostsActionPartical } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Banish";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "星杯の妖精リース",
    actions: [
      {
        title: "①サーチ",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        fixedTags: ["SearchFromDeck"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenArrivalNow(["NormalSummon", "SpecialSummon"]),
        canExecute: (myInfo) =>
          myInfo.activator.canAddToHandFromDeck &&
          myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .some((card) => card.status.nameTags?.includes("星杯")),
        prepare: async (myInfo) => {
          const chainBlockTags: TActionTag[] = myInfo.action.entity.hasBeenArrivalNow(["NormalSummon"])
            ? ["IfNormarlSummonSucceed"]
            : ["IfSpecialSummonSucceed"];
          return { selectedEntities: [], chainBlockTags };
        },
        execute: async (myInfo) => {
          const choices = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((card) => card.status.nameTags?.includes("星杯"));
          if (choices.length === 0) {
            return false;
          }
          const monster = await myInfo.activator.waitSelectEntity(choices, "手札に加えるモンスターを選択", false);
          if (!monster) {
            throw new SystemError("想定されない状態", myInfo);
          }

          await monster.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();

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
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurn: 1,
        canPayCosts: (myInfo) =>
          [...myInfo.activator.getMonstersOnField(), ...myInfo.activator.getHandCell().cardEntities.filter((card) => card.kind === "Monster")].some((monster) =>
            monster.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, "SendToGraveyardAsCost", myInfo.action)
          ),
        payCosts: async (myInfo) => {
          const choices = [
            ...myInfo.activator.getMonstersOnField(),
            ...myInfo.activator.getHandCell().cardEntities.filter((card) => card.kind === "Monster"),
          ].filter((monster) => monster.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, "SendToGraveyardAsCost", myInfo.action));
          const cost = await myInfo.activator.waitSelectEntity(choices, "墓地に送るモンスターを選択。", true);
          if (!cost) {
            return;
          }

          const costInfo = { cost, cell: cost.cell };
          await cost.sendToGraveyard(["Cost"], myInfo.action.entity, myInfo.activator);
          return { sendToGraveyard: [costInfo] };
        },
        fixedTags: ["SearchFromDeck"],
        prepare: defaultPrepare,
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
  };

  yield {
    name: "星遺物－『星杯』",
    actions: [
      {
        title: "①墓地送り",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        canPayCosts: defaultSelfReleaseCanPayCosts,
        canExecute: (myInfo) =>
          myInfo.activator.duel.field.moveLog
            .getPriviousChainLog()
            .filter((record) => record.movedAs.includes("SpecialSummon"))
            .map((record) => record.entity)
            .some((entity) => entity.wasMovedFrom.cellType === "ExtraDeck"),
        payCosts: defaultSelfReleasePayCosts,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const monsters = myInfo.activator.duel.field.moveLog
            .getPriviousChainLog()
            .filter((record) => record.movedAs.includes("SpecialSummon"))
            .map((record) => record.entity)
            .filter((entity) => entity.wasMovedFrom.cellType === "ExtraDeck")
            .filter((entity) => entity.isOnFieldAsMonsterStrictly)
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
        meetsConditions: (myInfo) =>
          myInfo.action.entity.wasMovedAtPreviousChain &&
          myInfo.action.entity.info.summonKinds.includes("NormalSummon") &&
          myInfo.action.entity.moveLog.previousPlaceRecord.face === "FaceUp",
        canExecute: (myInfo) => {
          const monsters = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((card) => card.status.nameTags?.includes("星杯"))
            .filter((card) => card.nm !== "星遺物－『星杯』");
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            monsters.map((monster) => ({
              monster,
              cells,
              posList: faceupBattlePositions,
            })),
            [],
            false
          );
          return list.length > 1 && list.flatMap((sc) => sc.cells).getDistinct().length > 1;
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const monsters = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
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
              2,
              (summoned) => summoned.length == 2,
              false
            )) ?? [];
          if (!summoned.length) {
            return false;
          }
          myInfo.activator.getDeckCell().shuffle();

          return true;
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
        executableFaces: ["FaceUp"],
        ...getPaySelfBanishCostsActionPartical(),
        meetsConditions: (myInfo) => !myInfo.action.entity.wasMovedAtCurrentTurn,
        canExecute: (myInfo) =>
          myInfo.activator.canAddToHandFromDeck &&
          myInfo.activator.getDeckCell().cardEntities.filter((card) => card.status.nameTags?.includes("星遺物")).length > 0,
        fixedTags: ["SearchFromDeck"],
        prepare: defaultPrepare,
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
  };
}

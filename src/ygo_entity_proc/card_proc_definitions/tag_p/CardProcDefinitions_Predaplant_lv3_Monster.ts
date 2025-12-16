import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { getPaySendToGraveyardCostsActionPartical } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_SendToGraveyard";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "捕食植物オフリス・スコーピオ",
    actions: [
      {
        title: "捕食植物リクルート",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Arrival", arrivalReasons: ["NormalSummon", "SpecialSummon", "FlipSummon"] },
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurn: 1,
        fixedTags: ["SpecialSummonFromDeck"],
        ...getPaySendToGraveyardCostsActionPartical(["Hand"], (entity) => entity.kind === "Monster", 1),
        canExecute: (myInfo) => {
          const plants = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((monster) => monster.status.nameTags?.includes("捕食植物"))
            .filter((monster) => monster.nm !== "捕食植物オフリス・スコーピオ");
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            plants.map((monster) => ({ monster, posList: faceupBattlePositions, cells })),
            [],
            false
          );
          return list.length > 0;
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const plants = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((monster) => monster.status.nameTags?.includes("捕食植物"))
            .filter((monster) => monster.nm !== "捕食植物オフリス・スコーピオ");

          const cells = myInfo.activator.getMonsterZones();
          const monster = await myInfo.activator.summonOne(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            plants.map((monster) => ({ monster, posList: faceupBattlePositions, cells })),
            [],
            false,
            false
          );
          if (!monster) {
            return false;
          }

          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "捕食植物ダーリング・コブラ",
    actions: [
      {
        title: "融合サーチ",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: {
          triggerType: "Arrival",
          arrivalReasons: ["NormalSummon", "SpecialSummon", "FlipSummon"],
          causerFilter: (me, causer) => causer.nm.includes("捕食植物") && causer.kind === "Monster",
        },
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerDuel: 1,
        fixedTags: ["SearchFromDeck"],
        canExecute: (myInfo) =>
          myInfo.activator.canAddToHandFromDeck &&
          myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Spell")
            .some((spell) => spell.status.nameTags?.includes("融合") || spell.status.nameTags?.includes("フュージョン")),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (!myInfo.activator.canAddToHandFromDeck) {
            return false;
          }
          const spells = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Spell")
            .filter((spell) => spell.status.nameTags?.includes("融合") || spell.status.nameTags?.includes("フュージョン"));
          if (!spells.length) {
            return false;
          }
          const target = await myInfo.activator.waitSelectEntity(spells, "手札に加えるカードを選択", false);
          if (!target) {
            return false;
          }
          await target.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

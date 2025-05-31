import { defaultSelfReleaseCanPayCosts, defaultSelfReleasePayCosts } from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { monsterZoneCellTypes, playFieldCellTypes, trashCellTypes } from "@ygo_duel/class/DuelFieldCell";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "死霊騎士デスカリバー・ナイト",
    actions: [
      {
        title: "①モンスター効果無効",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        negatePreviousBlock: true,
        canPayCosts: defaultSelfReleaseCanPayCosts,
        canExecute: (myInfo) =>
          Boolean(myInfo.targetChainBlock && myInfo.targetChainBlock.action.entity.isMonster && myInfo.targetChainBlock.action.isWithChainBlock),
        payCosts: defaultSelfReleasePayCosts,
        prepare: async (myInfo, chainBlockInfos) => {
          const target = myInfo.targetChainBlock;
          const prev = chainBlockInfos[myInfo.index - 1];

          if (target !== prev) {
            return { selectedEntities: [] };
          }

          return {
            selectedEntities: [],
            chainBlockTags: ["NegateCardEffect", ...myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, [target.action.entity])],
            prepared: undefined,
          };
        },
        execute: async (myInfo, chainBlockInfos) => {
          const trigger = chainBlockInfos.find((info) => info.action.entity.isMonster && info.action.isWithChainBlock);
          const prev = chainBlockInfos[myInfo.index - 1];

          if (prev !== trigger) {
            return false;
          }

          prev.isNegatedActivationBy = myInfo.action;

          await DuelEntityShortHands.tryDestroy([prev.action.entity], myInfo);

          return true;
        },
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "Ｇ・コザッキー",
    actions: [
      {
        title: "自滅ダメージ",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: trashCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Departure", from: playFieldCellTypes },
        meetsConditions: (myInfo) => myInfo.action.entity.moveLog.previousPlaceRecord.face === "FaceUp",
        prepare: async (myInfo) => {
          const record = myInfo.action.entity.moveLog.previousPlaceRecord;
          if (record.cell.owner !== myInfo.action.entity.controller) {
            return { chainBlockTags: ["DamageToOpponent"] };
          }
          return { chainBlockTags: ["DamageToSelf"] };
        },
        execute: async (myInfo) => {
          const duelist = myInfo.chainBlockTags.includes("DamageToOpponent") ? myInfo.activator.getOpponentPlayer() : myInfo.activator;
          return duelist.effectDamage(myInfo.action.entity.origin.attack ?? 0, myInfo).length > 0;
        },
        settle: async () => true,
      },
    ],
    immediatelyActions: [
      {
        title: "自壊",
        executableCells: ["MonsterZone"],
        executablePeriods: duelPeriodKeys.filter(
          (key) => key !== "b1DBeforeDmgCalc" && key !== "b2DBeforeDmgCalc" && key !== "b1DDmgCalc" && key !== "b2DDmgCalc"
        ),
        execute: async (action) => {
          if (action.entity.field.getCardsOnFieldStrictly().some((card) => card.nm === "コザッキー")) {
            return;
          }
          if (!action.entity.isEffective) {
            return;
          }

          if (!action.entity.isOnFieldAsMonsterStrictly) {
            return;
          }
          action.entity.controller.writeInfoLog(`コザッキーがフィールド上に存在しないため、${action.entity.toString()}は破壊される。`);
          DuelEntityShortHands.tryMarkForDestroy([action.entity], { activator: action.entity.controller, action, selectedEntities: [] });
          action.entity.info.isDying = true;
          action.entity.info.causeOfDeath = ["Effect", "Destroy"];
          return undefined;
        },
      },
    ],
  };
}

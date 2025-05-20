import { defaultSelfReleaseCanPayCosts, defaultSelfReleasePayCosts } from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";

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
}

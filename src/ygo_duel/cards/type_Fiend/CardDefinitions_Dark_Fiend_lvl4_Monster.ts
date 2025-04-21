import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";

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
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";

export const createCardDefinitions_Dark_Fiend_lvl4_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  result.push({
    name: "死霊騎士デスカリバー・ナイト",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultNormalSummonAction,
      defaultFlipSummonAction,
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
        validate: (myInfo) =>
          myInfo.targetChainBlock && myInfo.targetChainBlock.action.entity.status.kind !== "Monster" && myInfo.targetChainBlock.action.isWithChainBlock
            ? []
            : undefined,
        payCosts: defaultSelfReleasePayCosts,
        prepare: async (myInfo, chainBlockInfos) => {
          const target = myInfo.targetChainBlock;
          const prev = chainBlockInfos[myInfo.index - 1];

          if (target !== prev) {
            return { selectedEntities: [], chainBlockTags: [], prepared: undefined };
          }

          return {
            selectedEntities: [],
            chainBlockTags: ["NegateCardEffect", ...myInfo.action.calcChainBlockTagsForDestroy([target.action.entity])],
            prepared: undefined,
          };
        },
        execute: async (myInfo, chainBlockInfos) => {
          const trigger = chainBlockInfos.find((info) => info.action.entity.status.kind !== "Monster" && info.action.isWithChainBlock);
          const prev = chainBlockInfos[myInfo.index - 1];

          if (prev !== trigger) {
            return false;
          }

          prev.isNegatedActivationBy = myInfo.action;

          await DuelEntityShortHands.tryDestroy([prev.action.entity], myInfo);

          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
    ] as CardActionDefinition<unknown>[],
  });

  return result;
};

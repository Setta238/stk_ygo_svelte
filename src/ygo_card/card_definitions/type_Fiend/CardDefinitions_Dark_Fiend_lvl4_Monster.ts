import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";

import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
  defaultSelfReleaseCanPayCosts,
  defaultSelfReleasePayCosts,
  defaultSummonFilter,
} from "@ygo_card/card_actions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { CardDefinition } from "@ygo_card/class/DuelCardDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";

export default function* generate(): Generator<CardDefinition> {
  yield {
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
          myInfo.targetChainBlock && myInfo.targetChainBlock.action.entity.kind === "Monster" && myInfo.targetChainBlock.action.isWithChainBlock
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
          const trigger = chainBlockInfos.find((info) => info.action.entity.kind !== "Monster" && info.action.isWithChainBlock);
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
    defaultSummonFilter: defaultSummonFilter,
  };
}

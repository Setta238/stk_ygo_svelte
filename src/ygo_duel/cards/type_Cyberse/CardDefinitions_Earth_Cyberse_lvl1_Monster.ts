import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";

import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
  defaultSelfRebornExecute,
} from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { CardDefinition } from "@ygo_duel/cards/CardDefinitions";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {} from "@ygo_duel/class/DuelEntityShortHands";

export const createCardDefinitions_Earth_Cyberse_lvl1_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  result.push({
    name: "ドットスケーパー",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultNormalSummonAction,
      defaultFlipSummonAction,
      {
        title: "①自己再生",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerDuel: 1,
        actionGroupNamePerTurn: "ドットスケーパー",
        validate: (myInfo) => {
          // 前回のチェーンで動いたかどうか
          if (!myInfo.action.entity.wasMovedAtPreviousChain) {
            return;
          }
          return myInfo.activator.getAvailableMonsterZones().length > 0 ? [] : undefined;
        },
        prepare: async (myInfo) => {
          console.log(myInfo.action.actionGroupNamePerTurn);
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      } as CardActionDefinition<unknown>,
      {
        title: "②自己帰還",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Banished"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerDuel: 1,
        actionGroupNamePerTurn: "ドットスケーパー",
        validate: (myInfo) => {
          // 前回のチェーンで動いたかどうか
          if (!myInfo.action.entity.wasMovedAtPreviousChain) {
            return;
          }
          return myInfo.activator.getAvailableMonsterZones().length > 0 ? [] : undefined;
        },
        prepare: async (myInfo) => {
          console.log(myInfo.action.actionGroupNamePerTurn);
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromBanished"], prepared: undefined };
        },
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      } as CardActionDefinition<unknown>,
    ] as CardActionDefinition<unknown>[],
  });

  return result;
};

import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
  defaultSelfRebornExecute,
} from "@ygo_card/card_actions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { CardDefinition } from "@ygo_card/class/DuelCardDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {} from "@ygo_duel/class/DuelEntityShortHands";

export default function* generate(): Generator<CardDefinition> {
  yield {
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
        actionGroupName: "ドットスケーパー",
        validate: (myInfo) => {
          // 前回のチェーンで動いたかどうか
          if (!myInfo.action.entity.wasMovedAtPreviousChain) {
            return;
          }
          return myInfo.activator.getAvailableMonsterZones().length > 0 ? [] : undefined;
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      },
      {
        title: "②自己帰還",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Banished"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerDuel: 1,
        actionGroupName: "ドットスケーパー",
        validate: (myInfo) => {
          // 前回のチェーンで動いたかどうか
          if (!myInfo.action.entity.wasMovedAtPreviousChain) {
            return;
          }
          return myInfo.activator.getAvailableMonsterZones().length > 0 ? [] : undefined;
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromBanished"], prepared: undefined };
        },
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      },
    ],
  };
}

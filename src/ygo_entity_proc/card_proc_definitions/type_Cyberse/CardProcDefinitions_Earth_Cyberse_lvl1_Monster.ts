import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
  defaultSelfRebornExecute,
} from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {} from "@ygo_duel/class/DuelEntityShortHands";

export default function* generate(): Generator<EntityProcDefinition> {
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

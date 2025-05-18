import { canSelfSepcialSummon, defaultSelfRebornExecute } from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {} from "@ygo_duel/class/DuelEntityShortHands";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ドットスケーパー",
    actions: [
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
        meetsConditions: (myInfo) => myInfo.action.entity.wasMovedAtPreviousChain && myInfo.action.entity.wasMovedFrom.cellType !== "Banished",
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
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
        meetsConditions: (myInfo) => myInfo.action.entity.wasMovedAtPreviousChain,
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromBanished"], prepared: undefined };
        },
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      },
    ],
  };
}

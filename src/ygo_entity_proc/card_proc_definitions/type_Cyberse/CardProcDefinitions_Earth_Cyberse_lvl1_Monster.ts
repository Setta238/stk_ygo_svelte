import { canSelfSepcialSummon, defaultSelfSpecialSummonExecute } from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {} from "@ygo_duel/class/DuelEntityShortHands";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";

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
        fixedTags: ["SpecialSummonFromGraveyard"],
        meetsConditions: (myInfo) => myInfo.action.entity.wasMovedAtPreviousChain && myInfo.action.entity.wasMovedFrom.cellType !== "Banished",
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: defaultPrepare,
        execute: (myInfo) => defaultSelfSpecialSummonExecute(myInfo),
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
        fixedTags: ["SpecialSummonFromBanished"],
        meetsConditions: (myInfo) => myInfo.action.entity.wasMovedAtPreviousChain,
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: defaultPrepare,
        execute: (myInfo) => defaultSelfSpecialSummonExecute(myInfo),
        settle: async () => true,
      },
    ],
  };
}

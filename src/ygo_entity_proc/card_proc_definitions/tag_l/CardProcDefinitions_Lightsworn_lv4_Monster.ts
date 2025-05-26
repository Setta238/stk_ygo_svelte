import { canSelfSepcialSummon, defaultSelfRebornExecute, getDestsForSelfSpecialSummon } from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ライトロード・ビースト ウォルフ",
    actions: [
      {
        title: "①自己再生",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromGraveyard"],
        meetsConditions: (myInfo) => myInfo.action.entity.wasMovedFrom.cellType === "Deck" && myInfo.action.entity.wasMovedAtPreviousChain,
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: async () => {
          return { selectedEntities: [] };
        },
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      },
    ],
  };
}

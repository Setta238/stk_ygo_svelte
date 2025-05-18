import { getDefaultAccelSynchroAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { getDefaultSynchroSummonAction } from "../../card_actions/CommonCardAction_SynchroMonster";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "フォーミュラ・シンクロン",
    actions: [
      getDefaultSynchroSummonAction(),
      {
        title: "①ドロー",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenSummonedJustNow(["SynchroSummon"]),
        canExecute: (myInfo) => myInfo.activator.canDraw && myInfo.activator.getDeckCell().cardEntities.length > 0,
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw"], prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      },
      getDefaultAccelSynchroAction({ title: "②シンクロ召喚", isOnlyNTimesPerChain: 1 }),
    ],
  };
}

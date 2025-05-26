import { getDefaultAccelSynchroAction } from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { getDefaultSynchroSummonAction } from "../../card_actions/CardActions_SynchroMonster";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";

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
        fixedTags: ["Draw", "IfSpecialSummonSucceed"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenSummonedJustNow(["SynchroSummon"]),
        canExecute: (myInfo) => myInfo.activator.canDraw && myInfo.activator.getDeckCell().cardEntities.length > 0,
        prepare: defaultPrepare,
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

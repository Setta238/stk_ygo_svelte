import { type EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "D-HERO ディスクガイ[エラッタ前]",
    actions: [
      {
        title: "ドロー",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Arrival", arrivalReasons: ["SpecialSummon"], from: ["Graveyard"] },
        fixedTags: ["IfSpecialSummonSucceed", "Draw"],
        canExecute: (myInfo) => myInfo.activator.canDraw && myInfo.activator.canAddToHandFromDeck,
        prepare: defaultPrepare,
        execute: async (chainBlockInfo) => {
          await chainBlockInfo.activator.draw(2, chainBlockInfo.action.entity, chainBlockInfo.activator);
          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

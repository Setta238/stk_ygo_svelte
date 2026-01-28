import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "昇天の黒角笛",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Counter",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        negateSummon: true,
        fixedTags: ["NegateSpecialSummon"],
        canExecute: (myInfo) =>
          (myInfo.targetChainBlock &&
            myInfo.targetChainBlock.action.playType === "SpecialSummon" &&
            myInfo.targetChainBlock.activator !== myInfo.activator &&
            myInfo.activator.duel.field.getPendingMonstersOnField().length === 1) ??
          false,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const monsters = DuelEntityShortHands.negateSummonMany(myInfo.action.entity, myInfo.activator);
          await DuelEntityShortHands.tryDestroy(monsters, myInfo);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

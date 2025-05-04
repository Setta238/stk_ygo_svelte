import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

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
        validate: (myInfo) => {
          if (!myInfo.targetChainBlock) {
            return;
          }
          if (myInfo.targetChainBlock.action.playType !== "SpecialSummon") {
            return;
          }
          // 相手限定
          if (myInfo.targetChainBlock.activator === myInfo.activator) {
            return;
          }
          // 一体限定
          if (myInfo.activator.duel.field.getPendingMonstersOnField().length !== 1) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["NegateSpecialSummon"], prepared: undefined };
        },
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

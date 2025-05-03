import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/card_actions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { CardDefinition } from "../cards/CardDefinitions";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";

export const createCardDefinitions_CounterTrap = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  result.push({
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
      defaultSpellTrapSetAction as CardActionDefinition<unknown>,
    ],
  });
  return result;
};

import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";

export const createCardDefinitions_NormalTrap = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_強欲な瓶 = {
    name: "強欲な瓶",
    actions: [
      defaultSpellTrapSetAction,
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.length < 2) {
            return;
          }
          if (!myInfo.activator.canDraw) {
            return;
          }
          if (!myInfo.activator.canAddToHandFromDeck) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: (action, cell, chainBlockInfos, cancelable) => defaultSpellTrapPrepare(action, cell, chainBlockInfos, cancelable, ["Draw"], [], undefined),
        execute: async (chainBlockInfo) => {
          await chainBlockInfo.activator.draw(1, chainBlockInfo.action.entity, chainBlockInfo.activator);
          return true;
        },
        settle: async () => true,
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_強欲な瓶);
  return result;
};

import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { SystemError } from "@ygo_duel/class/Duel";

import type { CardDefinition } from "./CardDefinitions";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export const createCardDefinitions_NormalTrap_UponAttackDeclaration = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  ["炸裂装甲", "次元幽閉"].forEach((name) => {
    result.push({
      name: name,
      actions: [
        defaultSpellTrapSetAction,
        {
          title: "発動",
          playType: "CardActivation",
          spellSpeed: "Quick",
          executableCells: ["SpellAndTrapZone"],
          executablePeriods: ["b1Battle", "b2Battle"],
          executableDuelistTypes: ["Controller"],
          hasToTargetCards: true,
          validate: (myInfo) => {
            if (!myInfo.activator.duel.clock.isUponAttackDeclaration()) {
              return;
            }
            if (myInfo.activator.isTurnPlayer) {
              return;
            }
            const attacker = myInfo.activator.duel.attackingMonster;
            if (!attacker) {
              throw new SystemError("想定されない状態", myInfo, attacker);
            }

            if (!attacker.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action)) {
              return;
            }

            return defaultSpellTrapValidate(myInfo);
          },
          prepare: async (myInfo, cell, chainBlockInfos, cancelable) => {
            const attacker = myInfo.activator.duel.attackingMonster;
            if (!attacker) {
              throw new SystemError("想定されない状態", myInfo, attacker);
            }
            return defaultSpellTrapPrepare(
              myInfo,
              cell,
              chainBlockInfos,
              cancelable,
              myInfo.action.calcChainBlockTagsForDestroy([attacker]),
              [attacker],
              undefined
            );
          },
          execute: async (myInfo) => {
            if (name === "炸裂装甲") {
              await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);
            } else {
              await DuelEntityShortHands.tryBanish(myInfo.selectedEntities, myInfo);
            }

            return true;
          },
          settle: async () => true,
        },
      ] as CardActionBase<unknown>[],
    });
  });

  return result;
};

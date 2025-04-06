import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/cards/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionDefinition, TEffectTag } from "@ygo_duel/class/DuelCardAction";
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

            if (!attacker.canBeTargetOfEffect(myInfo)) {
              return;
            }

            // 王宮の鉄壁などが有効である場合、発動不可
            if (name === "次元幽閉" && !myInfo.activator.canTryBanish(attacker, "BanishAsEffect", myInfo.action)) {
              return false;
            }

            return defaultSpellTrapValidate(myInfo);
          },
          prepare: async (myInfo, cell, chainBlockInfos, cancelable) => {
            const attacker = myInfo.activator.duel.attackingMonster;
            if (!attacker) {
              throw new SystemError("想定されない状態", myInfo, attacker);
            }

            const tags: TEffectTag[] = name === "炸裂装甲" ? myInfo.action.calcChainBlockTagsForDestroy([attacker]) : ["Banish", "BanishFromField"];

            return defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, cancelable, tags, [attacker], undefined);
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
      ] as CardActionDefinition<unknown>[],
    });
  });

  return result;
};

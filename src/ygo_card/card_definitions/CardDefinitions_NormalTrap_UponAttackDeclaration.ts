import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_card/card_actions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionDefinition, TEffectTag } from "@ygo_duel/class/DuelCardAction";
import { SystemError } from "@ygo_duel/class/Duel";

import type { CardDefinition } from "@ygo_card/class/DuelCardDefinition";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export default function* generate(): Generator<CardDefinition> {
  yield* ["炸裂装甲", "次元幽閉"].map((name) => {
    return {
      name: name,
      actions: [
        defaultSpellTrapSetAction,
        {
          title: "発動",
          playType: "CardActivation",
          spellSpeed: "Quick",
          isMandatory: false,
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
              return;
            }

            return defaultSpellTrapValidate(myInfo);
          },
          prepare: async (myInfo) => {
            const attacker = myInfo.activator.duel.attackingMonster;
            if (!attacker) {
              throw new SystemError("想定されない状態", myInfo, attacker);
            }

            const tags: TEffectTag[] = name === "炸裂装甲" ? myInfo.action.calcChainBlockTagsForDestroy([attacker]) : ["BanishFromField"];

            return { selectedEntities: [attacker], chainBlockTags: tags, prepared: undefined };
          },
          execute: async (myInfo) => {
            if (name === "炸裂装甲") {
              await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);
            } else {
              await DuelEntityShortHands.tryBanish("BanishAsEffect", myInfo.selectedEntities, myInfo);
            }

            return true;
          },
          settle: async () => true,
        } as CardActionDefinition<unknown>,
      ],
    };
  });
}

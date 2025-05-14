import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { TEffectTag } from "@ygo_duel/class/DuelEntityAction";
import { SystemError } from "@ygo_duel/class/Duel";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export default function* generate(): Generator<EntityProcDefinition> {
  for (const name of ["炸裂装甲", "次元幽閉"]) {
    yield {
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
          isNoticedForcibly: true,
          canExecute: (myInfo) => {
            if (!myInfo.activator.duel.clock.isUponAttackDeclaration()) {
              return false;
            }
            if (myInfo.activator.isTurnPlayer) {
              return false;
            }
            const attacker = myInfo.activator.duel.attackingMonster;
            if (!attacker) {
              throw new SystemError("想定されない状態", myInfo, attacker);
            }

            if (!attacker.canBeTargetOfEffect(myInfo)) {
              return false;
            }

            // 王宮の鉄壁などが有効である場合、発動不可
            if (name === "次元幽閉" && !myInfo.activator.canTryBanish(attacker, "BanishAsEffect", myInfo.action)) {
              return false;
            }

            return true;
          },
          prepare: async (myInfo) => {
            const attacker = myInfo.activator.duel.attackingMonster;
            if (!attacker) {
              throw new SystemError("想定されない状態", myInfo, attacker);
            }

            const tags: TEffectTag[] = name === "炸裂装甲" ? myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, [attacker]) : ["BanishFromField"];

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
        },
      ],
    };
  }
}

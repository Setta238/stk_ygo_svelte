import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { TActionTag } from "@ygo_duel/class/DuelEntityAction";
import { IllegalActionError } from "@ygo_duel/class_error/DuelError";

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
          meetsConditions: (myInfo, chainBlockInfos) => chainBlockInfos.some((info) => info.action.playType === "DeclareAttack"),
          canExecute: (myInfo) => {
            if (myInfo.activator.isTurnPlayer) {
              return false;
            }
            const attacker = myInfo.activator.duel.attackingMonster;
            if (!attacker) {
              return false;
            }

            if (!attacker.canBeTargetOfEffect(myInfo)) {
              return false;
            }

            if (!attacker.isOnFieldAsMonsterStrictly) {
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
              throw new IllegalActionError("UnexpectedSituation", myInfo, attacker);
            }

            const tags: TActionTag[] = name === "炸裂装甲" ? myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, [attacker]) : ["BanishFromField"];

            return { selectedEntities: [attacker], chainBlockTags: tags };
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

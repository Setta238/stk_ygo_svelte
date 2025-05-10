import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {
  defaultCanPayDiscardCosts,
  defaultPayDiscardCosts,
  defaultTargetMonstersRebornExecute,
  defaultTargetMonstersRebornPrepare,
} from "../card_actions/CommonCardAction";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "強欲な瓶",
    actions: [
      defaultSpellTrapSetAction,
      {
        title: "発動",
        isMandatory: false,
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
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw"], prepared: undefined };
        },
        execute: async (chainBlockInfo) => {
          await chainBlockInfo.activator.draw(1, chainBlockInfo.action.entity, chainBlockInfo.activator);
          return true;
        },
        settle: async () => true,
      },
    ],
  };

  yield {
    name: "戦線復帰",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        hasToTargetCards: true,
        validate: (myInfo) => {
          // 墓地に蘇生可能モンスター、場に空きが必要。
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo))
              .map((monster) => {
                return { monster, posList: ["Defense"], cells };
              }),
            [],
            false
          );
          if (!list.length) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: (myInfo) =>
          defaultTargetMonstersRebornPrepare(
            myInfo,
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
            ["Defense"]
          ),
        execute: async (myInfo) => defaultTargetMonstersRebornExecute(myInfo, ["Defense"]),
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "サンダー・ブレイク",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        hasToTargetCards: true,
        canPayCosts: (myInfo) => defaultCanPayDiscardCosts(myInfo),
        validate: (myInfo) => {
          const monsters = myInfo.action.entity.field.getMonstersOnFieldStrictly().filter((monster) => monster.canBeTargetOfEffect(myInfo));
          if (!monsters.length) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        payCosts: async (myInfo, chainBlockInfos, cancelable) => defaultPayDiscardCosts(myInfo, cancelable),
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          const monsters = myInfo.action.entity.field.getMonstersOnFieldStrictly().filter((monster) => monster.canBeTargetOfEffect(myInfo));
          const selected = await myInfo.activator.waitSelectEntity(monsters, "対象とするモンスターを選択", cancelable);
          if (!selected) {
            return;
          }
          return {
            selectedEntities: [selected],
            chainBlockTags: myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, [selected]),
            prepared: undefined,
          };
        },
        execute: async (myInfo) => {
          const target = myInfo.selectedEntities[0];
          // フィールドにいなければ効果なし
          if (!target.isOnFieldAsMonsterStrictly) {
            return false;
          }

          await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

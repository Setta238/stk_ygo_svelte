import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {
  defaultCanPayDiscardCosts,
  defaultPayDiscardCosts,
  defaultPrepare,
  defaultTargetMonstersRebornExecute,
  defaultTargetMonstersRebornPrepare,
  getSingleTargetActionPartical,
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
        fixedTags: ["Draw"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 1 && myInfo.activator.canDraw && myInfo.activator.canAddToHandFromDeck,
        prepare: defaultPrepare,
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
        fixedTags: ["SpecialSummonFromGraveyard"],
        canExecute: (myInfo) => {
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
          return list.length > 0;
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
        canPayCosts: defaultCanPayDiscardCosts,
        payCosts: defaultPayDiscardCosts,
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.action.entity.field
              .getCardsOnFieldStrictly()
              .filter((card) => card !== myInfo.action.entity)
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
          { message: "対象とするカードを選択。", destoryTargets: true }
        ),
        execute: async (myInfo) => {
          // フィールドにいなければ効果なし
          if (myInfo.selectedEntities.every((target) => !target.isOnField)) {
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

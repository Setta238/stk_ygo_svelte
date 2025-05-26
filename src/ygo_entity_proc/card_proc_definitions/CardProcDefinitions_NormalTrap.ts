import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {
  defaultCanPayDiscardCosts,
  defaultPayDiscardCosts,
  defaultPrepare,
  defaultTargetMonstersRebornExecute,
  defaultTargetMonstersRebornPrepare,
  getSingleTargetActionPartical,
} from "../card_actions/CardActions";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { EntityCostTypes } from "@ygo_duel/class/DuelEntityAction";

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

        execute: (...args) => defaultTargetMonstersRebornExecute(...args, ["Defense"]),
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
          (myInfo, chainBlockInfos, irregularCosts) =>
            myInfo.action.entity.field
              .getCardsOnFieldStrictly()
              .filter((card) => card !== myInfo.action.entity)
              .filter((card) => card.canBeTargetOfEffect(myInfo))
              .filter((card) => {
                if (!irregularCosts) {
                  return true;
                }
                // コストに含まれているカード及び、それに装備されているカードは対象になりえない
                const costs = EntityCostTypes.flatMap((type) => irregularCosts[type] ?? []);
                costs.push(...costs.flatMap((cost) => cost.info.equipEntities));
                return !costs.includes(card);
              }),
          { message: "対象とするカードを選択。", do: "Destroy" }
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

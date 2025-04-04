import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/cards/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

export const createCardDefinitions_NormalTrap = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
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
  });

  result.push({
    name: "戦線復帰",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        hasToTargetCards: true,
        // 墓地に蘇生可能モンスター、場に空きが必要。
        validate: (myInfo) => {
          if (myInfo.activator.getAvailableMonsterZones().length === 0) {
            return;
          }
          if (
            !myInfo.action.entity.field
              .getCells("Graveyard")
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card.status.kind === "Monster")
              .filter((card) => card.info.isRebornable)
              .filter((card) => card.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action))
              .filter((card) => card.canBeSummoned(myInfo.activator, myInfo.action, "SpecialSummon", "Defense", [], false))
              .some((card) => myInfo.activator.canSummon(myInfo.activator, card, myInfo.action, "SpecialSummon", "Defense", []))
          ) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async (myInfo, cell, chainBlockInfos) => {
          const target = await myInfo.action.entity.field.duel.view.waitSelectEntities(
            myInfo.activator,
            myInfo.action.entity.field
              .getCells("Graveyard")
              .flatMap((gy) => gy.cardEntities)
              .filter((card) => card.status.kind === "Monster")
              .filter((card) => card.info.isRebornable)
              .filter((card) => card.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action))
              .filter((card) => card.canBeSummoned(myInfo.activator, myInfo.action, "SpecialSummon", "Defense", [], false))
              .filter((card) => myInfo.activator.canSummon(myInfo.activator, card, myInfo.action, "SpecialSummon", "Defense", [])),
            1,
            (list) => list.length === 1,
            "蘇生対象とするモンスターを選択",
            false
          );
          if (!target) {
            throw new IllegalCancelError(myInfo);
          }
          return await defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, false, ["SpecialSummonFromGraveyard"], target, undefined);
        },
        execute: async (myInfo) => {
          const emptyCells = myInfo.activator.getEmptyMonsterZones();
          const target = myInfo.selectedEntities[0];
          await myInfo.activator.summon(target, ["Defense"], emptyCells, "SpecialSummon", ["Effect"], myInfo.action.entity, false);
          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ] as CardActionBase<unknown>[],
  });
  return result;
};

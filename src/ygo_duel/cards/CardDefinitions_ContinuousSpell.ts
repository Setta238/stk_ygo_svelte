import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/cards/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { createBroadRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { defaultPrepare } from "./DefaultCardAction";

export const createCardDefinitions_ContinuousSpell_Preset = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_連合軍 = {
    name: "連合軍",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: defaultSpellTrapValidate,
        prepare: defaultPrepare,
        execute: async () => true,
        settle: async () => true,
      } as CardActionDefinition<unknown>,
      defaultSpellTrapSetAction as CardActionDefinition<unknown>,
    ],
    continuousEffects: [
      createBroadRegularNumericStateOperatorHandler(
        "発動",
        "Spell",
        (entity) => entity.isOnFieldStrictly && entity.face === "FaceUp",
        (entity) => {
          return [
            NumericStateOperator.createContinuous(
              "発動",
              (operator) => operator.isSpawnedBy.isOnFieldStrictly && operator.isSpawnedBy.face === "FaceUp",
              entity,
              (operator, target) =>
                target.controller === operator.isSpawnedBy.controller &&
                target.types.includes("Warrior") &&
                target.isOnFieldStrictly &&
                target.face === "FaceUp",
              "attack",
              "wip",
              "Addition",
              (spawner, monster, current) => {
                if (!spawner.isEffective) {
                  return current;
                }
                if (monster.face === "FaceDown") {
                  return current;
                }
                const qty = spawner.controller
                  .getMonstersOnField()
                  .filter((m) => m.face === "FaceUp")
                  .filter((m) => m.types.includes("Warrior") || m.types.includes("Spellcaster")).length;
                return current + qty * 200;
              }
            ),
          ];
        }
      ),
    ] as ContinuousEffectBase<unknown>[],
  };

  result.push(def_連合軍);

  return result;
};

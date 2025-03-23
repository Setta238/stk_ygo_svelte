import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { createBroadRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";

export const createCardDefinitions_ContinuousSpell_Preset = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_連合軍 = {
    name: "連合軍",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        isLikeContinuousSpell: true,
        validate: defaultSpellTrapValidate,
        prepare: defaultSpellTrapPrepare,
        execute: async () => true,
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
    continuousEffects: [
      createBroadRegularNumericStateOperatorHandler(
        "発動",
        "Spell",
        (entity) => entity.isOnField && entity.face === "FaceUp",
        (entity) => {
          return [
            NumericStateOperator.createContinuous(
              "発動",
              (spawner) => spawner.isOnField && spawner.face === "FaceUp",
              entity,
              (spawner, target) => target.controller === spawner.controller && target.types.includes("Warrior") && target.isOnField && target.face === "FaceUp",
              "attack",
              "current",
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

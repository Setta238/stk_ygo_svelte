import { defaultContinuousSpellCardActivateAction, defaultSpellTrapSetAction } from "@ygo_card/card_actions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { CardDefinition } from "@ygo_card/class/DuelCardDefinition";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { createBroadRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";

export default function* generate(): Generator<CardDefinition> {
  yield {
    name: "連合軍",
    actions: [defaultContinuousSpellCardActivateAction, defaultSpellTrapSetAction],
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
      ) as ContinuousEffectBase<unknown>,
    ],
  };
}

import { defaultContinuousSpellCardActivateAction, defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { createBroadRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "連合軍",
    actions: [defaultContinuousSpellCardActivateAction, defaultSpellTrapSetAction],
    continuousEffects: [
      createBroadRegularNumericStateOperatorHandler("発動", "Spell", (entity) => {
        return [
          NumericStateOperator.createContinuous(
            "発動",
            (operator) => operator.isSpawnedBy.isOnFieldStrictly && operator.isSpawnedBy.face === "FaceUp",
            entity,
            (operator, target) =>
              target.controller === operator.isSpawnedBy.controller && target.types.includes("Warrior") && target.isOnFieldStrictly && target.face === "FaceUp",
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
      }) as ContinuousEffectBase<unknown>,
    ],
  };
}

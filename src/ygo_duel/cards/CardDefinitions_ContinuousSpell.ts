import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { createBroadNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";

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
        validate: defaultSpellTrapValidate,
        prepare: defaultSpellTrapPrepare,
        execute: async () => true,
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
    continuousEffects: [
      createBroadNumericStateOperatorHandler(
        "発動",
        "Spell",
        (entity: DuelEntity) => entity.isOnField && entity.face === "FaceUp",
        (entity: DuelEntity) => {
          return [
            NumericStateOperator.createContinuous(
              "発動",
              (spawner: DuelEntity) => spawner.isOnField && spawner.face === "FaceUp",
              entity,
              (spawner: DuelEntity, target: DuelEntity) => target.controller === spawner.controller && target.type.includes("Warrior"),
              "attack",
              "current",
              "Addition",
              (spawner: DuelEntity, monster: DuelEntity, current: number) => {
                if (!spawner.status.isEffective) {
                  return current;
                }
                if (monster.face === "FaceDown") {
                  return current;
                }
                const qty = spawner.controller
                  .getMonstersOnField()
                  .filter((m) => m.face === "FaceUp")
                  .filter((m) => m.type.includes("Warrior") || m.type.includes("Spellcaster")).length;
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

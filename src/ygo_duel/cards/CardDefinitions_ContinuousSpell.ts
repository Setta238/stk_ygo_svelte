import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { createBroadNumericStateOperators, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";

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
      createBroadNumericStateOperators(
        "発動",
        "Spell",
        (entity: DuelEntity) => entity.isOnField && entity.face === "FaceUp",
        (entity: DuelEntity) => {
          return [
            NumericStateOperator.createContinuous(
              "発動",
              () => entity.isOnField && entity.face === "FaceUp",
              entity,
              (monster: DuelEntity) => monster.controller === entity.controller && monster.type.includes("Warrior"),
              "attack",
              "current",
              "Addition",
              (monster: DuelEntity, current: number) => {
                if (!entity.status.isEffective) {
                  return current;
                }
                const qty = entity.controller
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

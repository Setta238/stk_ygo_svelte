import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import type { TEntityFlexibleStatusKey, TMonsterType } from "@ygo/class/YgoTypes";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { createBroadNumericStateOperators, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";

export const createCardDefinitions_FieldSpell_Preset = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  [
    {
      name: "草原",
      up: ["Warrior", "BeastWarrior"] as TMonsterType[],
      down: [] as TMonsterType[],
    },
    {
      name: "森",
      up: ["Insect", "Plant", "Beast", "BeastWarrior"] as TMonsterType[],
      down: [] as TMonsterType[],
    },
    {
      name: "山",
      up: ["Dragon", "WingedBeast", "Thunder"] as TMonsterType[],
      down: [] as TMonsterType[],
    },
    {
      name: "荒野",
      up: ["Dinosaur", "Zombie", "Rock"] as TMonsterType[],
      down: [] as TMonsterType[],
    },
    {
      name: "海",
      up: ["Aqua", "SeaSerpent", "Fish"] as TMonsterType[],
      down: ["Machine", "Pyro"] as TMonsterType[],
    },
    {
      name: "闇",
      up: ["Fiend", "Spellcaster"] as TMonsterType[],
      down: ["Fairy"] as TMonsterType[],
    },
  ].forEach((item) => {
    result.push({
      name: item.name,
      actions: [
        {
          title: "発動",
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "FieldSpellZone"],
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
            return (["attack", "defense"] as TEntityFlexibleStatusKey[]).flatMap((state) => {
              return (["up", "down"] as const).map((updown) => {
                return NumericStateOperator.createContinuous(
                  "発動",
                  () => entity.isOnField && entity.face === "FaceUp",
                  entity,
                  (monster: DuelEntity) =>
                    monster.isOnField && (monster.status.monsterCategories ?? false) && item[updown].some((t) => t === monster.status.type),
                  state,
                  "current",
                  "Addition",
                  (monster: DuelEntity, current: number) => {
                    if (!entity.status.isEffective) {
                      return current;
                    }
                    return current + (updown === "up" ? 200 : -200);
                  }
                );
              });
            });
          }
        ),
      ] as ContinuousEffectBase<unknown>[],
    });
  });
  return result;
};

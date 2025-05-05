import { defaultContinuousSpellCardActivateAction, defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import type { TEntityFlexibleNumericStatusKey, TMonsterAttribute, TMonsterType } from "@ygo/class/YgoTypes";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { createBroadRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";

export default function* generate(): Generator<EntityProcDefinition> {
  // 初期種族サポートフィールド魔法
  yield* [
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
  ].map((item): EntityProcDefinition => {
    return {
      name: item.name,
      actions: [defaultContinuousSpellCardActivateAction, defaultSpellTrapSetAction],
      continuousEffects: [
        createBroadRegularNumericStateOperatorHandler(
          "発動",
          "Spell",
          (source) => source.isOnFieldStrictly && source.face === "FaceUp",
          (source) => {
            return (["attack", "defense"] as TEntityFlexibleNumericStatusKey[]).flatMap((state) => {
              return (["up", "down"] as const).map((updown) => {
                return NumericStateOperator.createContinuous(
                  "発動",
                  (operator) => operator.isSpawnedBy.isOnFieldStrictly && operator.isSpawnedBy.face === "FaceUp",
                  source,
                  (operator, monster) =>
                    monster.isOnFieldStrictly &&
                    monster.face === "FaceUp" &&
                    (monster.status.monsterCategories ?? false) &&
                    item[updown].union(monster.types).length > 0,
                  state,
                  "wip",
                  "Addition",
                  (spawner, monster, current) => {
                    if (!spawner.isEffective) {
                      return current;
                    }
                    if (monster.face === "FaceDown") {
                      return current;
                    }
                    return current + (updown === "up" ? 200 : -200);
                  }
                );
              });
            });
          }
        ) as ContinuousEffectBase<unknown>,
      ],
    };
  });

  // 初期属性サポートフィールド魔法
  yield* [
    {
      name: "バーニングブラッド",
      attr: "Fire" as TMonsterAttribute,
    },
    {
      name: "ウォーターワールド",
      attr: "Water" as TMonsterAttribute,
    },
    {
      name: "ガイアパワー",
      attr: "Earth" as TMonsterAttribute,
    },
    {
      name: "シャインスパーク",
      attr: "Light" as TMonsterAttribute,
    },
    {
      name: "ダークゾーン",
      attr: "Dark" as TMonsterAttribute,
    },
    {
      name: "デザートストーム",
      attr: "Wind" as TMonsterAttribute,
    },
  ].map((item): EntityProcDefinition => {
    return {
      name: item.name,
      actions: [defaultContinuousSpellCardActivateAction, defaultSpellTrapSetAction],
      continuousEffects: [
        createBroadRegularNumericStateOperatorHandler(
          "発動",
          "Spell",
          (source) => source.isOnFieldStrictly && source.face === "FaceUp",
          (source) => {
            return (["attack", "defense"] as TEntityFlexibleNumericStatusKey[]).flatMap((state) => {
              return NumericStateOperator.createContinuous(
                "発動",
                (operator) => operator.isSpawnedBy.isOnFieldStrictly && operator.isSpawnedBy.face === "FaceUp",
                source,
                (operator, monster) => monster.isOnFieldStrictly && monster.face === "FaceUp" && monster.attr.includes(item.attr),
                state,
                "wip",
                "Addition",
                (spawner, monster, current) => {
                  if (!spawner.isEffective) {
                    return current;
                  }
                  if (monster.face === "FaceDown") {
                    return current;
                  }
                  return current + (state === "attack" ? 500 : -400);
                }
              );
            });
          }
        ) as ContinuousEffectBase<unknown>,
      ],
    };
  });
}

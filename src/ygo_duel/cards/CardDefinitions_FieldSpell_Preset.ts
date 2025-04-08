import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/cards/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import type { TEntityFlexibleNumericStatusKey, TMonsterAttribute, TMonsterType } from "@ygo/class/YgoTypes";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { createBroadRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { defaultPrepare } from "./DefaultCardAction";

export const createCardDefinitions_FieldSpell_Preset = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  // 初期種族サポートフィールド魔法
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
          isMandatory: false,
          canIgnoreCosts: true,
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
          (source) => source.isOnField && source.face === "FaceUp",
          (source) => {
            return (["attack", "defense"] as TEntityFlexibleNumericStatusKey[]).flatMap((state) => {
              return (["up", "down"] as const).map((updown) => {
                return NumericStateOperator.createContinuous(
                  "発動",
                  (operator) => operator.isSpawnedBy.isOnField && operator.isSpawnedBy.face === "FaceUp",
                  source,
                  (operator, monster) =>
                    monster.isOnField &&
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
        ),
      ] as ContinuousEffectBase<unknown>[],
    });
  });

  // 初期属性サポートフィールド魔法
  [
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
  ].forEach((item) => {
    result.push({
      name: item.name,
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "FieldSpellZone"],
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
          (source) => source.isOnField && source.face === "FaceUp",
          (source) => {
            return (["attack", "defense"] as TEntityFlexibleNumericStatusKey[]).flatMap((state) => {
              return NumericStateOperator.createContinuous(
                "発動",
                (operator) => operator.isSpawnedBy.isOnField && operator.isSpawnedBy.face === "FaceUp",
                source,
                (operator, monster) => monster.isOnField && monster.face === "FaceUp" && monster.attr.includes(item.attr),
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
        ),
      ] as ContinuousEffectBase<unknown>[],
    });
  });
  return result;
};

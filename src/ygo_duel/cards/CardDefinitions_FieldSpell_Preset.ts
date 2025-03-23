import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import type { TEntityFlexibleStatusKey, TMonsterAttribute, TMonsterType } from "@ygo/class/YgoTypes";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { createBroadRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";

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
          playType: "CardActivation",
          spellSpeed: "Normal",
          isLikeContinuousSpell: true,
          executableCells: ["Hand", "FieldSpellZone"],
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
          (source) => source.isOnField && source.face === "FaceUp",
          (source) => {
            return (["attack", "defense"] as TEntityFlexibleStatusKey[]).flatMap((state) => {
              return (["up", "down"] as const).map((updown) => {
                return NumericStateOperator.createContinuous(
                  "発動",
                  (spawner) => spawner.isOnField && spawner.face === "FaceUp",
                  source,
                  (spawner, monster) =>
                    monster.isOnField &&
                    monster.face === "FaceUp" &&
                    (monster.status.monsterCategories ?? false) &&
                    item[updown].union(monster.types).length > 0,
                  state,
                  "current",
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
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "FieldSpellZone"],
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
          (source) => source.isOnField && source.face === "FaceUp",
          (source) => {
            return (["attack", "defense"] as TEntityFlexibleStatusKey[]).flatMap((state) => {
              return NumericStateOperator.createContinuous(
                "発動",
                (spawner) => spawner.isOnField && spawner.face === "FaceUp",
                source,
                (spawner, monster) => monster.isOnField && monster.face === "FaceUp" && monster.attr.includes(item.attr),
                state,
                "current",
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

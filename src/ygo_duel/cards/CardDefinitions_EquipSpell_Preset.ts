import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/cards/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardAction, CardActionBase } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import type { TEntityFlexibleNumericStatusKey, TMonsterAttribute, TMonsterType } from "@ygo/class/YgoTypes";
import {
  createRegularEquipRelationHandler,
  createRegularNumericStateOperatorHandler as createRegularNumericStateOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { CardRelation } from "@ygo_duel/class_continuous_effect/DuelCardRelation";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";

export const createCardDefinitions_EquipSpell_Preset = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  (
    [
      { name: "伝説の剣", attr: undefined, monType: "Warrior", atk: 200, def: 200 },
      { name: "秘術の書", attr: undefined, monType: "Spellcaster", atk: 200, def: 200 },
      { name: "ポセイドンの力", attr: undefined, monType: "Aqua", atk: 200, def: 200 },
      { name: "紫水晶", attr: undefined, monType: "Zombie", atk: 200, def: 200 },
      { name: "猛獣の歯", attr: undefined, monType: "Beast", atk: 200, def: 200 },
      { name: "機械改造工場", attr: undefined, monType: "Machine", atk: 200, def: 200 },
      { name: "体温の上昇", attr: undefined, monType: "Reptile", atk: 200, def: 200 },
      { name: "魔菌", attr: undefined, monType: "Plant", atk: 200, def: 200 },
      { name: "闇・エネルギー", attr: undefined, monType: "Fiend", atk: 200, def: 200 },
      { name: "レーザー砲機甲鎧", attr: undefined, monType: "Insect", atk: 200, def: 200 },
      { name: "銀の弓矢", attr: undefined, monType: "Fairy", atk: 200, def: 200 },
      { name: "電撃鞭", attr: undefined, monType: "Thunder", atk: 200, def: 200 },
      { name: "ドラゴンの秘宝", attr: undefined, monType: "Dragon", atk: 200, def: 200 },
      { name: "フォロー・ウィンド", attr: undefined, monType: "WingedBeast", atk: 200, def: 200 },
      { name: "魔性の月", attr: undefined, monType: "BeastWarrior", atk: 200, def: 200 },
      { name: "エルフの光", attr: "Light", monType: undefined, atk: 400, def: -200 },
      { name: "覚醒", attr: "Earth", monType: undefined, atk: 400, def: -200 },
      { name: "灼熱の槍", attr: "Fire", monType: undefined, atk: 400, def: -200 },
      { name: "突風の扇", attr: "Wind", monType: undefined, atk: 400, def: -200 },
      { name: "はがねの甲羅", attr: "Water", monType: undefined, atk: 400, def: -200 },
      { name: "闇の破神剣", attr: "Dark", monType: undefined, atk: 400, def: -200 },
      { name: "火器付機甲鎧", attr: undefined, monType: "Insect", atk: 700, def: 0 },
      { name: "サラマンドラ", attr: "Fire", monType: undefined, atk: 700, def: 0 },
      { name: "シャイン・キャッスル", attr: "Light", monType: undefined, atk: 700, def: 0 },
    ] as { name: string; attr?: TMonsterAttribute; monType?: TMonsterType; atk: number; def: number }[]
  ).forEach((item) => {
    result.push({
      name: item.name,
      actions: [
        {
          title: "発動",
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          validate: (myInfo) => {
            const monsters = myInfo.action.entity.field
              .getMonstersOnField()
              .filter((monster) => monster.face === "FaceUp")
              .filter((monster) => monster.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>))
              .filter((monster) => !item.attr || monster.attr.includes(item.attr))
              .filter((monster) => !item.monType || monster.types.includes(item.monType));

            return monsters.length ? defaultSpellTrapValidate(myInfo) : undefined;
          },
          prepare: async (myInfo, cell, chainBlockInfos, cancelable) => {
            const monsters = myInfo.action.entity.field
              .getMonstersOnField()
              .filter((monster) => monster.face === "FaceUp")
              .filter((monster) => monster.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>))
              .filter((monster) => !item.attr || monster.attr.includes(item.attr))
              .filter((monster) => !item.monType || monster.types.includes(item.monType));

            const targets = await myInfo.action.entity.duel.view.waitSelectEntities(
              myInfo.activator,
              monsters,
              1,
              (seleceted) => seleceted.length === 1,
              "装備対象モンスターを選択",
              cancelable
            );
            if (!targets) {
              return undefined;
            }

            myInfo.action.entity.info.equipBy = targets[0];

            return await defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, false, [], targets, undefined);
          },
          execute: async () => true,
          settle: async () => true,
        },
        defaultSpellTrapSetAction as CardActionBase<unknown>,
      ],
      continuousEffects: [
        createRegularEquipRelationHandler(
          "EquipTarget",
          "Spell",
          () => true,
          (source) => [
            CardRelation.createRegularEquipRelation(
              "EquipTarget",
              () => true,
              source,
              {},
              () => true
            ),
          ]
        ),
        createRegularNumericStateOperatorHandler(
          item.name,
          "Spell",
          (source) => (source.info.equipBy ? [source.info.equipBy] : []),
          (source) => source.isOnField && source.face === "FaceUp",
          (entity) => {
            const targetStatus: [targetState: TEntityFlexibleNumericStatusKey, point: number][] = [];
            if (item.atk !== 0) {
              targetStatus.push(["attack", item.atk]);
            }
            if (item.def !== 0) {
              targetStatus.push(["defense", item.def]);
            }
            return targetStatus.map(([targetState, point]) =>
              NumericStateOperator.createContinuous(
                "発動",
                (spawner) => spawner.isOnField && spawner.face === "FaceUp",
                entity,
                (spawner, target) =>
                  target.isOnField &&
                  target.face === "FaceUp" &&
                  (!item.monType || target.types.includes(item.monType)) &&
                  (!item.attr || target.attr.includes(item.attr)),
                targetState,
                "current",
                "Addition",
                (spawner, monster, current) => {
                  if (!spawner.isEffective) {
                    return current;
                  }
                  return current + point;
                }
              )
            );
          }
        ),
      ] as ContinuousEffectBase<unknown>[],
    });
  });

  return result;
};

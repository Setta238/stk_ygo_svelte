import { defaultSpellTrapSetAction, getDefaultEquipSpellTrapAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import type { TMonsterFlexibleNumericStatusKey, TMonsterAttribute, TMonsterType } from "@ygo/class/YgoTypes";
import {
  createRegularNumericStateOperatorHandler as createRegularNumericStateOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";

export default function* generate(): Generator<EntityProcDefinition> {
  yield* (
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
  ).map((item): EntityProcDefinition => {
    return {
      name: item.name,
      actions: [
        getDefaultEquipSpellTrapAction(
          (monster) => (!item.attr || monster.attr.includes(item.attr)) && (!item.monType || monster.types.includes(item.monType)),
        ),
        defaultSpellTrapSetAction,
      ],
      continuousEffects: [
        createRegularNumericStateOperatorHandler(
          item.name,
          "Spell",
          (source) => (source.info.equipedBy ? [source.info.equipedBy] : []),
          (entity) => {
            const targetStatus: [targetState: TMonsterFlexibleNumericStatusKey, point: number][] = [];
            if (item.atk !== 0) {
              targetStatus.push(["attack", item.atk]);
            }
            if (item.def !== 0) {
              targetStatus.push(["defense", item.def]);
            }
            return targetStatus.map(([targetState, point]) =>
              NumericStateOperator.createContinuous(
                "発動",
                (operator) => operator.isSpawnedBy.isOnFieldStrictly && operator.isSpawnedBy.face === "FaceUp",
                entity,
                (operator, target) =>
                  target.isOnFieldStrictly &&
                  target.face === "FaceUp" &&
                  (!item.monType || target.types.includes(item.monType)) &&
                  (!item.attr || target.attr.includes(item.attr)),
                targetState,
                "wip",
                "Addition",
                (spawner, monster, current) => {
                  if (!spawner.isEffective) {
                    return current;
                  }
                  return current + point;
                },
              ),
            );
          },
        ) as ContinuousEffectBase<unknown>,
      ],
    };
  });
}

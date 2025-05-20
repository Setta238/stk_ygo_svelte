import { defaultEquipSpellTrapExecute, defaultSpellTrapSetAction, getDefaultEquipSpellTrapAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionDefinition } from "@ygo_duel/class/DuelEntityAction";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { type TEntityFlexibleNumericStatusKey } from "@ygo/class/YgoTypes";
import {
  createRegularNumericStateOperatorHandler as createRegularNumericStateOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPayLifePoint, defaultTargetMonstersRebornExecute, defaultTargetMonstersRebornPrepare } from "../card_actions/CommonCardAction";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";

export default function* generate(): Generator<EntityProcDefinition> {
  yield* (
    [
      { name: "団結の力", filter: (entity) => entity.isMonster && entity.face === "FaceUp", rate: 800 },
      { name: "魔導師の力", filter: (entity) => entity.kind === "Spell" || entity.kind === "Trap", rate: 500 },
    ] as { name: string; filter: (entity: DuelEntity) => boolean; rate: number }[]
  ).map((item): EntityProcDefinition => {
    return {
      name: item.name,
      actions: [getDefaultEquipSpellTrapAction(), defaultSpellTrapSetAction],
      continuousEffects: [
        createRegularNumericStateOperatorHandler(
          item.name,
          "Spell",
          (source) => (source.info.equipedBy ? [source.info.equipedBy] : []),
          (entity) => {
            return (["attack", "defense"] as TEntityFlexibleNumericStatusKey[]).map((targetState) =>
              NumericStateOperator.createContinuous(
                "発動",
                (operator) => operator.isSpawnedBy.isOnFieldStrictly && operator.isSpawnedBy.face === "FaceUp",
                entity,
                (operator, target) => target.isOnFieldStrictly && target.face === "FaceUp",
                targetState,
                "wip",
                "Addition",
                (spawner, monster, current) => {
                  if (!spawner.isEffective) {
                    return current;
                  }
                  const qty = spawner.controller.getEntiteisOnField().filter(item.filter).length;
                  return current + qty * item.rate;
                }
              )
            );
          }
        ),
      ] as ContinuousEffectBase<unknown>[],
    };
  });
  yield {
    name: "早すぎた埋葬",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        hasToTargetCards: true,
        fixedTags: ["SpecialSummonFromGraveyard"],
        canPayCosts: (myInfo) => myInfo.activator.lp >= 800,
        canExecute: (myInfo) => {
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo))
              .map((monster) => {
                return { monster, posList: ["Attack"], cells };
              }),
            [],
            false
          );
          return list.length > 0;
        },
        payCosts: (myInfo, chainBlockInfos) => defaultPayLifePoint(myInfo, chainBlockInfos, 800),
        prepare: async (myInfo) => {
          const result = await defaultTargetMonstersRebornPrepare(myInfo, myInfo.activator.getGraveyard().cardEntities, ["Attack"]);
          result.chainBlockTags.push("PayLifePoint");

          return result;
        },
        execute: async (myInfo, chainBlockInfos) => {
          // 力の集約などですでに何かに装備されている場合、破壊して処理を終了する。
          if (myInfo.action.entity.info.equipedBy) {
            await myInfo.action.entity.ruleDestory();
            return false;
          }

          const flg = await defaultTargetMonstersRebornExecute(myInfo, ["Attack"]);

          // 蘇生できなかった場合、破壊して処理を終了する。
          if (!flg) {
            await myInfo.action.entity.ruleDestory();
            return false;
          }

          myInfo.action.entity.onBeforeMove.append(async (data) => {
            if (data.entity.face !== "FaceUp" || !data.entity.isOnFieldAsSpellTrapStrictly) {
              return "RemoveMe";
            }
            const target = data.entity.info.equipedBy;
            if (!target) {
              return "RemoveMe";
            }

            const [, , , , , movedAs] = data.args;

            if (target.isOnFieldStrictly && target.face === "FaceUp" && data.entity.isEffective && movedAs.union(["EffectDestroy", "RuleDestroy"]).length) {
              // この場所では破壊マーキングまで実行。
              data.entity.controller.writeInfoLog(`${myInfo.action.entity.toString()}が破壊されたため、装備対象モンスター${target.toString()}を破壊。`);
              DuelEntityShortHands.tryMarkForDestory([target], myInfo);
            }

            return "RemoveMe";
          });

          return defaultEquipSpellTrapExecute(myInfo, chainBlockInfos, (equipOwner, equip) =>
            equip.info.effectTargets[myInfo.action.seq]?.includes(equipOwner)
          );
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "幻惑の巻物",
    actions: [getDefaultEquipSpellTrapAction(), defaultSpellTrapSetAction] as CardActionDefinition<unknown>[],
    continuousEffects: [] as ContinuousEffectBase<unknown>[],
  };
}

import { defaultEquipSpellTrapExecute, defaultSpellTrapSetAction, getDefaultEquipSpellTrapAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { CardActionDefinition } from "@ygo_duel/class/DuelEntityAction";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { type TEntityFlexibleNumericStatusKey } from "@ygo/class/YgoTypes";
import {
  createRegularNumericStateOperatorHandler as createRegularNumericStateOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPayLifePoint, getMultiTargetsRebornActionPartical } from "../card_actions/CardActions";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { trashCellTypes } from "@ygo_duel/class/DuelFieldCell";

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
        fixedTags: ["SpecialSummonFromGraveyard", "PayLifePoint"],
        canPayCosts: (myInfo) => myInfo.activator.lp >= 800,
        payCosts: (myInfo, chainBlockInfos) => defaultPayLifePoint(myInfo, chainBlockInfos, 800),
        ...getMultiTargetsRebornActionPartical(
          (myInfo) =>
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
          {
            posList: ["Attack"],
            afterExecute: async (isSucceed, myInfo, chainBlockInfos) => {
              // 蘇生できなかった場合、破壊して処理を終了する。
              if (!isSucceed) {
                await myInfo.action.entity.ruleDestroy();
                return false;
              }

              return defaultEquipSpellTrapExecute(myInfo, chainBlockInfos, (equipOwner, equip) =>
                equip.info.effectTargets[myInfo.action.seq]?.includes(equipOwner)
              );
            },
          }
        ),
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
    immediatelyActions: [
      {
        title: "自壊",
        executableCells: ["SpellAndTrapZone", ...trashCellTypes],
        executablePeriods: duelPeriodKeys,
        executableFaces: ["FaceUp"],
        execute: async (action, triggerEntity, oldProps) => {
          if (triggerEntity !== action.entity) {
            return;
          }

          if (!oldProps) {
            return;
          }
          const target = oldProps.info.equipedBy;
          if (!target) {
            return;
          }
          if (
            target.isOnFieldStrictly &&
            target.face === "FaceUp" &&
            oldProps.status.isEffective &&
            oldProps.info.isEffectiveIn.includes(oldProps.cell.cellType) &&
            !triggerEntity.cell.isSpellTrapZoneLikeCell &&
            triggerEntity.moveLog.latestRecord.movedAs.some((reason) => reason.endsWith("Destroy"))
          ) {
            // この場所では破壊マーキングまで実行。
            action.entity.controller.writeInfoLog(`${action.entity.toString()}が破壊されたため、対象モンスター${target.toString()}を破壊。`);
            await DuelEntityShortHands.tryMarkForDestroy([target], { action, activator: action.entity.controller, selectedEntities: [target] });
          }

          return undefined;
        },
      },
    ],
  };
  yield {
    name: "幻惑の巻物",
    actions: [getDefaultEquipSpellTrapAction(), defaultSpellTrapSetAction] as CardActionDefinition<unknown>[],
    continuousEffects: [] as ContinuousEffectBase<unknown>[],
  };
}

import {
  defaultEquipSpellTrapExecute,
  defaultSpellTrapSetAction,
  defaultSpellTrapValidate,
  getDefaultEquipSpellTrapAction,
} from "@ygo_duel/cards/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import { type TCardKind, type TEntityFlexibleNumericStatusKey } from "@ygo/class/YgoTypes";
import {
  createRegularNumericStateOperatorHandler as createRegularNumericStateOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPayLifePoint, defaultTargetMonstersRebornExecute, defaultTargetMonstersRebornPrepare } from "./DefaultCardAction";
export const createCardDefinitions_EquipSpell = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  (
    [
      { name: "団結の力", kind: ["Monster"], rate: 800 },
      { name: "魔導師の力", kind: ["Spell", "Trap"], rate: 500 },
    ] as { name: string; kind: TCardKind[]; rate: number }[]
  ).forEach((item) => {
    result.push({
      name: item.name,
      actions: [getDefaultEquipSpellTrapAction(), defaultSpellTrapSetAction] as CardActionDefinition<unknown>[],
      continuousEffects: [
        createRegularNumericStateOperatorHandler(
          item.name,
          "Spell",
          (source) => (source.info.equipedBy ? [source.info.equipedBy] : []),
          (source) => source.isOnField && source.face === "FaceUp",
          (entity) => {
            return (["attack", "defense"] as TEntityFlexibleNumericStatusKey[]).map((targetState) =>
              NumericStateOperator.createContinuous(
                "発動",
                (operator) => operator.isSpawnedBy.isOnField && operator.isSpawnedBy.face === "FaceUp",
                entity,
                (operator, target) => target.isOnField && target.face === "FaceUp",
                targetState,
                "wip",
                "Addition",
                (spawner, monster, current) => {
                  if (!spawner.isEffective) {
                    return current;
                  }
                  const qty = spawner.controller.getEntiteisOnField().filter((card) => item.kind.includes(card.status.kind)).length;
                  return current + qty * item.rate;
                }
              )
            );
          }
        ),
      ] as ContinuousEffectBase<unknown>[],
    });
  });
  const def_早すぎた埋葬 = {
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
        canPayCosts: (myInfo) => myInfo.activator.lp >= 800,
        // 墓地に蘇生可能モンスター、場に空きが必要。
        validate: (myInfo) => {
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo))
              .map((monster) => {
                return { monster, posList: ["Attack"], cells };
              }),
            [],
            false
          );
          if (!list.length) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        payCosts: (myInfo, chainBlockInfos) => defaultPayLifePoint(myInfo, chainBlockInfos, 800),
        prepare: async (myInfo) => {
          const result = await defaultTargetMonstersRebornPrepare(
            myInfo,
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
            ["Attack"]
          );
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
            if (data.entity.face !== "FaceUp" || !data.entity.isOnFieldAsSpellTrap) {
              return "RemoveMe";
            }
            const target = data.entity.info.equipedBy;
            if (!target) {
              return "RemoveMe";
            }
            console.log(data.entity.toString(), data.entity);

            const [, , , , , movedAs] = data.args;

            if (target.isOnField && target.face === "FaceUp" && data.entity.isEffective && movedAs.union(["EffectDestroy", "RuleDestroy"]).length) {
              console.log(myInfo.action.entity.toString());
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
    ] as CardActionDefinition<unknown>[],
  };
  result.push(def_早すぎた埋葬);
  result.push({
    name: "幻惑の巻物",
    actions: [getDefaultEquipSpellTrapAction(), defaultSpellTrapSetAction] as CardActionDefinition<unknown>[],
    continuousEffects: [] as ContinuousEffectBase<unknown>[],
  });
  return result;
};

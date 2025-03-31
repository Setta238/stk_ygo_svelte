import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/cards/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardAction, CardActionBase } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import type { TCardKind, TEntityFlexibleStatusKey } from "@ygo/class/YgoTypes";
import {
  createRegularEquipRelationHandler,
  createRegularNumericStateOperatorHandler as createRegularNumericStateOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { CardRelation } from "@ygo_duel/class_continuous_effect/DuelCardRelation";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

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
              .filter((monster) => monster.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>));

            return monsters.length ? defaultSpellTrapValidate(myInfo) : undefined;
          },
          prepare: async (myInfo, cell, chainBlockInfos, cancelable) => {
            const monsters = myInfo.action.entity.field
              .getMonstersOnField()
              .filter((monster) => monster.face === "FaceUp")
              .filter((monster) => monster.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>));
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

            myInfo.action.entity.info.effectTargets["EquipTarget"] = targets;

            return await defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, false, [], targets, undefined);
          },
          execute: async () => true,
          settle: async () => true,
        },
        defaultSpellTrapSetAction,
      ] as CardActionBase<unknown>[],
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
          (source) => source.info.effectTargets["EquipTarget"],
          (source) => source.isOnField && source.face === "FaceUp",
          (entity) => {
            return (["attack", "defense"] as TEntityFlexibleStatusKey[]).map((targetState) =>
              NumericStateOperator.createContinuous(
                "発動",
                (spawner) => spawner.isOnField && spawner.face === "FaceUp",
                entity,
                (spawner, target) => target.isOnField && target.face === "FaceUp",
                targetState,
                "current",
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
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        hasToTargetCards: true,
        // 墓地に蘇生可能モンスター、場に空きが必要。
        validate: (myInfo) => {
          if (
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.info.isRebornable)
              .filter((card) => card.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>))
              .filter((card) => card.canBeSpecialSummoned("SpecialSummon", myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>))
              .length === 0
          ) {
            return;
          }
          if (myInfo.activator.getAvailableMonsterZones().length === 0) {
            return;
          }

          if (myInfo.activator.lp < 800) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async (myInfo, cell, chainBlockInfos) => {
          const targets = await myInfo.action.entity.field.duel.view.waitSelectEntities(
            myInfo.activator,
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.info.isRebornable)
              .filter((card) => card.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>))
              .filter((card) => card.canBeSpecialSummoned("SpecialSummon", myInfo.activator, myInfo.action.entity, myInfo.action as CardAction<unknown>)),
            1,
            (list) => list.length === 1,
            "蘇生対象とするモンスターを選択",
            false
          );
          if (!targets) {
            throw new IllegalCancelError(myInfo);
          }

          // 800ポイント支払う
          myInfo.activator.payLp(800, myInfo.action.entity);
          myInfo.action.entity.info.effectTargets["EquipTarget"] = targets;

          return await defaultSpellTrapPrepare(myInfo, cell, chainBlockInfos, false, ["SpecialSummonFromGraveyard", "PayLifePoint"], targets, undefined);
        },
        execute: async (myInfo) => {
          const emptyCells = myInfo.activator.getEmptyMonsterZones();
          const target = myInfo.selectedEntities[0];
          await myInfo.activator.summon(target, ["Attack"], emptyCells, "SpecialSummon", ["Effect"], myInfo.action.entity, false);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
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
            () => true,
            (relation) => {
              if (!relation.target.isOnField) {
                return true;
              }
              if (relation.target.face === "FaceDown") {
                return true;
              }
              if (relation.isSpawnedBy.moveLog.currentProcRecords.flatMap((rec) => rec.movedAs).find((reason) => reason === "Destroy")) {
                // この場所では破壊マーキングまで実行。
                relation.target.tryDestory("EffectDestroy", relation.effectOwner, relation.isSpawnedBy, {});
              }

              return true;
            }
          ),
        ]
      ),
    ] as ContinuousEffectBase<unknown>[],
  };
  result.push(def_早すぎた埋葬);
  return result;
};

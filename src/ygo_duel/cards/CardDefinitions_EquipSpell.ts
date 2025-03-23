import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

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
          isLikeContinuousSpell: true,
          validate: (action) => {
            const monsters = action.entity.field
              .getMonstersOnField()
              .filter((monster) => monster.face === "FaceUp")
              .filter((monster) => monster.canBeTargetOfEffect(action.entity.controller, action.entity, action as CardAction<unknown>));

            return monsters.length ? defaultSpellTrapValidate(action) : undefined;
          },
          prepare: async (action, cell, chainBlockInfos, cancelable) => {
            const monsters = action.entity.field
              .getMonstersOnField()
              .filter((monster) => monster.face === "FaceUp")
              .filter((monster) => monster.canBeTargetOfEffect(action.entity.controller, action.entity, action as CardAction<unknown>));
            const targets = await action.entity.duel.view.waitSelectEntities(
              action.entity.controller,
              monsters,
              1,
              (seleceted) => seleceted.length === 1,
              "装備対象モンスターを選択",
              cancelable
            );
            if (!targets) {
              return undefined;
            }
            console.log(targets);
            action.entity.info.effectTargets["EquipTarget"] = targets;

            console.log(action.entity, action.entity.info.effectTargets["EquipTarget"]);
            return await defaultSpellTrapPrepare(action, cell, chainBlockInfos, false, [], targets, undefined);
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
                  if (!spawner.status.isEffective) {
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
        hasToTargetCards: true,
        isLikeContinuousSpell: true,
        // 墓地に蘇生可能モンスター、場に空きが必要。
        validate: (action) => {
          if (
            action.entity.controller
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.info.isRebornable)
              .filter((card) => card.canBeTargetOfEffect(action.entity.controller, action.entity, action as CardAction<unknown>))
              .filter((card) => card.canBeSpecialSummoned("SpecialSummon", action.entity.controller, action.entity, action as CardAction<unknown>)).length === 0
          ) {
            return;
          }
          if (action.entity.controller.getAvailableMonsterZones().length === 0) {
            return;
          }

          if (action.entity.controller.lp < 800) {
            return;
          }
          return defaultSpellTrapValidate(action);
        },
        prepare: async (action, cell, chainBlockInfos) => {
          const targets = await action.entity.field.duel.view.waitSelectEntities(
            action.entity.controller,
            action.entity.controller
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.info.isRebornable)
              .filter((card) => card.canBeTargetOfEffect(action.entity.controller, action.entity, action as CardAction<unknown>))
              .filter((card) => card.canBeSpecialSummoned("SpecialSummon", action.entity.controller, action.entity, action as CardAction<unknown>)),
            1,
            (list) => list.length === 1,
            "蘇生対象とするモンスターを選択",
            false
          );
          if (!targets) {
            throw new IllegalCancelError(action);
          }

          // 800ポイント支払う
          action.entity.controller.payLp(800, action.entity);
          action.entity.info.effectTargets["EquipTarget"] = targets;

          return await defaultSpellTrapPrepare(action, cell, chainBlockInfos, false, ["SpecialSummonFromGraveyard", "PayLifePoint"], targets, undefined);
        },
        execute: async (myInfo) => {
          console.log("早すぎた埋葬 execute");
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
            () => true,
            (relation) => {
              if (!relation.target.isOnField) {
                return true;
              }
              if (relation.target.face === "FaceDown") {
                return true;
              }
              if (relation.isSpawnedBy.moveLog.currentProcRecords.flatMap((rec) => rec.movedAs).find((reason) => reason === "Destroy")) {
                relation.target.tryDestory("EffectDestroy", relation.effectOwner, relation.isSpawnedBy, undefined);
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

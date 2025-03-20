import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardAction, CardActionBase, ChainBlockInfo, ChainBlockInfoBase } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import type { TCardKind, TEntityFlexibleStatusKey } from "@ygo/class/YgoTypes";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import {
  createRegularEquipRelationHandler,
  createNumericStateOperatorHandler as createRegularNumericStateOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { CardRelation } from "@ygo_duel/class_continuous_effect/DuelCardRelation";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";

export const createCardDefinitions_EquipSpell_Preset = (): CardDefinition[] => {
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
          validate: (action: CardAction<undefined>): DuelFieldCell[] | undefined => {
            const monsters = action.entity.field
              .getMonstersOnField()
              .filter((monster) => monster.face === "FaceUp")
              .filter((monster) => monster.canBeTargetOfEffect(action.entity.controller, action.entity, action as CardAction<unknown>));

            return monsters.length ? defaultSpellTrapValidate(action) : undefined;
          },
          prepare: async (
            action: CardAction<undefined>,
            cell: DuelFieldCell | undefined,
            chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
            cancelable: boolean
          ): Promise<ChainBlockInfoBase<undefined> | undefined> => {
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
          (source: DuelEntity) => source.info.effectTargets["EquipTarget"],
          (source: DuelEntity) => source.isOnField && source.face === "FaceUp",
          (entity: DuelEntity) => {
            return (["attack", "defense"] as TEntityFlexibleStatusKey[]).map((targetState: TEntityFlexibleStatusKey) =>
              NumericStateOperator.createContinuous(
                "発動",
                (spawner: DuelEntity) => spawner.isOnField && spawner.face === "FaceUp",
                entity,
                (spawner: DuelEntity, target: DuelEntity) => target.isOnField && target.face === "FaceUp",
                targetState,
                "current",
                "Addition",
                (spawner: DuelEntity, monster: DuelEntity, current: number) => {
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

  return result;
};

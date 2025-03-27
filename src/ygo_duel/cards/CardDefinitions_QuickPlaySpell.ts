import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase, TEffectTag } from "@ygo_duel/class/DuelCardAction";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

import type { CardDefinition } from "./CardDefinitions";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";

export const createCardDefinitions_QuickPlaySpell = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_ご隠居の猛毒薬 = {
    name: "ご隠居の猛毒薬",
    actions: [
      defaultSpellTrapSetAction,
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        validate: defaultSpellTrapValidate,
        prepare: async (action, cell, chainBlockInfos, cancelable) => {
          const selected = await action.entity.field.duel.view.waitSelectText(
            [
              { seq: 0, text: "●自分は１２００ＬＰ回復する。" },
              { seq: 1, text: "●相手に８００ダメージを与える。" },
            ],
            "使用する効果を選択",
            false
          );
          if (selected === undefined && !cancelable) {
            throw new IllegalCancelError(action);
          }

          const tags: TEffectTag[] = [];

          if (selected === 1) {
            tags.push("DamageToOpponent");
          }

          return defaultSpellTrapPrepare(action, cell, chainBlockInfos, cancelable, tags, [], selected ?? 0);
        },
        execute: async (myInfo) => {
          if (myInfo.prepared === 1) {
            myInfo.activator.getOpponentPlayer().effectDamage(800, myInfo.action.entity);
            return true;
          }
          myInfo.activator.heal(1200, myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      } as CardActionBase<number>,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_ご隠居の猛毒薬);

  const def_月の書 = {
    name: "月の書",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        validate: (action) => {
          const monsters = action.entity.field.getMonstersOnField().filter((monster) => monster.canBeEffected(action.entity.controller, action.entity, action));
          if (!monsters.length) {
            return;
          }
          return defaultSpellTrapValidate(action);
        },
        prepare: async (action, cell, chainBlockInfos, cancelable) => {
          const monsters = action.entity.field.getMonstersOnField().filter((monster) => monster.canBeEffected(action.entity.controller, action.entity, action));
          const selected = await action.entity.duel.view.waitSelectEntities(
            action.entity.controller,
            monsters,
            1,
            (selected) => selected.length === 1,
            "対象とするモンスターを選択",
            cancelable
          );
          if (!selected) {
            return;
          }

          return defaultSpellTrapPrepare(action, cell, chainBlockInfos, cancelable, [], [...selected], undefined);
        },
        execute: async (myInfo) => {
          const target = myInfo.selectedEntities[0];
          // フィールドにいなければ効果なし
          if (!target.isOnField) {
            return false;
          }

          //すでにセット状態であれば効果なし
          if (target.battlePosition === "Set") {
            return false;
          }

          //効果を受けない状態であれば効果なし
          if (!target.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action)) {
            myInfo.activator.duel.log.info(`${target.toString()}は${myInfo.action.entity.toString()}の効果を受けない。`);
            return;
          }

          // セット状態にする。
          await target.setBattlePosition("Set", ["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
      defaultSpellTrapSetAction as CardActionBase<unknown>,
    ],
  };

  result.push(def_月の書);
  return result;
};

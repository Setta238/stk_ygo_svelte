import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase, TEffectTag } from "@ygo_duel/class/DuelCardAction";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

import type { CardDefinition } from "./CardDefinitions";

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
  return result;
};

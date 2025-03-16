import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardAction, CardActionBase, ChainBlockInfo, TEffectTag } from "@ygo_duel/class/DuelCardAction";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";

import type { CardDefinition } from "./CardDefinitions";

export const createCardDefinitions_QuickPlaySpell = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_ご隠居の猛毒薬 = {
    name: "ご隠居の猛毒薬",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: defaultSpellTrapValidate,
        prepare: async (
          action: CardAction<number>,
          cell: DuelFieldCell | undefined,
          chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
          cancelable: boolean
        ) => {
          action.entity.info.isDying = true;

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
        execute: async (myInfo: ChainBlockInfo<number>) => {
          if (myInfo.prepared === 1) {
            myInfo.activator.getOpponentPlayer().effectDamage(800, myInfo.action.entity);
            return true;
          }
          myInfo.activator.heal(1200, myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_ご隠居の猛毒薬);
  return result;
};

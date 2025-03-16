import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { type Duelist } from "@ygo_duel/class/Duelist";
import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase, ChainBlockInfo, TEffectTag } from "@ygo_duel/class/DuelCardAction";
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
        prepare: async (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => {
          entity.info.isDying = true;

          const selected = await entity.field.duel.view.waitSelectText(
            [
              { seq: 0, text: "●自分は１２００ＬＰ回復する。" },
              { seq: 1, text: "●相手に８００ダメージを与える。" },
            ],
            "使用する効果を選択",
            false
          );
          if (selected === undefined && !cancelable) {
            throw new IllegalCancelError(entity);
          }

          const tags: TEffectTag[] = [];

          if (selected === 1) {
            tags.push("DamageToOpponent");
          }

          return defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, tags, [], selected);
        },
        execute: async (entity: DuelEntity, activater: Duelist, myInfo: ChainBlockInfo<number>) => {
          if (myInfo.prepared === 1) {
            activater.getOpponentPlayer().effectDamage(800, entity);
            return true;
          }
          activater.heal(1200, entity);
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

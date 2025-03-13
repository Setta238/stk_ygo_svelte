import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type Duelist from "@ygo_duel/class/Duelist";
import { defaultSpellTrapPrepare, defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/functions/DefaultCardAction";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { SystemError } from "@ygo_duel/class/Duel";
import { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";

export type CardDefinition = {
  name: string;
  actions: CardActionBase<unknown>[];
};

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
        prepare: async (entity: DuelEntity, cell: DuelFieldCell): Promise<number> => {
          entity.info.isDying = true;

          const selected = await entity.field.duel.view.waitSelectText(
            [
              { seq: 0, text: "●自分は１２００ＬＰ回復する。" },
              { seq: 1, text: "●相手に８００ダメージを与える。" },
            ],
            "使用する効果を選択",
            false
          );
          if (selected === undefined) {
            throw new SystemError("キャンセル不可の行動がキャンセルされた。", entity);
          }
          await defaultSpellTrapPrepare(entity, cell);
          console.log(selected);
          return selected;
        },
        execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell, prepared?: number) => {
          console.log(prepared);
          if (prepared === 1) {
            activater.getOpponentPlayer().effectDamage(800, entity);
            return true;
          }
          activater.heal(1200, entity);
          return true;
        },
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_ご隠居の猛毒薬);
  return result;
};

import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { defaultAttackAction, defaultSummonFilter } from "@ygo_duel/card_actions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "../cards/CardDefinitions";
import { getDefaultLinkSummonAction } from "../card_actions/DefaultCardAction_LinkMonster";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";

export const createCardDefinitions_LinkMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  [
    { name: "ＬＡＮフォリンクス", validator: (selected: DuelEntity[]) => selected.length === 2 },
    { name: "トラフィックゴースト", validator: (selected: DuelEntity[]) => selected.length === 3 },
    {
      name: "天威の鬼神",
      validator: (selected: DuelEntity[]) => selected.length > 1 && selected.some((monster) => monster.status.monsterCategories?.includes("Link")),
    },
    {
      name: "天威の拳僧",
      validator: (selected: DuelEntity[]) =>
        selected.every((monster) => monster.status.nameTags?.includes("天威") && !monster.status.monsterCategories?.includes("Link")),
    },
    { name: "電影の騎士ガイアセイバー", validator: (selected: DuelEntity[]) => selected.length > 1 },
  ].forEach((item) =>
    result.push({
      name: item.name,
      actions: [defaultAttackAction, getDefaultLinkSummonAction(item.validator)] as CardActionDefinition<unknown>[],
      defaultSummonFilter: defaultSummonFilter,
    })
  );

  return result;
};

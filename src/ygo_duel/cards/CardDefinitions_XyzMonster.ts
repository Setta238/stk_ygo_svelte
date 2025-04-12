import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultSummonFilter } from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "./CardDefinitions";
import { getDefaultXyzSummonAction } from "./DefaultCardAction_XyzMonster";
export const createCardDefinitions_XyzMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  [
    { name: "ジェムナイト・パール", qty: 2 },
    { name: "覚醒の勇士 ガガギゴ", qty: 3 },
  ].forEach((item) =>
    result.push({
      name: item.name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, getDefaultXyzSummonAction(item.qty, item.qty)] as CardActionDefinition<unknown>[],
      defaultSummonFilter: defaultSummonFilter,
    })
  );
  return result;
};

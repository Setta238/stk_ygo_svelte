import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultSummonFilter,
} from "@ygo_card/card_actions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "@ygo_card/class/DuelCardDefinition";
import { getDefaultXyzSummonAction } from "../card_actions/DefaultCardAction_XyzMonster";
export default function* generate(): Generator<CardDefinition> {
  yield* [
    { name: "ジェムナイト・パール", qty: 2 },
    { name: "覚醒の勇士 ガガギゴ", qty: 3 },
  ].map((item) => {
    return {
      name: item.name,
      actions: [
        defaultAttackAction,
        defaultBattlePotisionChangeAction,
        defaultFlipSummonAction,
        getDefaultXyzSummonAction(item.qty, item.qty),
      ] as CardActionDefinition<unknown>[],
      defaultSummonFilter: defaultSummonFilter,
    };
  });
}

import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultDirectAtackEffect,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
} from "@ygo_card/card_actions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "@ygo_card/class/DuelCardDefinition";

export default function* generate(): Generator<CardDefinition> {
  yield* ["ラージマウス", "レインボー・フラワー", "レッグル", "女王の影武者", "人造人間７号"].map((name) => {
    return {
      name: name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction, defaultNormalSummonAction] as CardActionDefinition<unknown>[],
      continuousEffects: [defaultDirectAtackEffect],
    };
  });
}

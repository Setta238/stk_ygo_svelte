import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultDirectAtackEffect,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
} from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "./CardDefinitions";

export const createCardDefinitions_Monster_Preset_DirectAttacker = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  ["ラージマウス", "レインボー・フラワー", "レッグル", "女王の影武者", "人造人間７号"].forEach((name) => {
    result.push({
      name: name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction, defaultNormalSummonAction] as CardActionDefinition<unknown>[],
      continuousEffects: [defaultDirectAtackEffect],
    });
  });
  return result;
};

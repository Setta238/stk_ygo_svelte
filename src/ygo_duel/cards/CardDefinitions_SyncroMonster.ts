import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { defaultAttackAction, defaultBattlePotisionChangeAction, getDefaultSyncroSummonAction } from "@ygo_duel/functions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "./CardDefinitions";

export const createCardDefinitions_SyncroMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  ["大地の騎士ガイアナイト", "スクラップ・デスデーモン"].forEach((name) =>
    result.push({
      name: name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, getDefaultSyncroSummonAction()] as CardActionBase<unknown>[],
    })
  );

  const def_ナチュル・ガオドレイク = {
    name: "ナチュル・ガオドレイク",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      getDefaultSyncroSummonAction(
        (tuners) => tuners.length === 1 && tuners.every((tuner) => tuner.attr.some((a) => a === "Earth")),
        (nonTuners) => nonTuners.length > 0 && nonTuners.every((nonTuner) => nonTuner.attr.some((a) => a === "Earth"))
      ),
    ] as CardActionBase<unknown>[],
  };
  result.push(def_ナチュル・ガオドレイク);

  return result;
};

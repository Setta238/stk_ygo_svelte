import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalSummonAction,
  getSelfBattleSubstituteEffectDefinition,
} from "@ygo_duel/cards/DefaultCardAction_Monster";
import type { CardDefinition } from "../CardDefinitions";
import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";

export const createCardDefinitions_Resonator_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
    name: "ダーク・リゾネーター",
    actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultNormalSummonAction] as CardActionDefinition<unknown>[],
    substituteEffects: [getSelfBattleSubstituteEffectDefinition(1)],
  });

  return result;
};

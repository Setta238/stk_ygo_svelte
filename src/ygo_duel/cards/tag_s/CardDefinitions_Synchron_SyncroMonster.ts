import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultSummonFilter } from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "@ygo_duel/cards/CardDefinitions";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { getDefaultSyncroSummonAction } from "../DefaultCardAction_SyncroMonster";

export const createCardDefinitions_Synchron_SyncroMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
    name: "フォーミュラ・シンクロン",
    actions: [
      defaultAttackAction as CardActionDefinition<unknown>,
      defaultBattlePotisionChangeAction as CardActionDefinition<unknown>,
      getDefaultSyncroSummonAction() as CardActionDefinition<unknown>,
      {
        title: "①ドロー",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (!myInfo.action.entity.hasBeenSummonedNow(["SyncroSummon"])) {
            return;
          }
          if (!myInfo.activator.getDeckCell().cardEntities.length) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw"], prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
          await myInfo.activator.draw(2, myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
    ],
    defaultSummonFilter: defaultSummonFilter,
  });

  return result;
};

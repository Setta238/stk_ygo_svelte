import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultSummonFilter,
  getDefaultAccelSyncroACtion,
} from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "@ygo_duel/cards/CardDefinitions";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { getDefaultSyncroSummonAction } from "../DefaultCardAction_SyncroMonster";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
export const createCardDefinitions_Synchron_SyncroMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
    name: "フォーミュラ・シンクロン",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      getDefaultSyncroSummonAction(),
      {
        title: "①ドロー",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (!myInfo.action.entity.hasBeenSummonedJustNow(["SyncroSummon"])) {
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
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
      getDefaultAccelSyncroACtion({ title: "②シンクロ召喚", isOnlyNTimesPerChain: 1 }),
    ],
    defaultSummonFilter: defaultSummonFilter,
  });

  return result;
};

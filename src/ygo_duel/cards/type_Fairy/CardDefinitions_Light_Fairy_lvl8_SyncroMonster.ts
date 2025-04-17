import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultSelfRebornExecute,
  defaultSummonFilter,
} from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "@ygo_duel/cards/CardDefinitions";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { getDefaultSyncroSummonAction } from "../DefaultCardAction_SyncroMonster";
import { createRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";

export const createCardDefinitions_Light_Fairy_lvl8_SyncroMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
    name: "ゼラの天使",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      getDefaultSyncroSummonAction(),
      {
        title: "②自己帰還",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Banished"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          // 前回のチェーンで動いたかどうか
          if (!myInfo.action.entity.wasMovedAtPreviousTurn) {
            return;
          }
          return myInfo.activator.getAvailableMonsterZones().length > 0 ? [] : undefined;
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromBanished"], prepared: undefined };
        },
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      } as CardActionDefinition<unknown>,
    ],
    continuousEffects: [
      createRegularNumericStateOperatorHandler(
        "②攻撃力上昇",
        "Monster",
        (source) => [source],
        () => true,
        (source) => {
          return [
            NumericStateOperator.createContinuous(
              "①攻撃力上昇",
              () => true,
              source,
              () => true,
              "attack",
              "wip",
              "Addition",
              (spawner, target, source) => {
                if (!spawner.isEffective) {
                  return source;
                }
                return source + spawner.controller.getOpponentPlayer().getBanished().cardEntities.length * 100;
              }
            ),
          ];
        }
      ) as ContinuousEffectBase<unknown>,
    ],
    defaultSummonFilter: defaultSummonFilter,
  });
  return result;
};

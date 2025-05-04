import type { CardActionDefinition } from "@ygo_duel/class/DuelEntityAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultSelfRebornExecute,
} from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultSyncroSummonAction } from "../../card_actions/CommonCardAction_SyncroMonster";
import { createRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ゼラの天使",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      getDefaultSyncroSummonAction(),
      {
        title: "②自己帰還",
        isMandatory: true,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Banished"],
        executablePeriods: ["stanby"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          // 前回のターンで動いたかどうか
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
  };
}

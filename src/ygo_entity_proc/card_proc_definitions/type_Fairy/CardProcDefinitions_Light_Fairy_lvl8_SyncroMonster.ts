import { canSelfSepcialSummon, defaultSelfRebornExecute } from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultSynchroSummonAction } from "../../card_actions/CommonCardAction_SynchroMonster";
import { createRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ゼラの天使",
    actions: [
      getDefaultSynchroSummonAction(),
      {
        title: "②自己帰還",
        isMandatory: true,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Banished"],
        executablePeriods: ["stanby"],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.action.entity.wasMovedAtPreviousTurn,
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromBanished"] };
        },
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      },
    ],
    continuousEffects: [
      createRegularNumericStateOperatorHandler(
        "②攻撃力上昇",
        "Monster",
        (source) => [source],
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

import { canSelfSepcialSummon, defaultSelfSpecialSummonExecute } from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultSynchroSummonAction } from "@ygo_entity_proc/card_actions/CardActions_SynchroMonster";
import { createRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";

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
        executableFaces: ["FaceUp"],
        fixedTags: ["SpecialSummonFromBanished"],
        meetsConditions: (myInfo) => myInfo.action.entity.wasMovedAtPreviousTurn,
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: defaultPrepare,
        execute: defaultSelfSpecialSummonExecute,
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
              },
            ),
          ];
        },
      ),
    ],
  };
}

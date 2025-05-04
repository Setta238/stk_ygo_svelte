import type { CardActionDefinition } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
} from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import { type EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import {
  createBroadRegularNumericStateOperatorHandler,
  createRegularNumericStateOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import type { TEntityFlexibleNumericStatusKey } from "@ygo/class/YgoTypes";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "にせアバター",
    actions: [defaultNormalSummonAction, defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction] as CardActionDefinition<unknown>[],
    continuousEffects: [
      createRegularNumericStateOperatorHandler(
        "THE_DEVILS_AVATAR",
        "Monster",
        (source: DuelEntity) => [source],
        (source: DuelEntity) => source.isOnFieldStrictly && source.face === "FaceUp",
        (entity: DuelEntity) => {
          return (["attack", "defense"] as TEntityFlexibleNumericStatusKey[]).map((targetState) =>
            NumericStateOperator.createContinuous(
              "THE_DEVILS_AVATAR",
              (operator) => operator.isSpawnedBy.isOnFieldStrictly && operator.isSpawnedBy.face === "FaceUp",
              entity,
              (operator, target) => target.isOnFieldStrictly && target.face === "FaceUp",
              targetState,
              "calculated",
              "THE_DEVILS_AVATAR",
              () => Number.MIN_VALUE
            )
          );
        }
      ),
    ] as ContinuousEffectBase<unknown>[],
  };
  yield {
    name: "にせドレッド・ルート",
    actions: [defaultNormalSummonAction, defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction] as CardActionDefinition<unknown>[],
    continuousEffects: [
      createBroadRegularNumericStateOperatorHandler(
        "THE_DEVILS_DREAD-ROOT",
        "Monster",
        (source: DuelEntity) => source.isOnFieldStrictly && source.face === "FaceUp",
        (entity: DuelEntity) => {
          return (["attack", "defense"] as TEntityFlexibleNumericStatusKey[]).map((targetState) =>
            NumericStateOperator.createContinuous(
              "THE_DEVILS_DREAD-ROOT",
              (operator) => operator.isSpawnedBy.isOnFieldStrictly && operator.isSpawnedBy.face === "FaceUp",
              entity,
              (operator, target) => target.kind === "Monster" && target.isOnFieldStrictly && target.face === "FaceUp" && target !== operator.isSpawnedBy,
              targetState,
              "calculated",
              "THE_DEVILS_DREAD-ROOT",
              (spawner: DuelEntity, monster: DuelEntity, current: number) => Math.round(current / 2)
            )
          );
        }
      ),
    ] as ContinuousEffectBase<unknown>[],
  };
}

import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
} from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import { type CardDefinition } from "./CardDefinitions";
import {
  createBroadRegularNumericStateOperatorHandler,
  createRegularNumericStateOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import type { TEntityFlexibleNumericStatusKey } from "@ygo/class/YgoTypes";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";

export const createCardDefinitions_TestMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_にせアバター = {
    name: "にせアバター",
    actions: [defaultNormalSummonAction, defaultAttackAction, defaultBattlePotisionChangeAction] as CardActionDefinition<unknown>[],
    continuousEffects: [
      createRegularNumericStateOperatorHandler(
        "THE_DEVILS_AVATAR",
        "Monster",
        (source: DuelEntity) => [source],
        (source: DuelEntity) => source.isOnField && source.face === "FaceUp",
        (entity: DuelEntity) => {
          return (["attack", "defense"] as TEntityFlexibleNumericStatusKey[]).map((targetState) =>
            NumericStateOperator.createContinuous(
              "THE_DEVILS_AVATAR",
              (operator) => operator.isSpawnedBy.isOnField && operator.isSpawnedBy.face === "FaceUp",
              entity,
              (operator, target) => target.isOnField && target.face === "FaceUp",
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

  result.push(def_にせアバター);

  const def_にせドレッド・ルート = {
    name: "にせドレッド・ルート",
    actions: [defaultNormalSummonAction, defaultAttackAction, defaultBattlePotisionChangeAction] as CardActionDefinition<unknown>[],
    continuousEffects: [
      createBroadRegularNumericStateOperatorHandler(
        "THE_DEVILS_DREAD-ROOT",
        "Monster",
        (source: DuelEntity) => source.isOnField && source.face === "FaceUp",
        (entity: DuelEntity) => {
          return (["attack", "defense"] as TEntityFlexibleNumericStatusKey[]).map((targetState) =>
            NumericStateOperator.createContinuous(
              "THE_DEVILS_DREAD-ROOT",
              (operator) => operator.isSpawnedBy.isOnField && operator.isSpawnedBy.face === "FaceUp",
              entity,
              (operator, target) => target.status.kind === "Monster" && target.isOnField && target.face === "FaceUp" && target !== operator.isSpawnedBy,
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

  result.push(def_にせドレッド・ルート);

  return result;
};

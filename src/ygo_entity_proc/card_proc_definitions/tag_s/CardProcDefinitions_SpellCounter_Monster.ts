import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { createRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPrepare, getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CardActions";
import {
  createSpellCounterChargeEffect,
  createSpellCounterCommonEffect,
  getPaySpellCountersCostActionPartical,
} from "@ygo_entity_proc/card_actions/tag_s/CardActions_SpellCounter";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "魔導戦士 ブレイカー",
    actions: [
      {
        title: "①魔力充填",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["IfNormarlSummonSucceed"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenArrivalNow(["NormalSummon"]),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (myInfo.action.entity.face === "FaceDown") {
            return false;
          }
          // ブレイカーは最大一個なので、1で上書きする。
          // 無効になっている場合乗せられないが、そもそもこの処理に入らない
          myInfo.action.entity.counterHolder.setQty("SpellCounter", 1, myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      },
      {
        title: "③マナブレイク",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        fixedTags: ["Destroy", "DestroyOnField", "DestroySpellTrapOnField"],
        ...getPaySpellCountersCostActionPartical([1]),
        ...getSingleTargetActionPartical(
          (myInfo) => myInfo.activator.duel.field.getSpellTrapsOnFieldStrictly().filter((card) => card.canBeTargetOfEffect(myInfo)),
          { message: "破壊する対象を選択。", do: "Destroy" },
        ),
        execute: async (myInfo) => {
          if (myInfo.selectedEntities.every((target) => !target.isOnFieldAsSpellTrapStrictly)) {
            return false;
          }

          await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);

          return true;
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [
      createSpellCounterCommonEffect("Monster", 1),
      createRegularNumericStateOperatorHandler(
        "②攻撃力上昇",
        "Monster",
        (source) => [source],
        (source) => {
          return [
            NumericStateOperator.createContinuous(
              "②攻撃力上昇",
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
                return source + spawner.counterHolder.getQty("SpellCounter") * 300;
              },
            ),
          ];
        },
      ) as ContinuousEffectBase<unknown>,
    ],
  };

  yield {
    name: "王立魔法図書館",
    actions: [
      { ...createSpellCounterChargeEffect("①", 1) },
      {
        title: "②ドロー",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        ...getPaySpellCountersCostActionPartical([3]),
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [createSpellCounterCommonEffect("Monster", 3)],
  };
}

import { defaultContinuousSpellCardActivateAction, defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultPayLifePoint } from "@ygo_entity_proc/card_actions/CommonCardAction";
import type { TEffectTag } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { createRegularDamageFilterHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { DamageFilter } from "@ygo_duel/class_continuous_effect/DuelDamageFilter";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "チキンレース",
    actions: [
      defaultContinuousSpellCardActivateAction,
      defaultSpellTrapSetAction,
      {
        title: "②効果発動",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["FieldSpellZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller", "Opponent"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        canPayCosts: (myInfo) => myInfo.activator.lp >= 1000,
        validate: () => [],
        payCosts: (myInfo, chainBlockInfos) => defaultPayLifePoint(myInfo, chainBlockInfos, 1000),
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          let choices: { seq: number; text: string; tags: TEffectTag[] }[] = [
            { seq: 0, text: "●デッキから１枚ドローする。", tags: ["Draw"] },
            {
              seq: 1,
              text: "●このカードを破壊する。",
              tags: myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, [myInfo.action.entity]),
            },
            { seq: 2, text: "●相手は1000LP回復する。", tags: [] },
          ];

          // デッキが0枚の時、ドローできない。
          if (!myInfo.activator.getDeckCell().cardEntities.length) {
            choices = choices.filter((choice) => choice.seq);
          }

          const selected = await myInfo.activator.waitSelectText(choices, "使用する効果を選択", cancelable);
          if (selected === undefined) {
            return;
          }

          return { selectedEntities: [], chainBlockTags: selected.tags, prepared: selected.seq, nextChainBlockFilter: () => false };
        },
        execute: async (myInfo) => {
          if (myInfo.prepared === 0) {
            await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          } else if (myInfo.prepared === 1) {
            await DuelEntityShortHands.tryDestroy([myInfo.action.entity], myInfo);
          } else if (myInfo.prepared === 2) {
            myInfo.activator.getOpponentPlayer().heal(1000, myInfo.action.entity);
          }
          return true;
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [
      createRegularDamageFilterHandler(
        "①ダメージ無効",
        "Spell",
        (source) => [source.controller, source.controller.getOpponentPlayer()].map((duelist) => duelist.entity),
        (source) => [
          new DamageFilter(
            "①ダメージ無効",
            () => true,
            true,
            source,
            {},
            () => true,
            "zero_typeA",
            (filter, point, activator, damageTo) => {
              if (filter.isSpawnedBy.fieldCell.cellType !== "FieldSpellZone") {
                return {};
              }
              if (damageTo.lp >= damageTo.getOpponentPlayer().lp) {
                return {};
              }
              activator.writeInfoLog(`${damageTo.profile.name}はチキンレースの効果でダメージを受けない。`);
              return { zero_typeA: true };
            }
          ),
        ]
      ) as ContinuousEffectBase<unknown>,
    ],
  };
}

import { defaultContinuousSpellCardActivateAction, defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { executableDuelistTypes, type TActionTag } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { createRegularDamageFilterHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { DamageFilter } from "@ygo_duel/class_continuous_effect/DuelDamageFilter";
import { DuelError } from "@ygo_duel/class_error/DuelError";
import { defaultPayLifePoint } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_LifePoint";

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
        executableDuelistTypes,
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        canPayCosts: (myInfo) => myInfo.activator.lp >= 1000,
        canExecute: (myInfo) => myInfo.action.entity.face === "FaceUp",
        payCosts: (myInfo, chainBlockInfos) => defaultPayLifePoint(myInfo, chainBlockInfos, 1000),
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          let choices: { seq: number; text: string; tags: TActionTag[] }[] = [
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

          myInfo.data = selected.seq;

          return { selectedEntities: [], chainBlockTags: selected.tags, nextChainBlockFilter: (activator, action) => !action.isWithChainBlock };
        },
        execute: async (myInfo) => {
          if (myInfo.data === 0) {
            await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          } else if (myInfo.data === 1) {
            await DuelEntityShortHands.tryDestroy([myInfo.action.entity], myInfo);
          } else if (myInfo.data === 2) {
            myInfo.activator.getOpponentPlayer().heal(1000, myInfo.action.entity);
          } else {
            throw new DuelError("値が正しくない。", myInfo, myInfo.data);
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
          new DamageFilter({
            title: "①ダメージ無効",
            validateAlive: () => true,
            isContinuous: true,
            isSpawnedBy: source,
            actionAttr: {},
            isApplicableTo: () => true,
            calcType: "zero_typeA",
            filter: (filter, point, activator, damageTo) => {
              if (filter.isSpawnedBy.cell.cellType !== "FieldSpellZone") {
                return {};
              }
              if (damageTo.lp >= damageTo.getOpponentPlayer().lp) {
                return {};
              }
              activator.writeInfoLog(`${damageTo.profile.name}はチキンレースの効果でダメージを受けない。`);
              return { zero_typeA: true };
            },
          }),
        ]
      ) as ContinuousEffectBase<unknown>,
    ],
  };
}

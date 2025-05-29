import {
  canSelfSepcialSummon,
  defaultSelfRebornExecute,
  defaultSelfReleaseCanPayCosts,
  defaultSelfReleasePayCosts,
  getDestsForSelfSpecialSummon,
} from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { defaultPrepare, getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CardActions";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { getCommonLightswormEndPhaseAction } from "@ygo_entity_proc/card_actions/tag_l/CardActions_Lightsworn_Monster";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ライトロード・アサシン ライデン",
    actions: [
      {
        title: `①墓地送り＆自己強化`,
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurn: 1,
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 1,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities.slice(0, 2);

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);

          const qty = cards.filter((card) => card.kind === "Monster").filter((monster) => monster.status.nameTags?.includes("ライトロード")).length;

          if (qty) {
            myInfo.action.entity.numericOprsBundle.push(
              NumericStateOperator.createLingeringAddition(
                myInfo.action.title,
                (operator) => operator.isSpawnedBy.isEffective && operator.duel.clock.turn - operator.isSpawnedAt.turn < 2,
                myInfo.action.entity,
                myInfo.action,
                "attack",
                (spawner, monster, current) => current + 200 * qty
              )
            );
          }

          return true;
        },
        settle: async () => true,
      },
      getCommonLightswormEndPhaseAction("②", 2),
    ],
  };
  yield {
    name: "ライトロード・ビースト ウォルフ",
    actions: [
      {
        title: "①自己再生",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Departure", from: ["Deck"] },
        fixedTags: ["SpecialSummonFromGraveyard"],
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: defaultPrepare,
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "ライトロード・アーチャー フェリス",
    actions: [
      {
        title: "①自己再生",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Departure", from: ["Deck"], needsByEffect: true, causerFilter: (me, causer) => causer.kind === "Monster" },
        fixedTags: ["SpecialSummonFromGraveyard"],
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: defaultPrepare,
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      },
      {
        title: "②モンスター破壊＆墓地送り",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["Destroy", "DestroyMonsterOnField", "DestroyOnOpponentField", "DestroyOnField"],
        canPayCosts: defaultSelfReleaseCanPayCosts,
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 2,
        payCosts: defaultSelfReleasePayCosts,
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.activator
              .getOpponentPlayer()
              .getMonstersOnField()
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
          { do: "Destroy" }
        ),
        execute: async (myInfo) => {
          // フィールドにいなければ効果なし
          if (myInfo.selectedEntities.every((target) => !target.isOnField)) {
            return false;
          }

          const destroyed = await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);

          if (!destroyed) {
            return false;
          }

          // この後の墓地送りはタイミングを逃させる要因になる。
          myInfo.activator.duel.clock.incrementProcSeq();

          // 発動には三枚以上必要だが、処理時に三枚未満なら全て墓地に送る。
          const cards = myInfo.activator.getDeckCell().cardEntities.slice(0, 3);

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

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

export default function* generate(): Generator<EntityProcDefinition> {
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
        fixedTags: ["SpecialSummonFromGraveyard"],
        meetsConditions: (myInfo) => myInfo.action.entity.wasMovedAtPreviousChain && myInfo.action.entity.wasMovedFrom.cellType === "Deck",
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
        fixedTags: ["SpecialSummonFromGraveyard"],
        meetsConditions: (myInfo) =>
          myInfo.action.entity.wasMovedAtPreviousChain &&
          myInfo.action.entity.wasMovedFrom.cellType === "Deck" &&
          myInfo.action.entity.moveLog.latestRecord.entity.kind === "Monster" &&
          myInfo.action.entity.moveLog.latestRecord.movedAs.includes("Effect"),
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: defaultPrepare,
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      },
      {
        title: "②モンスター破壊",
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

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare, getDeckDestructionActionPartical, getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CardActions";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { IllegalCancelError } from "@ygo_duel/class_error/DuelError";

import { getDefaultLinkSummonAction } from "@ygo_entity_proc/card_actions/CardActions_LinkMonster";
import { monsterAttributes } from "@ygo/class/YgoTypes";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ライトロード・ドミニオン キュリオス",
    actions: [
      getDefaultLinkSummonAction(
        (materials) =>
          materials.flatMap((material) => material.types).getDistinct().length === 3 &&
          monsterAttributes.some((attr) => materials.every((material) => material.attr.includes(attr)))
      ),
      {
        title: `①墓地送り`,
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurn: 1,
        triggerPattern: { triggerType: "Arrival", arrivalReasons: ["LinkSummon"] },
        fixedTags: ["SendToGraveyardFromDeck"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const choices = myInfo.activator.getDeckCell().cardEntities;
          if (!choices.length) {
            return false;
          }

          const card = await myInfo.activator.waitSelectEntity(choices, "墓地に送るカードを選択", false);
          if (!card) {
            throw new IllegalCancelError(myInfo);
          }
          await card.sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);

          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
      {
        title: "②墓地送り",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        fixedTags: ["SpecialSummonFromGraveyard"],
        meetsConditions: (myInfo) => {
          const wasMovedAt = myInfo.action.entity.moveLog.latestRecord.movedAt;
          // 前のチェーンで移動したエンティティがどこから移動したかを取得。
          return myInfo.action.duel.field.moveLog
            .getPriviousChainLog()
            .filter((record) => record.entity.cell.cellType === "Graveyard")
            .filter((record) => record.movedAt.totalProcSeq > wasMovedAt.totalProcSeq)
            .map((record) => record.entity.wasMovedFrom)
            .filter((cell) => cell.owner === myInfo.activator)
            .some((cell) => cell.cellType === "Deck");
        },
        ...getDeckDestructionActionPartical({ targets: ["Self"], qty: 3 }),
        settle: async () => true,
      },
      {
        title: "③サルベージ",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard", "Banished"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Departure", needsByBattle: true, needsByEffect: true, needsByOpponent: true, from: monsterZoneCellTypes },
        fixedTags: ["ReturnToHandFromGraveyard"],
        ...getSingleTargetActionPartical((myInfo) => myInfo.activator.getGraveyard().cardEntities, { message: "手札に加えるカードを選択。" }),
        execute: async (myInfo) => {
          if (myInfo.selectedEntities.some((card) => card.wasMovedAfter(myInfo.isActivatedAt))) {
            return false;
          }

          await DuelEntityShortHands.addManyToHand(myInfo.selectedEntities, ["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

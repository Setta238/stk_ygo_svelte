import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultLinkSummonAction } from "@ygo_entity_proc/card_actions/CommonCardAction_LinkMonster";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { damageStepPeriodKeys, duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultTargetMonstersRebornExecute, defaultTargetMonstersRebornPrepare } from "../../card_actions/CommonCardAction";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ファイアウォール・ドラゴン・シンギュラリティ",
    actions: [
      getDefaultLinkSummonAction((selected) => selected.length > 2),
      {
        title: "①バウンス＆自己強化",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        canExecute: (myInfo) => {
          const categories = [...myInfo.activator.getGraveyard().cardEntities, ...myInfo.activator.getMonstersOnField()]
            .flatMap((monster) => monster.status.monsterCategories ?? [])
            .getDistinct();
          const maxQty = categories.union(["Ritual", "Fusion", "Synchro", "Xyz"]).length;

          if (maxQty < 1) {
            return false;
          }
          const choices = [
            ...myInfo.activator.getOpponentPlayer().getGraveyard().cardEntities,
            ...myInfo.activator.getOpponentPlayer().getEntiteisOnField(),
          ].filter((entity) => entity.canBeTargetOfEffect(myInfo));

          return choices.length > 0;
        },
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          const categories = [...myInfo.activator.getGraveyard().cardEntities, ...myInfo.activator.getMonstersOnField()]
            .flatMap((monster) => monster.status.monsterCategories ?? [])
            .getDistinct();
          const maxQty = categories.union(["Ritual", "Fusion", "Synchro", "Xyz"]).length;

          if (maxQty < 1) {
            return;
          }
          const choices = [
            ...myInfo.activator.getOpponentPlayer().getGraveyard().cardEntities,
            ...myInfo.activator.getOpponentPlayer().getEntiteisOnField(),
          ].filter((entity) => entity.canBeTargetOfEffect(myInfo));

          if (choices.length < 1) {
            return;
          }
          const selectedEntities = await myInfo.activator.waitSelectEntities(
            choices,
            undefined,
            (selected) => selected.length > 0 && selected.length <= maxQty,
            "手札に戻すカードを選択。",
            cancelable
          );

          if (!selectedEntities) {
            return;
          }
          return { selectedEntities, chainBlockTags: [] };
        },
        execute: async (myInfo): Promise<boolean> => {
          const targets = myInfo.selectedEntities
            .filter((card) => card.isOnFieldStrictly || card.fieldCell.cellType === "Graveyard")
            .filter((card) => card.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action));
          await DuelEntityShortHands.returnManyToHandForTheSameReason(targets, ["Effect"], myInfo.action.entity, myInfo.activator);

          const qty = targets.filter((card) => card.fieldCell.cellType === "Hand" || card.fieldCell.cellType === "ExtraDeck").length;

          myInfo.action.entity.numericOprsBundle.push(
            NumericStateOperator.createLingeringAddition(
              myInfo.action.title,
              (operator) => operator.isSpawnedBy.isEffective,
              myInfo.action.entity,
              myInfo.action,
              "attack",
              (spawner: DuelEntity, monster: DuelEntity, current: number) => current + 500 * qty
            )
          );

          return true;
        },
        settle: async () => true,
      },
      {
        title: "②蘇生",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        meetsConditions: (myInfo) => {
          const wasMovedAt = myInfo.action.entity.moveLog.latestRecord.movedAt;
          // 前のチェーンで移動したエンティティがどこから移動したかを取得。
          const froms = myInfo.action.duel.field.moveLog
            .getPriviousChainLog()
            .filter((record) => {
              console.log(record, record.entity.fieldCell.cellType === "Graveyard", record.movedAs.includes("BattleDestroy"));
              return record.entity.fieldCell.cellType === "Graveyard" || record.movedAs.includes("BattleDestroy");
            })
            .filter((record) => record.movedAt.totalProcSeq > wasMovedAt.totalProcSeq)
            .map((record) => record.entity.wasMovedFrom)
            .toArray();

          return myInfo.action.entity.linkArrowDests.union(froms).length > 0;
        },
        canExecute: (myInfo) => {
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((monster) => monster.types.includes("Cyberse"))
              .filter((card) => card.canBeTargetOfEffect(myInfo))
              .map((monster) => {
                return { monster, posList: faceupBattlePositions, cells };
              }),
            [],
            false
          );
          return list.length > 0;
        },
        prepare: (myInfo) =>
          defaultTargetMonstersRebornPrepare(
            myInfo,
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((monster) => monster.types.includes("Cyberse"))
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
            faceupBattlePositions
          ),
        execute: (myInfo) => defaultTargetMonstersRebornExecute(myInfo, faceupBattlePositions),
        settle: async () => true,
      },
    ],
  };
}

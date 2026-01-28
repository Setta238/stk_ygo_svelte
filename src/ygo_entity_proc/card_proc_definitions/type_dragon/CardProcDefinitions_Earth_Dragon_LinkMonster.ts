import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultLinkSummonAction } from "@ygo_entity_proc/card_actions/CardActions_LinkMonster";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import type { CardActionDefinition } from "@ygo_duel/class/DuelEntityAction";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { IllegalCancelError } from "@ygo_duel/class_error/DuelError";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "鎖龍蛇－スカルデット",
    actions: [
      getDefaultLinkSummonAction((selected) => selected.length > 1 && selected.length === selected.map((material) => material.nm).getDistinct().length),
      {
        title: "攻守強化",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.action.entity.info.materials.length > 1,
        canExecute: (myInfo) => {
          const wasMovedAt = myInfo.action.entity.moveLog.latestRecord.movedAt;

          return myInfo.action.entity.linkArrowDests
            .filter((cell) => cell.cardEntities.length)
            .map((cell) => cell.cardEntities[0])
            .filter((monster) => monster.wasMovedAfter(wasMovedAt))
            .filter((monster) => monster.hasBeenArrivalNow(["NormalSummon", "SpecialSummon"]))
            .some((monster) => monster.face === "FaceUp");
        },
        prepare: async (myInfo) => {
          const wasMovedAt = myInfo.action.entity.moveLog.latestRecord.movedAt;
          myInfo.data = myInfo.action.entity.linkArrowDests
            .filter((cell) => cell.cardEntities.length)
            .map((cell) => cell.cardEntities[0])
            .filter((monster) => monster.wasMovedAfter(wasMovedAt))
            .filter((monster) => monster.hasBeenArrivalNow(["NormalSummon", "SpecialSummon"]))
            .filter((monster) => monster.face === "FaceUp");

          return {};
        },
        execute: async (myInfo) => {
          if (!myInfo.data) {
            return false;
          }

          myInfo.data
            .filter((target) => target.face === "FaceUp")
            .filter((target) => target.isOnFieldAsMonsterStrictly)
            .forEach((target) => {
              (["attack", "defense"] as const)
                .map((state) =>
                  NumericStateOperator.createLingeringAddition(
                    myInfo.action.title,
                    (operator) => operator.isSpawnedBy.isEffective,
                    myInfo.action.entity,
                    myInfo.action,
                    state,
                    (spawner: DuelEntity, monster: DuelEntity, current: number) => current + 300,
                  ),
                )
                .forEach((ope) => target.numericOprsBundle.push(ope));
            });

          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<DuelEntity[]>,
      {
        title: "特殊召喚",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        fixedTags: ["SpecialSummonFromHand"],
        canExecute: (myInfo) => {
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getHandCell()
              .cardEntities.filter((card) => card.kind === "Monster")
              .map((monster) => {
                return { monster, posList: faceupBattlePositions, cells };
              }),
            [],
            false,
          );
          return list.length > 0;
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cells = myInfo.activator.getMonsterZones();
          const monster = await myInfo.activator.summonOne(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getHandCell()
              .cardEntities.filter((card) => card.kind === "Monster")
              .map((monster) => {
                return { monster, posList: faceupBattlePositions, cells };
              }),
            [],
            false,
            false,
          );
          return Boolean(monster);
        },
        settle: async () => true,
      },
      {
        title: "手札交換",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["Draw"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenArrivalNow(["LinkSummon"]),
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 3,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.length < 4) {
            return false;
          }

          await myInfo.activator.draw(4, myInfo.action.entity, myInfo.activator);

          // この後のデッキへ戻す処理はタイミングを逃す要因になる
          await myInfo.action.duel.clock.incrementProcSeq();

          for (const num of [1, 2, 3]) {
            const card = await myInfo.activator.waitSelectEntity(
              myInfo.activator.getHandCell().cardEntities,
              `デッキの一番下に戻すカードを選択（${num}枚目）。`,
            );

            if (!card) {
              throw new IllegalCancelError(myInfo);
            }

            await card.returnToDeck("Bottom", ["Effect"], myInfo.action.entity, myInfo.activator);
          }

          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

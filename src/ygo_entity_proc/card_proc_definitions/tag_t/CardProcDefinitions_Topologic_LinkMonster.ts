import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultLinkSummonAction } from "@ygo_entity_proc/card_actions/CardActions_LinkMonster";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { IllegalActionError } from "@ygo_duel/class_error/DuelError";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "トポロジック・ボマー・ドラゴン",
    actions: [
      getDefaultLinkSummonAction((selected) => selected.length > 1 && selected.every((monster) => monster.status.monsterCategories?.includes("Effect"))),
      {
        title: "フルオーバーラップ",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["DestroyMonsterOnField"],
        canExecute: (myInfo) => {
          const monsters = myInfo.activator.duel.field
            .getMonstersOnFieldStrictly()
            .filter((monster) => monster.wasMovedAtPreviousChain)
            .filter((monster) => monster.linkedEntities.length);
          if (!monsters.length) {
            return false;
          }

          const hadArrivedAt = myInfo.action.entity.hadArrivedToFieldAt();

          if (!hadArrivedAt) {
            return false;
          }

          return myInfo.activator.duel.field
            .getMonstersOnFieldStrictly()
            .filter((monster) => monster.hasBeenArrivalNow(["SpecialSummon"]))
            .filter((monster) => (monster.hadArrivedToFieldAt()?.totalProcSeq ?? 0) > hadArrivedAt?.totalProcSeq)
            .some((monster) => {
              const hadArrivedAt = monster.hadArrivedToFieldAt();
              if (!hadArrivedAt) {
                return false;
              }
              return monster.linkArrowSources.some((linkArrowSource) => linkArrowSource.wasMovedBefore(hadArrivedAt));
            });
        },
        prepare: async (myInfo) => {
          const cards = myInfo.action.entity.field.getMonstersOnFieldStrictly().filter((monster) => monster.cell.cellType === "MonsterZone");

          return { selectedEntities: [], chainBlockTags: myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, cards) };
        },
        execute: async (myInfo) => {
          const cards = myInfo.action.entity.field.getMonstersOnFieldStrictly().filter((monster) => monster.cell.cellType === "MonsterZone");

          await DuelEntityShortHands.tryDestroy(cards, myInfo);

          if (!myInfo.activator.isTurnPlayer) {
            return true;
          }
          if (myInfo.activator.duel.clock.period.phase === "end") {
            return true;
          }
          if (myInfo.activator.duel.clock.period.phase === "main2") {
            return true;
          }

          myInfo.activator.duel.field.statusOperatorPool.push(
            new StatusOperator({
              title: "攻撃抑止",
              validateAlive: (ope) => ope.duel.clock.isSameTurn(ope.isSpawnedAt),
              isContinuous: false,
              isSpawnedBy: myInfo.action.entity,
              actionAttr: myInfo.action,
              isApplicableTo: (ope, target) => target.controller === ope.effectOwner && target !== ope.isSpawnedBy && target.isOnFieldAsMonsterStrictly,
              statusCalculator: () => ({ canAttack: false }),
            }),
          );

          return true;
        },
        settle: async () => true,
      },
      {
        title: "エイミング・ブラスト",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: [...monsterZoneCellTypes, "Graveyard", "Banished"],
        executablePeriods: ["b1DAfterDmgCalc", "b2DAfterDmgCalc"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["DamageToOpponent"],
        meetsConditions: (myInfo) =>
          Boolean(
            myInfo.activator.duel.attackingMonster === myInfo.action.entity &&
              myInfo.activator.duel.targetForAttack &&
              myInfo.activator.duel.targetForAttack.entityType === "Card" &&
              (myInfo.activator.duel.targetForAttack.origin.attack ?? 0) > 0,
          ),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (!myInfo.activator.duel.targetForAttack) {
            throw new IllegalActionError("UnexpectedSituation", myInfo);
          }

          myInfo.activator.getOpponentPlayer().effectDamage(myInfo.activator.duel.targetForAttack.atk ?? 0, myInfo);
          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultSpellTrapSetAction, getDefaultEquipSpellTrapAction } from "../../card_actions/CardActions_Spell";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import { defaultPrepare, getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CardActions";
import {
  defaultCanPaySelfSendToGraveyardCost,
  defaultPaySelfSendToGraveyardCost,
} from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_SendToGraveyard";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "折れ竹光",
    actions: [getDefaultEquipSpellTrapAction(), defaultSpellTrapSetAction],
  };

  yield {
    name: "妖刀竹光",
    actions: [
      getDefaultEquipSpellTrapAction(),
      defaultSpellTrapSetAction,
      {
        title: "②直接攻撃付与",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurn: 1,
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.activator
              .getSpellTrapsOnField()
              .filter((spelltrap) => spelltrap.status.nameTags?.includes("竹光"))
              .filter((spelltrap) => spelltrap !== myInfo.action.entity)
              .filter((spelltrap) => spelltrap.status.spellCategory === "Equip"),
          { message: "手札に戻すカードを選択。", tags: ["BounceToHand"] }
        ),
        execute: async (myInfo) => {
          const equipOwner = myInfo.action.entity.info.equipedBy;
          if (!equipOwner) {
            return false;
          }
          await DuelEntityShortHands.returnManyToHandForTheSameReason(myInfo.selectedEntities, ["Effect"], myInfo.action.entity, myInfo.activator);

          equipOwner.statusOperatorBundle.push(
            new StatusOperator({
              title: "直接攻撃",
              validateAlive: (ope) => ope.duel.clock.isSameTurn(ope.isSpawnedAt),
              isContinuous: false,
              isSpawnedBy: myInfo.action.entity,
              actionAttr: myInfo.action,
              isApplicableTo: (operator, target) => target.isOnFieldAsMonsterStrictly && target.face === "FaceUp",
              statusCalculator: () => {
                return { canDirectAttack: true };
              },
            })
          );

          return true;
        },
        settle: async () => true,
      },
      {
        title: "③サーチ",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SearchFromDeck"],
        meetsConditions: (myInfo) => myInfo.action.entity.wasMovedAtPreviousChain && myInfo.action.entity.wasMovedFrom.cellType !== "Banished",
        canExecute: (myInfo) =>
          myInfo.activator.canAddToHandFromDeck &&
          myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.nameTags?.includes("竹光"))
            .some((takemitsu) => takemitsu.status.name !== "妖刀竹光"),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const takemitsus = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.nameTags?.includes("竹光"))
            .filter((takemitsu) => takemitsu.status.name !== "妖刀竹光");

          if (!takemitsus.length) {
            return false;
          }
          const takemitsu = await myInfo.activator.waitSelectEntity(takemitsus, "手札に加えるカードを選択。", false);
          if (!takemitsu) {
            throw new IllegalCancelError(myInfo);
          }
          await takemitsu.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      },
    ],
  };

  yield {
    name: "真刀竹光",
    actions: [
      getDefaultEquipSpellTrapAction(),
      defaultSpellTrapSetAction,
      {
        title: "②相手モンスター破壊",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: ["b1DAfterDmgCalc", "b2DAfterDmgCalc"],
        executableDuelistTypes: ["Controller"],
        canExecute: (myInfo) => {
          const equipOwner = myInfo.action.entity.info.equipedBy;
          if (!equipOwner) {
            return false;
          }

          if (
            !equipOwner.info.battleLog
              .filter((record) => myInfo.activator.duel.clock.isPreviousStage(record.timestamp))
              .some((record) => record.enemy.entityType === "Duelist")
          ) {
            return false;
          }

          if (!myInfo.activator.getOpponentPlayer().getMonstersOnField().length) {
            return false;
          }

          if (
            !myInfo.activator
              .getOpponentPlayer()
              .lifeLog.filter((record) => myInfo.activator.duel.clock.isPreviousStage(record.clock))
              .some((record) => record.entity === equipOwner)
          ) {
            return false;
          }

          return true;
        },
        prepare: async (myInfo) => {
          return {
            selectedEntities: [],
            chainBlockTags: myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, myInfo.activator.getOpponentPlayer().getMonstersOnField()),
            prepared: undefined,
          };
        },
        execute: async (myInfo) => {
          const destroyed = await DuelEntityShortHands.tryDestroy(myInfo.activator.getOpponentPlayer().getMonstersOnField(), myInfo);
          return destroyed.length > 0;
        },
        settle: async () => true,
      },
      {
        title: "③竹光入替",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        canPayCosts: (myInfo) => {
          const equipOwner = myInfo.action.entity.info.equipedBy;
          if (!equipOwner) {
            return false;
          }
          return defaultCanPaySelfSendToGraveyardCost(myInfo);
        },
        canExecute: (myInfo) =>
          Boolean(
            myInfo.action.entity.info.equipedBy &&
              myInfo.activator
                .getDeckCell()
                .cardEntities.filter((card) => card.status.nameTags?.includes("竹光"))
                .filter((takemitsu) => takemitsu.status.name !== "真刀竹光")
                .some((spelltrap) => spelltrap.status.spellCategory === "Equip")
          ) && myInfo.activator.duel.field.getMonstersOnFieldStrictly().some((monster) => monster.canBeTargetOfEffect(myInfo)),
        payCosts: defaultPaySelfSendToGraveyardCost,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const takemitsus = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.nameTags?.includes("竹光"))
            .filter((takemitsu) => takemitsu.status.name !== "真刀竹光")
            .filter((spelltrap) => spelltrap.status.spellCategory === "Equip");

          if (!takemitsus.length) {
            return false;
          }

          const cells = myInfo.activator.getAvailableSpellTrapZones();

          if (!cells.length) {
            return false;
          }

          const monsters = myInfo.activator.duel.field.getMonstersOnFieldStrictly().filter((monster) => monster.canBeTargetOfEffect(myInfo));

          if (!monsters.length) {
            return false;
          }

          const takemitsu = await myInfo.activator.waitSelectEntity(takemitsus, "装備するカードを選択。", false);
          if (!takemitsu) {
            throw new IllegalCancelError("竹光選択", myInfo);
          }
          const cell = await myInfo.activator.duel.view.waitSelectDestination(
            myInfo.activator,
            takemitsu,
            cells,
            "装備カードを置く場所を選択。",
            "装備",
            false
          );
          if (!cell) {
            throw new IllegalCancelError("配置場所選択", myInfo);
          }

          await takemitsu.putDirectly(cell, "Spell", ["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();

          const target = await myInfo.activator.waitSelectEntity(monsters, "装備する対象を選択。", false);
          if (!target) {
            throw new IllegalCancelError("装備対象選択", myInfo);
          }

          takemitsu.info.equipedBy = target;
          takemitsu.info.effectTargets[myInfo.action.seq] = [target];
          target.info.equipEntities.push(takemitsu);

          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

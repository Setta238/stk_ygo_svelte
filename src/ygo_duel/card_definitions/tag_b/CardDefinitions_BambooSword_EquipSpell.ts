import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { CardDefinition } from "../CardDefinitions";
import { defaultSpellTrapSetAction, getDefaultEquipSpellTrapAction } from "../../card_actions/DefaultCardAction_Spell";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import { defaultCanPaySelfSendToGraveyardCost, defaultPaySelfSendToGraveyardCost, defaultPrepare } from "../../card_actions/DefaultCardAction";

export const createCardDefinitions_BambooSword_EquipSpell = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  result.push({
    name: "折れ竹光",
    actions: [getDefaultEquipSpellTrapAction(), defaultSpellTrapSetAction],
  });
  result.push({
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
        isOnlyNTimesPerTurn: 1,
        validate: (myInfo) => {
          if (
            !myInfo.activator
              .getSpellTrapsOnField()
              .filter((spelltrap) => spelltrap.status.nameTags?.includes("竹光"))
              .filter((spelltrap) => spelltrap !== myInfo.action.entity)
              .some((spelltrap) => spelltrap.status.spellCategory === "Equip")
          ) {
            return;
          }
          const equipOwner = myInfo.action.entity.info.equipedBy;
          if (!equipOwner) {
            return;
          }

          if (equipOwner.status.canDirectAttack) {
            return;
          }
          return [];
        },
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          const takemitsu = await myInfo.activator.waitSelectEntity(
            myInfo.activator
              .getSpellTrapsOnField()
              .filter((spelltrap) => spelltrap.status.nameTags?.includes("竹光"))
              .filter((spelltrap) => spelltrap !== myInfo.action.entity)
              .filter((spelltrap) => spelltrap.status.spellCategory === "Equip"),
            "手札に戻すカードを選択。",
            cancelable
          );

          if (!takemitsu) {
            return;
          }

          return { selectedEntities: [takemitsu], chainBlockTags: [], prepared: undefined };
        },
        execute: async (myInfo) => {
          const equipOwner = myInfo.action.entity.info.equipedBy;
          if (!equipOwner) {
            return false;
          }
          await DuelEntityShortHands.returnManyToHandForTheSameReason(myInfo.selectedEntities, ["Effect"], myInfo.action.entity, myInfo.activator);

          equipOwner.statusOperatorBundle.push(
            new StatusOperator(
              "直接攻撃",
              (ope) => {
                console.log(ope.effectOwner.duel.clock.turn, ope.isSpawnedAt.turn);
                return ope.effectOwner.duel.clock.isSameTurn(ope.isSpawnedAt);
              },
              false,
              myInfo.action.entity,
              myInfo.action,
              () => true,
              (ope, wip) => {
                return { ...wip, canDirectAttack: true };
              }
            )
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
        validate: (myInfo) => {
          // 前回のチェーンで動いたかどうか
          if (!myInfo.action.entity.wasMovedAtPreviousChain) {
            return;
          }

          if (!myInfo.activator.canAddToHandFromDeck) {
            return;
          }

          return myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.nameTags?.includes("竹光"))
            .some((takemitsu) => takemitsu.status.name !== "妖刀竹光")
            ? []
            : undefined;
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
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
          return (await takemitsu.addToHand(["Effect"], myInfo.action.entity, myInfo.activator)).cellType === "Hand";
        },
        settle: async () => true,
      },
    ],
  });
  result.push({
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
        validate: (myInfo) => {
          const equipOwner = myInfo.action.entity.info.equipedBy;
          if (!equipOwner) {
            return;
          }

          if (
            !equipOwner.info.battleLog
              .filter((record) => myInfo.activator.duel.clock.isPreviousStage(record.timestamp))
              .some((record) => record.enemy.entityType === "Duelist")
          ) {
            return;
          }

          if (!myInfo.activator.getOpponentPlayer().getMonstersOnField().length) {
            return;
          }

          if (
            !myInfo.activator
              .getOpponentPlayer()
              .lifeLog.filter((record) => myInfo.activator.duel.clock.isPreviousStage(record.clock))
              .some((record) => record.entity === equipOwner)
          ) {
            return;
          }

          return [];
        },
        prepare: async (myInfo) => {
          return {
            selectedEntities: [],
            chainBlockTags: myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator.getOpponentPlayer().getMonstersOnField()),
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
        canPayCosts: (myInfo) => {
          const equipOwner = myInfo.action.entity.info.equipedBy;
          if (!equipOwner) {
            return false;
          }
          return defaultCanPaySelfSendToGraveyardCost(myInfo);
        },
        validate: (myInfo) => {
          const equipOwner = myInfo.action.entity.info.equipedBy;
          if (!equipOwner) {
            return;
          }
          const takemitsus = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.nameTags?.includes("竹光"))
            .filter((takemitsu) => takemitsu.status.name !== "真刀竹光")
            .filter((spelltrap) => spelltrap.status.spellCategory === "Equip");

          if (!takemitsus.length) {
            return;
          }

          // TODO デッキの竹光を装備できない可能性。
          return myInfo.activator.duel.field.getMonstersOnFieldStrictly().some((monster) => monster.canBeTargetOfEffect(myInfo)) ? [] : undefined;
        },
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
  });
  return result;
};

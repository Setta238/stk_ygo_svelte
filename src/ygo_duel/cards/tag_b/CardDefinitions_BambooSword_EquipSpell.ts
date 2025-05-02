import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { CardDefinition } from "../CardDefinitions";
import { defaultSpellTrapSetAction, getDefaultEquipSpellTrapAction } from "../DefaultCardAction_Spell";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

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
  return result;
};

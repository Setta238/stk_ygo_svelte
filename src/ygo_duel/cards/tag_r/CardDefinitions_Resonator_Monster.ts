import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
  getSelfBattleSubstituteEffectDefinition,
} from "@ygo_duel/cards/DefaultCardAction_Monster";
import type { CardDefinition } from "../CardDefinitions";
import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";

export const createCardDefinitions_Resonator_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
    name: "ダーク・リゾネーター",
    actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction, defaultNormalSummonAction] as CardActionDefinition<unknown>[],
    substituteEffects: [getSelfBattleSubstituteEffectDefinition(1)],
  });
  result.push({
    name: "レッド・リゾネーター",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      defaultNormalSummonAction,
      {
        title: "①特殊召喚",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (!myInfo.action.entity.hasBeenSummonedNow(["NormalSummon"])) {
            return;
          }
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getHandCell()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => (card.lvl ?? 12) < 5)
              .map((monster) => {
                return { monster, posList: faceupBattlePositions, cells };
              }),
            [],
            false
          );
          if (!list.length) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromHand"], prepared: undefined };
        },
        execute: async (myInfo) => {
          const cells = myInfo.activator.getMonsterZones();
          const summonArgs = myInfo.activator
            .getHandCell()
            .cardEntities.filter((card) => card.status.kind === "Monster")
            .filter((card) => (card.lvl ?? 12) < 5)
            .map((monster) => {
              return { monster, posList: faceupBattlePositions, cells };
            });

          const monster = await myInfo.activator.summonOne(myInfo.activator, "SpecialSummon", ["Effect"], myInfo.action, summonArgs, [], false, false);

          return Boolean(monster);
        },
        settle: async () => true,
      },
      {
        title: "②回復",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        hasToTargetCards: true,
        isOnlyNTimesPerTurn: 1,
        validate: (myInfo) => {
          if (!myInfo.action.entity.hasBeenSummonedNow(["SpecialSummon"])) {
            return;
          }

          return myInfo.activator
            .getMonstersOnField()
            .filter((monster) => monster.canBeTargetOfEffect(myInfo))
            .filter((monster) => (monster.atk ?? 0) > 0)
            .some((monster) => monster.info.summonKinds.includes("SpecialSummon"))
            ? []
            : undefined;
        },
        prepare: async (myInfo) => {
          const monster = await myInfo.activator.waitSelectEntity(
            myInfo.activator
              .getMonstersOnField()
              .filter((monster) => monster.canBeTargetOfEffect(myInfo))
              .filter((monster) => (monster.atk ?? 0) > 0)
              .filter((monster) => monster.info.summonKinds.includes("SpecialSummon")),
            "対象とするモンスターを選択",
            false
          );
          if (!monster) {
            return;
          }
          return { selectedEntities: [monster], chainBlockTags: [], prepared: undefined };
        },
        execute: async (myInfo) => {
          const lp = myInfo.activator.lp;
          myInfo.selectedEntities
            .filter((monster) => monster.isOnFieldAsMonsterStrictly)
            .forEach((monster) => myInfo.activator.heal(monster.atk ?? 0, myInfo.action.entity));
          return myInfo.activator.lp !== lp;
        },
        settle: async () => true,
      },
    ],
  });

  return result;
};

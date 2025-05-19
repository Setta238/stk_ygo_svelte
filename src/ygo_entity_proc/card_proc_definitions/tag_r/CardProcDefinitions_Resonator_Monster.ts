import { getSelfBattleSubstituteEffectDefinition } from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CommonCardAction";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ダーク・リゾネーター",
    actions: [],
    substituteEffects: [getSelfBattleSubstituteEffectDefinition(1)],
  };

  yield {
    name: "レッド・リゾネーター",
    actions: [
      {
        title: "①特殊召喚",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenSummonedNow(["NormalSummon"]),
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
              .filter((card) => (card.lvl ?? 12) < 5)
              .map((monster) => {
                return { monster, posList: faceupBattlePositions, cells };
              }),
            [],
            false
          );
          return list.length > 0;
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromHand", "IfNormarlSummonSucceed"] };
        },
        execute: async (myInfo) => {
          const cells = myInfo.activator.getMonsterZones();
          const summonArgs = myInfo.activator
            .getHandCell()
            .cardEntities.filter((card) => card.kind === "Monster")
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
        isOnlyNTimesPerTurn: 1,
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenSummonedNow(["SpecialSummon"]),
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.activator
              .getMonstersOnField()
              .filter((monster) => monster.canBeTargetOfEffect(myInfo))
              .filter((monster) => (monster.atk ?? 0) > 0)
              .filter((monster) => monster.info.summonKinds.includes("SpecialSummon")),
          { message: "対象モンスターを選択。" }
        ),
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
  };
}

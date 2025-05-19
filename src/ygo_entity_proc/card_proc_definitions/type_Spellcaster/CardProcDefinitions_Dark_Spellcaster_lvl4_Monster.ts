import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { createRegularProcFilterHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "召喚僧サモンプリースト",
    actions: [
      {
        title: "①表示形式変更",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenSummonedNow(["NormalSummon", "FlipSummon"]),
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["IfNormarlSummonSucceed"], prepared: undefined };
        },
        execute: async (myInfo) => {
          if (myInfo.action.entity.battlePosition !== "Attack") {
            return false;
          }
          if (!myInfo.action.entity.isOnFieldAsMonsterStrictly) {
            return false;
          }

          await myInfo.action.entity.setBattlePosition("Defense", ["Effect"], myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      },
      {
        title: "③リクルート",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        canPayCosts: (myInfo) => {
          if (!myInfo.activator.status.canDiscardAsCost) {
            return false;
          }

          return myInfo.activator.getHandCell().cardEntities.some((card) => card.kind === "Spell");
        },
        canExecute: (myInfo) => {
          const lv4Monsters = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((monster) => monster.lvl === 4);

          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            lv4Monsters.map((lvl4) => {
              return { monster: lvl4, posList: faceupBattlePositions, cells };
            }),
            [],
            false
          );
          return list.length > 0;
        },
        payCosts: async (myInfo, chainBlockInfos, cancelable) => {
          const spells = myInfo.activator.getHandCell().cardEntities.filter((card) => card.kind === "Spell");

          const cost = await myInfo.activator.waitSelectEntity(spells, "手札コストを選択", cancelable);
          if (!cost && !cancelable) {
            throw new IllegalCancelError(myInfo);
          }

          if (!cost) {
            return;
          }

          await cost.discard(["Cost"], myInfo.action.entity, myInfo.activator);

          return { discard: [cost] };
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromDeck"], prepared: undefined };
        },
        execute: async (myInfo) => {
          const monsters = myInfo.activator.getDeckCell().cardEntities.filter((card) => card.lvl === 4);

          const cells = myInfo.activator.getMonsterZones();
          const monster = await myInfo.activator.summonOne(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            monsters.map((lvl1) => {
              return { monster: lvl1, posList: faceupBattlePositions, cells };
            }),
            [],
            false,
            false
          );
          if (!monster) {
            return false;
          }

          monster.statusOperatorBundle.push(
            new StatusOperator(
              "攻撃不可",
              (ope) => ope.effectOwner.duel.clock.isSameTurn(ope.isSpawnedAt),
              false,
              myInfo.action.entity,
              myInfo.action,
              () => true,
              (ope, wip) => {
                return { ...wip, canAttack: false };
              }
            )
          );
          if (!monster) {
            return false;
          }
          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [
      createRegularProcFilterHandler(
        "②リリース不可",
        "Monster",
        (source) => [source],
        (source) => [
          ProcFilter.createContinuous(
            "②リリース不可",
            () => true,
            source,
            {},
            () => true,
            ["AdvanceSummonRelease", "ReleaseAsEffect", "ReleaseAsCost"],
            () => false
          ),
        ]
      ) as ContinuousEffectBase<unknown>,
    ],
  };
}

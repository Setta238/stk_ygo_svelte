import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultLinkSummonAction } from "@ygo_entity_proc/card_actions/CardActions_LinkMonster";
import { defaultPrepare } from "../../card_actions/CardActions";
import { IllegalCancelError, SystemError } from "@ygo_duel/class/Duel";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { createBroadRegularProcFilterHandler } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "アロマセラフィ－ジャスミン",
    actions: [
      getDefaultLinkSummonAction((selected) => selected.length === 2 && selected.every((material) => material.types.includes("Plant"))),
      {
        title: "②リクルート",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurn: 1,
        fixedTags: ["SpecialSummonFromDeck"],
        canPayCosts: (myInfo) =>
          myInfo.action.entity.pointedToEntities.some((monster) =>
            monster.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action)
          ),
        canExecute: (myInfo) => {
          // リリースコスト
          const costs = myInfo.action.entity.pointedToEntities.filter((monster) =>
            monster.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action)
          );

          // リリースコストを払えない場合、不可
          if (!costs.length) {
            return false;
          }

          // デッキ内の植物族モンスター
          const plants = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((monster) => monster.types.includes("Plant"));

          // デッキ内に植物族モンスターがいない場合、不可
          if (!plants.length) {
            return false;
          }

          // 特殊召喚先
          const cells = myInfo.activator.getMonsterZones();

          // コスト×特殊召喚対象で可能なものが一件以上必要
          return costs.some((cost) => {
            const list = myInfo.activator.getEnableSummonList(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              plants.map((plant) => {
                return { monster: plant, posList: ["Defense"], cells };
              }),
              [{ material: cost, cell: cost.cell }],
              false
            );
            return list.length > 0;
          });
        },
        payCosts: async (myInfo, chainBlockInfos, cancelable) => {
          // リリースコスト
          const costs = myInfo.action.entity.pointedToEntities.filter((monster) =>
            monster.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action)
          );

          // リリースコストを払えない場合、不可
          if (!costs.length) {
            throw new SystemError("想定されない状況", [myInfo.action.entity]);
          }

          // デッキ内の植物族モンスター
          const plants = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((monster) => monster.types.includes("Plant"));

          // デッキ内に植物族モンスターがいない場合、不可
          if (!plants.length) {
            throw new SystemError("想定されない状況", [myInfo.action.entity]);
          }

          // 特殊召喚先
          const cells = myInfo.activator.getMonsterZones();

          // 特殊召喚可能なパターンを抽出
          const patterns = costs
            .map((cost) => {
              return {
                cost,
                list: myInfo.activator.getEnableSummonList(
                  myInfo.activator,
                  "SpecialSummon",
                  ["Effect"],
                  myInfo.action,
                  plants.map((plant) => {
                    return { monster: plant, posList: ["Defense"], cells };
                  }),
                  [{ material: cost, cell: cost.cell }],
                  false
                ),
              };
            })
            .filter((pattern) => pattern.list.length);

          const cost = await myInfo.activator.waitSelectEntity(
            patterns.map((pattern) => pattern.cost),
            "リリースするモンスターを選択。",
            cancelable
          );

          if (!cost && !cancelable) {
            throw new IllegalCancelError(myInfo);
          }

          if (!cost) {
            return;
          }

          const costInfo = { cost, cell: cost.cell };

          await cost.release(["Cost"], myInfo.action.entity, myInfo.activator);
          return { release: [costInfo] };
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const monsters = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((monster) => monster.types.includes("Plant"));

          const cells = myInfo.activator.getMonsterZones();
          const monster = await myInfo.activator.summonOne(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            monsters.map((monster) => {
              return { monster, posList: ["Defense"], cells };
            }),
            (myInfo.costInfo.release ?? []).map((info) => ({
              material: info.cost,
              cell: info.cell,
            })),
            false,
            false
          );
          if (!monster) {
            return false;
          }

          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
      {
        title: "③サーチ",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        fixedTags: ["SearchFromDeck"],
        meetsConditions: (myInfo) => {
          // モンスターとしてフィールド上に存在
          if (!myInfo.action.entity.isOnFieldAsMonsterStrictly) {
            return false;
          }

          console.log(myInfo.action.entity.controller.previousHealedRecord);

          // 前回の回復を取得
          const wasHealedAt = myInfo.action.entity.controller.previousHealedRecord?.clock;
          if (!wasHealedAt) {
            return false;
          }

          console.log(wasHealedAt);
          if (!myInfo.activator.duel.clock.isPreviousChain(wasHealedAt)) {
            return false;
          }
          console.log(wasHealedAt);

          const wasArrivedAt = myInfo.action.entity.hadArrivedToFieldAt();

          console.log(wasArrivedAt);
          if (!wasArrivedAt) {
            return false;
          }

          return wasHealedAt.totalProcSeq > wasArrivedAt.totalProcSeq;
        },
        canExecute: (myInfo) =>
          myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .some((card) => card.types.includes("Plant")) && myInfo.activator.canAddToHandFromDeck,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const monsters = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((card) => card.types.includes("Plant"));
          if (!monsters.length) {
            return false;
          }
          const target = await myInfo.activator.waitSelectEntity(monsters, "手札に加えるカードを選択", false);
          if (!target) {
            return false;
          }
          await target.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [
      createBroadRegularProcFilterHandler("③戦闘破壊耐性", "Monster", (source) => {
        return [
          ProcFilter.createContinuous(
            "③戦闘破壊耐性",
            (ope) => ope.isSpawnedBy.isOnFieldStrictly && ope.isEffective,
            source,
            (ope, target) => ope.isSpawnedBy === target || ope.isSpawnedBy.pointedToEntities.includes(target),
            ["BattleDestroy"],
            (bundleOwner) => {
              if (bundleOwner.controller.lp <= bundleOwner.controller.getOpponentPlayer().lp) {
                return true;
              }

              bundleOwner.duel.log.info(
                `自分のLPが相手より多い場合、${source.toString()}とそのリンク先のモンスターは戦闘では破壊されない。`,
                source.controller
              );

              return false;
            }
          ),
        ];
      }),
    ],
  };
}

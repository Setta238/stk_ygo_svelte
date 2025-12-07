import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { canSelfSepcialSummon, defaultSelfSpecialSummonExecute, getDestsForSelfSpecialSummon } from "@ygo_entity_proc/card_actions/CardActions_Monster";
import {
  defaultCanPaySelfSendToGraveyardCost,
  defaultPaySelfSendToGraveyardCost,
} from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_SendToGraveyard";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "フェニキシアン・クラスター・アマリリス",
    actions: [
      {
        title: "自爆",
        isMandatory: true,
        playType: "ContinuousPeriodAction",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["b1DAfterDmgCalc", "b2DAfterDmgCalc"],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.activator.duel.attackingMonster === myInfo.action.entity && myInfo.action.entity.isOnFieldAsMonsterStrictly,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (!myInfo.action.entity.isOnFieldAsMonsterStrictly) {
            return false;
          }
          const destroyed = await DuelEntityShortHands.tryDestroy([myInfo.action.entity], myInfo);
          return destroyed.length > 0;
        },
        settle: async () => true,
      },
      {
        title: "スキャッター・フレイム",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["DamageToOpponent"],
        triggerPattern: { triggerType: "Departure", needsByDestory: true },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          myInfo.activator.getOpponentPlayer().effectDamage(800, myInfo);
          return true;
        },
        settle: async () => true,
      },
      {
        title: "自己再生",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["end"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromGraveyard"],
        isNoticedForcibly: true,
        canPayCosts: (myInfo) =>
          myInfo.activator
            .getGraveyard()
            .cardEntities.filter((monster) => monster.types.includes("Plant"))
            .filter((monster) => monster.kind === "Monster")
            .filter((monster) => monster !== myInfo.action.entity)
            .some((plant) => plant.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action)),
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, ["Defense"], [], ["Effect"]),
        canExecute: (myInfo) => myInfo.activator.isTurnPlayer && canSelfSepcialSummon(myInfo, ["Defense"], [], ["Effect"]),
        payCosts: async (myInfo, chainBlockInfos, cancelable) => {
          const costs = myInfo.activator
            .getGraveyard()
            .cardEntities.filter((monster) => monster.types.includes("Plant"))
            .filter((monster) => monster.kind === "Monster")
            .filter((monster) => monster !== myInfo.action.entity)
            .filter((plant) => plant.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action));
          const cost = await myInfo.activator.waitSelectEntity(costs, "コストとして除外するモンスターを選択。", cancelable);
          if (!cost) {
            return;
          }
          const costInfo = { cost, cell: cost.cell };
          await cost.banish(["Cost"], myInfo.action.entity, myInfo.activator);
          return { banish: [costInfo] };
        },
        prepare: defaultPrepare,
        execute: (...args) => defaultSelfSpecialSummonExecute(...args, ["Defense"]),
        settle: async () => true,
      },
    ],
    summonFilter: (filter, filterTarget, effectOwner, summoner, movedAs, actDefAttr, monster, materialInfos, posList, cells) => {
      const ok = { posList, cells };
      const notAllowed = { posList: [], cells: [] };
      if (monster !== filterTarget) {
        //素材に使用するのは自由
        return ok;
      }
      if (actDefAttr.entity === filterTarget) {
        //自身の効果であればOK
        return ok;
      }
      if (actDefAttr.entity.origin.name === "フェニキシアン・シード") {
        //フェニキシアン・シードの効果であればOK
        return ok;
      }
      //それ以外は禁止
      return notAllowed;
    },
  };
  yield {
    name: "フェニキシアン・シード",
    actions: [
      {
        title: "開花",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        fixedTags: ["SpecialSummonFromHand"],
        canPayCosts: defaultCanPaySelfSendToGraveyardCost,
        canExecute: (myInfo) => {
          // 手札のアマリリス
          const plants = myInfo.activator.getHandCell().cardEntities.filter((card) => card.nm === "フェニキシアン・クラスター・アマリリス");

          // 手札にアマリリスがいない場合、不可
          if (!plants.length) {
            return false;
          }

          // 特殊召喚先
          const cells = myInfo.activator.getMonsterZones();

          return (
            myInfo.activator.getEnableSummonList(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              plants.map((plant) => {
                return { monster: plant, posList: faceupBattlePositions, cells };
              }),
              [{ material: myInfo.action.entity, cell: myInfo.action.entity.cell }],
              false
            ).length > 0
          );
        },
        payCosts: defaultPaySelfSendToGraveyardCost,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          // 手札のアマリリス
          const plants = myInfo.activator.getHandCell().cardEntities.filter((card) => card.nm === "フェニキシアン・クラスター・アマリリス");

          // 手札にアマリリスがいない場合、不可
          if (!plants.length) {
            return false;
          }

          // 特殊召喚先
          const cells = myInfo.activator.getMonsterZones();

          // 特殊召喚先がない場合、不可
          if (!plants.length) {
            return false;
          }

          return Boolean(
            await myInfo.activator.summonOne(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              plants.map((plant) => ({ monster: plant, cells, posList: faceupBattlePositions })),
              myInfo.costInfo.sendToGraveyard?.map((info) => ({ material: info.cost, cell: info.cell })) ?? [],
              false,
              false
            )
          );
        },
        settle: async () => true,
      },
    ],
  };
}

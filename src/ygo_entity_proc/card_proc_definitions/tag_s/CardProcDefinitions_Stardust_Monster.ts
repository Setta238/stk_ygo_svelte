import {
  canSelfSepcialSummon,
  defaultSelfSpecialSummonExecute,
  defaultSelfReleaseCanPayCosts,
  defaultSelfReleasePayCosts,
} from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {
  defaultPrepare,
  defaultCanPaySelfBanishCosts,
  defaultPaySelfBanishCosts,
  getSingleTargetActionPartical,
  getMultiTargetsRebornActionPartical,
  getPayBanishCostsActionPartical,
} from "@ygo_entity_proc/card_actions/CardActions";
import { duelFieldCellTypes, monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { getDefaultSynchroSummonAction } from "../../card_actions/CardActions_SynchroMonster";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { SystemError } from "@ygo_duel/class/Duel";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "スターダスト・ドラゴン",
    actions: [
      getDefaultSynchroSummonAction(),
      {
        title: "①ヴィクテム・サンクチュアリ",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: ["MonsterZone", "ExtraMonsterZone"],
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        canPayCosts: defaultSelfReleaseCanPayCosts,
        canExecute: (myInfo) =>
          Boolean(
            myInfo.targetChainBlock && myInfo.targetChainBlock.action.isWithChainBlock && myInfo.targetChainBlock.chainBlockTags.includes("DestroyOnField")
          ),
        payCosts: defaultSelfReleasePayCosts,
        prepare: async (myInfo) => {
          if (!myInfo.targetChainBlock) {
            throw new SystemError("想定されない状態", myInfo);
          }

          return {
            selectedEntities: [],
            chainBlockTags: myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, [myInfo.targetChainBlock.action.entity]),
            prepared: undefined,
          };
        },
        execute: async (myInfo, chainBlockInfos) => {
          const info = chainBlockInfos[myInfo.index - 1];
          info.isNegatedActivationBy = myInfo.action;
          await DuelEntityShortHands.tryDestroy([info.action.entity], myInfo);
          return true;
        },
        settle: async () => true,
      },
      {
        title: "②自己再生",
        playType: "IgnitionEffect",
        isMandatory: false,
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["end"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        fixedTags: ["SpecialSummonFromGraveyard"],
        canExecute: (myInfo) => {
          const moveLogRecord = myInfo.action.entity.moveLog.latestRecord;

          if (moveLogRecord.movedBy !== myInfo.action.entity) {
            return false;
          }
          if (!myInfo.activator.duel.clock.isSameTurn(moveLogRecord.movedAt)) {
            return false;
          }
          if (!moveLogRecord.movedAs.includes("Cost")) {
            return false;
          }

          const duel = myInfo.activator.duel;
          const lastAction = myInfo.action.entity.actionLogRecords
            .filter((rec) => duel.clock.isSameTurn(rec.clock))
            .map((rec) => rec.chainBlockInfo)
            .findLast((info) => info.action.title === "①ヴィクテム・サンクチュアリ");

          if (!lastAction || lastAction.state !== "done") {
            return false;
          }

          return canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]);
        },
        prepare: defaultPrepare,
        execute: defaultSelfSpecialSummonExecute,
        settle: async () => true,
      },
    ],
  };

  yield {
    name: "閃珖竜 スターダスト",

    actions: [
      getDefaultSynchroSummonAction(),
      {
        title: "波動音壁",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        ...getSingleTargetActionPartical((myInfo) =>
          myInfo.activator
            .getEntiteisOnField()
            .filter((card) => card.face === "FaceUp")
            .filter((card) => card.canBeTargetOfEffect(myInfo))
        ),
        execute: async (myInfo) => {
          myInfo.selectedEntities
            .filter((card) => card.isOnFieldStrictly)
            .filter((card) => card.face === "FaceUp")
            .filter((card) => card.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action))
            .forEach((card) => {
              card.counterHolder.add("SonicBarrier", 1, myInfo.action.entity);
            });

          return true;
        },
        settle: async () => true,
      },
    ],
    substituteEffects: [
      {
        title: `波動音壁（適用）`,
        playType: "LingeringEffect",
        isMandatory: true,
        executableCells: duelFieldCellTypes,
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        isApplicableTo: (effect, destroyType, targets) => {
          return targets.filter((target) => target.counterHolder.getQty("SonicBarrier", effect.entity) > 0);
        },
        substitute: async (effect, destroyType, targets) => {
          const _targets = targets.filter((target) => target.counterHolder.getQty("SonicBarrier", effect.entity) > 0);

          _targets.forEach((target) => {
            target.counterHolder.removeAll("SonicBarrier", effect.entity);
            effect.entity.controller.writeInfoLog(`波動音壁により${target.toString()}は１ターンに１度だけ戦闘効果では破壊されない。`);
          });

          return _targets;
        },
      },
    ],
  };

  yield {
    name: "真閃珖竜 スターダスト・クロニクル",

    actions: [
      getDefaultSynchroSummonAction(
        (tuners) => tuners.length === 1 && tuners.every((tuner) => tuner.status.monsterCategories?.includes("Synchro")),
        (tuners) => tuners.length > 0 && tuners.every((tuner) => tuner.status.monsterCategories?.includes("Synchro"))
      ),
      {
        title: "波動護魂",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        ...getPayBanishCostsActionPartical((myInfo) =>
          myInfo.activator.getGraveyard().cardEntities.filter((card) => card.status.monsterCategories?.includes("Synchro"))
        ),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          myInfo.action.entity.procFilterBundle.push(
            ProcFilter.createLingering(
              myInfo.action.title,
              (operator) => operator.duel.clock.isSameTurn(operator.isSpawnedAt),
              myInfo.action.entity,
              myInfo.action,
              () => true,
              ["Effect"],
              () => false
            )
          );

          return true;
        },
        settle: async () => true,
      },
      {
        title: "②蘇生",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Banished"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromGraveyard"],
        meetsConditions: (myInfo) =>
          myInfo.action.entity.wasMovedAtPreviousChain &&
          myInfo.action.entity.moveLog.latestRecord.actionOwner !== myInfo.activator &&
          (myInfo.action.entity.wasMovedFrom.owner === myInfo.activator || myInfo.action.entity.wasMovedFrom.cellType === "ExtraMonsterZone"),
        ...getMultiTargetsRebornActionPartical((myInfo) =>
          myInfo.activator
            .getBanished()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((card) => card.face === "FaceUp")
            .filter((card) => card.types.includes("Dragon"))
            .filter((card) => card.status.monsterCategories?.includes("Synchro"))
            .filter((card) => card.canBeTargetOfEffect(myInfo))
        ),
        settle: async () => true,
      },
    ],
  };

  yield {
    name: "聖珖神竜 スターダスト・シフル",

    actions: [
      getDefaultSynchroSummonAction(
        (tuners) => tuners.length === 1 && tuners.every((tuner) => tuner.status.monsterCategories?.includes("Synchro")),
        (tuners) => tuners.length > 1 && tuners.every((tuner) => tuner.status.monsterCategories?.includes("Synchro"))
      ),
      {
        title: "②珖波動反撃",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: ["Hand"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        negatePreviousBlock: true,
        fixedTags: ["NegateCardEffect", "DestroyOnField"],
        canExecute: (myInfo) =>
          Boolean(
            myInfo.targetChainBlock &&
              myInfo.targetChainBlock.action.entity.isMonster &&
              myInfo.targetChainBlock.action.isWithChainBlock &&
              myInfo.activator !== myInfo.targetChainBlock.activator
          ),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (!myInfo.targetChainBlock) {
            return false;
          }
          const info = myInfo.targetChainBlock;
          info.isNegatedEffectBy = myInfo.action;

          const selected = await myInfo.activator.waitSelectEntity(myInfo.action.duel.field.getCardsOnFieldStrictly(), "破壊するカードを選択。", false);

          const destroyed = await DuelEntityShortHands.tryDestroy(selected ? [selected] : [], myInfo);

          return destroyed.length > 0;
        },
        settle: async () => true,
      },
      {
        title: "③蘇生",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        priorityForNPC: 10,
        fixedTags: ["SpecialSummonFromGraveyard"],
        canPayCosts: defaultCanPaySelfBanishCosts,
        payCosts: defaultPaySelfBanishCosts,
        ...getMultiTargetsRebornActionPartical((myInfo) =>
          myInfo.activator
            .getGraveyard()
            .cardEntities.filter((card) => card.status.nameTags?.includes("スターダスト"))
            .filter((card) => (card.lvl ?? 12) < 9)
        ),
        settle: async () => true,
      },
    ],
    substituteEffects: [
      {
        title: `波動聖句`,
        playType: "ContinuousEffect",
        isMandatory: true,
        executableCells: ["MonsterZone"],
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        isApplicableTo: (effect, destroyType, targets) => {
          return targets
            .filter((target) => target.controller === effect.entity.controller)
            .filter((target) => target.counterHolder.getQty("SonicVerse", effect.entity) === 0);
        },
        substitute: async (effect, destroyType, targets) => {
          if (!effect.entity.isEffective) {
            return [];
          }
          const _targets = targets
            .filter((target) => target.controller === effect.entity.controller)
            .filter((target) => target.counterHolder.getQty("SonicVerse", effect.entity) === 0);
          _targets.forEach((target) => {
            target.counterHolder.add("SonicVerse", 1, effect.entity);
            effect.entity.controller.writeInfoLog(`${effect.entity.toString()}の効果により${target.toString()}は１ターンに１度だけ破壊されない。`);
          });
          return _targets;
        },
      },
    ],
  };
}

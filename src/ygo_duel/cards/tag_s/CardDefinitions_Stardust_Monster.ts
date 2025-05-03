import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultSelfRebornExecute,
  defaultSelfReleaseCanPayCosts,
  defaultSelfReleasePayCosts,
  defaultSummonFilter,
} from "@ygo_duel/card_actions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "@ygo_duel/cards/CardDefinitions";
import { damageStepPeriodKeys, duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {
  defaultPrepare,
  defaultCanPaySelfBanishCosts,
  defaultPaySelfBanishCosts,
  defaultTargetMonstersRebornExecute,
  defaultTargetMonstersRebornPrepare,
  defaultPayBanishCosts,
  defaultCanPayBanishCosts,
} from "@ygo_duel/card_actions/DefaultCardAction";
import { duelFieldCellTypes, monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { getDefaultSyncroSummonAction } from "../../card_actions/DefaultCardAction_SyncroMonster";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export const createCardDefinitions_Stardust_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
    name: "スターダスト・ドラゴン",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      getDefaultSyncroSummonAction(),
      {
        title: "①ヴィクテム・サンクチュアリ",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: ["MonsterZone", "ExtraMonsterZone"],
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        canPayCosts: defaultSelfReleaseCanPayCosts,
        validate: (myInfo, chainBlockInfos) => {
          if (chainBlockInfos.length === 0) {
            return;
          }

          const info = chainBlockInfos[myInfo.index - 1];

          return info.chainBlockTags.includes("DestroyOnField") ? [] : undefined;
        },
        payCosts: defaultSelfReleasePayCosts,
        prepare: async (myInfo, chainBlockInfos) => {
          const info = chainBlockInfos.slice(-1)[0];

          return { selectedEntities: [], chainBlockTags: myInfo.action.calcChainBlockTagsForDestroy([info.action.entity]), prepared: undefined };
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
        validate: (myInfo) => {
          const moveLogRecord = myInfo.action.entity.moveLog.latestRecord;

          if (moveLogRecord.movedBy !== myInfo.action.entity) {
            return;
          }
          if (!myInfo.activator.duel.clock.isSameTurn(moveLogRecord.movedAt)) {
            return;
          }
          if (!moveLogRecord.movedAs.includes("Cost")) {
            return;
          }

          const duel = myInfo.activator.duel;
          const lastAction = myInfo.action.entity.actionLogRecords
            .filter((rec) => duel.clock.isSameTurn(rec.clock))
            .map((rec) => rec.chainBlockInfo)
            .findLast((info) => info.action.title === "①ヴィクテム・サンクチュアリ");

          if (!lastAction || lastAction.state !== "done") {
            return;
          }

          const availableCells = myInfo.activator.getAvailableMonsterZones();
          return availableCells.length > 0 ? [] : undefined;
        },
        prepare: defaultPrepare,
        execute: (myInfo) => defaultSelfRebornExecute(myInfo),
        settle: async () => true,
      },
    ],
    defaultSummonFilter: defaultSummonFilter,
  });

  result.push({
    name: "閃珖竜 スターダスト",
    defaultSummonFilter: defaultSummonFilter,
    actions: [
      defaultAttackAction as CardActionDefinition<unknown>,
      defaultBattlePotisionChangeAction as CardActionDefinition<unknown>,
      getDefaultSyncroSummonAction() as CardActionDefinition<unknown>,
      {
        title: "波動音壁",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        hasToTargetCards: true,
        validate: (myInfo) => {
          const targets = myInfo.activator
            .getEntiteisOnField()
            .filter((card) => card.face === "FaceUp")
            .filter((card) => card.canBeTargetOfEffect(myInfo));
          if (!targets.length) {
            return;
          }

          return targets.map((target) => target.fieldCell);
        },
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          if (myInfo.dest) {
            return {
              selectedEntities: myInfo.dest.cardEntities,
              chainBlockTags: [],
              prepared: undefined,
            };
          }

          const targets = myInfo.activator
            .getEntiteisOnField()
            .filter((card) => card.face === "FaceUp")
            .filter((card) => card.canBeTargetOfEffect(myInfo));
          if (!targets.length) {
            return;
          }
          const selected = await myInfo.activator.waitSelectEntity(targets, "対象とするカードを選択", cancelable);
          if (!selected) {
            return;
          }
          return { selectedEntities: [selected], chainBlockTags: [], prepared: undefined };
        },
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
  });

  result.push({
    name: "真閃珖竜 スターダスト・クロニクル",
    defaultSummonFilter: defaultSummonFilter,
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      getDefaultSyncroSummonAction(
        (tuners) => tuners.length === 1 && tuners.every((tuner) => tuner.status.monsterCategories?.includes("Syncro")),
        (tuners) => tuners.length > 0 && tuners.every((tuner) => tuner.status.monsterCategories?.includes("Syncro"))
      ),
      {
        title: "波動護魂",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        canPayCosts: (myInfo) =>
          defaultCanPayBanishCosts(
            myInfo,
            myInfo.activator.getGraveyard().cardEntities.filter((card) => card.status.monsterCategories?.includes("Syncro"))
          ),
        validate: () => [],
        payCosts: (myInfo) =>
          defaultPayBanishCosts(
            myInfo,
            myInfo.activator.getGraveyard().cardEntities.filter((card) => card.status.monsterCategories?.includes("Syncro")),
            (selected) => selected.length === 1,
            1
          ),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          myInfo.action.entity.procFilterBundle.push(
            ProcFilter.createLingering(
              myInfo.action.title,
              (operator) => operator.effectOwner.duel.clock.isSameTurn(operator.isSpawnedAt),
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
        validate: (myInfo) => {
          if (!myInfo.action.entity.wasMovedAtPreviousChain) {
            return;
          }
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getBanished()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.face === "FaceUp")
              .filter((card) => card.types.includes("Dragon"))
              .filter((card) => card.status.monsterCategories?.includes("Syncro"))
              .filter((card) => card.canBeTargetOfEffect(myInfo))
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
        prepare: (myInfo) =>
          defaultTargetMonstersRebornPrepare(
            myInfo,
            myInfo.activator
              .getBanished()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.face === "FaceUp")
              .filter((card) => card.types.includes("Dragon"))
              .filter((card) => card.status.monsterCategories?.includes("Syncro"))
              .filter((card) => card.canBeTargetOfEffect(myInfo))
          ),
        execute: async (myInfo) => defaultTargetMonstersRebornExecute(myInfo),
        settle: async () => true,
      },
    ],
  });
  result.push({
    name: "聖珖神竜 スターダスト・シフル",
    defaultSummonFilter: defaultSummonFilter,
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      getDefaultSyncroSummonAction(
        (tuners) => tuners.length === 1 && tuners.every((tuner) => tuner.status.monsterCategories?.includes("Syncro")),
        (tuners) => tuners.length > 1 && tuners.every((tuner) => tuner.status.monsterCategories?.includes("Syncro"))
      ),
      {
        title: "②珖波動反撃",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: ["Hand"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        negatePreviousBlock: true,
        validate: (myInfo) => {
          if (!myInfo.targetChainBlock) {
            return;
          }
          if (myInfo.activator === myInfo.targetChainBlock.activator) {
            return;
          }
          if (myInfo.targetChainBlock.action.entity.status.kind !== "Monster") {
            return;
          }
          if (!myInfo.targetChainBlock.action.isWithChainBlock) {
            return;
          }

          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["NegateCardEffect", "DestroyOnField"], prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
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
      } as CardActionDefinition<unknown>,
      {
        title: "③蘇生",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        priorityForNPC: 10,
        canPayCosts: defaultCanPaySelfBanishCosts,
        validate: (myInfo) => {
          if (
            myInfo.activator
              .getBanished()
              .cardEntities.filter((card) => card.status.nameTags?.includes("スターダスト"))
              .filter((card) => (card.lvl ?? 12) < 9).length === 0
          ) {
            return;
          }
          const availableCells = myInfo.activator.getAvailableMonsterZones();
          return availableCells.length > 0 ? [] : undefined;
        },
        payCosts: defaultPaySelfBanishCosts,
        prepare: (myInfo) =>
          defaultTargetMonstersRebornPrepare(
            myInfo,
            myInfo.activator
              .getBanished()
              .cardEntities.filter((card) => card.status.nameTags?.includes("スターダスト"))
              .filter((card) => (card.lvl ?? 12) < 9),
            faceupBattlePositions,
            (selected) => selected.length === 1
          ),
        execute: (myInfo) => defaultTargetMonstersRebornExecute(myInfo, faceupBattlePositions),
        settle: async () => true,
      },
    ],
    substituteEffects: [
      {
        title: `波動聖句`,
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
  });
  return result;
};

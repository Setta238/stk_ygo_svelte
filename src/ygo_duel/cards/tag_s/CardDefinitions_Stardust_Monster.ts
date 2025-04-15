import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultSelfRebornExecute,
  defaultSelfReleaseCanPayCosts,
  defaultSelfReleasePayCosts,
  defaultSummonFilter,
} from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "@ygo_duel/cards/CardDefinitions";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPrepare } from "@ygo_duel/cards/DefaultCardAction";
import { duelFieldCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { getDefaultSyncroSummonAction } from "../DefaultCardAction_SyncroMonster";

export const createCardDefinitions_Stardust_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
    name: "スターダスト・ドラゴン",
    actions: [
      defaultAttackAction as CardActionDefinition<unknown>,
      defaultBattlePotisionChangeAction as CardActionDefinition<unknown>,
      getDefaultSyncroSummonAction() as CardActionDefinition<unknown>,
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
        executableCells: ["MonsterZone", "ExtraMonsterZone"],
        executablePeriods: duelPeriodKeys,
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
          const selected = await myInfo.action.entity.duel.view.waitSelectEntities(
            myInfo.activator,
            targets,
            1,
            (selected) => selected.length === 1,
            "対象とするカードを選択",
            cancelable
          );
          if (!selected) {
            return;
          }
          return { selectedEntities: selected, chainBlockTags: [], prepared: undefined };
        },
        execute: async (myInfo) => {
          myInfo.selectedEntities
            .filter((card) => card.isOnField)
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

  return result;
};

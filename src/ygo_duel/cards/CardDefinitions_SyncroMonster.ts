import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultCanBeSummoned,
  defaultRebornExecute,
  getDefaultSyncroSummonAction,
} from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "./CardDefinitions";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPrepare } from "@ygo_duel/cards/DefaultCardAction";

export const createCardDefinitions_SyncroMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  ["大地の騎士ガイアナイト", "スクラップ・デスデーモン"].forEach((name) =>
    result.push({
      name: name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, getDefaultSyncroSummonAction()] as CardActionBase<unknown>[],
      canBeSummoned: defaultCanBeSummoned,
    })
  );

  result.push({
    name: "ナチュル・ガオドレイク",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      getDefaultSyncroSummonAction(
        (tuners) => tuners.length === 1 && tuners.every((tuner) => tuner.attr.some((a) => a === "Earth")),
        (nonTuners) => nonTuners.length > 0 && nonTuners.every((nonTuner) => nonTuner.attr.some((a) => a === "Earth"))
      ),
    ] as CardActionBase<unknown>[],
    canBeSummoned: defaultCanBeSummoned,
  });

  result.push({
    name: "マジカル・アンドロイド",
    actions: [
      defaultAttackAction as CardActionBase<unknown>,
      defaultBattlePotisionChangeAction as CardActionBase<unknown>,
      getDefaultSyncroSummonAction() as CardActionBase<unknown>,
      {
        title: "回復",
        playType: "MandatoryIgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone", "ExtraMonsterZone"],
        executablePeriods: ["end"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        validate: (myInfo) =>
          myInfo.action.entity.duel.phase === "end" && myInfo.activator.isTurnPlayer && myInfo.action.entity.face === "FaceUp" ? [] : undefined,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          myInfo.activator.heal(
            myInfo.activator
              .getMonstersOnField()
              .filter((monster) => monster.face === "FaceUp")
              .filter((monster) => monster.types.includes("Psychic")).length * 600,
            myInfo.action.entity
          );
          return true;
        },
        settle: async () => true,
      },
    ],
    canBeSummoned: defaultCanBeSummoned,
  });
  result.push({
    name: "スターダスト・ドラゴン",
    actions: [
      defaultAttackAction as CardActionBase<unknown>,
      defaultBattlePotisionChangeAction as CardActionBase<unknown>,
      getDefaultSyncroSummonAction() as CardActionBase<unknown>,
      {
        title: "①ヴィクテム・サンクチュアリ",
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: ["MonsterZone", "ExtraMonsterZone"],
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        validate: (myInfo, chainBlockInfos) => {
          if (chainBlockInfos.length === 0) {
            return;
          }

          const info = chainBlockInfos[myInfo.index - 1];

          return info.chainBlockTags.includes("DestroyOnField") ? [] : undefined;
        },
        prepare: async (myInfo, cell, chainBlockInfos) => {
          if (chainBlockInfos.length === 0) {
            return;
          }

          const info = chainBlockInfos.slice(-1)[0];

          await myInfo.action.entity.release(["Cost"], myInfo.action.entity, myInfo.activator);
          return { selectedEntities: [], chainBlockTags: myInfo.action.calcChainBlockTagsForDestroy([info.action.entity]), prepared: undefined };
        },
        execute: async (myInfo, chainBlockInfos) => {
          const info = chainBlockInfos[myInfo.index - 1];
          info.isNegatedActivationBy = myInfo.action;
          DuelEntityShortHands.tryDestroy([info.action.entity], myInfo);
          return true;
        },
        settle: async () => true,
      },
      {
        title: "②自己再生",
        playType: "IgnitionEffect",
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
        execute: (myInfo) => defaultRebornExecute(myInfo),
        settle: async () => true,
      },
    ],
    canBeSummoned: defaultCanBeSummoned,
  });

  return result;
};

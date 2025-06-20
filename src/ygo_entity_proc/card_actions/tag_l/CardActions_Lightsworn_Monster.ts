import { type CardActionDefinition } from "@ygo_duel/class/DuelEntityAction";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { getDeckDestructionActionPartical } from "@ygo_entity_proc/card_actions/CardActions";

export const getCommonLightswormEndPhaseAction = (titlePrefix: string, qty: number): CardActionDefinition<unknown> => {
  return {
    title: `${titlePrefix}墓地送り(${qty})`,
    isMandatory: true,
    playType: "IgnitionEffect",
    spellSpeed: "Normal",
    executableCells: monsterZoneCellTypes,
    executablePeriods: ["end"],
    executableDuelistTypes: ["Controller"],
    executableFaces: ["FaceUp"],
    fixedTags: ["SendToGraveyardFromDeck"],
    isOnlyNTimesPerTurnIfFaceup: 1,
    meetsConditions: (myInfo) => myInfo.activator.isTurnPlayer,
    ...getDeckDestructionActionPartical({ targets: ["Self"], qty }),
    settle: async () => true,
  };
};
export const getCommonTwillightswormEndPhaseAction = (titlePrefix: string, qty: number): CardActionDefinition<unknown> => {
  return {
    title: `${titlePrefix}墓地送り(${qty})`,
    isMandatory: true,
    playType: "TriggerEffect",
    spellSpeed: "Normal",
    executableCells: monsterZoneCellTypes,
    executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
    executableDuelistTypes: ["Controller"],
    executableFaces: ["FaceUp"],
    isOnlyNTimesPerTurnIfFaceup: 1,
    fixedTags: ["SendToGraveyardFromDeck"],
    meetsConditions: (myInfo) =>
      myInfo.activator.duel.chainBlockLog.records
        .filter((record) => record.chainBlockInfo.action.entity.status.nameTags?.includes("ライトロード"))
        .filter((record) => record.chainBlockInfo.action.entity.kind === "Monster")
        .filter((record) => record.chainBlockInfo.action.entity !== myInfo.action.entity)
        .filter((record) => record.chainBlockInfo.action.isWithChainBlock)
        .filter((record) => myInfo.activator.duel.clock.isPreviousChain(record.clock))
        .filter((record) => record.clock.totalProcSeq > myInfo.action.entity.moveLog.latestRecord.movedAt.totalProcSeq)
        .filter((rec) => !rec.chainBlockInfo.isNegatedActivationBy)
        .some((rec) => rec.chainBlockInfo.activator === myInfo.activator),
    ...getDeckDestructionActionPartical({ targets: ["Self"], qty }),
    settle: async () => true,
  };
};

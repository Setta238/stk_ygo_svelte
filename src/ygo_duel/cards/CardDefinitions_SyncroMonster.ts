import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultPrepare,
  getDefaultSyncroSummonAction,
} from "@ygo_duel/functions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "./CardDefinitions";

export const createCardDefinitions_SyncroMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  ["大地の騎士ガイアナイト", "スクラップ・デスデーモン"].forEach((name) =>
    result.push({
      name: name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, getDefaultSyncroSummonAction()] as CardActionBase<unknown>[],
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
  });

  result.push({
    name: "マジカル・アンドロイド",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      getDefaultSyncroSummonAction(),
      {
        title: "回復",
        playType: "TriggerMandatoryEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone", "ExtraMonsterZone"],
        validate: (action) =>
          action.entity.counterHolder.getQty("①") === 0 && action.entity.duel.phase === "end" && action.entity.controller.isTurnPlayer ? [] : undefined,
        prepare: (action) => {
          action.entity.counterHolder.add("①");
          return defaultPrepare();
        },
        execute: async (myInfo) => {
          myInfo.activator.heal(
            myInfo.activator.getMonstersOnField().filter((monster) => monster.types.includes("Psychic")).length * 600,
            myInfo.action.entity
          );
          return true;
        },
        settle: async () => true,
      },
    ] as CardActionBase<unknown>[],
  });

  return result;
};

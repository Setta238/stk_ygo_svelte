import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultSummonFilter } from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "./CardDefinitions";
import { defaultPrepare } from "@ygo_duel/cards/DefaultCardAction";
import { getDefaultSyncroSummonAction } from "./DefaultCardAction_SyncroMonster";

export const createCardDefinitions_SyncroMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  ["大地の騎士ガイアナイト", "スクラップ・デスデーモン"].forEach((name) =>
    result.push({
      name: name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, getDefaultSyncroSummonAction()] as CardActionDefinition<unknown>[],
      defaultSummonFilter: defaultSummonFilter,
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
    ] as CardActionDefinition<unknown>[],
    defaultSummonFilter: defaultSummonFilter,
  });

  result.push({
    name: "マジカル・アンドロイド",
    actions: [
      defaultAttackAction as CardActionDefinition<unknown>,
      defaultBattlePotisionChangeAction as CardActionDefinition<unknown>,
      getDefaultSyncroSummonAction() as CardActionDefinition<unknown>,
      {
        title: "回復",
        isMandatory: true,
        playType: "IgnitionEffect",
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
    defaultSummonFilter: defaultSummonFilter,
  });
  return result;
};

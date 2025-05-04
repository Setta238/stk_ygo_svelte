import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultSummonFilter,
} from "@ygo_card/card_actions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "@ygo_card/class/DuelCardDefinition";
import { defaultPrepare } from "@ygo_card/card_actions/DefaultCardAction";
import { getDefaultSyncroSummonAction } from "../card_actions/DefaultCardAction_SyncroMonster";
export default function* generate(): Generator<CardDefinition> {
  yield* ["大地の騎士ガイアナイト", "スクラップ・デスデーモン"].map((name) => {
    return {
      name: name,
      actions: [
        defaultAttackAction,
        defaultBattlePotisionChangeAction,
        defaultFlipSummonAction,
        getDefaultSyncroSummonAction(),
      ] as CardActionDefinition<unknown>[],
      defaultSummonFilter: defaultSummonFilter,
    };
  });
  yield {
    name: "ナチュル・ガオドレイク",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      getDefaultSyncroSummonAction(
        (tuners) => tuners.length === 1 && tuners.every((tuner) => tuner.attr.some((a) => a === "Earth")),
        (nonTuners) => nonTuners.length > 0 && nonTuners.every((nonTuner) => nonTuner.attr.some((a) => a === "Earth"))
      ),
    ] as CardActionDefinition<unknown>[],
    defaultSummonFilter: defaultSummonFilter,
  };
  yield {
    name: "マジカル・アンドロイド",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      getDefaultSyncroSummonAction(),
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
  };
}

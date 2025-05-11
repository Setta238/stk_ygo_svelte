import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CommonCardAction";
import { getDefaultSyncroSummonAction } from "@ygo_entity_proc/card_actions/CommonCardAction_SyncroMonster";
export default function* generate(): Generator<EntityProcDefinition> {
  for (const name of ["大地の騎士ガイアナイト", "スクラップ・デスデーモン"]) {
    yield {
      name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction, getDefaultSyncroSummonAction()],
    };
  }
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
    ],
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
  };
}

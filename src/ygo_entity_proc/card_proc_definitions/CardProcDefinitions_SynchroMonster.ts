import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { getDefaultSynchroSummonAction } from "@ygo_entity_proc/card_actions/CardActions_SynchroMonster";
export default function* generate(): Generator<EntityProcDefinition> {
  for (const name of ["大地の騎士ガイアナイト", "スクラップ・デスデーモン"]) {
    yield {
      name,
      actions: [getDefaultSynchroSummonAction()],
    };
  }
  yield {
    name: "ナチュル・ガオドレイク",
    actions: [
      getDefaultSynchroSummonAction(
        (tuners) => tuners.length === 1 && tuners.every((tuner) => tuner.attr.some((a) => a === "Earth")),
        (nonTuners) => nonTuners.length > 0 && nonTuners.every((nonTuner) => nonTuner.attr.some((a) => a === "Earth"))
      ),
    ],
  };
  yield {
    name: "マジカル・アンドロイド",
    actions: [
      getDefaultSynchroSummonAction(),
      {
        title: "回復",
        isMandatory: true,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone", "ExtraMonsterZone"],
        executablePeriods: ["end"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        meetsConditions: (myInfo) => myInfo.activator.isTurnPlayer && myInfo.action.entity.face === "FaceUp",
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

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import {
  defaultCanPayDiscardCosts,
  defaultPayDiscardCosts,
  defaultTargetMonstersRebornExecute,
  getPayBanishCostsActionPartical,
  getSingleTargetActionPartical,
} from "@ygo_entity_proc/card_actions/CardActions";
import { getCommonLightswormEndPhaseAction, getCommonTwillightswormEndPhaseAction } from "@ygo_entity_proc/card_actions/tag_l/CardActions_Lightsworn_Monster";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ライトロード・サモナー ルミナス",
    actions: [
      {
        title: "①蘇生",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        fixedTags: ["SpecialSummonFromGraveyard", "DiscordAsCost"],
        canPayCosts: defaultCanPayDiscardCosts,
        payCosts: defaultPayDiscardCosts,
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((monster) => (monster.lvl ?? 12) < 5)
              .filter((monster) => monster.status.nameTags?.includes("ライトロード")),
          { do: "Reborn" }
        ),
        execute: defaultTargetMonstersRebornExecute,
        settle: async () => true,
      },
      getCommonLightswormEndPhaseAction("②", 3),
    ],
  };
  yield {
    name: "トワイライトロード・シャーマン ルミナス",
    actions: [
      {
        title: "①蘇生帰還",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        fixedTags: ["SpecialSummonFromGraveyard", "DiscordAsCost"],
        ...getPayBanishCostsActionPartical((myInfo) =>
          myInfo.activator
            .getCells("Hand", "Graveyard")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.status.nameTags?.includes("ライトロード"))
            .filter((card) => card.kind === "Monster")
        ),
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.activator
              .getBanished()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((monster) => monster.status.nameTags?.includes("ライトロード")),
          { do: "Reborn" }
        ),
        execute: defaultTargetMonstersRebornExecute,
        settle: async () => true,
      },
      getCommonTwillightswormEndPhaseAction("②", 3),
    ],
  };
}

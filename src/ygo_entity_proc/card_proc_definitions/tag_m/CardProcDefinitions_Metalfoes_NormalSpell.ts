import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultSpellTrapSetAction } from "../../card_actions/CardActions_Spell";
import { getDefaultFusionSummonAction } from "@ygo_entity_proc/card_actions/CardActions_FusionSpell";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "錬装融合",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        ...getDefaultFusionSummonAction(
          ["ExtraDeck"],
          (myInfo, monster) => Boolean(monster.status.nameTags?.includes("メタルフォーゼ")),
          ["Hand", "MonsterZone", "ExtraMonsterZone"],
          () => true
        ),
      },
      {
        title: "②ドロー",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0 && myInfo.activator.canDraw,
        prepare: async (myInfo) => {
          await myInfo.action.entity.returnToDeck("Random", ["Effect"], myInfo.action.entity, myInfo.activator);
          return { selectedEntities: [], chainBlockTags: ["Draw"] };
        },
        execute: async (myInfo) => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

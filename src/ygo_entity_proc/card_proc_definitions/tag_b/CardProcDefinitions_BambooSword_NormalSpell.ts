import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "黄金色の竹光",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        priorityForNPC: 20,
        fixedTags: ["Draw"],
        meetsConditions: (myInfo) =>
          myInfo.activator
            .getSpellTrapsOnField()
            .filter((spelltrap) => spelltrap.status.nameTags?.includes("竹光"))
            .filter((takemitsu) => takemitsu.face === "FaceUp")
            .some((takemitsu) => takemitsu.status.spellCategory === "Equip"),
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0 && myInfo.activator.canDraw,
        prepare: defaultPrepare,
        execute: async (chainBlockInfo) => {
          await chainBlockInfo.activator.draw(2, chainBlockInfo.action.entity, chainBlockInfo.activator);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultSpellTrapSetAction } from "../../card_actions/CommonCardAction_Spell";
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
        meetsConditions: (myInfo) =>
          myInfo.activator
            .getSpellTrapsOnField()
            .filter((spelltrap) => spelltrap.status.nameTags?.includes("竹光"))
            .filter((takemitsu) => takemitsu.face === "FaceUp")
            .some((takemitsu) => takemitsu.status.spellCategory === "Equip"),
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0 && myInfo.activator.canDraw,
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw"], prepared: undefined };
        },
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

import { duelFieldCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CommonCardAction";
import { executableDuelistTypes } from "@ygo_duel/class/DuelEntityAction";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "無の煉獄",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.activator.getHandCell().cardEntities.length > 2,
        canExecute: (myInfo) =>
          myInfo.activator.canDraw && myInfo.activator.status.canDiscardAsEffect && myInfo.activator.getDeckCell().cardEntities.length > 0,
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw", "DiscordAsEffect"], prepared: undefined };
        },
        execute: async (myInfo) => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          myInfo.activator.entity.counterHolder.add("IntoTheVoid", 1, myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      },
      {
        title: "手札抹殺",
        isMandatory: true,
        playType: "LingeringEffect",
        spellSpeed: "Normal",
        executableCells: duelFieldCellTypes,
        executablePeriods: ["end"],
        executableDuelistTypes,
        meetsConditions: (myInfo) => myInfo.activator.entity.counterHolder.getQty("IntoTheVoid", myInfo.action.entity) > 0,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          await DuelEntityShortHands.discardManyForTheSameReason(
            myInfo.activator.getHandCell().cardEntities,
            ["Effect"],
            myInfo.action.entity,
            myInfo.activator
          );
          myInfo.activator.entity.counterHolder.remove("IntoTheVoid", 1, myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

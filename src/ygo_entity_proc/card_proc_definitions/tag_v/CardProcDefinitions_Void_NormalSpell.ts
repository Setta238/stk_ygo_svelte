import { duelFieldCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

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
        validate: (myInfo) => {
          if (!myInfo.activator.getDeckCell().cardEntities.length) {
            return;
          }
          if (myInfo.activator.getHandCell().cardEntities.length < 3) {
            return;
          }
          if (!myInfo.activator.status.canDiscardAsEffect) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
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
        validate: (myInfo) => {
          return myInfo.activator.entity.counterHolder.getQty("IntoTheVoid", myInfo.action.entity) ? [] : undefined;
        },
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

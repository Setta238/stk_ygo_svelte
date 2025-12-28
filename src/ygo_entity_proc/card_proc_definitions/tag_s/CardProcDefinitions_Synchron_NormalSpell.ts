import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { IllegalCancelError } from "@ygo_duel/class_error/DuelError";

import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "調律",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SearchFromDeck", "SendToGraveyardFromDeck"],
        priorityForNPC: 40,
        canExecute: (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities;
          if (cards.length < 2) {
            return false;
          }
          return cards.filter((card) => card.status.nameTags?.includes("シンクロン")).some((card) => card.status.monsterCategories?.includes("Tuner"));
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities;
          if (cards.length < 2) {
            return false;
          }
          const monsters = cards
            .filter((card) => card.status.nameTags?.includes("シンクロン"))
            .filter((card) => card.status.monsterCategories?.includes("Tuner"));
          if (monsters.length === 0) {
            return false;
          }
          const target = await myInfo.activator.waitSelectEntity(monsters, "手札に加えるモンスターを選択", false);
          if (!target) {
            throw new IllegalCancelError(myInfo);
          }

          await target.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);

          myInfo.activator.getDeckCell().shuffle();

          // この墓地送りはタイミングのがさせる要因になる。
          await myInfo.activator.duel.clock.incrementProcSeq();

          await myInfo.activator.getDeckCell().cardEntities[0].sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

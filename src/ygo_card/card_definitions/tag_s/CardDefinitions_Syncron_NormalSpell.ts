import { defaultSpellTrapValidate, defaultSpellTrapSetAction } from "@ygo_card/card_actions/DefaultCardAction_Spell";
import type { CardDefinition } from "@ygo_card/class/DuelCardDefinition";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
export default function* generate(): Generator<CardDefinition> {
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
        priorityForNPC: 40,
        // デッキ二枚以上、対象モンスターが一枚以上必要。
        validate: (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities;
          if (cards.length < 2) {
            return;
          }
          if (
            cards.filter((card) => card.status.nameTags?.includes("シンクロン")).filter((card) => card.status.monsterCategories?.includes("Tuner")).length === 0
          ) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck", "SendToGraveyardFromDeck"], prepared: undefined };
        },
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
          myInfo.activator.duel.clock.incrementProcSeq();

          await myInfo.activator.getDeckCell().cardEntities[0].sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

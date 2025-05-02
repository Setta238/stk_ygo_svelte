import type { CardDefinition } from "../CardDefinitions";
import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "../DefaultCardAction_Spell";

export const createCardDefinitions_BambooSword_NormalSpell = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
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
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.length < 2) {
            return;
          }
          if (!myInfo.activator.canDraw) {
            return;
          }
          if (!myInfo.activator.canAddToHandFromDeck) {
            return;
          }
          if (
            !myInfo.activator
              .getSpellTrapsOnField()
              .filter((spelltrap) => spelltrap.status.nameTags?.includes("竹光"))
              .some((spelltrap) => spelltrap.status.spellCategory === "Equip")
          ) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
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
  });

  return result;
};

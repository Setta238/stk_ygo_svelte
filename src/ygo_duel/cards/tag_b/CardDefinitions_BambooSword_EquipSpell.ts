import type { CardDefinition } from "../CardDefinitions";
import { defaultSpellTrapSetAction, getDefaultEquipSpellTrapAction } from "../DefaultCardAction_Spell";

export const createCardDefinitions_BambooSword_EquipSpell = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  result.push({
    name: "折れ竹光",
    actions: [getDefaultEquipSpellTrapAction(), defaultSpellTrapSetAction],
  });
  return result;
};

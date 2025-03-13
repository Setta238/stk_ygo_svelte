import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { createCardDefinitions_Monster } from "./CardDefinitions_Monster";
import { createCardDefinitions_NormalSpell } from "./CardDefinitions_NormalSpell";
import { createCardDefinitions_QuickPlaySpell } from "./CardDefinitions_QuickPlaySpell";

export type CardDefinition = {
  name: string;
  actions: CardActionBase<unknown>[];
};

export const createCardDefinitions = (): CardDefinition[] => {
  const hoge = [...createCardDefinitions_Monster(), ...createCardDefinitions_NormalSpell(), ...createCardDefinitions_QuickPlaySpell()];
  hoge.forEach((hoge) => console.log(hoge.name));
  return hoge;
};

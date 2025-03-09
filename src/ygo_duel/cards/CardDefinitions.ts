import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { createCardDefinitions_Monster } from "./CardDefinitions_Monster";
import { createCardDefinitions_Spell } from "./CardDefinitions_Spell";

export type CardDefinition = {
  name: string;
  actions: CardActionBase<unknown>[];
};

export const createCardDefinitions = (): CardDefinition[] => {
  const hoge = [...createCardDefinitions_Monster(), ...createCardDefinitions_Spell()];
  console.log(hoge);
  return hoge;
};

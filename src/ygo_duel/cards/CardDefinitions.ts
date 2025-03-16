import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { createCardDefinitions_Monster } from "./CardDefinitions_Monster";
import { createCardDefinitions_NormalSpell } from "./CardDefinitions_NormalSpell";
import { createCardDefinitions_QuickPlaySpell } from "./CardDefinitions_QuickPlaySpell";
import { createCardDefinitions_Monster_Preset_Recruiter } from "./CardDefinitions_Monster_Preset_Recruiter";
import { createCardDefinitions_NormalSpell_Preset } from "./CardDefinitions_NormalSpell_Preset";
import { createCardDefinitions_SyncroMonster } from "./CardDefinitions_SyncroMonster";
import type { ContinuousEffectBase } from "@ygo_duel/class/ContinuousEffect";
import { SystemError } from "@ygo_duel/class/Duel";

export type CardDefinition = {
  name: string;
  actions: CardActionBase<unknown>[];
  continuousEffects?: ContinuousEffectBase<unknown>[];
};

export const createCardDefinitions = (): CardDefinition[] => {
  const hoge = [
    ...createCardDefinitions_Monster(),
    ...createCardDefinitions_Monster_Preset_Recruiter(),
    ...createCardDefinitions_SyncroMonster(),
    ...createCardDefinitions_NormalSpell(),
    ...createCardDefinitions_NormalSpell_Preset(),
    ...createCardDefinitions_QuickPlaySpell(),
  ];
  const names = hoge.map((def) => def.name);
  console.info(names);

  const fuga = Object.values(Object.groupBy(names, (name) => name))
    .filter((grouped) => (grouped?.length ?? 2) > 1)
    .map((grouped) => grouped?.[0]);

  if (fuga.length > 0) {
    throw new SystemError("カード定義重複", ...fuga);
  }
  return hoge;
};

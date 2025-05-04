import type { Duelist } from "@ygo_duel/class/Duelist";
import { duelistActions } from "@ygo_entity_proc/duelist_actions/CommonDuelitstAction";

export const createDuelistProcDefinition = (duelist: Duelist) => {
  return {
    name: duelist.profile.name,
    actions: [...duelistActions],
    staticInfo: { name: duelist.profile.name, kind: "Monster", wikiEncodedName: "%A5%D7%A5%EC%A5%A4%A5%E4%A1%BC" },
  };
};

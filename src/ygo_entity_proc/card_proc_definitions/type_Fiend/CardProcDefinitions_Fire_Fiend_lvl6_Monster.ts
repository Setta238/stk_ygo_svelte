import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultContinuousSpellCardActivateAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ガルガルドの屍煉魔",
    actions: [defaultContinuousSpellCardActivateAction],
  };
}

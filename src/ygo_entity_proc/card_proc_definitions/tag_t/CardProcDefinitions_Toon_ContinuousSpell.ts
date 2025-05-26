import { defaultContinuousSpellCardActivateAction, defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultPayLifePoint } from "@ygo_entity_proc/card_actions/CardActions";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "トゥーン・ワールド",
    actions: [
      {
        ...defaultContinuousSpellCardActivateAction,
        canPayCosts: (myInfo) => myInfo.activator.lp >= 1000,
        payCosts: (myInfo, chainBlockInfos) => defaultPayLifePoint(myInfo, chainBlockInfos, 1000),
      },
      defaultSpellTrapSetAction,
    ],
  };
}

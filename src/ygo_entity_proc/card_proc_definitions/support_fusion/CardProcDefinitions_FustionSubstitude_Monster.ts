import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultFusionSubstituteEffect,
  defaultNormalSummonAction,
} from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";

export default function* generate(): Generator<EntityProcDefinition> {
  for (const name of ["心眼の女神", "沼地の魔獣王", "イリュージョン・シープ", "破壊神 ヴァサーゴ"]) {
    yield {
      name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction, defaultNormalSummonAction],
      continuousEffects: [defaultFusionSubstituteEffect],
    };
  }
}

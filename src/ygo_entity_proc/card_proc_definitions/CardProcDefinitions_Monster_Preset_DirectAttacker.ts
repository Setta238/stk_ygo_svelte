import { defaultDirectAtackEffect } from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";

export default function* generate(): Generator<EntityProcDefinition> {
  yield* ["ラージマウス", "レインボー・フラワー", "レッグル", "女王の影武者", "人造人間７号"].map((name) => {
    return {
      name: name,
      actions: [],
      continuousEffects: [defaultDirectAtackEffect],
    };
  });
}

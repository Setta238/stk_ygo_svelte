import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultXyzSummonAction } from "@ygo_entity_proc/card_actions/CardActions_XyzMonster";
export default function* generate(): Generator<EntityProcDefinition> {
  yield* [
    { name: "ジェムナイト・パール", qty: 2 },
    { name: "覚醒の勇士 ガガギゴ", qty: 3 },
  ].map((item) => {
    return {
      name: item.name,
      actions: [getDefaultXyzSummonAction(item.qty, item.qty)],
    };
  });
}

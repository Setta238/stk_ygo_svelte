import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultLinkSummonAction } from "../card_actions/CardActions_LinkMonster";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";

export default function* generate(): Generator<EntityProcDefinition> {
  yield* [
    { name: "ＬＡＮフォリンクス", validator: (selected: DuelEntity[]) => selected.length === 2 },
    { name: "トラフィックゴースト", validator: (selected: DuelEntity[]) => selected.length === 3 },
    {
      name: "天威の鬼神",
      validator: (selected: DuelEntity[]) => selected.length > 1 && selected.some((monster) => monster.status.monsterCategories?.includes("Link")),
    },
    {
      name: "天威の拳僧",
      validator: (selected: DuelEntity[]) =>
        selected.every((monster) => monster.status.nameTags?.includes("天威") && !monster.status.monsterCategories?.includes("Link")),
    },
    { name: "電影の騎士ガイアセイバー", validator: (selected: DuelEntity[]) => selected.length > 1 },
  ].map((item): EntityProcDefinition => {
    return {
      name: item.name,
      actions: [getDefaultLinkSummonAction(item.validator)],
    };
  });
}

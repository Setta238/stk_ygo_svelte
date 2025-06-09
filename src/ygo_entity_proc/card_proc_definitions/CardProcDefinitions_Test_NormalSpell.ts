import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultFusionSummonAction, type MaterialDestMapper } from "@ygo_entity_proc/card_actions/CardActions_FusionSpell";
import type { DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";

export default function* generate(): Generator<EntityProcDefinition> {
  {
    const cellTypes: DuelFieldCellType[] = ["Hand", "MonsterZone", "ExtraMonsterZone", "Deck", "ExtraDeck", "Graveyard"] as const;
    const materialDestMapper = cellTypes.reduce((wip, current) => {
      wip[current] = { to: "Banished" };
      return wip;
    }, {} as MaterialDestMapper);
    yield {
      name: "にせ融合",
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          ...getDefaultFusionSummonAction(
            ["ExtraDeck"],
            () => true,
            cellTypes,
            () => true,
            { materialDestMapper }
          ),
        },
        defaultSpellTrapSetAction,
      ],
    };
  }
}

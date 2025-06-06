import { type EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultFusionSummonAction } from "@ygo_entity_proc/card_actions/CardActions_FusionSpell";
import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";
import { getCommonFallenOfAlbazSpellTrapSalvageAction } from "@ygo_entity_proc/card_actions/tag_f/CardActions_FallenOfAlbaz_SpellTrap";

export default function* generate(): Generator<EntityProcDefinition> {
  {
    yield {
      name: "白の烙印",
      actions: [
        {
          title: "①発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          ...getDefaultFusionSummonAction(
            ["ExtraDeck"],
            () => true,
            ["Hand", "MonsterZone", "ExtraMonsterZone", "Graveyard"],
            (myInfo, monster, materials) =>
              materials.flatMap((material) => material.types ?? []).includes("Dragon") &&
              (materials.map((material) => material.nm).includes("アルバスの落胤") ||
                !materials.map((material) => material.cell.cellType).includes("Graveyard"))
          ),
        },
        getCommonFallenOfAlbazSpellTrapSalvageAction("②"),
        defaultSpellTrapSetAction,
      ],
    };
  }
}

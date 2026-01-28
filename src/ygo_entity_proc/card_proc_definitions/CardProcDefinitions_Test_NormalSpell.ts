import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultFusionSummonAction, type MaterialDestMapper } from "@ygo_entity_proc/card_actions/CardActions_FusionSpell";
import type { DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";

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
            { materialDestMapper },
          ),
        },
        defaultSpellTrapSetAction,
      ],
    };
  }
  yield {
    name: "にせストームアクセス",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromExtraDeck"],
        canExecute: (myInfo) =>
          myInfo.activator.getExtraDeck().cardEntities.some((entity) => entity.status.monsterCategories?.includes("Link")) &&
          (myInfo.activator.getAvailableExtraMonsterZones().length > 0 || myInfo.activator.getEmptyMonsterZones().some((cell) => cell.linkArrowSources.length)),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cells = [
            ...myInfo.activator.getAvailableExtraMonsterZones(),
            ...myInfo.activator.getEmptyMonsterZones().filter((cell) => cell.linkArrowSources.length),
          ];

          if (!cells.length) {
            return false;
          }

          const monsters = myInfo.activator.getExtraDeck().cardEntities.filter((entity) => entity.status.monsterCategories?.includes("Link"));

          if (!monsters.length) {
            return false;
          }

          await myInfo.activator.summonOne(
            myInfo.activator,
            "LinkSummon",
            ["Effect"],
            myInfo.action,
            monsters.map((monster) => ({ monster, cells, posList: ["Attack"] })),
            [],
            true,
            false,
          );

          return true;
        },
        settle: async () => true,
      },
      {
        title: "回収",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["AddToHandFromGraveyard"],
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          await myInfo.action.entity.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

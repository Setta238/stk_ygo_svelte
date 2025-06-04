import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultCanPayDiscardCosts, defaultPayDiscardCosts } from "@ygo_entity_proc/card_actions/CardActions";
import { getDefaultFusionSummonAction } from "@ygo_entity_proc/card_actions/CardActions_FusionSpell";

export default function* generate(): Generator<EntityProcDefinition> {
  {
    yield {
      name: "アルバスの落胤",
      actions: [
        {
          title: "融合",
          isMandatory: false,
          playType: "TriggerEffect",
          spellSpeed: "Normal",
          executableCells: ["MonsterZone"],
          executablePeriods: freeChainDuelPeriodKeys,
          executableDuelistTypes: ["Controller"],
          triggerPattern: { triggerType: "Arrival", arrivalReasons: ["NormalSummon", "SpecialSummon"] },
          canPayCosts: defaultCanPayDiscardCosts,
          payCosts: defaultPayDiscardCosts,
          ...getDefaultFusionSummonAction(
            ["ExtraDeck"],
            () => true,
            ["MonsterZone"],
            (myInfo, monster, materials) =>
              materials.includes(myInfo.action.entity) &&
              materials.every((material) => material === myInfo.action.entity || material.controller !== myInfo.activator),
            { requisitionFrom: monsterZoneCellTypes }
          ),
          settle: async () => true,
        },
      ],
    };
  }
}

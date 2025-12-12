import {
  canSelfSepcialSummon,
  defaultSelfReleaseCanPayCosts,
  defaultSelfReleasePayCosts,
  defaultSelfSpecialSummonExecute,
} from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import {} from "@ygo_duel/class/DuelEntityShortHands";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { getPaySendToGraveyardCostsActionPartical } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_SendToGraveyard";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "にん人",
    actions: [
      {
        title: "自己再生",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        fixedTags: ["SpecialSummonFromGraveyard"],
        isOnlyNTimesPerTurn: 1,
        ...getPaySendToGraveyardCostsActionPartical(
          ["Hand", "MonsterZone", "ExtraMonsterZone"],
          (entity, myInfo) =>
            entity.types.includes("Plant") &&
            entity.nm !== "にん人" &&
            canSelfSepcialSummon(myInfo, faceupBattlePositions, [{ cell: entity.cell, material: entity }], ["Effect"]) &&
            (entity.cell.cellType === "Hand" || entity.face === "FaceUp"),
          { qty: 1 }
        ),
        canExecute: (myInfo) =>
          myInfo.activator
            .getCells("Hand", "MonsterZone", "ExtraMonsterZone")
            .flatMap((cell) => cell.cardEntities)
            .filter((monster) => monster.types.includes("Plant"))
            .filter((monster) => monster.nm !== "にん人")
            .filter((monster) => monster.cell.cellType === "Hand" || monster.face === "FaceUp")
            .some((monster) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [{ cell: monster.cell, material: monster }], ["Effect"])),
        prepare: defaultPrepare,
        execute: defaultSelfSpecialSummonExecute,
        settle: async () => true,
      },
    ],
  };
}

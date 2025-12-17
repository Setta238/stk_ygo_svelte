import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultLinkSummonAction } from "@ygo_entity_proc/card_actions/CardActions_LinkMonster";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultPrepare, getSingleTargetActionPartical } from "../../card_actions/CardActions";
import { canSelfSepcialSummon, defaultSelfSpecialSummonExecute } from "@ygo_entity_proc/card_actions/CardActions_Monster";
import {
  getPayReleaseCostsActionPartical,
  getPaySelfReleaseCostsActionPartical,
} from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Release";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "リンクリボー",
    actions: [
      getDefaultLinkSummonAction((selected) => selected.length === 1 && selected.every((monster) => monster.lvl === 1)),
      {
        title: "①弱体化",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["b1Battle", "b2Battle"],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo, chainBlockInfos) =>
          chainBlockInfos.some((info) => info.action.playType === "DeclareAttack" && info.activator !== myInfo.activator),
        ...getSingleTargetActionPartical((myInfo, chainBlockInfos) =>
          chainBlockInfos.filter((info) => info.action.playType === "DeclareAttack" && info.activator !== myInfo.activator).map((info) => info.action.entity)
        ),
        ...getPaySelfReleaseCostsActionPartical(),
        execute: async (myInfo) => {
          if (!myInfo.selectedEntities.length) {
            return false;
          }
          const selected = myInfo.selectedEntities[0];
          if (!selected.isOnFieldAsMonsterStrictly) {
            return false;
          }
          if (selected.face === "FaceDown") {
            return false;
          }

          selected.numericOprsBundle.push(
            NumericStateOperator.createLingeringFixation(
              "攻撃力ゼロ",
              (ope) => ope.duel.clock.isSameTurn(ope.isSpawnedAt),
              myInfo.action.entity,
              myInfo.action,
              "attack",
              () => 0
            )
          );

          return true;
        },
        settle: async () => true,
      },
      {
        title: "②自己再生",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: ["Graveyard"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        fixedTags: ["SpecialSummonFromGraveyard"],
        isOnlyNTimesPerTurn: 1,
        ...getPayReleaseCostsActionPartical(
          ["MonsterZone", "ExtraMonsterZone"],
          (entity, myInfo) => entity.lvl === 1 && canSelfSepcialSummon(myInfo, ["Attack"], [{ cell: entity.cell, material: entity }], ["Effect"]),
          1
        ),
        canExecute: (myInfo) =>
          myInfo.activator
            .getCells("MonsterZone", "ExtraMonsterZone")
            .flatMap((cell) => cell.cardEntities)
            .filter((monster) => monster.lvl === 1)
            .some((monster) => canSelfSepcialSummon(myInfo, ["Attack"], [{ cell: monster.cell, material: monster }], ["Effect"])),
        prepare: defaultPrepare,
        execute: defaultSelfSpecialSummonExecute,
        settle: async () => true,
      },
    ],
  };
}

import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { createRegularStatusOperatorHandler } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import {
  canSelfSepcialSummon,
  defaultRuleSummonExecute,
  defaultRuleSummonPrepare,
  getDestsForSelfSpecialSummon,
} from "@ygo_entity_proc/card_actions/CardActions_Monster";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "フォトン・スラッシャー",
    actions: [
      {
        title: "特殊召喚",
        isMandatory: false,
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Rule"]) && !myInfo.activator.getMonstersOnField().length,
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Rule"]),
        prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "SpecialSummon", ["SpecialSummon", "Rule"], faceupBattlePositions),
        execute: defaultRuleSummonExecute,
        settle: async () => true,
      },
    ],
    continuousEffects: [
      createRegularStatusOperatorHandler(
        "攻撃不可",
        "Monster",
        (source) => [source],
        (source) => {
          return [
            new StatusOperator({
              title: "攻撃不可",
              validateAlive: () => true,
              isContinuous: true,
              isSpawnedBy: source,
              actionAttr: {},
              isApplicableTo: () => true,
              statusCalculator: (bundleOwner) => ({ canAttack: bundleOwner.controller.getMonstersOnField().length === 1 }),
            }),
          ];
        }
      ),
    ],
  };
}

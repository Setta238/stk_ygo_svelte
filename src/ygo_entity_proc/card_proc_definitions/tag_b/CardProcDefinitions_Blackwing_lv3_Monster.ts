import {
  canSelfSepcialSummon,
  defaultRuleSummonExecute,
  defaultRuleSummonPrepare,
  getDestsForSelfSpecialSummon,
} from "@ygo_entity_proc/card_actions/CardActions_Monster";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { faceupBattlePositions, type TEntityFlexibleNumericStatusKey } from "@ygo/class/YgoTypes";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CardActions";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ＢＦ－疾風のゲイル",
    actions: [
      {
        title: "①特殊召喚",
        isMandatory: false,
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        canExecute: (myInfo) =>
          myInfo.activator
            .getMonstersOnField()
            .filter((monster) => (monster.status.nameTags ?? []).includes("BF"))
            .some((monster) => monster.nm !== myInfo.action.entity.origin.name) && canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Rule"]),
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Rule"]),
        prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "SpecialSummon", ["SpecialSummon", "Rule"], faceupBattlePositions),
        execute: defaultRuleSummonExecute,
        settle: async () => true,
      },
      {
        title: "②攻守半減",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.activator
              .getOpponentPlayer()
              .getMonstersOnField()
              .filter((enemy) => enemy.face === "FaceUp")
              .filter((enemy) => enemy.canBeTargetOfEffect(myInfo)),
          { message: "対象モンスターを選択。" },
        ),
        execute: async (myInfo) => {
          const target = myInfo.selectedEntities
            .filter((target) => target.isOnFieldAsMonsterStrictly)
            .filter((target) => target.face === "FaceUp")
            .find((target) => target.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action));
          // フィールドにいなければ効果なし
          if (!target) {
            return false;
          }
          (["attack", "defense"] as TEntityFlexibleNumericStatusKey[])
            .map((targetState) =>
              NumericStateOperator.createLingeringFixation(
                "②攻守半減",
                () => true,
                myInfo.action.entity,
                myInfo.action,
                targetState,
                (spawner: DuelEntity, monster: DuelEntity, current: number) => Math.round(current / 2),
              ),
            )
            .forEach((ope) => target.numericOprsBundle.push(ope));

          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

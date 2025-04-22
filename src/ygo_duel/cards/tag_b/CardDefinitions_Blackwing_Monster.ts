import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
  defaultRuleSpecialSummonValidate,
  defaultRuleSummonExecute,
  defaultRuleSummonPrepare,
} from "@ygo_duel/cards/DefaultCardAction_Monster";
import type { CardDefinition } from "../CardDefinitions";
import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { faceupBattlePositions, type TEntityFlexibleNumericStatusKey } from "@ygo/class/YgoTypes";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";

export const createCardDefinitions_Blackwing_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  result.push({
    name: "ＢＦ－疾風のゲイル",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      {
        title: "①特殊召喚",
        isMandatory: false,
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          const blackwings = myInfo.activator
            .getMonstersOnField()
            .filter((monster) => (monster.status.nameTags ?? []).includes("ＢＦ"))
            .filter((monster) => monster.nm !== myInfo.action.entity.origin.name);
          if (!blackwings.length) {
            return undefined;
          }

          return defaultRuleSpecialSummonValidate(myInfo, ["Attack", "Defense"], []);
        },
        prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "SpecialSummon", ["SpecialSummon", "Rule"], faceupBattlePositions),
        execute: defaultRuleSummonExecute,
        settle: async () => true,
      } as CardActionDefinition<unknown>,
      {
        title: "②攻守半減",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        hasToTargetCards: true,
        isOnlyNTimesPerTurnIfFaceup: 1,
        validate: (myInfo) => {
          const enemies = myInfo.activator
            .getOpponentPlayer()
            .getMonstersOnField()
            .filter((enemy) => enemy.face === "FaceUp")
            .filter((enemy) => enemy.canBeTargetOfEffect(myInfo));
          if (!enemies.length) {
            return undefined;
          }

          return enemies.length ? enemies : undefined;
        },
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          let target = myInfo.dest?.cardEntities[0];

          if (!target) {
            const enemies = myInfo.activator
              .getOpponentPlayer()
              .getMonstersOnField()
              .filter((enemy) => enemy.face === "FaceUp")
              .filter((enemy) => enemy.canBeTargetOfEffect(myInfo));
            const _targets = await myInfo.action.entity.duel.view.waitSelectEntities(
              myInfo.activator,
              enemies,
              1,
              (selected) => selected.length === 1,
              "効果対象を選択。",
              cancelable
            );

            if (!_targets || !_targets.length) {
              return;
            }

            target = _targets[0];
          }

          return { selectedEntities: [target], chainBlockTags: [], prepared: undefined };
        },
        execute: async (myInfo) => {
          const target = myInfo.selectedEntities
            .filter((target) => target.isOnFieldAsMonsterStrictly)
            .filter((target) => target.face === "FaceUp")
            .find((target) => target.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action));
          // フィールドにいなければ効果なし
          if (!target) {
            return;
          }
          (["attack", "defense"] as TEntityFlexibleNumericStatusKey[])
            .map((targetState) =>
              NumericStateOperator.createLingeringFixation(
                "②攻守半減",
                () => true,
                myInfo.action.entity,
                myInfo.action,
                targetState,
                (spawner: DuelEntity, monster: DuelEntity, current: number) => Math.round(current / 2)
              )
            )
            .forEach((ope) => target.numericOprsBundle.push(ope));

          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<undefined>,
    ] as CardActionDefinition<unknown>[],
  });
  return result;
};

import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalSummonAction,
  defaultRuleSpecialSummonExecute,
  defaultRuleSpecialSummonPrepare,
  defaultRuleSpecialSummonValidate,
  type SummonPrepared,
} from "@ygo_duel/cards/DefaultCardAction_Monster";
import type { CardDefinition } from "./CardDefinitions";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import type { TEntityFlexibleNumericStatusKey } from "@ygo/class/YgoTypes";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";

export const createCardDefinitions_Blackwing_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  result.push({
    name: "ＢＦ－疾風のゲイル",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "①特殊召喚",
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
        prepare: (myInfo, cell, chainBlockInfos, cancelable) => defaultRuleSpecialSummonPrepare(myInfo, cell, ["Attack", "Defense"], [], cancelable),
        execute: defaultRuleSpecialSummonExecute,
        settle: async () => true,
      } as CardActionBase<SummonPrepared>,
      {
        title: "②攻守半減",
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
            .filter((enemy) => enemy.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action));
          if (!enemies.length) {
            return undefined;
          }

          return enemies.length ? enemies : undefined;
        },
        prepare: async (myInfo, cell, chainBlockInfos, cancelable) => {
          let target = cell?.cardEntities[0];

          if (!target) {
            const enemies = myInfo.activator
              .getOpponentPlayer()
              .getMonstersOnField()
              .filter((enemy) => enemy.canBeTargetOfEffect(myInfo.activator, myInfo.action.entity, myInfo.action));
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
            .filter((target) => target.isOnFieldAsMonster)
            .filter((target) => target.face === "FaceUp")
            .find((target) => target.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action));
          // フィールドにいなければ効果なし
          if (!target) {
            return;
          }
          (["attack", "defense"] as TEntityFlexibleNumericStatusKey[])
            .map((targetState) =>
              NumericStateOperator.createLingering(
                "②攻守半減",
                myInfo.action.entity,
                myInfo.action,
                targetState,
                "current",
                "Fixation",
                (spawner: DuelEntity, monster: DuelEntity, current: number) => Math.round(current / 2)
              )
            )
            .forEach((ope) => target.numericOprsBundle.push(ope));

          return true;
        },
        settle: async () => true,
      } as CardActionBase<undefined>,
    ] as CardActionBase<unknown>[],
  });
  return result;
};

import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {
  defaultEffectSpecialSummonExecute,
  defaultPrepare,
  defaultTargetMonstersRebornPrepare,
  getMultiTargetsRebornActionPartical,
  getSingleTargetActionPartical,
} from "@ygo_entity_proc/card_actions/CardActions";
import { getPayDiscardCostsActionPartical } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Discard";

import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { entityCostTypes, type CardActionDefinition } from "@ygo_duel/class/DuelEntityAction";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelError } from "@ygo_duel/class_error/DuelError";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "強欲な瓶",
    actions: [
      defaultSpellTrapSetAction,
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["Draw"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 1 && myInfo.activator.canDraw && myInfo.activator.canAddToHandFromDeck,
        prepare: defaultPrepare,
        execute: async (chainBlockInfo) => {
          await chainBlockInfo.activator.draw(1, chainBlockInfo.action.entity, chainBlockInfo.activator);
          return true;
        },
        settle: async () => true,
      },
    ],
  };

  yield {
    name: "戦線復帰",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromGraveyard"],
        ...getMultiTargetsRebornActionPartical(
          (myInfo) =>
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
          { posList: ["Defense"] }
        ),
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "サンダー・ブレイク",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        ...getPayDiscardCostsActionPartical(() => true, 1),
        ...getSingleTargetActionPartical(
          (myInfo, chainBlockInfos, irregularExecuteInfo) =>
            myInfo.action.entity.field
              .getCardsOnFieldStrictly()
              .filter((card) => card !== myInfo.action.entity)
              .filter((card) => card.canBeTargetOfEffect(myInfo))
              .filter((card) => {
                if (!irregularExecuteInfo) {
                  return true;
                }
                // コストに含まれているカード及び、それに装備されているカードは対象になりえない
                const costs = entityCostTypes.flatMap((type) => irregularExecuteInfo.costInfo[type] ?? []).map((info) => info.cost);
                costs.push(...costs.flatMap((cost) => cost.info.equipEntities));
                return !costs.includes(card);
              }),
          { message: "対象とするカードを選択。", do: "Destroy" }
        ),
        execute: async (myInfo) => {
          // フィールドにいなければ効果なし
          if (myInfo.selectedEntities.every((target) => !target.isOnField)) {
            return false;
          }

          await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };

  {
    const giveAndTakeAction: CardActionDefinition<{ give: DuelEntity; take: DuelEntity }> = {
      title: "発動",
      isMandatory: false,
      playType: "CardActivation",
      spellSpeed: "Quick",
      executableCells: ["SpellAndTrapZone"],
      executablePeriods: freeChainDuelPeriodKeys,
      executableDuelistTypes: ["Controller"],
      hasToTargetCards: true,
      fixedTags: ["SpecialSummonFromGraveyard"],
      canExecute: (myInfo, chainBlockInfos, irregularExecuteInfo) => {
        // 墓地に蘇生可能モンスター、場に空きが必要。
        const cells = myInfo.activator.getOpponentPlayer().getMonsterZones();
        const list = myInfo.activator.getEnableSummonList(
          myInfo.activator,
          "SpecialSummon",
          ["Effect"],
          myInfo.action,
          myInfo.activator
            .getGraveyard()
            .cardEntities.filter((monster) => monster.lvl)
            .filter((card) => card.canBeTargetOfEffect(myInfo))
            .map((monster) => {
              return { monster, posList: ["Defense"], cells };
            }),
          [],
          false
        );
        if (!list.length) {
          return false;
        }

        return myInfo.activator
          .getMonstersOnField()
          .filter((monster) => monster.lvl)
          .filter((card) => {
            if (!irregularExecuteInfo) {
              return true;
            }
            // コストに含まれているカード及び、それに装備されているカードは対象になりえない
            const costs = entityCostTypes.flatMap((type) => irregularExecuteInfo.costInfo[type] ?? []).map((info) => info.cost);
            costs.push(...costs.flatMap((cost) => cost.info.equipEntities));
            return !costs.includes(card);
          })
          .some((monster) => monster.canBeTargetOfEffect(myInfo));
      },
      prepare: async (myInfo, chainBlockInfos, cancelable) => {
        const target = await myInfo.activator.waitSelectEntity(
          myInfo.activator.getMonstersOnField().filter((monster) => monster.lvl),
          "レベルを上げるモンスターを選択。",
          cancelable
        );

        if (!target) {
          return;
        }

        const result = await defaultTargetMonstersRebornPrepare(
          myInfo,
          myInfo.activator
            .getGraveyard()
            .cardEntities.filter((monster) => monster.lvl)
            .filter((card) => card.canBeTargetOfEffect(myInfo)),
          ["Defense"]
        );

        const selectedEntities = [target, ...result.selectedEntities];
        myInfo.data = { give: result.selectedEntities[0], take: target };

        return { ...result, selectedEntities };
      },
      execute: async (myInfo) => {
        if (!myInfo.data) {
          throw new DuelError("正しくない形でギブ＆テイクの効果処理を実行しようとした。");
        }
        const { give, take } = myInfo.data;
        if (!take.isOnFieldAsMonsterStrictly) {
          return false;
        }

        const result = await defaultEffectSpecialSummonExecute(myInfo, [give], {
          cells: myInfo.activator.getOpponentPlayer().getMonsterZones(),
          posList: ["Defense"],
        });

        if (!result) {
          return false;
        }

        const lvl = give.lvl ?? 0;

        take.numericOprsBundle.push(
          NumericStateOperator.createLingeringAddition(
            "ギブ＆テイク",
            (operator) => operator.duel.clock.isSameTurn(operator.isSpawnedAt),
            myInfo.action.entity,
            myInfo.action,
            "level",
            (spawner, target, current) => current + lvl
          )
        );

        return true;
      },
      settle: async () => true,
    };

    yield {
      name: "ギブ＆テイク",
      actions: [giveAndTakeAction, defaultSpellTrapSetAction],
    };
  }
}

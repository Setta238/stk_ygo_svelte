import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { TActionTag } from "@ygo_duel/class/DuelEntityAction";
import { IllegalCancelError } from "@ygo_duel/class_error/DuelError";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPrepare, getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CardActions";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ご隠居の猛毒薬",
    actions: [
      defaultSpellTrapSetAction,
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          const choices: { seq: number; text: string; tags: TActionTag[] }[] = [
            { seq: 0, text: "●自分は１２００ＬＰ回復する。", tags: [] },
            { seq: 1, text: "●相手に８００ダメージを与える。", tags: ["DamageToOpponent"] },
          ];

          const selected = await myInfo.activator.waitSelectText(choices, "使用する効果を選択", cancelable);
          if (selected === undefined) {
            return;
          }

          return { selectedEntities: [], chainBlockTags: selected.tags };
        },
        execute: async (myInfo) => {
          if (myInfo.chainBlockTags.includes("DamageToOpponent")) {
            myInfo.activator.heal(1200, myInfo.action.entity);
          } else {
            myInfo.activator.getOpponentPlayer().effectDamage(800, myInfo);
          }
          return true;
        },
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "月の書",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.action.entity.field
              .getMonstersOnFieldStrictly()
              .filter((monster) => monster.canBeTargetOfEffect(myInfo))
              .filter((monster) => monster.canBeSet)
              .filter((monster) => monster.face === "FaceUp"),
          { message: "対象とするモンスターを選択。" }
        ),
        execute: async (myInfo) => {
          const target = myInfo.selectedEntities[0];
          // フィールドにいなければ効果なし
          if (!target.isOnFieldAsMonsterStrictly) {
            return false;
          }

          //すでにセット状態であれば効果なし
          if (target.battlePosition === "Set") {
            return false;
          }

          //効果を受けない状態であれば効果なし
          if (!target.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action)) {
            myInfo.activator.duel.log.info(`${target.toString()}は${myInfo.action.entity.toString()}の効果を受けない。`);
            return false;
          }

          // セット状態にする。
          await target.setBattlePosition("Set", ["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "突進",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.action.entity.field
              .getMonstersOnFieldStrictly()
              .filter((monster) => monster.face === "FaceUp")
              .filter((monster) => monster.canBeTargetOfEffect(myInfo)),
          { message: "対象とするモンスターを選択。" }
        ),
        execute: async (myInfo) => {
          const target = myInfo.selectedEntities[0];
          // フィールドにいなければ効果なし
          if (!target.isOnFieldAsMonsterStrictly) {
            return false;
          }

          //セット状態であれば効果なし
          if (target.battlePosition === "Set") {
            return false;
          }

          //効果を受けない状態であれば効果なし
          if (!target.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action)) {
            myInfo.activator.duel.log.info(`${target.toString()}は${myInfo.action.entity.toString()}の効果を受けない。`);
            return false;
          }
          target.numericOprsBundle.push(
            NumericStateOperator.createLingeringAddition(
              "攻撃力上昇",
              (operator) => operator.duel.clock.isSameTurn(operator.isSpawnedAt),
              myInfo.action.entity,
              myInfo.action,
              "attack",
              (spawner: DuelEntity, monster: DuelEntity, current: number) => current + 700
            )
          );

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "手札断殺",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["Draw"],
        canExecute: (myInfo) => {
          for (const duelist of [myInfo.activator, myInfo.activator.getOpponentPlayer()]) {
            if (!duelist.canDraw) {
              return false;
            }
            if (
              duelist
                .getHandCell()
                .cardEntities.filter((card) => card.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, "SendToGraveyardAsEffect", myInfo.action))
                .filter((card) => card !== myInfo.action.entity).length < 2
            ) {
              return false;
            }
            if (duelist.getDeckCell().cardEntities.length < 2) {
              return false;
            }
          }

          return true;
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (myInfo.activator.getHandCell().cardEntities.length < 2) {
            return false;
          }
          if (myInfo.activator.getOpponentPlayer().getHandCell().cardEntities.length < 2) {
            return false;
          }

          let qty = 0;

          for (const duelist of [myInfo.activator, myInfo.activator.getOpponentPlayer()]) {
            const cards = await duelist.waitSelectEntities(
              duelist.getHandCell().cardEntities,
              2,
              (selected) => selected.length === 2,
              "墓地に送るカードを２枚選択。",
              false
            );
            if (!cards) {
              throw new IllegalCancelError(myInfo, duelist);
            }
            const _cards = await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);
            qty += _cards.length;
          }

          if (!qty) {
            return false;
          }

          // タイミングを逃させる要因になる。
          await myInfo.activator.duel.clock.incrementProcSeq();

          await DuelEntityShortHands.drawAtSameTime(myInfo.activator, myInfo.action.entity, 2, 2);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "リロード",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["Draw"],
        hasToTargetCards: true,
        // 自分のデッキが0枚でも発動できる。
        canExecute: (myInfo) => myInfo.activator.canDraw,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const hands = myInfo.activator.getHandCell().cardEntities;

          if (!hands.length) {
            return false;
          }

          await DuelEntityShortHands.returnManyToDeckForTheSameReason("Random", hands, ["Effect"], myInfo.action.entity, myInfo.activator);

          // タイミングを逃させる要因になる。
          await myInfo.activator.duel.clock.incrementProcSeq();

          await myInfo.activator.draw(hands.length, myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

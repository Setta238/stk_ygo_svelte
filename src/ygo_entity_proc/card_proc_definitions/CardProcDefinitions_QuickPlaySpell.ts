import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardActionDefinition, TEffectTag } from "@ygo_duel/class/DuelEntityAction";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";

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
        validate: defaultSpellTrapValidate,
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          const selected = await myInfo.action.entity.field.duel.view.waitSelectText(
            [
              { seq: 0, text: "●自分は１２００ＬＰ回復する。" },
              { seq: 1, text: "●相手に８００ダメージを与える。" },
            ],
            "使用する効果を選択",
            false
          );
          if (selected === undefined && !cancelable) {
            throw new IllegalCancelError(myInfo);
          }

          const tags: TEffectTag[] = [];

          if (selected === 1) {
            tags.push("DamageToOpponent");
          }

          return { selectedEntities: [], chainBlockTags: tags, prepared: selected ?? 0 };
        },
        execute: async (myInfo) => {
          if (myInfo.prepared === 1) {
            myInfo.activator.getOpponentPlayer().effectDamage(800, myInfo.action.entity);
            return true;
          }
          myInfo.activator.heal(1200, myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<number>,
    ] as CardActionDefinition<unknown>[],
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
        hasToTargetCards: true,
        validate: (myInfo) => {
          const monsters = myInfo.action.entity.field
            .getMonstersOnFieldStrictly()
            .filter((monster) => monster.canBeTargetOfEffect(myInfo))
            .filter((monster) => monster.face === "FaceUp");
          if (!monsters.length) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          const monsters = myInfo.action.entity.field
            .getMonstersOnFieldStrictly()
            .filter((monster) => monster.canBeTargetOfEffect(myInfo))
            .filter((monster) => monster.face === "FaceUp");

          const selected = await myInfo.activator.waitSelectEntity(monsters, "対象とするモンスターを選択", cancelable);
          if (!selected) {
            return;
          }
          return { selectedEntities: [selected], chainBlockTags: [], prepared: undefined };
        },
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
            return;
          }

          // セット状態にする。
          await target.setBattlePosition("Set", ["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
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
        hasToTargetCards: true,
        validate: (myInfo) => {
          const monsters = myInfo.action.entity.field.getMonstersOnFieldStrictly().filter((monster) => monster.canBeTargetOfEffect(myInfo));
          if (!monsters.length) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          const monsters = myInfo.action.entity.field.getMonstersOnFieldStrictly().filter((monster) => monster.canBeTargetOfEffect(myInfo));
          const selected = await myInfo.activator.waitSelectEntity(monsters, "対象とするモンスターを選択", cancelable);
          if (!selected) {
            return;
          }

          return { selectedEntities: [selected], chainBlockTags: [], prepared: undefined };
        },
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
            return;
          }
          target.numericOprsBundle.push(
            NumericStateOperator.createLingeringAddition(
              "攻撃力上昇",
              (operator) => operator.effectOwner.duel.clock.isSameTurn(operator.isSpawnedAt),
              myInfo.action.entity,
              myInfo.action,
              "attack",
              (spawner: DuelEntity, monster: DuelEntity, current: number) => current + 700
            )
          );

          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
      defaultSpellTrapSetAction,
    ],
  };
}

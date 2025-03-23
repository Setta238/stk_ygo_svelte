import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultNormalSummonAction } from "@ygo_duel/functions/DefaultCardAction_Monster";
import type { CardDefinition } from "./CardDefinitions";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { createRegularNumericStateOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { spellTrapZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";

export const createCardDefinitions_SpellCounter_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_魔導戦士ブレイカー = {
    name: "魔導戦士 ブレイカー",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultNormalSummonAction,
      {
        title: "①魔力カウンター装填",
        playType: "TriggerMandatoryEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        validate: (action) => {
          if (!action.entity.hasBeenSummonedNow(["NormalSummon"])) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["IfNormarlSummonSucceed"], prepared: undefined };
        },
        execute: async (myInfo) => {
          // ブレイカーは最大一個なので、1で上書きする。
          // 無効になっている場合乗せられないが、そもそもこの処理に入らない
          myInfo.action.entity.counterHolder.setQty("SpellCounter", 1);
          return true;
        },
        settle: async () => true,
      },
      {
        title: "③魔法罠破壊",
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        validate: (action) => {
          if (!action.entity.counterHolder.getQty("SpellCounter")) {
            return;
          }

          const spells = action.entity.field
            .getCells(...spellTrapZoneCellTypes)
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.canBeTargetOfEffect(action.entity.controller, action.entity, action));

          if (!spells.length) {
            return;
          }

          return spells.map((spell) => spell.fieldCell);
        },
        prepare: async (action, cell, chainBlockInfos, cancelable) => {
          let target = cell?.cardEntities[0];

          if (!target) {
            const spells = action.entity.field
              .getCells(...spellTrapZoneCellTypes)
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card.canBeTargetOfEffect(action.entity.controller, action.entity, action));
            const _targets = await action.entity.duel.view.waitSelectEntities(
              action.entity.controller,
              spells,
              1,
              (selected) => selected.length === 1,
              "破壊する対象を選択。",
              cancelable
            );

            if (!_targets || !_targets.length) {
              return;
            }

            target = _targets[0];
          }

          return { selectedEntities: [target], chainBlockTags: action.calcChainBlockTagsForDestroy([target]), prepared: undefined };
        },
        execute: async (myInfo) => {
          // ブレイカーは最大一個なので、1で上書きする。
          // 無効になっている場合乗せられないが、そもそもこの処理に入らない
          myInfo.action.entity.counterHolder.setQty("SpellCounter", 1);
          return true;
        },
        settle: async () => true,
      },
    ] as CardActionBase<unknown>[],
    continuousEffects: [
      createRegularNumericStateOperatorHandler(
        "②攻撃力上昇",
        "Monster",
        (source) => [source],
        () => true,
        (source) => {
          return [
            NumericStateOperator.createContinuous(
              "②攻撃力上昇",
              () => true,
              source,
              () => true,
              "attack",
              "current",
              "Addition",
              (spawner, target, source) => {
                if (!spawner.status.isEffective) {
                  return source;
                }
                return source + spawner.counterHolder.getQty("SpellCounter") * 300;
              }
            ),
          ];
        }
      ),
    ] as ContinuousEffectBase<unknown>[],
  };
  result.push(def_魔導戦士ブレイカー);

  return result;
};

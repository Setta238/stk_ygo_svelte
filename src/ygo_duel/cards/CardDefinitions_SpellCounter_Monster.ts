import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultNormalSummonAction } from "@ygo_duel/functions/DefaultCardAction_Monster";
import type { CardDefinition } from "./CardDefinitions";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import {
  createRegularNumericStateOperatorHandler,
  createRegularStatusOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { spellTrapZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import type { TCardKind } from "@ygo/class/YgoTypes";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

const createSpellCounterCommonEffect = (kind: TCardKind, maxQty?: number) => {
  const title = maxQty ? `魔力充填可能(${maxQty})` : "魔力充填可能";

  return createRegularStatusOperatorHandler(
    title,
    kind,
    (source) => [source],
    () => true,
    (source) => {
      return [
        new StatusOperator(
          title,
          () => true,
          true,
          source,
          {},
          (spawner, target) => spawner === target,
          (ope, wip) => {
            wip.maxCounterQty.SpellCounter = maxQty ?? Number.MAX_VALUE;
            return wip;
          }
        ),
      ];
    }
  );
};

export const createCardDefinitions_SpellCounter_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_魔導戦士ブレイカー = {
    name: "魔導戦士 ブレイカー",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultNormalSummonAction,
      {
        title: "①魔力充填",
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
          if (myInfo.action.entity.face === "FaceDown") {
            return false;
          }
          // ブレイカーは最大一個なので、1で上書きする。
          // 無効になっている場合乗せられないが、そもそもこの処理に入らない
          myInfo.action.entity.counterHolder.setQty("SpellCounter", 1);
          return true;
        },
        settle: async () => true,
      } as CardActionBase<undefined>,
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
          if (!myInfo.action.entity.counterHolder.getQty("SpellCounter")) {
            return;
          }
          myInfo.action.entity.counterHolder.remove("SpellCounter", 1);

          await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);

          return true;
        },
        settle: async () => true,
      } as CardActionBase<unknown>,
    ] as CardActionBase<unknown>[],
    continuousEffects: [
      createSpellCounterCommonEffect("Monster", 1),
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
                if (!spawner.isEffective) {
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

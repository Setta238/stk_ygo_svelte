import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultLinkSummonAction } from "@ygo_entity_proc/card_actions/CardActions_LinkMonster";
import { duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { monsterZoneCellTypes, spellTrapZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CardActions";
import {
  getPayDiscardCostsActionPartical,
  getPaySelfDiscardCostsActionPartical,
} from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Discard";
import type { ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { destroyNameDic, type TDestroyCauseReason } from "@ygo_duel/class/DuelEntity";
export default function* generate(): Generator<EntityProcDefinition> {
  for (const item of [
    {
      name: "トロイメア・ケルベロス",
      trrigerEffectTitle: "①モンスター破壊",
      getTrrigerEffectTarget: (myInfo: ChainBlockInfoBase<unknown>) =>
        myInfo.activator
          .getOpponentPlayer()
          .getMonstersOnField()
          .filter((monster) => monster.cell.cellType === "MonsterZone"),
      destroyType: "Effect" as TDestroyCauseReason,
    },
    {
      name: "トロイメア・フェニックス",
      trrigerEffectTitle: "①魔法罠破壊",
      getTrrigerEffectTarget: (myInfo: ChainBlockInfoBase<unknown>) =>
        myInfo.activator
          .getOpponentPlayer()
          .getEntiteisOnField()
          .filter((entity) => (spellTrapZoneCellTypes as Readonly<string[]>).includes(entity.cell.cellType)),
      destroyType: "Battle" as TDestroyCauseReason,
    },
  ]) {
    const _actionPartical = getSingleTargetActionPartical<unknown>(item.getTrrigerEffectTarget, { do: "Destroy" });
    const actionPartical: typeof _actionPartical = {
      ..._actionPartical,
      prepare: (...args) => {
        const myInfo = args[0];
        myInfo.data = Boolean(myInfo.action.entity.coLinkedEntities.length);
        return _actionPartical.prepare(...args);
      },
    };

    yield {
      name: item.name,
      actions: [
        getDefaultLinkSummonAction((selected) => selected.length === 2 && selected.map((monster) => monster.nm).isAllUnique()),
        {
          title: item.trrigerEffectTitle,
          isMandatory: false,
          playType: "TriggerEffect",
          spellSpeed: "Normal",
          executableCells: monsterZoneCellTypes,
          executablePeriods: freeChainDuelPeriodKeys,
          executableDuelistTypes: ["Controller"],
          triggerPattern: { triggerType: "Arrival", arrivalReasons: ["LinkSummon"] },
          isOnlyNTimesPerTurn: 1,
          ...getPayDiscardCostsActionPartical(() => true, 1),
          ...actionPartical,
          execute: async (myInfo) => {
            // フィールドにいなければ効果なし
            if (myInfo.selectedEntities.every((target) => !target.isOnField)) {
              return false;
            }

            const destroyed = await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);

            if (!destroyed.length) {
              return false;
            }

            if (myInfo.data) {
              // このドローはタイミングを逃す要因になる
              await myInfo.activator.duel.clock.incrementProcSeq();
              await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
            }

            return true;
          },
          settle: async () => true,
        },
      ],
      substituteEffects: [
        {
          title: `${destroyNameDic[item.destroyType]}破壊体制付与`,
          playType: "ContinuousEffect",
          isMandatory: true,
          executableCells: monsterZoneCellTypes,
          executablePeriods: duelPeriodKeys,
          executableDuelistTypes: ["Controller"],
          isApplicableTo: (effect, destroyType, targets) => {
            console.log(effect, destroyType, targets);
            if (!effect.entity.isEffective) {
              return [];
            }
            if (destroyType !== item.destroyType) {
              return [];
            }

            console.log(
              effect,
              destroyType,
              targets,
              targets.filter((target) => target.controller === effect.entity.controller),
              targets.filter((target) => target.coLinkedEntities.length),
              targets.filter((target) => target.controller === effect.entity.controller).filter((target) => target.coLinkedEntities.length)
            );
            return targets.filter((target) => target.controller === effect.entity.controller).filter((target) => target.coLinkedEntities.length);
          },
          substitute: async (effect, destroyType, targets) => {
            console.log(effect, destroyType, targets);
            if (!effect.entity.isEffective) {
              return [];
            }
            if (destroyType !== item.destroyType) {
              return [];
            }
            const _targets = targets.filter((target) => target.controller === effect.entity.controller).filter((target) => target.coLinkedEntities.length);
            _targets.forEach((target) => {
              effect.entity.controller.writeInfoLog(
                `${effect.entity.toString()}の効果により${target.toString()}は${destroyNameDic[destroyType]}では破壊されない。`
              );
            });
            return _targets;
          },
        },
      ],
    };
  }
}

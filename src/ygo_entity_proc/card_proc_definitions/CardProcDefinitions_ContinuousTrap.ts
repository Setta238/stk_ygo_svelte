import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { duelEntityFaces, type DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { getMultiTargetsRebornActionPartical } from "../card_actions/CardActions";
import type { ImmediatelyAction } from "@ygo_duel/class/DuelEntityImmediatelyAction";
import { duelFieldCellTypes } from "@ygo_duel/class/DuelFieldCell";

export default function* generate(): Generator<EntityProcDefinition> {
  const props: Readonly<{
    name: string;
    pos: TBattlePosition;
    filter: (monster: DuelEntity) => boolean;
    targetImmdAction?: (
      action: ImmediatelyAction,
      ...args: Parameters<typeof ImmediatelyAction.prototype.execute>
    ) => ReturnType<typeof ImmediatelyAction.prototype.execute>;
  }>[] = [
    { name: "リビングデッドの呼び声", pos: "Attack", filter: () => true },
    { name: "エンジェル・リフト", pos: "Attack", filter: (monster) => (monster.lvl ?? 12) < 3 },
    { name: "正統なる血統", pos: "Attack", filter: (monster) => Boolean(monster.status.monsterCategories?.includes("Normal")) },
    { name: "蘇りし魂", pos: "Defense", filter: (monster) => Boolean(monster.status.monsterCategories?.includes("Normal")) },
    {
      name: "リミット・リバース",
      pos: "Attack",
      filter: (monster) => (monster.atk ?? 9999) <= 1000,
      targetImmdAction: async (action, monster) => {
        if (!monster) {
          return;
        }

        if (!monster.isOnFieldAsMonsterStrictly || monster.face === "FaceDown") {
          return "RemoveMe";
        }
        if (!action.entity.isEffective) {
          return;
        }
        if (monster.battlePosition === "Defense") {
          action.entity.controller.writeInfoLog(`${monster.toString()}が守備表示になったため、${action.entity.toString()}とともに破壊される。`);
          await DuelEntityShortHands.tryMarkForDestroy([monster, action.entity], { action, activator: action.entity.controller, selectedEntities: [monster] });
          return "RemoveMe";
        }
        return;
      },
    },
  ];

  for (const item of props) {
    yield {
      name: item.name,
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Quick",
          executableCells: ["SpellAndTrapZone"],
          executablePeriods: freeChainDuelPeriodKeys,
          executableDuelistTypes: ["Controller"],
          fixedTags: ["SpecialSummonFromGraveyard", "SpecialSummon"],
          ...getMultiTargetsRebornActionPartical(
            (myInfo) =>
              myInfo.activator
                .getGraveyard()
                .cardEntities.filter((card) => card.kind === "Monster")
                .filter(item.filter)
                .filter((card) => card.canBeTargetOfEffect(myInfo)),
            {
              posList: ["Attack"],
              afterExecute: async (isSucceed, myInfo) => {
                if (!isSucceed) {
                  return false;
                }
                if (!myInfo.selectedEntities.length) {
                  return false;
                }
                myInfo.action.entity.info.effectTargets[myInfo.action.seq] = myInfo.selectedEntities;
                return true;
              },
            },
          ),
          settle: async () => true,
        },
        defaultSpellTrapSetAction,
      ],
      immediatelyActions: [
        {
          title: "自壊",
          executableCells: duelFieldCellTypes,
          executablePeriods: duelPeriodKeys,
          executableFaces: duelEntityFaces,
          execute: async (action, triggerEntity, oldProps) => {
            if (
              item.targetImmdAction &&
              triggerEntity &&
              Object.values(action.entity.info.effectTargets)
                .flatMap((a) => a)
                .includes(triggerEntity)
            ) {
              item.targetImmdAction(action, triggerEntity, oldProps);
              return;
            }
            console.log(action.entity.toString(), action, triggerEntity, oldProps);
            if (triggerEntity !== action.entity) {
              return;
            }
            console.log(action.entity.toString(), action, triggerEntity, oldProps);
            if (!oldProps) {
              return;
            }

            console.log(action.entity.toString(), action, triggerEntity, oldProps);
            const targets = Object.values(oldProps.info.effectTargets).flatMap((a) => a);
            if (!targets.length) {
              return;
            }

            console.log(action.entity.toString(), action, triggerEntity, oldProps);
            const target = targets[0];
            if (
              target.isOnFieldAsMonsterStrictly &&
              target.face === "FaceUp" &&
              oldProps.status.isEffective &&
              oldProps.info.isEffectiveIn.includes(oldProps.cell.cellType)
            ) {
              // この場所では破壊マーキングまで実行。
              action.entity.controller.writeInfoLog(`${action.entity.toString()}がフィールドを離れたため、対象モンスター${target.toString()}を破壊。`);
              await DuelEntityShortHands.tryMarkForDestroy([target], { action, activator: action.entity.controller, selectedEntities: targets });
            }

            return undefined;
          },
        },
      ],
    };
  }
}

import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { defaultTargetMonstersRebornExecute, defaultTargetMonstersRebornPrepare } from "../card_actions/CardActions";
import type { ImmediatelyAction } from "@ygo_duel/class/DuelEntityImmediatelyAction";

export default function* generate(): Generator<EntityProcDefinition> {
  const props: Readonly<{
    name: string;
    pos: TBattlePosition;
    filter: (monster: DuelEntity) => boolean;
    targetImmdAction?: (action: ImmediatelyAction, ...args: Required<Parameters<typeof ImmediatelyAction.prototype.execute>>) => Promise<void | "RemoveMe">;
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
        if (!monster.isOnFieldAsMonsterStrictly || monster.face === "FaceDown") {
          return "RemoveMe";
        }
        if (!action.entity.isEffective) {
          return;
        }
        if (monster.battlePosition === "Defense") {
          action.entity.controller.writeInfoLog(`${monster.toString()}が守備表示になったため、${action.entity.toString()}とともに破壊される。`);
          await DuelEntityShortHands.tryMarkForDestory([monster, action.entity], { action, activator: action.entity.controller, selectedEntities: [monster] });
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
          canExecute: (myInfo) => {
            const cells = myInfo.activator.getMonsterZones();
            const list = myInfo.activator.getEnableSummonList(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              myInfo.activator
                .getGraveyard()
                .cardEntities.filter((card) => card.kind === "Monster")
                .filter(item.filter)
                .filter((card) => card.canBeTargetOfEffect(myInfo))
                .map((monster) => {
                  return { monster, posList: ["Attack"], cells };
                }),
              [],
              false
            );
            return list.length > 0;
          },
          prepare: (myInfo) =>
            defaultTargetMonstersRebornPrepare(
              myInfo,
              myInfo.activator
                .getGraveyard()
                .cardEntities.filter((card) => card.kind === "Monster")
                .filter(item.filter)
                .filter((card) => card.canBeTargetOfEffect(myInfo)),
              ["Attack"]
            ),
          execute: async (myInfo, chainBlockInfos) => {
            const flg = await defaultTargetMonstersRebornExecute(myInfo, chainBlockInfos, ["Attack"]);

            // 蘇生できなかった場合、無意味に残り続ける。
            if (!flg) {
              return false;
            }

            if (!myInfo.selectedEntities.length) {
              return false;
            }
            myInfo.action.entity.info.effectTargets[myInfo.action.seq] = myInfo.selectedEntities;
            return true;
          },
          settle: async () => true,
        },
        defaultSpellTrapSetAction,
      ],
      immediatelyActions: [
        {
          title: "自壊",
          executableCells: ["SpellAndTrapZone"],
          executablePeriods: duelPeriodKeys,
          executableFaces: ["FaceUp"],
          execute: async (action, triggerEntity, moveParam) => {
            if (!moveParam) {
              return;
            }
            const targets = Object.values(action.entity.info.effectTargets).flatMap((a) => a);

            if (!targets.length) {
              return;
            }
            const target = targets[0];
            if (triggerEntity === action.entity) {
              if (target.isOnFieldStrictly && target.face === "FaceUp" && action.entity.isEffective && !moveParam.to.isSpellTrapZoneLikeCell) {
                // この場所では破壊マーキングまで実行。
                action.entity.controller.writeInfoLog(`${action.entity.toString()}がフィールドを離れたため、対象モンスター${target.toString()}を破壊。`);
                await DuelEntityShortHands.tryMarkForDestory([target], { action, activator: action.entity.controller, selectedEntities: targets });
              }

              return "RemoveMe";
            } else if (triggerEntity === target && item.targetImmdAction) {
              item.targetImmdAction(action, triggerEntity, moveParam);
            }
            return undefined;
          },
        },
      ],
    };
  }
}

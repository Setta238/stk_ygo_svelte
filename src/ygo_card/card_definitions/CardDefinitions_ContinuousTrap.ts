import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_card/card_actions/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { CardDefinition } from "@ygo_card/class/DuelCardDefinition";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { ChainBlockInfo } from "@ygo_duel/class/DuelCardAction";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { defaultTargetMonstersRebornExecute, defaultTargetMonstersRebornPrepare } from "../card_actions/DefaultCardAction";

export default function* generate(): Generator<CardDefinition> {
  yield* (
    [
      { name: "リビングデッドの呼び声", pos: "Attack", filter: () => true },
      { name: "エンジェル・リフト", pos: "Attack", filter: (monster) => (monster.lvl ?? 12) < 3 },
      { name: "正統なる血統", pos: "Attack", filter: (monster) => monster.status.monsterCategories?.includes("Normal") },
      { name: "蘇りし魂", pos: "Defense", filter: (monster) => monster.status.monsterCategories?.includes("Normal") },
      {
        name: "リミット・リバース",
        pos: "Attack",
        filter: (monster) => (monster.atk ?? 9999) <= 1000,
        onMonsterAfterMove: async (myInfo, monster) => {
          if (!monster.isOnFieldAsMonsterStrictly || monster.face === "FaceDown") {
            return "RemoveMe";
          }
          if (!myInfo.action.entity.isEffective) {
            return;
          }
          if (monster.battlePosition === "Defense") {
            myInfo.action.entity.controller.writeInfoLog(`${monster.toString()}が守備表示になったため、${myInfo.action.entity.toString()}とともに破壊される。`);
            await DuelEntityShortHands.tryMarkForDestory([monster, myInfo.action.entity], myInfo);
            return "RemoveMe";
          }
          return;
        },
      },
    ] as Readonly<{
      name: string;
      pos: TBattlePosition;
      filter: (monster: DuelEntity) => boolean;
      onMonsterAfterMove?: (myInfo: ChainBlockInfo<unknown>, data: DuelEntity) => Promise<void | "RemoveMe">;
    }>[]
  ).map((item): CardDefinition => {
    return {
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
          // 墓地に蘇生可能モンスター、場に空きが必要。
          validate: (myInfo) => {
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
            if (!list.length) {
              return;
            }
            return defaultSpellTrapValidate(myInfo);
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
          execute: async (myInfo) => {
            const flg = await defaultTargetMonstersRebornExecute(myInfo, ["Attack"]);

            // 蘇生できなかった場合、無意味に残り続ける。
            if (!flg) {
              return false;
            }

            if (!myInfo.selectedEntities.length) {
              return false;
            }
            myInfo.action.entity.info.effectTargets[myInfo.action.seq] = myInfo.selectedEntities;
            // 自身が場を離れる場合のイベント
            myInfo.action.entity.onBeforeMove.append(async (data) => {
              if (data.entity.face !== "FaceUp" || !data.entity.isOnFieldAsSpellTrapStrictly) {
                return "RemoveMe";
              }

              const targets = Object.values(data.entity.info.effectTargets).flatMap((a) => a);
              const [to] = data.args;

              if (!targets.length) {
                return "RemoveMe";
              }

              const target = targets[0];

              if (target.isOnFieldStrictly && target.face === "FaceUp" && data.entity.isEffective && !to.isSpellTrapZoneLikeCell) {
                // この場所では破壊マーキングまで実行。
                data.entity.controller.writeInfoLog(`${myInfo.action.entity.toString()}がフィールドを離れたため、対象モンスター${target.toString()}を破壊。`);
                await DuelEntityShortHands.tryMarkForDestory([target], myInfo);
              }

              return "RemoveMe";
            });

            const target = myInfo.selectedEntities[0];
            // 対象が破壊される場合のイベント
            target.onBeforeMove.append(async (data) => {
              if (data.entity.face !== "FaceUp" || !data.entity.isOnFieldAsMonsterStrictly) {
                return "RemoveMe";
              }

              const [, , , , , movedAs] = data.args;

              if (
                myInfo.action.entity.isOnFieldStrictly &&
                myInfo.action.entity.face === "FaceUp" &&
                data.entity.isEffective &&
                movedAs.union(["EffectDestroy", "RuleDestroy"]).length
              ) {
                // この場所では破壊マーキングまで実行。
                myInfo.activator.writeInfoLog(`${data.entity.toString()}が破壊されたため、${myInfo.action.entity.toString()}を破壊。`);
                await DuelEntityShortHands.tryMarkForDestory([target], myInfo);
              }

              return "RemoveMe";
            });

            //固有状態
            target.onAfterMove.append(async (monster) => (item.onMonsterAfterMove ? await item.onMonsterAfterMove(myInfo, monster) : "RemoveMe"));

            return true;
          },
          settle: async () => true,
        },
        defaultSpellTrapSetAction,
      ],
    };
  });
}

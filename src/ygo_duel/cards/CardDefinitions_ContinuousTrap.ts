import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/cards/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { CardDefinition } from "./CardDefinitions";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { CardActionDefinition, ChainBlockInfo } from "@ygo_duel/class/DuelCardAction";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";

export const createCardDefinitions_ContinuousTrap = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  (
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
          if (!monster.isOnFieldAsMonster || monster.face === "FaceDown") {
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
  ).forEach((item) =>
    result.push({
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
            if (
              !myInfo.action.entity.field
                .getCells("Graveyard")
                .flatMap((cell) => cell.cardEntities)
                .filter((card) => card.status.kind === "Monster")
                .filter(item.filter)
                .filter((card) => card.info.isRebornable)
                .filter((card) => card.canBeTargetOfEffect(myInfo))
                .filter((card) => card.canBeSummoned(myInfo.activator, myInfo.action, "SpecialSummon", item.pos, [], false))
                .some((card) => myInfo.activator.canSummon(myInfo.activator, card, myInfo.action, "SpecialSummon", item.pos, []))
            ) {
              return;
            }
            if (myInfo.activator.getAvailableMonsterZones().length === 0) {
              return;
            }

            return defaultSpellTrapValidate(myInfo);
          },
          prepare: async (myInfo) => {
            const targets = await myInfo.action.entity.field.duel.view.waitSelectEntities(
              myInfo.activator,
              myInfo.activator
                .getGraveyard()
                .cardEntities.filter((card) => card.status.kind === "Monster")
                .filter(item.filter)
                .filter((card) => card.info.isRebornable)
                .filter((card) => card.canBeTargetOfEffect(myInfo))
                .filter((card) => card.canBeSummoned(myInfo.activator, myInfo.action, "SpecialSummon", item.pos, [], false))
                .filter((card) => myInfo.activator.canSummon(myInfo.activator, card, myInfo.action, "SpecialSummon", item.pos, [])),
              1,
              (list) => list.length === 1,
              "蘇生対象とするモンスターを選択",
              false
            );
            if (!targets) {
              throw new IllegalCancelError(myInfo);
            }

            myInfo.action.entity.info.effectTargets[myInfo.action.seq] = targets;
            return { selectedEntities: targets, chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
          },
          execute: async (myInfo) => {
            const emptyCells = myInfo.activator.getEmptyMonsterZones();
            const target = myInfo.selectedEntities[0];
            //発動後に移動していた場合、無意味に残り続ける。
            if (target.wasMovedAfter(myInfo.isActivatedAt)) {
              myInfo.action.entity.info.effectTargets = [];
              return false;
            }

            await myInfo.activator.summon(target, [item.pos], emptyCells, "SpecialSummon", ["Effect"], myInfo.action.entity, false);

            // 自身が場を離れる場合のイベント
            myInfo.action.entity.onBeforeMove.append(async (data) => {
              if (data.entity.face !== "FaceUp" || !data.entity.isOnFieldAsSpellTrap) {
                return "RemoveMe";
              }
              console.log(data.entity.toString(), data.entity);

              const [to] = data.args;

              if (target.isOnField && target.face === "FaceUp" && data.entity.isEffective && !to.isSpellTrapZoneLikeCell) {
                console.log(myInfo.action.entity.toString());
                // この場所では破壊マーキングまで実行。
                data.entity.controller.writeInfoLog(`${myInfo.action.entity.toString()}がフィールドを離れたため、対象モンスター${target.toString()}を破壊。`);
                await DuelEntityShortHands.tryMarkForDestory([target], myInfo);
              }

              return "RemoveMe";
            });
            // 対象が破壊される場合のイベント
            target.onBeforeMove.append(async (data) => {
              if (data.entity.face !== "FaceUp" || !data.entity.isOnFieldAsMonster) {
                return "RemoveMe";
              }
              console.log(data.entity.toString(), data.entity);

              const [, , , , , movedAs] = data.args;

              if (
                myInfo.action.entity.isOnField &&
                myInfo.action.entity.face === "FaceUp" &&
                data.entity.isEffective &&
                movedAs.union(["EffectDestroy", "RuleDestroy"]).length
              ) {
                console.log(myInfo.action.entity.toString());
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
        defaultSpellTrapSetAction as CardActionDefinition<unknown>,
      ],
    })
  );
  return result;
};

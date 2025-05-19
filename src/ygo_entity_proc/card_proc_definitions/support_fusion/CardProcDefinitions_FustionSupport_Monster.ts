import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultPayLifePoint, defaultPrepare } from "@ygo_entity_proc/card_actions/CommonCardAction";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { duelFieldCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { executableDuelistTypes } from "@ygo_duel/class/DuelEntityAction";
import { IllegalCancelError, SystemError } from "@ygo_duel/class/Duel";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "魔導サイエンティスト",
    actions: [
      {
        title: "特殊召喚",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        canPayCosts: (myInfo) => myInfo.activator.lp >= 1000,
        canExecute: (myInfo) => {
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getExtraDeck()
              .cardEntities.filter((card) => card.status.monsterCategories?.includes("Fusion"))
              .filter((card) => card.lvl && card.lvl < 7)
              .map((monster) => {
                return { monster, posList: faceupBattlePositions, cells };
              }),
            [],
            false
          );
          return list.length > 0;
        },
        payCosts: (myInfo, chainBlockInfos) => defaultPayLifePoint(myInfo, chainBlockInfos, 1000),
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromExtraDeck"], prepared: undefined };
        },
        execute: async (myInfo) => {
          const cells = myInfo.activator.getMonsterZones();
          const summoned = await myInfo.activator.summonOne(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getExtraDeck()
              .cardEntities.filter((card) => card.status.monsterCategories?.includes("Fusion"))
              .filter((card) => card.lvl && card.lvl < 7)
              .map((monster) => {
                return { monster, posList: faceupBattlePositions, cells };
              }),
            [],
            false,
            false
          );

          console.log(summoned, summoned?.toString());

          if (!summoned) {
            return false;
          }
          console.log(summoned.toString(), summoned.procFilterBundle.effectiveOperators.length);
          summoned.procFilterBundle.push(
            ProcFilter.createLingering(
              "直接攻撃不可",
              () => true,
              myInfo.action.entity,
              myInfo.action,
              (ope, target) => target.face === "FaceUp" && target.isOnFieldAsMonsterStrictly,
              ["BattleTarget"],
              (bundleOwner, activator, monster, attr, targets) => {
                if (bundleOwner !== monster) {
                  return true;
                }
                return targets.every((target) => target.entityType !== "Duelist");
              }
            )
          );
          console.log(summoned.toString(), summoned.procFilterBundle.effectiveOperators.length);

          summoned.counterHolder.setCurfewFlg(myInfo.action.entity);

          return true;
        },
        settle: async () => true,
      },
      {
        title: "自発帰還",
        isMandatory: true,
        playType: "LingeringEffect",
        spellSpeed: "Normal",
        executableCells: duelFieldCellTypes,
        executablePeriods: ["end"],
        executableDuelistTypes,
        canExecute: (myInfo) => myInfo.action.entity.field.getMonstersOnFieldStrictly().some((card) => card.counterHolder.getCurfewFlg(myInfo.action.entity)),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.action.entity.field.getMonstersOnFieldStrictly().filter((card) => card.counterHolder.getCurfewFlg(myInfo.action.entity));
          if (!cards.length) {
            throw new SystemError("想定されない状態", myInfo);
          }

          let card = cards[0];

          if (cards.length > 1) {
            const selected = await myInfo.activator.waitSelectEntity(cards, "帰還させるカードを選択。", false);
            if (!selected) {
              throw new IllegalCancelError(myInfo);
            }

            card = selected;
          }

          await card.returnToDeck("Bottom", ["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

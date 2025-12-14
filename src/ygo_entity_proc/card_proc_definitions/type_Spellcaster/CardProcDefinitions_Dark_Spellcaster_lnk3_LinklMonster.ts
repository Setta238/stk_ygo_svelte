import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { defaultPrepare, getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CardActions";
import { getDefaultLinkSummonAction } from "@ygo_entity_proc/card_actions/CardActions_LinkMonster";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "サモン・ソーサレス[エラッタ前]",
    actions: [
      getDefaultLinkSummonAction(
        (selected) =>
          selected.length > 1 &&
          selected.every((entity) => entity.entityType !== "Token") &&
          selected
            .flatMap((entity) => entity.types)
            .getDistinct()
            .some((type) => selected.every((entity) => entity.types.includes(type)))
      ),
      {
        title: "①送りつけ",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["ExtraMonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromHand"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenArrivalNow(["LinkSummon"]),
        canExecute: (myInfo) => {
          const monsters = myInfo.activator.getHandCell().cardEntities.filter((card) => card.kind === "Monster");
          const cells = myInfo.action.entity.linkArrowDests.filter((cell) => cell.owner === myInfo.activator.getOpponentPlayer());
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            monsters.map((monster) => {
              return {
                monster,
                cells,
                posList: ["Defense"],
              };
            }),
            [],
            false
          );
          return list.length > 0;
        },
        prepare: defaultPrepare,
        execute: async (myInfo): Promise<boolean> => {
          const monsters = myInfo.activator.getHandCell().cardEntities.filter((card) => card.kind === "Monster");
          const cells = myInfo.action.entity.linkArrowDests.filter((cell) => cell.owner === myInfo.activator.getOpponentPlayer());
          const monster = await myInfo.activator.summonOne(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            monsters.map((monster) => {
              return {
                monster,
                cells,
                posList: ["Defense"],
              };
            }),
            [],
            false,
            false
          );
          if (!monster) {
            return false;
          }
          return true;
        },
        settle: async () => true,
      },
      {
        title: "②リクルート",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["ExtraMonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromDeck"],
        isOnlyNTimesPerTurn: 1,
        ...getSingleTargetActionPartical(
          (myInfo) => {
            // 空きセル
            const cells = myInfo.action.entity.linkArrowDests.filter((cell) => cell.isAvailable);
            if (!cells.length) {
              return [];
            }

            // リンク先モンスター
            const linkArrowDestsMonsters = myInfo.action.entity.linkArrowDests.flatMap((cell) => cell.cardEntities);
            if (!linkArrowDestsMonsters.length) {
              return [];
            }

            // 候補となる種族
            let types = linkArrowDestsMonsters.flatMap((monster) => monster.types);

            // デッキ内のモンスター
            const deckMonsters = myInfo.activator.getDeckCell().cardEntities.filter((card) => card.types.union(types).length);

            const list = myInfo.activator.getEnableSummonList(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              deckMonsters.map((monster) => {
                return {
                  monster,
                  cells,
                  posList: ["Defense"],
                };
              }),
              [],
              false
            );

            types = list.flatMap((sc) => sc.monster.types).getDistinct();

            return linkArrowDestsMonsters.filter((target) => types.some((type) => target.types.includes(type)));
          },
          { tags: ["SpecialSummonFromHand"] }
        ),
        execute: async (myInfo) => {
          // 空きセル
          const cells = myInfo.action.entity.linkArrowDests.filter((cell) => cell.isAvailable);
          if (!cells.length) {
            return false;
          }

          // 候補となる種族
          const types = myInfo.selectedEntities.flatMap((monster) => monster.types);
          if (!types.length) {
            return false;
          }

          const monsters = myInfo.activator.getDeckCell().cardEntities.filter((monster) => monster.types.union(types).length);

          const monster = await myInfo.activator.summonOne(
            myInfo.activator,
            "SpecialSummon",
            ["Effect", "NonEffectiveSummon"],
            myInfo.action,
            monsters.map((monster) => {
              return {
                monster,
                cells,
                posList: ["Defense"],
              };
            }),
            [],
            false,
            false
          );

          if (!monster) {
            return false;
          }

          monster.statusOperatorBundle.push(
            new StatusOperator({
              title: "効果無効",
              validateAlive: () => true,
              isContinuous: false,
              isSpawnedBy: myInfo.action.entity,
              actionAttr: myInfo.action,
              isApplicableTo: (operator, target) => target.isOnFieldAsMonsterStrictly && target.face === "FaceUp",
              statusCalculator: () => {
                return { isEffective: false };
              },
            })
          );

          return Boolean(monster);
        },
        settle: async () => true,
      },
    ],
  };
}

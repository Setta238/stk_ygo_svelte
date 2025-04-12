import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { defaultAttackAction, defaultSummonFilter } from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "@ygo_duel/cards/CardDefinitions";
import { getDefaultLinkSummonAction } from "@ygo_duel/cards/DefaultCardAction_LinkMonster";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { damageStepPeriodKeys, duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import type DuelFieldCell from "@ygo_duel_view/components/DuelFieldCell.svelte";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultSpellTrapValidate } from "../DefaultCardAction_Spell";
import { defaultTargetMonstersRebornExecute, defaultTargetMonstersRebornPrepare } from "../DefaultCardAction";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";

export const createCardDefinitions_Firewall_LinkMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
    name: "ファイアウォール・ドラゴン・シンギュラリティ",
    actions: [
      defaultAttackAction,
      getDefaultLinkSummonAction((selected) => selected.length > 2),
      {
        title: "①バウンス＆自己強化",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        validate: (myInfo): DuelFieldCell[] | undefined => {
          const categories = [...myInfo.activator.getGraveyard().cardEntities, ...myInfo.activator.getMonstersOnField()]
            .flatMap((monster) => monster.status.monsterCategories ?? [])
            .getDistinct();
          const maxQty = categories.union(["Ritual", "Fusion", "Syncro", "Xyz"]).length;

          if (maxQty < 1) {
            return;
          }
          const choices = [
            ...myInfo.activator.getOpponentPlayer().getGraveyard().cardEntities,
            ...myInfo.activator.getOpponentPlayer().getEntiteisOnField(),
          ].filter((entity) => entity.canBeTargetOfEffect(myInfo));

          return choices.length ? [] : undefined;
        },
        prepare: async (myInfo) => {
          const categories = [...myInfo.activator.getGraveyard().cardEntities, ...myInfo.activator.getMonstersOnField()]
            .flatMap((monster) => monster.status.monsterCategories ?? [])
            .getDistinct();
          const maxQty = categories.union(["Ritual", "Fusion", "Syncro", "Xyz"]).length;

          if (maxQty < 1) {
            return;
          }
          const choices = [
            ...myInfo.activator.getOpponentPlayer().getGraveyard().cardEntities,
            ...myInfo.activator.getOpponentPlayer().getEntiteisOnField(),
          ].filter((entity) => entity.canBeTargetOfEffect(myInfo));

          if (choices.length < 1) {
            return;
          }
          const selectedEntities =
            (await myInfo.action.entity.duel.view.waitSelectEntities(
              myInfo.activator,
              choices,
              undefined,
              (selected) => selected.length > 0 && selected.length <= maxQty,
              "手札に戻すカードを選択。",
              false
            )) ?? [];

          if (!selectedEntities.length) {
            return;
          }
          return { selectedEntities, chainBlockTags: [], prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
          const targets = myInfo.selectedEntities
            .filter((card) => card.isOnField || card.fieldCell.cellType === "Graveyard")
            .filter((card) => card.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action));
          await DuelEntity.returnManyToHandForTheSameReason(targets, ["Effect"], myInfo.action.entity, myInfo.activator);

          const qty = targets.filter((card) => card.fieldCell.cellType === "Hand" || card.fieldCell.cellType === "ExtraDeck").length;

          myInfo.action.entity.numericOprsBundle.push(
            NumericStateOperator.createLingeringAddition(
              myInfo.action.title,
              (operator) => operator.isSpawnedBy.isEffective,
              myInfo.action.entity,
              myInfo.action,
              "attack",
              (spawner: DuelEntity, monster: DuelEntity, current: number) => current + 500 * qty
            )
          );

          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<undefined>,
      {
        title: "②蘇生",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        validate: (myInfo) => {
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((monster) => monster.types.includes("Cyberse"))
              .filter((card) => card.canBeTargetOfEffect(myInfo))
              .map((monster) => {
                return { monster, posList: faceupBattlePositions, cells };
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
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((monster) => monster.types.includes("Cyberse"))
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
            faceupBattlePositions
          ),
        execute: async (myInfo) => defaultTargetMonstersRebornExecute(myInfo, faceupBattlePositions),
        settle: async () => true,
      } as CardActionDefinition<unknown>,
    ] as CardActionDefinition<unknown>[],
    defaultSummonFilter: defaultSummonFilter,
  });

  return result;
};

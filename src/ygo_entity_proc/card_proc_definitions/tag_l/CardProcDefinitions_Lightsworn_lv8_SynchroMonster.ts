import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { getPayBanishCostsActionPartical } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Banish";

import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { IllegalCancelError, DuelError } from "@ygo_duel/class_error/DuelError";

import { getDefaultSynchroSummonAction } from "@ygo_entity_proc/card_actions/CardActions_SynchroMonster";
import { createBroadRegularProcFilterHandler } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ライトロード・アテナ ミネルバ",
    actions: [
      getDefaultSynchroSummonAction(),
      {
        title: `①墓地送り`,
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurn: 1,
        fixedTags: ["SendToGraveyardFromDeck"],
        triggerPattern: { triggerType: "Arrival", arrivalReasons: ["SynchroSummon"] },
        canExecute: (myInfo) =>
          myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .some((monster) => monster.status.nameTags?.includes("ライトロード")) &&
          myInfo.action.entity.info.materials
            .map((info) => info.material)
            .filter((card) => card.kind === "Monster")
            .some((monster) => monster.status.nameTags?.includes("ライトロード")),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const choices = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((card) => card.status.nameTags?.includes("ライトロード"));
          if (!choices.length) {
            return false;
          }

          const qtyUpperBound = myInfo.action.entity.info.materials
            .map((info) => info.material)
            .filter((card) => card.kind === "Monster")
            .filter((monster) => monster.status.nameTags?.includes("ライトロード")).length;

          const qty = qtyUpperBound === 1 ? 1 : undefined;

          const monsters = await myInfo.activator.waitSelectEntities(
            choices,
            qty,
            (selected) =>
              selected.length > 0 && selected.length <= qtyUpperBound && selected.length === selected.flatMap((card) => card.types).getDistinct().length,
            "墓地に送るカードを選択",
            false
          );
          if (!monsters) {
            throw new IllegalCancelError(myInfo);
          }
          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(monsters, ["Effect"], myInfo.action.entity, myInfo.activator);

          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
      {
        title: `③墓地送り`,
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurn: 1,
        needsToPayRegularCost: true,
        fixedTags: ["SendToGraveyardFromDeck"],
        ...getPayBanishCostsActionPartical(
          (myInfo) =>
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((monster) => monster.status.nameTags?.includes("ライトロード")),
          (selected, myInfo) => selected.length > 0 && selected.length < 5 && selected.length <= myInfo.activator.getDeckCell().cardEntities.length,
          1,
          4
        ),
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const qty = myInfo.costInfo.banish?.length ?? 0;
          if (!qty) {
            throw new DuelError(`${myInfo.action.entity}の効果を不正な方法で実行しようとした。${myInfo.costInfo}`);
          }

          const cards = myInfo.activator.getDeckCell().cardEntities.slice(0, qty);

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [
      createBroadRegularProcFilterHandler("②除外不可", "Monster", (entity) => {
        return [
          ProcFilter.createContinuous(
            "②除外不可",
            (operator) => operator.isSpawnedBy.isOnFieldStrictly && operator.isSpawnedBy.face === "FaceUp",
            entity,
            (operator, target) =>
              target.controller === operator.isSpawnedBy.controller &&
              Boolean(target.status.nameTags?.includes("ライトロード")) &&
              target.isOnFieldAsMonsterStrictly &&
              target.face === "FaceUp",
            ["BanishAsEffect"],
            () => false
          ),
        ];
      }),
    ],
  };
}

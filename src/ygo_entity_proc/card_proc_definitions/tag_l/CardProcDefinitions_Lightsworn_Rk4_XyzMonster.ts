import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { getDefaultXyzSummonAction, getPayXyzCostActionPartical } from "@ygo_entity_proc/card_actions/CardActions_XyzMonster";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ライトロード・セイント ミネルバ",
    actions: [
      getDefaultXyzSummonAction(2, 2),
      {
        title: `①墓地送り＆ドロー`,
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        fixedTags: ["SendToGraveyardFromDeck"],
        isOnlyNTimesPerTurn: 1,
        ...getPayXyzCostActionPartical(),
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 2,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities.slice(0, 3);

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);

          const qty = cards.filter((card) => card.kind === "Monster").filter((monster) => monster.status.nameTags?.includes("ライトロード")).length;

          if (qty) {
            await myInfo.activator.draw(qty, myInfo.action.entity, myInfo.activator);
          }

          return true;
        },
        settle: async () => true,
      },
      {
        title: "②墓地送り＆破壊",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Departure", needsByBattle: true, needsByEffect: true, needsByOpponent: true, needsByDestory: true },
        fixedTags: ["SendToGraveyardFromDeck"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 2,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities.slice(0, 3);

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);

          const qtyUpperBound = cards.filter((card) => card.kind === "Monster").filter((monster) => monster.status.nameTags?.includes("ライトロード")).length;

          if (qtyUpperBound) {
            const qty = qtyUpperBound === 1 ? 1 : undefined;
            const targets =
              (await myInfo.activator.waitSelectEntities(
                myInfo.action.entity.field.getCardsOnFieldStrictly(),
                qty,
                (selected) => selected.length <= qtyUpperBound,
                "カードを破壊する場合、破壊するカードを選択。",
                true
              )) ?? [];
            if (targets.length) {
              await DuelEntityShortHands.tryDestroy(targets, myInfo);
            }
          }

          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

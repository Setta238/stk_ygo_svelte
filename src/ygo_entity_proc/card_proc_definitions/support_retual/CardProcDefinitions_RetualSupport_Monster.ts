import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import type { TCardKind } from "@ygo/class/YgoTypes";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";

export default function* generate(): Generator<EntityProcDefinition> {
  for (const item of [
    { name: "マンジュ・ゴッド", kinds: ["Monster", "Spell"] },
    { name: "センジュ・ゴッド", kinds: ["Monster"] },
    { name: "ソニックバード", kinds: ["Spell"] },
  ] as { name: string; kinds: TCardKind[] }[]) {
    yield {
      name: item.name,
      actions: [
        {
          title: "①儀式サーチ",
          isMandatory: false,
          playType: "TriggerEffect",
          spellSpeed: "Normal",
          executableCells: ["MonsterZone"],
          executablePeriods: freeChainDuelPeriodKeys,
          executableDuelistTypes: ["Controller"],
          fixedTags: ["SearchFromDeck"],
          meetsConditions: (myInfo) => myInfo.action.entity.hasBeenArrivalNow(["NormalSummon", "FlipSummon"]),
          canExecute: (myInfo) =>
            myInfo.activator.canAddToHandFromDeck &&
            myInfo.activator
              .getDeckCell()
              .cardEntities.filter((card) => item.kinds.includes(card.kind))
              .some((card) => card.status.spellCategory === "Ritual" || card.status.monsterCategories?.includes("Ritual")),
          prepare: defaultPrepare,
          execute: async (myInfo) => {
            if (!myInfo.activator.canAddToHandFromDeck) {
              return false;
            }
            const cards = myInfo.activator
              .getDeckCell()
              .cardEntities.filter((card) => item.kinds.includes(card.kind))
              .filter((card) => card.status.spellCategory === "Ritual" || card.status.monsterCategories?.includes("Ritual"));

            if (!cards.length) {
              return false;
            }

            const card = await myInfo.activator.waitSelectEntity(cards, "手札に加えるカードを選択", false);
            if (!card) {
              throw new IllegalCancelError(myInfo, cards);
            }
            await card.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
            myInfo.activator.getDeckCell().shuffle();

            return true;
          },
          settle: async () => true,
        },
      ],
    };
  }
}

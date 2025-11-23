import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultCanPayDiscardCosts, defaultPayDiscardCosts } from "@ygo_entity_proc/card_actions/CardActions";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ソーラー・エクスチェンジ",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["Draw", "SendToGraveyardFromDeck", "DiscordAsCost"],
        priorityForNPC: 40,
        canPayCosts: (...args) =>
          defaultCanPayDiscardCosts(...args, (card) => card.kind === "Monster" && Boolean(card.status.nameTags?.includes("ライトロード"))),
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 3,
        payCosts: (...args) => defaultPayDiscardCosts(...args, (card) => card.kind === "Monster" && Boolean(card.status.nameTags?.includes("ライトロード"))),
        prepare: async () => {
          return { selectedEntities: [] };
        },
        execute: async (myInfo) => {
          await myInfo.activator.draw(2, myInfo.action.entity, myInfo.activator);

          myInfo.activator.duel.clock.incrementProcSeq();

          const cards = myInfo.activator.getDeckCell().cardEntities.slice(0, 2);

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "光の援軍",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SearchFromDeck", "SendToGraveyardFromDeck"],
        priorityForNPC: 40,
        canPayCosts: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 3,
        canExecute: (myInfo) =>
          myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((entity) => (entity.lvl ?? 13) < 5)
            .some((entity) => entity.status.nameTags && entity.status.nameTags.includes("ライトロード")),
        payCosts: async (myInfo) => {
          const costs = myInfo.activator.getDeckCell().cardEntities.slice(0, 3);

          const costInfos = costs.map((cost) => ({ cost, cell: cost.cell }));

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(costs, ["Cost"], myInfo.action.entity, myInfo.activator);

          return { sendToGraveyard: costInfos };
        },
        prepare: async () => {
          return { selectedEntities: [] };
        },
        execute: async (myInfo) => {
          const monsters = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((entity) => entity.kind === "Monster")
            .filter((entity) => (entity.lvl ?? 13) < 5)
            .filter((entity) => entity.status.nameTags && entity.status.nameTags.includes("ライトロード"));
          if (monsters.length === 0) {
            return false;
          }
          const target = await myInfo.activator.waitSelectEntity(monsters, "手札に加えるモンスターを選択", false);
          if (!target) {
            throw new IllegalCancelError(myInfo);
          }
          await target.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPrepare, getPayReleaseCostActionPartical } from "@ygo_entity_proc/card_actions/CommonCardAction";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import type { CardActionDefinition } from "@ygo_duel/class/DuelEntityAction";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "おろかな埋葬",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        priorityForNPC: 40,
        fixedTags: ["SendToGraveyardFromDeck"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.kind === "Monster"),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const monsters = myInfo.activator.getDeckCell().cardEntities.filter((entity) => entity.kind === "Monster");
          if (monsters.length === 0) {
            return false;
          }
          const target = await myInfo.activator.waitSelectEntity(monsters, "墓地に送るモンスターを選択", false);
          if (!target) {
            throw new IllegalCancelError(myInfo);
          }
          await target.sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "おろかな副葬",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        priorityForNPC: 40,
        fixedTags: ["SendToGraveyardFromDeck"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.kind !== "Monster"),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const monsters = myInfo.activator.getDeckCell().cardEntities.filter((entity) => entity.kind !== "Monster");
          if (monsters.length === 0) {
            return false;
          }
          const target = await myInfo.activator.waitSelectEntity(monsters, "墓地に送る魔法罠を選択", false);
          if (!target) {
            throw new IllegalCancelError(myInfo);
          }
          await target.sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "苦渋の選択",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        priorityForNPC: 40,
        fixedTags: ["SendToGraveyardFromDeck", "SearchFromDeck"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 4,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities;
          if (cards.length < 5) {
            return false;
          }
          const list = await myInfo.activator.waitSelectEntities(cards, 5, (selected) => selected.length === 5, "相手に見せるカードを選択。", false);
          if (!list) {
            throw new IllegalCancelError(myInfo);
          }

          const selected = await myInfo.activator.getOpponentPlayer().waitSelectEntity(list, "手札に加えさせるカードを選択。", false);
          if (!selected) {
            throw new IllegalCancelError(myInfo, list);
          }

          myInfo.activator.writeInfoLog(`${myInfo.activator.getOpponentPlayer().name}は${selected.toString()}を選択。`);

          //選択したカードを手札に加える
          await selected.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(
            list.filter((card) => card !== selected),
            ["Effect"],
            myInfo.action.entity,
            myInfo.activator
          );

          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };

  for (const name of ["モンスターゲート", "名推理"]) {
    let tmp: CardActionDefinition<unknown> = {
      title: "発動",
      isMandatory: false,
      playType: "CardActivation",
      spellSpeed: "Normal",
      executableCells: ["Hand", "SpellAndTrapZone"],
      executablePeriods: ["main1", "main2"],
      executableDuelistTypes: ["Controller"],
      fixedTags: ["SpecialSummonFromDeck", "SendToGraveyardFromDeck", "SpecialSummon"],
      canExecute: (myInfo) =>
        myInfo.activator
          .getDeckCell()
          .cardEntities.filter((card) => card.kind === "Monster")
          .some((card) => !card.status.monsterCategories?.includes("SpecialSummon")),
      prepare: defaultPrepare,
      execute: async (myInfo) => {
        if (!myInfo.activator.getDeckCell().cardEntities.length) {
          return false;
        }
        if (!myInfo.activator.getAvailableMonsterZones().length) {
          return false;
        }

        let lvl = -1;

        if (name === "名推理") {
          const _lvl = await myInfo.activator.getOpponentPlayer().waitSelectNumberFromRange("レベルを選択", 1, 12, false);
          if (_lvl === undefined) {
            throw new IllegalCancelError(myInfo);
          }
          lvl = _lvl;
          myInfo.activator.writeInfoLog(`${myInfo.activator.getOpponentPlayer().name}は${lvl}を選択。`);
        }

        const deckCards = [...myInfo.activator.getDeckCell().cardEntities];

        for (const card of myInfo.activator.getDeckCell().cardEntities) {
          await card.excavate(["Effect"], myInfo.action.entity, myInfo.activator);
          if (card.kind !== "Monster") {
            await card.sendToGraveyard(["Effect", "Excavate"], myInfo.action.entity, myInfo.activator);
            continue;
          }
          if (card.status.monsterCategories?.includes("SpecialSummon")) {
            await card.sendToGraveyard(["Effect", "Excavate"], myInfo.action.entity, myInfo.activator);
            continue;
          }
          if (card.status.monsterCategories?.includes("NormalSummonOnly")) {
            await card.sendToGraveyard(["Effect", "Excavate"], myInfo.action.entity, myInfo.activator);
            myInfo.activator.writeInfoLog(`${card.toString()}は通常召喚可能だが特殊召喚できないため、墓地に送られた。`);
            return false;
          }
          if (card.lvl === lvl) {
            await card.sendToGraveyard(["Effect", "Excavate"], myInfo.action.entity, myInfo.activator);
            myInfo.activator.writeInfoLog(`${card.toString()}のレベルは${lvl}のため、墓地に送られた。`);
            return false;
          }
          const monster = await myInfo.activator.summon(
            "SpecialSummon",
            ["Effect", "Excavate"],
            myInfo.action,
            card,
            faceupBattlePositions,
            myInfo.activator.getAvailableMonsterZones(),
            [],
            false
          );
          return Boolean(monster);
        }
        myInfo.activator.writeInfoLog(`通常召喚可能なモンスターがめくられなかったため、全てのカードをデッキに戻す。`);

        await DuelEntityShortHands.returnManyToDeckForTheSameReason("Random", deckCards, ["Effect"], myInfo.action.entity, myInfo.activator);

        return false;
      },
      settle: async () => true,
    };
    if (name === "モンスターゲート") {
      tmp = { ...tmp, ...getPayReleaseCostActionPartical() };
    }
    yield { name, actions: [tmp, defaultSpellTrapSetAction] };
  }
}

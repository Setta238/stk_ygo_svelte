import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";
import type { DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import { IllegalCancelError, SystemError } from "@ygo_duel/class/Duel";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "儀式の準備",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SearchFromDeck", "ReturnToHandFromGraveyard"],
        canExecute: (myInfo) =>
          myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.monsterCategories?.includes("Ritual"))
            .some((card) => card.lvl && card.lvl < 8) && myInfo.activator.canAddToHandFromDeck,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (!myInfo.activator.canAddToHandFromDeck) {
            return false;
          }
          const monsters = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.monsterCategories?.includes("Ritual"))
            .filter((card) => card.lvl && card.lvl < 8);
          if (!monsters.length) {
            return false;
          }
          const monster = await myInfo.activator.waitSelectEntity(monsters, "手札に加えるカードを選択", false);
          if (!monster) {
            return false;
          }
          await monster.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();

          if (!myInfo.activator.canAddToHandFromGraveyard) {
            return true;
          }

          const spells = myInfo.activator.getGraveyard().cardEntities.filter((card) => card.status.spellCategory === "Ritual");

          if (spells.length === 1) {
            const response = await myInfo.activator.waitYesNo("儀式カードをサルベージする？");
            if (!response) {
              return true;
            }
          }

          const spell = await myInfo.activator.waitSelectEntity(spells, "手札に加えるカードを選択", true);
          if (!spell) {
            return true;
          }
          // この儀式魔法の手札サルベージはタイミングを逃す要因になる
          await myInfo.activator.duel.clock.incrementProcSeq();
          await spell.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "儀式の下準備",
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
        fixedTags: ["SearchFromDeck", "ReturnToHandFromGraveyard"],
        canExecute: (myInfo) => {
          if (!myInfo.activator.canAddToHandFromDeck) {
            return false;
          }
          const names = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.spellCategory === "Ritual")
            .flatMap((spell) => spell.status.textTags ?? []);
          const cellTypes: DuelFieldCellType[] = ["Deck"];
          if (myInfo.activator.canAddToHandFromGraveyard) {
            cellTypes.push("Graveyard");
          }
          return myInfo.activator
            .getCells(...cellTypes)
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.status.monsterCategories?.includes("Ritual"))
            .some((card) => names.includes(card.nm));
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (!myInfo.activator.canAddToHandFromDeck) {
            return false;
          }
          let names = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.spellCategory === "Ritual")
            .flatMap((spell) => spell.status.textTags ?? []);
          if (!names.length) {
            return false;
          }

          const cellTypes: DuelFieldCellType[] = ["Deck"];
          if (myInfo.activator.canAddToHandFromGraveyard) {
            cellTypes.push("Graveyard");
          }
          names = myInfo.activator
            .getCells(...cellTypes)
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.status.monsterCategories?.includes("Ritual"))
            .filter((card) => names.includes(card.nm))
            .map((card) => card.nm);
          if (!names.length) {
            return false;
          }

          const spells = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.spellCategory === "Ritual")
            .filter((spell) => spell.status.textTags && spell.status.textTags.union(names).length);
          if (!spells.length) {
            return false;
          }
          const spell = await myInfo.activator.waitSelectEntity(spells, "手札に加えるカードを選択", false);
          if (!spell) {
            throw new IllegalCancelError(myInfo);
          }
          const monsters = myInfo.activator
            .getCells(...cellTypes)
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.status.monsterCategories?.includes("Ritual"))
            .filter((card) => spell.status.textTags?.includes(card.nm));

          if (!monsters.length) {
            console.error(spell.status.textTags);
            throw new SystemError("想定されない状態", myInfo, spell, spell.status.textTags);
          }

          const monster = await myInfo.activator.waitSelectEntity(monsters, "手札に加えるカードを選択", false);
          if (!monster) {
            throw new IllegalCancelError(myInfo, spells);
          }

          // 儀式の下準備は同時に手札に加える。
          await DuelEntityShortHands.addManyToHand([spell, monster], ["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

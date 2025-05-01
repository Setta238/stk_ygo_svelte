import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_duel/cards/DefaultCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import { type CardActionDefinition } from "@ygo_duel/class/DuelCardAction";

import type { CardDefinition } from "./CardDefinitions";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export const createCardDefinitions_NormalSpell_General_Draw = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_強欲な壺 = {
    name: "強欲な壺",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        priorityForNPC: 20,
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.length < 2) {
            return;
          }
          if (!myInfo.activator.canDraw) {
            return;
          }
          if (!myInfo.activator.canAddToHandFromDeck) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw"], prepared: undefined };
        },
        execute: async (chainBlockInfo) => {
          await chainBlockInfo.activator.draw(2, chainBlockInfo.action.entity, chainBlockInfo.activator);
          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
      defaultSpellTrapSetAction as CardActionDefinition<unknown>,
    ],
  };

  result.push(def_強欲な壺);

  const def_貪欲な壺 = {
    name: "貪欲な壺",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        priorityForNPC: 30,
        validate: (myInfo) => {
          // 墓地に対象に取れるモンスターが５体以上必要
          if (
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo)).length < 5
          ) {
            return;
          }
          if (!myInfo.activator.canDraw) {
            return;
          }
          if (!myInfo.activator.canAddToHandFromDeck) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async (myInfo) => {
          const targets = await myInfo.activator.waitSelectEntities(
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.status.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
            5,
            (selected) => selected.length === 5,
            "デッキに戻すモンスターを選択。",
            false
          );
          if (!targets) {
            return;
          }

          return { selectedEntities: targets, chainBlockTags: ["Draw", "ReturnToDeckFromGraveyard"], prepared: undefined };
        },
        execute: async (myInfo) => {
          // いずれかが同一チェーン中に墓地を離れていたら不可
          if (myInfo.selectedEntities.some((monster) => monster.wasMovedAtCurrentChain)) {
            return false;
          }

          //デッキorエクストラデッキに戻す
          await DuelEntityShortHands.returnManyToDeckForTheSameReason("Random", myInfo.selectedEntities, ["Effect"], myInfo.action.entity, myInfo.activator);

          await myInfo.activator.draw(2, myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
      defaultSpellTrapSetAction as CardActionDefinition<unknown>,
    ],
  };

  result.push(def_貪欲な壺);
  const def_天使の施し = {
    name: "天使の施し",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        priorityForNPC: 30,
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.length < 3) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw", "DiscordAsEffect"], prepared: undefined };
        },
        execute: async (myInfo) => {
          await myInfo.activator.draw(3, myInfo.action.entity, myInfo.activator);
          await myInfo.activator.discard(2, ["Effect", "Discard"], myInfo.action.entity, myInfo.activator, () => true, myInfo.activator);
          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
      defaultSpellTrapSetAction as CardActionDefinition<unknown>,
    ],
  };

  result.push(def_天使の施し);
  const def_成金ゴブリン = {
    name: "成金ゴブリン",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        priorityForNPC: 20,
        validate: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.length < 1) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw"], prepared: undefined };
        },
        execute: async (myInfo) => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          // このドローは時の任意効果のトリガーにならない。
          myInfo.action.entity.field.duel.clock.incrementProcSeq();
          myInfo.activator.getOpponentPlayer().heal(1000, myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
      defaultSpellTrapSetAction as CardActionDefinition<unknown>,
    ],
  };

  result.push(def_成金ゴブリン);
  const def_手札抹殺 = {
    name: "手札抹殺",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (
            myInfo.activator.getDeckCell().cardEntities.length <
            myInfo.activator.getHandCell().cardEntities.filter((card) => card.seq !== myInfo.action.entity.seq).length
          ) {
            return;
          }
          if (
            myInfo.action.entity.field
              .getAllCells()
              .filter((c) => c.cellType === "Hand")
              .flatMap((c) => c.cardEntities)
              .filter((card) => card.seq !== myInfo.action.entity.seq).length === 0
          ) {
            return;
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
        execute: async (myInfo) => {
          const h1 = myInfo.activator.getHandCell().cardEntities.length;
          const h2 = myInfo.activator.getOpponentPlayer().getHandCell().cardEntities.length;

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(
            myInfo.action.entity.field.getCells("Hand").flatMap((hand) => hand.cardEntities),
            ["Effect", "Discard"],
            myInfo.action.entity,
            myInfo.activator
          );

          myInfo.activator.duel.clock.incrementProcSeq();

          await myInfo.action.entity.field.drawAtSameTime(
            myInfo.activator,
            h1,
            myInfo.activator.getOpponentPlayer(),
            h2,
            myInfo.action.entity,
            myInfo.activator
          );

          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
      defaultSpellTrapSetAction as CardActionDefinition<unknown>,
    ],
  };
  result.push(def_手札抹殺);

  return result;
};

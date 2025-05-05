import { defaultSpellTrapSetAction, defaultSpellTrapValidate } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import {} from "@stk_utils/funcs/StkArrayUtils";
import { type CardActionDefinition } from "@ygo_duel/class/DuelEntityAction";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import { DamageFilter } from "@ygo_duel/class_continuous_effect/DuelDamageFilter";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
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
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
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
              .cardEntities.filter((card) => card.kind === "Monster")
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
              .cardEntities.filter((card) => card.kind === "Monster")
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
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
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
      defaultSpellTrapSetAction,
    ],
  };
  yield {
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
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
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
          return { selectedEntities: [], chainBlockTags: ["Draw", "DiscordAsEffect"], prepared: undefined };
        },
        execute: async (myInfo) => {
          const qty1 = myInfo.activator.getHandCell().cardEntities.length;
          const qty2 = myInfo.activator.getOpponentPlayer().getHandCell().cardEntities.length;

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(
            myInfo.action.entity.field.getCells("Hand").flatMap((hand) => hand.cardEntities),
            ["Effect", "Discard"],
            myInfo.action.entity,
            myInfo.activator
          );

          myInfo.activator.duel.clock.incrementProcSeq();
          await DuelEntityShortHands.drawAtSameTime(myInfo.activator, myInfo.action.entity, qty1, qty2);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "一時休戦",
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
          for (const duelist of [myInfo.activator, myInfo.activator.getOpponentPlayer()]) {
            if (!duelist.getDeckCell().cardEntities.length) {
              return;
            }
            if (!duelist.canDraw) {
              return;
            }
          }
          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw"], prepared: undefined };
        },
        execute: async (myInfo) => {
          await DuelEntityShortHands.drawAtSameTime(myInfo.activator, myInfo.action.entity, 1, 1);
          [myInfo.activator, myInfo.activator.getOpponentPlayer()].forEach((duelist) =>
            duelist.entity.damageFilterBundle.push(
              new DamageFilter(
                "ダメージ無効",
                (ope) => ope.effectOwner.duel.clock.turn - ope.isSpawnedAt.turn < 2,
                false,
                myInfo.action.entity,
                myInfo.action,
                () => true,
                "zero_typeA",
                (filter, point, activator, damageTo) => {
                  activator.writeInfoLog(`${damageTo.profile.name}は${filter.isSpawnedBy}の効果でダメージを受けない。`);
                  return { zero_typeA: true };
                }
              )
            )
          );

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "打ち出の小槌",
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
          // 自分のデッキが0枚でも発動できる。
          if (!myInfo.activator.canDraw) {
            return;
          }

          return defaultSpellTrapValidate(myInfo);
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw"], prepared: undefined };
        },
        execute: async (myInfo) => {
          const hands = myInfo.activator.getHandCell().cardEntities;

          if (!hands.length) {
            return false;
          }

          const cards = await myInfo.activator.waitSelectEntities(hands, undefined, (selected) => selected.length > 0, "デッキに戻すカードを選択。", false);

          if (!cards) {
            throw new IllegalCancelError(myInfo);
          }

          await DuelEntityShortHands.returnManyToDeckForTheSameReason("Random", cards, ["Effect"], myInfo.action.entity, myInfo.activator);

          // タイミングを逃させる要因になる。
          myInfo.activator.duel.clock.incrementTotalProcSeq();

          await myInfo.activator.draw(cards.length, myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

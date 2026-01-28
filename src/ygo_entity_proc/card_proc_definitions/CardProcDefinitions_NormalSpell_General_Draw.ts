import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { IllegalCancelError } from "@ygo_duel/class_error/DuelError";
import { DamageFilter } from "@ygo_duel/class_continuous_effect/DuelDamageFilter";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";

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
        fixedTags: ["Draw"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 1 && myInfo.activator.canDraw && myInfo.activator.canAddToHandFromDeck,
        prepare: defaultPrepare,
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
        fixedTags: ["Draw", "ReturnToDeckFromGraveyard"],
        priorityForNPC: 30,
        canExecute: (myInfo) =>
          myInfo.activator
            .getGraveyard()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((card) => card.canBeTargetOfEffect(myInfo)).length > 4 &&
          myInfo.activator.canDraw &&
          myInfo.activator.canAddToHandFromDeck,
        prepare: async (myInfo) => {
          const targets = await myInfo.activator.waitSelectEntities(
            myInfo.activator
              .getGraveyard()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
            5,
            (selected) => selected.length === 5,
            "デッキに戻すモンスターを選択。",
            false,
          );
          if (!targets) {
            return;
          }

          return { selectedEntities: targets };
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
        fixedTags: ["Draw", "DiscordAsEffect"],
        priorityForNPC: 30,
        canExecute: (myInfo) =>
          myInfo.activator.getDeckCell().cardEntities.length > 2 &&
          myInfo.activator.canDraw &&
          myInfo.activator.canAddToHandFromDeck &&
          myInfo.activator.status.canDiscardAsEffect,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          await myInfo.activator.draw(3, myInfo.action.entity, myInfo.activator);
          await myInfo.activator.discard(2, "Effect", () => true, myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      },
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
        fixedTags: ["Draw"],
        priorityForNPC: 20,
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0 && myInfo.activator.canDraw && myInfo.activator.canAddToHandFromDeck,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          // このドローは時の任意効果のトリガーにならない。
          await myInfo.action.entity.field.duel.clock.incrementProcSeq();
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
        fixedTags: ["Draw", "DiscordAsEffect"],
        canExecute: (myInfo) =>
          myInfo.activator.getDeckCell().cardEntities.length >=
            myInfo.activator.getHandCell().cardEntities.filter((card) => card.seq !== myInfo.action.entity.seq).length &&
          myInfo.activator.canDraw &&
          myInfo.activator.canAddToHandFromDeck &&
          myInfo.activator.getOpponentPlayer().canDraw &&
          myInfo.activator.getOpponentPlayer().canAddToHandFromDeck &&
          myInfo.action.entity.field
            .getAllCells()
            .filter((c) => c.cellType === "Hand")
            .flatMap((c) => c.cardEntities)
            .some((card) => card.seq !== myInfo.action.entity.seq),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const qty1 = myInfo.activator.getHandCell().cardEntities.length;
          const qty2 = myInfo.activator.getOpponentPlayer().getHandCell().cardEntities.length;

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(
            myInfo.action.entity.field.getCells("Hand").flatMap((hand) => hand.cardEntities),
            ["Effect", "Discard"],
            myInfo.action.entity,
            myInfo.activator,
          );

          await myInfo.activator.duel.clock.incrementProcSeq();
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
        fixedTags: ["Draw"],
        canExecute: (myInfo) =>
          myInfo.activator.getDeckCell().cardEntities.length > 0 &&
          myInfo.activator.canDraw &&
          myInfo.activator.getOpponentPlayer().getDeckCell().cardEntities.length > 0 &&
          myInfo.activator.getOpponentPlayer().canDraw,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          await DuelEntityShortHands.drawAtSameTime(myInfo.activator, myInfo.action.entity, 1, 1);
          [myInfo.activator, myInfo.activator.getOpponentPlayer()].forEach((duelist) =>
            duelist.entity.damageFilterBundle.push(
              new DamageFilter({
                title: "ダメージ無効",
                validateAlive: (ope) => ope.duel.clock.turn - ope.isSpawnedAt.turn < 2,
                isContinuous: false,
                isSpawnedBy: myInfo.action.entity,
                actionAttr: myInfo.action,
                isApplicableTo: () => true,
                calcType: "zero_typeA",
                filter: (filter, point, activator, damageTo) => {
                  activator.writeInfoLog(`${damageTo.profile.name}は${filter.isSpawnedBy}の効果でダメージを受けない。`);
                  return { zero_typeA: true };
                },
              }),
            ),
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
        fixedTags: ["Draw"],
        canExecute: (myInfo) => myInfo.activator.canDraw,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const hands = myInfo.activator.getHandCell().cardEntities;

          if (!hands.length) {
            return false;
          }

          let cards = [...hands];

          if (cards.length > 1 && !(await myInfo.activator.waitYesNo("全ての手札を入れ替える？"))) {
            const _cards = await myInfo.activator.waitSelectEntities(hands, undefined, (selected) => selected.length > 0, "デッキに戻すカードを選択。", false);

            if (!_cards) {
              throw new IllegalCancelError(myInfo);
            }
            cards = _cards;
          }

          await DuelEntityShortHands.returnManyToDeckForTheSameReason("Random", cards, ["Effect"], myInfo.action.entity, myInfo.activator);

          // タイミングを逃させる要因になる。
          await myInfo.activator.duel.clock.incrementProcSeq();

          await myInfo.activator.draw(cards.length, myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

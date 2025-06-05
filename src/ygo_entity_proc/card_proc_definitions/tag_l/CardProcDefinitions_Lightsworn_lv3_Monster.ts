import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {
  defaultCanPayDiscardCosts,
  defaultPayDiscardCosts,
  defaultPrepare,
  getMultiTargetsRebornActionPartical,
  getPayBanishCostsActionPartical,
} from "@ygo_entity_proc/card_actions/CardActions";
import { getCommonLightswormEndPhaseAction, getCommonTwillightswormEndPhaseAction } from "@ygo_entity_proc/card_actions/tag_l/CardActions_Lightsworn_Monster";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ライトロード・サモナー ルミナス",
    actions: [
      {
        title: "①蘇生",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        fixedTags: ["SpecialSummonFromGraveyard", "DiscordAsCost"],
        canPayCosts: defaultCanPayDiscardCosts,
        payCosts: defaultPayDiscardCosts,
        ...getMultiTargetsRebornActionPartical((myInfo) =>
          myInfo.activator
            .getGraveyard()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((monster) => (monster.lvl ?? 12) < 5)
            .filter((monster) => monster.status.nameTags?.includes("ライトロード"))
        ),
        settle: async () => true,
      },
      getCommonLightswormEndPhaseAction("②", 3),
    ],
  };
  yield {
    name: "トワイライトロード・シャーマン ルミナス",
    actions: [
      {
        title: "①蘇生帰還",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        fixedTags: ["SpecialSummonFromGraveyard", "DiscordAsCost"],
        ...getPayBanishCostsActionPartical((myInfo) =>
          myInfo.activator
            .getCells("Hand", "Graveyard")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.status.nameTags?.includes("ライトロード"))
            .filter((card) => card.kind === "Monster")
        ),
        ...getMultiTargetsRebornActionPartical((myInfo) =>
          myInfo.activator
            .getBanished()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((monster) => monster.status.nameTags?.includes("ライトロード"))
        ),
        settle: async () => true,
      },
      getCommonTwillightswormEndPhaseAction("②", 3),
    ],
  };
  yield {
    name: "ライトロード・メイデン ミネルバ",
    actions: [
      {
        title: "①サーチ",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        triggerPattern: { triggerType: "Arrival", arrivalReasons: ["NormalSummon"] },
        fixedTags: ["SearchFromDeck"],
        canExecute: (myInfo) =>
          myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.attr.includes("Light"))
            .filter((card) => card.types.includes("Dragon"))
            .some(
              (card) =>
                card.lvl &&
                card.lvl <=
                  myInfo.activator
                    .getGraveyard()
                    .cardEntities.filter((card) => card.status.nameTags?.includes("ライトロード"))
                    .filter((card) => card.kind)
                    .map((card) => card.nm)
                    .getDistinct().length
            ),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (!myInfo.activator.canAddToHandFromDeck) {
            return false;
          }

          const monsters = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.attr.includes("Light"))
            .filter((card) => card.types.includes("Dragon"))
            .filter(
              (card) =>
                card.lvl &&
                card.lvl <=
                  myInfo.activator
                    .getGraveyard()
                    .cardEntities.filter((card) => card.status.nameTags?.includes("ライトロード"))
                    .filter((card) => card.kind)
                    .map((card) => card.nm)
                    .getDistinct().length
            );

          const monster = await myInfo.activator.waitSelectEntity(monsters, "手札に加えるモンスターを選択", false);
          if (!monster) {
            return false;
          }

          await monster.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      {
        title: "②墓地送り",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Departure", from: ["Deck", "Hand"] },
        fixedTags: ["SendToGraveyardFromDeck"],
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const card = myInfo.activator.getDeckCell().cardEntities[0];

          if (!card) {
            return false;
          }

          // 発動時にデッキ枚数は確認せず、処理時に枚数未満なら全て墓地に送る。
          await card.sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      getCommonLightswormEndPhaseAction("③", 2),
    ],
  };
}

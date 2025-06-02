import {
  canSelfSepcialSummon,
  defaultSelfSpecialSummonExecute,
  defaultSelfReleaseCanPayCosts,
  defaultSelfReleasePayCosts,
} from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { defaultPrepare, getMultiTargetsRebornActionPartical, getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CardActions";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { getCommonLightswormEndPhaseAction } from "@ygo_entity_proc/card_actions/tag_l/CardActions_Lightsworn_Monster";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ライトロード・アサシン ライデン",
    actions: [
      {
        title: `①墓地送り＆自己強化`,
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurn: 1,
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 1,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities.slice(0, 2);

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);

          const qty = cards.filter((card) => card.kind === "Monster").filter((monster) => monster.status.nameTags?.includes("ライトロード")).length;

          if (qty) {
            myInfo.action.entity.numericOprsBundle.push(
              NumericStateOperator.createLingeringAddition(
                myInfo.action.title,
                (operator) => operator.isSpawnedBy.isEffective && operator.duel.clock.turn - operator.isSpawnedAt.turn < 2,
                myInfo.action.entity,
                myInfo.action,
                "attack",
                (spawner, monster, current) => current + 200 * qty
              )
            );
          }

          return true;
        },
        settle: async () => true,
      },
      getCommonLightswormEndPhaseAction("②", 2),
    ],
  };
  yield {
    name: "ライトロード・ビースト ウォルフ",
    actions: [
      {
        title: "①自己再生",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Departure", from: ["Deck"] },
        fixedTags: ["SpecialSummonFromGraveyard"],
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: defaultPrepare,
        execute: defaultSelfSpecialSummonExecute,
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "ライトロード・アーチャー フェリス",
    actions: [
      {
        title: "①自己再生",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Departure", from: ["Deck"], needsByEffect: true, causerFilter: (me, causer) => causer.kind === "Monster" },
        fixedTags: ["SpecialSummonFromGraveyard"],
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"]),
        prepare: defaultPrepare,
        execute: defaultSelfSpecialSummonExecute,
        settle: async () => true,
      },
      {
        title: "②モンスター破壊＆墓地送り",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["Destroy", "DestroyMonsterOnField", "DestroyOnOpponentField", "DestroyOnField"],
        canPayCosts: defaultSelfReleaseCanPayCosts,
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 2,
        payCosts: defaultSelfReleasePayCosts,
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.activator
              .getOpponentPlayer()
              .getMonstersOnField()
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
          { do: "Destroy" }
        ),
        execute: async (myInfo) => {
          // フィールドにいなければ効果なし
          if (myInfo.selectedEntities.every((target) => !target.isOnField)) {
            return false;
          }

          const destroyed = await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);

          if (!destroyed) {
            return false;
          }

          // この後の墓地送りはタイミングを逃させる要因になる。
          myInfo.activator.duel.clock.incrementProcSeq();

          // 発動には三枚以上必要だが、処理時に三枚未満なら全て墓地に送る。
          const cards = myInfo.activator.getDeckCell().cardEntities.slice(0, 3);

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "光道の龍",
    actions: [
      {
        title: "①自己特殊召喚",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromHand", "SpecialSummon"],
        isOnlyNTimesPerTurn: 1,
        canExecute: (myInfo) =>
          myInfo.activator
            .getGraveyard()
            .cardEntities.filter((card) => card.kind === "Monster")
            .some((card) => card.status.nameTags?.includes("ライトロード")),
        prepare: defaultPrepare,
        execute: defaultSelfSpecialSummonExecute,
        settle: async () => true,
      },
      {
        title: "②墓地送り",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        triggerPattern: { triggerType: "Arrival", arrivalReasons: ["SpecialSummon"] },
        fixedTags: ["SendToGraveyardFromDeck", "IfSpecialSummonSucceed"],
        canExecute: (myInfo) =>
          myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.nameTags?.includes("ライトロード"))
            .some((card) => card.nm !== "光道の龍"),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const choices = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => card.status.nameTags?.includes("ライトロード"))
            .filter((card) => card.nm !== "光道の龍");
          if (choices.length === 0) {
            return false;
          }

          const monster = await myInfo.activator.waitSelectEntity(choices, "墓地に送るカードを選択", false);
          if (!monster) {
            throw new IllegalCancelError(myInfo);
          }
          await monster.sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
      {
        title: "③サーチ",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Departure" },
        isOnlyNTimesPerTurn: 1,
        fixedTags: ["SearchFromDeck"],
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.atk === 3000 && card.def === 2600),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const monsters = myInfo.activator.getDeckCell().cardEntities.filter((card) => card.atk === 3000 && card.def === 2600);

          const target = await myInfo.activator.waitSelectEntity(monsters, "手札に加えるモンスターを選択", false);
          if (!target) {
            return false;
          }
          await target.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();
          return true;
        },
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "ライトロード・デーモン ヴァイス",
    actions: [
      {
        title: "①自己特殊召喚",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromHand"],
        isOnlyNTimesPerTurn: 1,
        canPayCosts: (myInfo) => myInfo.activator.getHandCell().cardEntities.length > 1,
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 1,
        payCosts: async (myInfo, chainBlockInfos, cancelable) => {
          const hands = myInfo.activator.getHandCell().cardEntities.filter((card) => card !== myInfo.action.entity);
          const cost = await myInfo.activator.waitSelectEntity(hands, "デッキトップに戻すカードを一枚選択。", cancelable);
          if (!cost) {
            throw new IllegalCancelError(myInfo);
          }
          await cost.returnToDeck("Top", ["Cost"], myInfo.action.entity, myInfo.activator);
          return { returnToDeck: [cost] };
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (!(await defaultSelfSpecialSummonExecute(myInfo))) {
            return false;
          }

          // この後の墓地送りはタイミングを逃させる要因になる。
          myInfo.activator.duel.clock.incrementProcSeq();

          const cards = myInfo.activator.getDeckCell().cardEntities.slice(0, 2);

          // 処理時に枚数未満なら全て墓地に送る。
          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      {
        title: "②蘇生",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        triggerPattern: { triggerType: "Departure", from: ["Deck"] },
        fixedTags: ["SpecialSummonFromGraveyard"],
        ...getMultiTargetsRebornActionPartical((myInfo) =>
          myInfo.activator
            .getGraveyard()
            .cardEntities.filter((card) => card.kind === "Monster")
            .filter((monster) => monster.status.nameTags?.includes("ライトロード"))
            .filter((monster) => monster.nm !== "ライトロード・デーモン ヴァイス")
        ),
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "ライトロード・マジシャン ライラ",
    actions: [
      {
        title: "③マナブレイク",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["Destroy", "DestroyOnField", "DestroySpellTrapOnField"],
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.activator
              .getOpponentPlayer()
              .getSpellTrapsOnField()
              .filter((card) => card.canBeTargetOfEffect(myInfo)),
          { message: "破壊する対象を選択。", do: "Destroy", canExecute: (myInfo) => myInfo.action.entity.battlePosition === "Attack" }
        ),
        execute: async (myInfo) => {
          if (myInfo.action.entity.battlePosition === "Attack") {
            await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);

            await myInfo.action.entity.setBattlePosition("Defense", ["Effect"], myInfo.action.entity, myInfo.activator);
          }

          myInfo.action.entity.statusOperatorBundle.push(
            new StatusOperator({
              title: "表示形式変更不可",
              validateAlive: (operator) => operator.duel.clock.turn - operator.isSpawnedAt.turn < 3,
              isContinuous: false,
              isSpawnedBy: myInfo.action.entity,
              actionAttr: myInfo.action,
              isApplicableTo: () => true,
              statusCalculator: () => ({ canBattlePositionChange: false }),
            })
          );

          return true;
        },
        settle: async () => true,
      },
      getCommonLightswormEndPhaseAction("②", 3),
    ],
  };
}

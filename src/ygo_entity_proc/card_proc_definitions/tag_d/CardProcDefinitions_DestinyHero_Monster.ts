import { type EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultEffectSpecialSummonExecute, defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { EntityAction } from "@ygo_duel/class/DuelEntityAction";
import { delay } from "@stk_utils/funcs/StkPromiseUtil";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { getPaySelfBanishCostsActionPartical } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Banish";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "Ｄ－ＨＥＲＯ ディアボリックガイ",
    actions: [
      {
        title: "①リクルート",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        fixedTags: ["SpecialSummonFromDeck"],
        priorityForNPC: 10,
        ...getPaySelfBanishCostsActionPartical(),
        canExecute: (myInfo) => {
          const nextOne = myInfo.activator.getDeckCell().cardEntities.find((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ");
          if (!nextOne) {
            return false;
          }
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            [{ monster: nextOne, posList: faceupBattlePositions, cells }],
            [],
            false
          );
          return list.length > 0;
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const newOne = myInfo.activator.getDeckCell().cardEntities.find((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ");
          if (!newOne) {
            return false;
          }
          return defaultEffectSpecialSummonExecute(myInfo, [newOne]);
        },
        settle: async () => true,
      },
    ],
  };
  yield {
    name: "Ｄ－ＨＥＲＯ ダイヤモンドガイ",
    actions: [
      {
        title: "魔法効果予約",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        canExecute: (myInfo) => myInfo.action.entity.face === "FaceUp" && myInfo.activator.getDeckCell().cardEntities.length > 0,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const card = await DuelEntityShortHands.excavateFromDeck(myInfo.activator, ["Effect"], myInfo.action.entity, myInfo.activator);
          if (!card) {
            return false;
          }
          if (card.kind !== "Spell" || card.status.spellCategory !== "Normal") {
            myInfo.activator.duel.view.requireUpdate();
            await delay(500);
            myInfo.activator.writeInfoLog(`${card.toString()}は通常魔法ではないため、デッキボトムに戻った。`);
            await card.returnToDeck("Bottom", ["Effect"], myInfo.action.entity, myInfo.activator);
            return false;
          }
          await card.sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);
          const action = card.actions.filter((action) => action.playType === "CardActivation").find((action) => !action.needsToPayRegularCosts);
          if (!action) {
            myInfo.activator.writeInfoLog(`${card.toString()}は${myInfo.action.entity.toString()}の効果では発動できない。`);
            return true;
          }

          const wasSpawnedAt = myInfo.activator.duel.clock.getClone();

          // 書き換えた効果を作成
          const definition = { ...action.definition };
          definition.title += `(${myInfo.action.entity.toString()})`;
          definition.playType = "IgnitionEffect";
          definition.canExecute = (myInfo, chainBlockInfos) => {
            if (myInfo.activator.duel.clock.turn > wasSpawnedAt.turn + 2) {
              // 次の自分のターン以降は削除
              return "RemoveMe";
            } else if (myInfo.action.entity.wasMovedAfter(wasSpawnedAt)) {
              // 移動していた場合削除
              return "RemoveMe";
            } else if (myInfo.activator.duel.clock.turn < wasSpawnedAt.turn + 2) {
              return false;
            }
            return !action.definition.canExecute || action.definition.canExecute(myInfo, chainBlockInfos);
          };
          definition.executableCells = ["Graveyard"];
          definition.meetsConditions = undefined;
          definition.canPayCosts = undefined;
          definition.payCosts = undefined;
          definition.settle = async () => true;
          definition.isOnlyNTimesPerTurn = 1;

          card.actions.push(EntityAction.createNew(card, definition));
          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

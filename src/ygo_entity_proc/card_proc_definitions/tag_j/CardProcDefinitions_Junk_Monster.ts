import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
} from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultCanPaySelfBanishCosts } from "../../card_actions/CommonCardAction";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { SystemError } from "@ygo_duel/class/Duel";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ジャンク・コレクター",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      defaultNormalSummonAction,
      {
        title: "罠コピー",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        canPayCosts: (myInfo) => {
          const traps = myInfo.activator
            .getGraveyard()
            .cardEntities.filter((card) => card.kind === "Trap")
            .filter((card) => card.status.trapCategory === "Normal")
            .filter((card) => myInfo.activator.canTryBanish(card, "BanishAsCost", myInfo.action))
            .filter((card) => card.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action))
            .flatMap((card) => card.actions)
            .filter((action) => action.playType === "CardActivation")
            .filter((action) => !action.needsToPayCost)
            .filter((action) => action.validate(myInfo.activator, [], true));
          if (!traps.length) {
            return false;
          }

          return defaultCanPaySelfBanishCosts(myInfo);
        },
        validate: () => [],
        payCosts: async (myInfo, chainBlockInfos, cancelable) => {
          const choices = myInfo.activator
            .getGraveyard()
            .cardEntities.filter((card) => card.kind === "Trap")
            .filter((card) => card.status.trapCategory === "Normal")
            .filter((card) => myInfo.activator.canTryBanish(card, "BanishAsCost", myInfo.action))
            .filter((card) => card.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action))
            .flatMap((card) => card.actions)
            .filter((action) => action.playType === "CardActivation")
            .filter((action) => !action.needsToPayCost)
            .filter((action) => action.validate(myInfo.activator, [], true))
            .map((action) => action.entity);

          const target = await myInfo.activator.waitSelectEntity(choices, "コピーする罠を選択。", cancelable);
          if (!target) {
            return;
          }
          const cost = [myInfo.action.entity, target];
          await DuelEntityShortHands.banishManyForTheSameReason(cost, ["Cost"], myInfo.action.entity, myInfo.activator);

          return { banish: cost };
        },
        prepare: async (myInfo, chainBlockInfos) => {
          const cost = myInfo.costInfo.banish?.find((card) => card !== myInfo.action.entity);
          if (!cost) {
            throw new SystemError("想定されない状況", myInfo, myInfo.costInfo);
          }
          const action = cost.actions.find((action) => action.playType === "CardActivation");
          if (!action) {
            throw new SystemError("想定されない状況", myInfo, myInfo.costInfo, cost);
          }

          return await action.prepare(myInfo.activator, undefined, undefined, chainBlockInfos, false, true);
        },
        execute: async (myInfo, chainBlockInfos) => {
          const cost = myInfo.costInfo.banish?.find((card) => card !== myInfo.action.entity);
          if (!cost) {
            throw new SystemError("想定されない状況", myInfo, myInfo.costInfo);
          }
          const action = cost.actions.find((action) => action.playType === "CardActivation");
          if (!action) {
            throw new SystemError("想定されない状況", myInfo, myInfo.costInfo, cost);
          }
          return await action.execute(myInfo, chainBlockInfos);
        },
        settle: async () => true,
      },
    ],
  };
}

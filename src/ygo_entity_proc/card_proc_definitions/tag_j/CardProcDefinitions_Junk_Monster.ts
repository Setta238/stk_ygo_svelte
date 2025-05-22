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
      {
        title: "罠コピー",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        needsToPayCost: true,
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
            .filter((action) => action.validate(myInfo.activator, [], ["IgnoreCosts", "CopyEffectOnly"]));

          if (!traps.length) {
            return false;
          }

          return defaultCanPaySelfBanishCosts(myInfo);
        },
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
            .filter((action) => action.validate(myInfo.activator, [], ["IgnoreCosts", "CopyEffectOnly"]))
            .map((action) => action.entity);

          const target = await myInfo.activator.waitSelectEntity(choices, "コピーする罠を選択。", cancelable);
          if (!target) {
            return;
          }
          const costs = [myInfo.action.entity, target];
          await DuelEntityShortHands.banishManyForTheSameReason(costs, ["Cost"], myInfo.action.entity, myInfo.activator);

          return { banish: costs };
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

          const prepared = { ...(await action.prepare(myInfo.activator, undefined, undefined, chainBlockInfos, false, true)) };

          prepared.appendix = [`コピー対象：${cost.toString()}`, ...(prepared.appendix ?? [])];

          return prepared;
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

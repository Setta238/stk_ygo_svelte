import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultCanPaySelfBanishCosts, defaultPaySelfBanishCosts } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Banish";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { IllegalActionError } from "@ygo_duel/class_error/DuelError";
import type { ActionCostInfo, ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";
import { defaultPayHarfLifePoint } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_LifePoint";

export default function* generate(): Generator<EntityProcDefinition> {
  {
    // ジャンクコレクター、トランザクションロールバック用のコピー対象選定関数
    const getCopyTargets = (
      myInfo: ChainBlockInfoBase<unknown>,
      options: { opponent?: boolean; banish?: boolean; target?: boolean; costInfo: ActionCostInfo }
    ) => {
      const opponent = options.opponent ?? false;
      const banish = options.banish ?? false;
      const target = options.target ?? false;

      const duelist = opponent ? myInfo.activator.getOpponentPlayer() : myInfo.activator;
      let traps = duelist
        .getGraveyard()
        .cardEntities.filter((card) => card.kind === "Trap")
        .filter((card) => card.status.trapCategory === "Normal")
        .filter((card) => !(options.costInfo.banish?.map((info) => info.cost) ?? []).includes(card))
        .filter((card) => card !== myInfo.action.entity);

      if (banish) {
        traps = traps
          .filter((card) => myInfo.activator.canTryBanish(card, "BanishAsCost", myInfo.action))
          .filter((card) => card.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action));
      }
      if (target) {
        traps = traps.filter((card) => card.canBeTargetOfEffect(myInfo));
      }

      return traps
        .flatMap((card) => card.actions)
        .filter((action) => action.playType === "CardActivation")
        .filter((action) => !action.needsToPayRegularCosts)
        .filter((action) => {
          const costInfo = options.costInfo ?? {};
          if (banish) {
            costInfo.banish = [{ cost: action.entity, cell: action.entity.cell }, ...(costInfo.banish ?? [])];
          }
          return action.validate(myInfo.activator, [], ["IgnoreRegularCosts", "CopyEffectOnly"], {
            executeBy: myInfo.action.entity,
            costInfo,
          });
        });
    };

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
          executableFaces: ["FaceUp"],
          needsToPayRegularCost: true,
          fixedTags: ["DelegateAnotherEffect"],
          canPayCosts: (myInfo) =>
            defaultCanPaySelfBanishCosts(myInfo) &&
            getCopyTargets(myInfo, { banish: true, costInfo: { banish: [{ cost: myInfo.action.entity, cell: myInfo.action.entity.cell }] } }).length > 0,
          payCosts: async (myInfo, chainBlockInfos, cancelable) => {
            const choices = getCopyTargets(myInfo, {
              banish: true,
              costInfo: { banish: [{ cost: myInfo.action.entity, cell: myInfo.action.entity.cell }] },
            }).map((action) => action.entity);

            const target = await myInfo.activator.waitSelectEntity(choices, "コピーする罠を選択。", cancelable);
            if (!target) {
              return;
            }
            const costs = [myInfo.action.entity, target];
            await DuelEntityShortHands.banishManyForTheSameReason(costs, ["Cost"], myInfo.action.entity, myInfo.activator);

            return { banish: costs.map((cost) => ({ cost, cell: cost.cell })) };
          },
          prepare: async (myInfo, chainBlockInfos) => {
            const cost = myInfo.costInfo.banish?.find((info) => info.cost !== myInfo.action.entity)?.cost;
            if (!cost) {
              throw new IllegalActionError("IllegalActionCopy", myInfo);
            }
            const action = cost.actions.find((action) => action.playType === "CardActivation");
            if (!action) {
              throw new IllegalActionError("IllegalActionCopy", myInfo);
            }

            const prepared = { ...(await action.prepare(myInfo.activator, undefined, undefined, chainBlockInfos, false, true)) };

            prepared.appendix = [`コピー対象：${cost.toString()}`, ...(prepared.appendix ?? [])];
            // https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3%A1%A6%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF%A1%D5
            // あくまで発動時の分類は「コピーする効果」としてしか扱わない。
            prepared.chainBlockTags = [];
            return prepared;
          },
          execute: async (myInfo, chainBlockInfos) => {
            const cost = myInfo.costInfo.banish?.find((info) => info.cost !== myInfo.action.entity)?.cost;
            if (!cost) {
              throw new IllegalActionError("UnexpectedSituation", myInfo);
            }
            const action = cost.actions.find((action) => action.playType === "CardActivation");
            if (!action) {
              throw new IllegalActionError("UnexpectedSituation", myInfo);
            }
            return await action.execute(myInfo, chainBlockInfos, { indirectly: true });
          },
          settle: async () => true,
        },
      ],
    };

    yield {
      name: "トランザクション・ロールバック",
      actions: [
        defaultSpellTrapSetAction,
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Quick",
          executableCells: ["SpellAndTrapZone"],
          executablePeriods: freeChainDuelPeriodKeys,
          executableDuelistTypes: ["Controller"],
          isOnlyNTimesPerTurn: 1,
          actionGroupName: "トランザクション・ロールバック",
          fixedTags: ["DelegateAnotherEffect"],
          canExecute: (myInfo) => getCopyTargets(myInfo, { opponent: true, target: true, costInfo: {} }).length > 0,
          payCosts: defaultPayHarfLifePoint,
          prepare: async (myInfo, chainBlockInfos, cancelable) => {
            const choices = getCopyTargets(myInfo, { opponent: true, target: true, costInfo: myInfo.costInfo }).map((action) => action.entity);

            const target = await myInfo.activator.waitSelectEntity(choices, "コピーする罠を選択。", cancelable);

            if (!target) {
              return;
            }

            const action = target.actions.find((action) => action.playType === "CardActivation");
            if (!action) {
              throw new IllegalActionError("IllegalActionCopy", myInfo);
            }

            const prepared = { ...(await action.prepare(myInfo.activator, undefined, undefined, chainBlockInfos, false, true)) };

            prepared.appendix = [`コピー対象：${target.toString()}`, ...(prepared.appendix ?? [])];
            // トランザクションロールバック自身の対象を末尾に追加
            prepared.selectedEntities = [...(prepared.selectedEntities ?? []), target];

            return prepared;
          },
          execute: async (myInfo, chainBlockInfos) => {
            // トランザクションロールバック自身の対象を末尾から取得
            const target = myInfo.selectedEntities.pop();
            if (!target) {
              throw new IllegalActionError("UnexpectedSituation", myInfo);
            }

            if (target.wasMovedAfter(myInfo.isActivatedAt)) {
              return false;
            }
            const action = target.actions.find((action) => action.playType === "CardActivation");
            if (!action) {
              throw new IllegalActionError("UnexpectedSituation", myInfo);
            }

            return await action.execute(myInfo, chainBlockInfos, { indirectly: true });
          },
          settle: async (myInfo, chainBlockInfos) => {
            // トランザクションロールバック自身の対象を末尾から取得
            const target = myInfo.selectedEntities.pop();
            if (!target) {
              throw new IllegalActionError("UnexpectedSituation", myInfo);
            }

            if (target.wasMovedAfter(myInfo.isActivatedAt)) {
              return false;
            }
            const action = target.actions.find((action) => action.playType === "CardActivation");
            if (!action) {
              throw new IllegalActionError("UnexpectedSituation", myInfo);
            }

            // ①はカードの発動を伴うので発動後の縛りは適用される。②は適用されない。
            return await action.directSettle(myInfo, chainBlockInfos);
          },
        },
        {
          title: "②罠コピー",
          isMandatory: false,
          playType: "QuickEffect",
          spellSpeed: "Quick",
          executableCells: ["Graveyard"],
          executablePeriods: freeChainDuelPeriodKeys,
          executableDuelistTypes: ["Controller"],
          isOnlyNTimesPerTurn: 1,
          actionGroupName: "トランザクション・ロールバック",
          fixedTags: ["DelegateAnotherEffect"],
          canExecute: (myInfo) =>
            defaultCanPaySelfBanishCosts(myInfo) &&
            getCopyTargets(myInfo, { target: true, costInfo: { banish: [{ cost: myInfo.action.entity, cell: myInfo.action.entity.cell }] } }).length > 0,
          payCosts: async (myInfo) => {
            const lifeCost = await defaultPayHarfLifePoint(myInfo);
            const selfBanishCost = await defaultPaySelfBanishCosts(myInfo);

            return { ...lifeCost, ...selfBanishCost };
          },
          prepare: async (myInfo, chainBlockInfos, cancelable) => {
            const choices = getCopyTargets(myInfo, { target: true, costInfo: myInfo.costInfo }).map((action) => action.entity);

            const target = await myInfo.activator.waitSelectEntity(choices, "コピーする罠を選択。", cancelable);

            if (!target) {
              return;
            }

            const action = target.actions.find((action) => action.playType === "CardActivation");
            if (!action) {
              throw new IllegalActionError("IllegalActionCopy", myInfo);
            }

            const prepared = { ...(await action.prepare(myInfo.activator, undefined, undefined, chainBlockInfos, false, true)) };

            prepared.appendix = [`コピー対象：${target.toString()}`, ...(prepared.appendix ?? [])];
            // トランザクションロールバック自身の対象を末尾に追加
            prepared.selectedEntities = [...(prepared.selectedEntities ?? []), target];

            return prepared;
          },
          execute: async (myInfo, chainBlockInfos) => {
            // トランザクションロールバック自身の対象を末尾から取得
            const target = myInfo.selectedEntities.pop();
            if (!target) {
              throw new IllegalActionError("UnexpectedSituation", myInfo);
            }

            if (target.wasMovedAfter(myInfo.isActivatedAt)) {
              return false;
            }
            const action = target.actions.find((action) => action.playType === "CardActivation");
            if (!action) {
              throw new IllegalActionError("UnexpectedSituation", myInfo);
            }

            return await action.execute(myInfo, chainBlockInfos, { indirectly: true });
          },
          settle: async () => true,
        },
      ],
    };
  }
}

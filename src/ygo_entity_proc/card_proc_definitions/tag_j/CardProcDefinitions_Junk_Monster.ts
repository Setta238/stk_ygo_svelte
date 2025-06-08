import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultCanPaySelfBanishCosts, defaultPayHarfLifePoint, defaultPaySelfBanishCosts } from "@ygo_entity_proc/card_actions/CardActions";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { SystemError } from "@ygo_duel/class/Duel";
import type { ActionCostInfo, ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

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
        .filter((card) => !(options.costInfo.banish ?? []).includes(card))
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
            costInfo.banish = [action.entity, ...(costInfo.banish ?? [])];
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
            defaultCanPaySelfBanishCosts(myInfo) && getCopyTargets(myInfo, { banish: true, costInfo: { banish: [myInfo.action.entity] } }).length > 0,
          payCosts: async (myInfo, chainBlockInfos, cancelable) => {
            const choices = getCopyTargets(myInfo, { banish: true, costInfo: { banish: [myInfo.action.entity] } }).map((action) => action.entity);

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
              throw new SystemError("正規のコストを支払わずにジャンク・コレクターの効果処理を行おうとした。", myInfo, myInfo.costInfo);
            }
            const action = cost.actions.find((action) => action.playType === "CardActivation");
            if (!action) {
              throw new SystemError("カードの効果の発動を持たないカードをジャンク・コレクターでコピーしようとした。", myInfo, myInfo.costInfo, cost);
            }

            const prepared = { ...(await action.prepare(myInfo.activator, undefined, undefined, chainBlockInfos, false, true)) };

            prepared.appendix = [`コピー対象：${cost.toString()}`, ...(prepared.appendix ?? [])];
            // https://yugioh-wiki.net/index.php?%A1%D4%A5%C8%A5%E9%A5%F3%A5%B6%A5%AF%A5%B7%A5%E7%A5%F3%A1%A6%A5%ED%A1%BC%A5%EB%A5%D0%A5%C3%A5%AF%A1%D5
            // あくまで発動時の分類は「コピーする効果」としてしか扱わない。
            prepared.chainBlockTags = [];
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
              throw new SystemError(`カードの効果の発動を持たないカードを${myInfo.action.entity.toString()}でコピーしようとした。`, myInfo, target);
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
              throw new SystemError("想定されない状況", myInfo, myInfo.data);
            }

            if (target.wasMovedAfter(myInfo.isActivatedAt)) {
              return false;
            }
            const action = target.actions.find((action) => action.playType === "CardActivation");
            if (!action) {
              throw new SystemError("想定されない状況", myInfo, myInfo.data);
            }

            return await action.execute(myInfo, chainBlockInfos, { indirectly: true });
          },
          settle: async (myInfo, chainBlockInfos) => {
            // トランザクションロールバック自身の対象を末尾から取得
            const target = myInfo.selectedEntities.pop();
            if (!target) {
              throw new SystemError("想定されない状況", myInfo, myInfo.data);
            }

            if (target.wasMovedAfter(myInfo.isActivatedAt)) {
              return false;
            }
            const action = target.actions.find((action) => action.playType === "CardActivation");
            if (!action) {
              throw new SystemError("想定されない状況", myInfo, myInfo.data);
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
            defaultCanPaySelfBanishCosts(myInfo) && getCopyTargets(myInfo, { target: true, costInfo: { banish: [myInfo.action.entity] } }).length > 0,
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
              throw new SystemError(`カードの効果の発動を持たないカードを${myInfo.action.entity.toString()}でコピーしようとした。`, myInfo, target);
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
              throw new SystemError("想定されない状況", myInfo, myInfo.data);
            }

            if (target.wasMovedAfter(myInfo.isActivatedAt)) {
              return false;
            }
            const action = target.actions.find((action) => action.playType === "CardActivation");
            if (!action) {
              throw new SystemError("想定されない状況", myInfo, myInfo.data);
            }

            return await action.execute(myInfo, chainBlockInfos, { indirectly: true });
          },
          settle: async () => true,
        },
      ],
    };
  }
}

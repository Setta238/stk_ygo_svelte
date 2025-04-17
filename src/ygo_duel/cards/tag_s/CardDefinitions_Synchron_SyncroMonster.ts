import type { CardActionDefinition, ChainBlockInfoBase } from "@ygo_duel/class/DuelCardAction";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultSummonFilter,
} from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "@ygo_duel/cards/CardDefinitions";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { getDefaultSyncroSummonAction } from "../DefaultCardAction_SyncroMonster";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultPrepare } from "../DefaultCardAction";
import { SystemError } from "@ygo_duel/class/Duel";

export const createCardDefinitions_Synchron_SyncroMonster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
    name: "フォーミュラ・シンクロン",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      getDefaultSyncroSummonAction(),
      {
        title: "①ドロー",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (!myInfo.action.entity.hasBeenSummonedNow(["SyncroSummon"])) {
            return;
          }
          if (!myInfo.activator.getDeckCell().cardEntities.length) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["Draw"], prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
      {
        title: "②シンクロ召喚",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerChain: 1,
        validate: (myInfo) => {
          if (myInfo.activator.isTurnPlayer) {
            return;
          }
          const flg = myInfo.activator
            .getExtraDeck()
            .cardEntities.filter((monster) => monster.status.monsterCategories?.includes("Syncro"))
            .flatMap((monster) => monster.actions)
            .filter((action) => action.playType === "SpecialSummon")
            .map((action) => {
              return {
                index: -1,
                chainNumber: undefined,
                action,
                activator: myInfo.activator,
                targetChainBlock: undefined,
                isActivatedIn: action.entity.fieldCell,
                isActivatedAt: myInfo.isActivatedAt,
                costInfo: {},
                state: "unloaded",
                dest: undefined,
                ignoreCost: false,
              } as ChainBlockInfoBase<unknown>;
            })
            .some((childInfo) =>
              childInfo.action.getEnableMaterialPatterns(childInfo).some((infos) => {
                const materials = infos.map((info) => info.material);
                //全て自分フィールド上のモンスターかつ、このカード自身を含む必要がある。
                return (
                  materials.every((material) => material.controller === myInfo.activator) &&
                  materials.every((material) => material.isOnFieldAsMonster) &&
                  materials.includes(myInfo.action.entity)
                );
              })
            );
          return flg ? [] : undefined;
        },
        prepare: defaultPrepare,
        execute: async (myInfo): Promise<boolean> => {
          // 「このカードを含む自分フィールド上のモンスター」であるため、コントロール奪取をされていた場合不可
          if (myInfo.activator !== myInfo.action.entity.controller) {
            return false;
          }

          // レベルを持つモンスターが２体いない場合不可
          if (myInfo.activator.getMonstersOnField().filter((monster) => monster.lvl !== undefined).length < 2) {
            return false;
          }

          // シンクロ召喚できるシンクロモンスターを抜き出し
          const syncroMonsters = myInfo.activator
            .getExtraDeck()
            .cardEntities.filter((monster) => monster.status.monsterCategories?.includes("Syncro"))
            .flatMap((monster) => monster.actions)
            .filter((action) => action.playType === "SpecialSummon")
            .map((action) => {
              return {
                index: -1,
                chainNumber: undefined,
                action,
                activator: myInfo.activator,
                targetChainBlock: undefined,
                isActivatedIn: action.entity.fieldCell,
                isActivatedAt: myInfo.isActivatedAt,
                costInfo: {},
                state: "unloaded",
                dest: undefined,
                ignoreCost: false,
              } as ChainBlockInfoBase<unknown>;
            })
            .filter((childInfo) =>
              childInfo.action.getEnableMaterialPatterns(childInfo).some((infos) => {
                const materials = infos.map((info) => info.material);
                //全て自分フィールド上のモンスターかつ、このカード自身を含む必要がある。
                return (
                  materials.every((material) => material.controller === myInfo.activator) &&
                  materials.every((material) => material.isOnFieldAsMonster) &&
                  materials.includes(myInfo.action.entity)
                );
              })
            )
            .map((childInfo) => childInfo.action.entity)
            .getDistinct();

          if (!syncroMonsters.length) {
            return false;
          }

          const selected =
            (await myInfo.activator.duel.view.waitSelectEntities(
              myInfo.activator,
              syncroMonsters,
              1,
              (selected) => selected.length === 1,
              "シンクロ召喚するモンスターを選択。",
              false
            )) ?? [];

          if (!selected.length) {
            throw new SystemError("想定されない状態", myInfo);
          }

          const syncroSummonAction = selected[0].actions.find((action) => action.playType === "SpecialSummon");

          if (!syncroSummonAction) {
            throw new SystemError("想定されない状態", myInfo);
          }

          // 「このカードを含む自分フィールド上のモンスター」という制約を付加したダミーアクションを作成する。
          const dammySyncroSummonAction = syncroSummonAction.getClone((infos) => {
            const materials = infos.map((info) => info.material);
            //全て自分フィールド上のモンスターかつ、このカード自身を含む必要がある。
            return (
              materials.every((material) => material.controller === myInfo.activator) &&
              materials.every((material) => material.isOnFieldAsMonster) &&
              materials.includes(myInfo.action.entity)
            );
          });

          // 次に行うアクションとして設定。
          myInfo.nextAction = dammySyncroSummonAction;

          return true;
        },
        settle: async () => true,
      } as CardActionDefinition<unknown>,
    ],
    defaultSummonFilter: defaultSummonFilter,
  });

  return result;
};

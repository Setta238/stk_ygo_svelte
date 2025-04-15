import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultSummonFilter } from "@ygo_duel/cards/DefaultCardAction_Monster";

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
      defaultAttackAction as CardActionDefinition<unknown>,
      defaultBattlePotisionChangeAction as CardActionDefinition<unknown>,
      getDefaultSyncroSummonAction() as CardActionDefinition<unknown>,
      {
        title: "①ドロー",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
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
          await myInfo.activator.draw(2, myInfo.action.entity, myInfo.activator);
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
            .some((action) =>
              action
                .getEnableMaterialPatterns(myInfo)
                .flatMap((infos) => infos)
                .some((info) => info.material === myInfo.action.entity)
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
            .filter((action) =>
              action.getEnableMaterialPatterns(myInfo).some((infos) => {
                const materials = infos.map((info) => info.material);
                //全て自分フィールド上のモンスターかつ、このカード自身を含む必要がある。
                return (
                  materials.every((material) => material.controller === myInfo.activator) &&
                  materials.every((material) => material.isOnFieldAsMonster) &&
                  materials.includes(myInfo.action.entity)
                );
              })
            )
            .map((action) => action.entity)
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

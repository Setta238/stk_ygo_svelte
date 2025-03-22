import { IllegalCancelError } from "@ygo_duel/class/Duel";
import type { CardAction, CardActionBase, ChainBlockInfo, TEffectTag } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { type Duelist } from "@ygo_duel/class/Duelist";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalSummonAction,
  defaultRuleSpecialSummonExecute,
  defaultRuleSpecialSummonPrepare,
  defaultRuleSpecialSummonValidate,
  type SummonPrepared,
} from "@ygo_duel/functions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { CardDefinition } from "./CardDefinitions";
import { createRegularProcFilterHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";

export const createCardDefinitions_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  ["サイバー・ドラゴン", "六武衆のご隠居", "アンノウン・シンクロン"].forEach((name) =>
    result.push({
      name: name,
      actions: [
        defaultNormalSummonAction,
        defaultAttackAction,
        defaultBattlePotisionChangeAction,
        {
          title: "特殊召喚",
          playType: "SpecialSummon",
          spellSpeed: "Normal",
          executableCells: ["Hand"],
          isOnlyNTimesPerDuel: name === "アンノウン・シンクロン" ? 1 : undefined,
          validate: (action: CardAction<SummonPrepared>): DuelFieldCell[] | undefined => {
            const monsters = action.entity.field.getMonstersOnField();
            if (monsters.length == 0 || monsters.some((m) => m.controller === action.entity.controller)) {
              return undefined;
            }

            return defaultRuleSpecialSummonValidate(action, ["Attack", "Defense"], []);
          },
          prepare: (
            action: CardAction<SummonPrepared>,
            cell: DuelFieldCell | undefined,
            chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
            cancelable: boolean
          ) => defaultRuleSpecialSummonPrepare(action, cell, ["Attack", "Defense"], [], cancelable),
          execute: defaultRuleSpecialSummonExecute,
          settle: async () => true,
        },
      ] as CardActionBase<unknown>[],
    })
  );

  const def_ジャンク・フォアード = {
    name: "ジャンク・フォアード",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "特殊召喚",
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        validate: (action: CardAction<SummonPrepared>): DuelFieldCell[] | undefined => {
          const emptyCells = action.entity.controller.getAvailableMonsterZones();
          if (!emptyCells.length) {
            return;
          }

          return defaultRuleSpecialSummonValidate(action, ["Attack", "Defense"], []);
        },
        prepare: (
          action: CardAction<SummonPrepared>,
          cell: DuelFieldCell | undefined,
          chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
          cancelable: boolean
        ) => defaultRuleSpecialSummonPrepare(action, cell, ["Attack", "Defense"], [], cancelable),
        execute: defaultRuleSpecialSummonExecute,
        settle: async () => true,
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_ジャンク・フォアード);

  const def_ディアボリックガイ = {
    name: "Ｄ－ＨＥＲＯ ディアボリックガイ",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "①リクルート",
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        validate: (action: CardAction<undefined>): DuelFieldCell[] | undefined => {
          if (action.entity.controller.getDeckCell().cardEntities.filter((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ").length === 0) {
            return;
          }

          const availableCells = action.entity.controller.getAvailableMonsterZones();
          return availableCells.length > 0 ? [] : undefined;
        },
        prepare: async (action: CardAction<undefined>) => {
          await action.entity.banish(["Cost"], action.entity, action.entity.controller);
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromDeck"], prepared: undefined };
        },
        execute: async (myInfo: ChainBlockInfo<undefined>): Promise<boolean> => {
          const availableCells = myInfo.activator.getAvailableMonsterZones();
          if (!availableCells.length) {
            return false;
          }
          const newOne = myInfo.activator.getDeckCell().cardEntities.find((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ");
          if (!newOne) {
            return false;
          }
          await myInfo.activator.summon(newOne, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], myInfo.action.entity, false);
          return true;
        },
        settle: async () => true,
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_ディアボリックガイ);

  const def_ゾンビキャリア = {
    name: "ゾンビキャリア",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "①自己再生",
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        validate: (action: CardAction<undefined>): DuelFieldCell[] | undefined => {
          if (action.entity.controller.getHandCell().cardEntities.length === 0) {
            return;
          }

          const availableCells = action.entity.controller.getAvailableMonsterZones();
          return availableCells.length > 0 ? [] : undefined;
        },
        prepare: async (action: CardAction<undefined>) => {
          const hands = action.entity.controller.getHandCell().cardEntities;
          const cost = await action.entity.controller.duel.view.waitSelectEntities(
            action.entity.controller,
            hands,
            1,
            (list) => list.length === 1,
            "デッキトップに戻すカードを一枚選択。"
          );
          if (!cost) {
            throw new IllegalCancelError(action);
          }
          await cost[0].returnToDeck("Top", ["Cost"], action.entity, action.entity.controller);
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: async (myInfo: ChainBlockInfo<undefined>): Promise<boolean> => {
          // 同一チェーン中に墓地を離れていたら不可
          if (myInfo.action.entity.wasMovedAtCurrentChain) {
            return false;
          }
          const availableCells = myInfo.action.entity.controller.getAvailableMonsterZones();
          if (availableCells.length === 0) {
            return false;
          }
          await myInfo.activator.summon(myInfo.action.entity, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], myInfo.action.entity, false);
          myInfo.action.entity.info.willBeBanished = true;
          return true;
        },
        settle: async () => true,
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_ゾンビキャリア);

  const def_グローアップ・バルブ = {
    name: "グローアップ・バルブ",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "①自己再生",
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        isOnlyNTimesPerDuel: 1,
        validate: (action: CardAction<undefined>): DuelFieldCell[] | undefined => {
          if (action.entity.controller.getDeckCell().cardEntities.length === 0) {
            return;
          }

          const availableCells = action.entity.controller.getAvailableMonsterZones();
          return availableCells.length > 0 ? [] : undefined;
        },
        prepare: async (action: CardAction<undefined>) => {
          await action.entity.controller.getDeckCell().cardEntities[0].sendToGraveyard(["Cost"], action.entity, action.entity.controller);
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: async (myInfo: ChainBlockInfo<undefined>): Promise<boolean> => {
          // 同一チェーン中に墓地を離れていたら不可
          if (myInfo.action.entity.wasMovedAtCurrentChain) {
            return false;
          }
          const availableCells = myInfo.action.entity.controller.getAvailableMonsterZones();
          if (availableCells.length === 0) {
            return false;
          }
          await myInfo.activator.summon(myInfo.action.entity, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_グローアップ・バルブ);
  const def_終末の騎士 = {
    name: "終末の騎士",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "①墓地送り",
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        canExecuteOnDamageStep: true,
        validate: (action: CardAction<undefined>): DuelFieldCell[] | undefined => {
          const lastMoveLog = action.entity.moveLog.latestRecord;
          if (action.entity.face === "FaceDown") {
            return;
          }
          if (!action.entity.wasMovedAtPreviousChain) {
            return;
          }
          if (lastMoveLog.movedAs.union(["SpecialSummon", "NormalSummon"]).length === 0) {
            return;
          }
          if (action.entity.controller.getDeckCell().cardEntities.filter((card) => card.attr.includes("Dark")).length === 0) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SendToGraveyardFromDeck"], prepared: undefined };
        },
        execute: async (myInfo: ChainBlockInfo<undefined>): Promise<boolean> => {
          const choices = myInfo.action.entity.controller.getDeckCell().cardEntities.filter((card) => card.attr.includes("Dark"));
          if (choices.length === 0) {
            return false;
          }
          await myInfo.action.entity.field.sendToGraveyard(
            "墓地に送るモンスターを選択",
            myInfo.activator,
            choices,
            1,
            (list) => list.length === 1,
            ["Effect"],
            myInfo.action.entity,
            false
          );
          myInfo.activator.shuffleDeck();
          return true;
        },
        settle: async () => true,
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_終末の騎士);
  const def_マスマティシャン = {
    name: "マスマティシャン",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "①墓地送り",
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        validate: (action: CardAction<undefined>): DuelFieldCell[] | undefined => {
          if (action.entity.face === "FaceDown") {
            return;
          }
          if (!action.entity.moveLog.latestRecord.movedAs.includes("NormalSummon")) {
            return;
          }
          if (!action.entity.wasMovedAtPreviousChain) {
            return;
          }
          if (!action.entity.controller.getDeckCell().cardEntities.find((card) => (card.lvl ?? 5) < 5)) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SendToGraveyardFromDeck"], prepared: undefined };
        },
        execute: async (myInfo: ChainBlockInfo<undefined>): Promise<boolean> => {
          const choices = myInfo.activator.getDeckCell().cardEntities.filter((card) => (card.lvl ?? 5) < 5);
          if (choices.length === 0) {
            return false;
          }
          await myInfo.action.entity.field.sendToGraveyard(
            "墓地に送るモンスターを選択",
            myInfo.activator,
            choices,
            1,
            (list) => list.length === 1,
            ["Effect"],
            myInfo.action.entity,
            false
          );
          myInfo.activator.shuffleDeck();
          return true;
        },
        settle: async () => true,
      },
      {
        title: "②ドロー",
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        canExecuteOnDamageStep: true,
        validate: (action: CardAction<undefined>): DuelFieldCell[] | undefined => {
          if (action.entity.face === "FaceDown") {
            return;
          }
          if (!action.entity.moveLog.latestRecord.movedAs.includes("BattleDestroy")) {
            return;
          }
          if (!action.entity.wasMovedAtPreviousChain) {
            return;
          }
          if (action.entity.controller.getDeckCell().cardEntities.length === 0) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
        execute: async (myInfo: ChainBlockInfo<undefined>): Promise<boolean> => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_マスマティシャン);

  const def_ライトロード・ビーストウォルフ = {
    name: "ライトロード・ビースト ウォルフ",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "①自己再生",
        playType: "TriggerMandatoryEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        validate: (action: CardAction<undefined>): DuelFieldCell[] | undefined => {
          // 前回のチェーンで動いたかどうか
          if (!action.entity.wasMovedAtPreviousChain) {
            return;
          }
          // 前回のチェーンで動いたとき、デッキからだったかどうか
          if (action.entity.wasMovedFrom.cellType !== "Deck") {
            return;
          }
          return action.entity.controller.getAvailableMonsterZones().length > 0 ? [] : undefined;
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: async (myInfo: ChainBlockInfo<undefined>): Promise<boolean> => {
          // 同一チェーン中に墓地を離れていたら不可
          if (myInfo.action.entity.wasMovedAtCurrentChain) {
            return false;
          }
          const availableCells = myInfo.action.entity.controller.getAvailableMonsterZones();
          if (!availableCells.length) {
            return false;
          }
          if (myInfo.action.entity.fieldCell.cellType !== "Graveyard" && myInfo.action.entity.fieldCell.cellType !== "Banished") {
            return false;
          }
          if (myInfo.action.entity.face === "FaceDown") {
            return false;
          }
          await myInfo.activator.summon(myInfo.action.entity, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      },
    ] as CardActionBase<unknown>[],
  };
  result.push(def_ライトロード・ビーストウォルフ);

  const def_伝説の白石 = {
    name: "伝説の白石",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultNormalSummonAction,
      {
        title: "①サーチ",
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        validate: (action: CardAction<undefined>): DuelFieldCell[] | undefined => {
          // 前回のチェーンで動いたかどうか
          if (!action.entity.wasMovedAtPreviousChain) {
            return;
          }
          // 前回のチェーンで動いたとき、除外から動いていたら対象外（※墓地に戻すではこの手の効果は発動しない）
          if (action.entity.wasMovedFrom.cellType === "Banished") {
            return;
          }
          return action.entity.controller.getDeckCell().cardEntities.find((card) => card.nm === "青眼の白龍") ? [] : undefined;
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
        execute: async (myInfo: ChainBlockInfo<undefined>): Promise<boolean> => {
          // 青眼の白龍固定なので、一枚見つけたらそれでよい。
          const monster = myInfo.activator.getDeckCell().cardEntities.find((card) => card.nm === "青眼の白龍");
          if (!monster) {
            return false;
          }
          await monster.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.shuffleDeck();
          return true;
        },
        settle: async () => true,
      },
    ] as CardActionBase<unknown>[],
  };
  result.push(def_伝説の白石);

  const def_うららわらし = [
    {
      name: "灰流うらら",
      chainBlockTags: ["Draw", "SearchFromDeck", "SendToGraveyardFromDeck", "SpecialSummonFromDeck"],
    },
    {
      name: "屋敷わらし",
      chainBlockTags: ["BanishFromGraveyard", "SpecialSummonFromGraveyard", "AddToHandFromGraveyard"],
    },
  ] as { name: string; chainBlockTags: TEffectTag[] }[];

  def_うららわらし.forEach((item) => {
    result.push({
      name: item.name,
      actions: [
        defaultAttackAction,
        defaultBattlePotisionChangeAction,
        defaultNormalSummonAction,
        {
          title: "①無効化",
          playType: "QuickEffect",
          spellSpeed: "Quick",
          executableCells: ["Hand"],
          isOnlyNTimesPerTurn: true,
          validate: (action: CardAction<number>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>): DuelFieldCell[] | undefined => {
            if (chainBlockInfos.length === 0) {
              return;
            }

            const info = chainBlockInfos.slice(-1)[0];

            console.log(info);

            return info.chainBlockTags.union(item.chainBlockTags).length > 0 ? [] : undefined;
          },
          prepare: async (action: CardAction<number>, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
            await action.entity.sendToGraveyard(["Discard", "Cost"], action.entity, action.entity.controller);
            return { selectedEntities: [], chainBlockTags: ["NegateCardEffect"], prepared: chainBlockInfos.length };
          },
          execute: async (myInfo: ChainBlockInfo<number>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>): Promise<boolean> => {
            const info = chainBlockInfos[myInfo.prepared - 1];
            info.isNegatedEffectBy = myInfo.action as CardAction<unknown>;
            return true;
          },
          settle: async () => true,
        },
      ] as CardActionBase<unknown>[],
    });
  });

  ["翻弄するエルフの剣士", "ロードランナー", "氷結界の修験者"].forEach((name) => {
    result.push({
      name: name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultNormalSummonAction] as CardActionBase<unknown>[],
      continuousEffects: [
        createRegularProcFilterHandler(
          "①戦闘破壊耐性",
          "Monster",
          (source: DuelEntity) => [source],
          () => true,
          (source: DuelEntity) => {
            return [
              new ProcFilter(
                "①戦闘破壊耐性",
                () => true,
                true,
                source,
                () => true,
                ["BattleDestory"],
                (activator: Duelist, enemy: DuelEntity) => {
                  if (!enemy.status.isEffective) {
                    return true;
                  }
                  if ((enemy.atk ?? 0) < 1900) {
                    return true;
                  }
                  source.duel.log.info(`${source.toString()}は攻撃力1900以上のモンスターとの先頭では破壊されない。`, source.controller);
                  return false;
                }
              ),
            ];
          }
        ),
      ] as ContinuousEffectBase<unknown>[],
    });
  });

  return result;
};

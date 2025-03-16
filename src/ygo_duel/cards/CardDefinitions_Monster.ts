import { SystemError } from "@ygo_duel/class/Duel";
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
} from "@ygo_duel/functions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";

import type { CardDefinition } from "./CardDefinitions";
import { createSelfProcFilterContinuousEffect, type ContinuousEffectBase } from "@ygo_duel/class/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class/DuelProcFilter";

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
          validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
            const monsters = entity.field.getMonstersOnField();
            if (monsters.length == 0 || monsters.some((m) => m.controller === entity.controller)) {
              return undefined;
            }

            const emptyCells = entity.controller.getAvailableMonsterZones();
            return emptyCells.length > 0 ? emptyCells : undefined;
          },
          prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
            defaultRuleSpecialSummonPrepare(entity, cell, ["Attack", "Defense"], [], cancelable),
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
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          const emptyCells = entity.controller.getAvailableMonsterZones();
          return emptyCells.length > 0 ? emptyCells : undefined;
        },
        prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
          defaultRuleSpecialSummonPrepare(entity, cell, ["Attack", "Defense"], [], cancelable),
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
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          if (entity.controller.getDeckCell().cardEntities.filter((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ").length === 0) {
            return;
          }

          const availableCells = entity.controller.getAvailableMonsterZones();
          return availableCells.length > 0 ? [] : undefined;
        },
        prepare: async (entity: DuelEntity) => {
          await entity.banish(["Cost"], entity, entity.controller);
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromDeck"], prepared: undefined };
        },
        execute: async (entity: DuelEntity, activator: Duelist): Promise<boolean> => {
          const availableCells = activator.getAvailableMonsterZones();
          if (!availableCells.length) {
            return false;
          }
          const newOne = activator.getDeckCell().cardEntities.find((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ");
          if (!newOne) {
            return false;
          }
          await activator.summon(newOne, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], entity, false);
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
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          if (entity.controller.getHandCell().cardEntities.length === 0) {
            return;
          }

          const availableCells = entity.controller.getAvailableMonsterZones();
          return availableCells.length > 0 ? [] : undefined;
        },
        prepare: async (entity: DuelEntity) => {
          const hands = entity.controller.getHandCell().cardEntities;
          const cost = await entity.controller.duel.view.waitSelectEntities(
            entity.controller,
            hands,
            1,
            (list) => list.length === 1,
            "デッキトップに戻すカードを一枚選択。"
          );
          if (!cost) {
            throw new SystemError("キャンセル不可の行動がキャンセルされた。", entity);
          }
          await cost[0].returnToDeck("Top", ["Cost"], entity, entity.controller);
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: async (entity: DuelEntity, activator: Duelist): Promise<boolean> => {
          // 同一チェーン中に墓地を離れていたら不可
          if (activator.duel.clock.isSameChain(entity.wasMovedAt)) {
            return false;
          }
          const availableCells = entity.controller.getAvailableMonsterZones();
          if (availableCells.length === 0) {
            return false;
          }
          await activator.summon(entity, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], entity, false);
          entity.info.willBeBanished = true;
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
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          if (entity.controller.getDeckCell().cardEntities.length === 0) {
            return;
          }

          const availableCells = entity.controller.getAvailableMonsterZones();
          return availableCells.length > 0 ? [] : undefined;
        },
        prepare: async (entity: DuelEntity) => {
          await entity.controller.getDeckCell().cardEntities[0].sendToGraveyard(["Cost"], entity, entity.controller);
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: async (entity: DuelEntity, activator: Duelist): Promise<boolean> => {
          // 同一チェーン中に墓地を離れていたら不可
          if (activator.duel.clock.isSameChain(entity.wasMovedAt)) {
            return false;
          }
          const availableCells = entity.controller.getAvailableMonsterZones();
          if (availableCells.length === 0) {
            return false;
          }
          await activator.summon(entity, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], entity);
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
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          if (entity.wasMovedAs.union(["SpecialSummon", "NormalSummon"]).length === 0) {
            return;
          }
          if (!entity.field.duel.clock.isPreviousChain(entity.wasMovedAt)) {
            return;
          }
          if (entity.controller.getDeckCell().cardEntities.filter((card) => card.attr.includes("Dark")).length === 0) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SendToGraveyardFromDeck"], prepared: undefined };
        },
        execute: async (entity: DuelEntity, activator: Duelist): Promise<boolean> => {
          const choices = entity.controller.getDeckCell().cardEntities.filter((card) => card.attr.includes("Dark"));
          if (choices.length === 0) {
            return false;
          }
          await entity.field.sendToGraveyard("墓地に送るモンスターを選択", activator, choices, 1, (list) => list.length === 1, ["Effect"], entity, false);
          activator.shuffleDeck();
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
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          if (!entity.wasMovedAs.includes("NormalSummon")) {
            return;
          }
          if (!entity.isMoveAtPreviousChain) {
            return;
          }
          if (!entity.controller.getDeckCell().cardEntities.find((card) => (card.lvl ?? 5) < 5)) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SendToGraveyardFromDeck"], prepared: undefined };
        },
        execute: async (entity: DuelEntity, activator: Duelist): Promise<boolean> => {
          const choices = entity.controller.getDeckCell().cardEntities.filter((card) => (card.lvl ?? 5) < 5);
          if (choices.length === 0) {
            return false;
          }
          await entity.field.sendToGraveyard("墓地に送るモンスターを選択", activator, choices, 1, (list) => list.length === 1, ["Effect"], entity, false);
          activator.shuffleDeck();
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
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          if (!entity.wasMovedAs.includes("BattleDestroy")) {
            return;
          }
          if (!entity.isMoveAtPreviousChain) {
            return;
          }
          if (entity.controller.getDeckCell().cardEntities.length === 0) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
        execute: async (entity: DuelEntity, activator: Duelist): Promise<boolean> => {
          await activator.draw(1, entity, activator);

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
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          if (!entity.field.duel.clock.isPreviousChain(entity.wasMovedAt)) {
            return;
          }
          if (entity.wasMovedFrom?.cellType !== "Deck") {
            return;
          }
          return entity.controller.getAvailableMonsterZones().length > 0 ? [] : undefined;
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromGraveyard"], prepared: undefined };
        },
        execute: async (entity: DuelEntity, activator: Duelist): Promise<boolean> => {
          // 同一チェーン中に墓地を離れていたら不可
          if (activator.duel.clock.isSameChain(entity.wasMovedAt)) {
            return false;
          }
          const availableCells = entity.controller.getAvailableMonsterZones();
          if (!availableCells.length) {
            return false;
          }
          if (entity.fieldCell.cellType !== "Graveyard" && entity.fieldCell.cellType !== "Banished") {
            return false;
          }
          if (entity.face === "FaceDown") {
            return false;
          }
          await activator.summon(entity, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], entity);
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
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          if (!entity.field.duel.clock.isPreviousChain(entity.wasMovedAt)) {
            return;
          }
          if (entity.wasMovedFrom?.cellType === "Banished") {
            return;
          }
          return entity.controller.getDeckCell().cardEntities.find((card) => card.nm === "青眼の白龍") ? [] : undefined;
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
        execute: async (entity: DuelEntity, activator: Duelist): Promise<boolean> => {
          // 青眼の白龍固定なので、一枚見つけたらそれでよい。
          const monster = activator.getDeckCell().cardEntities.find((card) => card.nm === "青眼の白龍");
          if (!monster) {
            return false;
          }
          await monster.addToHand(["Effect"], entity, activator);
          activator.shuffleDeck();
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
          validate: (entity: DuelEntity, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>): DuelFieldCell[] | undefined => {
            if (chainBlockInfos.length === 0) {
              return;
            }

            const info = chainBlockInfos.slice(-1)[0];

            console.log(info);

            return info.chainBlockTags.union(item.chainBlockTags).length > 0 ? [] : undefined;
          },
          prepare: async (entity: DuelEntity, myInfo: ChainBlockInfo<undefined>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
            await entity.sendToGraveyard(["Discard", "Cost"], entity, entity.controller);
            return { selectedEntities: [], chainBlockTags: ["NegateCardEffect"], prepared: chainBlockInfos.length };
          },
          execute: async (
            entity: DuelEntity,
            activator: Duelist,
            myInfo: ChainBlockInfo<number>,
            chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>
          ): Promise<boolean> => {
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
        createSelfProcFilterContinuousEffect(
          "①戦闘破壊耐性",
          "Monster",
          () => true,
          (entity: DuelEntity) => {
            return new ProcFilter(
              "①戦闘破壊耐性",
              "BattleDestory",
              (activator: Duelist, enemy: DuelEntity) => {
                if (!enemy.status.isEffective) {
                  return true;
                }
                if ((enemy.atk ?? 0) < 1900) {
                  return true;
                }
                entity.duel.log.info(`${entity.toString()}は攻撃力1900以上のモンスターとの先頭では破壊されない。`, entity.controller);
                return false;
              },
              () => true,
              ["LeavesTheField", "Set"],
              entity
            );
          }
        ),
      ] as ContinuousEffectBase<unknown>[],
    });
  });

  return result;
};

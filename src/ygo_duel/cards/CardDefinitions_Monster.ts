import { SystemError } from "@ygo_duel/class/Duel";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalSummonAction,
  getDefaultSyncroSummonAction,
} from "@ygo_duel/functions/DefaultCardAction";

export type CardDefinition = {
  name: string;
  actions: CardActionBase<unknown>[];
};

export const createCardDefinitions_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const action_サイバー・ドラゴン = {
    title: "特殊召喚",
    playType: "SpecialSummon",
    spellSpeed: "Normal",
    executableCells: ["Hand"],
    validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
      const monsters = entity.field.getMonstersOnField();
      if (monsters.length == 0 || monsters.some((m) => m.controller === entity.controller)) {
        return undefined;
      }

      const emptyCells = entity.controller.getAvailableMonsterZones();
      return emptyCells.length > 0 ? emptyCells : undefined;
    },
    prepare: async () => true,
    execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell): Promise<boolean> => {
      const emptyCells = entity.controller.getAvailableMonsterZones();
      await entity.field.summon(entity, ["Attack", "Defense"], cell ? [cell] : emptyCells, "SpecialSummon", ["Rule"], entity, undefined, true);
      entity.controller.specialSummonCount++;
      return true;
    },
  };

  const def_サイバー・ドラゴン = {
    name: "サイバー・ドラゴン",
    actions: [defaultNormalSummonAction, defaultAttackAction, defaultBattlePotisionChangeAction, action_サイバー・ドラゴン] as CardActionBase<unknown>[],
  };

  result.push(def_サイバー・ドラゴン);

  const def_アンノウン・シンクロン = {
    name: "アンノウン・シンクロン",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      { ...action_サイバー・ドラゴン, isOnlyNTimesPerDuel: 1 },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_アンノウン・シンクロン);

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
          console.log(entity);
          await entity.banish(["Cost"], entity, entity.controller);
        },
        execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell): Promise<boolean> => {
          const availableCells = entity.controller.getAvailableMonsterZones();
          if (!availableCells.length) {
            return false;
          }
          const newOne = entity.controller.getDeckCell().cardEntities.find((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ");
          if (!newOne) {
            return false;
          }
          await entity.field.summon(newOne, ["Attack", "Defense"], cell ? [cell] : availableCells, "SpecialSummon", ["Effect"], entity);
          entity.controller.specialSummonCount++;
          return true;
        },
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
          return availableCells.length > 0 ? availableCells : undefined;
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
          return true;
        },
        execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell): Promise<boolean> => {
          // 同一チェーン中に墓地を離れていたら不可
          if (activater.duel.clock.isSameChain(entity.wasMovedAt)) {
            return false;
          }
          const availableCells = entity.controller.getAvailableMonsterZones();
          if (availableCells.length === 0) {
            return false;
          }
          await entity.field.summon(entity, ["Attack", "Defense"], cell ? [cell] : availableCells, "SpecialSummon", ["Effect"], entity);
          entity.info.willBeBanished = true;
          entity.controller.specialSummonCount++;
          return true;
        },
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
          return availableCells.length > 0 ? availableCells : undefined;
        },
        prepare: async (entity: DuelEntity) => {
          await entity.controller.getDeckCell().cardEntities[0].sendToGraveyard(["Cost"], entity, entity.controller);
          return true;
        },
        execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell): Promise<boolean> => {
          // 同一チェーン中に墓地を離れていたら不可
          if (activater.duel.clock.isSameChain(entity.wasMovedAt)) {
            return false;
          }
          const availableCells = entity.controller.getAvailableMonsterZones();
          if (availableCells.length === 0) {
            return false;
          }
          await entity.field.summon(entity, ["Attack", "Defense"], cell ? [cell] : availableCells, "SpecialSummon", ["Effect"], entity, activater);
          entity.info.willBeBanished = true;
          entity.controller.specialSummonCount++;
          return true;
        },
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
        prepare: () => true,
        execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
          const choices = entity.controller.getDeckCell().cardEntities.filter((card) => card.attr.includes("Dark"));
          if (choices.length === 0) {
            return false;
          }
          await entity.field.sendToGraveyard("墓地に送るモンスターを選択", activater, choices, 1, (list) => list.length === 1, ["Effect"], entity, false);
          activater.shuffleDeck();
          return true;
        },
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
          if (!entity.field.duel.clock.isPreviousChain(entity.wasMovedAt)) {
            return;
          }
          if (entity.controller.getDeckCell().cardEntities.filter((card) => (card.lvl ?? 5) < 5)) {
            return;
          }
          return [];
        },
        prepare: () => true,
        execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
          const choices = entity.controller.getDeckCell().cardEntities.filter((card) => (card.lvl ?? 5) < 5);
          if (choices.length === 0) {
            return false;
          }
          await entity.field.sendToGraveyard("墓地に送るモンスターを選択", activater, choices, 1, (list) => list.length === 1, ["Effect"], entity, false);
          activater.shuffleDeck();
          return true;
        },
      },
      {
        title: "②ドロー",
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          if (!entity.wasMovedAs.includes("BattleDestroy")) {
            return;
          }
          if (!entity.field.duel.clock.isPreviousChain(entity.wasMovedAt)) {
            return;
          }
          if (entity.controller.getDeckCell().cardEntities.length === 0) {
            return;
          }
          return [];
        },
        prepare: () => true,
        execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
          await activater.draw(1, entity, activater);

          return true;
        },
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_マスマティシャン);

  const def_大地の騎士ガイアナイト = {
    name: "大地の騎士ガイアナイト",
    actions: [defaultAttackAction, defaultBattlePotisionChangeAction, getDefaultSyncroSummonAction()] as CardActionBase<unknown>[],
  };
  result.push(def_大地の騎士ガイアナイト);
  result.push({ ...def_大地の騎士ガイアナイト, name: "スクラップ・デスデーモン" });

  const def_ナチュル・ガオドレイク = {
    name: "ナチュル・ガオドレイク",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      getDefaultSyncroSummonAction(
        (tuners) => tuners.length === 1 && tuners.every((tuner) => tuner.attr.some((a) => a === "Earth")),
        (nonTuners) => nonTuners.length > 0 && nonTuners.every((nonTuner) => nonTuner.attr.some((a) => a === "Earth"))
      ),
    ] as CardActionBase<unknown>[],
  };
  result.push(def_ナチュル・ガオドレイク);

  console.log(result);

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
          const availableCells = entity.controller.getAvailableMonsterZones();
          console.log(availableCells);
          return availableCells.length > 0 ? [] : undefined;
        },
        prepare: async (entity: DuelEntity) => {
          console.log(entity);
          return true;
        },
        execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell): Promise<boolean> => {
          // 同一チェーン中に墓地を離れていたら不可
          if (activater.duel.clock.isSameChain(entity.wasMovedAt)) {
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
          await entity.field.summon(entity, ["Attack", "Defense"], cell ? [cell] : availableCells, "SpecialSummon", ["Effect"], entity);
          entity.controller.specialSummonCount++;
          return true;
        },
      },
    ] as CardActionBase<unknown>[],
  };
  result.push(def_ライトロード・ビーストウォルフ);

  console.log(result);

  return result;
};

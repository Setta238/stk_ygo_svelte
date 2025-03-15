import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { SystemError } from "@ygo_duel/class/Duel";
import type { CardAction, CardActionBase, ChainBlockInfo, TChainBlockType } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity, type TDestoryCauseReason } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell, DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalSummonAction,
  defaultRuleSpecialSummonExecute,
  defaultRuleSpecialSummonPrepare,
  getDefalutRecruiterAction,
  getDefaultSyncroSummonAction,
} from "@ygo_duel/functions/DefaultCardAction";

import {} from "@stk_utils/funcs/StkArrayUtils";

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
    prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultRuleSpecialSummonPrepare(entity, cell, ["Attack", "Defense"], [], cancelable),
    execute: defaultRuleSpecialSummonExecute,
    settle: async () => true,
  };

  const def_サイバー・ドラゴン = {
    name: "サイバー・ドラゴン",
    actions: [defaultNormalSummonAction, defaultAttackAction, defaultBattlePotisionChangeAction, action_サイバー・ドラゴン] as CardActionBase<unknown>[],
  };
  result.push(def_サイバー・ドラゴン);

  const def_六武衆のご隠居 = {
    name: "六武衆のご隠居",
    actions: [defaultNormalSummonAction, defaultAttackAction, defaultBattlePotisionChangeAction, action_サイバー・ドラゴン] as CardActionBase<unknown>[],
  };

  result.push(def_六武衆のご隠居);

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
          await entity.banish(["Cost"], entity, entity.controller);
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromDeck"], prepared: undefined };
        },
        execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
          const availableCells = activater.getAvailableMonsterZones();
          if (!availableCells.length) {
            return false;
          }
          const newOne = activater.getDeckCell().cardEntities.find((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ");
          if (!newOne) {
            return false;
          }
          await entity.field.summon(newOne, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], entity, activater, false);
          activater.specialSummonCount++;
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
        execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
          // 同一チェーン中に墓地を離れていたら不可
          if (activater.duel.clock.isSameChain(entity.wasMovedAt)) {
            return false;
          }
          const availableCells = entity.controller.getAvailableMonsterZones();
          if (availableCells.length === 0) {
            return false;
          }
          await entity.field.summon(entity, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], entity, activater, false);
          entity.info.willBeBanished = true;
          activater.specialSummonCount++;
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
        execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
          // 同一チェーン中に墓地を離れていたら不可
          if (activater.duel.clock.isSameChain(entity.wasMovedAt)) {
            return false;
          }
          const availableCells = entity.controller.getAvailableMonsterZones();
          if (availableCells.length === 0) {
            return false;
          }
          await entity.field.summon(entity, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], entity, activater);
          activater.specialSummonCount++;
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
        execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
          const choices = entity.controller.getDeckCell().cardEntities.filter((card) => card.attr.includes("Dark"));
          if (choices.length === 0) {
            return false;
          }
          await entity.field.sendToGraveyard("墓地に送るモンスターを選択", activater, choices, 1, (list) => list.length === 1, ["Effect"], entity, false);
          activater.shuffleDeck();
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
        execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
          const choices = entity.controller.getDeckCell().cardEntities.filter((card) => (card.lvl ?? 5) < 5);
          if (choices.length === 0) {
            return false;
          }
          await entity.field.sendToGraveyard("墓地に送るモンスターを選択", activater, choices, 1, (list) => list.length === 1, ["Effect"], entity, false);
          activater.shuffleDeck();
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
          return { selectedEntities: [], chainBlockTags: ["AddToHandFromDeck"], prepared: undefined };
        },
        execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
          await activater.draw(1, entity, activater);

          return true;
        },
        settle: async () => true,
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
        execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
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
          await entity.field.summon(entity, ["Attack", "Defense"], availableCells, "SpecialSummon", ["Effect"], entity);
          entity.controller.specialSummonCount++;
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
          return { selectedEntities: [], chainBlockTags: ["AddToHandFromDeck"], prepared: undefined };
        },
        execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
          // 青眼の白龍固定なので、一枚見つけたらそれでよい。
          const monster = activater.getDeckCell().cardEntities.find((card) => card.nm === "青眼の白龍");
          if (!monster) {
            return false;
          }
          await monster.addToHand(["Effect"], entity, activater);
          activater.shuffleDeck();
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
      chainBlockTags: ["AddToHandFromDeck", "SendToGraveyardFromDeck", "SpecialSummonFromDeck"],
    },
    {
      name: "屋敷わらし",
      chainBlockTags: ["SendToGraveyardFromDeck", "SpecialSummonFromGraveyard", "AddToHandFromGraveyard"],
    },
  ] as { name: string; chainBlockTags: TChainBlockType[] }[];

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
            activater: Duelist,
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

  [
    {
      name: "キラー・ポテト",
      filter: (card: DuelEntity) => card.attr.includes("Dark") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["EffectDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "キラー・トマト",
      filter: (card: DuelEntity) => card.attr.includes("Dark") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "巨大ネズミ",
      filter: (card: DuelEntity) => card.attr.includes("Earth") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "グリズリーマザー",
      filter: (card: DuelEntity) => card.attr.includes("Water") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "シャインエンジェル",
      filter: (card: DuelEntity) => card.attr.includes("Light") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ドラゴンフライ",
      filter: (card: DuelEntity) => card.attr.includes("Wind") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ＵＦＯタートル",
      filter: (card: DuelEntity) => card.attr.includes("Fire") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "荒野の女戦士",
      filter: (card: DuelEntity) => card.attr.includes("Earth") && card.type.includes("Warrior") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "リトル・トルーパー",
      filter: (card: DuelEntity) => card.type.includes("Warrior") && (card.lvl ?? 9999) < 3,
      qtyList: [1],
      posList: ["Set"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard", "Banished"] as DuelFieldCellType[],
    },
    {
      name: "破面竜",
      filter: (card: DuelEntity) => card.type.includes("Warrior") && (card.def ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "共鳴虫",
      filter: (card: DuelEntity) => card.type.includes("Insect") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ピラミッド・タートル",
      filter: (card: DuelEntity) => card.type.includes("Zombie") && (card.def ?? 9999) <= 2000,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ユーフォロイド",
      filter: (card: DuelEntity) => card.type.includes("Machine") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ヘル・セキュリティ",
      filter: (card: DuelEntity) => card.type.includes("Fiend") && (card.lvl ?? 9999) === 1,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ガスタ・イグル",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("ガスタ") && (card.status.monsterCategories ?? []).includes("Tuner"),
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "幻影の魔術士",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("ＨＥＲＯ") && (card.atk ?? 9999) <= 1000,
      qtyList: [1],
      posList: ["Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ジェネクス・サーチャー",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("ジェネクス") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "紫炎の足軽",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("六武衆") && (card.lvl ?? 12) <= 3,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "スレイブ・エイプ",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("剣闘獣") && (card.lvl ?? 12) <= 4,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ゼンマイハニー",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("ゼンマイ") && (card.lvl ?? 12) <= 4,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ＸＸ－セイバー エマーズブレイド",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("Ｘ－セイバー") && (card.lvl ?? 12) <= 4,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "軍隊竜",
      filter: (card: DuelEntity) => card.nm === "軍隊竜",
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "アサルト・ガンドッグ",
      filter: (card: DuelEntity) => card.nm === "アサルト・ガンドッグ",
      qtyList: [1, 2, 3, 4, 5],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ハイエナ",
      filter: (card: DuelEntity) => card.nm === "ハイエナ",
      qtyList: [1, 2, 3, 4, 5],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
  ].forEach((item) => {
    result.push({
      name: item.name,
      actions: [
        getDefalutRecruiterAction(item.filter, item.qtyList, item.posList, item.destoryTypes, item.executableCells),
        defaultAttackAction,
        defaultBattlePotisionChangeAction,
        defaultNormalSummonAction,
      ] as CardActionBase<unknown>[],
    });
  });
  return result;
};

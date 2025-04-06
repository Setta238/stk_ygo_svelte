import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity, type TDestoryCauseReason } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultNormalSummonAction } from "@ygo_duel/cards/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "./CardDefinitions";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";

const getDefalutRecruiterAction = (
  monsterFilter: (monsters: DuelEntity) => boolean,
  qtyList: number[],
  posList: TBattlePosition[],
  destoryTypes: TDestoryCauseReason[],
  executableCells: DuelFieldCellType[]
): CardActionDefinition<undefined> => {
  return {
    title: "①リクルート",
    isMandatory: false,
    playType: "TriggerEffect",
    spellSpeed: "Normal",
    executableCells: executableCells,
    executablePeriods: destoryTypes.includes("EffectDestroy") ? [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys] : ["b1DEnd", "b2DEnd"],
    executableDuelistTypes: ["Controller"],
    validate: (myInfo) => {
      if (!myInfo.action.entity.wasMovedAtPreviousChain) {
        console.log(myInfo.action.entity.toString(), myInfo);
        return;
      }
      if (!myInfo.action.entity.moveLog.latestRecord.movedAs.union(destoryTypes).length) {
        console.log(myInfo.action.entity.toString(), myInfo);
        return;
      }
      const monsters = myInfo.activator.getDeckCell().cardEntities.filter(monsterFilter);
      if (monsters.length === 0) {
        console.log(myInfo.action.entity.toString(), myInfo);
        return;
      }

      if (
        !monsters.some((monster) =>
          posList.some(
            (pos) =>
              myInfo.activator.canSummon(myInfo.activator, monster, myInfo.action, "SpecialSummon", pos, []) &&
              monster.canBeSummoned(myInfo.activator, myInfo.action, "SpecialSummon", pos, [], false)
          )
        )
      ) {
        console.log(myInfo.action.entity.toString(), myInfo);
        return;
      }
      return [];
    },
    prepare: async () => {
      return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromDeck"], prepared: undefined };
    },
    execute: async (myInfo) => {
      const monsters = myInfo.activator.getDeckCell().cardEntities.filter(monsterFilter);
      if (monsters.length === 0) {
        return false;
      }
      const selectedList = await myInfo.action.entity.field.duel.view.waitSelectEntities(
        myInfo.activator,
        monsters,
        qtyList.length === 1 ? qtyList[0] : -1,
        (list) => qtyList.includes(list.length),
        "特殊召喚するモンスターを選択",
        false
      );

      if (!selectedList) {
        throw new Error("illegal state");
      }

      for (const monster of selectedList) {
        await myInfo.activator.summon(monster, posList, myInfo.activator.getAvailableMonsterZones(), "SpecialSummon", ["Effect"], myInfo.action.entity, false);
      }

      myInfo.activator.getDeckCell().shuffle();

      return true;
    },
    settle: async () => true,
  };
};

export const createCardDefinitions_Monster_Preset_Recruiter = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

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
      filter: (card: DuelEntity) => card.attr.includes("Earth") && card.types.includes("Warrior") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "リトル・トルーパー",
      filter: (card: DuelEntity) => card.types.includes("Warrior") && (card.lvl ?? 9999) < 3,
      qtyList: [1],
      posList: ["Set"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard", "Banished"] as DuelFieldCellType[],
    },
    {
      name: "破面竜",
      filter: (card: DuelEntity) => card.types.includes("Warrior") && (card.def ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "共鳴虫",
      filter: (card: DuelEntity) => card.types.includes("Insect") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ピラミッド・タートル",
      filter: (card: DuelEntity) => card.types.includes("Zombie") && (card.def ?? 9999) <= 2000,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ユーフォロイド",
      filter: (card: DuelEntity) => card.types.includes("Machine") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destoryTypes: ["BattleDestroy"] as TDestoryCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ヘル・セキュリティ",
      filter: (card: DuelEntity) => card.types.includes("Fiend") && (card.lvl ?? 9999) === 1,
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
      ] as CardActionDefinition<unknown>[],
    });
  });
  return result;
};

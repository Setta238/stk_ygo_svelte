import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity, type TDestoryCauseReason } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalSummonAction,
  getDefalutRecruiterAction,
} from "@ygo_duel/functions/DefaultCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { CardDefinition } from "./CardDefinitions";

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

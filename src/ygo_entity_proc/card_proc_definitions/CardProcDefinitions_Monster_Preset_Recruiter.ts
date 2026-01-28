import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { DuelEntity, type TDestroyCauseReason } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";

export default function* generate(): Generator<EntityProcDefinition> {
  yield* [
    {
      name: "キラー・ポテト",
      filter: (card: DuelEntity) => card.attr.includes("Dark") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destroyTypes: ["Effect"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "キラー・トマト",
      filter: (card: DuelEntity) => card.attr.includes("Dark") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "巨大ネズミ",
      filter: (card: DuelEntity) => card.attr.includes("Earth") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "グリズリーマザー",
      filter: (card: DuelEntity) => card.attr.includes("Water") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "シャインエンジェル",
      filter: (card: DuelEntity) => card.attr.includes("Light") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ドラゴンフライ",
      filter: (card: DuelEntity) => card.attr.includes("Wind") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ＵＦＯタートル",
      filter: (card: DuelEntity) => card.attr.includes("Fire") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "荒野の女戦士",
      filter: (card: DuelEntity) => card.attr.includes("Earth") && card.types.includes("Warrior") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "リトル・トルーパー",
      filter: (card: DuelEntity) => card.types.includes("Warrior") && (card.lvl ?? 9999) < 3,
      qtyList: [1],
      posList: ["Set"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard", "Banished"] as DuelFieldCellType[],
    },
    {
      name: "破面竜",
      filter: (card: DuelEntity) => card.types.includes("Warrior") && (card.def ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "共鳴虫",
      filter: (card: DuelEntity) => card.types.includes("Insect") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ピラミッド・タートル",
      filter: (card: DuelEntity) => card.types.includes("Zombie") && (card.def ?? 9999) <= 2000,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ユーフォロイド",
      filter: (card: DuelEntity) => card.types.includes("Machine") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ヘル・セキュリティ",
      filter: (card: DuelEntity) => card.types.includes("Fiend") && (card.lvl ?? 9999) === 1,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ガスタ・イグル",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("ガスタ") && (card.status.monsterCategories ?? []).includes("Tuner"),
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "幻影の魔術士",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("HERO") && (card.atk ?? 9999) <= 1000,
      qtyList: [1],
      posList: ["Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ジェネクス・サーチャー",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("ジェネクス") && (card.atk ?? 9999) <= 1500,
      qtyList: [1],
      posList: ["Attack"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "紫炎の足軽",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("六武衆") && (card.lvl ?? 12) <= 3,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "スレイブ・エイプ",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("剣闘獣") && (card.lvl ?? 12) <= 4,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ゼンマイハニー",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("ゼンマイ") && (card.lvl ?? 12) <= 4,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ＸＸ－セイバー エマーズブレイド",
      filter: (card: DuelEntity) => (card.status.nameTags ?? []).includes("X-セイバー") && (card.lvl ?? 12) <= 4,
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "軍隊竜",
      filter: (card: DuelEntity) => card.nm === "軍隊竜",
      qtyList: [1],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "アサルト・ガンドッグ",
      filter: (card: DuelEntity) => card.nm === "アサルト・ガンドッグ",
      qtyList: [1, 2, 3, 4, 5],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
    {
      name: "ハイエナ",
      filter: (card: DuelEntity) => card.nm === "ハイエナ",
      qtyList: [1, 2, 3, 4, 5],
      posList: ["Attack", "Defense"] as TBattlePosition[],
      destroyTypes: ["Battle"] as TDestroyCauseReason[],
      executableCells: ["Graveyard"] as DuelFieldCellType[],
    },
  ].map((item): EntityProcDefinition => {
    return {
      name: item.name,
      actions: [
        {
          title: "①リクルート",
          isMandatory: false,
          playType: "TriggerEffect",
          spellSpeed: "Normal",
          executableCells: item.executableCells,
          executablePeriods: item.destroyTypes.includes("Effect") ? [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys] : ["b1DEnd", "b2DEnd"],
          executableDuelistTypes: ["Controller"],
          fixedTags: ["SpecialSummonFromDeck"],
          meetsConditions: (myInfo) =>
            myInfo.action.entity.wasMovedAtPreviousChain &&
            myInfo.action.entity.moveLog.latestRecord.movedAs.includes("Destroy") &&
            myInfo.action.entity.moveLog.latestRecord.movedAs.union(item.destroyTypes).length > 0,
          canExecute: (myInfo) => {
            const cells = myInfo.activator.getMonsterZones();
            const list = myInfo.activator.getEnableSummonList(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              myInfo.activator
                .getDeckCell()
                .cardEntities.filter(item.filter)
                .filter((card) => card.kind === "Monster")
                .filter((card) => card.canBeTargetOfEffect(myInfo))
                .map((monster) => {
                  return { monster, posList: item.posList, cells };
                }),
              [],
              false,
            );
            return list.length > 0;
          },
          prepare: defaultPrepare,
          execute: async (myInfo) => {
            const monsters = myInfo.activator.getDeckCell().cardEntities.filter(item.filter);

            const cells = myInfo.activator.getMonsterZones();
            const monster = await myInfo.activator.summonMany(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              monsters.map((lvl1) => {
                return { monster: lvl1, posList: item.posList, cells };
              }),
              [],
              false,
              item.qtyList.length > 1 ? undefined : item.qtyList[0],
              (summoned) => item.qtyList.includes(summoned.length),
              false,
            );
            if (!monster) {
              return false;
            }
            myInfo.activator.getDeckCell().shuffle();

            return true;
          },
          settle: async () => true,
        },
      ],
    };
  });
}

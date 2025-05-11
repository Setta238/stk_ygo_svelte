import { defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition, FusionMaterialInfo } from "@ygo_duel/class/DuelEntityDefinition";
export default function* generate(): Generator<EntityProcDefinition> {
  const baseDefinitions: { name: string; materialInfos: FusionMaterialInfo[] }[] = [
    {
      name: "カルボナーラ戦士",
      materialInfos: [
        { type: "Name", cardName: "マグネッツ１号", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "マグネッツ２号", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "クリッチー",
      materialInfos: [
        { type: "Name", cardName: "クリッター", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "黒き森のウィッチ", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "スケルゴン",
      materialInfos: [
        { type: "Name", cardName: "メデューサの亡霊", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "暗黒の竜王", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "スチームジャイロイド",
      materialInfos: [
        { type: "Name", cardName: "ジャイロイド", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "スチームロイド", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "バラに棲む悪霊",
      materialInfos: [
        { type: "Name", cardName: "グレムリン", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "スネーク・パーム", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "バロックス",
      materialInfos: [
        { type: "Name", cardName: "キラーパンダ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "ガーゴイル", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "フュージョニスト",
      materialInfos: [
        { type: "Name", cardName: "プチテンシ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "スリーピィ", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "ブラキオレイドス",
      materialInfos: [
        { type: "Name", cardName: "二頭を持つキング・レックス", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "屍を貪る竜", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "プラグティカル",
      materialInfos: [
        { type: "Name", cardName: "トラコドン", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "フレイム・ヴァイパー", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "マブラス",
      materialInfos: [
        { type: "Name", cardName: "タイホーン", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "邪炎の翼", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "ミノケンタウロス",
      materialInfos: [
        { type: "Name", cardName: "ミノタウルス", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "ケンタウロス", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "暗黒火炎龍",
      materialInfos: [
        { type: "Name", cardName: "火炎草", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "プチリュウ", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "炎の騎士 キラー",
      materialInfos: [
        { type: "Name", cardName: "モンスター・エッグ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "スティング", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "炎の剣士",
      materialInfos: [
        { type: "Name", cardName: "炎を操る者", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "伝説の剣豪 ＭＡＳＡＫＩ", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "音楽家の帝王",
      materialInfos: [
        { type: "Name", cardName: "黒き森のウィッチ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "ハイ・プリーステス", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "金色の魔象",
      materialInfos: [
        { type: "Name", cardName: "メデューサの亡霊", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "ドラゴン・ゾンビ", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "紅陽鳥",
      materialInfos: [
        { type: "Name", cardName: "セイント・バード", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "スカイ・ハンター", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "轟きの大海蛇",
      materialInfos: [
        { type: "Name", cardName: "魔法のランプ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "ひょうすべ", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "黒き人食い鮫",
      materialInfos: [
        { type: "Name", cardName: "シーカーメン", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "キラー・ブロッブ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "海原の女戦士", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "砂の魔女",
      materialInfos: [
        { type: "Name", cardName: "岩石の巨兵", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "エンシェント・エルフ", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "裁きの鷹",
      materialInfos: [
        { type: "Name", cardName: "冠を戴く蒼き翼", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "コケ", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "裁きを下す女帝",
      materialInfos: [
        { type: "Name", cardName: "女王の影武者", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "響女", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "朱雀",
      materialInfos: [
        { type: "Name", cardName: "赤き剣のライムンドス", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "炎の魔神", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "深海に潜むサメ",
      materialInfos: [
        { type: "Name", cardName: "神魚", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "舌魚", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "水陸両用バグロス",
      materialInfos: [
        { type: "Name", cardName: "陸戦型 バグロス", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "海を守る戦士", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "戦場の死装束",
      materialInfos: [
        { type: "Name", cardName: "音女", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "斬首の美女", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "魔装騎士ドラゴネス",
      materialInfos: [
        { type: "Name", cardName: "アーメイル", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "一眼の盾竜", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "魔導騎士ギルティア",
      materialInfos: [
        { type: "Name", cardName: "冥界の番人", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "王座の守護者", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "雷神の怒り",
      materialInfos: [
        { type: "Name", cardName: "エンゼル・イヤーズ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "メガ・サンダーボール", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "カイザー・ドラゴン",
      materialInfos: [
        { type: "Name", cardName: "砦を守る翼竜", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "フェアリー・ドラゴン", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "スカルビショップ",
      materialInfos: [
        { type: "Name", cardName: "悪魔の知恵", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "魔天老", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "デビル・ボックス",
      materialInfos: [
        { type: "Name", cardName: "マーダーサーカス", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "ドリーム・ピエロ", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "ヒューマノイド・ドレイク",
      materialInfos: [
        { type: "Name", cardName: "ワームドレイク", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "ヒューマノイド・スライム", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "ブラック・デーモンズ・ドラゴン",
      materialInfos: [
        { type: "Name", cardName: "デーモンの召喚", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "真紅眼の黒竜", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "マスター・オブ・ＯＺ",
      materialInfos: [
        { type: "Name", cardName: "ビッグ・コアラ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "デス・カンガルー", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "メテオ・ブラック・ドラゴン",
      materialInfos: [
        { type: "Name", cardName: "真紅眼の黒竜", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "メテオ・ドラゴン", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "召喚獣メガラニカ",
      materialInfos: [
        { type: "Name", cardName: "召喚師アレイスター", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "地属性モンスター", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "聖女ジャンヌ",
      materialInfos: [
        { type: "Name", cardName: "慈悲深き修道女", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "堕天使マリー", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "青眼の究極竜",
      materialInfos: [{ type: "Name", cardName: "青眼の白龍", qtyLowerBound: 3, qtyUpperBound: 3 }],
    },
    {
      name: "千年竜",
      materialInfos: [
        { type: "Name", cardName: "時の魔術師", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "ベビードラゴン", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "双頭の雷龍",
      materialInfos: [{ type: "Name", cardName: "サンダー・ドラゴン", qtyLowerBound: 2, qtyUpperBound: 2 }],
    },
    {
      name: "迷宮の魔戦車",
      materialInfos: [
        { type: "Name", cardName: "ギガテック・ウルフ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "キャノン・ソルジャー", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "竜騎士ガイア",
      materialInfos: [
        { type: "Name", cardName: "暗黒騎士ガイア", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "カース・オブ・ドラゴン", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "アクア・ドラゴン",
      materialInfos: [
        { type: "Name", cardName: "フェアリー・ドラゴン", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "海原の女戦士", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "アンデット・ウォーリアー",
      materialInfos: [
        { type: "Name", cardName: "ワイト", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "格闘戦士アルティメーター", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "カオス・ウィザード",
      materialInfos: [
        { type: "Name", cardName: "ホーリー・エルフ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "黒魔族のカーテン", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "クワガー・ヘラクレス",
      materialInfos: [
        { type: "Name", cardName: "クワガタ・アルファ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "ヘラクレス・ビートル", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "ソウル・ハンター",
      materialInfos: [
        { type: "Name", cardName: "ランプの魔人", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "異次元からの侵略者", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "デス・バード",
      materialInfos: [
        { type: "Name", cardName: "タクヒ", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "髑髏の寺院", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "フラワー・ウルフ",
      materialInfos: [
        { type: "Name", cardName: "シルバー・フォング", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "魔界のイバラ", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "フレイム・ゴースト",
      materialInfos: [
        { type: "Name", cardName: "ワイト", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "マグマン", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "マリン・ビースト",
      materialInfos: [
        { type: "Name", cardName: "水の魔導師", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "ベヒゴン", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "メカ・ザウルス",
      materialInfos: [
        { type: "Name", cardName: "ミスター・ボンバー", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "二頭を持つキング・レックス", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "メタル・ドラゴン",
      materialInfos: [
        { type: "Name", cardName: "鋼鉄の巨神像", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "レッサー・ドラゴン", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "レア・フィッシュ",
      materialInfos: [
        { type: "Name", cardName: "フュージョニスト", qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Name", cardName: "恍惚の人魚", qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "無の畢竟 オールヴェイン",
      materialInfos: [{ type: "Filter", filter: (entity) => entity.status.monsterCategories?.includes("Normal") ?? false, qtyLowerBound: 2, qtyUpperBound: 2 }],
    },
    {
      name: "テセウスの魔棲物",
      materialInfos: [{ type: "Filter", filter: (entity) => entity.status.monsterCategories?.includes("Tuner") ?? false, qtyLowerBound: 2, qtyUpperBound: 2 }],
    },
    {
      name: "ジェムナイト・ジルコニア",
      materialInfos: [
        { type: "Filter", filter: (entity) => entity.status.nameTags?.includes("ジェムナイト") ?? false, qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Filter", filter: (entity) => entity.types.includes("Rock") ?? false, qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "メタルフォーゼ・アダマンテ",
      materialInfos: [
        { type: "Filter", filter: (entity) => entity.status.nameTags?.includes("メタルフォーゼ") ?? false, qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Filter", filter: (entity) => (entity.atk ?? 9999) <= 2500, qtyLowerBound: 1, qtyUpperBound: 1 },
      ],
    },
    {
      name: "メタルフォーゼ・カーディナル",
      materialInfos: [
        { type: "Filter", filter: (entity) => entity.status.nameTags?.includes("メタルフォーゼ") ?? false, qtyLowerBound: 1, qtyUpperBound: 1 },
        { type: "Filter", filter: (entity) => (entity.atk ?? 9999) <= 3000, qtyLowerBound: 2, qtyUpperBound: 2 },
      ],
    },
  ];
  for (const baseDefinition of baseDefinitions) {
    yield {
      name: baseDefinition.name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction],
      fusionMaterialInfos: baseDefinition.materialInfos,
    };
  }
}

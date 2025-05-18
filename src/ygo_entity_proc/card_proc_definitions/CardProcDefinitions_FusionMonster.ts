import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition, FusionMaterialInfo } from "@ygo_duel/class/DuelEntityDefinition";
export default function* generate(): Generator<EntityProcDefinition> {
  const baseDefinitions: { name: string; materialInfos: FusionMaterialInfo[] }[] = [
    {
      name: "カルボナーラ戦士",
      materialInfos: [
        { type: "Name", cardName: "マグネッツ１号" },
        { type: "Name", cardName: "マグネッツ２号" },
      ],
    },
    {
      name: "クリッチー",
      materialInfos: [
        { type: "Name", cardName: "クリッター" },
        { type: "Name", cardName: "黒き森のウィッチ" },
      ],
    },
    {
      name: "スケルゴン",
      materialInfos: [
        { type: "Name", cardName: "メデューサの亡霊" },
        { type: "Name", cardName: "暗黒の竜王" },
      ],
    },
    {
      name: "スチームジャイロイド",
      materialInfos: [
        { type: "Name", cardName: "ジャイロイド" },
        { type: "Name", cardName: "スチームロイド" },
      ],
    },
    {
      name: "バラに棲む悪霊",
      materialInfos: [
        { type: "Name", cardName: "グレムリン" },
        { type: "Name", cardName: "スネーク・パーム" },
      ],
    },
    {
      name: "バロックス",
      materialInfos: [
        { type: "Name", cardName: "キラーパンダ" },
        { type: "Name", cardName: "ガーゴイル" },
      ],
    },
    {
      name: "フュージョニスト",
      materialInfos: [
        { type: "Name", cardName: "プチテンシ" },
        { type: "Name", cardName: "スリーピィ" },
      ],
    },
    {
      name: "ブラキオレイドス",
      materialInfos: [
        { type: "Name", cardName: "二頭を持つキング・レックス" },
        { type: "Name", cardName: "屍を貪る竜" },
      ],
    },
    {
      name: "プラグティカル",
      materialInfos: [
        { type: "Name", cardName: "トラコドン" },
        { type: "Name", cardName: "フレイム・ヴァイパー" },
      ],
    },
    {
      name: "マブラス",
      materialInfos: [
        { type: "Name", cardName: "タイホーン" },
        { type: "Name", cardName: "邪炎の翼" },
      ],
    },
    {
      name: "ミノケンタウロス",
      materialInfos: [
        { type: "Name", cardName: "ミノタウルス" },
        { type: "Name", cardName: "ケンタウロス" },
      ],
    },
    {
      name: "暗黒火炎龍",
      materialInfos: [
        { type: "Name", cardName: "火炎草" },
        { type: "Name", cardName: "プチリュウ" },
      ],
    },
    {
      name: "炎の騎士 キラー",
      materialInfos: [
        { type: "Name", cardName: "モンスター・エッグ" },
        { type: "Name", cardName: "スティング" },
      ],
    },
    {
      name: "炎の剣士",
      materialInfos: [
        { type: "Name", cardName: "炎を操る者" },
        { type: "Name", cardName: "伝説の剣豪 ＭＡＳＡＫＩ" },
      ],
    },
    {
      name: "音楽家の帝王",
      materialInfos: [
        { type: "Name", cardName: "黒き森のウィッチ" },
        { type: "Name", cardName: "ハイ・プリーステス" },
      ],
    },
    {
      name: "金色の魔象",
      materialInfos: [
        { type: "Name", cardName: "メデューサの亡霊" },
        { type: "Name", cardName: "ドラゴン・ゾンビ" },
      ],
    },
    {
      name: "紅陽鳥",
      materialInfos: [
        { type: "Name", cardName: "セイント・バード" },
        { type: "Name", cardName: "スカイ・ハンター" },
      ],
    },
    {
      name: "轟きの大海蛇",
      materialInfos: [
        { type: "Name", cardName: "魔法のランプ" },
        { type: "Name", cardName: "ひょうすべ" },
      ],
    },
    {
      name: "黒き人食い鮫",
      materialInfos: [
        { type: "Name", cardName: "シーカーメン" },
        { type: "Name", cardName: "キラー・ブロッブ" },
        { type: "Name", cardName: "海原の女戦士" },
      ],
    },
    {
      name: "砂の魔女",
      materialInfos: [
        { type: "Name", cardName: "岩石の巨兵" },
        { type: "Name", cardName: "エンシェント・エルフ" },
      ],
    },
    {
      name: "裁きの鷹",
      materialInfos: [
        { type: "Name", cardName: "冠を戴く蒼き翼" },
        { type: "Name", cardName: "コケ" },
      ],
    },
    {
      name: "裁きを下す女帝",
      materialInfos: [
        { type: "Name", cardName: "女王の影武者" },
        { type: "Name", cardName: "響女" },
      ],
    },
    {
      name: "朱雀",
      materialInfos: [
        { type: "Name", cardName: "赤き剣のライムンドス" },
        { type: "Name", cardName: "炎の魔神" },
      ],
    },
    {
      name: "深海に潜むサメ",
      materialInfos: [
        { type: "Name", cardName: "神魚" },
        { type: "Name", cardName: "舌魚" },
      ],
    },
    {
      name: "水陸両用バグロス",
      materialInfos: [
        { type: "Name", cardName: "陸戦型 バグロス" },
        { type: "Name", cardName: "海を守る戦士" },
      ],
    },
    {
      name: "戦場の死装束",
      materialInfos: [
        { type: "Name", cardName: "音女" },
        { type: "Name", cardName: "斬首の美女" },
      ],
    },
    {
      name: "魔装騎士ドラゴネス",
      materialInfos: [
        { type: "Name", cardName: "アーメイル" },
        { type: "Name", cardName: "一眼の盾竜" },
      ],
    },
    {
      name: "魔導騎士ギルティア",
      materialInfos: [
        { type: "Name", cardName: "冥界の番人" },
        { type: "Name", cardName: "王座の守護者" },
      ],
    },
    {
      name: "雷神の怒り",
      materialInfos: [
        { type: "Name", cardName: "エンゼル・イヤーズ" },
        { type: "Name", cardName: "メガ・サンダーボール" },
      ],
    },
    {
      name: "カイザー・ドラゴン",
      materialInfos: [
        { type: "Name", cardName: "砦を守る翼竜" },
        { type: "Name", cardName: "フェアリー・ドラゴン" },
      ],
    },
    {
      name: "スカルビショップ",
      materialInfos: [
        { type: "Name", cardName: "悪魔の知恵" },
        { type: "Name", cardName: "魔天老" },
      ],
    },
    {
      name: "デビル・ボックス",
      materialInfos: [
        { type: "Name", cardName: "マーダーサーカス" },
        { type: "Name", cardName: "ドリーム・ピエロ" },
      ],
    },
    {
      name: "ヒューマノイド・ドレイク",
      materialInfos: [
        { type: "Name", cardName: "ワームドレイク" },
        { type: "Name", cardName: "ヒューマノイド・スライム" },
      ],
    },
    {
      name: "ブラック・デーモンズ・ドラゴン",
      materialInfos: [
        { type: "Name", cardName: "デーモンの召喚" },
        { type: "Name", cardName: "真紅眼の黒竜" },
      ],
    },
    {
      name: "マスター・オブ・ＯＺ",
      materialInfos: [
        { type: "Name", cardName: "ビッグ・コアラ" },
        { type: "Name", cardName: "デス・カンガルー" },
      ],
    },
    {
      name: "メテオ・ブラック・ドラゴン",
      materialInfos: [
        { type: "Name", cardName: "真紅眼の黒竜" },
        { type: "Name", cardName: "メテオ・ドラゴン" },
      ],
    },
    {
      name: "召喚獣メガラニカ",
      materialInfos: [
        { type: "Name", cardName: "召喚師アレイスター" },
        { type: "Name", cardName: "地属性モンスター" },
      ],
    },
    {
      name: "聖女ジャンヌ",
      materialInfos: [
        { type: "Name", cardName: "慈悲深き修道女" },
        { type: "Name", cardName: "堕天使マリー" },
      ],
    },
    {
      name: "青眼の究極竜",
      materialInfos: [
        { type: "Name", cardName: "青眼の白龍" },
        { type: "Name", cardName: "青眼の白龍" },
        { type: "Name", cardName: "青眼の白龍" },
      ],
    },
    {
      name: "千年竜",
      materialInfos: [
        { type: "Name", cardName: "時の魔術師" },
        { type: "Name", cardName: "ベビードラゴン" },
      ],
    },
    {
      name: "双頭の雷龍",
      materialInfos: [
        { type: "Name", cardName: "サンダー・ドラゴン" },
        { type: "Name", cardName: "サンダー・ドラゴン" },
      ],
    },
    {
      name: "迷宮の魔戦車",
      materialInfos: [
        { type: "Name", cardName: "ギガテック・ウルフ" },
        { type: "Name", cardName: "キャノン・ソルジャー" },
      ],
    },
    {
      name: "竜騎士ガイア",
      materialInfos: [
        { type: "Name", cardName: "暗黒騎士ガイア" },
        { type: "Name", cardName: "カース・オブ・ドラゴン" },
      ],
    },
    {
      name: "アクア・ドラゴン",
      materialInfos: [
        { type: "Name", cardName: "フェアリー・ドラゴン" },
        { type: "Name", cardName: "海原の女戦士" },
      ],
    },
    {
      name: "アンデット・ウォーリアー",
      materialInfos: [
        { type: "Name", cardName: "ワイト" },
        { type: "Name", cardName: "格闘戦士アルティメーター" },
      ],
    },
    {
      name: "カオス・ウィザード",
      materialInfos: [
        { type: "Name", cardName: "ホーリー・エルフ" },
        { type: "Name", cardName: "黒魔族のカーテン" },
      ],
    },
    {
      name: "クワガー・ヘラクレス",
      materialInfos: [
        { type: "Name", cardName: "クワガタ・アルファ" },
        { type: "Name", cardName: "ヘラクレス・ビートル" },
      ],
    },
    {
      name: "ソウル・ハンター",
      materialInfos: [
        { type: "Name", cardName: "ランプの魔人" },
        { type: "Name", cardName: "異次元からの侵略者" },
      ],
    },
    {
      name: "デス・バード",
      materialInfos: [
        { type: "Name", cardName: "タクヒ" },
        { type: "Name", cardName: "髑髏の寺院" },
      ],
    },
    {
      name: "フラワー・ウルフ",
      materialInfos: [
        { type: "Name", cardName: "シルバー・フォング" },
        { type: "Name", cardName: "魔界のイバラ" },
      ],
    },
    {
      name: "フレイム・ゴースト",
      materialInfos: [
        { type: "Name", cardName: "ワイト" },
        { type: "Name", cardName: "マグマン" },
      ],
    },
    {
      name: "マリン・ビースト",
      materialInfos: [
        { type: "Name", cardName: "水の魔導師" },
        { type: "Name", cardName: "ベヒゴン" },
      ],
    },
    {
      name: "メカ・ザウルス",
      materialInfos: [
        { type: "Name", cardName: "ミスター・ボンバー" },
        { type: "Name", cardName: "二頭を持つキング・レックス" },
      ],
    },
    {
      name: "メタル・ドラゴン",
      materialInfos: [
        { type: "Name", cardName: "鋼鉄の巨神像" },
        { type: "Name", cardName: "レッサー・ドラゴン" },
      ],
    },
    {
      name: "レア・フィッシュ",
      materialInfos: [
        { type: "Name", cardName: "フュージョニスト" },
        { type: "Name", cardName: "恍惚の人魚" },
      ],
    },
    {
      name: "無の畢竟 オールヴェイン",
      materialInfos: [
        { type: "Filter", filter: (entity) => entity.status.monsterCategories?.includes("Normal") ?? false },
        { type: "Filter", filter: (entity) => entity.status.monsterCategories?.includes("Normal") ?? false },
      ],
    },
    {
      name: "テセウスの魔棲物",
      materialInfos: [
        { type: "Filter", filter: (entity) => entity.status.monsterCategories?.includes("Tuner") ?? false },
        { type: "Filter", filter: (entity) => entity.status.monsterCategories?.includes("Tuner") ?? false },
      ],
    },
    {
      name: "ジェムナイト・ジルコニア",
      materialInfos: [
        { type: "Filter", filter: (entity) => entity.status.nameTags?.includes("ジェムナイト") ?? false },
        { type: "Filter", filter: (entity) => entity.types.includes("Rock") ?? false },
      ],
    },
    {
      name: "メタルフォーゼ・アダマンテ",
      materialInfos: [
        { type: "Filter", filter: (entity) => entity.status.nameTags?.includes("メタルフォーゼ") ?? false },
        { type: "Filter", filter: (entity) => (entity.atk ?? 9999) <= 2500 },
      ],
    },
    {
      name: "メタルフォーゼ・カーディナル",
      materialInfos: [
        { type: "Filter", filter: (entity) => entity.status.nameTags?.includes("メタルフォーゼ") ?? false },
        { type: "Filter", filter: (entity) => (entity.atk ?? 9999) <= 3000 },
        { type: "Filter", filter: (entity) => (entity.atk ?? 9999) <= 3000 },
      ],
    },
  ];
  for (const baseDefinition of baseDefinitions) {
    yield {
      name: baseDefinition.name,
      actions: [],
      fusionMaterialInfos: baseDefinition.materialInfos,
    };
  }
}

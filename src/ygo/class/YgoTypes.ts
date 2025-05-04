export const deckTypes = ["Deck", "ExtraDeck"] as const;
export type TDeckTypes = (typeof deckTypes)[number];
export const deckTypeDic: { [key in TDeckTypes]: string } = {
  Deck: "メインデッキ",
  ExtraDeck: "エクストラデッキ",
};
export const cardKinds = ["Monster", "Spell", "Trap", "XyzMaterial"] as const;
export type TCardKind = (typeof cardKinds)[number];
export const cardKindDic: { [key in TCardKind]: string } = {
  Monster: "モンスター",
  Spell: "魔法",
  Trap: "罠",
  XyzMaterial: "XYZ素材",
};
export const exMonsterCategories = ["Fusion", "Syncro", "Xyz", "Link"] as const;
export type TMonsterExSummonCategory = (typeof exMonsterCategories)[number];
export const specialMonsterCategories = [...exMonsterCategories, "SpecialSummon", "Ritual"] as const;
export type TMonsterSpecialSummonCategory = (typeof specialMonsterCategories)[number];
export const monsterEffectCategories = ["Toon", "Spirit", "Union", "Gemini", "FlipEffect"] as const;
export type TMonsterEffectCategory = (typeof monsterEffectCategories)[number];
export const monsterOtherCategories = ["Tuner", "Effect", "Normal", "Pendulum", "Token", "FreeReborn", "NormalSummonOnly", "RegularSpecialSummonOnly"] as const;
export type TMonsterOtherCategory = (typeof monsterOtherCategories)[number];
export const monsterCategories = [...specialMonsterCategories, ...monsterEffectCategories, ...monsterOtherCategories] as const;
export type TMonsterCategory = (typeof monsterCategories)[number];
export const monsterCategoryDic: { [key in TMonsterCategory]: string } = {
  Syncro: "シンクロ",
  Fusion: "融合",
  Xyz: "エクシーズ",
  Link: "リンク",
  Ritual: "儀式",
  SpecialSummon: "特殊召喚",
  Toon: "トゥーン",
  Spirit: "スピリット",
  Union: "ユニオン",
  Gemini: "デュアル",
  FlipEffect: "リバース",
  Tuner: "チューナー",
  Effect: "効果",
  Normal: "通常",
  Pendulum: "ペンデュラム",
  Token: "トークン",
  FreeReborn: "特殊召喚モンスター（蘇生制限なし）",
  NormalSummonOnly: "特殊召喚不可",
  RegularSpecialSummonOnly: "正規の方法以外での特殊召喚不可",
};
export const monsterCategoryEmojiDic: { [key in TMonsterCategory]: string } = {
  Syncro: "🎵",
  Fusion: "🌀",
  Xyz: "📰",
  Link: "⛓️",
  Ritual: "📜",
  SpecialSummon: "🔯",
  Toon: "📖",
  Spirit: "👻",
  Union: "🚗",
  Gemini: "👫",
  FlipEffect: "🔄",
  Tuner: "🎶",
  Effect: "✨",
  Normal: "🔘",
  Pendulum: "💠",
  Token: "🐏",
  FreeReborn: "🆓",
  NormalSummonOnly: "🔲",
  RegularSpecialSummonOnly: "❗",
};
export const monsterAttributes = ["Light", "Dark", "Earth", "Water", "Fire", "Wind", "Divine"] as const;
export type TMonsterAttribute = (typeof monsterAttributes)[number];

export const monsterAttributeDic = {
  Light: "光",
  Dark: "闇",
  Earth: "地",
  Water: "水",
  Fire: "炎",
  Wind: "風",
  Divine: "神",
} as { [key in TMonsterAttribute]: string };

export const getMonsterAttribute = (text: string): TMonsterAttribute | undefined => {
  return (Object.entries(monsterAttributeDic) as [TMonsterAttribute, string][]).find((entry) => entry[1] === text)?.[0] || undefined;
};

export const monsterTypes = [
  "Aqua",
  "Beast",
  "BeastWarrior",
  "CreatorGod",
  "Cyberse",
  "Dinosaur",
  "DivineBeast",
  "Dragon",
  "Fairy",
  "Fiend",
  "Fish",
  "Insect",
  "Illusion",
  "Machine",
  "Plant",
  "Psychic",
  "Pyro",
  "Reptile",
  "Rock",
  "SeaSerpent",
  "Spellcaster",
  "Thunder",
  "Warrior",
  "WingedBeast",
  "Wyrm",
  "Zombie",
] as const;
export type TMonsterType = (typeof monsterTypes)[number];
export const spellCategories = ["Normal", "Continuous", "Field", "QuickPlay", "Equip", "Ritual", "PendulumScale"] as const;
export type TSpellCategory = (typeof spellCategories)[number];

export const spellCategoryDic: { [key in TSpellCategory]: string } = {
  Normal: "通常",
  Continuous: "永続",
  Field: "フィールド",
  QuickPlay: "速攻",
  Equip: "装備",
  Ritual: "儀式",
  PendulumScale: "ペンデュラム",
};
export const trapCategories = ["Normal", "Continuous", "Counter"] as const;
export type TTrapCategory = (typeof trapCategories)[number];
export const trapCategoryDic: { [key in TTrapCategory]: string } = {
  Normal: "通常",
  Continuous: "永続",
  Counter: "カウンター",
};
export const faceupBattlePositions = ["Attack", "Defense"] as const;
export type TBattlePosition = (typeof faceupBattlePositions)[number] | "Set";
export const battlePositionDic: { [key in TBattlePosition]: string } = {
  Attack: "攻撃表示",
  Defense: "守備表示",
  Set: "裏側守備表示",
};
export type TNonBattlePosition = "FaceUp" | "Set";

export type CardInfoWiki = {
  wikiName: string;
  wikiHref: string;
  wikiEncodedName: string;
  wikiTextAll: string;
};

export const entityFlexibleStatusKeys = ["level", "rank", "attack", "defense", "pendulumScaleR", "pendulumScaleL"] as const;
export type TEntityFlexibleNumericStatusKey = (typeof entityFlexibleStatusKeys)[number];
export type TEntityFlexibleNumericStatusGen = "origin" | "wip" | "calculated";
export type TEntityFlexibleNumericStatus = { [key in TEntityFlexibleNumericStatusKey]: number | undefined };

/**
 * 変更されない、または変更されたとしても変更原因の状態を監視する必要がないステータス
 */
export type EntityStaticStatus = {
  /**
   * モンスター・魔法・罠・エクシーズ素材
   */
  kind: TCardKind;

  /**
   * コナミデータベースで振られているID
   */
  cardId?: number;
  /**
   * テスト用カードのフラグ
   */
  isForTest?: boolean;
  /**
   * リンク数
   */
  link?: number;
  /**
   * 「テキストに～～が記された」で括られる場合
   */
  textTags?: string[];
};
/**
 * 変更されたとき、変更原因の状態を監視する必要がある可能性があるステータス
 */
export type EntityFlexibleStatus = {
  name: string;
  /**
   * ※チューナー・効果モンスター・通常モンスターはスキドレによって変化する可能性がある
   */
  monsterCategories?: Array<TMonsterCategory>;
  /**
   * ※ここに置くのはちょっと微妙？
   */
  spellCategory?: TSpellCategory;
  /**
   * ※ここに置くのはちょっと微妙？
   */
  trapCategory?: TTrapCategory;
  nameTags?: Array<string>;
  attributes?: TMonsterAttribute[];
  types?: TMonsterType[];
};

export type EntityStatusBase = {
  name: string;
  monsterCategories?: Array<TMonsterCategory>;
  spellCategory?: TSpellCategory;
  trapCategory?: TTrapCategory;
  nameTags?: Array<string>;
  attributes?: TMonsterAttribute[];
  types?: TMonsterType[];
  linkArrowKeys?: TLinkArrowKey[];
  isImplemented?: boolean;
} & EntityStaticStatus &
  Partial<TEntityFlexibleNumericStatus> & { wikiEncodedName: string };
export type EntityNumericStatus = { [key in TEntityFlexibleNumericStatusGen]: TEntityFlexibleNumericStatus };
export type CardInfoDescription = {
  nameKana?: string;
  description?: string;
  pendulumDescription?: string;
};

export type CardInfoJson = CardInfoWiki & EntityStatusBase & CardInfoDescription;

const _getSubsetAsEntityStatusBase = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  wikiName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  wikiHref,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  wikiTextAll,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nameKana,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pendulumDescription,
  ...rest
}: CardInfoJson): EntityStatusBase => {
  return rest;
};
export const getSubsetAsEntityStatusBase = (json: CardInfoJson): EntityStatusBase => _getSubsetAsEntityStatusBase(json);

export type CardInfoDeckEdit = CardInfoJson & {
  isImplemented: true;
};
export const monsterTypeDic = {
  Aqua: "水",
  Beast: "獣",
  BeastWarrior: "獣戦士",
  CreatorGod: "創造神",
  Cyberse: "サイバース",
  Dinosaur: "恐竜",
  DivineBeast: "幻獣神",
  Dragon: "ドラゴン",
  Fairy: "天使",
  Fiend: "悪魔",
  Fish: "魚",
  Insect: "昆虫",
  Illusion: "幻想魔",
  Machine: "機械",
  Plant: "植物",
  Psychic: "サイキック",
  Pyro: "炎",
  Reptile: "爬虫類",
  Rock: "岩石",
  SeaSerpent: "海竜",
  Spellcaster: "魔法使い",
  Thunder: "雷",
  Warrior: "戦士",
  WingedBeast: "鳥獣",
  Wyrm: "幻竜",
  Zombie: "アンデット",
} as { [key in TMonsterType]: string };

export const monsterTypeEmojiDic = {
  Aqua: "🚰",
  Beast: "🐅",
  BeastWarrior: "🦁",
  CreatorGod: "🔆",
  Cyberse: "💻️",
  Dinosaur: "🦖",
  DivineBeast: "💫",
  Dragon: "🐲",
  Fairy: "👼",
  Fiend: "👿",
  Fish: "🐟️",
  Insect: "🦋",
  Illusion: "🤡",
  Machine: "🤖",
  Plant: "🌱",
  Psychic: "👁️",
  Pyro: "🔥",
  Reptile: "🦎",
  Rock: "⛰",
  SeaSerpent: "🐍",
  Spellcaster: "🧙",
  Thunder: "⚡️",
  Warrior: "⚔️",
  WingedBeast: "🦅",
  Wyrm: "🐉",
  Zombie: "🦴",
} as { [key in TMonsterType]: string };

export const linkArrowKeys = ["TopLeft", "TopCenter", "TopRight", "MiddleLeft", "MiddleRight", "BottomLeft", "BottomCenter", "BottomRight"] as const;
export type TLinkArrowKey = (typeof linkArrowKeys)[number];
export type LinkArrow = { offsetRow: 1 | 0 | -1; offsetColumn: 1 | 0 | -1 };

export const linkArrowDic: { [key in TLinkArrowKey]: { name: string; linkArrow: LinkArrow } } = {
  TopLeft: {
    name: "左上",
    linkArrow: {
      offsetRow: -1,
      offsetColumn: -1,
    },
  },
  TopCenter: {
    name: "上",
    linkArrow: {
      offsetRow: -1,
      offsetColumn: 0,
    },
  },
  TopRight: {
    name: "右上",
    linkArrow: {
      offsetRow: -1,
      offsetColumn: 1,
    },
  },
  MiddleLeft: {
    name: "左",
    linkArrow: {
      offsetRow: 0,
      offsetColumn: -1,
    },
  },
  MiddleRight: {
    name: "右",
    linkArrow: {
      offsetRow: 0,
      offsetColumn: 1,
    },
  },
  BottomLeft: {
    name: "左下",
    linkArrow: {
      offsetRow: 1,
      offsetColumn: -1,
    },
  },
  BottomCenter: {
    name: "下",
    linkArrow: {
      offsetRow: 1,
      offsetColumn: 0,
    },
  },
  BottomRight: {
    name: "右下",
    linkArrow: {
      offsetRow: 1,
      offsetColumn: 1,
    },
  },
} as const;

export const linkArrowNameDic = linkArrowKeys.reduce(
  (wip, key) => {
    wip[linkArrowDic[key].name] = key;
    return wip;
  },
  {} as { [name in string]: TLinkArrowKey }
);

export const getMonsterType = (text: string): TMonsterType | undefined => {
  return (Object.entries(monsterTypeDic) as [TMonsterType, string][]).find((entry) => entry[1] === text)?.[0] || undefined;
};
export const getKonamiUrl = (status: EntityStatusBase) => {
  return (status.cardId ?? 0 > 0)
    ? `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=${status.cardId}`
    : `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&rp=10&mode=&sort=1&keyword=${status.name}&stype=1&ctype=&othercon=2&starfr=&starto=&pscalefr=&pscaleto=&linkmarkerfr=&linkmarkerto=&link_m=2&atkfr=&atkto=&deffr=&defto=&releaseDStart=1&releaseMStart=1&releaseYStart=1999&releaseDEnd=&releaseMEnd=&releaseYEnd=`;
};

export const cardSorter = (left: EntityStatusBase, right: EntityStatusBase): number => {
  // エクストラデッキのモンスターは、魔法罠よりも下
  const leftCatList = left.monsterCategories ?? [];
  const rightCatList = right.monsterCategories ?? [];

  for (const cat of exMonsterCategories.toReversed()) {
    if (leftCatList.includes(cat) && !rightCatList.includes(cat)) {
      return 1;
    }
    if (!leftCatList.includes(cat) && rightCatList.includes(cat)) {
      return -1;
    }
  }

  if (left.kind === right.kind) {
    if (left.kind === "Monster") {
      if ((left.link ?? 0) !== (right.link ?? 0)) {
        return (left.link ?? 0) - (right.link ?? 0);
      }
      if ((left.rank ?? 0) !== (right.rank ?? 0)) {
        return (left.rank ?? 0) - (right.rank ?? 0);
      }
      if ((left.level ?? 0) !== (right.level ?? 0)) {
        return (left.level ?? 0) - (right.level ?? 0);
      }
      if ((left.attack ?? 0) !== (right.attack ?? 0)) {
        return (left.attack ?? 0) - (right.attack ?? 0);
      }
      if ((left.defense ?? 0) !== (right.defense ?? 0)) {
        return (left.defense ?? 0) - (right.defense ?? 0);
      }
    }
    return left.name.localeCompare(right.name, "Ja");
  }

  for (const kind of cardKinds) {
    if (left.kind === kind) {
      return -1;
    }
    if (right.kind === kind) {
      return 1;
    }
  }

  // 到達しないコード
  return left.name.localeCompare(right.name, "Ja");
};

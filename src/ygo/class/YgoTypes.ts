export const deckTypes = ["Deck", "ExtraDeck"] as const;
export type TDeckTypes = (typeof deckTypes)[number];
export const deckTypeDic: { [key in TDeckTypes]: string } = {
  Deck: "メインデッキ",
  ExtraDeck: "エクストラデッキ",
};
export const cardKinds = ["Monster", "Spell", "Trap"] as const;
export type TCardKind = (typeof cardKinds)[number];
export const cardKindDic: { [key in TCardKind]: string } = {
  Monster: "モンスター",
  Spell: "魔法",
  Trap: "罠",
};
export const exMonsterCategories = ["Fusion", "Syncro", "Xyz", "Link"] as const;
export type TMonsterExSummonCategory = (typeof exMonsterCategories)[number];
export const specialMonsterCategories = [...exMonsterCategories, "SpecialSummon"] as const;
export type TMonsterSpecialSummonCategory = (typeof specialMonsterCategories)[number];
export const monsterEffectCategories = ["Toon", "Spirit", "Union", "Gemini", "FlipEffect"] as const;
export type TMonsterEffectCategory = (typeof monsterEffectCategories)[number];
export const monsterOtherCategories = ["Tuner", "Effect", "Normal", "Pendulum", "Token", "NormalSummonOnly"] as const;
export type TMonsterOtherCategory = (typeof monsterOtherCategories)[number];
export const monsterCategories = [...specialMonsterCategories, ...monsterEffectCategories, ...monsterOtherCategories] as const;
export type TMonsterCategory = (typeof monsterCategories)[number];
export const monsterCategoryDic: { [key in TMonsterCategory]: string } = {
  Syncro: "シンクロ",
  Fusion: "融合",
  Xyz: "エクシーズ",
  Link: "リンク",
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
  NormalSummonOnly: "特殊召喚不可",
};
export const monsterCategoryEmojiDic: { [key in TMonsterCategory]: string } = {
  Syncro: "🎵",
  Fusion: "🌀",
  Xyz: "📰",
  Link: "⛓️",
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
  NormalSummonOnly: "🔲",
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
export const spellCategories = ["Normal", "Continuous", "Field", "QuickPlay", "Equip", "Ritual"] as const;
export type TSpellCategory = (typeof spellCategories)[number];

export const spellCategoryDic: { [key in TSpellCategory]: string } = {
  Normal: "通常",
  Continuous: "永続",
  Field: "フィールド",
  QuickPlay: "速攻",
  Equip: "装備",
  Ritual: "儀式",
};
export const trapCategories = ["Normal", "Continuous", "Counter"] as const;
export type TTrapCategory = (typeof trapCategories)[number];
export const trapCategoryDic: { [key in TTrapCategory]: string } = {
  Normal: "通常",
  Continuous: "永続",
  Counter: "カウンター",
};
export type TBattlePosition = "Attack" | "Defense" | "Set";
export const battlePositionDic: { [key in TBattlePosition]: string } = {
  Attack: "攻撃表示",
  Defense: "守備表示",
  Set: "裏側守備表示",
};
export type TNonBattlePosition = "FaceUp" | "Set" | "XysMaterial";

export type CardInfoWiki = {
  wikiName: string;
  wikiHref: string;
  wikiEncodedName: string;
  wikiTextAll: string;
};

export const entityFlexibleStatusKeys = ["level", "rank", "attack", "defense", "pendulumScaleR", "pendulumScaleL"] as const;
export type TEntityFlexibleStatusKey = (typeof entityFlexibleStatusKeys)[number];
export type TEntityFlexibleStatusGen = "origin" | "current" | "calculated";
export type FlexibleStatus = { [key in TEntityFlexibleStatusKey]: number | undefined };

export type EntityStatusBase = {
  name: string;
  kind: TCardKind;
  monsterCategories?: Array<TMonsterCategory>;
  spellCategory?: TSpellCategory;
  trapCategory?: TTrapCategory;
  nameTags?: Array<string>;
  textTags?: Array<string>;
  link?: number;
  attributes?: TMonsterAttribute[];
  types?: TMonsterType[];
  canReborn?: boolean;
  cardId?: number;
  isForTest?: boolean;
} & Partial<FlexibleStatus> & { wikiEncodedName: string };
export type EntityStatus = {
  canAttack: boolean;
  canDirectAttack: boolean;
  allowHandSyncro: boolean;
  isEffective: boolean;
  isSelectableForAttack: boolean /** falseのモンスターしかいない場合、ダイレクトアタックになる。《伝説のフィッシャーマン》など。 */;
  maxCounterQty: { [key: string]: number };
} & EntityStatusBase;
export type EntityNumericStatus = { [key in TEntityFlexibleStatusGen]: FlexibleStatus };
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
export const getMonsterType = (text: string): TMonsterType | undefined => {
  return (Object.entries(monsterTypeDic) as [TMonsterType, string][]).find((entry) => entry[1] === text)?.[0] || undefined;
};

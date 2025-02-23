export type TCardKind = "Monster" | "Magic" | "Trap";
export const exMonsterCategories = ["Synchro", "Fusion", "Xyz", "Link"] as const;
export type TMonsterExSummonCategory = (typeof exMonsterCategories)[number];
export const specialMonsterCategories = [...exMonsterCategories, "SpecialSummon"] as const;
export type TMonsterSpecialSummonCategory = (typeof specialMonsterCategories)[number];
export type TMonsterEffectCategory = "Toon" | "Spirit" | "Union" | "Gemini" | "FlipEffect";
export type TMonsterOtherCategory = "Tuner" | "Effect" | "Normal" | "Pendulum" | "Token";
export type TMonsterCategory = TMonsterSpecialSummonCategory | TMonsterEffectCategory | TMonsterOtherCategory;
export type TMonsterAttribute = "Light" | "Dark" | "Earth" | "Water" | "Fire" | "Wind" | "Divine";
export type TMonsterType =
  | "Aqua"
  | "Beast"
  | "BeastWarrior"
  | "CreatorGod"
  | "Cyberse"
  | "Dinosaur"
  | "DivineBeast"
  | "Dragon"
  | "Fairy"
  | "Fiend"
  | "Fish"
  | "Insect"
  | "Illusion"
  | "Machine"
  | "Plant"
  | "Psychic"
  | "Pyro"
  | "Reptile"
  | "Rock"
  | "SeaSerpent"
  | "Spellcaster"
  | "Thunder"
  | "Warrior"
  | "WingedBeast"
  | "Wyrm"
  | "Zombie";
export type TMagicCategory = "Normal " | "Continuous" | "Field" | "QuickPlay" | "Equip";
export type TTrapCategory = "Normal " | "Continuous" | "Counter";
export type TBattlePosition = "Attack" | "Defense" | "Set";

export type TCardInfoWiki = {
  name: string;
  wikiName: string;
  wikiHref: string;
  wikiTextAll: string;
};

export type TEntityStatus = {
  name: string;
  kind: TCardKind;
  monsterCategories: Array<TMonsterCategory> | undefined;
  magicCategories: TMagicCategory | undefined;
  trapCategories: TTrapCategory | undefined;
  nameTags: Array<string> | undefined;
  level: number | undefined;
  rank: number | undefined;
  link: number | undefined;
  attack: number | undefined;
  defense: number | undefined;
  attribute: TMonsterAttribute | undefined;
  type: TMonsterType | undefined;
  pendulumScaleR: number | undefined;
  pendulumScaleL: number | undefined;
};

export type TCardInfoBase = {
  nameKana: string;
  description: string;
  pendulumDescription: string;
};

export type TCardInfoJson = TCardInfoWiki & TEntityStatus & TCardInfoBase;

export const MonsterAttributeDic = {
  Light: "光",
  Dark: "闇",
  Earth: "地",
  Water: "水",
  Fire: "炎",
  Wind: "風",
  Divine: "神",
} as { [key in TMonsterAttribute]: string };

export const getMonsterAttribute = (text: string): TMonsterAttribute | undefined => {
  return (Object.entries(MonsterAttributeDic) as [TMonsterAttribute, string][]).find((entry) => entry[1] === text)?.[0] || undefined;
};

export const MonsterTypeDic = {
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

export const getMonsterType = (text: string): TMonsterType | undefined => {
  return (Object.entries(MonsterTypeDic) as [TMonsterType, string][]).find((entry) => entry[1] === text)?.[0] || undefined;
};

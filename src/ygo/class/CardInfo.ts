import json from "@ygo/json/cardInfo.json";
import type { CardInfoJson } from "@ygo/class/YgoTypes";
import { createCardDefinitions, type CardDefinition } from "@ygo_card/class/DuelCardDefinition";

const _cardDefinitions: Map<string, CardDefinition> = new Map();
createCardDefinitions().forEach((obj) => {
  _cardDefinitions.set(obj.name, obj);
});
export const cardDefinitionDic = _cardDefinitions as Readonly<Map<string, CardDefinition>>;
const fuga = json as unknown as { [name: string]: CardInfoJson };
export const cardInfoDic = Object.values(fuga).reduce(
  (dic, info) => {
    dic[info.name] = info;
    return dic;
  },
  {} as { [name: string]: CardInfoJson }
);

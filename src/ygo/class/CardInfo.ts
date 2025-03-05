import json from "@ygo/json/cardInfo.json";
import type { TCardInfoJson } from "@ygo/class/YgoTypes";
import type { CardActionBase } from "@ygo_duel/class/DuelEntity";
import { createCardDefinitions } from "@ygo_duel/cards/CardDefinitions";

const _cardDefinitions: Map<string, CardActionBase<unknown>[]> = new Map();
createCardDefinitions().forEach((obj) => {
  _cardDefinitions.set(obj.name, obj.actions);
});
export const cardDefinitions = _cardDefinitions as Readonly<Map<string, CardActionBase<unknown>[]>>;
const fuga = json as unknown as { [name: string]: TCardInfoJson };
export const cardInfoDic = Object.values(fuga).reduce(
  (dic, info) => {
    dic[info.name] = info;
    return dic;
  },
  {} as { [name: string]: TCardInfoJson }
);

import json from "@ygo/json/cardInfo.json";
import type { TCardInfoJson } from "@ygo/class/YgoTypes";
import type { CardActionBase } from "@ygo_duel/class/DuelEntity";
import { createCardActionDefinitions } from "@ygo_duel/cards/CardActionDefinitions";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalAttackSummonAction,
  defaultNormalSetSummonAction,
} from "@ygo_duel/functions/DefaultCardAction";

const cardActionDefinitions: Map<string, CardActionBase<unknown>[]> = new Map();
createCardActionDefinitions().forEach((obj) => {
  cardActionDefinitions.set(obj.name, obj.actions);
});

const fuga = json as unknown as { [name: string]: TCardInfoJson };
export const cardInfoDic = Object.values(fuga).reduce(
  (dic, info) => {
    dic[info.name] = info;
    return dic;
  },
  {} as { [name: string]: TCardInfoJson }
);

export const getCardActions = (name: string): CardActionBase<unknown>[] => {
  if (!Object.hasOwn(cardInfoDic, name)) {
    return [];
  }
  const info = cardInfoDic[name];

  if (info.kind === "Monster" && info.monsterCategories?.includes("Normal")) {
    return [defaultNormalAttackSummonAction, defaultNormalSetSummonAction, defaultAttackAction, defaultBattlePotisionChangeAction] as CardActionBase<unknown>[];
  }

  return cardActionDefinitions.get(name) || [];
};

import json from "@ygo/json/cardInfo.json";
import type { TCardInfoJson } from "@ygo/class/YgoTypes";

const fuga = json as unknown as { [name: string]: TCardInfoJson };
const cardInfoDic = Object.values(fuga).reduce(
  (dic, info) => {
    if (info.kind === "Monster") {
      if (info.monsterCategories?.includes("Normal")) {
        dic[info.name] = info;
      }
    }
    return dic;
  },
  {} as { [name: string]: TCardInfoJson }
);

export default cardInfoDic;

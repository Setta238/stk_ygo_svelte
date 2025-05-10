import json from "@ygo/json/cardInfo.json";
import type { CardInfoJson } from "@ygo/class/YgoTypes";
import { generateAllProcCardDefinitions } from "../../ygo_duel/class/DuelEntityDefinition";

const hoge = new Set<string>();
const fuga = json as unknown as { [name: string]: CardInfoJson };
for (const definition of generateAllProcCardDefinitions()) {
  if (hoge.has(definition.name)) {
    throw new Error(`カード定義重複${definition.name}`);
  }
  if (fuga[definition.name]) {
    fuga[definition.name].isImplemented = true;
  }
}
export const cardInfoDic = Object.values(fuga).reduce(
  (dic, info) => {
    if (info.monsterCategories && !info.monsterCategories?.includes("Effect") && !info.monsterCategories.includes("Pendulum")) {
      if (!info.monsterCategories.includes("Normal")) {
        console.log(info.name);
      }
      info.isImplemented = true;
    }
    dic[info.name] = info;
    return dic;
  },
  {} as { [name: string]: CardInfoJson }
);

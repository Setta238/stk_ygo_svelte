import json from "@ygo/json/cardInfo.json";
import type { CardInfoJson } from "@ygo/class/YgoTypes";
import { generateAllProcCardDefinitions } from "@ygo_duel/class/DuelEntityDefinition";

const hoge = new Set<string>();
const fuga = json as unknown as { [name: string]: CardInfoJson };
let _definitionCount = 0;
let _nonDefinitionCount = 0;
let _testCardCount = 0;

for (const definition of generateAllProcCardDefinitions()) {
  if (hoge.has(definition.name)) {
    throw new Error(`カード定義重複${definition.name}`);
  }
  if (fuga[definition.name]) {
    fuga[definition.name].isImplemented = true;
    _definitionCount++;
  }
}
export const cardInfoDic = Object.values(fuga).reduce(
  (dic, info) => {
    if (info.kind === "Monster" && info.monsterCategories && !info.monsterCategories?.includes("Effect") && !info.monsterCategories.includes("Pendulum")) {
      info.isImplemented = true;
      _nonDefinitionCount++;
    }
    if (info.isForTest && info.isImplemented) {
      _testCardCount++;
    }
    dic[info.name] = info;
    return dic;
  },
  {} as { [name: string]: CardInfoJson }
);

export const definitionCount = _definitionCount;
export const nonDefinitionCount = _nonDefinitionCount;
export const testCardCount = _testCardCount;

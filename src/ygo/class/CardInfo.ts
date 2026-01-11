import cardInfo_special from "@ygo/json/cardInfo_special.json";
import json_test from "@ygo/json/cardInfo_test.json";
import json_old_version from "@ygo/json/cardInfo_old_version.json";
import jsonFileList from "@ygo/json/cardInfoFileList.json";

import {
  cardSorter,
  convertToEntityStatusBase,
  createCardTree,
  type CardInfoDescription,
  type CardTree,
  type EntityStatusBase,
  type TDeckCardKind,
} from "@ygo/class/YgoTypes";
import { generateAllProcCardDefinitions } from "@ygo_duel/class/DuelEntityDefinition";
import { createPromiseSweet, delay } from "@stk_utils/funcs/StkPromiseUtil";
import { isNumber } from "@stk_utils/funcs/StkMathUtils";

const cardNames = new Set<string>();
const fuga = { ...json_test, ...json_old_version, ...cardInfo_special } as unknown as { [name: string]: EntityStatusBase & CardInfoDescription };

const cardDefinitions = {
  tree: {
    ExtraMonster: [],
    Monster: [],
    Spell: [],
    Trap: [],
  } as CardTree,
  knmCount: 0,
  definitionCount: 0,
  nonDefinitionCount: 0,
  testCardCount: 0,
  getCardInfo: (name: string): (EntityStatusBase & CardInfoDescription) | undefined => undefined,
};

const cardDefinitionsDic: { [name: string]: EntityStatusBase & CardInfoDescription } = {};
const cardDefinitionsDicNarrow: typeof cardDefinitionsDic = {};

cardDefinitions.getCardInfo = (name: string) => cardDefinitionsDic[name] ?? cardDefinitionsDicNarrow[name.toNarrow().replaceAll("－", "-")];

const pushCardInfo = (info: EntityStatusBase & CardInfoDescription) => {
  if (!info) {
    throw new Error(info);
  }
  if (info.kind === "Monster" && info.monsterCategories && !info.monsterCategories?.includes("Effect") && !info.monsterCategories.includes("Pendulum")) {
    info.isImplemented = true;
    cardDefinitions.nonDefinitionCount++;
  }
  if (info.isForTest && info.isImplemented) {
    cardDefinitions.testCardCount++;
  }
  cardDefinitionsDic[info.name] = info;
  cardDefinitionsDicNarrow[info.name.toNarrow().replaceAll("－", "-")] = info;
};

Object.values(fuga).forEach(pushCardInfo);

const { promise, resolve, reject } = createPromiseSweet<Readonly<typeof cardDefinitions>>();
export const cardDefinitionsPrms = promise;

const loededUrls: string[] = [];
/**
 * jsonファイルのルート相対パスを取得
 * ※ルート相対パス……/始まりで記述すると、ルート階層を基準にパスを記述できる
 * @param jsonFileName
 * @returns jsonファイルのルート相対パス
 */
const getJsonFileUrl = (jsonFileName: string) => `/stk_ygo_svelte/json/${jsonFileName}`;

export const loadTextData = async (cids: number[]) => {
  const list = (
    await Promise.all(
      (
        await Promise.all(
          cids
            .map((cid) => Math.floor(cid / 1000) * 1000)
            .getDistinct()
            .map((key) => `cardInfoText_cid${key.toString().padStart(6, "0")}.json`)
            .map(getJsonFileUrl)
            .filter((url) => !loededUrls.includes(url))
            .map((url) => {
              loededUrls.push(url);
              console.info(`${url} starts loading`);
              return fetch(url);
            })
        )
      ).map((res) => {
        console.log(`${res.url} has been loaded`);
        return res.json();
      })
    )
  ).flatMap((item) => item);
  for (const info of Object.values(cardDefinitionsDic)) {
    for (const record of list) {
      if (info.cardId === record[0]) {
        let i = 0;
        info.nameKana = record[++i];
        info.description = record[++i];
        info.pendulumDescription = record[++i];
        info.wikiEncodedName = record[++i];
      }
    }
  }
};

const loadStatusData = async () => {
  await Promise.all(
    jsonFileList.statusJsons.map(getJsonFileUrl).map(async (url) => {
      loededUrls.push(url);
      console.info(`${url} starts loading `);
      const res = await fetch(url);
      console.info(`res=${res.status} ${res.statusText} ${res.url}`);
      const statusArray: (string | number | string | undefined)[][] = await res.json();
      statusArray.map(convertToEntityStatusBase).forEach(pushCardInfo);
      console.info(`${url} has been loaded `);
    })
  );
  cardDefinitions.knmCount = Object.values(cardDefinitionsDic)
    .map((info) => info.cardId)
    .getDistinct()
    .map(isNumber).length;
  console.info(`All status json files has been loaded `);

  for (const definition of generateAllProcCardDefinitions()) {
    if (cardNames.has(definition.name)) {
      throw new Error(`カード定義重複${definition.name}`);
    }

    const cardDefinition = cardDefinitions.getCardInfo(definition.name);

    if (cardDefinition) {
      cardDefinition.isImplemented = true;
      cardDefinitions.definitionCount++;
    }
  }
  console.info(`All isImplemented Flg has been updated `);
  resolve(cardDefinitions);

  // デッキ編集画面を開くまでに準備できていればよいので、適当に遅延する
  // NOTE: ある程度のディレイをかけないと描画よりも優先してしまうので適当な時間を設定。本来は描画完了を待つのが適切と思われる。
  delay(200).then(() => {
    cardDefinitions.tree = createCardTree(Object.values(cardDefinitionsDic));

    console.info(`Card Tree has been created `);

    Object.values(cardDefinitions.tree).forEach((infos) => infos.sort(cardSorter));

    console.info(`Card Tree has been sorted `);
  });
};

loadStatusData();

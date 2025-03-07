import { StkIndexedDB } from "@stk_utils/class/StkIndexedDB";
import { StkDataStore, type IStkDataRecord } from "@stk_utils/class/StkDataStore";
import { cardInfoDic } from "@ygo/class/CardInfo";
import type { TTblNames } from "@ygo_app/components/App.svelte";

export type DeckHeaderRecord = IStkDataRecord & {
  lastUsedAt: Date;
};
export type DeckDetailRecord = IStkDataRecord & {
  deckId: number;
  seq: number;
};
export interface IDeckInfo {
  id: number;
  name: string;
  description: string;
  lastUsedAt: Date;
  cardNames: Readonly<string[]>;
}

export class DeckInfo implements IDeckInfo {
  private static tblHeader: TblDeckHeader;
  private static tblDetail: TblDeckDetail;

  public static readonly getAllDeckInfo = async (idb: StkIndexedDB<TTblNames>): Promise<DeckInfo[]> => {
    if (!DeckInfo.tblHeader) {
      DeckInfo.tblHeader = new TblDeckHeader(idb);
    }
    if (!DeckInfo.tblDetail) {
      DeckInfo.tblDetail = new TblDeckDetail(idb);
    }
    const headers = await DeckInfo.tblHeader.getAll();
    const details = await DeckInfo.tblDetail.getAll();

    if (!headers.length) {
      return [await DeckInfo.createNewDeck(sampleDecks[0].name, sampleDecks[0].description, sampleDecks[0].cardNames)];
    }

    return headers.map((header) => new DeckInfo(header, details));
  };

  public static createNewDeck = async (deckName: string, description: string, cardNames: Readonly<string[]>): Promise<DeckInfo> => {
    const header = await DeckInfo.tblHeader.insert({
      name: deckName,
      description: description,
      lastUsedAt: new Date(),
    });

    const details = await DeckInfo.tblDetail.insertMany(
      cardNames.map((name, index) => {
        return {
          deckId: header.id,
          seq: index,
          name: name,
          description: "",
        };
      })
    );

    return new DeckInfo(header, details);
  };

  public readonly id: number;
  public readonly name: string;
  public readonly description: string;
  public readonly lastUsedAt: Date;
  public readonly cardNames: Readonly<string[]>;
  private constructor(header: DeckHeaderRecord, details: DeckDetailRecord[]) {
    this.id = header.id;
    this.name = header.name;
    this.description = header.description;
    this.lastUsedAt = header.lastUsedAt;
    this.cardNames = details.filter((detail) => detail.deckId === this.id).map((detail) => detail.name);
  }

  public readonly getIllegalCardNames = () => {
    return Array.from(new Set(this.cardNames.filter((name) => !Object.keys(cardInfoDic).includes(name))));
  };
  public readonly getDisableCardNames = () => {
    return Array.from(new Set(this.cardNames.filter((name) => !Object.keys(cardInfoDic).includes(name))));
  };
  public readonly createCardInfos = () => {
    const disableCardNames = this.getIllegalCardNames();
    if (disableCardNames.length > 0) {
      throw new Error(`存在しないカード名からデッキを生成しようとした。${disableCardNames}`);
    }
    return this.cardNames.map((name) => cardInfoDic?.[name]).filter((info) => info);
  };
  public copy = async (): Promise<DeckInfo> => {
    return DeckInfo.createNewDeck(this.name, this.description, this.cardNames);
  };
  public saveDeckInfo = async (newDeckInfo: IDeckInfo): Promise<DeckInfo> => {
    //ヘッダ情報更新
    await DeckInfo.tblHeader.update(this.id, (info) => {
      return {
        ...info,
        name: newDeckInfo.name,
        description: newDeckInfo.description,
      };
    });

    //旧明細削除
    const oldDetails = (await DeckInfo.tblDetail.getAll()).filter((detail) => detail.deckId === this.id);
    await DeckInfo.tblDetail.delete(oldDetails.map((detail) => detail.id));

    //新明細作成
    const newDetails = await DeckInfo.tblDetail.insertMany(
      newDeckInfo.cardNames.map((name, index) => {
        return {
          deckId: this.id,
          seq: index,
          name: name,
          description: "",
        };
      })
    );

    //新規のデッキ情報を返す。
    return new DeckInfo(await DeckInfo.tblHeader.get(this.id), newDetails);
  };
  public readonly delete = async () => {
    await DeckInfo.tblHeader.delete([this.id]);

    //旧明細削除
    const oldDetails = (await DeckInfo.tblDetail.getAll()).filter((detail) => detail.deckId === this.id);
    await DeckInfo.tblDetail.delete(oldDetails.map((detail) => detail.id));
  };
}

class TblDeckHeader extends StkDataStore<DeckHeaderRecord, TTblNames> {
  constructor(idb: StkIndexedDB<TTblNames>) {
    super(idb, "TblDeckHeader");
  }

  public _prepareInitialRecords = () => [];
}
class TblDeckDetail extends StkDataStore<DeckDetailRecord, TTblNames> {
  constructor(idb: StkIndexedDB<TTblNames>) {
    super(idb, "TblDeckDetail");
  }

  public _prepareInitialRecords = () => [];
}

let sampleid = -1;
let cardNames = [
  "おろかな埋葬",
  "成金ゴブリン",
  "強欲な壺",
  "天使の施し",
  "増援",
  "死者蘇生",
  "Ｅ－エマージェンシーコール",
  "サイバー・ドラゴン",
  "ナチュル・ガオドレイク",
  "スクラップ・デスデーモン",
  "大地の騎士ガイアナイト",
];
cardNames = [
  ...cardNames,
  ...cardNames,
  ...cardNames,
  "アレキサンドライドラゴン",
  "ジェネティック・ワーウルフ",
  "機界騎士アヴラム",
  "ジョングルグールの幻術師",
  "ゾンビーノ",
  "幻のグリフォン",
  "フロストザウルス",
  "エレキテルドラゴン",
  "青眼の白龍",
  "幻殻竜",
  "しゃりの軍貫",
  "チューン・ウォリアー",
  "ライドロン",
  "Ａ・マインド",
  "ウォーター・スピリット",
  "エンジェル・トランペッター",
  "ガード・オブ・フレムベル",
  "ギャラクシーサーペント",
  "ジェネクス・コントローラー",
  "スペース・オマジナイ・ウサギ",
  "ハロハロ",
  "ライブラの魔法秤",
  "ラブラドライドラゴン",
  "守護竜ユスティア",
  "竜核の呪霊者",
  "Ｅ・ＨＥＲＯ クレイマン",
  "Ｅ・ＨＥＲＯ スパークマン",
  "Ｅ・ＨＥＲＯ ネオス",
  "Ｅ・ＨＥＲＯ バーストレディ",
  "Ｅ・ＨＥＲＯ フェザーマン",
];

export const sampleDecks: IDeckInfo[] = [
  {
    id: sampleid--,
    name: "サンプルデッキ１",
    description: "",
    lastUsedAt: new Date(),
    cardNames: cardNames,
  },
];

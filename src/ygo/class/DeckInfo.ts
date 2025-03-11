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
  private static idb: StkIndexedDB<TTblNames> | undefined;
  private static tblHeader: TblDeckHeader;
  private static tblDetail: TblDeckDetail;

  public static readonly getAllDeckInfo = async (idb?: StkIndexedDB<TTblNames>): Promise<DeckInfo[]> => {
    if (idb) {
      DeckInfo.idb = idb;
    }
    if (!DeckInfo.idb) {
      throw new Error("illegal argument: idb is undefined.");
    }
    if (!DeckInfo.tblHeader) {
      DeckInfo.tblHeader = new TblDeckHeader(DeckInfo.idb);
    }
    if (!DeckInfo.tblDetail) {
      DeckInfo.tblDetail = new TblDeckDetail(DeckInfo.idb);
    }
    const headers = await DeckInfo.tblHeader.getAll();
    const details = await DeckInfo.tblDetail.getAll();

    if (!headers.length) {
      return [await DeckInfo.prepareSampleDeck()];
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

  public static prepareSampleDeck = async () => {
    return await DeckInfo.createNewDeck(sampleDecks[0].name, sampleDecks[0].description, sampleDecks[0].cardNames);
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
  public updateTimestamp = async (): Promise<void> => {
    //ヘッダ情報更新
    await DeckInfo.tblHeader.update(this.id, (info) => {
      return {
        ...info,
        lastUsedAt: new Date(),
      };
    });
  };
  public saveDeckInfo = async (newDeckInfo?: IDeckInfo): Promise<DeckInfo> => {
    const _newDeckInfo = newDeckInfo ?? this;

    //ヘッダ情報更新
    await DeckInfo.tblHeader.update(this.id, (info) => {
      return {
        ...info,
        name: _newDeckInfo.name,
        description: _newDeckInfo.description,
      };
    });

    //旧明細削除
    const oldDetails = (await DeckInfo.tblDetail.getAll()).filter((detail) => detail.deckId === this.id);
    console.log(_newDeckInfo.cardNames);
    await DeckInfo.tblDetail.delete(oldDetails.map((detail) => detail.id));

    //新明細作成
    const newDetails = await DeckInfo.tblDetail.insertMany(
      _newDeckInfo.cardNames.map((name, index) => {
        return {
          deckId: this.id,
          seq: index,
          name: name,
          description: "",
        };
      })
    );

    console.log(newDetails);
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
  "トレード・イン",
  "調和の宝札",
  "死者蘇生",
  "召喚師のスキル",
  "サイバー・ドラゴン",
  "Ｄ－ＨＥＲＯ ディアボリックガイ",
  "ライトロード・ビースト ウォルフ",
  "ナチュル・ガオドレイク",
  "スクラップ・デスデーモン",
  "大地の騎士ガイアナイト",
  "青眼の白龍",
];
cardNames = [
  ...cardNames,
  ...cardNames,
  ...cardNames,
  "Ｅ－エマージェンシーコール",
  "闇の量産工場",
  "戦士の生還",
  "トレード・イン",
  "ジェネティック・ワーウルフ",
  "ジョングルグールの幻術師",
  "ゾンビーノ",
  "フロストザウルス",
  "しゃりの軍貫",
  "チューン・ウォリアー",
  "貪欲な壺",
  "ガード・オブ・フレムベル",
  "ギャラクシーサーペント",
  "ハロハロ",
  "ラブラドライドラゴン",
  "守護竜ユスティア",
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

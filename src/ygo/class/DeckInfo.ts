import { StkIndexedDB } from "@stk_utils/class/StkIndexedDB";
import { StkDataStore, type IStkDataRecord } from "@stk_utils/class/StkDataStore";
import {} from "@ygo/class/CardInfo";
import type { TTblNames } from "@app/components/App.svelte";
import sampleDeckInfos from "@ygo/json/SampleDeckInfos.json";
import { isObject } from "@stk_utils/funcs/StkObjectUtils";
import { isNumber } from "@stk_utils/funcs/StkMathUtils";
// ヘッダと明細を分ける意味はなかった気がする……

type TDeckType = "User" | "NPC" | "Preset";

export type DeckHeaderRecord = IStkDataRecord & {
  deckType: TDeckType;
  lastUsedAt: Date;
};
export type DeckDetailRecord = IStkDataRecord & {
  deckId: number;
  seq: number;
};
export interface IDeckInfo {
  id: number;
  name: string;
  deckType: TDeckType;
  description: string;
  lastUsedAt: Date;
  cardNames: Readonly<string[]>;
}

export interface IDeckInfoJson {
  id: number;
  name: string;
  description: string;
  lastUsedAt: string;
  cardNames: Readonly<string[]>;
}
const isIDeckInfoJson = (object: unknown): object is IDeckInfoJson => {
  if (!isObject(object)) {
    return false;
  }

  const deckInfo: Partial<IDeckInfoJson> = object;

  return (
    isNumber(deckInfo.id) &&
    typeof deckInfo.name === "string" &&
    typeof deckInfo.description === "string" &&
    typeof deckInfo.lastUsedAt === "string" &&
    Array.isArray(deckInfo.cardNames) &&
    deckInfo.cardNames.every((name: unknown) => typeof name === "string")
  );
};

export class DeckInfo implements IDeckInfo {
  public static readonly toJson = (deckInfos: IDeckInfo[]): string => {
    const _deckInfos = deckInfos.map((info) => {
      const { id, name, description, lastUsedAt, cardNames } = info;
      return { id, name, description, lastUsedAt, cardNames };
    });

    return JSON.stringify(_deckInfos, null, 2);
  };

  public static readonly createfromJson = async (jsonFile: File): Promise<IDeckInfo[]> => {
    let json: ReturnType<typeof JSON.parse> = undefined;

    try {
      const text = await jsonFile.text();
      json = JSON.parse(text);
    } catch (error) {
      console.error(error);
      throw new Error(`${jsonFile.name}は正しいJSONファイル形式ではない。`);
    }

    if (!Array.isArray(json)) {
      throw new Error(`${jsonFile.name}は正しいデッキ情報の形式ではない。`);
    }

    if (!json.length) {
      throw new Error(`${jsonFile.name}にデッキ情報が含まれていない。`);
    }

    const deckInfos = json
      .filter(isIDeckInfoJson)
      .map<IDeckInfo>((json) => ({ ...json, deckType: "User", id: Number(json.id), lastUsedAt: new Date(json.lastUsedAt) }));

    if (json.length !== deckInfos.length) {
      throw new Error(`${jsonFile.name}のデッキ情報${json.length}件のうち、${json.length - deckInfos.length}件が正しいデッキ情報の形式ではなかった。`);
    }

    return deckInfos;
  };
  public static readonly convertToObjectURL = (deckInfos: IDeckInfo[]) => {
    const json = DeckInfo.toJson(deckInfos);
    // 指定されたデータを保持するBlobを作成する。
    const blob = new Blob([json], { type: "text/plain" });
    return window.URL.createObjectURL(blob);
  };
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

  public static createNewDeck = async (deckName: string, description: string, cardNames: Readonly<string[]>, lastUsedAt?: Date): Promise<DeckInfo> => {
    const header = await DeckInfo.tblHeader.insert({
      name: deckName,
      description: description,
      deckType: "User",
      lastUsedAt: lastUsedAt ?? new Date(),
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
    const sampleDeck = sampleDeckInfos.find((info) => info.deckType === "Preset") ?? sampleDeckInfos.slice(-1)[0];
    return await DeckInfo.createNewDeck(sampleDeck.name, sampleDeck.description, sampleDeck.cardNames);
  };
  public static remove = async (id: number) => {
    await DeckInfo.tblHeader.delete([id]);

    //旧明細削除
    const oldDetails = (await DeckInfo.tblDetail.getAll()).filter((detail) => detail.deckId === id);
    await DeckInfo.tblDetail.delete(oldDetails.map((detail) => detail.id));
  };

  public readonly id: number;
  public readonly name: string;
  public readonly deckType: TDeckType;
  public readonly description: string;
  public readonly lastUsedAt: Date;
  public readonly cardNames: Readonly<string[]>;
  private constructor(header: DeckHeaderRecord, details: DeckDetailRecord[]) {
    this.id = header.id;
    this.name = header.name;
    this.deckType = header.deckType;
    this.description = header.description;
    this.lastUsedAt = header.lastUsedAt;
    this.cardNames = details.filter((detail) => detail.deckId === this.id).map((detail) => detail.name);
  }

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
        deckType: "User",
        lastUsedAt: new Date(),
      };
    });

    //旧明細削除
    const oldDetails = (await DeckInfo.tblDetail.getAll()).filter((detail) => detail.deckId === this.id);
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

    //新規のデッキ情報を返す。
    return new DeckInfo(await DeckInfo.tblHeader.get(this.id), newDetails);
  };
  public readonly delete = async () => {
    await DeckInfo.remove(this.id);
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

export const sampleDecks: IDeckInfo[] = (sampleDeckInfos as Omit<IDeckInfo, "lastUsedAt">[])
  .map((info) => {
    return { ...info, lastUsedAt: new Date() };
  })
  .filter((info) => info.id < 0);

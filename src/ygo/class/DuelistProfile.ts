import { StkDataStore, type IStkDataRecord } from "@stk_utils/class/StkDataStore";
import type { StkIndexedDB } from "@stk_utils/class/StkIndexedDB";
import type { TTblNames } from "@app/components/App.svelte";
import { duelStartModes, type TDuelStartMode } from "@ygo_duel/class/Duel";
import { min } from "@stk_utils/funcs/StkMathUtils";
export type DuelistHeaderRecord = IStkDataRecord & {
  previousNpcId: number;
  previousStartMode: TDuelStartMode;
};
export interface IDuelistHeaderRecord {
  id: number;
  name: string;
  description: string;
  previousNpcId: number;
  previousStartMode: TDuelStartMode;
}
export interface IDuelistProfile {
  id: number;
  name: string;
  description: string;
  npcLvl: number;
}

export class DuelistProfile implements IDuelistProfile {
  private static tblHeader: TblDuelistHeader;

  public static readonly getOrCreateNew = async (idb: StkIndexedDB<TTblNames>): Promise<DuelistProfile> => {
    if (!DuelistProfile.tblHeader) {
      DuelistProfile.tblHeader = new TblDuelistHeader(idb);
    }
    const headers = await DuelistProfile.tblHeader.getAll();

    if (headers.length) {
      return new DuelistProfile(headers[0]);
    }

    const header = await DuelistProfile.tblHeader.insert({
      name: "あなた",
      description: "ここの文字列を何に使うかは未定。",
      previousNpcId: 0,
      previousStartMode: "Random",
    });

    return new DuelistProfile(header);
  };

  public readonly id: number;
  public readonly name: string;
  public readonly description: string;
  public readonly previousNpcId: number;
  public readonly previousStartMode: TDuelStartMode;
  public get npcLvl() {
    return Number.MAX_VALUE;
  }
  private constructor(header: DuelistHeaderRecord) {
    console.log(header);
    this.id = header.id;
    this.name = header.name;
    this.description = header.description;
    this.previousNpcId = nonPlayerCharacters.find((npc) => npc.id === header.previousNpcId)?.id ?? min(...nonPlayerCharacters.map((npc) => npc.id));
    this.previousStartMode = duelStartModes.includes(header.previousStartMode) ? header.previousStartMode : "Random";
  }

  public save = async (newInfo?: IDuelistHeaderRecord): Promise<DuelistProfile> => {
    const _newInfo = newInfo ?? {
      id: this.id,
      name: this.name,
      description: this.description,
      previousNpcId: this.previousNpcId,
      previousStartMode: this.previousStartMode,
    };

    //ヘッダ情報更新
    const newRecord = await DuelistProfile.tblHeader.update(this.id, (info) => {
      return {
        ...info,
        ..._newInfo,
      };
    });

    return new DuelistProfile(newRecord);
  };
}

class TblDuelistHeader extends StkDataStore<DuelistHeaderRecord, TTblNames> {
  constructor(idb: StkIndexedDB<TTblNames>) {
    super(idb, "TblDuelistProfile");
  }

  public _prepareInitialRecords = () => [];
}

let npcId = -1;

export const nonPlayerCharacters: IDuelistProfile[] = [
  {
    id: npcId--,
    name: "サンドバッグくん棒立ち",
    description: "攻撃宣言なし、強制効果以外の効果の発動なし。",
    npcLvl: 0,
  },
  {
    id: npcId--,
    name: "サンドバッグくん非暴力",
    description: "攻撃宣言なし。",
    npcLvl: 100,
  },
  {
    id: npcId--,
    name: "サンドバッグくん白帯",
    description: "とくに制限なし。",
    npcLvl: 200,
  },
];

import { StkDataStore, type IStkDataRecord } from "@stk_utils/class/StkDataStore";
import type { StkIndexedDB } from "@stk_utils/class/StkIndexedDB";
import type { TTblNames } from "@app/components/App.svelte";
import { duelStartModes, type TDuelStartMode } from "@ygo_duel/class/Duel";
import type { ChainConfig } from "@ygo_duel/class/Duelist";
export type TGameMode = "Preset" | "Free";
export type DuelistHeaderRecord = IStkDataRecord & {
  chainConfig: ChainConfig;
  previousGameMode: TGameMode;
  previousNpcId: number;
  previousNpcDeckId: number;
  previousStartMode: TDuelStartMode;
};
export interface IDuelistHeaderRecord {
  id: number;
  name: string;
  description: string;
  chainConfig: ChainConfig;
  previousGameMode: TGameMode;
  previousNpcId: number;
  previousNpcDeckId: number;
  previousStartMode: TDuelStartMode;
}
export interface IDuelistProfile {
  id: number;
  name: string;
  description: string;
  npcLvl: number;
  npcType: "None" | "Normal" | "FtkChallenge";
  chainConfig?: ChainConfig;
}

export class DuelistProfile implements IDuelistProfile {
  private static tblHeader: TblDuelistHeader;

  public static readonly getOrCreateNew = async (idb: StkIndexedDB<TTblNames>): Promise<DuelistProfile> => {
    if (!DuelistProfile.tblHeader) {
      DuelistProfile.tblHeader = new TblDuelistHeader(idb);
    }
    const headers = await DuelistProfile.tblHeader.getAll();

    if (headers.length) {
      let header = headers[0];
      if (!header.chainConfig) {
        header = {
          ...header,
          chainConfig: {
            noticeSelfChain: false,
            noticeFreeChain: false,
          },
        };
      }
      return new DuelistProfile(header);
    }

    const header = await DuelistProfile.tblHeader.insert({
      name: "あなた",
      description: "ここの文字列を何に使うかは未定。",
      chainConfig: {
        noticeSelfChain: false,
        noticeFreeChain: false,
      },
      previousGameMode: "Preset",
      previousNpcId: 0,
      previousNpcDeckId: Number.MIN_SAFE_INTEGER,
      previousStartMode: "Random",
    });

    return new DuelistProfile(header);
  };

  public readonly id: number;
  public readonly name: string;
  public readonly description: string;
  public readonly chainConfig: ChainConfig;

  public readonly previousGameMode: TGameMode;
  public readonly previousNpcId: number;
  public readonly previousNpcDeckId: number;
  public readonly previousStartMode: TDuelStartMode;
  public readonly npcLvl = Number.MAX_VALUE;
  public readonly npcType = "None";

  private constructor(header: DuelistHeaderRecord) {
    this.id = header.id;
    this.name = header.name;
    this.description = header.description;
    this.chainConfig = header.chainConfig;
    this.previousGameMode = header.previousGameMode;
    this.previousNpcId = nonPlayerCharacters.find((npc) => npc.id === header.previousNpcId)?.id ?? nonPlayerCharacters.map((npc) => npc.id).min() ?? 0;
    this.previousStartMode = duelStartModes.includes(header.previousStartMode) ? header.previousStartMode : "Random";
    this.previousNpcDeckId = header.previousNpcDeckId;
  }

  public save = async (newInfo?: Partial<IDuelistHeaderRecord>): Promise<DuelistProfile> => {
    const _newInfo = {
      id: this.id,
      name: this.name,
      description: this.description,
      chainConfig: this.chainConfig ?? {
        noticeSelfChain: false,
        noticeFreeChainPhase: false,
        noticeFreeChainStep: false,
        noticeAfterChainInMainPhase: false,
      },
      previousGameMode: this.previousGameMode ?? "Preset",
      previousNpcId: this.previousNpcId ?? Number.MIN_SAFE_INTEGER,
      previousStartMode: this.previousStartMode,
      previousNpcDeckId: this.previousNpcDeckId > -1 ? this.previousNpcDeckId : Number.MIN_SAFE_INTEGER,
      ...newInfo,
    };

    //ヘッダ情報更新
    const newRecord = await DuelistProfile.tblHeader.update(this.id, (info) => {
      return {
        ...info,
        ..._newInfo,
      };
    });
    console.log(this.previousNpcDeckId, Number.MIN_SAFE_INTEGER, _newInfo, newRecord);

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
    npcType: "Normal",
  },
  {
    id: npcId--,
    name: "サンドバッグくん非暴力",
    description: "攻撃宣言なし。",
    npcLvl: 100,
    npcType: "Normal",
  },
  {
    id: npcId--,
    name: "サンドバッグくん白帯",
    description: "とくに制限なし。",
    npcLvl: 200,
    npcType: "Normal",
  },
  {
    id: Number.MIN_SAFE_INTEGER,
    name: "FTK or Die",
    description: "FTKに失敗すると敗北。",
    npcLvl: Number.MIN_SAFE_INTEGER,
    npcType: "FtkChallenge",
  },
];

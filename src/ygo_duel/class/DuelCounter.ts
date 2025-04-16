import type { CardActionBase } from "./DuelCardActionBase";
import type { DuelEntity } from "./DuelEntity";

export const actualCounterNames = ["SpellCounter", "KaijuCounter", "NamelessCounter", "IceCounter"] as const;
export type TActualCounterName = (typeof actualCounterNames)[number];
export const namedSystemCounterNames = ["SonicBarrier"] as const;
export type TNamedSystemCounterName = (typeof namedSystemCounterNames)[number];

export const stickyTemporaryCounterNames = ["CycleFlip", "SonicBarrier", "SonicVerse"] as const;
export type TStickyTemporaryCounterName = (typeof stickyTemporaryCounterNames)[number];
export const stickyCounterNames = ["GoldSarcophagus"] as const;
export type TStickyCounterName = (typeof stickyCounterNames)[number];
export const counterNames = [...actualCounterNames, ...stickyTemporaryCounterNames, ...stickyCounterNames] as const;
export type TCounterName = (typeof counterNames)[number];

export const actualCounterDic: { [key in TActualCounterName]: string } = {
  SpellCounter: "魔力カウンター",
  KaijuCounter: "壊獣カウンター",
  NamelessCounter: "カウンター",
  IceCounter: "アイスカウンター",
};

export const actualCounterEmojiDic: { [key in TActualCounterName]: string } = {
  SpellCounter: "🔮",
  KaijuCounter: "☢",
  NamelessCounter: "💠",
  IceCounter: "❄",
};

export class CounterHolder {
  private readonly dic: { [name: string]: DuelEntity[] };
  private readonly temporaryCounterNames: string[];
  constructor() {
    this.dic = {};
    this.temporaryCounterNames = [];
  }

  public readonly add = (name: TCounterName, qty: number = 1, by: DuelEntity) => {
    this.dic[name] = [...(this.dic[name] ?? []), ...Array(qty).fill(by)];
    return this.dic[name];
  };
  public readonly setQty = (name: TCounterName, qty: number = 1, by: DuelEntity) => {
    this.dic[name] = [...Array(qty).fill(by)];
    return this.dic[name];
  };
  public readonly remove = (name: TCounterName, qty: number = 1, by?: DuelEntity) => {
    const currentQty = this.dic[name].length;
    if (currentQty === undefined) {
      return [];
    }
    if (qty >= currentQty) {
      delete this.dic[name];
      return [];
    }

    if (by) {
      const tmp = this.dic[name].filter((entity) => entity === by);
      const rest = this.dic[name].filter((entity) => entity !== by);

      this.dic[name] = [...tmp.slice(qty), ...rest];
    } else {
      this.dic[name] = this.dic[name].slice(qty);
    }

    return this.dic[name];
  };
  public readonly removeAll = (name: TCounterName, by?: DuelEntity) => {
    if (by) {
      const qty = this.dic[name].filter((entity) => entity === by).length;
      this.dic[name] = this.dic[name].filter((entity) => entity !== by);
      return qty;
    }
    const qty = this.dic[name];

    delete this.dic[name];
    return qty;
  };
  public readonly getQty = (name: TCounterName, by?: DuelEntity) => {
    if (!this.dic[name]) {
      return 0;
    }
    if (by) {
      return this.dic[name].filter((entity) => entity === by).length;
    }
    return this.dic[name].length ?? 0;
  };

  public readonly incrementActionCountPerTurn = (action: CardActionBase) => {
    this.temporaryCounterNames.push(action.title);
    this.incrementActionCount(action);
  };
  public readonly incrementActionCount = (action: CardActionBase) => {
    this.dic[action.title] = [action.entity, ...(this.dic[action.title] ?? [])];
  };
  public readonly getActionCount = (action: CardActionBase) => {
    if (!this.dic[action.title]) {
      return 0;
    }
    return this.dic[action.title].filter((entity) => entity === action.entity).length;
  };

  /**
   * ターン終了時
   */
  public readonly corpseDisposal = () => {
    this.temporaryCounterNames.forEach((name) => delete this.dic[name]);
    this.temporaryCounterNames.reset();
    stickyTemporaryCounterNames.forEach((name) => delete this.dic[name]);
  };
  /**
   * カウンタークリーナー専用？
   */
  public readonly removeAllActualCounters = () => {
    actualCounterNames.forEach((name) => delete this.dic[name]);
  };
  /**
   * 裏守備になったとき。サイクルリバースのカウンターは消えない。
   */
  public readonly removeAllWhenfaceDown = () => {
    this.temporaryCounterNames.forEach((name) => delete this.dic[name]);
    this.temporaryCounterNames.reset();
    actualCounterNames.forEach((name) => delete this.dic[name]);
  };
  /**
   * 場を離れたとき
   */
  public readonly clear = () => {
    stickyTemporaryCounterNames.forEach((name) => delete this.dic[name]);
    this.temporaryCounterNames.forEach((name) => delete this.dic[name]);
    this.temporaryCounterNames.reset();
    counterNames.forEach((name) => delete this.dic[name]);
  };
}

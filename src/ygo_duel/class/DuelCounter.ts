import type { CardAction } from "./DuelCardAction";

export const actualCounterNames = ["SpellCounter", "KaijuCounter", "NamelessCounter"] as const;
export type TActualCounterName = (typeof actualCounterNames)[number];
export const stickyTemporaryCounterNames = ["CycleFlip"] as const;
export type TStickyTemporaryCounterName = (typeof stickyTemporaryCounterNames)[number];
export const stickyCounterNames = ["CycleFlip", "GoldSarcophagus"] as const;
export type TStickyCounterName = (typeof stickyCounterNames)[number];
export const counterNames = [...actualCounterNames, ...stickyTemporaryCounterNames, ...stickyCounterNames] as const;
export type TCounterName = (typeof counterNames)[number];

export const actualCounterDic: { [key in TActualCounterName]: string } = {
  SpellCounter: "魔力カウンター",
  KaijuCounter: "壊獣カウンター",
  NamelessCounter: "カウンター",
};

export const actualCounterEmojiDic: { [key in TActualCounterName]: string } = {
  SpellCounter: "🔮",
  KaijuCounter: "☢",
  NamelessCounter: "💠",
};

export class CounterHolder {
  private readonly dic: { [name: string]: number };
  private readonly temporaryCounterNames: string[];
  constructor() {
    this.dic = {};
    this.temporaryCounterNames = [];
  }

  public readonly add = (name: TCounterName, qty: number = 1) => {
    this.dic[name] = (this.dic[name] ?? 0) + qty;
    return this.dic[name];
  };
  public readonly setQty = (name: TCounterName, qty: number = 1) => {
    this.dic[name] = qty;
    return this.dic[name];
  };
  public readonly remove = (name: TCounterName, qty: number = 1) => {
    this.dic[name] = (this.dic[name] ?? 0) - qty;
    return this.dic[name];
  };
  public readonly removeAll = (name: TCounterName) => {
    const qty = this.dic[name];
    delete this.dic[name];
    return qty;
  };
  public readonly getQty = (name: TCounterName) => {
    return this.dic[name] ?? 0;
  };

  public readonly incrementActionCountPerTurn = <T>(action: CardAction<T>) => {
    this.temporaryCounterNames.push(action.title);
    this.dic[action.title] = (this.dic[action.title] ?? 0) + 1;
  };
  public readonly incrementActionCount = <T>(action: CardAction<T>) => {
    this.dic[action.title] = (this.dic[action.title] ?? 0) + 1;
  };
  public readonly getActionCount = <T>(action: CardAction<T>) => {
    return this.dic[action.title] ?? 0;
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

export const actualCounterNames = ["SpellCounter", "KaijuCounter", "NamelessCounter"] as const;
export type TActualCounterName = (typeof actualCounterNames)[number];
export const temporaryCounterNames = ["①", "②", "③", "④"] as const;
export type TTemporaryCounterName = (typeof temporaryCounterNames)[number];
export const stickyTemporaryCounterNames = ["CycleFlip", "GoldSarcophagus"] as const;
export type TStickyTemporaryCounterName = (typeof stickyTemporaryCounterNames)[number];
export const counterNames = [...actualCounterNames, ...temporaryCounterNames, ...stickyTemporaryCounterNames] as const;
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
  constructor() {
    this.dic = {};
  }

  public readonly add = (name: TCounterName, qty: number = 1) => {
    this.dic[name] = (this.dic[name] ?? 0) + qty;
  };
  public readonly setQty = (name: TCounterName, qty: number = 1) => {
    this.dic[name] = qty;
  };
  public readonly remove = (name: TCounterName, qty: number = 1) => {
    this.dic[name] = (this.dic[name] ?? 0) - qty;
  };
  public readonly getQty = (name: TCounterName) => {
    return this.dic[name] ?? 0;
  };

  /**
   * ターン終了時
   */
  public readonly corpseDisposal = () => {
    temporaryCounterNames.forEach((name) => delete this.dic[name]);
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
    temporaryCounterNames.forEach((name) => delete this.dic[name]);
    actualCounterNames.forEach((name) => delete this.dic[name]);
  };
  /**
   * 場を離れたとき
   */
  public readonly clear = () => {
    counterNames.forEach((name) => delete this.dic[name]);
  };
}

import type { EntityActionBase } from "@ygo_duel/class/DuelEntityActionBase";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import _counterInfo from "@ygo_duel/json/counterInfo.json";
export type TCounterName = keyof typeof _counterInfo;

const counterInfo = _counterInfo as {
  [name in TCounterName]: {
    name: TCounterName;
    type: "Actual" | "System";
    text: string;
    emoji: string;
    /**
     * 裏守備になった時に消えるかどうか
     */
    sticky: boolean;
    /**
     * ターン終了時に消えるかどうか
     */
    temporary: boolean;
    /**
     * フィールドを離れた時に消えるかどうか
     */
    isOnlyOnField: boolean;
  };
};

const illegalCounters = Object.values(counterInfo)
  .filter((info) => info.type === "Actual")
  .filter((info) => info.sticky || info.temporary || !info.isOnlyOnField);
if (illegalCounters.length) {
  throw new Error(`カウンターの設定誤り。${illegalCounters.map((info) => info.name).join(", ")}`);
}
export const getCounterEmoji = (name: TCounterName) => counterInfo[name].emoji;

export class CounterHolder {
  private readonly dic: { [name: string]: DuelEntity[] };
  private readonly temporaryCounterNames: string[];
  private readonly entity: DuelEntity;
  constructor(entity: DuelEntity) {
    this.dic = {};
    this.temporaryCounterNames = [];
    this.entity = entity;
  }

  public readonly add = (name: TCounterName, qty: number = 1, by: DuelEntity) => {
    this.dic[name] = [...(this.dic[name] ?? []), ...Array(qty).fill(by)];
    const maxQty = this.entity.status.maxCounterQty[name] ?? 0;
    if (maxQty) {
      this.dic[name] = this.dic[name].slice(0, maxQty);
    }

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

  public readonly setSelfDestructionFlg = (by: DuelEntity) => {
    this.add("SelfDestruction", 1, by);
  };
  public readonly getSelfDestructionFlg = (by: DuelEntity): boolean => {
    return this.getQty("SelfDestruction", by) > 0;
  };
  public readonly setCurfewFlg = (by: DuelEntity) => {
    this.add("Curfew", 1, by);
  };
  public readonly getCurfewFlg = (by: DuelEntity) => {
    return this.getQty("Curfew", by) > 0;
  };
  public readonly incrementActionCountPerTurn = (action: EntityActionBase) => {
    this.temporaryCounterNames.push(action.title);
    this.incrementActionCount(action);
  };
  public readonly incrementActionCount = (action: EntityActionBase) => {
    this.dic[action.title] = [action.entity, ...(this.dic[action.title] ?? [])];
  };
  public readonly getActionCount = (action: EntityActionBase) => {
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
    Object.values(counterInfo)
      .filter((info) => info.temporary)
      .forEach((info) => delete this.dic[info.name]);
  };
  /**
   * カウンタークリーナー専用？
   */
  public readonly removeAllActualCounters = () => {
    Object.values(counterInfo)
      .filter((info) => info.type === "Actual")
      .forEach((info) => delete this.dic[info.name]);
  };
  /**
   * 裏守備になったとき。サイクルリバースのカウンターは消えない。
   */
  public readonly removeAllWhenfaceDown = () => {
    this.temporaryCounterNames.forEach((name) => delete this.dic[name]);
    this.temporaryCounterNames.reset();
    Object.values(counterInfo)
      .filter((info) => !info.sticky)
      .forEach((info) => delete this.dic[info.name]);
  };
  /**
   * 場を離れたとき
   */
  public readonly clear = () => {
    this.temporaryCounterNames.forEach((name) => delete this.dic[name]);
    this.temporaryCounterNames.reset();
    Object.values(counterInfo)
      .filter((info) => info.isOnlyOnField)
      .forEach((info) => delete this.dic[info.name]);
  };
}

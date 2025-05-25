import { StkEvent, type IStkEvent } from "@stk_utils/class/StkEvent";

export type ChoicesSweet<T> = Readonly<{
  selectables: T[];
  qty?: number;
  validator: (selected: T[]) => boolean;
  cancelable: boolean;
}>;

export const randomChoice = <T>(choice: ChoicesSweet<T>) => {
  let selected: T[] = [];

  do {
    const _qty = choice.qty && choice.qty > 0 ? choice.qty : Math.floor(Math.random() * choice.selectables.length + 1);
    selected = choice.selectables.randomPickMany(_qty);
  } while (!choice.validator(selected));
  return selected;
};

export interface IStatable<S extends string> {
  state: S;
  onStateChange: Readonly<IStkEvent<S>>;
  stateLog: Readonly<{ state: S; timestamp: Date }[]>;
  wasSpawnedAt: Readonly<Date>;
}

export class Statable<S extends string> implements IStatable<S> {
  private readonly onStateChangeEvent = new StkEvent<S>();
  private readonly _stateLog: { state: S; timestamp: Date }[] = [];

  public get stateLog(): Readonly<typeof this._stateLog> {
    return this._stateLog;
  }

  public get wasSpawnedAt() {
    return this.stateLog[0].timestamp;
  }
  public get onStateChange() {
    return this.onStateChangeEvent.expose();
  }
  private _state: S;
  public get state() {
    return this._state;
  }
  public set state(state: S) {
    this._stateLog.push({ state, timestamp: new Date() });
    this._state = state;
    this.onStateChangeEvent.trigger(state);
  }
  constructor(state: S) {
    this._stateLog.push({ state, timestamp: new Date() });
    this._state = state;
  }
}

export class TransactionController implements Disposable {
  private _dispose: () => void;
  private _commit: () => void;
  public constructor(dispose: () => void, commit: () => void) {
    this._dispose = dispose;
    this._commit = commit;
  }
  public readonly commit = () => this._commit();

  public [Symbol.dispose]() {
    this._dispose();
  }
}

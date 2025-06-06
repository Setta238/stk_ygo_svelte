import { StkEvent, type IStkEvent } from "@stk_utils/class/StkEvent";
import { createPromiseSweet } from "@stk_utils/funcs/StkPromiseUtil";

export type TModalState = "Disable" | "Shown";
export type ModalArgsBase = {
  title: string;
  cancelable: boolean;
  position: "Top" | "Middle" | "Bottom";
};

export interface IStkModalDefinition {
  onUpdate: IStkEvent<void>;
  state: TModalState;
  args: ModalArgsBase;
  cancel: () => void;
  terminate: () => void;
}

export class StkModalDefinitionBase<A extends ModalArgsBase, R> implements IStkModalDefinition {
  private onUpdateEvent = new StkEvent<void>();
  public get onUpdate() {
    return this.onUpdateEvent.expose();
  }
  protected _state: TModalState = "Disable";
  public get state() {
    return this._state;
  }
  private defaultArgs: A;
  protected _args: A;
  public get args() {
    return this._args;
  }

  public constructor(args: A) {
    this.defaultArgs = args;
    this._args = args;
  }
  public resolve: (value: R | undefined) => void = () => {};
  public readonly show = (args: A): Promise<R | undefined> => {
    this._args = args;
    this._state = "Shown";
    console.log(this, this.onUpdateEvent);
    this.onUpdateEvent.trigger();

    const { promise, resolve } = createPromiseSweet<R | undefined>();
    this.resolve = (value) => {
      this._state = "Disable";
      resolve(value);
      this.resolve = () => {};
      this.onUpdateEvent.trigger();
    };

    return promise;
  };
  public readonly cancel = () => {
    console.log(this);
    if (!this.args.cancelable) {
      return;
    }
    if (this._state !== "Disable") {
      this.resolve(undefined);
    }
    this.terminate();
  };
  public readonly terminate = () => {
    this._state = "Disable";
    this._args = this.defaultArgs;
    this.resolve = () => {};
  };
}

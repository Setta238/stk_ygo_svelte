export interface IStkEvent<T> {
  append(handler: { (data: T): void | "RemoveMe" }): void;
  remove(handler: { (data: T): void | "RemoveMe" }): void;
}
export class StkEvent<T> {
  private handlers: { (data: T): void | "RemoveMe" }[] = [];

  public get length() {
    return this.handlers.length;
  }

  public append(handler: { (data: T): void | "RemoveMe" }): void {
    this.handlers.push(handler);
  }

  public remove(handler: { (data: T): void | "RemoveMe" }): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  public trigger(data: T) {
    this.handlers
      .slice(0)
      .filter((h) => h(data) === "RemoveMe")
      .forEach((h) => this.remove(h));
  }

  public clear() {
    this.handlers.splice(0);
  }

  public expose(): IStkEvent<T> {
    //追加・除外以外の操作を他クラスからさせないためにキャストする。
    return this;
  }
}
export interface IStkAsyncEvent<T> {
  append(handler: { (data: T): Promise<void | "RemoveMe"> }): void;
  remove(handler: { (data: T): Promise<void | "RemoveMe"> }): void;
}
export class StkAsyncEvent<T> {
  private handlers: { (data: T): Promise<void | "RemoveMe"> }[] = [];

  public append(handler: { (data: T): Promise<void | "RemoveMe"> }): void {
    this.handlers.push(handler);
  }

  public remove(handler: { (data: T): Promise<void | "RemoveMe"> }): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  public async trigger(data: T) {
    const items = await Promise.all(
      this.handlers.slice(0).map(async (h) => {
        const result = await h(data);
        return { h, result };
      })
    );

    items
      .filter((item) => item.result === "RemoveMe")
      .map((item) => item.h)
      .forEach((h) => this.remove(h));
  }

  public clear() {
    this.handlers.splice(0);
  }

  public expose(): IStkAsyncEvent<T> {
    //追加・除外以外の操作を他クラスからさせないためにキャストする。
    return this;
  }
}
//下のAの型を任意にできそうだったが、諦めた。
// type StkEventConstructor<A> = {    (): StkEvent<A>;  };
// type StkEventDefs<A> = Record<string, StkEventConstructor<A>>;
// type hoge<A> = Record<string, StkEvent<infer <A>>>;
// type StkEventArgsType<T>=[T] extends StkEventConstructor<infer A> ?StkEvent<A> :never
// type StkEventFromProps<P>={ [K in keyof P]: StkEventArgsType<P[K]>; }

export class StkEventChainNode {
  private parent: StkEventChainNode | undefined = undefined;
  protected _beforeAppendParentEvent = new StkEvent<StkEventChainNode>();
  public get beforeAppendParentEvent() {
    return this._beforeAppendParentEvent.expose();
  }
  protected _beforeAppendChildEvent = new StkEvent<StkEventChainNode>();
  public get beforeAppendChildEvent() {
    return this._beforeAppendChildEvent.expose();
  }
  protected _beforeRemoveParentEvent = new StkEvent<StkEventChainNode>();
  public get beforeRemoveParentEvent() {
    return this._beforeRemoveParentEvent.expose();
  }
  protected _beforeRemoveChildEvent = new StkEvent<StkEventChainNode>();
  public get beforeRemoveChildEvent() {
    return this._beforeRemoveChildEvent.expose();
  }

  protected readonly appendChild = (child: StkEventChainNode) => {
    child.parent = this;
    this._beforeAppendChildEvent.trigger(child);
    child._beforeAppendParentEvent.trigger(this);
    Object.keys(this.events)
      .filter((key) => child._eventHandlers[key])
      .forEach((key) => this.events[key].append(child._eventHandlers[key]));
  };
  protected readonly appendParent = (parent: StkEventChainNode) => {
    parent.appendChild(this);
  };
  protected readonly removeChild = (child: StkEventChainNode) => {
    //memo this=parent
    this._beforeRemoveChildEvent.trigger(this);
    child._beforeRemoveParentEvent.trigger(this);
    Object.keys(this.events)
      .filter((key) => child._eventHandlers[key])
      .forEach((key) => this.events[key].remove(child._eventHandlers[key]));
    this.parent = undefined;
  };
  protected readonly removeParent = () => {
    if (!this.parent) {
      return;
    }
    this.parent.removeChild(this);
  };

  private __events: Record<string, StkEvent<unknown>> = {};
  protected get _events() {
    return this.__events as Record<string, StkEvent<unknown>>;
  }
  public get events() {
    return this._events as Record<string, IStkEvent<unknown>>;
  }
  private _eventHandlers: Record<string, { (arg: unknown): undefined }> = {};
  protected readonly appendEvent = (name: string, event: StkEvent<unknown>) => {
    this.__events[name] = event;
    this._eventHandlers[name] = (arg: unknown) => {
      event.trigger(arg);
    };
  };
}

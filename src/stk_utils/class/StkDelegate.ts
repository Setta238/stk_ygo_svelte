interface IStkDelegate<A, R> {
  call: { (args: A): R };
}
interface IStkAsyncDelegate<A, R> {
  call: { (args: A): Promise<R> };
}

export class StkDelegate<A, R> implements IStkDelegate<A, R> {
  private handler?: { (args: A): R } = undefined;

  public set(handler: { (args: A): R }): void {
    this.handler = handler;
  }

  public call(args: A) {
    if (!this.handler) {
      throw Error("illegal state error");
    }
    return this.handler(args);
  }

  public expose(): IStkDelegate<A, R> {
    //追加・除外以外の操作を他クラスからさせないためにキャストする。
    return this;
  }
}

export class StkAsyncDelegate<A, R> implements IStkAsyncDelegate<A, R> {
  private handler?: { (args: A): Promise<R> } = undefined;

  public set(handler: { (args: A): Promise<R> }): void {
    this.handler = handler;
  }

  public async call(args: A) {
    if (!this.handler) {
      throw Error("illegal state error");
    }
    return await this.handler(args);
  }

  public expose(): IStkAsyncDelegate<A, R> {
    //追加・除外以外の操作を他クラスからさせないためにキャストする。
    return this;
  }
}

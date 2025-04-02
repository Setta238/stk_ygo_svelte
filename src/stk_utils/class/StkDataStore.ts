import StkEvent from "@stk_utils/class/StkEvent";
import { StkAsyncDelegate } from "@stk_utils/class/StkDelegate";
import { StkIndexedDB } from "@stk_utils/class/StkIndexedDB";
export interface IStkDataStore {
  name: string;
  open: Promise<void>;
  createVersion: number;
  prepareInitialRecords(): IStkDataRecordTemplate<IStkDataRecord>[];
  resolveMount: { (): void };
}
export type IStkDataRecordSys = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  dbVersion: number;
};
export type IStkDataRecord = {
  name: string;
  description: string;
} & Readonly<IStkDataRecordSys>;
export interface IRecordSetCondition<R extends IStkDataRecord> {
  sortFunc: { (left: R, right: R): number };
  filterFunc: { (task: R): boolean };
}

export type InsertEventArg<R extends IStkDataRecord, SN extends string> = {
  sender: StkDataStore<R, SN>;
  newRecords: readonly Readonly<R>[];
  timestamp: Date;
};

export type BeforeInsertEventArg<R extends IStkDataRecord, SN extends string> = {
  sender: StkDataStore<R, SN>;
  newRecords: readonly Omit<IStkDataRecordTemplate<R>, "id">[];
  timestamp: Date;
};

export type UpdateEventArg<R extends IStkDataRecord, SN extends string> = {
  sender: StkDataStore<R, SN>;
  recordPairs: readonly { newRecord: R; oldRecord: Readonly<R> }[];
  timestamp: Date;
};
export type DeleteEventArg<R extends IStkDataRecord, SN extends string> = {
  sender: StkDataStore<R, SN>;
  oldRecords: readonly R[];
  timestamp: Date;
};

export type IStkDataRecordTemplate<R extends IStkDataRecord> = Omit<R, keyof IStkDataRecordSys>;
export abstract class StkDataStore<R extends IStkDataRecord, SN extends string> {
  private readonly _name: SN;
  public get name(): SN {
    return this._name;
  }
  private readonly _createVersion: number;
  public get createVersion() {
    return this._createVersion;
  }
  private mountResolver = () => {
    return;
  };
  private readonly _indexedDb: StkIndexedDB<SN>;
  private onInsertEvent = new StkEvent<InsertEventArg<R, SN>>();
  private onBeforeInsertEvent = new StkAsyncDelegate<BeforeInsertEventArg<R, SN>, void>();
  private onUpdateEvent = new StkEvent<UpdateEventArg<R, SN>>();
  private onBeforeUpdateEvent = new StkAsyncDelegate<UpdateEventArg<R, SN>, void>();
  private onDeleteEvent = new StkEvent<DeleteEventArg<R, SN>>();
  public get oninsert() {
    return this.onInsertEvent.expose();
  }
  protected get onbeforeinsert() {
    return this.onBeforeInsertEvent.expose();
  }
  public get onupdate() {
    return this.onUpdateEvent.expose();
  }
  protected get onbeforeupdate() {
    return this.onBeforeUpdateEvent.expose();
  }
  public get ondelete() {
    return this.onDeleteEvent.expose();
  }

  constructor(
    indexedDb: StkIndexedDB<SN>,
    name: SN,
    beforeInsert?: { (args: BeforeInsertEventArg<R, SN>): Promise<void> },
    beforeUpdate?: { (args: UpdateEventArg<R, SN>): Promise<void> }
  ) {
    this._indexedDb = indexedDb;
    this._name = name;
    this._createVersion = indexedDb.dbversion;
    this.getAll()
      .then((records) =>
        records.reduce(
          (dic, r) => {
            dic[r.id] = r;
            return dic;
          },
          {} as Record<number, Readonly<R>>
        )
      )
      .then((dic) => {
        console.log(this.name, dic);
        this.onBeforeInsertEvent.set(beforeInsert ?? (() => Promise.resolve()));
        this.onBeforeUpdateEvent.set(beforeUpdate ?? (() => Promise.resolve()));
      });
  }
  abstract _prepareInitialRecords(): IStkDataRecordTemplate<R>[];
  public prepareInitialRecords = () => {
    const timestamp = new Date();
    return this._prepareInitialRecords().map((r) =>
      Object.assign(r, {
        createdAt: timestamp,
        updatedAt: timestamp,
        dbVersion: this._createVersion,
      })
    );
  };
  public resolveMount = () => this.mountResolver();
  public getAll() {
    return this._indexedDb.getAll<Readonly<R>>(this.name);
  }
  public get(id: number) {
    return this._indexedDb.get<Readonly<R>>(this.name, id);
  }
  public async insertMany(records: IStkDataRecordTemplate<R>[]) {
    const timestamp = new Date();
    const readyRecords: Omit<R, "id">[] = records.map((r) => {
      const columns = {
        createdAt: timestamp,
        updatedAt: timestamp,
        dbVersion: this._createVersion,
      } as Omit<IStkDataRecord, "id">;
      return Object.assign(r, columns) as Omit<R, "id">;
    });

    await this.onBeforeInsertEvent.call({
      sender: this,
      newRecords: readyRecords,
      timestamp: timestamp,
    });
    const newRecords = await this._indexedDb.putRecords(this.name, readyRecords);
    this.onInsertEvent.trigger({
      sender: this,
      newRecords: newRecords,
      timestamp: timestamp,
    });
    return newRecords;
  }
  public async insert(record: IStkDataRecordTemplate<R>) {
    return (await this.insertMany([record]))[0];
  }
  public async updateMany(ids: readonly number[], updater: (r: Readonly<R>) => R) {
    const timestamp = new Date();
    const recordPairs: { newRecord: R; oldRecord: R }[] = [];
    const records = await this._indexedDb.getMany<R>(this.name, ids);
    records.forEach((r) => {
      const oldR = { ...r };
      const newR = { ...oldR };
      recordPairs.push({
        newRecord: Object.assign(updater(newR), {
          updatedAt: timestamp,
          dbVersion: this._createVersion,
        }),
        oldRecord: oldR,
      });
    });
    await this.onBeforeUpdateEvent.call({
      sender: this,
      recordPairs: recordPairs,
      timestamp: timestamp,
    });
    await this._indexedDb.putRecords(
      this.name,
      recordPairs.map((p) => p.newRecord)
    );
    this.onUpdateEvent.trigger({
      sender: this,
      recordPairs: recordPairs,
      timestamp: timestamp,
    });

    return recordPairs.map((pair) => pair.newRecord);
  }
  public async update(id: number, updater: (r: Readonly<R>) => R) {
    return (await this.updateMany([id], updater))[0];
  }
  public async delete(ids: readonly number[]) {
    const timestamp = new Date();
    const deletedRecords = await this._indexedDb.getMany<R>(this.name, ids);
    await this._indexedDb.deleteRecords(this.name, ids);
    this.onDeleteEvent.trigger({
      sender: this,
      oldRecords: deletedRecords,
      timestamp: timestamp,
    });
  }

  private patchForInsert = (event: InsertEventArg<R, SN>, dictionary: Record<number, R>) => {
    event.newRecords.forEach((r) => {
      dictionary[r.id] = r;
    });
  };
  private patchForUpdate = (event: UpdateEventArg<R, SN>, dictionary: Record<number, R>) => {
    event.recordPairs.forEach((pair) => {
      //Note:古いオブジェクトがそのままくる場合、別オブジェクトに作り直さないとreactiveが反応しない
      dictionary[pair.newRecord.id] = { ...pair.newRecord };
    });
  };
  private patchForDelete = (event: DeleteEventArg<R, SN>, dictionary: Record<number, R>) => {
    event.oldRecords.forEach((r) => {
      delete dictionary[r.id];
    });
  };
}

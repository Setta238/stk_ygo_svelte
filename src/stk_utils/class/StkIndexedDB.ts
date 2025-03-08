export class StkIndexedDB<SN extends string> {
  private readonly _dbname: string;
  private readonly _dbversion: number;
  private readonly dbPromise: Promise<IDBDatabase>;

  public get dbversion() {
    return this._dbversion;
  }

  // todo : エラーをハンドリングするメソッドを引数に追加。
  public constructor(dbname: string, dbversion: number, tblNames: Readonly<SN[]>) {
    this._dbname = dbname;
    this._dbversion = dbversion;
    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const openReq = indexedDB.open(dbname, dbversion);
      openReq.onsuccess = (event) => {
        console.log(event);
        if (!event.target) {
          console.log("event.target is undefined");
          reject("event.target is undefined");
          return;
        }
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db) {
          console.log("event.target.result is undefined");
          reject("event.target.result is undefined");
          return;
        }
        db.onversionchange = (ev) => {
          console.log(ev);
          db.close();
        };
        resolve(db);
        return;
      };

      openReq.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        console.log("onupgradeneeded");
        //onupgradeneededは、DBのバージョン更新(DBの新規作成も含む)時のみ実行
        const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
        tblNames
          .filter((tblName) => !db.objectStoreNames.contains(tblName))
          .map((tblName) => {
            return db.createObjectStore(tblName, {
              keyPath: "id", //固定
              autoIncrement: true,
            });
          });
      };
      openReq.onerror = (e) => {
        console.log(e);
        reject(e);
      };
      openReq.onblocked = (e) => {
        console.log(e);
        reject(e);
      };
    });
    console.log(this.dbPromise);
  }
  public getTran = async (storeName: SN | Iterable<SN>, mode?: IDBTransactionMode) => {
    const db = await this.dbPromise;
    return db.transaction(storeName, mode);
  };
  public reset = async () => {
    await indexedDB.databases().then((infos) => {
      console.log(infos);
    });

    return await new Promise<void>((resolve, reject) => {
      const openReq = indexedDB.deleteDatabase(this._dbname);
      openReq.onsuccess = () => {
        console.log("onsuccess");
        resolve();
      };
      openReq.onerror = (event: Event) => {
        console.log("onerror");
        reject(event);
      };
    });
  };

  // public upgrade = (settings: DbSetting[]) => {
  //   // DB名を指定して接続。DBがなければ新規作成される。
  //   const openReq = indexedDB.open(this._dbname, this._dbversion);
  //   const requests = [] as IDBRequest<IDBValidKey>[];
  //   console.log(openReq);
  //   return new Promise((resolve, reject) => {
  //     openReq.onupgradeneeded = (event: IDBVersionChangeEvent) => {
  //       console.log("onupgradeneeded");
  //       //onupgradeneededは、DBのバージョン更新(DBの新規作成も含む)時のみ実行
  //       const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
  //       console.log(db);
  //       const tmp = settings
  //         .filter((s) => s.dataStore.createVersion > (event.oldVersion ?? 0))
  //         .filter((s) => !db.objectStoreNames.contains(s.dataStore.name))
  //         .flatMap((s) => {
  //           const store = db.createObjectStore(s.dataStore.name, {
  //             keyPath: s.keyPath,
  //             autoIncrement: true,
  //           });
  //           return s.dataStore.prepareInitialRecords().map((r) => store.put(r));
  //         });
  //       requests.push(...tmp);
  //     };
  //     openReq.onsuccess = () => {
  //       console.log("onsuccess");
  //       Promise.all(requests)
  //         .then(() => settings.forEach((s) => s.dataStore.resolveMount()))
  //         .then(resolve)
  //         .catch(reject);
  //     };
  //     openReq.onerror = (event: Event) => {
  //       console.log("onerror");
  //       reject(event);
  //     };
  //   });
  // };

  getAll = async <R>(storeName: SN) => {
    const db = await this.dbPromise;
    return new Promise<R[]>((resolve, reject) => {
      const tran = db.transaction([storeName], "readonly");
      const store = tran.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  };

  get = async <R>(storeName: SN, key: string | number) => {
    const db = await this.dbPromise;
    return new Promise<R>((resolve, reject) => {
      const tran = db.transaction([storeName], "readonly");
      const store = tran.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (e) => {
        reject(e);
      };
    });
  };

  getMany = async <R>(storeName: SN, keys: readonly string[] | readonly number[]) => {
    const db = await this.dbPromise;
    const tran = db.transaction([storeName], "readonly");
    const store = tran.objectStore(storeName);
    const result = keys.map(
      (key) =>
        new Promise<R>((resoleve, reject) => {
          const request = store.get(key);
          request.onsuccess = () => {
            resoleve(request.result);
          };
          request.onerror = (e) => {
            reject(e);
          };
        })
    );
    return await Promise.all(result);
  };
  putRecords = async <R>(storeName: SN, records: Omit<R, "id">[]) => {
    const db = await this.dbPromise;
    const tran = db.transaction([storeName], "readwrite");
    const store = tran.objectStore(storeName);
    const pairs = records.map((r) => {
      return { record: r, request: store.put(r) };
    });
    return new Promise<R[]>((resolve, reject) => {
      tran.oncomplete = () => resolve(pairs.map((pair) => Object.assign({ id: pair.request.result }, pair.record) as R));
      tran.onerror = (e) => reject(e);
    });
  };
  deleteRecords = async (storeName: SN, keys: readonly string[] | readonly number[]) => {
    const db = await this.dbPromise;
    const tran = db.transaction([storeName], "readwrite");
    const store = tran.objectStore(storeName);
    const pairs = keys.map((key) => {
      return { key: key, request: store.delete(key) };
    });
    return new Promise<void>((resolve, reject) => {
      tran.oncomplete = () => {
        //何を返すのか気になるので
        console.log(pairs.map((pair) => pair.request.result));
        resolve();
      };
      tran.onerror = (e) => reject(e);
    });
  };
}

export {};

// 拡張メソッドの定義
declare global {
  interface Array<T> {
    randomPick(): T;
    randomPickMany(num: number): T[];
    shuffle(): T[];
    reset(...newArray: T[]): void;
    union(another: Readonly<T[]>): T[];
    getAllOnOffPattern(): T[][];
    getDistinct(): T[];
    distinct(): void;
  }
}

// 拡張メソッドの実装側
Array.prototype.shuffle = function <T>(): T[] {
  const items = this as T[];
  return items
    .map((item) => {
      return { item, seq: Math.random() };
    })
    .toSorted((left, right) => left.seq - right.seq)
    .map((item) => item.item);
};
Array.prototype.randomPickMany = function <T>(num: number): T[] {
  return (this as T[]).shuffle().slice(0, num);
};
Array.prototype.randomPick = function <T>(): T {
  return (this as T[]).shuffle().slice(0, 1)[0];
};

Array.prototype.reset = function <T>(...newArray: T[]): void {
  (this as T[]).splice(0);
  (this as T[]).push(...newArray);
};
Array.prototype.union = function <T>(another: T[]): T[] {
  return (this as T[]).filter((t) => another.find((a) => t === a));
};

Array.prototype.getAllOnOffPattern = function <T>(): T[][] {
  const result: T[][] = [];
  (this as T[]).forEach((item) => {
    if (result.length == 0) {
      result.push([item]);
      result.push([]);
      return;
    }

    result.forEach((pattern) => result.push([...pattern, item]));
  });
  return result;
};
// Array.prototype.getAllOnOffPattern = function* <T>(qty?: number, shuffle?: boolean): Generator<T[]> {
//   const source: T[] = shuffle ? (this as T[]).shuffle() : (this as T[]);
//   const tmp: T[][] = [[]];
//   for (const item of source) {
//     for (const pattern of tmp) {
//       if (qty) {
//         if (pattern.length === qty - 1) {
//           yield [...pattern, item];
//           continue;
//         }
//       }
//       tmp.push([...pattern, item]);
//     }
//   }

//   for (const pattern of tmp) {
//     yield pattern;
//   }
// };
Array.prototype.getDistinct = function <T>(): T[] {
  return Array.from(new Set(this as T[]));
};

Array.prototype.distinct = function (): void {
  this.reset(...this.getDistinct());
};

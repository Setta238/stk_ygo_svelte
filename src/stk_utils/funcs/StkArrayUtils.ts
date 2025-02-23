export {};

// 拡張メソッドの定義
declare global {
  interface Array<T> {
    randomPick(num: number): T[];
    shuffle(): T[];
    reset(...newArray: T[]): void;
    union(another: T[]): T[];
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
Array.prototype.randomPick = function <T>(num: number): T[] {
  return (this as T[]).shuffle().slice(0, num);
};

Array.prototype.reset = function <T>(...newArray: T[]): void {
  (this as T[]).splice(0);
  (this as T[]).push(...newArray);
};
Array.prototype.union = function <T>(another: T[]): T[] {
  return (this as T[]).filter(another.includes, another);
};

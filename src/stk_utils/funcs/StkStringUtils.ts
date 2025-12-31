export {};

// 拡張メソッドの定義
declare global {
  interface String {
    format(...args: unknown[]): string;
    toSnakeCase(): string;
    toNarrow(): string;
    toWide(): string;
  }
}
export const isString = (arg: unknown): arg is string => {
  return typeof arg === "string";
};
export const format = (str: string, ...args: unknown[]): string => {
  for (const [i, arg] of args.entries()) {
    const regExp = new RegExp(`\\{${i}\\}`, "g");
    str = str.replace(regExp, arg as string);
  }
  return str;
};

String.prototype.format = function (...args: unknown[]): string {
  let str = this as string;

  for (const [i, arg] of args.entries()) {
    const regExp = new RegExp(`\\{${i}\\}`, "g");
    str = str.replace(regExp, arg as string);
  }
  return str;
};

String.prototype.toSnakeCase = function (): string {
  return this.split(/(?=[A-Z])/)
    .join("_")
    .toLowerCase();
};
String.prototype.toNarrow = function () {
  return this.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
};

String.prototype.toWide = function () {
  return this.replace(/[A-Za-z0-9]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
  });
};

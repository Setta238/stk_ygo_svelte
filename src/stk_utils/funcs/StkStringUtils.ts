export {};

// 拡張メソッドの定義
declare global {
  interface String {
    format(str: string, ...args: unknown[]): string;
  }
}
export const isString = (arg: unknown): arg is string => {
  return typeof arg === "string";
};
export const format = (str: string, ...args: unknown[]): string => {
  for (const [i, arg] of args.entries()) {
    const regExp = new RegExp(`\\{${i}\\}`, 'g')
    str = str.replace(regExp, arg as string)
  }
  return str
}

String.prototype.format = (str: string, ...args: unknown[]): string => {
  for (const [i, arg] of args.entries()) {
    const regExp = new RegExp(`\\{${i}\\}`, 'g')
    str = str.replace(regExp, arg as string)
  }
  return str
}
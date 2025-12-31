export const isObject = (x: unknown): x is object => x !== null && (typeof x === "object" || typeof x === "function");
export const getKeys = <T extends { [key: string]: unknown }>(obj: T): (keyof T)[] => {
  return Object.keys(obj);
};
export const reverseLookup = <K extends string | number | symbol, V>(obj: { [key in K]: V }, v: V): K | undefined =>
  Object.entries(obj)
    .filter(([, _v]) => _v === v)
    .map(([k]) => k as K)
    .find(() => true);

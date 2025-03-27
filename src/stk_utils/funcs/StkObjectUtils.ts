export const isObject = (x: unknown): x is object => x !== null && (typeof x === "object" || typeof x === "function");
export const getKeys = <T extends { [key: string]: unknown }>(obj: T): (keyof T)[] => {
  return Object.keys(obj);
};

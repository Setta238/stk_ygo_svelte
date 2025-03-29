export const isNumber = (text?: string) => {
  if (!text) {
    return false;
  }
  return !isNaN(Number(text));
};
export const max = (...array: number[]) => {
  return array.length ? array.reduce((wip, item) => (wip > item ? wip : item)) : -Number.MAX_VALUE;
};

export const min = (...array: number[]) => {
  return array.length ? array.reduce((wip, item) => (wip < item ? wip : item)) : Number.MAX_VALUE;
};

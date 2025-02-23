export const isNumber = (text?: string) => {
  if (!text) {
    return false;
  }
  return !isNaN(Number(text));
};

export const ezJsonStringify = (
  item: unknown,
  replacer: ((key: string, value: unknown) => unknown) | undefined,
  space: string | number | undefined = undefined,
  dummy: string = "!!!circular reference!!!"
) => {
  // 循環参照検知用
  let objects: object[] = [];
  return JSON.stringify(
    item,
    (key, value) => {
      if (typeof value === "object") {
        if (objects.indexOf(value) > -1) {
          return dummy;
        }
        objects.push(value);
      }

      let _value = value;

      if (replacer) {
        _value = replacer(key, value);
      }

      if (typeof _value === "function") {
        return _value.toString();
      } else if (_value !== value && typeof _value === "object") {
        if (objects.indexOf(_value) > -1) {
          return dummy;
        }
        objects.push(_value);
      }
      return _value;
    },
    space
  );
};

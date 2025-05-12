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

export const getIndex = (array: number[], target: number): number => {
  // 先頭チェック
  if ((array[0] ?? Number.MAX_VALUE) > target) {
    return 0;
  }
  // 末尾チェック
  if (array.slice(-1)[0] < target) {
    return array.length;
  }

  // 二分値探索
  let lowerBound = 0;
  let upperBound = array.length - 1;

  while (true) {
    const tmpIndex = Math.round((lowerBound + upperBound) / 2);
    if (tmpIndex === upperBound || tmpIndex === lowerBound) {
      return array[lowerBound] < target ? upperBound : lowerBound;
    }
    const tmpValue = array[tmpIndex];
    if (tmpValue < target) {
      lowerBound = tmpIndex;
      continue;
    }
    upperBound = tmpIndex;
    continue;
  }
};

const testArray = [
  3, 5, 5, 6, 6, 6, 7, 8, 9, 10, 11, 11, 11, 12, 12, 13, 13, 14, 15, 15, 15, 15, 15, 15, 16, 16, 16, 17, 18, 18, 18, 21, 21, 21, 22, 23, 25, 25, 26, 28, 28, 28,
  30, 30, 31, 32, 32, 33, 33, 34, 35, 35, 36, 36, 36, 37, 37, 38, 38, 38, 39, 41, 42, 42, 43, 45, 45, 45, 45, 48, 48, 48, 50, 51, 52, 54, 54, 54, 54, 56, 57,
  58, 59, 59, 59, 59, 60, 61, 63, 65, 65, 65, 65, 66, 67, 67, 67, 69, 69, 71, 71, 72, 73, 73, 73, 73, 73, 74, 75, 75, 76, 76, 77, 78, 79, 80, 80, 80, 80, 84,
  84, 84, 84, 84, 84, 85, 85, 85, 87, 90, 91, 94, 96, 96, 97, 98, 101, 101, 101, 101, 101,
];

testArray.forEach((value, index) => {
  if ((testArray[getIndex(testArray, index) - 1] || -Number.MAX_VALUE) >= index || (testArray[getIndex(testArray, index)] || Number.MAX_VALUE) < index) {
    console.log(
      index,
      getIndex(testArray, index),
      (testArray[getIndex(testArray, index) - 1] || -Number.MAX_VALUE) < index,
      (testArray[getIndex(testArray, index)] || Number.MAX_VALUE) >= index
    );
  }
});

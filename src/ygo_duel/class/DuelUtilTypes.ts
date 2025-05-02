export type ChoicesSweet<T> = Readonly<{
  selectables: T[];
  qty?: number;
  validator: (selected: T[]) => boolean;
  cancelable: boolean;
}>;

export const randomChoice = <T>(choice: ChoicesSweet<T>) => {
  let selected: T[] = [];

  do {
    const _qty = choice.qty && choice.qty > 0 ? choice.qty : Math.floor(Math.random() * choice.selectables.length + 1);
    selected = choice.selectables.randomPickMany(_qty);
  } while (!choice.validator(selected));
  return selected;
};

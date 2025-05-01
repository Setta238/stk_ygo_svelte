export type ChoicesSweet<T> = {
  choices: T[];
  qty?: number;
  validator: (selected: T[]) => boolean;
  cancelable: boolean;
};

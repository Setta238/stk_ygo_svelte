export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

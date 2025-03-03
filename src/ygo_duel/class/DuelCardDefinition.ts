import type { CardActionBase, DuelEntity } from "./DuelEntity";

export type DuelCardDefinition<T> = { name: string; actions: CardActionBase<T>[]; canSummonBy: (entity: DuelEntity) => boolean };

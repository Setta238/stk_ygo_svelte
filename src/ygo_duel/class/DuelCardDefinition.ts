import type { CardActionBase } from "./DuelCardAction";
import type { DuelEntity } from "./DuelEntity";

export type DuelCardDefinition<T> = { name: string; actions: CardActionBase<T>[]; canSummonBy: (entity: DuelEntity) => boolean };

import type { CardActionDefinition } from "./DuelCardAction";
import type { DuelEntity } from "./DuelEntity";

export type DuelCardDefinition<T> = { name: string; actions: CardActionDefinition<T>[]; canSummonBy: (entity: DuelEntity) => boolean };

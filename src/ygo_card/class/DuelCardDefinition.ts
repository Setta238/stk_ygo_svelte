import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import type { SummonFilter } from "@ygo_duel/class_continuous_effect/DuelSummonFilter";
import type { CardActionDefinition, CardActionDefinitionAttr, ChainBlockInfo, SummonMaterialInfo } from "@ygo_duel/class/DuelCardAction";
import type { DuelEntity, TDuelCauseReason, EntityStatus } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type { Duelist } from "@ygo_duel/class/Duelist";
import type { SubstituteEffectDefinition } from "@ygo_duel/class/DuelSubstituteEffect";

export type CardDefinition = {
  name: string;
  actions: CardActionDefinition<unknown>[];
  continuousEffects?: ContinuousEffectBase<unknown>[];
  defaultSummonFilter?: (
    filter: SummonFilter,
    filterTarget: DuelEntity,
    effectOwner: Duelist,
    summoner: Duelist,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
    monster: DuelEntity,
    materialInfos: SummonMaterialInfo[],
    posList: Readonly<TBattlePosition[]>,
    cells: DuelFieldCell[],
    ignoreSummoningConditions: boolean
  ) => {
    posList: Readonly<TBattlePosition[]>;
    cells: DuelFieldCell[];
  };
  substituteEffects?: SubstituteEffectDefinition[];
  defaultStatus?: Partial<EntityStatus>;
  onUsedAsMaterial?: (chainBlockInfo: ChainBlockInfo<unknown>, monster: DuelEntity) => void;
};

export function* generateAllCardDefinitions(): Generator<CardDefinition> {
  const modules: Record<string, { default?: () => Generator<CardDefinition> }> = {
    ...import.meta.glob("@ygo_card/card_definitions/*.ts", { eager: true }),
    ...import.meta.glob("@ygo_card/card_definitions/*/*.ts", { eager: true }),
  };
  for (const component of Object.keys(modules)) {
    if (modules[component].default) {
      yield* modules[component].default();
    }
  }
}
export function* generateCardDefinitions(...names: string[]): Generator<CardDefinition> {
  const modules: Record<string, { default?: () => Generator<CardDefinition> }> = {
    ...import.meta.glob("@ygo_card/card_definitions/*.ts", { eager: true }),
    ...import.meta.glob("@ygo_card/card_definitions/*/*.ts", { eager: true }),
  };
  for (const module of Object.values(modules)) {
    if (module.default) {
      for (const definition of module.default()) {
        if (names.includes(definition.name)) {
          yield definition;
        }
      }
    }
  }
}

import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import type { SummonFilter } from "@ygo_duel/class_continuous_effect/DuelSummonFilter";
import type { CardActionDefinition, CardActionDefinitionAttr, ChainBlockInfo, SummonMaterialInfo } from "./DuelCardAction";
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

try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modules: Record<string, any> = import.meta.glob("@ygo_duel/cards/*.ts", { eager: true });

  Object.keys(modules).forEach((component) => {
    if (modules[component].default) {
      console.log(component, ...modules[component].default());
    }
  });
} catch (error) {
  console.log("(´・ω・｀)");
  console.error(error);
}

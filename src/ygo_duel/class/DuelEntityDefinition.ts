import { summonMonsterCategories, type EntityStatusBase, type TBattlePosition } from "@ygo/class/YgoTypes";
import type { ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import type { SummonFilter } from "@ygo_duel/class_continuous_effect/DuelSummonFilter";
import type { CardActionDefinition as EntityActionDefinition, CardActionDefinitionAttr, ChainBlockInfo, SummonMaterialInfo } from "./DuelEntityAction";
import type { DuelEntity, TDuelCauseReason, EntityStatus } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type { Duelist } from "@ygo_duel/class/Duelist";
import type { SubstituteEffectDefinition } from "@ygo_duel/class/DuelSubstituteEffect";
import { cardInfoDic } from "@ygo/class/CardInfo";
import { defaultNormalMonsterActions, defaultSummonFilter } from "../../ygo_entity_proc/card_actions/CommonCardAction_Monster";
import { SystemError } from "./Duel";
import { createDuelistProcDefinition } from "@ygo_entity_proc/duelist_proc_definitions/DuelistProcDefinitions";

export type EntityProcDefinition = {
  name: string;
  actions: EntityActionDefinition<unknown>[];
  continuousEffects?: ContinuousEffectBase<unknown>[];
  summonFilter?: (
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

export type EntityDefinition = EntityProcDefinition & {
  staticInfo: EntityStatusBase;
};

export function* generateAllProcCardDefinitions(): Generator<EntityProcDefinition> {
  const modules: Record<string, { default?: () => Generator<EntityProcDefinition> }> = {
    ...import.meta.glob("@ygo_entity_proc/card_proc_definitions/*.ts", { eager: true }),
    ...import.meta.glob("@ygo_entity_proc/card_proc_definitions/*/*.ts", { eager: true }),
  };
  for (const component of Object.keys(modules)) {
    if (modules[component].default) {
      yield* modules[component].default();
    }
  }
}
export function* generateCardDefinitions(...names: string[]): Generator<EntityDefinition> {
  const modules: Record<string, { default?: () => Generator<EntityProcDefinition> }> = {
    ...import.meta.glob("@ygo_entity_proc/card_proc_definitions/*.ts", { eager: true }),
    ...import.meta.glob("@ygo_entity_proc/card_proc_definitions/*/*.ts", { eager: true }),
  };

  const _names: string[] = [];

  // 処理定義を列挙して、必要なものを順番に返す
  for (const module of Object.values(modules)) {
    if (module.default) {
      for (const definition of module.default()) {
        if (names.includes(definition.name)) {
          const staticInfo = cardInfoDic[definition.name];
          let summonFilter = definition.summonFilter;
          if (staticInfo.kind === "Monster" && staticInfo.monsterCategories && !definition.summonFilter) {
            if (staticInfo.monsterCategories.union(summonMonsterCategories).length) {
              summonFilter = defaultSummonFilter;
            }
          }
          yield { ...definition, summonFilter, staticInfo };
          _names.push(definition.name);
        }
      }
    }
  }

  // 残ったもののうち、ペンデュラムモンスター以外の通常モンスターを返す
  yield* names
    .filter((name) => !_names.includes(name))
    .map((name) => cardInfoDic[name])
    .filter((info) => info)
    .filter((info) => info.kind === "Monster")
    .filter((info) => info.monsterCategories?.includes("Normal"))
    .filter((info) => !info.monsterCategories?.includes("Pendulum"))
    .map((info) => {
      _names.push(info.name);
      return {
        name: info.name,
        actions: defaultNormalMonsterActions,
        staticInfo: info,
      };
    });
  if (_names.length !== names.length) {
    console.log(names.filter((name) => !_names.includes(name)));
    throw new SystemError(
      "カード定義が取得できなかった",
      names.filter((name) => !_names.includes(name))
    );
  }
}

export const createDuelistEntityDefinition = (duelist: Duelist): EntityDefinition => {
  return {
    ...createDuelistProcDefinition(duelist),
    staticInfo: { name: duelist.profile.name, kind: "Monster", wikiEncodedName: "%A5%D7%A5%EC%A5%A4%A5%E4%A1%BC" },
  };
};

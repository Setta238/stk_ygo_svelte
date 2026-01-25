import { summonMonsterCategories, type CardInfo, type TBattlePosition } from "@ygo/class/YgoTypes";
import type { ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import type { SummonFilter } from "@ygo_duel/class_continuous_effect/DuelSummonFilter";
import type { CardActionDefinition as EntityActionDefinition, CardActionDefinitionAttrs, ChainBlockInfo, SummonMaterialInfo } from "./DuelEntityAction";
import type { DuelEntity, TDuelCauseReason, EntityStatus } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type { Duelist } from "@ygo_duel/class/Duelist";
import type { SubstituteEffectDefinition } from "@ygo_duel/class/DuelSubstituteEffect";
import { cardDefinitionsPrms } from "@ygo/class/CardInfo";
import {
  defaultNormalMonsterActions,
  defaultActions,
  defaultSummonFilter,
  defaultLinkMonsterActions,
} from "../../ygo_entity_proc/card_actions/CardActions_Monster";
import { createDuelistProcDefinition } from "@ygo_entity_proc/duelist_proc_definitions/DuelistProcDefinitions";
import type { ImmediatelyActionDefinition } from "./DuelEntityImmediatelyAction";

export type NameTypeFusionMaterialInfo = {
  type: "Name";
  cardName: string;
};
export type FileterTypeFusionMaterialInfo = {
  type: "Filter";
  filter: (entity: DuelEntity) => boolean;
};
export type OvermuchTypeFusionMaterialInfo = {
  type: "Overmuch";
  filter: (entity: DuelEntity) => boolean;
};

export type FusionMaterialInfo = NameTypeFusionMaterialInfo | FileterTypeFusionMaterialInfo | OvermuchTypeFusionMaterialInfo;

export const isNameTypeFusionMaterialInfo = (info: FusionMaterialInfo): info is NameTypeFusionMaterialInfo => info.type === "Name";
export const isFilterTypeFusionMaterialInfo = (info: FusionMaterialInfo): info is FileterTypeFusionMaterialInfo => info.type === "Filter";
export const isOvermuchTypeFusionMaterialInfo = (info: FusionMaterialInfo): info is OvermuchTypeFusionMaterialInfo => info.type === "Overmuch";

export type EntityProcDefinition = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: Readonly<EntityActionDefinition<any>[]>;
  immediatelyActions?: Readonly<ImmediatelyActionDefinition[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  continuousEffects?: ContinuousEffectBase<any>[];
  summonFilter?: (
    filter: SummonFilter,
    filterTarget: DuelEntity,
    effectOwner: Duelist,
    summoner: Duelist,
    movedAs: TDuelCauseReason[],
    actDefAttr: CardActionDefinitionAttrs & { entity: DuelEntity },
    monster: DuelEntity,
    materialInfos: SummonMaterialInfo[],
    posList: Readonly<TBattlePosition[]>,
    cells: DuelFieldCell[],
    ignoreSummoningConditions: boolean,
  ) => {
    posList: Readonly<TBattlePosition[]>;
    cells: DuelFieldCell[];
  };
  substituteEffects?: SubstituteEffectDefinition[];
  defaultStatus?: Partial<EntityStatus>;
  onUsedAsMaterial?: (me: DuelEntity, chainBlockInfo: ChainBlockInfo<unknown>, monster: DuelEntity) => void;
  fusionMaterialInfos?: FusionMaterialInfo[];
  validateFusionMaterials?: (entites: DuelEntity[]) => boolean;
};

export type EntityDefinition = EntityProcDefinition & {
  staticInfo: CardInfo;
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
export async function* generateCardDefinitions(...names: string[]): AsyncGenerator<EntityDefinition> {
  const modules: Record<string, { default?: () => Generator<EntityProcDefinition> }> = {
    ...import.meta.glob("@ygo_entity_proc/card_proc_definitions/*.ts", { eager: true }),
    ...import.meta.glob("@ygo_entity_proc/card_proc_definitions/*/*.ts", { eager: true }),
  };

  const _names: string[] = [];

  const cardDefinitions = await cardDefinitionsPrms;

  // 処理定義を列挙して、必要なものを順番に返す
  for (const module of Object.values(modules)) {
    if (module.default) {
      for (const definition of module.default()) {
        if (names.includes(definition.name)) {
          const cardInfo = cardDefinitions.getCardInfo(definition.name);
          if (cardInfo) {
            const staticInfo = { ...cardInfo };
            let summonFilter = definition.summonFilter;
            if (staticInfo.kind === "Monster" && staticInfo.monsterCategories && !definition.summonFilter) {
              if (staticInfo.monsterCategories.union(summonMonsterCategories).length) {
                summonFilter = defaultSummonFilter;
              }
            }
            if (definition.fusionMaterialInfos && definition.fusionMaterialInfos.some((info) => info.type === "Name")) {
              staticInfo.textTags = [
                ...(staticInfo.textTags ?? []),
                ...definition.fusionMaterialInfos.filter(isNameTypeFusionMaterialInfo).map((info) => info.cardName),
              ];
            }
            const _definition = { ...definition, summonFilter, staticInfo };
            if (staticInfo.monsterCategories?.includes("Link")) {
              _definition.actions = [...defaultLinkMonsterActions, ..._definition.actions];
            } else if (staticInfo.monsterCategories?.includes("SpecialSummon")) {
              _definition.actions = [...defaultActions, ..._definition.actions];
            } else {
              _definition.actions = [...defaultNormalMonsterActions, ...definition.actions];
            }

            _definition.actions
              .filter(
                (action) => action.fixedTags && action.fixedTags.some((tag) => tag.startsWith("SpecialSummon")) && !action.fixedTags.includes("SpecialSummon"),
              )
              .forEach((action) => action.fixedTags?.push("SpecialSummon"));
            yield _definition;
            _names.push(definition.name);
          }
        }
      }
    }
  }

  // 残ったもののうち、ペンデュラムモンスターと効果モンスター以外のモンスターを返す
  yield* names
    .filter((name) => !_names.includes(name))
    .map((name) => cardDefinitions.getCardInfo(name))
    .filter((info) => info !== undefined)
    .filter((info) => info.kind === "Monster")
    .filter((info) => !info.monsterCategories?.includes("Effect"))
    .filter((info) => !info.monsterCategories?.includes("Pendulum"))
    .map((info) => {
      _names.push(info.name);

      return {
        name: info.name,
        actions: info.monsterCategories?.includes("SpecialSummon") ? defaultActions : defaultNormalMonsterActions,
        staticInfo: info,
      };
    });
  if (_names.length !== names.length) {
    console.log(names.filter((name) => !_names.includes(name)));
  }
}

export const createDuelistEntityDefinition = (duelist: Duelist): EntityDefinition => {
  return {
    ...createDuelistProcDefinition(duelist),
    staticInfo: { name: duelist.profile.name, kind: "Monster", wikiEncodedName: "%A5%D7%A5%EC%A5%A4%A5%E4%A1%BC" },
  };
};

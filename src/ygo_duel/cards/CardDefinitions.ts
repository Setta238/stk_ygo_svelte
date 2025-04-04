import type { CardAction, CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { createCardDefinitions_Monster } from "./CardDefinitions_Monster";
import { createCardDefinitions_NormalSpell } from "./CardDefinitions_NormalSpell";
import { createCardDefinitions_Monster_Preset_Recruiter } from "./CardDefinitions_Monster_Preset_Recruiter";
import { createCardDefinitions_NormalSpell_Preset } from "./CardDefinitions_NormalSpell_Preset";
import { createCardDefinitions_SyncroMonster } from "./CardDefinitions_SyncroMonster";
import type { ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { SystemError } from "@ygo_duel/class/Duel";
import { createCardDefinitions_FieldSpell_Preset } from "./CardDefinitions_FieldSpell_Preset";
import { createCardDefinitions_ContinuousSpell_Preset } from "./CardDefinitions_ContinuousSpell";
import { createCardDefinitions_EquipSpell } from "./CardDefinitions_EquipSpell";
import { createCardDefinitions_EquipSpell_Preset } from "./CardDefinitions_EquipSpell_Preset";
import { createCardDefinitions_TestMonster } from "./CardDefinitions_TestMonster";
import { createCardDefinitions_QuickPlaySpell } from "./CardDefinitions_QuickPlaySpell";
import { createCardDefinitions_SpellCounter_Monster } from "./CardDefinitions_SpellCounter_Monster";
import { createCardDefinitions_NormalTrap_UponAttackDeclaration } from "./CardDefinitions_NormalTrap_UponAttackDeclaration";
import { createCardDefinitions_NormalTrap } from "./CardDefinitions_NormalTrap";
import { createCardDefinitions_NormalSpell_General_Draw } from "./CardDefinitions_NormalSpell_General_Draw";
import { createCardDefinitions_XyzMonster } from "./CardDefinitions_XyzMonster";
import { createCardDefinitions_Blackwing_Monster } from "./CardDefinitions_Blackwing_Monster";
import type { Duelist } from "@ygo_duel/class/Duelist";
import type { DuelEntity, TMaterialCauseReason, TSummonRuleCauseReason } from "@ygo_duel/class/DuelEntity";
import type { TBattlePosition } from "@ygo/class/YgoTypes";

export type MaterialInfo = {
  material: DuelEntity;
  level?: number;
  link?: number;
  isAsTuner?: boolean;
  name?: string;
};
export type CardDefinition = {
  name: string;
  actions: CardActionBase<unknown>[];
  continuousEffects?: ContinuousEffectBase<unknown>[];
  canBeSummoned?: <T>(
    activator: Duelist,
    monster: DuelEntity,
    action: CardAction<T>,
    summonType: TSummonRuleCauseReason,
    pos: TBattlePosition,
    materialInfos: MaterialInfo[],
    ignoreSummoningConditions: boolean
  ) => boolean;
  canBeMaterial?: <T>(
    activator: Duelist,
    monster: DuelEntity,
    action: CardAction<T>,
    materialType: TMaterialCauseReason,
    pos: TBattlePosition,
    materialInfos: MaterialInfo[],
    ignoreSummoningConditions: boolean
  ) => boolean;
};

export const createCardDefinitions = (): CardDefinition[] => {
  const hoge = [
    ...createCardDefinitions_Monster(),
    ...createCardDefinitions_Monster_Preset_Recruiter(),
    ...createCardDefinitions_SyncroMonster(),
    ...createCardDefinitions_NormalSpell(),
    ...createCardDefinitions_NormalSpell_Preset(),
    ...createCardDefinitions_QuickPlaySpell(),
    ...createCardDefinitions_FieldSpell_Preset(),
    ...createCardDefinitions_ContinuousSpell_Preset(),
    ...createCardDefinitions_EquipSpell(),
    ...createCardDefinitions_EquipSpell_Preset(),
    ...createCardDefinitions_TestMonster(),
    ...createCardDefinitions_SpellCounter_Monster(),
    ...createCardDefinitions_Blackwing_Monster(),
    ...createCardDefinitions_NormalTrap(),
    ...createCardDefinitions_NormalTrap_UponAttackDeclaration(),
    ...createCardDefinitions_NormalSpell_General_Draw(),
    ...createCardDefinitions_XyzMonster(),
  ];
  const names = hoge.map((def) => def.name);
  console.info(names);

  const fuga = Object.values(Object.groupBy(names, (name) => name))
    .filter((grouped) => (grouped?.length ?? 2) > 1)
    .map((grouped) => grouped?.[0]);

  if (fuga.length > 0) {
    throw new SystemError("カード定義重複", ...fuga);
  }
  return hoge;
};

import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import type { SummonFilter } from "@ygo_duel/class_continuous_effect/DuelSummonFilter";
import type { CardActionDefinition, CardActionDefinitionAttr, ChainBlockInfo, SummonMaterialInfo } from "@ygo_duel/class/DuelCardAction";
import type { DuelEntity, TDuelCauseReason, EntityStatus } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type { Duelist } from "@ygo_duel/class/Duelist";
import type { SubstituteEffectDefinition } from "@ygo_duel/class/DuelSubstituteEffect";
import { createCardDefinitions_Monster } from "@ygo_card/card_definitions/CardDefinitions_Monster";
import { createCardDefinitions_ContinuousSpell_Preset } from "@ygo_card/card_definitions/CardDefinitions_ContinuousSpell";
import { createCardDefinitions_ContinuousTrap } from "@ygo_card/card_definitions/CardDefinitions_ContinuousTrap";
import { createCardDefinitions_CounterTrap } from "@ygo_card/card_definitions/CardDefinitions_CounterTrap";
import { createCardDefinitions_EquipSpell } from "@ygo_card/card_definitions/CardDefinitions_EquipSpell";
import { createCardDefinitions_EquipSpell_Preset } from "@ygo_card/card_definitions/CardDefinitions_EquipSpell_Preset";
import { createCardDefinitions_FieldSpell_Preset } from "@ygo_card/card_definitions/CardDefinitions_FieldSpell_Preset";
import { createCardDefinitions_LinkMonster } from "@ygo_card/card_definitions/CardDefinitions_LinkMonster";
import { createCardDefinitions_Monster_Preset_DirectAttacker } from "@ygo_card/card_definitions/CardDefinitions_Monster_Preset_DirectAttacker";
import { createCardDefinitions_Monster_Preset_Recruiter } from "@ygo_card/card_definitions/CardDefinitions_Monster_Preset_Recruiter";
import { createCardDefinitions_NormalSpell } from "@ygo_card/card_definitions/CardDefinitions_NormalSpell";
import { createCardDefinitions_NormalSpell_General_Draw } from "@ygo_card/card_definitions/CardDefinitions_NormalSpell_General_Draw";
import { createCardDefinitions_NormalSpell_Preset } from "@ygo_card/card_definitions/CardDefinitions_NormalSpell_Preset";
import { createCardDefinitions_NormalTrap } from "@ygo_card/card_definitions/CardDefinitions_NormalTrap";
import { createCardDefinitions_NormalTrap_UponAttackDeclaration } from "@ygo_card/card_definitions/CardDefinitions_NormalTrap_UponAttackDeclaration";
import { createCardDefinitions_QuickPlaySpell } from "@ygo_card/card_definitions/CardDefinitions_QuickPlaySpell";
import { createCardDefinitions_SyncroMonster } from "@ygo_card/card_definitions/CardDefinitions_SyncroMonster";
import { createCardDefinitions_TestMonster } from "@ygo_card/card_definitions/CardDefinitions_TestMonster";
import { createCardDefinitions_XyzMonster } from "@ygo_card/card_definitions/CardDefinitions_XyzMonster";
import { createCardDefinitions_Yusei_SyncroTunerMonster } from "@ygo_card/card_definitions/character_yusei/CardDefinitions_Yusei_SyncroTunerMonster";
import { createCardDefinitions_BambooSword_EquipSpell } from "@ygo_card/card_definitions/tag_b/CardDefinitions_BambooSword_EquipSpell";
import { createCardDefinitions_BambooSword_NormalSpell } from "@ygo_card/card_definitions/tag_b/CardDefinitions_BambooSword_NormalSpell";
import { createCardDefinitions_Blackwing_Monster } from "@ygo_card/card_definitions/tag_b/CardDefinitions_Blackwing_Monster";
import { createCardDefinitions_Crystron_LinkMonster } from "@ygo_card/card_definitions/tag_c/CardDefinitions_Crystron_LinkMonster";
import { createCardDefinitions_Exodia_Monster } from "@ygo_card/card_definitions/tag_e/CardDefinitions_Exodia_Monster";
import { createCardDefinitions_Firewall_LinkMonster } from "@ygo_card/card_definitions/tag_f/CardDefinitions_Firewall_LinkMonster";
import { createCardDefinitions_Igknight_Monster } from "@ygo_card/card_definitions/tag_i/CardDefinitions_Igknight_Monster";
import { createCardDefinitions_Junk_Monster } from "@ygo_card/card_definitions/tag_j/CardDefinitions_Junk_Monster";
import { createCardDefinitions_Resonator_Monster } from "@ygo_card/card_definitions/tag_r/CardDefinitions_Resonator_Monster";
import { createCardDefinitions_SpellCounter_Monster } from "@ygo_card/card_definitions/tag_s/CardDefinitions_SpellCounter_Monster";
import { createCardDefinitions_Stardust_Monster } from "@ygo_card/card_definitions/tag_s/CardDefinitions_Stardust_Monster";
import { createCardDefinitions_Synchron_SyncroMonster } from "@ygo_card/card_definitions/tag_s/CardDefinitions_Synchron_SyncroMonster";
import { createCardDefinitions_WorldChalice_Monster } from "@ygo_card/card_definitions/tag_w/CardDefinitions_WorldChalice_Monster";
import { createCardDefinitions_Earth_Cyberse_lvl1_Monster } from "@ygo_card/card_definitions/type_Cyberse/CardDefinitions_Earth_Cyberse_lvl1_Monster";
import { createCardDefinitions_Light_Fairy_lvl8_SyncroMonster } from "@ygo_card/card_definitions/type_Fairy/CardDefinitions_Light_Fairy_lvl8_SyncroMonster";
import { createCardDefinitions_Dark_Fiend_lvl4_Monster } from "@ygo_card/card_definitions/type_Fiend/CardDefinitions_Dark_Fiend_lvl4_Monster";
import { createCardDefinitions_Wind_Spellcaster_lvl3_Monster } from "@ygo_card/card_definitions/type_Spellcaster/CardDefinitions_Wind_Spellcaster_lvl3_Monster";
import { SystemError } from "@ygo_duel/class/Duel";

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
    ...createCardDefinitions_ContinuousTrap(),
    ...createCardDefinitions_NormalSpell_General_Draw(),
    ...createCardDefinitions_XyzMonster(),
    ...createCardDefinitions_Resonator_Monster(),
    ...createCardDefinitions_Stardust_Monster(),
    ...createCardDefinitions_LinkMonster(),
    ...createCardDefinitions_Firewall_LinkMonster(),
    ...createCardDefinitions_Earth_Cyberse_lvl1_Monster(),
    ...createCardDefinitions_CounterTrap(),
    ...createCardDefinitions_Synchron_SyncroMonster(),
    ...createCardDefinitions_Dark_Fiend_lvl4_Monster(),
    ...createCardDefinitions_Light_Fairy_lvl8_SyncroMonster(),
    ...createCardDefinitions_WorldChalice_Monster(),
    ...createCardDefinitions_Crystron_LinkMonster(),
    ...createCardDefinitions_Wind_Spellcaster_lvl3_Monster(),
    ...createCardDefinitions_Yusei_SyncroTunerMonster(),
    ...createCardDefinitions_Junk_Monster(),
    ...createCardDefinitions_Igknight_Monster(),
    ...createCardDefinitions_Exodia_Monster(),
    ...createCardDefinitions_Monster_Preset_DirectAttacker(),
    ...createCardDefinitions_BambooSword_NormalSpell(),
    ...createCardDefinitions_BambooSword_EquipSpell(),
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

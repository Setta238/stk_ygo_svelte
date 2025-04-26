import type { ChainBlockInfoBase, ChainBlockInfo, CardActionDefinition, SummonMaterialInfo, ActionCostInfo } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { SystemError } from "@ygo_duel/class/Duel";
import { defaultRuleSummonExecute, defaultRuleSummonPrepare } from "./DefaultCardAction_Monster";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultEquipSpellTrapExecute, defaultEquipSpellTrapValidate, defaultSpellTrapValidate } from "./DefaultCardAction_Spell";
import { defaultPrepare } from "./DefaultCardAction";

export const defaultPendulumCardActivateAction = {
  title: "発動",
  isMandatory: false,
  playType: "CardActivation",
  spellSpeed: "Normal",
  executableCells: ["Hand", "SpellAndTrapZone"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  validate: defaultSpellTrapValidate,
  prepare: async (myInfo) => {
    myInfo.action.entity.status.kind === "Spell";
    return defaultPrepare();
  },
  execute: async () => true,
  settle: async () => true,
} as CardActionDefinition<unknown>;

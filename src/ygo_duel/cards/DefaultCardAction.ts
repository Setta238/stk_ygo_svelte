import { type CardActionBase, type ChainBlockInfoBase, type TEffectTag } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { duelFieldCellTypes } from "@ygo_duel/class/DuelFieldCell";
import type { TDuelPeriodKey } from "@ygo_duel/class/DuelPeriod";
export const defaultPrepare = async () => {
  return { selectedEntities: [] as DuelEntity[], chainBlockTags: [] as TEffectTag[], prepared: undefined };
};
export const getSystemAction = (title: string, executablePeriods: Readonly<TDuelPeriodKey[]>, callback: (myInfo: ChainBlockInfoBase<unknown>) => undefined) => {

  // FIXME 非同期が使えない都合上、validateにcallbackを渡し、そちらで実行する。
  return {
    title: title,
    playType: "SystemAction",
    spellSpeed: "Normal",
    executableCells: duelFieldCellTypes,
    executablePeriods: executablePeriods,
    executableDuelistTypes: ["Controller", "Opponent"],
    validate: callback,
    prepare: defaultPrepare,
    execute: async () => true,
    settle: async () => true,
  } as CardActionBase<unknown>;
};

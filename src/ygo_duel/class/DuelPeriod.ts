import { getKeys } from "@stk_utils/funcs/StkObjectUtils";

export const duelPhases = ["draw", "standby", "main1", "battle1", "battle2", "main2", "end"] as const;
export type TDuelPhase = (typeof duelPhases)[number];
export const duelPhaseDic: { [key in TDuelPhase]: string } = {
  draw: "ドローフェイズ",
  standby: "スタンバイフェイズ",
  main1: "メインフェイズ１",
  battle1: "バトルフェイズ",
  battle2: "バトルフェイズ（追加）",
  main2: "メインフェイズ２",
  end: "エンドフェイズ",
};
export const duelPhaseSteps = ["start", "battle", "damage", "end"] as const;
export type TDuelPhaseStep = (typeof duelPhaseSteps)[number];
export const duelPhaseStepDic: { [key in TDuelPhaseStep]: string } = {
  start: "スタートステップ",
  battle: "バトルステップ",
  damage: "ダメージステップ",
  end: "エンドステップ",
};

export const duelPhaseStepStages = ["start", "beforeDmgCalc", "dmgCalc", "afterDmgCalc", "end"] as const;
export type TDuelPhaseStepStage = (typeof duelPhaseStepStages)[number];
export const duelPhaseStepStageDic: { [key in TDuelPhaseStepStage]: string } = {
  start: "ダメージステップ開始時",
  beforeDmgCalc: "ダメージ計算前",
  dmgCalc: "ダメージ計算時",
  afterDmgCalc: "ダメージ計算後",
  end: "ダメージステップ終了時",
};

export const freeChainDuelPeriodKeys = ["draw", "stanby", "main1", "b1Start", "b1Battle", "b1End", "b2Start", "b2Battle", "b2End", "main2", "end"] as const;
export const damageStepPeriodKeys = [
  "b1DStart",
  "b1DBeforeDmgCalc",
  "b1DAfterDmgCalc",
  "b1DEnd",
  "b2DStart",
  "b2DBeforeDmgCalc",
  "b2DAfterDmgCalc",
  "b2DEnd",
] as const;
export const damageCalcPeriodKeys = ["b1DDmgCalc", "b2DDmgCalc"] as const;
export const duelPeriodKeys = [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys, ...damageCalcPeriodKeys] as const;
export type TDuelPeriodKey = (typeof duelPeriodKeys)[number];
export type DuelPeriod = { key: TDuelPeriodKey; phase: TDuelPhase; step: TDuelPhaseStep | undefined; stage: TDuelPhaseStepStage | undefined; name: string };
const _duelPeriodDic: { [key in TDuelPeriodKey]: Omit<DuelPeriod, "name" | "key"> } = {
  draw: {
    phase: "draw",
    step: undefined,
    stage: undefined,
  },
  stanby: {
    phase: "standby",
    step: undefined,
    stage: undefined,
  },

  main1: {
    phase: "main1",
    step: undefined,
    stage: undefined,
  },
  b1Start: {
    phase: "battle1",
    step: "start",
    stage: undefined,
  },
  b1Battle: {
    phase: "battle1",
    step: "battle",
    stage: undefined,
  },
  b1DStart: {
    phase: "battle1",
    step: "battle",
    stage: "start",
  },
  b1DBeforeDmgCalc: {
    phase: "battle1",
    step: "battle",
    stage: "beforeDmgCalc",
  },
  b1DDmgCalc: {
    phase: "battle1",
    step: "battle",
    stage: "dmgCalc",
  },
  b1DAfterDmgCalc: {
    phase: "battle1",
    step: "battle",
    stage: "afterDmgCalc",
  },
  b1DEnd: {
    phase: "battle1",
    step: "battle",
    stage: "end",
  },
  b1End: {
    phase: "battle1",
    step: "end",
    stage: undefined,
  },
  b2Start: {
    phase: "battle2",
    step: "start",
    stage: undefined,
  },
  b2Battle: {
    phase: "battle2",
    step: "battle",
    stage: undefined,
  },
  b2DStart: {
    phase: "battle2",
    step: "battle",
    stage: "start",
  },
  b2DBeforeDmgCalc: {
    phase: "battle2",
    step: "battle",
    stage: "beforeDmgCalc",
  },
  b2DDmgCalc: {
    phase: "battle2",
    step: "battle",
    stage: "dmgCalc",
  },
  b2DAfterDmgCalc: {
    phase: "battle2",
    step: "battle",
    stage: "afterDmgCalc",
  },
  b2DEnd: {
    phase: "battle2",
    step: "battle",
    stage: "end",
  },
  b2End: {
    phase: "battle2",
    step: "end",
    stage: undefined,
  },
  main2: {
    phase: "main2",
    step: undefined,
    stage: undefined,
  },
  end: {
    phase: "end",
    step: undefined,
    stage: undefined,
  },
} as const;

export const getPeriodName = (period: DuelPeriod): string => {
  if (period.stage) {
    return duelPhaseStepStageDic[period.stage];
  }
  if (period.step) {
    return duelPhaseStepDic[period.step];
  }
  return duelPhaseDic[period.phase];
};

export const duelPeriodDic = getKeys(_duelPeriodDic).reduce(
  (wip, key) => {
    wip[key].key = key;
    wip[key].name = getPeriodName(wip[key]);
    return wip;
  },
  _duelPeriodDic as { [key in TDuelPeriodKey]: DuelPeriod }
);

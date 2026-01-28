import { type ActionCostInfo, type ChainBlockInfo, type ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";

export const defaultPayLifePoint = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  point: number,
): Promise<ActionCostInfo> => {
  myInfo.activator.payLp(point, myInfo.action.entity);
  return { lifePoint: point };
};

export const defaultPayHarfLifePoint = async <T>(myInfo: ChainBlockInfoBase<T>): Promise<ActionCostInfo> => {
  const point = Math.floor(myInfo.activator.lp / 2);

  myInfo.activator.payLp(point, myInfo.action.entity);
  return { lifePoint: point };
};

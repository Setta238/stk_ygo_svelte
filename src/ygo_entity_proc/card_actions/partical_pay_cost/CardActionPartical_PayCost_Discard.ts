import { type ChainBlockInfo, type ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";

export const defaultCanPayDiscardCosts = <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  filter: (entity: DuelEntity) => boolean = () => true,
  qty: number = 1
) =>
  myInfo.activator
    .getHandCell()
    .cardEntities.filter(filter)
    .filter((card) => myInfo.activator.canDiscard([card])).length >= qty;

export const defaultPayDiscardCosts = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean = false,
  filter: (entity: DuelEntity) => boolean = () => true,
  qty: number = 1
) => {
  const costs = await myInfo.activator.discard(qty, "Cost", filter, myInfo.action.entity, myInfo.activator, myInfo.activator, cancelable);
  return { discard: costs?.map((cost) => ({ cost, cell: myInfo.activator.getHandCell() })) };
};

export const defaultCanPaySelfDiscardCosts = <T>(myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) =>
  defaultCanPayDiscardCosts(myInfo, chainBlockInfos, (entity) => myInfo.action.entity === entity, 1);

export const defaultPaySelfDiscardCosts = <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean = false
) => defaultPayDiscardCosts(myInfo, chainBlockInfos, cancelable, (entity) => myInfo.action.entity === entity);

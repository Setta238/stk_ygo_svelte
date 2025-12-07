import { type CardActionDefinitionFunctions, type ChainBlockInfo, type ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { playFieldCellTypes, type DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export const defaultCanPayReleaseCosts = <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  ...args: Parameters<typeof getPayReleaseCostActionPartical<T>>
) => {
  const [filter, cellTypes, qty] = args;
  const cards = myInfo.activator
    .getCells(...(cellTypes ?? playFieldCellTypes))
    .flatMap((cell) => cell.cardEntities)
    .filter((card) => card.kind === "Monster")
    .filter((card) => card.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action))
    .filter((card) => !filter || filter(myInfo, chainBlockInfos, card));
  return cards.length >= (qty ?? 1);
};

export const getPayReleaseCostActionPartical = <T>(
  filter: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, entity: DuelEntity) => boolean = () => true,
  cellTypes: Readonly<DuelFieldCellType[]> = playFieldCellTypes,
  qty: number = 1
): Required<Pick<CardActionDefinitionFunctions<T>, "canPayCosts" | "payCosts">> => {
  return {
    canPayCosts: (...args) => defaultCanPayReleaseCosts(...args, filter, cellTypes, qty),
    payCosts: async (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => {
      const cards = myInfo.activator
        .getCells(...cellTypes)
        .flatMap((cell) => cell.cardEntities)
        .filter((card) => card.kind === "Monster")
        .filter((card) => card.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action))
        .filter((card) => filter(myInfo, chainBlockInfos, card));
      const costs = await myInfo.activator.waitSelectEntities(cards, qty, (selected) => selected.length === qty, "コストとするモンスターを選択", cancelable);
      if (!costs) {
        return;
      }

      const costInfos = costs.map((cost) => ({ cost, cell: cost.cell }));

      await DuelEntityShortHands.releaseManyForTheSameReason(costs, ["Cost"], myInfo.action.entity, myInfo.activator);
      return { release: costInfos };
    },
  };
};

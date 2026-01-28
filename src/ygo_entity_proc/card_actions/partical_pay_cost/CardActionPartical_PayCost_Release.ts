import { type CardActionDefinitionFunctions, type ChainBlockInfo, type ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { playFieldCellTypes, type DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { StkPicker } from "@stk_utils/class/StkPicker";

export const defaultCanPayReleaseCost = <T>(
  myInfo: ChainBlockInfoBase<T>,
  cellTypes: Readonly<DuelFieldCellType[]>,
  filter: (entity: DuelEntity, myInfo: ChainBlockInfoBase<T>) => boolean,
  picker: StkPicker<DuelEntity>,
) => {
  const _filter = (entity: DuelEntity) => filter(entity, myInfo);
  return picker
    .getAllPatterns(
      myInfo.activator
        .getCells(...cellTypes)
        .flatMap((cell) => cell.cardEntities)
        .filter(_filter)
        .filter((entity) => entity.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action))
        .filter((entity) => myInfo.activator.canRelease([entity])),
    )
    .some(() => true);
};

export const defaultPayReleaseCost = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean,
  cellTypes: Readonly<DuelFieldCellType[]>,
  filter: (entity: DuelEntity, myInfo: ChainBlockInfoBase<T>) => boolean,
  picker: StkPicker<DuelEntity>,
) => {
  const _filter = (entity: DuelEntity) => filter(entity, myInfo);
  const _selectables = myInfo.activator
    .getCells(...cellTypes)
    .flatMap((cell) => cell.cardEntities)
    .filter(_filter)
    .filter((entity) => entity.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action))
    .filter((entity) => myInfo.activator.canRelease([entity]));

  const selectables: DuelEntity[] = [];
  for (const pattern of picker.getAllPatterns(_selectables)) {
    selectables.push(...pattern.filter((newOne) => !selectables.includes(newOne)));
    if (selectables.length === _selectables.length) {
      break;
    }
  }

  const qty = picker.qty;

  let costs: DuelEntity[] | undefined = undefined;

  if (selectables.length === qty) {
    costs = selectables;
  } else {
    costs = await myInfo.activator.waitSelectEntities(
      selectables,
      qty,
      (selected) => picker.validatePattern(selected),
      `コストとしてリリースするカードを選択。`,
      cancelable,
    );
  }

  if (!costs) {
    return;
  }

  const costInfos = costs.map((cost) => ({ cost, cell: cost.cell }));

  await DuelEntityShortHands.releaseManyForTheSameReason(costs, ["Cost"], myInfo.action.entity, myInfo.activator);

  return { release: costInfos };
};

export const defaultCanPaySelfReleaseCost = <T>(myInfo: ChainBlockInfoBase<T>) =>
  myInfo.activator.canRelease([myInfo.action.entity]) &&
  myInfo.action.entity.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action);

export const defaultPaySelfReleaseCost = async <T>(myInfo: ChainBlockInfoBase<T>) => {
  const costInfo = { cost: myInfo.action.entity, cell: myInfo.action.entity.cell };

  await myInfo.action.entity.release(["Cost"], myInfo.action.entity, myInfo.activator);

  return { release: [costInfo] };
};

export const getPayReleaseCostsActionPartical = <T>(
  cellTypes: Readonly<DuelFieldCellType[]>,
  filter: (entity: DuelEntity, myInfo: ChainBlockInfoBase<T>) => boolean,
  ...pickerDefinitions: Parameters<typeof StkPicker.create<DuelEntity>>
): Required<Pick<CardActionDefinitionFunctions<T>, "canPayCosts" | "payCosts">> => {
  const picker = StkPicker.create(...pickerDefinitions);
  return {
    canPayCosts: (...args) => defaultCanPayReleaseCost(args[0], cellTypes, filter, picker),
    payCosts: (...args) => defaultPayReleaseCost(...args, cellTypes, filter, picker),
  };
};

export const getPaySelfReleaseCostsActionPartical = <T>(): Required<Pick<CardActionDefinitionFunctions<T>, "canPayCosts" | "payCosts">> => {
  const picker = StkPicker.create<DuelEntity>(1);
  const cellTypes: DuelFieldCellType[] = ["Hand", ...playFieldCellTypes];

  return {
    canPayCosts: (...args) => defaultCanPayReleaseCost(args[0], cellTypes, (entity) => args[0].action.entity === entity, picker),
    payCosts: (...args) => defaultPayReleaseCost(...args, cellTypes, (entity) => args[0].action.entity === entity, picker),
  };
};

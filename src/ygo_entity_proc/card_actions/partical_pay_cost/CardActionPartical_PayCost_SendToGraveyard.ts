import { type CardActionDefinitionFunctions, type ChainBlockInfo, type ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { StkPicker } from "@stk_utils/class/StkPicker";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { playFieldCellTypes, type DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";

export const defaultCanPaySendToGraveyardCost = <T>(
  myInfo: ChainBlockInfoBase<T>,
  cellTypes: DuelFieldCellType[],
  filter: (entity: DuelEntity, myInfo: ChainBlockInfoBase<T>) => boolean,
  picker: StkPicker<DuelEntity>
) => {
  const _filter = (entity: DuelEntity) => filter(entity, myInfo);
  return picker
    .getAllPatterns(
      myInfo.activator
        .getCells(...cellTypes)
        .flatMap((cell) => cell.cardEntities)
        .filter(_filter)
        .filter((entity) => entity.entityType !== "Token")
        .filter((entity) => myInfo.activator.canSendToGraveyard([entity]))
    )
    .some(() => true);
};

export const defaultPaySendToGraveyardCost = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean,
  cellTypes: DuelFieldCellType[],
  filter: (entity: DuelEntity, myInfo: ChainBlockInfoBase<T>) => boolean,
  picker: StkPicker<DuelEntity>
) => {
  const _filter = (entity: DuelEntity) => filter(entity, myInfo);
  const _selectables = myInfo.activator
    .getCells(...cellTypes)
    .flatMap((cell) => cell.cardEntities)
    .filter(_filter)
    .filter((entity) => entity.entityType !== "Token")
    .filter((entity) => myInfo.activator.canSendToGraveyard([entity]));

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
      `コストとして墓地に送るカードを選択。`,
      cancelable
    );
  }

  if (!costs) {
    return;
  }

  const costInfos = costs.map((cost) => ({ cost, cell: cost.cell }));

  await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(costs, ["Cost"], myInfo.action.entity, myInfo.activator);

  return { sendToGraveyard: costInfos };
};

export const defaultCanPaySelfSendToGraveyardCost = <T>(myInfo: ChainBlockInfoBase<T>) =>
  myInfo.activator.canSendToGraveyard([myInfo.action.entity]) &&
  myInfo.action.entity.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, "SendToGraveyardAsCost", myInfo.action);

export const defaultPaySelfSendToGraveyardCost = async <T>(myInfo: ChainBlockInfoBase<T>) => {
  const costInfo = { cost: myInfo.action.entity, cell: myInfo.action.entity.cell };

  await myInfo.action.entity.sendToGraveyard(["Cost"], myInfo.action.entity, myInfo.activator);

  return { sendToGraveyard: [costInfo] };
};

export const getPaySendToGraveyardCostsActionPartical = <T>(
  cellTypes: DuelFieldCellType[],
  filter: (entity: DuelEntity, myInfo: ChainBlockInfoBase<T>) => boolean,
  ...pickerDefinitions: Parameters<typeof StkPicker.create<DuelEntity>>
): Required<Pick<CardActionDefinitionFunctions<T>, "canPayCosts" | "payCosts">> => {
  const picker = StkPicker.create(...pickerDefinitions);
  return {
    canPayCosts: (...args) => defaultCanPaySendToGraveyardCost(args[0], cellTypes, filter, picker),
    payCosts: (...args) => defaultPaySendToGraveyardCost(...args, cellTypes, filter, picker),
  };
};

export const getPaySelfSendToGraveyardCostsActionPartical = <T>(): Required<Pick<CardActionDefinitionFunctions<T>, "canPayCosts" | "payCosts">> => {
  const picker = StkPicker.create<DuelEntity>(1);
  const cellTypes: DuelFieldCellType[] = ["Hand", ...playFieldCellTypes];

  return {
    canPayCosts: (...args) => defaultCanPaySendToGraveyardCost(args[0], cellTypes, (entity) => args[0].action.entity === entity, picker),
    payCosts: (...args) => defaultPaySendToGraveyardCost(...args, cellTypes, (entity) => args[0].action.entity === entity, picker),
  };
};

import { type CardActionDefinitionFunctions, type ChainBlockInfo, type ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { StkPicker } from "@stk_utils/class/StkPicker";
export const defaultCanPayDiscardCosts = <T>(
  myInfo: ChainBlockInfoBase<T>,
  filter: (entity: DuelEntity, myInfo: ChainBlockInfoBase<T>) => boolean,
  picker: StkPicker<DuelEntity>,
) => {
  const _filter = (entity: DuelEntity) => filter(entity, myInfo);
  return picker
    .getAllPatterns(
      myInfo.activator
        .getHandCell()
        .cardEntities.filter(_filter)
        .filter((entity) => entity.entityType !== "Token")
        .filter((entity) => myInfo.activator.canDiscard([entity])),
    )
    .some(() => true);
};

export const defaultPayDiscardCosts = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean,
  filter: (entity: DuelEntity, myInfo: ChainBlockInfoBase<T>) => boolean,
  picker: StkPicker<DuelEntity>,
) => {
  const _filter = (entity: DuelEntity) => filter(entity, myInfo);
  const _selectables = myInfo.activator
    .getHandCell()
    .cardEntities.filter(_filter)
    .filter((entity) => entity.entityType !== "Token")
    .filter((entity) => myInfo.activator.canDiscard([entity]));

  const selectables: DuelEntity[] = [];
  for (const pattern of picker.getAllPatterns(_selectables)) {
    selectables.push(...pattern.filter((newOne) => !selectables.includes(newOne)));
    if (selectables.length === _selectables.length) {
      break;
    }
  }

  const qty = picker.qty;

  let costs: DuelEntity[] | undefined = undefined;

  if (qty !== undefined) {
    costs = await myInfo.activator.discard(
      qty,
      "Cost",
      (entity) => filter(entity, myInfo),
      myInfo.action.entity,
      myInfo.activator,
      myInfo.activator,
      cancelable,
    );
  } else {
    costs = await myInfo.activator.waitSelectEntities(
      selectables,
      qty,
      (selected) => picker.validatePattern(selected),
      `コストとして捨てるカードを選択。`,
      cancelable,
    );
  }
  if (!costs) {
    return;
  }

  return { discard: costs?.map((cost) => ({ cost, cell: myInfo.activator.getHandCell() })) };
};

export const defaultCanPaySelfDiscardCost = <T>(myInfo: ChainBlockInfoBase<T>) =>
  myInfo.activator.canSendToGraveyard([myInfo.action.entity]) &&
  myInfo.action.entity.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, "SendToGraveyardAsCost", myInfo.action);

export const defaultPaySelfDiscardCost = async <T>(myInfo: ChainBlockInfoBase<T>) => {
  const costInfo = { cost: myInfo.action.entity, cell: myInfo.action.entity.cell };

  await myInfo.action.entity.sendToGraveyard(["Cost"], myInfo.action.entity, myInfo.activator);

  return { sendToGraveyard: [costInfo] };
};

export const getPayDiscardCostsActionPartical = <T>(
  filter: (entity: DuelEntity, myInfo: ChainBlockInfoBase<T>) => boolean,
  ...pickerDefinitions: Parameters<typeof StkPicker.create<DuelEntity>>
): Required<Pick<CardActionDefinitionFunctions<T>, "canPayCosts" | "payCosts">> => {
  const picker = StkPicker.create(...pickerDefinitions);
  return {
    canPayCosts: (...args) => defaultCanPayDiscardCosts(args[0], filter, picker),
    payCosts: (...args) => defaultPayDiscardCosts(...args, filter, picker),
  };
};

export const getPaySelfDiscardCostsActionPartical = <T>(): Required<Pick<CardActionDefinitionFunctions<T>, "canPayCosts" | "payCosts">> => {
  const picker = StkPicker.create<DuelEntity>(1);

  return {
    canPayCosts: (...args) => defaultCanPayDiscardCosts(args[0], (entity) => args[0].action.entity === entity, picker),
    payCosts: (...args) => defaultPayDiscardCosts(...args, (entity) => args[0].action.entity === entity, picker),
  };
};

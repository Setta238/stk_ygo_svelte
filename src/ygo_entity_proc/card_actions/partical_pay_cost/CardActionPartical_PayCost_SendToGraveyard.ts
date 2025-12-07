import { type ChainBlockInfo, type ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";

export const defaultCanPaySelfSendToGraveyardCost = <T>(myInfo: ChainBlockInfoBase<T>) =>
  myInfo.activator.canSendToGraveyard([myInfo.action.entity]) &&
  myInfo.action.entity.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, "SendToGraveyardAsCost", myInfo.action);

export const defaultPaySelfSendToGraveyardCost = async <T>(myInfo: ChainBlockInfoBase<T>) => {
  const costInfo = { cost: myInfo.action.entity, cell: myInfo.action.entity.cell };

  await myInfo.action.entity.sendToGraveyard(["Cost"], myInfo.action.entity, myInfo.activator);

  return { sendToGraveyard: [costInfo] };
};

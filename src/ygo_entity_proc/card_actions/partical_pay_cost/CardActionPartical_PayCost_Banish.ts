import { type CardActionDefinitionFunctions, type ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export const defaultCanPaySelfBanishCosts = <T>(myInfo: ChainBlockInfoBase<T>) =>
  myInfo.activator.canTryBanish(myInfo.action.entity, "BanishAsCost", myInfo.action) &&
  myInfo.action.entity.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action);

export const defaultPaySelfBanishCosts = async <T>(myInfo: ChainBlockInfoBase<T>) => {
  await myInfo.action.entity.banish(["Cost"], myInfo.action.entity, myInfo.activator);
  return { banish: [{ cost: myInfo.action.entity, cell: myInfo.action.entity.cell }] };
};

export const defaultCanPayBanishCosts = <T>(myInfo: ChainBlockInfoBase<T>, cards: DuelEntity[], minQty: number = 1) =>
  cards
    .filter((card) => myInfo.activator.canTryBanish(card, "BanishAsCost", myInfo.action))
    .filter((card) => card.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action)).length >= minQty;

export const defaultPayBanishCosts = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  cards: DuelEntity[],
  validator: (selected: DuelEntity[], myInfo: ChainBlockInfoBase<T>) => boolean,
  minQty: number = 1,
  maxQty: number = 1,
) => {
  const choises = cards
    .filter((card) => myInfo.activator.canTryBanish(card, "BanishAsCost", myInfo.action))
    .filter((card) => card.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action));

  const qty = minQty === maxQty ? minQty : undefined;

  const costs =
    (await myInfo.activator.waitSelectEntities(choises, qty, (selected) => validator(selected, myInfo), "コストとして除外するカードを選択", false)) ?? [];

  const costInfos = costs.map((cost) => ({ cost, cell: cost.cell }));

  await DuelEntityShortHands.banishManyForTheSameReason(costs, ["Cost"], myInfo.action.entity, myInfo.activator);
  return { banish: costInfos };
};

export const getPayBanishCostsActionPartical = <T>(
  getCostableEntities: (...args: Parameters<NonNullable<CardActionDefinitionFunctions<T>["canPayCosts"]>>) => DuelEntity[],
  validator: (selected: DuelEntity[], myInfo: ChainBlockInfoBase<T>) => boolean = () => true,
  minQty: number = 1,
  maxQty: number = 1,
): Required<Pick<CardActionDefinitionFunctions<T>, "canPayCosts" | "payCosts">> => {
  return {
    canPayCosts: (...args) => defaultCanPayBanishCosts(args[0], getCostableEntities(...args), minQty),
    payCosts: (...args) => defaultPayBanishCosts(args[0], getCostableEntities(args[0], args[1]), validator, minQty, maxQty),
  };
};

export const getPaySelfBanishCostsActionPartical = () =>
  getPayBanishCostsActionPartical(
    (myInfo) => [myInfo.action.entity],
    (selected) => selected.length === 1,
  );

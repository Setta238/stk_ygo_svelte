import { faceupBattlePositions, type TBattlePosition } from "@ygo/class/YgoTypes";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import {
  executableDuelistTypes,
  type ActionCostInfo,
  type CardActionDefinition,
  type CardActionDefinitionFunctions,
  type ChainBlockInfo,
  type ChainBlockInfoBase,
  type ChainBlockInfoPreparing,
  type TActionTag,
} from "../../ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { DuelFieldCell, duelFieldCellTypes, playFieldCellTypes, type DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import type { TDuelPeriodKey } from "@ygo_duel/class/DuelPeriod";
import type { WithRequired } from "@stk_utils/funcs/StkTypeUtils";
export const defaultPrepare = async () => {
  return { selectedEntities: [] as DuelEntity[] };
};
export const defaultPayLifePoint = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  point: number
): Promise<ActionCostInfo> => {
  myInfo.activator.payLp(point, myInfo.action.entity);
  return { lifePoint: point };
};

export const defaultPayHarfLifePoint = async <T>(myInfo: ChainBlockInfoBase<T>): Promise<ActionCostInfo> => {
  const point = Math.floor(myInfo.activator.lp / 2);

  myInfo.activator.payLp(point, myInfo.action.entity);
  return { lifePoint: point };
};

export const defaultCanPaySelfSendToGraveyardCost = <T>(myInfo: ChainBlockInfoBase<T>) =>
  myInfo.activator.canSendToGraveyard([myInfo.action.entity]) &&
  myInfo.action.entity.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, "SendToGraveyardAsCost", myInfo.action);

export const defaultPaySelfSendToGraveyardCost = async <T>(myInfo: ChainBlockInfoBase<T>) => {
  const costInfo = { cost: myInfo.action.entity, cell: myInfo.action.entity.cell };

  await myInfo.action.entity.sendToGraveyard(["Cost"], myInfo.action.entity, myInfo.activator);

  return { sendToGraveyard: [costInfo] };
};

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
  maxQty: number = 1
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
  maxQty: number = 1
): Required<Pick<CardActionDefinitionFunctions<T>, "canPayCosts" | "payCosts">> => {
  return {
    canPayCosts: (...args) => defaultCanPayBanishCosts(args[0], getCostableEntities(...args), minQty),
    payCosts: (...args) => defaultPayBanishCosts(args[0], getCostableEntities(args[0], args[1]), validator, minQty, maxQty),
  };
};
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

export const getDestsForSingleTargetAction = <T>(myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) =>
  myInfo.action
    .getTargetableEntities(myInfo, chainBlockInfos)
    .filter((entity) => entity.isOnField)
    .map((card) => card.cell);

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
export const getTargetRebornEnableList = <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  getMonsters: (...args: Parameters<NonNullable<CardActionDefinitionFunctions<T>["canExecute"]>>) => DuelEntity[],
  options: {
    posList?: Readonly<TBattlePosition[]>;
    cells?: DuelFieldCell[];
  } = {}
) => {
  const { posList, cells } = {
    posList: faceupBattlePositions,
    cells: myInfo.activator.getMonsterZones(),
    ...options,
  };
  return myInfo.activator.getEnableSummonList(
    myInfo.activator,
    "SpecialSummon",
    ["Effect"],
    myInfo.action,
    getMonsters(myInfo, chainBlockInfos)
      .filter((card) => card.kind === "Monster")
      .filter((card) => card.canBeTargetOfEffect(myInfo))
      .map((monster) => {
        return { monster, posList, cells };
      }),
    [],
    false
  );
};
export const defaultTargetMonstersRebornPrepare = async <T>(
  myInfo: ChainBlockInfoPreparing<T>,
  monsters: DuelEntity[],
  posList: Readonly<TBattlePosition[]> = faceupBattlePositions,
  validator: (selected: DuelEntity[]) => boolean = (selected) => selected.length === 1,
  qty: number = 1
) => {
  const cells = myInfo.activator.getMonsterZones();
  const list = myInfo.activator.getEnableSummonList(
    myInfo.activator,
    "SpecialSummon",
    ["Effect"],
    myInfo.action,
    monsters
      .filter((card) => card.kind === "Monster")
      .filter((card) => card.canBeTargetOfEffect(myInfo))
      .map((monster) => {
        return { monster, posList, cells };
      }),
    [],
    false
  );

  const targets =
    (await myInfo.activator.waitSelectEntities(
      list.map((item) => item.monster),
      qty,
      validator,
      "特殊召喚するモンスターを選択",
      false
    )) ?? [];
  if (!targets.length) {
    throw new IllegalCancelError(myInfo);
  }

  const tags: TActionTag[] = targets
    .map((monster) => monster.cell.cellType)
    .getDistinct()
    .filter((ct) => ct === "Graveyard" || ct === "Banished")
    .map((ct) => (ct === "Graveyard" ? "SpecialSummonFromGraveyard" : "SpecialSummonFromBanished"));

  return { selectedEntities: targets, chainBlockTags: tags };
};

export const defaultTargetMonstersRebornExecute = async <T>(
  myInfo: ChainBlockInfo<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  options?: { posList?: Readonly<TBattlePosition[]>; cells?: DuelFieldCell[]; allOrNothing?: boolean }
) => {
  const { posList, allOrNothing, cells } = { posList: faceupBattlePositions, allOrNothing: true, cells: myInfo.activator.getMonsterZones(), ...options };
  const list = myInfo.selectedEntities
    .filter((monster) => !monster.wasMovedAfter(myInfo.isActivatedAt))
    .map((monster) => {
      return { monster, posList, cells };
    });
  if (allOrNothing) {
    if (list.length !== myInfo.selectedEntities.length || cells.length < list.length) {
      return false;
    }
  }
  await myInfo.activator.summonAll(myInfo.activator, "SpecialSummon", ["Effect"], myInfo.action, list, [], false, false);

  return true;
};

export const defaultEffectSpecialSummonExecute = async <T>(
  myInfo: ChainBlockInfo<T>,
  monsters: DuelEntity[],
  options?: Partial<{
    cells: DuelFieldCell[];
    posList: TBattlePosition[];
  }>
) => {
  const cells = options?.cells ?? myInfo.activator.getMonsterZones();
  const posList = options?.posList ?? faceupBattlePositions;
  const list = monsters.map((monster) => {
    return { monster, posList, cells };
  });
  await myInfo.activator.summonAll(myInfo.activator, "SpecialSummon", ["Effect"], myInfo.action, list, [], false, false);

  return true;
};

export const getMultiTargetsRebornActionPartical = <T>(
  getTargetableEntities: (...args: Parameters<NonNullable<CardActionDefinitionFunctions<T>["canExecute"]>>) => DuelEntity[],
  options: {
    message?: string;
    tags?: TActionTag[];
    cells?: DuelFieldCell[];
    posList?: Readonly<TBattlePosition[]>;
    canExecute?: (...args: Parameters<NonNullable<CardActionDefinitionFunctions<T>["canExecute"]>>) => boolean;
    qty?: number;
    allOrNothing?: boolean;
    afterExecute?: (isSucceed: boolean, ...args: Parameters<CardActionDefinitionFunctions<T>["execute"]>) => Promise<boolean>;
  } = {}
): Omit<WithRequired<CardActionDefinitionFunctions<T>, "canExecute">, "settle"> & { hasToTargetCards: boolean } => {
  const qty = options.qty ?? 1;
  return {
    hasToTargetCards: true,
    getTargetableEntities,
    canExecute: (myInfo, chainBlockInfos, irregularCostInfo) =>
      (!options.canExecute || options.canExecute(myInfo, chainBlockInfos, irregularCostInfo)) &&
      getTargetRebornEnableList(myInfo, chainBlockInfos, getTargetableEntities, options).length >= qty,
    prepare: async (myInfo, chainBlockInfos, cancelable) => {
      const chainBlockTags = options.tags ?? [];
      const msg = options.message ?? "特殊召喚するモンスターを選択。";

      const list = getTargetRebornEnableList(myInfo, chainBlockInfos, getTargetableEntities, options);

      const selectedEntities = await myInfo.activator.waitSelectEntities(
        list.map((item) => item.monster),
        qty,
        (selected) => selected.length === qty,
        msg,
        cancelable
      );
      if (!selectedEntities) {
        return;
      }

      chainBlockTags.push(
        ...selectedEntities
          .map((monster) => monster.cell.cellType)
          .getDistinct()
          .filter((ct) => ct === "Graveyard" || ct === "Banished")
          .map((ct) => (ct === "Graveyard" ? "SpecialSummonFromGraveyard" : "SpecialSummonFromBanished"))
      );
      return { selectedEntities, chainBlockTags, appendix: [`対象：${selectedEntities.map((card) => card.toString()).join(", ")}`] };
    },
    execute: async (...args) => {
      const isSucceed = await defaultTargetMonstersRebornExecute(...args, options);
      if (!options.afterExecute) {
        return isSucceed;
      }
      return options.afterExecute(isSucceed, ...args);
    },
  };
};

export const getSingleTargetActionPartical = <T>(
  getTargetableEntities: (...args: Parameters<NonNullable<CardActionDefinitionFunctions<T>["canExecute"]>>) => DuelEntity[],
  options: {
    message?: string;
    tags?: TActionTag[];
    do?: "Destroy";
    posList?: Readonly<TBattlePosition[]>;
    canExecute?: (...args: Parameters<NonNullable<CardActionDefinitionFunctions<T>["canExecute"]>>) => boolean;
  } = {}
): Omit<CardActionDefinitionFunctions<T>, "execute" | "settle"> & { hasToTargetCards: boolean } => {
  const _getTargetableEntities: typeof getTargetableEntities = (myInfo, chainBlockInfos, irregularCostInfo) =>
    getTargetableEntities(myInfo, chainBlockInfos, irregularCostInfo).filter((monster) => monster.canBeTargetOfEffect(myInfo));
  return {
    hasToTargetCards: true,
    getTargetableEntities,
    canExecute: (...args) => _getTargetableEntities(...args).length > 0 && (!options.canExecute || options.canExecute(...args)),
    getDests: getDestsForSingleTargetAction,
    prepare: async (myInfo, chainBlockInfos, cancelable) => {
      let selectedEntities: DuelEntity[] = [];
      const chainBlockTags = options.tags ?? [];
      const msg = options.message ?? (options.do === "Destroy" ? "破壊するカードを選択。" : "対象とするカードを選択。");

      if (myInfo.dest) {
        selectedEntities = [myInfo.dest.cardEntities[0]];
      } else {
        const target = await myInfo.activator.waitSelectEntity(_getTargetableEntities(myInfo, chainBlockInfos), msg, cancelable);
        if (!target) {
          return;
        }

        selectedEntities = [target];
      }
      if (options.do === "Destroy") {
        chainBlockTags.push(...myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, selectedEntities));
      }

      return { selectedEntities, chainBlockTags, appendix: [`対象：${selectedEntities.map((card) => card.toString()).join(", ")}`] };
    },
  };
};

export const defaultDeckDestructionExecute = async <T>(
  myInfo: ChainBlockInfo<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  options?: { qty?: number; targets?: ("Opponent" | "Self")[] }
) => {
  const qty = options?.qty ?? 1;
  const targets = options?.targets ?? ["Opponent"];

  const cards: DuelEntity[] = [];
  if (targets.includes("Self")) {
    cards.push(...myInfo.activator.getDeckCell().cardEntities.slice(0, qty));
  }
  if (targets.includes("Opponent")) {
    cards.push(...myInfo.activator.getOpponentPlayer().getDeckCell().cardEntities.slice(0, qty));
  }
  // 処理時に枚数未満なら全て墓地に送る。
  await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);

  return true;
};
export const getDeckDestructionActionPartical = <T>(options?: {
  qty?: number;
  targets?: ("Opponent" | "Self")[];
}): Pick<CardActionDefinitionFunctions<T>, "execute" | "prepare"> => {
  return {
    prepare: defaultPrepare,
    execute: (...args) => defaultDeckDestructionExecute(...args, options),
  };
};

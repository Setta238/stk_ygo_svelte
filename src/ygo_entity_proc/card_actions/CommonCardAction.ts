import { faceupBattlePositions, type TBattlePosition } from "@ygo/class/YgoTypes";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import {
  executableDuelistTypes,
  type ActionCostInfo,
  type CardActionDefinition,
  type ChainBlockInfo,
  type ChainBlockInfoBase,
  type TEffectTag,
} from "../../ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { duelFieldCellTypes } from "@ygo_duel/class/DuelFieldCell";
import type { TDuelPeriodKey } from "@ygo_duel/class/DuelPeriod";
export const defaultPrepare = async <T>() => {
  return { selectedEntities: [] as DuelEntity[], chainBlockTags: [] as TEffectTag[], prepared: undefined as T };
};
export const defaultPayLifePoint = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  point: number
): Promise<ActionCostInfo> => {
  myInfo.activator.payLp(point, myInfo.action.entity);
  return { lifePoint: point };
};

export const defaultCanPaySelfSendToGraveyardCost = <T>(myInfo: ChainBlockInfoBase<T>) =>
  myInfo.activator.canSendToGraveyard([myInfo.action.entity]) &&
  myInfo.action.entity.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, "SendToGraveyardAsCost", myInfo.action);

export const defaultPaySelfSendToGraveyardCost = async <T>(myInfo: ChainBlockInfoBase<T>) => {
  await myInfo.action.entity.sendToGraveyard(["Cost"], myInfo.action.entity, myInfo.activator);

  return { sendToGraveyard: [myInfo.action.entity] };
};

export const defaultCanPaySelfBanishCosts = <T>(myInfo: ChainBlockInfoBase<T>) =>
  myInfo.activator.canTryBanish(myInfo.action.entity, "BanishAsCost", myInfo.action) &&
  myInfo.action.entity.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action);

export const defaultPaySelfBanishCosts = async <T>(myInfo: ChainBlockInfoBase<T>) => {
  await myInfo.action.entity.banish(["Cost"], myInfo.action.entity, myInfo.activator);
  return { banish: [myInfo.action.entity] };
};

export const defaultCanPayBanishCosts = <T>(myInfo: ChainBlockInfoBase<T>, cards: DuelEntity[], minQty: number = 1) =>
  cards
    .filter((card) => myInfo.activator.canTryBanish(card, "BanishAsCost", myInfo.action))
    .filter((card) => card.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action)).length >= minQty;

export const defaultPayBanishCosts = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  cards: DuelEntity[],
  validator: (selected: DuelEntity[]) => boolean,
  qty?: number
) => {
  const choises = cards
    .filter((card) => myInfo.activator.canTryBanish(card, "BanishAsCost", myInfo.action))
    .filter((card) => card.canBeBanished("BanishAsCost", myInfo.activator, myInfo.action.entity, myInfo.action));

  const cost = (await myInfo.activator.waitSelectEntities(choises, qty, validator, "コストとして除外するカードを選択", false)) ?? [];
  await DuelEntityShortHands.banishManyForTheSameReason(cost, ["Cost"], myInfo.action.entity, myInfo.activator);
  return { banish: cost };
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
  const cost = await myInfo.activator.discard(qty, "Cost", filter, myInfo.action.entity, myInfo.activator, myInfo.activator, cancelable);
  return { discard: cost };
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
    .map((card) => card.fieldCell);

export const getSingleTargetActionPartical = <T>(
  getTargetableEntities: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => DuelEntity[],
  options: {
    message?: string;
    tags?: TEffectTag[];
    destoryTargets?: boolean;
    canExecute?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => boolean;
  } = {}
) => {
  return {
    hasToTargetCards: true,
    getTargetableEntities,
    canExecute: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>): boolean =>
      getTargetableEntities(myInfo, chainBlockInfos).filter((monster) => monster.canBeTargetOfEffect(myInfo)).length > 0 &&
      (!options.canExecute || options.canExecute(myInfo, chainBlockInfos)),
    getDests: getDestsForSingleTargetAction,
    prepare: async (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => {
      let selectedEntities: DuelEntity[] = [];
      if (myInfo.dest) {
        selectedEntities = [myInfo.dest.cardEntities[0]];
      } else {
        const targets = myInfo.action.getTargetableEntities(myInfo, chainBlockInfos).filter((monster) => monster.canBeTargetOfEffect(myInfo));
        const target = await myInfo.activator.waitSelectEntity(targets, options.message ?? "対象とするカードを選択。", cancelable);
        if (!target) {
          return;
        }
        selectedEntities = [target];
      }
      const chainBlockTags: TEffectTag[] = options.tags ?? [];

      if (options.destoryTargets) {
        chainBlockTags.push(...myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, selectedEntities));
      }
      return { selectedEntities, chainBlockTags, prepared: undefined as T };
    },
  };
};

export const defaultTargetMonstersRebornPrepare = async <T>(
  myInfo: ChainBlockInfoBase<T>,
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

  const tags: TEffectTag[] = targets
    .map((monster) => monster.fieldCell.cellType)
    .getDistinct()
    .filter((ct) => ct === "Graveyard" || ct === "Banished")
    .map((ct) => (ct === "Graveyard" ? "SpecialSummonFromGraveyard" : "SpecialSummonFromBanished"));

  return { selectedEntities: targets, chainBlockTags: tags, prepared: undefined };
};

export const defaultTargetMonstersRebornExecute = async <T>(
  myInfo: ChainBlockInfo<T>,
  posList: Readonly<TBattlePosition[]> = ["Attack", "Defense"],
  allOrNothing: boolean = true
) => {
  const cells = myInfo.activator.getMonsterZones();
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
  posList: TBattlePosition[] = ["Attack", "Defense"]
) => {
  const cells = myInfo.activator.getMonsterZones();
  const list = monsters.map((monster) => {
    return { monster, posList, cells };
  });
  await myInfo.activator.summonAll(myInfo.activator, "SpecialSummon", ["Effect"], myInfo.action, list, [], false, false);

  return true;
};
export const getSystemPeriodAction = (
  title: string,
  executablePeriods: Readonly<TDuelPeriodKey[]>,
  callback: (myInfo: ChainBlockInfoBase<unknown>) => undefined
) => {
  // FIXME 非同期が使えない都合上、canExecuteにcallbackを渡し、そちらで実行する。
  return {
    title: title,
    playType: "SystemPeriodAction",
    spellSpeed: "Normal",
    executableCells: duelFieldCellTypes,
    executablePeriods: executablePeriods,
    executableDuelistTypes,
    isMandatory: true,
    canExecute: (myInfo) => {
      callback(myInfo);
      return false;
    },
    prepare: defaultPrepare,
    execute: async () => true,
    settle: async () => true,
  } as CardActionDefinition<unknown>;
};

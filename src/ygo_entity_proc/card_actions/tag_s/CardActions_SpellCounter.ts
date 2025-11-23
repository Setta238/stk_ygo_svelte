import type { CardActionDefinition, CardActionDefinitionFunctions, ChainBlockInfo, ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { createRegularStatusOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import type { TCardKind } from "@ygo/class/YgoTypes";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "../../card_actions/CardActions";
export const createSpellCounterCommonEffect = (kind: TCardKind, maxQty?: number) => {
  const title = maxQty ? `魔力充填可能(${maxQty})` : "魔力充填可能";

  return createRegularStatusOperatorHandler(
    title,
    kind,
    (source) => [source],
    (source) => {
      return [
        new StatusOperator({
          title,
          validateAlive: () => true,
          isContinuous: true,
          isSpawnedBy: source,
          actionAttr: {},
          isApplicableTo: (operator, target) => operator.isSpawnedBy === target,
          statusCalculator: (bundleOwner, ope, wip) => {
            wip.maxCounterQty.SpellCounter = maxQty ?? Number.MAX_VALUE;
            return { maxCounterQty: wip.maxCounterQty };
          },
        }),
      ];
    }
  ) as ContinuousEffectBase<unknown>;
};

const _spellCounterChargeEffectDic: { [qty: number]: CardActionDefinition<unknown> } = {};
export const createSpellCounterChargeEffect = (titlePrefix: string, qty: number = 1): CardActionDefinition<unknown> => {
  if (!_spellCounterChargeEffectDic[qty]) {
    _spellCounterChargeEffectDic[qty] = {
      title: `魔力回収(${qty})`,
      isMandatory: true,
      playType: "AfterChainBlock",
      spellSpeed: "Normal",
      executableCells: ["MonsterZone"],
      executablePeriods: duelPeriodKeys,
      executableDuelistTypes: ["Controller"],
      canExecute: (myInfo) =>
        Boolean(
          myInfo.targetChainBlock &&
            myInfo.targetChainBlock.action.playType === "CardActivation" &&
            myInfo.targetChainBlock.action.entity.kind === "Spell" &&
            myInfo.action.entity.isEffective &&
            myInfo.action.entity.face === "FaceUp" &&
            myInfo.action.entity.counterHolder.getQty("SpellCounter") < (myInfo.action.entity.status.maxCounterQty.SpellCounter ?? 0) &&
            (myInfo.action.entity.hadArrivedToFieldAt()?.totalProcSeq ?? Number.MAX_SAFE_INTEGER) <= myInfo.targetChainBlock.isActivatedAt.totalProcSeq
        ),
      prepare: defaultPrepare,
      execute: async (myInfo) => {
        if (myInfo.action.entity.face === "FaceDown") {
          return false;
        }
        if (!myInfo.action.entity.isOnFieldAsMonsterStrictly) {
          return false;
        }
        if (!myInfo.action.entity.isEffective) {
          return false;
        }
        myInfo.action.entity.counterHolder.add("SpellCounter", qty, myInfo.action.entity);
        return true;
      },
      settle: async () => true,
    };
  }

  return { ..._spellCounterChargeEffectDic[qty], title: `${titlePrefix}魔力回収(${qty})` };
};

export const canPaySpellCounters = <T>(myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, minQty: number) =>
  myInfo.action.entity.counterHolder.getQty("SpellCounter") >= minQty;

export const paySpellCounters = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean,
  qtyList: number[]
) => {
  // TODO 取り除く個数が選べる場合

  const _qtyList = qtyList.filter((qty) => qty <= myInfo.action.entity.counterHolder.getQty("SpellCounter"));
  let qty = _qtyList[0];

  if (_qtyList.length > 1) {
    qty = (await myInfo.activator.waitSelectNumber("取り除く魔力カウンターの個数を選択。", _qtyList, cancelable)) ?? 0;
    if (!qty) {
      return;
    }
  }

  myInfo.action.entity.counterHolder.remove("SpellCounter", qty);
  return { counter: qty };
};

export const getPaySpellCountersCostActionPartical = <T>(qtyList: number[]): Required<Pick<CardActionDefinitionFunctions<T>, "canPayCosts" | "payCosts">> => {
  return {
    canPayCosts: (...args) => canPaySpellCounters(...args, qtyList.min() ?? 0),
    payCosts: (...args) => paySpellCounters(...args, qtyList),
  };
};

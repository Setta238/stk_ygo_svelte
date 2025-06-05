import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import type { CardActionDefinition, ChainBlockInfo, ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import {
  createRegularNumericStateOperatorHandler,
  createRegularStatusOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import type { TCardKind } from "@ygo/class/YgoTypes";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare, getSingleTargetActionPartical } from "../../card_actions/CardActions";

const createSpellCounterCommonEffect = (kind: TCardKind, maxQty?: number) => {
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

const createSpellCounterChargeEffect = (titlePrefix: string, qty: number = 1): CardActionDefinition<unknown> => {
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
            myInfo.action.entity.hadArrivedToFieldAt().totalProcSeq <= myInfo.targetChainBlock.isActivatedAt.totalProcSeq
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

export const paySpellCounters = <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean,
  qtyList: number[]
) => {
  // TODO 取り除く個数が選べる場合
  const qty = qtyList[0];
  myInfo.action.entity.counterHolder.remove("SpellCounter", qty);
  return { counter: qty };
};

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "魔導戦士 ブレイカー",
    actions: [
      {
        title: "①魔力充填",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["IfNormarlSummonSucceed"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenArrivalNow(["NormalSummon"]),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (myInfo.action.entity.face === "FaceDown") {
            return false;
          }
          // ブレイカーは最大一個なので、1で上書きする。
          // 無効になっている場合乗せられないが、そもそもこの処理に入らない
          myInfo.action.entity.counterHolder.setQty("SpellCounter", 1, myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      },
      {
        title: "③マナブレイク",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        fixedTags: ["Destroy", "DestroyOnField", "DestroySpellTrapOnField"],
        canPayCosts: (myInfo, chainBlockInfos) => canPaySpellCounters(myInfo, chainBlockInfos, 1),
        payCosts: async (myInfo, chainBlockInfos, cancelable) => paySpellCounters(myInfo, chainBlockInfos, cancelable, [1]),
        ...getSingleTargetActionPartical(
          (myInfo) => myInfo.activator.duel.field.getSpellTrapsOnFieldStrictly().filter((card) => card.canBeTargetOfEffect(myInfo)),
          { message: "破壊する対象を選択。", do: "Destroy" }
        ),
        execute: async (myInfo) => {
          if (myInfo.selectedEntities.every((target) => !target.isOnFieldAsSpellTrapStrictly)) {
            return false;
          }

          await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);

          return true;
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [
      createSpellCounterCommonEffect("Monster", 1),
      createRegularNumericStateOperatorHandler(
        "②攻撃力上昇",
        "Monster",
        (source) => [source],
        (source) => {
          return [
            NumericStateOperator.createContinuous(
              "②攻撃力上昇",
              () => true,
              source,
              () => true,
              "attack",
              "wip",
              "Addition",
              (spawner, target, source) => {
                if (!spawner.isEffective) {
                  return source;
                }
                return source + spawner.counterHolder.getQty("SpellCounter") * 300;
              }
            ),
          ];
        }
      ) as ContinuousEffectBase<unknown>,
    ],
  };

  yield {
    name: "王立魔法図書館",
    actions: [
      { ...createSpellCounterChargeEffect("①", 1) },
      {
        title: "②ドロー",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        canPayCosts: (myInfo, chainBlockInfos) => canPaySpellCounters(myInfo, chainBlockInfos, 3),
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0,
        payCosts: async (myInfo, chainBlockInfos, cancelable) => paySpellCounters(myInfo, chainBlockInfos, cancelable, [3]),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [createSpellCounterCommonEffect("Monster", 3)],
  };
}

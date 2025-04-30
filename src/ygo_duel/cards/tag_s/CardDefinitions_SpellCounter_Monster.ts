import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
} from "@ygo_duel/cards/DefaultCardAction_Monster";
import type { CardDefinition } from "../CardDefinitions";
import type { CardActionDefinition, ChainBlockInfo, ChainBlockInfoBase } from "@ygo_duel/class/DuelCardAction";
import {
  createRegularNumericStateOperatorHandler,
  createRegularStatusOperatorHandler,
  type ContinuousEffectBase,
} from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { spellTrapZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import type { TCardKind } from "@ygo/class/YgoTypes";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "../DefaultCardAction";

const createSpellCounterCommonEffect = (kind: TCardKind, maxQty?: number) => {
  const title = maxQty ? `魔力充填可能(${maxQty})` : "魔力充填可能";

  return createRegularStatusOperatorHandler(
    title,
    kind,
    (source) => [source],
    () => true,
    (source) => {
      return [
        new StatusOperator(
          title,
          () => true,
          true,
          source,
          {},
          (operator, target) => operator.isSpawnedBy === target,
          (ope, wip) => {
            wip.maxCounterQty.SpellCounter = maxQty ?? Number.MAX_VALUE;
            return { maxCounterQty: wip.maxCounterQty };
          }
        ),
      ];
    }
  );
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
      validate: (myInfo) => {
        if (!myInfo.targetChainBlock) {
          return;
        }
        if (myInfo.targetChainBlock.action.playType !== "CardActivation") {
          return;
        }
        if (myInfo.targetChainBlock.action.entity.status.kind !== "Spell") {
          return;
        }
        if (!myInfo.action.entity.isEffective) {
          return;
        }
        if (myInfo.action.entity.face === "FaceDown") {
          return;
        }
        const maxQty = myInfo.action.entity.status.maxCounterQty.SpellCounter ?? 0;
        const qty = myInfo.action.entity.counterHolder.getQty("SpellCounter");
        if (qty >= maxQty) {
          return;
        }

        if (myInfo.action.entity.hadArrivedToFieldAt().totalProcSeq > myInfo.targetChainBlock.isActivatedAt.totalProcSeq) {
          return;
        }
        return [];
      },
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

export const createCardDefinitions_SpellCounter_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  result.push({
    name: "魔導戦士 ブレイカー",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      defaultNormalSummonAction,
      {
        title: "①魔力充填",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        validate: (myInfo) => {
          if (!myInfo.action.entity.hasBeenSummonedNow(["NormalSummon"])) {
            return;
          }
          return [];
        },
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["IfNormarlSummonSucceed"], prepared: undefined };
        },
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
        hasToTargetCards: true,
        canPayCosts: (myInfo, chainBlockInfos) => canPaySpellCounters(myInfo, chainBlockInfos, 1),
        validate: (myInfo) => {
          const spells = myInfo.action.entity.field
            .getCells(...spellTrapZoneCellTypes)
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.canBeTargetOfEffect(myInfo));

          if (!spells.length) {
            return;
          }

          return spells.map((spell) => spell.fieldCell);
        },
        payCosts: async (myInfo, chainBlockInfos, cancelable) => paySpellCounters(myInfo, chainBlockInfos, cancelable, [1]),
        prepare: async (myInfo, chainBlockInfos, cancelable) => {
          let target = myInfo.dest?.cardEntities[0];

          if (!target) {
            const spells = myInfo.action.entity.field
              .getCells(...spellTrapZoneCellTypes)
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card.canBeTargetOfEffect(myInfo));
            const _targets = await myInfo.action.entity.duel.view.waitSelectEntities(
              myInfo.activator,
              spells,
              1,
              (selected) => selected.length === 1,
              "破壊する対象を選択。",
              cancelable
            );

            if (!_targets || !_targets.length) {
              return;
            }

            target = _targets[0];
          }

          return { selectedEntities: [target], chainBlockTags: myInfo.action.calcChainBlockTagsForDestroy([target]), prepared: undefined };
        },
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
        () => true,
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
      ),
    ] as ContinuousEffectBase<unknown>[],
  });
  result.push({
    name: "王立魔法図書館",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      defaultNormalSummonAction,
      { ...createSpellCounterChargeEffect("①", 1) },
      {
        title: "②ドロー",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        canPayCosts: (myInfo, chainBlockInfos) => canPaySpellCounters(myInfo, chainBlockInfos, 3),
        validate: (myInfo) => {
          if (!myInfo.activator.getDeckCell().cardEntities.length) {
            return;
          }
          return [];
        },
        payCosts: async (myInfo, chainBlockInfos, cancelable) => paySpellCounters(myInfo, chainBlockInfos, cancelable, [3]),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [createSpellCounterCommonEffect("Monster", 3)] as ContinuousEffectBase<unknown>[],
  });

  return result;
};

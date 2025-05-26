import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";

import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { SystemError } from "@ygo_duel/class/Duel";
import { isNumber } from "@stk_utils/funcs/StkMathUtils";
import type { CardActionDefinition, ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { getDefaultSynchroSummonAction } from "@ygo_entity_proc/card_actions/CardActions_SynchroMonster";
import { createRegularStatusOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";

const createCatapultAction = (args: {
  qty: number;
  filter: (cost: DuelEntity) => boolean;
  calcDamage: (myInfo: ChainBlockInfoBase<unknown>, costs: DuelEntity[]) => number;
  otherActionProps: Partial<CardActionDefinition<unknown>>;
}): CardActionDefinition<unknown> => {
  return {
    title: "射出",
    isMandatory: false,
    playType: "IgnitionEffect",
    spellSpeed: "Normal",
    executableCells: monsterZoneCellTypes,
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    needsToPayRegularCost: true,
    fixedTags: ["DamageToOpponent"],
    canPayCosts: (myInfo) =>
      myInfo.activator
        .getMonstersOnField()
        .filter(args.filter)
        .some((monster) => monster.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action)),
    payCosts: async (myInfo, chainBlockInfos, cancelable) => {
      const costs = await myInfo.activator.waitSelectEntities(
        myInfo.activator
          .getMonstersOnField()
          .filter(args.filter)
          .filter((monster) => monster.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action)),
        args.qty,
        (selected) => selected.length === args.qty,
        "リリースするモンスターを選択。",
        cancelable
      );

      if (!costs) {
        return;
      }
      // フィールド上での値を参照するため、リリース前にダメージ計算をする。
      myInfo.data = args.calcDamage(myInfo, costs);

      await DuelEntityShortHands.releaseManyForTheSameReason(costs, ["Cost", "Release"], myInfo.action.entity, myInfo.activator);

      return { release: costs };
    },
    prepare: defaultPrepare,
    execute: async (myInfo) => {
      if (!isNumber(myInfo.data)) {
        throw new SystemError("値が正しくない。", myInfo, myInfo.data);
      }
      myInfo.activator.getOpponentPlayer().effectDamage(myInfo.data, myInfo);

      return true;
    },
    settle: async () => true,
    ...args.otherActionProps,
  };
};

export default function* generate(): Generator<EntityProcDefinition> {
  // MEMO 炎の魔精イグニスは処理時にダメージが決定されるため、こことは別に記述する。
  const props: {
    name: string;
    qty: number;
    filter: (cost: DuelEntity) => boolean;
    calcDamage: (myInfo: ChainBlockInfoBase<unknown>, costs: DuelEntity[]) => number;
    otherActionProps: Partial<CardActionDefinition<unknown>>;
    otherActions: CardActionDefinition<unknown>[];
    continuousEffects?: ContinuousEffectBase<unknown>[];
  }[] = [
    {
      name: "キャノン・ソルジャー",
      qty: 1,
      filter: () => true,
      calcDamage: () => 500,
      otherActionProps: {},
      otherActions: [],
    },

    {
      name: "アマゾネスの射手",
      qty: 2,
      filter: () => true,
      calcDamage: () => 1200,
      otherActionProps: {},
      otherActions: [],
    },
    {
      name: "メガキャノン・ソルジャー",
      qty: 2,
      filter: () => true,
      calcDamage: () => 1500,
      otherActionProps: {},
      otherActions: [],
    },
    {
      name: "プリーステス・オーム",
      qty: 1,
      filter: (monster) => monster.attr.includes("Dark"),
      calcDamage: () => 800,
      otherActionProps: {},
      otherActions: [],
    },
    {
      name: "対空放花",
      qty: 1,
      filter: (monster) => monster.types.includes("Insect"),
      calcDamage: () => 800,
      otherActionProps: {},
      otherActions: [],
    },
    {
      name: "人投げトロール",
      qty: 1,
      filter: (monster) => Boolean(monster.status.monsterCategories?.includes("Normal") && !monster.status.monsterCategories?.includes("Token")),
      calcDamage: () => 800,
      otherActionProps: {},
      otherActions: [],
    },
    {
      name: "墓守の大筒持ち",
      qty: 1,
      filter: (monster) => Boolean(monster.status.nameTags?.includes("墓守") && monster.nm !== "墓守の大筒持ち"),
      calcDamage: () => 700,
      otherActionProps: {},
      otherActions: [],
    },
    {
      name: "カタパルト・ウォリアー",
      qty: 1,
      filter: (monster) => Boolean(monster.status.nameTags?.includes("ジャンク")),
      calcDamage: (myInfo, costs) => costs.map((monster) => monster.origin.attack ?? 0).reduce((wip, current) => wip + current, 0),
      otherActionProps: {
        isOnlyNTimesPerTurnIfFaceup: 1,
      },
      otherActions: [getDefaultSynchroSummonAction()],
    },
    {
      name: "ダーク・ダイブ・ボンバー",
      qty: 1,
      filter: (monster) => Boolean(monster.lvl && monster.lvl > 0),
      calcDamage: (myInfo, costs) => costs.map((monster) => monster.lvl ?? 0).reduce((wip, current) => wip + current, 0) * 200,
      otherActionProps: {
        isOnlyNTimesPerTurn: 1,
        executablePeriods: ["main1"],
      },
      otherActions: [getDefaultSynchroSummonAction()],
    },
  ];

  for (const item of props) {
    yield {
      name: item.name,
      actions: [createCatapultAction(item), ...item.otherActions],
    };
  }
  yield {
    name: "トゥーン・キャノン・ソルジャー",
    actions: [createCatapultAction({ qty: 1, filter: () => true, calcDamage: () => 500, otherActionProps: {} })],
    immediatelyActions: [
      {
        title: "自壊",
        executableCells: ["MonsterZone"],
        executablePeriods: duelPeriodKeys.filter(
          (key) => key !== "b1DBeforeDmgCalc" && key !== "b2DBeforeDmgCalc" && key !== "b1DDmgCalc" && key !== "b2DDmgCalc"
        ),
        execute: async (action, triggerEntity, moveParam) => {
          if (!triggerEntity) {
            return;
          }

          if (!moveParam) {
            return;
          }
          if (triggerEntity.nm !== "トゥーン・ワールド") {
            return;
          }
          if (moveParam.movedAs.every((reason) => !reason.endsWith("Destroy"))) {
            return;
          }

          action.entity.controller.writeInfoLog(`${triggerEntity.toString()}が破壊されたため、${action.entity.toString()}は破壊される。`);
          DuelEntityShortHands.tryMarkForDestory([action.entity], { activator: action.entity.controller, action, selectedEntities: [] });
          action.entity.info.isDying = true;
          action.entity.info.causeOfDeath = ["EffectDestroy"];
          return undefined;
        },
      },
    ],
    continuousEffects: [
      createRegularStatusOperatorHandler(
        "召喚酔い",
        "Monster",
        (source) => [source],
        (source) => {
          return [
            new StatusOperator({
              title: "召喚酔い",
              validateAlive: (operator) => {
                const arrivalRecord = operator.isSpawnedBy.moveLog.latestArrivalRecord;
                if (!arrivalRecord) {
                  return false;
                }
                if (!operator.duel.clock.isSameTurn(arrivalRecord.movedAt)) {
                  return false;
                }

                return arrivalRecord.movedAs.union(["NormalSummon", "FlipSummon", "SpecialSummon"]).length > 0;
              },
              isContinuous: true,
              isSpawnedBy: source,
              actionAttr: {},
              isApplicableTo: () => true,
              statusCalculator: () => {
                return { canAttack: false };
              },
            }),
          ];
        }
      ) as ContinuousEffectBase<unknown>,
      createRegularStatusOperatorHandler(
        "直接攻撃",
        "Monster",
        (source) => [source],
        (source) => {
          return [
            new StatusOperator({
              title: "直接攻撃",
              validateAlive: () => true,
              isContinuous: true,
              isSpawnedBy: source,
              actionAttr: {},
              isApplicableTo: () => true,
              statusCalculator: (bundleOwner) => {
                if (
                  !bundleOwner.controller
                    .getEntiteisOnField()
                    .filter((card) => card.nm === "トゥーン・ワールド")
                    .some((card) => card.face === "FaceUp")
                ) {
                  return {};
                }
                if (
                  bundleOwner.controller
                    .getOpponentPlayer()
                    .getMonstersOnField()
                    .filter((card) => card.status.monsterCategories?.includes("Toon"))
                    .some((card) => card.face === "FaceUp")
                ) {
                  return {};
                }
                return { canDirectAttack: true };
              },
            }),
          ];
        }
      ) as ContinuousEffectBase<unknown>,
    ],
  };
}

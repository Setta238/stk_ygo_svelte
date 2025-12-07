import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { SystemError } from "@ygo_duel/class/Duel";
import { DuelEntity, duelEntityFaces } from "@ygo_duel/class/DuelEntity";
import type { CardActionDefinition, ChainBlockInfoBase, TActionTag } from "@ygo_duel/class/DuelEntityAction";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { monsterZoneCellTypes, type DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import { duelPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { defaultCanPayDiscardCosts, defaultPayDiscardCosts } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Discard";

import { getDefaultFusionSummonAction } from "@ygo_entity_proc/card_actions/CardActions_FusionSpell";
import { canSelfSepcialSummon } from "@ygo_entity_proc/card_actions/CardActions_Monster";

export default function* generate(): Generator<EntityProcDefinition> {
  {
    yield {
      name: "アルバスの落胤",
      actions: [
        {
          title: "融合",
          isMandatory: false,
          playType: "TriggerEffect",
          spellSpeed: "Normal",
          executableCells: ["MonsterZone"],
          executablePeriods: freeChainDuelPeriodKeys,
          executableDuelistTypes: ["Controller"],
          triggerPattern: { triggerType: "Arrival", arrivalReasons: ["NormalSummon", "SpecialSummon"] },
          canPayCosts: defaultCanPayDiscardCosts,
          payCosts: defaultPayDiscardCosts,
          ...getDefaultFusionSummonAction(
            ["ExtraDeck"],
            () => true,
            ["MonsterZone"],
            (myInfo, monster, materials) =>
              materials.includes(myInfo.action.entity) &&
              materials.every((material) => material === myInfo.action.entity || material.controller !== myInfo.activator),
            { requisitionFrom: monsterZoneCellTypes }
          ),
          settle: async () => true,
        },
      ],
    };
    {
      const getAlbionCosts = (myInfo: ChainBlockInfoBase<DuelFieldCellType>) => {
        const cellTypes: DuelFieldCellType[] = [];
        if (canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Effect"])) {
          cellTypes.push("Hand");
        }

        if (myInfo.activator.canDraw || myInfo.action.entity.cell.cellType === "Graveyard") {
          cellTypes.push("Deck");
        }

        return myInfo.activator
          .getCells(...cellTypes)
          .flatMap((cell) => cell.cardEntities)
          .filter((card) => card.nm === "アルバスの落胤" || (card.status.nameTags?.includes("烙印") && card.kind !== "Monster"))
          .filter((card) => card.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, "SendToGraveyardAsCost", myInfo.action));
      };

      yield {
        name: "黒衣竜アルビオン",
        actions: [
          {
            title: "②自己特殊召喚or自己デッキバウンス",
            isMandatory: false,
            playType: "IgnitionEffect",
            spellSpeed: "Normal",
            executableCells: ["Hand", "Graveyard"],
            executablePeriods: ["main1", "main2"],
            executableDuelistTypes: ["Controller"],
            isOnlyNTimesPerTurn: 1,
            needsToPayRegularCost: true,
            canPayCosts: (myInfo) => getAlbionCosts(myInfo).length > 0,
            payCosts: async (myInfo, chainBlockInfos, cancelable) => {
              const cost = await myInfo.activator.waitSelectEntity(getAlbionCosts(myInfo), "墓地に送るカードを選択。", cancelable);
              if (!cost) {
                return;
              }
              myInfo.data = cost.cell.cellType;

              const costInfo = { cost, cell: cost.cell };

              await cost.sendToGraveyard(["Cost"], myInfo.action.entity, myInfo.activator);

              return { sendToGraveyard: [costInfo] };
            },
            prepare: async (myInfo) => {
              const chainBlockTags: TActionTag[] = [];

              if (myInfo.data === "Hand") {
                chainBlockTags.push("SpecialSummon");
                if (myInfo.action.entity.cell.cellType === "Graveyard") {
                  chainBlockTags.push("SpecialSummonFromGraveyard");
                }
              } else if (myInfo.data === "Deck" && myInfo.action.entity.cell.cellType === "Hand") {
                chainBlockTags.push("Draw");
              }

              return { chainBlockTags };
            },
            execute: async (myInfo) => {
              if (myInfo.action.entity.wasMovedAfter(myInfo.isActivatedAt)) {
                return false;
              }
              if (myInfo.data === "Hand") {
                const monster = await myInfo.activator.summon(
                  "SpecialSummon",
                  ["Effect"],
                  myInfo.action,
                  myInfo.action.entity,
                  faceupBattlePositions,
                  myInfo.activator.getMonsterZones(),
                  [],
                  false
                );
                return Boolean(monster);
              } else if (myInfo.data === "Deck") {
                const drawFlg = myInfo.action.entity.cell.cellType === "Hand";
                await myInfo.action.entity.returnToDeck("Bottom", ["Effect"], myInfo.action.entity, myInfo.activator);
                if (drawFlg) {
                  await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
                }
                return true;
              }
              throw new SystemError(`${myInfo.action.entity}の効果を不正な方法で実行しようとした。${myInfo.data}`);
            },
            settle: async () => true,
          } as CardActionDefinition<DuelFieldCellType>,
        ],
        continuousEffects: [
          {
            title: "①名称変更",
            appliableCellTypes: ["MonsterZone", "Graveyard"],
            appliableDuelPeriodKeys: duelPeriodKeys,
            faceList: duelEntityFaces,
            canStart: (source) => source.isEffective && !source.info.isPending && !source.info.isDying,
            start: async (source): Promise<{ targets: DuelEntity[]; seqList: number[] }> => {
              const list = [
                new StatusOperator({
                  title: "①名称変更",
                  validateAlive: () => true,
                  isContinuous: false,
                  isSpawnedBy: source,
                  actionAttr: {},
                  isApplicableTo: () => true,
                  statusCalculator: () => {
                    return { name: "アルバスの落胤" };
                  },
                }),
              ];
              const targets = [source];
              console.info(`start : ${source.toString()} ⇒ ${targets.map((e) => e.toString()).join(" ")} (${list.map((item) => item.title).join(" ")})`);
              targets.forEach((target) => list.forEach(target.statusOperatorBundle.push));
              return { targets, seqList: list.map((item) => item.seq) };
            },
            finish: async (source: DuelEntity, info: { targets: DuelEntity[]; seqList: number[] }): Promise<void> => {
              info.targets.forEach((target) => info.seqList.forEach(target.statusOperatorBundle.removeItem));
            },
          },
        ],
      };
    }
  }
}

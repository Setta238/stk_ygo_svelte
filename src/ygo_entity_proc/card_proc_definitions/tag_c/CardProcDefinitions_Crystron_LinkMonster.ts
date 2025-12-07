import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { getDefaultLinkSummonAction } from "../../card_actions/CardActions_LinkMonster";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import { getPaySelfBanishCostsActionPartical } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Banish";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "水晶機巧－ハリファイバー",
    actions: [
      getDefaultLinkSummonAction((materials) => materials.length === 2 && materials.some((material) => material.status.monsterCategories?.includes("Tuner"))),
      {
        title: "①リクルート",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromDeck"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenArrivalNow(["LinkSummon"]),
        canExecute: (myInfo) => {
          const tuners = [myInfo.activator.getHandCell(), myInfo.activator.getDeckCell()]
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => (card.lvl ?? 12) < 4)
            .filter((card) => card.status.monsterCategories?.includes("Tuner"));

          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            tuners.map((monster) => {
              return {
                monster,
                cells,
                posList: ["Defense"],
              };
            }),
            [],
            false
          );
          return list.length > 0;
        },
        prepare: defaultPrepare,
        execute: async (myInfo): Promise<boolean> => {
          const tuners = [myInfo.activator.getHandCell(), myInfo.activator.getDeckCell()]
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => (card.lvl ?? 12) < 4)
            .filter((card) => card.status.monsterCategories?.includes("Tuner"));

          const cells = myInfo.activator.getMonsterZones();
          const tuner = await myInfo.activator.summonOne(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            tuners.map((monster) => {
              return {
                monster,
                cells,
                posList: ["Defense"],
              };
            }),
            [],
            false,
            false
          );
          if (!tuner) {
            throw new IllegalCancelError(myInfo);
          }
          tuner.statusOperatorBundle.push(
            new StatusOperator({
              title: "効果発動不可",
              validateAlive: (operator) => operator.duel.clock.isSameTurn(operator.isSpawnedAt),
              isContinuous: false,
              isSpawnedBy: myInfo.action.entity,
              actionAttr: myInfo.action,
              isApplicableTo: (operator, target) =>
                operator.duel.clock.isSameTurn(operator.isSpawnedAt) && target.isOnFieldAsMonsterStrictly && target.face === "FaceUp",
              statusCalculator: () => {
                return { canActivateEffect: false };
              },
            })
          );
          return true;
        },
        settle: async () => true,
      },
      {
        title: "②シンクロ召喚",
        isMandatory: false,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerChain: 1,
        ...getPaySelfBanishCostsActionPartical(),
        meetsConditions: (myInfo) => !myInfo.activator.isTurnPlayer,
        canExecute: (myInfo) => {
          const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")];
          const synchroTuners = myInfo.activator
            .getExtraDeck()
            .cardEntities.filter((monster) => monster.status.monsterCategories?.includes("Synchro"))
            .filter((monster) => monster.status.monsterCategories?.includes("Tuner"));
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SynchroSummon",
            ["SpecialSummon", "Effect"],
            myInfo.action,
            synchroTuners.map((monster) => {
              return { monster, cells, posList: faceupBattlePositions };
            }),
            [{ material: myInfo.action.entity, cell: myInfo.action.entity.cell }],
            false
          );
          return list.length > 0;
        },
        prepare: defaultPrepare,
        execute: async (myInfo): Promise<boolean> => {
          const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")];
          const synchroTuners = myInfo.activator
            .getExtraDeck()
            .cardEntities.filter((monster) => monster.status.monsterCategories?.includes("Synchro"))
            .filter((monster) => monster.status.monsterCategories?.includes("Tuner"));
          const monster = await myInfo.activator.summonOne(
            myInfo.activator,
            "SynchroSummon",
            ["SpecialSummon", "Effect"],
            myInfo.action,
            synchroTuners.map((monster) => {
              return { monster, cells, posList: faceupBattlePositions };
            }),
            [],
            false,
            false
          );

          return Boolean(monster);
        },
        settle: async () => true,
      },
    ],
  };
}

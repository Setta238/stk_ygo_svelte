import { defaultAttackAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare, defaultCanPaySelfBanishCosts, defaultPaySelfBanishCosts } from "@ygo_entity_proc/card_actions/CommonCardAction";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { getDefaultLinkSummonAction } from "../../card_actions/CommonCardAction_LinkMonster";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "水晶機巧－ハリファイバー",
    actions: [
      defaultAttackAction,
      getDefaultLinkSummonAction((materials) => materials.length === 2 && materials.some((material) => material.status.monsterCategories?.includes("Tuner"))),
      {
        title: "①リクルート",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        meetsConditions: (myInfo) => myInfo.action.entity.hasBeenSummonedNow(["LinkSummon"]),
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
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromDeck"], prepared: undefined };
        },
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
            new StatusOperator(
              "効果発動不可",
              (operator) => operator.effectOwner.duel.clock.isSameTurn(operator.isSpawnedAt),
              false,
              myInfo.action.entity,
              myInfo.action,
              (operator, target) => operator.effectOwner.duel.clock.isSameTurn(operator.isSpawnedAt) && target.isOnFieldAsMonsterStrictly,
              () => {
                return { canActivateEffect: false };
              }
            )
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
        canPayCosts: defaultCanPaySelfBanishCosts,
        meetsConditions: (myInfo) => !myInfo.activator.isTurnPlayer,
        canExecute: (myInfo) => {
          const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")];
          const syncroTuners = myInfo.activator
            .getExtraDeck()
            .cardEntities.filter((monster) => monster.status.monsterCategories?.includes("Syncro"))
            .filter((monster) => monster.status.monsterCategories?.includes("Tuner"));
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SyncroSummon",
            ["SpecialSummon", "Effect"],
            myInfo.action,
            syncroTuners.map((monster) => {
              return { monster, cells, posList: faceupBattlePositions };
            }),
            [{ material: myInfo.action.entity, cell: myInfo.action.entity.fieldCell }],
            false
          );
          return list.length > 0;
        },
        payCosts: defaultPaySelfBanishCosts,
        prepare: defaultPrepare,
        execute: async (myInfo): Promise<boolean> => {
          const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")];
          const syncroTuners = myInfo.activator
            .getExtraDeck()
            .cardEntities.filter((monster) => monster.status.monsterCategories?.includes("Syncro"))
            .filter((monster) => monster.status.monsterCategories?.includes("Tuner"));
          const monster = await myInfo.activator.summonOne(
            myInfo.activator,
            "SyncroSummon",
            ["SpecialSummon", "Effect"],
            myInfo.action,
            syncroTuners.map((monster) => {
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

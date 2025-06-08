import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { getDefaultLinkSummonAction } from "@ygo_entity_proc/card_actions/CardActions_LinkMonster";
import { createSpellCounterCommonEffect, getPaySpellCountersCostActionPartical } from "@ygo_entity_proc/card_actions/tag_s/CardActions_SpellCounter";
import { createRegularProcFilterHandler } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "神聖魔皇后セレーネ",
    actions: [
      getDefaultLinkSummonAction((materials) => materials.flatMap((material) => material.types).includes("Spellcaster") && materials.length > 1),
      {
        title: "①魔力充填",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        triggerPattern: { triggerType: "Arrival", arrivalReasons: ["LinkSummon"] },
        fixedTags: ["IfLinkSummonSucceed"],
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          if (!myInfo.action.entity.isOnFieldAsMonsterStrictly) {
            return false;
          }

          const qty = [
            ...myInfo.action.entity.field.getCardsOnFieldStrictly(),
            ...myInfo.action.entity.field.getCells("Graveyard").flatMap((cell) => cell.cardEntities),
          ]
            .filter((card) => card.face === "FaceUp")
            .filter((card) => card.kind === "Spell").length;

          myInfo.action.entity.counterHolder.setQty("SpellCounter", qty, myInfo.action.entity);
          return true;
        },
        settle: async () => true,
      },
      {
        title: "③蘇生",
        isMandatory: true,
        playType: "QuickEffect",
        spellSpeed: "Quick",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummon"],
        isOnlyNTimesIfFaceup: 1,
        ...getPaySpellCountersCostActionPartical([3]),
        canExecute: (myInfo) => {
          const spellcasters = myInfo.activator
            .getCells("Graveyard", "Hand")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.types.includes("Spellcaster"));

          const cells = myInfo.action.entity.linkArrowDests;
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            spellcasters.map((monster) => {
              return { monster, posList: ["Defense"], cells };
            }),
            [],
            false
          );
          return list.length > 0;
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const spellcasters = myInfo.activator
            .getCells("Graveyard", "Hand")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.types.includes("Spellcaster"));

          const cells = myInfo.action.entity.linkArrowDests;
          const spellcaster = await myInfo.activator.summonOne(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            spellcasters.map((lvl1) => {
              return { monster: lvl1, posList: ["Defense"], cells };
            }),
            [],
            false,
            false
          );
          return Boolean(spellcaster);
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [
      createSpellCounterCommonEffect("Monster"),
      createRegularProcFilterHandler(
        "②攻撃対象耐性",
        "Monster",
        (source) => [source],
        (source) => {
          return [
            ProcFilter.createContinuous(
              "②攻撃対象耐性",
              () => true,
              source,
              () => true,
              ["BattleTarget"],
              (bundleOwner, activator) => {
                if (bundleOwner.controller === activator) {
                  return true;
                }
                return bundleOwner.controller.getEntiteisOnField().every((card) => !card.status.nameTags?.includes("エンディミオン"));
              }
            ),
          ];
        }
      ),
    ],
  };
}

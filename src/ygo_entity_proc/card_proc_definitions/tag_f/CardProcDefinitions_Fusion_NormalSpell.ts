import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { duelFieldCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { defaultPayLifePoint, defaultPrepare } from "@ygo_entity_proc/card_actions/CommonCardAction";
import { IllegalCancelError, SystemError } from "@ygo_duel/class/Duel";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { executableDuelistTypes } from "@ygo_duel/class/DuelEntityAction";
import { getDefaultFusionSummonAction } from "@ygo_entity_proc/card_actions/CommonCardAction_FusionSpell";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "融合",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        ...getDefaultFusionSummonAction(
          ["ExtraDeck"],
          () => true,
          ["Hand", "MonsterZone", "ExtraMonsterZone"],
          () => true,
          "Graveyard"
        ),
      },
      defaultSpellTrapSetAction,
    ],
  };
  for (const item of [
    { name: "簡易融合", lvlUpperBound: 5, filter: () => true },
    { name: "簡素融合", lvlUpperBound: 6, filter: (entity: DuelEntity) => !entity.status.monsterCategories?.includes("Effect") },
  ]) {
    yield {
      name: item.name,
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          isOnlyNTimesPerTurn: 1,
          canPayCosts: (myInfo) => myInfo.activator.lp >= 1000,
          canExecute: (myInfo) => {
            const cells = myInfo.activator.getMonsterZones();
            const list = myInfo.activator.getEnableSummonList(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              myInfo.activator
                .getExtraDeck()
                .cardEntities.filter((card) => card.status.monsterCategories?.includes("Fusion"))
                .filter((card) => card.lvl && card.lvl <= item.lvlUpperBound)
                .filter(item.filter)
                .map((monster) => {
                  return { monster, posList: faceupBattlePositions, cells };
                }),
              [],
              false
            );
            return list.length > 0;
          },
          payCosts: (myInfo, chainBlockInfos) => defaultPayLifePoint(myInfo, chainBlockInfos, 1000),
          prepare: async () => {
            return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromExtraDeck"], prepared: undefined };
          },
          execute: async (myInfo) => {
            const cells = myInfo.activator.getMonsterZones();
            const summoned = await myInfo.activator.summonOne(
              myInfo.activator,
              "FusionSummon",
              ["Effect"],
              myInfo.action,
              myInfo.activator
                .getExtraDeck()
                .cardEntities.filter((card) => card.status.monsterCategories?.includes("Fusion"))
                .filter((card) => card.lvl && card.lvl <= item.lvlUpperBound)
                .filter(item.filter)
                .map((monster) => {
                  return { monster, posList: faceupBattlePositions, cells };
                }),
              [],
              false,
              false
            );

            if (!summoned) {
              return false;
            }

            summoned.statusOperatorBundle.push(
              new StatusOperator(
                "攻撃不可",
                () => true,
                false,
                myInfo.action.entity,
                myInfo.action,
                (ope, target) => target.face === "FaceUp" && target.isOnFieldAsMonsterStrictly,
                (ope, wip) => {
                  return { ...wip, canAttack: false };
                }
              )
            );
            summoned.counterHolder.setSelfDestructionFlg(myInfo.action.entity);
            summoned.info.isRebornable = !summoned.origin.monsterCategories?.includes("RegularSpecialSummonOnly");
            return true;
          },
          settle: async () => true,
        },
        defaultSpellTrapSetAction,
        {
          title: "自壊",
          isMandatory: true,
          playType: "LingeringEffect",
          spellSpeed: "Normal",
          executableCells: duelFieldCellTypes,
          executablePeriods: ["end"],
          executableDuelistTypes,
          canExecute: (myInfo) =>
            myInfo.action.entity.field.getMonstersOnFieldStrictly().some((card) => card.counterHolder.getSelfDestructionFlg(myInfo.action.entity)),
          prepare: defaultPrepare,
          execute: async (myInfo) => {
            const cards = myInfo.action.entity.field
              .getMonstersOnFieldStrictly()
              .filter((card) => card.counterHolder.getSelfDestructionFlg(myInfo.action.entity));
            if (!cards.length) {
              throw new SystemError("想定されない状態", myInfo);
            }

            let card = cards[0];

            if (cards.length > 1) {
              const selected = await myInfo.activator.waitSelectEntity(cards, "自壊させるカードを選択。", false);
              if (!selected) {
                throw new IllegalCancelError(myInfo);
              }

              card = selected;
            }

            await DuelEntityShortHands.tryDestroy([card], myInfo);

            return true;
          },
          settle: async () => true,
        },
      ],
    };
  }
}

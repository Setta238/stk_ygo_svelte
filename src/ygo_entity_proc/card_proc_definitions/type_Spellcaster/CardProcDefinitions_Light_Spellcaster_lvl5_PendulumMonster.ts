import {
  canSelfSepcialSummon,
  defaultRuleSummonExecute,
  defaultRuleSummonPrepare,
  getDestsForSelfSpecialSummon,
} from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultContinuousSpellCardActivateAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { createRegularStatusOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "アンカモフライト",
    actions: [
      defaultContinuousSpellCardActivateAction,
      {
        title: "特殊召喚",
        isMandatory: false,
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["ExtraDeck"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerDuel: 1,
        meetsConditions: (myInfo) => myInfo.activator.getExtraDeck().cardEntities.every((card) => card.nm === "アンカモフライト"),
        canExecute: (myInfo) => myInfo.action.entity.face === "FaceUp" && canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Rule"]),
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Rule"]),
        prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "SpecialSummon", ["SpecialSummon", "Rule"], faceupBattlePositions),
        execute: defaultRuleSummonExecute,
        settle: async () => true,
      },
      {
        title: "①ドロー",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        priorityForNPC: 20,
        isOnlyNTimesPerTurn: 1,
        fixedTags: ["DestroySpellTrapOnField", "Draw"],
        meetsConditions: (myInfo) => myInfo.activator.getExtraDeck().cardEntities.every((card) => card.nm === "アンカモフライト"),
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.length > 0 && myInfo.activator.canDraw,
        prepare: async () => {
          return { selectedEntities: [] };
        },
        execute: async (myInfo) => {
          const destroyed = await DuelEntityShortHands.tryDestroy([myInfo.action.entity], myInfo);

          if (!destroyed.length) {
            return false;
          }

          // この破壊は時の任意効果のトリガーにならない。
          myInfo.action.entity.field.duel.clock.incrementProcSeq();
          await myInfo.activator.draw(1, myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      },
    ],
    summonFilter: (filter, filterTarget, effectOwner, summoner, movedAs, actDefAttr, monster, materialInfos, posList, cells) => {
      const ok = { posList, cells };
      const notAllowed = { posList: [], cells: [] };
      if (monster !== filterTarget) {
        //素材に使用するのは自由
        return ok;
      }
      if (actDefAttr.entity === filterTarget) {
        //自身の効果であればOK
        return ok;
      }
      //それ以外は禁止
      return notAllowed;
    },
    continuousEffects: [
      createRegularStatusOperatorHandler(
        "除外予定",
        "Monster",
        (source) => [source],
        (source) => [
          new StatusOperator(
            "除外予定",
            () => true,
            true,
            source,
            {},
            (ope, target) => target.isOnFieldAsMonsterStrictly && target.face === "FaceUp",
            () => {
              return { willBeBanished: true };
            }
          ),
        ]
      ) as ContinuousEffectBase<unknown>,
    ],
  };
}

import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  getDefaultAccelSynchroACtion,
} from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultSynchroSummonAction } from "../../card_actions/CommonCardAction_SynchroMonster";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { SystemError } from "@ygo_duel/class/Duel";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "シューティング・ライザー・ドラゴン",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      getDefaultSynchroSummonAction(),
      {
        title: "①墓地送り",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        canExecute: (myInfo) =>
          myInfo.action.entity.hasBeenSummonedNow(["SynchroSummon"]) &&
          myInfo.activator.getDeckCell().cardEntities.some((card) => (card.lvl ?? 12) < (myInfo.action.entity.lvl ?? 0)),
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SendToGraveyardFromDeck", "IfSpecialSummonSucceed"], prepared: undefined };
        },
        execute: async (myInfo): Promise<boolean> => {
          const choices = myInfo.activator.getDeckCell().cardEntities.filter((card) => (card.lvl ?? 12) < (myInfo.action.entity.lvl ?? 0));
          if (choices.length === 0) {
            return false;
          }
          const monster = await myInfo.activator.waitSelectEntity(choices, "墓地に送るモンスターを選択", false);

          if (!monster) {
            throw new SystemError("想定されない状況", myInfo);
          }

          await monster.sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);

          const deffLevel = monster.lvl ?? 0;

          myInfo.action.entity.numericOprsBundle.push(
            NumericStateOperator.createLingeringAddition(
              "レベル減少",
              () => true,
              myInfo.action.entity,
              myInfo.action,
              "level",
              (spawner: DuelEntity, monster: DuelEntity, current: number) => current - deffLevel
            )
          );
          return true;
        },
        settle: async () => true,
      },
      getDefaultAccelSynchroACtion({ title: "②シンクロ召喚", isOnlyNTimesPerChain: 1 }),
    ],
  };
}

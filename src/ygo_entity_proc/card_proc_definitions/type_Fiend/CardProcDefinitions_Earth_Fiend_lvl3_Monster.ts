import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { IllegalCancelError } from "@ygo_duel/class/Duel";
import { createBroadRegularProcFilterHandler } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "魔サイの戦士",
    actions: [
      {
        title: "②墓地送り",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        triggerPattern: { triggerType: "Departure" },
        fixedTags: ["SendToGraveyardFromDeck"],
        isOnlyNTimesPerTurn: 1,
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.types.includes("Fiend")),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities.filter((card) => card.types.includes("Fiend"));

          if (!cards.length) {
            return false;
          }

          const fiend = await myInfo.activator.waitSelectEntity(cards, "墓地に送るモンスターを選択。", false);

          if (!fiend) {
            throw new IllegalCancelError(myInfo);
          }

          await fiend.sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);

          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [
      createBroadRegularProcFilterHandler("①破壊耐性付与", "Monster", (source) => [
        ProcFilter.createContinuous(
          "①破壊耐性付与",
          () => true,
          source,
          (ope, target) => target.types.includes("Fiend") && target.face === "FaceUp" && target.isOnFieldAsMonsterStrictly && target.nm !== "魔サイの戦士",
          ["EffectDestroy", "BattleDestroy"],
          () => false
        ),
      ]),
    ],
  };
}

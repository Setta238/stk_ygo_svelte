import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultContinuousSpellCardActivateAction } from "../../card_actions/CommonCardAction_Spell";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CommonCardAction";
import { IllegalCancelError } from "@ygo_duel/class/Duel";

export default function* generate(): Generator<EntityProcDefinition> {
  for (const name of ["メタルフォーゼ・ゴルドライバー", "メタルフォーゼ・シルバード", "メタルフォーゼ・スティエレン", "メタルフォーゼ・ヴォルフレイム"]) {
    yield {
      name,
      actions: [
        defaultContinuousSpellCardActivateAction,
        {
          title: "①サーチ",
          isMandatory: false,
          playType: "IgnitionEffect",
          spellSpeed: "Normal",
          executableCells: ["SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          isOnlyNTimesPerTurnIfFaceup: 1,
          fixedTags: ["Destroy"],
          ...getSingleTargetActionPartical(
            (myInfo) => {
              let targetables = myInfo.activator
                .getEntiteisOnField()
                .filter((card) => card.face === "FaceUp")
                .filter((card) => card.canBeTargetOfEffect(myInfo))
                .filter((card) => card !== myInfo.action.entity);

              if (!myInfo.activator.getAvailableSpellTrapZones.length) {
                targetables = targetables.filter((card) => card.fieldCell.cellType === "SpellAndTrapZone");
              }

              return targetables;
            },
            {
              message: "破壊するカードを選択。",
              destoryTargets: true,
              canExecute: (myInfo) =>
                myInfo.activator.canSet &&
                myInfo.activator
                  .getDeckCell()
                  .cardEntities.filter((card) => card.kind === "Spell" || card.kind === "Trap")
                  .some((card) => card.status.nameTags?.includes("メタルフォーゼ")),
            }
          ),
          execute: async (myInfo) => {
            const destroyed = await DuelEntityShortHands.tryDestroy(myInfo.selectedEntities, myInfo);

            if (!destroyed.length) {
              return false;
            }

            if (!myInfo.activator.canSet) {
              return false;
            }

            const cells = myInfo.activator.getAvailableSpellTrapZones();

            if (!cells.length) {
              return false;
            }

            const choices = myInfo.activator
              .getDeckCell()
              .cardEntities.filter((card) => card.kind === "Spell" || card.kind === "Trap")
              .filter((card) => card.status.nameTags?.includes("メタルフォーゼ"));

            if (!choices.length) {
              return false;
            }

            const spellTrap = await myInfo.activator.waitSelectEntity(choices, "セットするカードを選択。", false);

            if (!spellTrap) {
              return false;
            }

            const cell = await myInfo.activator.duel.view.waitSelectDestination(myInfo.activator, spellTrap, cells, "セットする先を選択", "セット", false);
            if (!cell) {
              throw new IllegalCancelError("セット先選択", myInfo);
            }

            await spellTrap.setAsSpellTrap(cell, spellTrap.kind, ["Effect"], myInfo.action.entity, myInfo.activator);

            return true;
          },
          settle: async () => true,
        },
      ],
    };
  }
}

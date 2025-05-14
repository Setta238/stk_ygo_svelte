import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
} from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { duelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { DuelEnd, SystemError } from "@ygo_duel/class/Duel";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "封印されしエクゾディア",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultNormalSummonAction,
      defaultFlipSummonAction,
      {
        title: "封印開放",
        isMandatory: true,
        playType: "Exodia",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        executablePeriods: duelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        canExecute: (myInfo) => {
          const exodiaParts = myInfo.activator
            .getHandCell()
            .cardEntities.filter((card) => card.origin.nameTags?.includes("封印されし"))
            .map((card) => card.origin.name)
            .getDistinct();
          return exodiaParts.length === 5;
        },
        prepare: async (myInfo) => {
          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(
            myInfo.activator.duel.field.getCardsOnFieldStrictly(),
            ["Rule"],
            myInfo.action.entity,
            myInfo.activator
          );
          return { selectedEntities: [], chainBlockTags: [], prepared: undefined, nextChainBlockFilter: () => false };
        },
        execute: async (myInfo) => {
          const isDraw =
            myInfo.activator
              .getOpponentPlayer()
              .getHandCell()
              .cardEntities.filter((card) => card.origin.nameTags?.includes("封印されし"))
              .map((card) => card.origin.name)
              .getDistinct().length === 5;
          const items = [
            { name: "封印されし者の左足", column: 4 },
            { name: "封印されし者の右足", column: 2 },
            { name: "封印されし者の左腕", column: 5 },
            { name: "封印されし者の右腕", column: 1 },
            { name: "封印されしエクゾディア", column: 3 },
          ];

          for (const item of items) {
            const exodiaParts = [
              myInfo.activator.getHandCell().cardEntities.find((card) => card.origin.name === item.name),
              myInfo.activator
                .getOpponentPlayer()
                .getHandCell()
                .cardEntities.find((card) => card.origin.name === item.name),
            ].filter((part): part is DuelEntity => part !== undefined);

            if (!exodiaParts.length) {
              throw new SystemError("想定されない状態", myInfo.activator.getHandCell().cardEntities, item.name);
            }
            await DuelEntity.moveMany(
              exodiaParts.map((part) => [
                part,
                part.controller.getMonsterZones().find((cell) => cell.column === (part.controller.seat === "Above" ? 6 - item.column : item.column)) ??
                  part.controller.getFieldZone(),
                "Monster",
                "FaceUp",
                "Vertical",
                "Top",
                ["Rule"],
                undefined,
                undefined,
                undefined,
              ])
            );
          }
          if (isDraw) {
            throw new DuelEnd(undefined, `お互いが、${myInfo.action.entity.toString()}の特殊勝利条件を同時に満たした。`);
          }
          throw new DuelEnd(myInfo.activator, `${myInfo.action.entity.toString()}の特殊勝利条件を満たした。`);
        },
        settle: async () => true,
      },
    ],
  };
}

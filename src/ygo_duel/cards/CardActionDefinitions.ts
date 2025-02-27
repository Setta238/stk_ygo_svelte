import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { DuelEntity, type TDuelCauseReason, type CardActionBase } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalAttackSummonAction,
  defaultNormalSetSummonAction,
} from "@ygo_duel/functions/DefaultCardAction";

export const createCardActionDefinitions = (): { name: string; actions: CardActionBase<unknown>[] }[] => {
  const validate_サイバー・ドラゴン = (entity: DuelEntity): DuelFieldCell[] | undefined => {
    const monsters = entity.field.getMonstersOnField();
    if (monsters.length == 0 || monsters.some((m) => m.controller === entity.controller)) {
      return undefined;
    }

    const emptyCells = entity.field.getEmptyMonsterZones(entity.controller);
    return emptyCells.length > 0 ? emptyCells : undefined;
  };
  const execute_サイバー・ドラゴン = async (entity: DuelEntity, pos: TBattlePosition, cell?: DuelFieldCell): Promise<boolean> => {
    const causedBy: TDuelCauseReason[] = ["Rule", "SpecialSummon"];

    const emptyCells = entity.field.getEmptyMonsterZones(entity.controller);
    await entity.field.summon(entity, [pos], cell ? [cell] : emptyCells, "SpecialSummon", causedBy, entity, undefined, true);
    entity.controller.specialSummonCount++;
    return true;
  };

  const def_サイバー・ドラゴン = {
    name: "サイバー・ドラゴン",
    actions: [
      defaultNormalAttackSummonAction,
      defaultNormalSetSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "特殊召喚（攻撃）",
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        validate: validate_サイバー・ドラゴン,
        prepare: async () => {},
        execute: async (entity: DuelEntity, cell?: DuelFieldCell): Promise<boolean> => {
          execute_サイバー・ドラゴン(entity, "Attack", cell);
          return true;
        },
      },
      {
        title: "特殊召喚（守備）",
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        validate: validate_サイバー・ドラゴン,
        prepare: async () => {},
        execute: async (entity: DuelEntity, cell?: DuelFieldCell): Promise<boolean> => {
          execute_サイバー・ドラゴン(entity, "Defense", cell);
          return true;
        },
      },
    ] as CardActionBase<unknown>[],
  };

  return [def_サイバー・ドラゴン];
};

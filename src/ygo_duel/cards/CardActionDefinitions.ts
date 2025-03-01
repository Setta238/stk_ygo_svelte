import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { DuelEntity, type TDuelCauseReason, type CardActionBase } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalAttackSummonAction,
  defaultNormalSetSummonAction,
  defaultSpellTrapSetAction,
} from "@ygo_duel/functions/DefaultCardAction";

export const createCardActionDefinitions = (): { name: string; actions: CardActionBase<unknown>[] }[] => {
  const result: { name: string; actions: CardActionBase<unknown>[] }[] = [];

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

  result.push(def_サイバー・ドラゴン);

  const validate_強欲な壺 = (entity: DuelEntity): DuelFieldCell[] | undefined => {
    if (entity.fieldCell.cellType === "FieldSpellZone" && entity.face === "FaceDown") {
      return [];
    }

    const availableCells = entity.field.getAvailableSpellTrapZones(entity.controller);
    return availableCells.length > 0 ? availableCells : undefined;
  };
  const prepare_強欲な壺 = async (entity: DuelEntity, _pos?: TBattlePosition, cell?: DuelFieldCell): Promise<boolean> => {
    if (entity.fieldCell.cellType === "FieldSpellZone" && entity.face === "FaceDown") {
      entity.setNonFieldPosition("FaceUp", true);
      return true;
    }
    if (entity.fieldCell.cellType === "Hand") {
      const causedBy: TDuelCauseReason[] = ["SpellTrapActivate"];
      const availableCells = cell ? [cell] : entity.field.getAvailableSpellTrapZones(entity.controller);
      await entity.field.activateSpellTrapFromHand(entity, availableCells, causedBy, entity, entity.controller, true);
      return true;
    }
    return false;
  };
  const execute_強欲な壺 = async (entity: DuelEntity): Promise<boolean> => {
    entity.isDying = true;
    await entity.field.draw(entity.controller, 2, entity);
    return true;
  };
  const def_強欲な壺 = {
    name: "強欲な壺",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: validate_強欲な壺,
        prepare: async (entity: DuelEntity, cell?: DuelFieldCell) => {
          return await prepare_強欲な壺(entity, undefined, cell);
        },
        execute: async (entity: DuelEntity) => {
          return await execute_強欲な壺(entity);
        },
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_強欲な壺);

  return result;
};

import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { DuelEntity, type CardActionBase } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalAttackSummonAction,
  defaultNormalSetSummonAction,
  getDefaultSyncroSummonAction,
} from "@ygo_duel/functions/DefaultCardAction";

export type CardDefinition = {
  name: string;
  actions: CardActionBase<unknown>[];
};

export const createCardDefinitions_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const validate_サイバー・ドラゴン = (entity: DuelEntity): DuelFieldCell[] | undefined => {
    const monsters = entity.field.getMonstersOnField();
    if (monsters.length == 0 || monsters.some((m) => m.controller === entity.controller)) {
      return undefined;
    }

    const emptyCells = entity.controller.getAvailableMonsterZones();
    return emptyCells.length > 0 ? emptyCells : undefined;
  };
  const execute_サイバー・ドラゴン = async (entity: DuelEntity, pos: TBattlePosition, cell?: DuelFieldCell): Promise<boolean> => {
    const emptyCells = entity.controller.getAvailableMonsterZones();
    await entity.field.summon(entity, [pos], cell ? [cell] : emptyCells, "SpecialSummon", ["Rule"], entity, undefined, true);
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
        prepare: async () => true,
        execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell): Promise<boolean> => {
          await execute_サイバー・ドラゴン(entity, "Attack", cell);
          return true;
        },
      },
      {
        title: "特殊召喚（守備）",
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        validate: validate_サイバー・ドラゴン,
        prepare: async () => true,
        execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell): Promise<boolean> => {
          await execute_サイバー・ドラゴン(entity, "Defense", cell);
          return true;
        },
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_サイバー・ドラゴン);

  const def_大地の騎士ガイアナイト = {
    name: "大地の騎士ガイアナイト",
    actions: [defaultAttackAction, defaultBattlePotisionChangeAction, ...getDefaultSyncroSummonAction()] as CardActionBase<unknown>[],
  };
  result.push(def_大地の騎士ガイアナイト);
  result.push({ ...def_大地の騎士ガイアナイト, name: "スクラップ・デスデーモン" });

  const def_ナチュル・ガオドレイク = {
    name: "ナチュル・ガオドレイク",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      ...getDefaultSyncroSummonAction(
        (tuners) => tuners.length === 1 && tuners.every((tuner) => tuner.attr.some((a) => a === "Earth")),
        (nonTuners) => nonTuners.length > 0 && nonTuners.every((nonTuner) => nonTuner.attr.some((a) => a === "Earth"))
      ),
    ] as CardActionBase<unknown>[],
  };
  result.push(def_ナチュル・ガオドレイク);

  console.log(result);

  return result;
};

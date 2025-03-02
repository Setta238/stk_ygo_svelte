import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { DuelEntity, type CardActionBase } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalAttackSummonAction,
  defaultNormalSetSummonAction,
  defaultSpellTrapPrepare,
  defaultSpellTrapSetAction,
  defaultSpellTrapValidate,
} from "@ygo_duel/functions/DefaultCardAction";

export const createCardActionDefinitions = (): { name: string; actions: CardActionBase<unknown>[] }[] => {
  const result: { name: string; actions: CardActionBase<unknown>[] }[] = [];

  const validate_サイバー・ドラゴン = (entity: DuelEntity): DuelFieldCell[] | undefined => {
    const monsters = entity.field.getMonstersOnField();
    if (monsters.length == 0 || monsters.some((m) => m.controller === entity.controller)) {
      return undefined;
    }

    const emptyCells = entity.controller.getEmptyMonsterZones();
    return emptyCells.length > 0 ? emptyCells : undefined;
  };
  const execute_サイバー・ドラゴン = async (entity: DuelEntity, pos: TBattlePosition, cell?: DuelFieldCell): Promise<boolean> => {
    const emptyCells = entity.controller.getEmptyMonsterZones();
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
        prepare: async () => {},
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
        prepare: async () => {},
        execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell): Promise<boolean> => {
          await execute_サイバー・ドラゴン(entity, "Defense", cell);
          return true;
        },
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_サイバー・ドラゴン);

  const def_強欲な壺 = {
    name: "強欲な壺",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: defaultSpellTrapValidate,
        prepare: async (entity: DuelEntity, cell?: DuelFieldCell) => {
          entity.isDying = true;
          return await defaultSpellTrapPrepare(entity, undefined, cell);
        },
        execute: async (entity: DuelEntity, activater: Duelist) => {
          await entity.field.draw(activater, 2, entity);
          return true;
        },
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_強欲な壺);
  const def_天使の施し = {
    name: "天使の施し",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: defaultSpellTrapValidate,
        prepare: async (entity: DuelEntity, cell?: DuelFieldCell) => {
          entity.isDying = true;
          return await defaultSpellTrapPrepare(entity, undefined, cell);
        },
        execute: async (entity: DuelEntity, activater: Duelist) => {
          await entity.field.draw(entity.controller, 3, entity);
          await entity.field.discard(activater, 2, ["Effect", "Discard"], entity);
          return true;
        },
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_天使の施し);
  const def_成金ゴブリン = {
    name: "成金ゴブリン",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        validate: defaultSpellTrapValidate,
        prepare: async (entity: DuelEntity, cell?: DuelFieldCell) => {
          entity.isDying = true;
          return await defaultSpellTrapPrepare(entity, undefined, cell);
        },
        execute: async (entity: DuelEntity, activater: Duelist) => {
          await entity.field.draw(entity.controller, 1, entity);
          // このドローは時の任意効果のトリガーにならない。
          entity.field.duel.clock.incrementProcSeq();
          activater.getOpponentPlayer().heal(1000, entity);
          return true;
        },
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_成金ゴブリン);
  const def_おろかな埋葬 = {
    name: "おろかな埋葬",
    actions: [
      {
        title: "発動",
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        // デッキにモンスターが一枚以上必要。
        validate: (entity: DuelEntity) =>
          defaultSpellTrapValidate(entity, (e) => e.controller.getDeckCell().cardEntities.some((card) => card.status.kind === "Monster")),
        prepare: async (entity: DuelEntity, cell?: DuelFieldCell) => {
          entity.isDying = true;
          return await defaultSpellTrapPrepare(entity, undefined, cell);
        },
        execute: async (entity: DuelEntity, activater: Duelist) => {
          if (activater.getDeckCell().cardEntities.every((card) => card.status.kind !== "Monster")) {
            return false;
          }
          const target = await entity.field.duel.view.waitSelectEntities(
            activater,
            activater.getDeckCell().cardEntities.filter((entity) => entity.status.kind === "Monster"),
            1,
            (list) => list.length === 1,
            "墓地に送るモンスターを選択",
            false
          );
          for (const monster of target ?? []) {
            await entity.field.sendGraveyardMany([monster], ["Effect"], entity);
          }
          return true;
        },
      },
      defaultSpellTrapSetAction,
    ] as CardActionBase<unknown>[],
  };

  result.push(def_おろかな埋葬);

  return result;
};

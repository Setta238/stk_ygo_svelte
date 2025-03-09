import type { CardActionBase } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultNormalSummonAction,
  getDefaultSyncroSummonAction,
} from "@ygo_duel/functions/DefaultCardAction";

export type CardDefinition = {
  name: string;
  actions: CardActionBase<unknown>[];
};

export const createCardDefinitions_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];

  const def_サイバー・ドラゴン = {
    name: "サイバー・ドラゴン",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "特殊召喚",
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          const monsters = entity.field.getMonstersOnField();
          if (monsters.length == 0 || monsters.some((m) => m.controller === entity.controller)) {
            return undefined;
          }

          const emptyCells = entity.controller.getAvailableMonsterZones();
          return emptyCells.length > 0 ? emptyCells : undefined;
        },
        prepare: async () => true,
        execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell): Promise<boolean> => {
          const emptyCells = entity.controller.getAvailableMonsterZones();
          await entity.field.summon(entity, ["Attack", "Defense"], cell ? [cell] : emptyCells, "SpecialSummon", ["Rule"], entity, undefined, true);
          entity.controller.specialSummonCount++;
          return true;
        },
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_サイバー・ドラゴン);

  const def_ディアボリックガイ = {
    name: "Ｄ－ＨＥＲＯ ディアボリックガイ",
    actions: [
      defaultNormalSummonAction,
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "リクルート",
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          if (entity.controller.getDeckCell().cardEntities.filter((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ").length === 0) {
            return;
          }

          const availableCells = entity.controller.getAvailableMonsterZones();
          return availableCells.length > 0 ? [] : undefined;
        },
        prepare: async (entity: DuelEntity) => {
          console.log(entity);
          await entity.banish(["Cost"], entity);
        },
        execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell): Promise<boolean> => {
          const availableCells = entity.controller.getAvailableMonsterZones();
          if (!availableCells.length) {
            return false;
          }
          const newOne = entity.controller.getDeckCell().cardEntities.find((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ");
          if (!newOne) {
            return false;
          }
          await entity.field.summon(newOne, ["Attack", "Defense"], cell ? [cell] : availableCells, "SpecialSummon", ["Effect"], entity);
          entity.controller.specialSummonCount++;
          return true;
        },
      },
    ] as CardActionBase<unknown>[],
  };

  result.push(def_ディアボリックガイ);
  const def_大地の騎士ガイアナイト = {
    name: "大地の騎士ガイアナイト",
    actions: [defaultAttackAction, defaultBattlePotisionChangeAction, getDefaultSyncroSummonAction()] as CardActionBase<unknown>[],
  };
  result.push(def_大地の騎士ガイアナイト);
  result.push({ ...def_大地の騎士ガイアナイト, name: "スクラップ・デスデーモン" });

  const def_ナチュル・ガオドレイク = {
    name: "ナチュル・ガオドレイク",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      getDefaultSyncroSummonAction(
        (tuners) => tuners.length === 1 && tuners.every((tuner) => tuner.attr.some((a) => a === "Earth")),
        (nonTuners) => nonTuners.length > 0 && nonTuners.every((nonTuner) => nonTuner.attr.some((a) => a === "Earth"))
      ),
    ] as CardActionBase<unknown>[],
  };
  result.push(def_ナチュル・ガオドレイク);

  console.log(result);

  const def_ライトロード・ビーストウォルフ = {
    name: "ライトロード・ビースト ウォルフ",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      {
        title: "自己再生",
        playType: "TriggerMandatoryEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
          if (entity.movedAt.chainSeq !== entity.field.duel.clock.chainSeq - 1) {
            return;
          }
          if (entity.movedFrom?.cellType !== "Deck") {
            return;
          }
          const availableCells = entity.controller.getAvailableMonsterZones();
          console.log(availableCells);
          return availableCells.length > 0 ? [] : undefined;
        },
        prepare: async (entity: DuelEntity) => {
          console.log(entity);
          return true;
        },
        execute: async (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell): Promise<boolean> => {
          const availableCells = entity.controller.getAvailableMonsterZones();
          if (!availableCells.length) {
            return false;
          }
          if (entity.fieldCell.cellType !== "Graveyard" && entity.fieldCell.cellType !== "Banished") {
            return false;
          }
          if (entity.face === "FaceDown") {
            return false;
          }
          await entity.field.summon(entity, ["Attack", "Defense"], cell ? [cell] : availableCells, "SpecialSummon", ["Effect"], entity);
          entity.controller.specialSummonCount++;
          return true;
        },
      },
    ] as CardActionBase<unknown>[],
  };
  result.push(def_ライトロード・ビーストウォルフ);

  console.log(result);

  return result;
};

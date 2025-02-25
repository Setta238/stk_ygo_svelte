import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { DuelEntity, type TDuelCauseReason, type CardActionBase } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
export const defaultNormalSummonValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  // 召喚権を使い切っていたら通常召喚不可。
  if (entity.controller.normalSummonCount >= entity.controller.maxNormalSummonCount) {
    return;
  }

  // レベルがないモンスターは通常召喚不可
  if (!entity.status.level) {
    return;
  }
  const emptyCells = entity.field.getEmptyMonsterZones(entity.controller);

  // 4以下は空きセルが必要
  if (entity.status.level < 5) {
    return emptyCells.length > 0 ? emptyCells : undefined;
  }

  const releasableMonsters = entity.field.getReleasableMonsters(entity.controller);

  // リリース可能なモンスターが不足する場合、アドバンス召喚不可
  if (releasableMonsters.length < (entity.status.level < 7 ? 1 : 2)) {
    return undefined;
  }

  return [];

  // TODO : クロス・ソウルの「しなければならない」の制限の考慮。エクストラモンスターゾーンまたは相手モンスターゾーンにしかリリース可能なモンスターがいない場合、空きが必要。
  // if (emptyCells.length > 0 || releasableMonsters.filter((m) => m.controller === entity.controller && m.fieldCell.cellType === "MonsterZone")) {
  //   return true;
  // }
};

export const defaultNormalSummonExecute = async (entity: DuelEntity, pos: TBattlePosition, cell?: DuelFieldCell): Promise<boolean> => {
  if (!entity.status.level) {
    return false;
  }
  const causedBy: TDuelCauseReason[] = ["Rule", "NormalSummon"];

  let cancelable = true;

  if (entity.status.level > 4) {
    const releasableMonsters = entity.field.getReleasableMonsters(entity.controller);
    const exZoneMonsters = entity.field.getExtraMonsterZones(entity.controller);
    const qty = entity.status.level < 7 ? 1 : 2;

    if (exZoneMonsters.length >= qty) {
      releasableMonsters.filter((monster) => monster.fieldCell.cellType !== "ExtraMonsterZone");
    }
    console.log("hoge");

    const cost = await entity.field.release(
      entity.controller,
      entity.field.getReleasableMonsters(entity.controller),
      qty,
      "Cost",
      ["AdvanceSummonRelease", "Rule"],
      entity,
      cancelable
    );

    //リリースしなければキャンセル。
    if (!cost) {
      return false;
    }
    // リリース後はキャンセル不可
    cancelable = false;

    causedBy.push("AdvanceSummon");
  }

  const emptyCells = entity.field.getEmptyMonsterZones(entity.controller);
  await entity.field.summon(entity, [pos], cell ? [cell] : emptyCells, causedBy, entity, undefined, cancelable);
  entity.controller.normalSummonCount++;
  return true;
};

export const defaultAttackValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  if (entity.status.attackCount > 0 || entity.battlePotion !== "Attack" || !entity.controller.isTurnPlayer) {
    return undefined;
  }

  const enemies = entity.field.getAttackTargetMonsters(entity.controller);

  if (enemies.length > 0) {
    return enemies.map((e) => e.fieldCell);
  }

  return [entity.field.getHandCell(entity.field.duel.getOpponentPlayer(entity.controller))];
};
export const defaultAttackExecute = async (entity: DuelEntity, pos?: TBattlePosition, cell?: DuelFieldCell): Promise<boolean> => {
  if (entity.status.attackCount > 0 || entity.battlePotion !== "Attack") {
    return false;
  }
  if (cell?.targetForAttack) {
    entity.field.duel.declareAnAttack(entity, cell?.targetForAttack);
    return true;
  }

  const targets = entity.field.getAttackTargetMonsters(entity.controller);
  const opponent = entity.controller.duel.getOpponentPlayer(entity.controller).entity;
  if (targets.length === 0) {
    entity.field.duel.declareAnAttack(entity, opponent);
    return true;
  }
  if (targets.length === 1) {
    entity.field.duel.declareAnAttack(entity, targets[0]);
    return true;
  }

  const target = await entity.field.duel.view.waitSelectEntities(entity.controller, targets, 1, (list) => list.length === 1, "攻撃対象を選択。", true);

  if (!target) {
    return false;
  }

  entity.field.duel.declareAnAttack(entity, target[0]);

  return true;
};
export const defaultBattlePotisionChangeValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  if (entity.status.battlePotisionChangeCount > 0 || entity.status.attackCount > 0 || !entity.controller.isTurnPlayer) {
    return undefined;
  }
  return [];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const defaultBattlePotisionChangeExecute = async (entity: DuelEntity, _pos?: TBattlePosition, _cell?: DuelFieldCell): Promise<boolean> => {
  if (entity.status.battlePotisionChangeCount > 0 || !entity.controller.isTurnPlayer) {
    return false;
  }

  entity.setBattlePosition(entity.battlePotion === "Attack" ? "Defense" : "Attack");
  entity.status.battlePotisionChangeCount++;
  return true;
};

export const defaultNormalAttackSummonAction: CardActionBase<void> = {
  title: "召喚",
  playType: "NormalSummon",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  validate: defaultNormalSummonValidate,
  prepare: async () => {},
  execute: (entity, cell) => defaultNormalSummonExecute(entity, "Attack", cell),
};
export const defaultNormalSetSummonAction: CardActionBase<void> = {
  title: "セット",
  playType: "NormalSummon",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  validate: defaultNormalSummonValidate,
  prepare: async () => {},
  execute: (entity, cell) => defaultNormalSummonExecute(entity, "Set", cell),
};
export const defaultAttackAction: CardActionBase<void> = {
  title: "攻撃宣言",
  playType: "Battle",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  validate: defaultAttackValidate,
  prepare: async () => {},
  execute: (entity, cell) => defaultAttackExecute(entity, undefined, cell),
};

export const defaultBattlePotisionChangeAction: CardActionBase<void> = {
  title: "表示形式変更",
  playType: "ChangeBattlePosition",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  validate: defaultBattlePotisionChangeValidate,
  prepare: async () => {},
  execute: (entity, cell) => defaultBattlePotisionChangeExecute(entity, undefined, cell),
};

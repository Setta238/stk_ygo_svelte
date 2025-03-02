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

  const availableCells = entity.controller.getAvailableMonsterZones();

  // 4以下は空きセルが必要
  if (entity.status.level < 5) {
    return availableCells.length > 0 ? availableCells : undefined;
  }

  const releasableMonsters = entity.controller.getReleasableMonsters();

  // リリース可能なモンスターが不足する場合、アドバンス召喚不可
  // リリース処理が先にくるので、選択可能なセルはなし
  return releasableMonsters.length < (entity.status.level < 7 ? 1 : 2) ? undefined : [];

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
    const releasableMonsters = entity.controller.getReleasableMonsters();
    const exZoneMonsters = entity.controller.getExtraMonsterZones();
    const qty = entity.status.level < 7 ? 1 : 2;

    if (exZoneMonsters.length >= qty) {
      releasableMonsters.filter((monster) => monster.fieldCell.cellType !== "ExtraMonsterZone");
    }
    const cost = await entity.field.release(
      entity.controller,
      entity.controller.getReleasableMonsters(),
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

  const availableCells = entity.controller.getAvailableMonsterZones();
  await entity.field.summon(entity, [pos], cell ? [cell] : availableCells, "NormalSummon", causedBy, entity, undefined, cancelable);
  entity.controller.normalSummonCount++;
  return true;
};

export const defaultAttackValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  if (entity.status.attackCount > 0 || entity.battlePotion !== "Attack" || !entity.controller.isTurnPlayer) {
    return undefined;
  }

  const enemies = entity.controller.getAttackTargetMonsters();

  if (enemies.length > 0) {
    return enemies.map((e) => e.fieldCell);
  }

  return [entity.controller.getOpponentPlayer().getHandCell()];
};
export const defaultAttackExecute = async (entity: DuelEntity, pos?: TBattlePosition, cell?: DuelFieldCell): Promise<boolean> => {
  if (entity.status.attackCount > 0 || entity.battlePotion !== "Attack") {
    return false;
  }
  if (cell?.targetForAttack) {
    entity.field.duel.declareAnAttack(entity, cell?.targetForAttack);
    return true;
  }

  const targets = entity.controller.getAttackTargetMonsters();
  const opponent = entity.controller.getOpponentPlayer().entity;
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

export const defaultBattlePotisionChangeExecute = async (entity: DuelEntity): Promise<boolean> => {
  if (entity.status.battlePotisionChangeCount > 0 || !entity.controller.isTurnPlayer) {
    return false;
  }

  entity.setBattlePosition(entity.battlePotion === "Attack" ? "Defense" : "Attack");
  entity.status.battlePotisionChangeCount++;
  return true;
};

export const defaultSpellTrapSetValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  if (entity.status.spellCategory === "Field") {
    const fieldZone = entity.controller.getFieldZone();
    return fieldZone.isAvailable ? [fieldZone] : undefined;
  }
  const availableCells = entity.controller.getAvailableSpellTrapZones();
  return availableCells.length > 0 ? availableCells : undefined;
};
export const defaultSpellTrapSetExecute = async (entity: DuelEntity, _pos?: TBattlePosition, cell?: DuelFieldCell): Promise<boolean> => {
  const availableCells = entity.controller.getAvailableSpellTrapZones();
  if (availableCells.length === 0) {
    return false;
  }

  await entity.field.setSpellTrap(entity, cell ? [cell] : availableCells, undefined, entity.controller, true);
  return true;
};
export const defaultSpellTrapValidate = (entity: DuelEntity, aotherCondition: (entity: DuelEntity) => boolean = () => true): DuelFieldCell[] | undefined => {
  if (entity.fieldCell.cellType === "FieldSpellZone" && entity.face === "FaceDown") {
    return [];
  }

  const availableCells = entity.controller.getAvailableSpellTrapZones();
  return availableCells.length > 0 && aotherCondition(entity) ? availableCells : undefined;
};
export const defaultSpellTrapPrepare = async (entity: DuelEntity, _pos?: TBattlePosition, cell?: DuelFieldCell): Promise<boolean> => {
  if (entity.fieldCell.cellType === "FieldSpellZone" && entity.face === "FaceDown") {
    entity.setNonFieldPosition("FaceUp", true);
    return true;
  }
  if (entity.fieldCell.cellType === "Hand") {
    const causedBy: TDuelCauseReason[] = ["SpellTrapActivate"];
    const availableCells = cell ? [cell] : entity.controller.getAvailableSpellTrapZones();
    await entity.field.activateSpellTrapFromHand(entity, availableCells, causedBy, entity, entity.controller, true);
    return true;
  }
  return false;
};

export const defaultNormalAttackSummonAction: CardActionBase<void> = {
  title: "召喚",
  playType: "NormalSummon",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  validate: defaultNormalSummonValidate,
  prepare: async () => {},
  execute: (entity, activater, cell) => defaultNormalSummonExecute(entity, "Attack", cell),
};
export const defaultNormalSetSummonAction: CardActionBase<void> = {
  title: "セット",
  playType: "NormalSummon",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  validate: defaultNormalSummonValidate,
  prepare: async () => {},
  execute: (entity, activater, cell) => defaultNormalSummonExecute(entity, "Set", cell),
};
export const defaultAttackAction: CardActionBase<void> = {
  title: "攻撃宣言",
  playType: "Battle",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  validate: defaultAttackValidate,
  prepare: async () => {},
  execute: (entity, activater, cell) => defaultAttackExecute(entity, undefined, cell),
};

export const defaultBattlePotisionChangeAction: CardActionBase<void> = {
  title: "表示形式変更",
  playType: "ChangeBattlePosition",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  validate: defaultBattlePotisionChangeValidate,
  prepare: async () => {},
  execute: (entity) => defaultBattlePotisionChangeExecute(entity),
};

export const defaultSpellTrapSetAction: CardActionBase<void> = {
  title: "セット",
  playType: "SpellTrapSet",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  validate: defaultSpellTrapSetValidate,
  prepare: async () => {},
  execute: (entity, activater, cell) => defaultSpellTrapSetExecute(entity, "Set", cell),
};

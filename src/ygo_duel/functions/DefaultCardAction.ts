import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { DuelEntity, type TDuelCauseReason, type CardActionBase } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
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

export const defaultNormalSummonPrepare = async (
  entity: DuelEntity,
  pos: TBattlePosition,
  cell?: DuelFieldCell,
  cancelable?: boolean
): Promise<DuelEntity[] | undefined> => {
  if (!entity.status.level) {
    return [];
  }
  if (entity.status.level < 5) {
    return [];
  }

  let _cancelable = cancelable;
  const releasableMonsters = entity.controller.getReleasableMonsters();
  const exZoneMonsters = entity.controller.getExtraMonsterZones();
  const qty = entity.status.level < 7 ? 1 : 2;

  if (exZoneMonsters.length >= qty) {
    releasableMonsters.filter((monster) => monster.fieldCell.cellType !== "ExtraMonsterZone");
  }
  const materials = await entity.field.release(
    entity.controller,
    entity.controller.getReleasableMonsters(),
    qty,
    "Cost",
    ["AdvanceSummonRelease", "Rule"],
    entity,
    _cancelable
  );

  //リリースしなければキャンセル。
  if (!materials) {
    return;
  }
  // リリース後はキャンセル不可
  _cancelable = false;

  return materials;
};

export const defaultNormalSummonExecute = async (entity: DuelEntity, pos: TBattlePosition, cell?: DuelFieldCell, prepared?: DuelEntity[]): Promise<boolean> => {
  if (!entity.status.level) {
    return false;
  }
  const causedBy: TDuelCauseReason[] = ["Rule", "NormalSummon"];

  if (prepared && prepared.length > 0) {
    entity.materials.reset(...prepared);
    causedBy.push("AdvanceSummon");
  }

  const availableCells = entity.controller.getAvailableMonsterZones();
  await entity.field.summon(entity, [pos], cell ? [cell] : availableCells, "NormalSummon", causedBy, entity, undefined, prepared && prepared.length === 0);
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

export const defaultSyncroMaterialsValidator = (
  entity: DuelEntity,
  materials: DuelEntity[],
  tunersValidator: (tuners: DuelEntity[]) => boolean,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean
): boolean => {
  // シンクロ素材にできないモンスターが存在する場合、不可
  if (materials.some((material) => !material.status.canBeSyncroMaterial)) {
    return false;
  }
  // シンクロ素材に手札またはフィールド以外のモンスターが存在する場合、不可
  if (
    materials.some(
      (material) =>
        material.fieldCell.cellType !== "Hand" && material.fieldCell.cellType !== "MonsterZone" && material.fieldCell.cellType !== "ExtraMonsterZone"
    )
  ) {
    return false;
  }
  // 手札シンクロを許可するシンクロ素材がいない場合、手札をシンクロ素材とすることは不可
  if (materials.some((material) => material.fieldCell.cellType === "Hand") && materials.every((material) => !material.status.allowHandSyncro)) {
    return false;
  }
  // レベルを持たないモンスターが存在する場合、不可
  if (materials.some((material) => !material.lvl)) {
    return false;
  }

  //レベルが合わない場合、不可
  //TODO https://yugioh-wiki.net/index.php?%A1%D4%A5%C1%A5%E5%A1%BC%A5%CB%A5%F3%A5%B0%A1%A6%A5%B5%A5%DD%A1%BC%A5%BF%A1%BC%A1%D5#list
  if (materials.map((material) => material.lvl ?? 0).reduce((sum, lvl) => sum + lvl, 0) !== (entity.origin.level ?? -1)) {
    return false;
  }

  // チューナー側の条件チェック
  // TODO https://yugioh-wiki.net/index.php?%A1%D4%B8%B8%B1%C6%B2%A6%20%A5%CF%A5%A4%A5%C9%A1%A6%A5%E9%A5%A4%A5%C9%A1%D5#list
  if (!tunersValidator(materials.filter((cost) => cost.status.monsterCategories?.some((cat) => cat === "Tuner")))) {
    return false;
  }

  // 非チューナー側の条件チェック
  if (!nonTunersValidator(materials.filter((cost) => cost.status.monsterCategories?.every((cat) => cat !== "Tuner")))) {
    return false;
  }

  return true;
};

export const defaultSyncroSummonValidate = (
  entity: DuelEntity,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): DuelFieldCell[] | undefined => {
  let materials = [
    ...entity.controller.getMonstersOnField().filter((card) => card.face === "FaceUp"),
    ...entity.controller.getHandCell().entities.filter((card) => card.origin.kind === "Monster"),
  ].filter((m) => m.status.canBeSyncroMaterial);

  if (materials.every((m) => !m.status.allowHandSyncro)) {
    materials = entity.controller.getMonstersOnField();
  }

  if (materials.length < 2) {
    return;
  }

  for (const pattern of materials.getAllOnOffPattern()) {
    if (defaultSyncroMaterialsValidator(entity, pattern, tunersValidator, nonTunersValidator)) {
      return [];
    }
  }
};
export const defaultSyncroSummonPrepare = async (
  entity: DuelEntity,
  pos: TBattlePosition,
  cell?: DuelFieldCell,
  cancelable?: boolean,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): Promise<DuelEntity[] | undefined> => {
  let _materials = [
    ...entity.controller.getMonstersOnField(),
    ...entity.controller.getHandCell().entities.filter((card) => card.origin.kind === "Monster"),
  ].filter((m) => m.status.canBeSyncroMaterial);

  if (_materials.every((m) => !m.status.allowHandSyncro)) {
    _materials = entity.controller.getMonstersOnField();
  }

  if (_materials.length < 2) {
    return;
  }

  console.log(_materials);
  const materials = await entity.field.payMonstersForSpecialSummonCost(
    entity.controller,
    _materials,
    -1,
    (selected) => defaultSyncroMaterialsValidator(entity, selected, tunersValidator, nonTunersValidator),
    ["SyncroMaterial", "Rule"],
    entity,
    cancelable
  );

  console.log(materials);

  //墓地へ送らなければキャンセル。
  if (!materials) {
    return;
  }

  return materials;
};
export const defaultSyncroSummonExecute = async (
  entity: DuelEntity,
  activater: Duelist,
  pos: TBattlePosition,
  cell?: DuelFieldCell,
  prepared?: DuelEntity[]
): Promise<boolean> => {
  if (prepared && prepared.length > 0) {
    entity.materials.reset(...prepared);
  }

  const availableCells = [...activater.getAvailableMonsterZones(), ...activater.getAvailableExtraZones()];
  await entity.field.summon(
    entity,
    [pos],
    cell ? [cell] : availableCells,
    "SyncroSummon",
    ["Rule", "SpecialSummon"],
    entity,
    undefined,
    prepared && prepared.length === 0
  );

  activater.specialSummonCount++;

  return true;
};

export const defaultNormalAttackSummonAction: CardActionBase<DuelEntity[]> = {
  title: "召喚",
  playType: "NormalSummon",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  validate: defaultNormalSummonValidate,
  prepare: (entity, cell, cancelable) => defaultNormalSummonPrepare(entity, "Attack", cell, cancelable),
  execute: (entity, activater, cell, prepared) => defaultNormalSummonExecute(entity, "Attack", cell, prepared),
};
export const defaultNormalSetSummonAction: CardActionBase<DuelEntity[]> = {
  title: "セット",
  playType: "NormalSummon",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  validate: defaultNormalSummonValidate,
  prepare: (entity, cell, cancelable) => defaultNormalSummonPrepare(entity, "Set", cell, cancelable),
  execute: (entity, activater, cell, prepared) => defaultNormalSummonExecute(entity, "Set", cell, prepared),
};
export const defaultAttackAction: CardActionBase<boolean> = {
  title: "攻撃宣言",
  playType: "Battle",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  validate: defaultAttackValidate,
  prepare: async () => true,
  execute: (entity, activater, cell) => defaultAttackExecute(entity, undefined, cell),
};

export const defaultBattlePotisionChangeAction: CardActionBase<boolean> = {
  title: "表示形式変更",
  playType: "ChangeBattlePosition",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  validate: defaultBattlePotisionChangeValidate,
  prepare: async () => true,
  execute: (entity) => defaultBattlePotisionChangeExecute(entity),
};

export const defaultSpellTrapSetAction: CardActionBase<boolean> = {
  title: "セット",
  playType: "SpellTrapSet",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  validate: defaultSpellTrapSetValidate,
  prepare: async () => true,
  execute: (entity, activater, cell) => defaultSpellTrapSetExecute(entity, "Set", cell),
};

export const getDefaultSyncroSummonAction = (
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): CardActionBase<DuelEntity[]>[] => {
  return [
    {
      title: "シンクロ召喚（攻撃）",
      playType: "SpecialSummon",
      spellSpeed: "Normal",
      executableCells: ["ExtraDeck"],
      validate: (entity: DuelEntity) => defaultSyncroSummonValidate(entity, tunersValidator, nonTunersValidator),
      prepare: (entity: DuelEntity, cell?: DuelFieldCell, cancelable?: boolean) =>
        defaultSyncroSummonPrepare(entity, "Attack", cell, cancelable, tunersValidator, nonTunersValidator),
      execute: (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell, prepared?: DuelEntity[]): Promise<boolean> =>
        defaultSyncroSummonExecute(entity, activater, "Attack", cell, prepared),
    },
    {
      title: "シンクロ召喚（守備）",
      playType: "SpecialSummon",
      spellSpeed: "Normal",
      executableCells: ["ExtraDeck"],
      validate: (entity: DuelEntity) => defaultSyncroSummonValidate(entity, tunersValidator, nonTunersValidator),
      prepare: (entity: DuelEntity, cell?: DuelFieldCell, cancelable?: boolean) =>
        defaultSyncroSummonPrepare(entity, "Defense", cell, cancelable, tunersValidator, nonTunersValidator),
      execute: (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell, prepared?: DuelEntity[]): Promise<boolean> =>
        defaultSyncroSummonExecute(entity, activater, "Defense", cell, prepared),
    },
  ];
};

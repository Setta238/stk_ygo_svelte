import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { type CardActionBase, type ChainBlockInfo, type ChainBlockInfoBase } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity, posToSummonPos, type TDestoryCauseReason, type TDuelCauseReason } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell, DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import { type Duelist } from "@ygo_duel/class/Duelist";
export type SummonPrepared = { dest: DuelFieldCell; pos: TBattlePosition; materials: DuelEntity[] };
export const defaultPrepare = async () => {
  return { selectedEntities: [], chainBlockTags: [], prepared: undefined };
};

export const defaultNormalSummonValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  // 召喚権を使い切っていたら通常召喚不可。
  if (entity.controller.info.ruleNormalSummonCount >= entity.controller.info.maxRuleNormalSummonCount) {
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
  cell: DuelFieldCell | undefined,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean
): Promise<ChainBlockInfoBase<SummonPrepared> | undefined> => {
  if (!entity.status.level) {
    return;
  }
  let availableCells = cell ? [cell] : entity.controller.getAvailableMonsterZones();
  if (availableCells.length === 0) {
    return;
  }
  let _cancelable = cancelable;
  let materials: DuelEntity[] = [];
  if (entity.status.level > 4) {
    const releasableMonsters = entity.controller.getReleasableMonsters();
    const exZoneMonsters = entity.controller.getExtraMonsterZones();
    const qty = entity.status.level < 7 ? 1 : 2;

    if (exZoneMonsters.length >= qty) {
      releasableMonsters.filter((monster) => monster.fieldCell.cellType !== "ExtraMonsterZone");
    }
    const _materials = await entity.field.release(
      entity.controller,
      entity.controller.getReleasableMonsters(),
      qty,
      "Cost",
      ["AdvanceSummonRelease", "Rule"],
      entity,
      _cancelable
    );

    //リリースしなければキャンセル。
    if (!_materials) {
      return;
    }

    materials = _materials;

    // リリース後はキャンセル不可
    _cancelable = false;
    availableCells = entity.controller.getAvailableMonsterZones();
  }
  let pos: TBattlePosition = (entity.atk ?? 0) > 0 && (entity.atk ?? 0) >= (entity.def ?? 0) ? "Attack" : "Set";
  let dest: DuelFieldCell = availableCells.randomPick(1)[0];

  if (entity.controller.duelistType !== "NPC") {
    const res = await entity.field.duel.view.waitSelectSummonDest(entity, availableCells, ["Attack", "Set"], _cancelable);
    if (!res) {
      return;
    }

    dest = res.dest;
    pos = res.pos;
  }
  return { selectedEntities: [], chainBlockTags: [], prepared: { dest, pos, materials } };
};

export const defaultNormalSummonExecute = async (entity: DuelEntity, activater: Duelist, myInfo: ChainBlockInfo<SummonPrepared>): Promise<boolean> => {
  const movedAs: TDuelCauseReason[] = ["Rule", "NormalSummon"];

  if (myInfo.prepared.materials.length > 0) {
    entity.info.materials.reset(...myInfo.prepared.materials);
    movedAs.push("AdvanceSummon");
  }

  await entity.summon(myInfo.prepared.dest, myInfo.prepared.pos, "NormalSummon", movedAs, entity, activater);

  activater.info.ruleNormalSummonCount++;
  activater.info.ruleNormalSummonCountQty++;
  return true;
};

export const defaultRuleSpecialSummonPrepare = async (
  entity: DuelEntity,
  cell: DuelFieldCell | undefined,
  posList: TBattlePosition[],
  materials: DuelEntity[],
  cancelable: boolean
): Promise<ChainBlockInfoBase<SummonPrepared> | undefined> => {
  const availableCells = cell ? [cell] : entity.controller.getAvailableMonsterZones();
  if (availableCells.length === 0) {
    return;
  }
  let pos: TBattlePosition = posList.randomPick(1)[0];
  let dest: DuelFieldCell = availableCells.randomPick(1)[0];

  if (posList.length) {
    if (posList.includes("Attack")) {
      pos = (entity.atk ?? 0) > 0 && (entity.atk ?? 0) >= (entity.def ?? 0) ? "Attack" : posList.filter((p) => p !== "Attack").randomPick(1)[0];
    }
  }

  if (entity.controller.duelistType !== "NPC") {
    const res = await entity.field.duel.view.waitSelectSummonDest(entity, availableCells, posList, cancelable);
    if (!res) {
      return;
    }

    dest = res.dest;
    pos = res.pos;
  }
  return { selectedEntities: [], chainBlockTags: [], prepared: { dest, pos, materials } };
};

export const defaultRuleSpecialSummonExecute = async (entity: DuelEntity, activater: Duelist, myInfo: ChainBlockInfo<SummonPrepared>): Promise<boolean> => {
  const movedAs: TDuelCauseReason[] = ["Rule", "SpecialSummon"];

  await entity.summon(myInfo.prepared.dest, myInfo.prepared.pos, "SpecialSummon", movedAs, entity, activater);
  entity.info.materials = myInfo.prepared.materials;
  activater.info.specialSummonCount++;
  activater.info.specialSummonCountQty++;
  return true;
};

export const defaultNormalSummonAction: CardActionBase<SummonPrepared> = {
  title: "通常召喚",
  playType: "NormalSummon",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  validate: defaultNormalSummonValidate,
  prepare: defaultNormalSummonPrepare,
  execute: defaultNormalSummonExecute,
  settle: async () => true,
};

export const defaultDeclareAttackValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  if (entity.info.attackCount > 0 || entity.battlePotion !== "Attack" || !entity.controller.isTurnPlayer) {
    return undefined;
  }

  const enemies = entity.controller.getAttackTargetMonsters();

  if (enemies.length > 0) {
    return enemies.map((e) => e.fieldCell);
  }

  return [entity.controller.getOpponentPlayer().getHandCell()];
};
export const defaultDeclareAttackPrepare = async (
  entity: DuelEntity,
  cell: DuelFieldCell | undefined
): Promise<ChainBlockInfoBase<{ target: DuelEntity }> | undefined> => {
  if (entity.info.attackCount > 0 || entity.battlePotion !== "Attack") {
    return;
  }
  if (cell?.targetForAttack) {
    return { selectedEntities: [], chainBlockTags: [], prepared: { target: cell.targetForAttack } };
  }

  const choices = entity.controller.getAttackTargetMonsters();
  const opponent = entity.controller.getOpponentPlayer().entity;

  if (choices.length === 0) {
    return { selectedEntities: [], chainBlockTags: [], prepared: { target: opponent } };
  }
  if (choices.length === 1) {
    return { selectedEntities: [], chainBlockTags: [], prepared: { target: choices[0] } };
  }

  const targets = await entity.field.duel.view.waitSelectEntities(entity.controller, choices, 1, (list) => list.length === 1, "攻撃対象を選択。", true);

  if (!targets) {
    return;
  }

  return { selectedEntities: [], chainBlockTags: [], prepared: { target: targets[0] } };
};
export const defaultDeclareAttackExecute = async (entity: DuelEntity, activater: Duelist, myInfo: ChainBlockInfo<{ target: DuelEntity }>): Promise<boolean> => {
  entity.field.duel.declareAnAttack(entity, myInfo.prepared.target);

  return true;
};

export const defaultAttackAction: CardActionBase<{ target: DuelEntity }> = {
  title: "攻撃宣言",
  playType: "Battle",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  validate: defaultDeclareAttackValidate,
  prepare: defaultDeclareAttackPrepare,
  execute: defaultDeclareAttackExecute,
  settle: async () => true,
};

export const defaultBattlePotisionChangeValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  if (entity.info.battlePotisionChangeCount > 0 || entity.info.attackCount > 0 || !entity.controller.isTurnPlayer) {
    return undefined;
  }
  return [];
};

export const defaultBattlePotisionChangeExecute = async (entity: DuelEntity): Promise<boolean> => {
  if (entity.info.battlePotisionChangeCount > 0 || !entity.controller.isTurnPlayer) {
    return false;
  }

  entity.setBattlePosition(entity.battlePotion === "Attack" ? "Defense" : "Attack");
  entity.info.battlePotisionChangeCount++;
  return true;
};

export const defaultBattlePotisionChangeAction: CardActionBase<undefined> = {
  title: "表示形式変更",
  playType: "ChangeBattlePosition",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  validate: defaultBattlePotisionChangeValidate,
  prepare: defaultPrepare,
  execute: defaultBattlePotisionChangeExecute,
  settle: async () => true,
};

export const defaultSyncroMaterialsValidator = (
  entity: DuelEntity,
  materials: DuelEntity[],
  tunersValidator: (tuners: DuelEntity[]) => boolean,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean
): boolean => {
  if (!entity.origin.level) {
    return false;
  }
  // レベルを持たないモンスターが存在する場合、不可
  if (materials.some((material) => !material.lvl)) {
    return false;
  }

  //レベルが合わない場合、不可
  //TODO https://yugioh-wiki.net/index.php?%A1%D4%A5%C1%A5%E5%A1%BC%A5%CB%A5%F3%A5%B0%A1%A6%A5%B5%A5%DD%A1%BC%A5%BF%A1%BC%A1%D5#list
  if (materials.map((material) => material.lvl ?? 0).reduce((sum, lvl) => sum + lvl, 0) !== entity.origin.level) {
    return false;
  }

  // シンクロモンスター側から見たチューナー側の条件チェック
  // TODO https://yugioh-wiki.net/index.php?%A1%D4%B8%B8%B1%C6%B2%A6%20%A5%CF%A5%A4%A5%C9%A1%A6%A5%E9%A5%A4%A5%C9%A1%D5#list
  if (!tunersValidator(materials.filter((cost) => cost.status.monsterCategories?.some((cat) => cat === "Tuner")))) {
    return false;
  }

  // シンクロモンスター側から見た非チューナー側の条件チェック
  if (!nonTunersValidator(materials.filter((cost) => cost.status.monsterCategories?.every((cat) => cat !== "Tuner")))) {
    return false;
  }

  // 素材側から見た全体の条件チェック（デブリ・ドラゴンなど）
  if (!materials.every((m) => m.canBeSyncroMaterials(entity, materials))) {
    return false;
  }

  // プレイヤーの特殊召喚可能チェック
  if (!entity.owner.canSummon(entity.owner, entity, ["SpecialSummon", "SyncroSummon"], ["AttackSummon", "DefenseSummon"], materials)) {
    return false;
  }

  return true;
};

const getEnableSyncroSummonPatterns = (
  entity: DuelEntity,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): DuelEntity[][] => {
  // 手札と場から全てのシンクロ素材にできるモンスターを収集する。
  let materials = [
    ...entity.controller.getMonstersOnField().filter((card) => card.battlePotion !== "Set"),
    ...entity.controller.getHandCell().entities.filter((card) => card.origin.kind === "Monster"),
  ];

  // 手札シンクロを許容するカードがない場合、手札のカードを排除する。
  if (materials.every((m) => !m.status.allowHandSyncro)) {
    materials = materials.filter((m) => m.fieldCell.isPlayFieldCell);
  }

  // 二枚以下はシンクロ召喚不可
  if (materials.length < 2) {
    return [];
  }

  //全パターンを試し、シンクロ召喚可能なパターンを全て列挙する。
  return materials.getAllOnOffPattern().filter((pattern) => defaultSyncroMaterialsValidator(entity, pattern, tunersValidator, nonTunersValidator));
};
export const defaultSyncroSummonValidate = (
  entity: DuelEntity,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): DuelFieldCell[] | undefined => {
  return getEnableSyncroSummonPatterns(entity, tunersValidator, nonTunersValidator).length > 0 ? [] : undefined;
};
export const defaultSyncroSummonPrepare = async (
  entity: DuelEntity,
  cell?: DuelFieldCell,
  cancelable?: boolean,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): Promise<ChainBlockInfoBase<SummonPrepared> | undefined> => {
  const patterns = getEnableSyncroSummonPatterns(entity, tunersValidator, nonTunersValidator);

  let materials: DuelEntity[];

  if (patterns.length === 1) {
    for (const material of patterns[0]) {
      await material.sendToGraveyard(["SyncroMaterial", "Rule", "SpecialSummonMaterial"], entity, entity.controller);
    }
    materials = patterns[0];
    entity.field.duel.log.info(`シンクロ素材として、${materials.map((m) => "《" + m.nm + "》").join("、")}を墓地に送り――`, entity.controller);
  } else {
    const choices = patterns.flatMap((p) => p).getDistinct();
    const _materials = await entity.field.sendToGraveyard(
      "シンクロ素材とするモンスターを選択",
      entity.controller,
      choices,
      -1,
      (selected) => defaultSyncroMaterialsValidator(entity, selected, tunersValidator, nonTunersValidator),
      ["SyncroMaterial", "Rule", "SpecialSummonMaterial"],
      entity,
      cancelable
    );
    //墓地へ送らなければキャンセル。
    if (!_materials) {
      return;
    }
    materials = _materials;
    entity.field.duel.log.info(`シンクロ素材として、${materials.map((m) => "《" + m.nm + "》").join("")}を墓地に送り――`, entity.controller);
  }

  console.log(materials);

  const availableCells = [...entity.controller.getAvailableMonsterZones(), ...entity.controller.getAvailableExtraZones()];
  let pos: TBattlePosition = (entity.atk ?? 0) > 0 && (entity.atk ?? 0) >= (entity.def ?? 0) ? "Attack" : "Defense";
  let dest: DuelFieldCell = availableCells.randomPick(1)[0];

  if (entity.controller.duelistType !== "NPC") {
    const res = await entity.field.duel.view.waitSelectSummonDest(entity, availableCells, ["Attack", "Defense"], false);
    if (!res) {
      return;
    }

    dest = res.dest;
    pos = res.pos;
  }
  return { selectedEntities: [], chainBlockTags: [], prepared: { dest, pos, materials } };
};
export const defaultSyncroSummonExecute = async (entity: DuelEntity, activater: Duelist, myInfo: ChainBlockInfo<SummonPrepared>): Promise<boolean> => {
  const movedAs: TDuelCauseReason[] = ["Rule", "SpecialSummon", "SyncroSummon"];

  await entity.summon(myInfo.prepared.dest, myInfo.prepared.pos, "SyncroSummon", movedAs, entity, activater);

  entity.info.isRebornable = true;
  return true;
};

export const getDefalutRecruiterAction = (
  monsterFilter: (monsters: DuelEntity) => boolean,
  qtyList: number[],
  posList: TBattlePosition[],
  destoryTypes: TDestoryCauseReason[],
  executableCells: DuelFieldCellType[]
): CardActionBase<undefined> => {
  return {
    title: "①リクルート",
    playType: "TriggerEffect",
    spellSpeed: "Normal",
    executableCells: executableCells,
    canExecuteOnDamageStep: true,
    validate: (entity: DuelEntity): DuelFieldCell[] | undefined => {
      if (entity.wasMovedAs.union(destoryTypes).length === 0) {
        return;
      }
      if (!entity.isMoveAtPreviousChain) {
        return;
      }
      const monsters = entity.controller.getDeckCell().cardEntities.filter(monsterFilter);
      if (monsters.length === 0) {
        return;
      }

      if (monsters.every((monster) => !entity.controller.canSummon(entity.controller, entity, ["SpecialSummon"], posList.map(posToSummonPos), [monster]))) {
        return;
      }
      return [];
    },
    prepare: async () => {
      return { selectedEntities: [], chainBlockTags: ["SpecialSummonFromDeck"], prepared: undefined };
    },
    execute: async (entity: DuelEntity, activater: Duelist): Promise<boolean> => {
      const monsters = entity.controller.getDeckCell().cardEntities.filter(monsterFilter);
      if (monsters.length === 0) {
        return false;
      }
      const selectedList = await entity.field.duel.view.waitSelectEntities(
        activater,
        monsters,
        qtyList.length === 1 ? qtyList[0] : -1,
        (list) => qtyList.includes(list.length),
        "特殊召喚するモンスターを選択",
        false
      );

      if (!selectedList) {
        throw new Error("illegal state");
      }

      for (const monster of selectedList) {
        await activater.summon(monster, posList, activater.getAvailableMonsterZones(), "SpecialSummon", ["Effect"], entity, false);
      }

      activater.shuffleDeck();

      return true;
    },
    settle: async () => true,
  };
};

export const getDefaultSyncroSummonAction = (
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): CardActionBase<SummonPrepared> => {
  return {
    title: "シンクロ召喚",
    playType: "SpecialSummon",
    spellSpeed: "Normal",
    executableCells: ["ExtraDeck"],
    validate: (entity: DuelEntity) => defaultSyncroSummonValidate(entity, tunersValidator, nonTunersValidator),
    prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultSyncroSummonPrepare(entity, cell, cancelable, tunersValidator, nonTunersValidator),
    execute: defaultSyncroSummonExecute,
    settle: async () => true,
  };
};

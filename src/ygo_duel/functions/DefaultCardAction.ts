import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { CardAction, CardActionBase, ChainBlockInfo, ChainBlockInfoBase, TChainBlockType } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity, type TDestoryCauseReason, type TDuelCauseReason } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell, DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
export type SummonPrepared = { dest: DuelFieldCell; pos: TBattlePosition; materials: DuelEntity[] };
export const defaultPrepare = async () => {
  return { selectedEntities: [], chainBlockTags: [], prepared: undefined };
};

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

  entity.controller.normalSummonCount++;
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
  entity.controller.specialSummonCount++;
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

/**
 * 発動とまとめた方が操作しやすいが、チェーン可不可が異なるので別のままにする。
 * @param entity
 * @returns
 */
export const defaultSpellTrapSetValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  if (entity.status.spellCategory === "Field") {
    const fieldZone = entity.controller.getFieldZone();
    return fieldZone.isAvailable ? [fieldZone] : undefined;
  }
  const availableCells = entity.controller.getAvailableSpellTrapZones();
  return availableCells.length > 0 ? availableCells : undefined;
};
export const defaultSpellTrapSetPrepare = async (
  entity: DuelEntity,
  cell: DuelFieldCell | undefined
): Promise<ChainBlockInfoBase<{ dest: DuelFieldCell }> | undefined> => {
  if (cell) {
    return { selectedEntities: [], chainBlockTags: [], prepared: { dest: cell } };
  }

  const availableCells = entity.controller.getAvailableSpellTrapZones();

  if (availableCells.length === 0) {
    return;
  }

  let targetCell = availableCells[0];

  if (availableCells.length > 1) {
    if (entity.controller.duelistType !== "NPC") {
      const dammyActions = [DuelEntity.createDammyAction(entity, "セット", availableCells)];
      const actionPromise = entity.field.duel.view.modalController.selectAction(entity.field.duel.view, {
        title: "カードをセット先へドラッグ",
        actions: dammyActions as CardAction<unknown>[],
        cancelable: true,
      });
      const responsePromise = entity.field.duel.view.waitSubAction(
        entity.controller,
        dammyActions as CardAction<unknown>[],
        "カードをセット先へドラッグ",
        true
      );

      const action = await Promise.any([actionPromise, responsePromise.then((res) => res.action)]);

      if (!action) {
        return;
      }
      targetCell = action.cell || targetCell;
    }
  }
  return { selectedEntities: [], chainBlockTags: [], prepared: { dest: targetCell } };
};

export const defaultSpellTrapSetExecute = async (entity: DuelEntity, activater: Duelist, myInfo: ChainBlockInfo<{ dest: DuelFieldCell }>): Promise<boolean> => {
  await entity.setAsSpellTrap(myInfo.prepared.dest, ["Rule", "SpellTrapSet"], entity, activater);

  activater.duel.log.info(`${entity.status.name}をセット（${"SpellTrapSet"}）。`, activater);

  entity.info.isSettingSickness = entity.status.kind === "Trap" || entity.status.spellCategory === "QuickPlay";
  return true;
};

export const defaultSpellTrapSetAction: CardActionBase<{ dest: DuelFieldCell }> = {
  title: "セット",
  playType: "SpellTrapSet",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  validate: defaultSpellTrapSetValidate,
  prepare: defaultSpellTrapSetPrepare,
  execute: defaultSpellTrapSetExecute,
  settle: async () => true,
};

export const defaultSpellTrapValidate = (entity: DuelEntity): DuelFieldCell[] | undefined => {
  if (entity.info.isDying) {
    return;
  }
  if (entity.info.isSettingSickness) {
    return;
  }
  if (entity.fieldCell.cellType === "FieldSpellZone" && entity.face === "FaceDown") {
    return [];
  }
  if (entity.field.duel.getTurnPlayer() !== entity.controller) {
    return undefined;
  }

  const availableCells = entity.controller.getAvailableSpellTrapZones();
  return availableCells.length > 0 ? availableCells : undefined;
};
export const defaultSpellTrapPrepare = async <T>(
  entity: DuelEntity,
  cell: DuelFieldCell | undefined,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean,
  chainBlockTags: TChainBlockType[],
  selectedEntities: DuelEntity[],
  prepared: T
): Promise<ChainBlockInfoBase<T> | undefined> => {
  entity.info.isDying = true;
  if (entity.fieldCell.cellType === "FieldSpellZone" && entity.face === "FaceDown") {
    entity.setNonFieldPosition("FaceUp", true);
    return { chainBlockTags, selectedEntities, prepared };
  }
  if (entity.fieldCell.cellType === "Hand") {
    const causedBy: TDuelCauseReason[] = ["SpellTrapActivate"];
    const availableCells = cell ? [cell] : entity.controller.getAvailableSpellTrapZones();
    await entity.field.activateSpellTrapFromHand(entity, availableCells, causedBy, entity, entity.controller, true);
    return { chainBlockTags, selectedEntities, prepared };
  }
  return;
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

const getEnableSyncroSummonPattern = (
  entity: DuelEntity,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): DuelEntity[][] => {
  let materials = [
    ...entity.controller.getMonstersOnField().filter((card) => card.battlePotion !== "Set"),
    ...entity.controller.getHandCell().entities.filter((card) => card.origin.kind === "Monster"),
  ].filter((m) => m.status.canBeSyncroMaterial);

  if (materials.every((m) => !m.status.allowHandSyncro)) {
    materials = entity.controller.getMonstersOnField();
  }

  if (materials.length < 2) {
    return [];
  }

  return materials.getAllOnOffPattern().filter((pattern) => defaultSyncroMaterialsValidator(entity, pattern, tunersValidator, nonTunersValidator));
};
export const defaultSyncroSummonValidate = (
  entity: DuelEntity,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): DuelFieldCell[] | undefined => {
  return getEnableSyncroSummonPattern(entity, tunersValidator, nonTunersValidator).length > 0 ? [] : undefined;
};
export const defaultSyncroSummonPrepare = async (
  entity: DuelEntity,
  cell?: DuelFieldCell,
  cancelable?: boolean,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): Promise<ChainBlockInfoBase<SummonPrepared> | undefined> => {
  const patterns = getEnableSyncroSummonPattern(entity, tunersValidator, nonTunersValidator);

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
    entity.field.duel.log.info(`シンクロ素材として、${materials.map((m) => "《" + m.nm + "》").join("")}を墓地に送り――`);
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

  await entity.summon(myInfo.prepared.dest, myInfo.prepared.pos, "SyncroSummon", movedAs, undefined, activater);

  activater.specialSummonCount++;
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
      if (entity.controller.getDeckCell().cardEntities.filter(monsterFilter).length === 0) {
        return;
      }
      return [];
    },
    prepare: defaultPrepare,
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
        await entity.field.summon(monster, posList, activater.getAvailableMonsterZones(), "SpecialSummon", ["Effect"], entity, activater, false);
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

export const getDefaultSearchSpellAction = (filter: (card: DuelEntity) => boolean): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    // デッキに対象カードが一枚以上必要。
    validate: (entity: DuelEntity) => {
      if (entity.controller.getDeckCell().cardEntities.filter(filter).length === 0) {
        return;
      }
      return defaultSpellTrapValidate(entity);
    },
    prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, ["AddToHandFromDeck"], [], undefined),
    execute: async (entity: DuelEntity, activater: Duelist) => {
      const monsters = activater.getDeckCell().cardEntities.filter(filter);
      if (monsters.length === 0) {
        return false;
      }
      const target = await entity.field.duel.view.waitSelectEntities(activater, monsters, 1, (list) => list.length === 1, "手札に加えるカードを選択", false);
      for (const monster of target ?? []) {
        await monster.addToHand(["Effect"], entity, activater);
      }
      activater.shuffleDeck();
      return true;
    },
    settle: async () => true,
  };
};

export const getDefaultSalvageSpellAction = (filter: (card: DuelEntity) => boolean, qty: number): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    hasToTargetCards: true,
    // 墓地にに対象カードが一枚以上必要。
    validate: (entity: DuelEntity) => {
      if (entity.controller.getGraveyard().cardEntities.filter(filter).length < qty) {
        return;
      }
      return defaultSpellTrapValidate(entity);
    },
    prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, ["AddToHandFromGraveyard"], [], undefined),
    execute: async (entity: DuelEntity, activater: Duelist) => {
      const monsters = activater.getGraveyard().cardEntities.filter(filter);
      if (monsters.length === 0) {
        return false;
      }
      const target = await entity.field.duel.view.waitSelectEntities(
        activater,
        monsters,
        qty,
        (list) => list.length === qty,
        "手札に加えるカードを選択",
        false
      );
      for (const monster of target ?? []) {
        await monster.addToHand(["Effect"], entity, activater);
      }
      return true;
    },
    settle: async () => true,
  };
};
export const getLikeTradeInAction = (filter: (card: DuelEntity) => boolean): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    // 手札に対象カードが一枚以上必要。
    validate: (entity: DuelEntity) => {
      if (entity.controller.getHandCell().cardEntities.filter(filter).length === 0) {
        return;
      }
      if (entity.controller.getDeckCell().cardEntities.length < 2) {
        return;
      }
      return defaultSpellTrapValidate(entity);
    },
    prepare: async (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => {
      await entity.controller.discard(1, ["Discard", "Cost"], entity, entity.controller, filter);

      return defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, ["AddToHandFromDeck"], [], undefined);
    },
    execute: async (entity: DuelEntity, activater: Duelist) => {
      await activater.draw(2, entity, activater);
      return true;
    },
    settle: async () => true,
  };
};

export const getDefaultHealBurnSpellAction = (calcDamage: (entity: DuelEntity) => [number, number]): CardActionBase<undefined> => {
  return {
    title: "発動",
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    validate: defaultSpellTrapValidate,
    prepare: (entity: DuelEntity, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultSpellTrapPrepare(entity, cell, chainBlockInfos, cancelable, ["AddToHandFromGraveyard"], [], undefined),
    execute: async (entity: DuelEntity, activater: Duelist) => {
      const [toSelf, toOpponent] = calcDamage(entity);
      if (toOpponent > 0) {
        activater.getOpponentPlayer().heal(toOpponent, entity);
      } else if (toOpponent < 0) {
        activater.getOpponentPlayer().effectDamage(Math.abs(toOpponent), entity);
      }
      if (toSelf > 0) {
        activater.heal(toSelf, entity);
      } else if (toSelf < 0) {
        activater.effectDamage(Math.abs(toSelf), entity);
      }
      return true;
    },
    settle: async () => true,
  };
};

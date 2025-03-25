import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { CardAction, type CardActionBase, type ChainBlockInfo, type ChainBlockInfoBase } from "@ygo_duel/class/DuelCardAction";
import { type TDuelCauseReason, DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
export type SummonPrepared = { dest: DuelFieldCell; pos: TBattlePosition; materials: DuelEntity[] };
export const defaultPrepare = async () => {
  return { selectedEntities: [], chainBlockTags: [], prepared: undefined };
};
export const defaultNormalSummonValidate = (action: CardAction<SummonPrepared>): DuelFieldCell[] | undefined => {
  // 召喚権を使い切っていたら通常召喚不可。
  if (action.entity.controller.info.ruleNormalSummonCount >= action.entity.controller.info.maxRuleNormalSummonCount) {
    return;
  }

  // レベルがないモンスターは通常召喚不可
  if (!action.entity.lvl) {
    return;
  }

  const availableCells = action.entity.controller.getAvailableMonsterZones();

  // 4以下は空きセルが必要
  if (action.entity.lvl < 5) {
    return availableCells.length > 0 ? availableCells : undefined;
  }

  const releasableMonsters = action.entity.controller.getReleasableMonsters();

  // リリース可能なモンスターが不足する場合、アドバンス召喚不可
  // リリース処理が先にくるので、選択可能なセルはなし
  return releasableMonsters.length < (action.entity.lvl < 7 ? 1 : 2) ? undefined : [];

  // TODO : クロス・ソウルの「しなければならない」の制限の考慮。エクストラモンスターゾーンまたは相手モンスターゾーンにしかリリース可能なモンスターがいない場合、空きが必要。
  // if (emptyCells.length > 0 || releasableMonsters.filter((m) => m.controller === entity.controller && m.fieldCell.cellType === "MonsterZone")) {
  //   return true;
  // }
};

export const defaultNormalSummonPrepare = async (
  action: CardAction<SummonPrepared>,
  cell: DuelFieldCell | undefined,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean
): Promise<ChainBlockInfoBase<SummonPrepared> | undefined> => {
  if (!action.entity.lvl) {
    return;
  }
  let availableCells = cell ? [cell] : action.entity.controller.getAvailableMonsterZones();
  if (availableCells.length === 0) {
    return;
  }
  let _cancelable = cancelable;
  let materials: DuelEntity[] = [];
  if (action.entity.lvl > 4) {
    const releasableMonsters = action.entity.controller.getReleasableMonsters();
    const exZoneMonsters = action.entity.controller.getExtraMonsterZones();
    const qty = action.entity.lvl < 7 ? 1 : 2;

    if (exZoneMonsters.length >= qty) {
      releasableMonsters.filter((monster) => monster.fieldCell.cellType !== "ExtraMonsterZone");
    }
    const _materials = await action.entity.field.release(
      action.entity.controller,
      action.entity.controller.getReleasableMonsters(),
      qty,
      "Cost",
      ["AdvanceSummonRelease", "Rule"],
      action.entity,
      _cancelable
    );

    //リリースしなければキャンセル。
    if (!_materials) {
      return;
    }

    materials = _materials;

    // リリース後はキャンセル不可
    _cancelable = false;
    availableCells = action.entity.controller.getAvailableMonsterZones();
  }
  let pos: TBattlePosition = (action.entity.atk ?? 0) > 0 && (action.entity.atk ?? 0) >= (action.entity.def ?? 0) ? "Attack" : "Set";
  let dest: DuelFieldCell = availableCells.randomPick();

  if (action.entity.controller.duelistType !== "NPC") {
    const res = await action.entity.field.duel.view.waitSelectSummonDest(action.entity, availableCells, ["Attack", "Set"], _cancelable);
    if (!res) {
      return;
    }

    dest = res.dest;
    pos = res.pos;
  }
  return { selectedEntities: [], chainBlockTags: [], prepared: { dest, pos, materials } };
};

export const defaultNormalSummonExecute = async (myInfo: ChainBlockInfo<SummonPrepared>): Promise<boolean> => {
  const movedAs: TDuelCauseReason[] = ["Rule", "NormalSummon"];

  if (myInfo.prepared.materials.length > 0) {
    myInfo.action.entity.info.materials.reset(...myInfo.prepared.materials);
    movedAs.push("AdvanceSummon");
  }

  await myInfo.action.entity.summon(myInfo.prepared.dest, myInfo.prepared.pos, "NormalSummon", movedAs, myInfo.action.entity, myInfo.activator);

  myInfo.activator.info.ruleNormalSummonCount++;
  myInfo.activator.info.ruleNormalSummonCountQty++;
  return true;
};
export const defaultRuleSpecialSummonValidate = (
  action: CardAction<SummonPrepared>,
  posList: TBattlePosition[],
  materials: DuelEntity[]
): DuelFieldCell[] | undefined => {
  // 空セルを取得
  const emptyCells = action.entity.controller.getAvailableMonsterZones();

  // エクストラデッキにいる場合、エクストラモンスターゾーンも使用可能
  if (action.entity.fieldCell.cellType === "ExtraDeck") {
    emptyCells.push(...action.entity.controller.getAvailableExtraZones());
  }

  // 使用可能なセルがなければ不可
  if (!emptyCells.length) {
    if (!materials.length) {
      return;
    }
    if (materials.every((m) => m.fieldCell.cellType !== "MonsterZone")) {
      if (action.entity.fieldCell.cellType !== "ExtraDeck") {
        return;
      }

      // TODO エクストラリンクの考慮
    }
  }

  // コントローラー側の制約チェック
  if (!action.entity.controller.canSummon(action.entity.controller, action.entity, action as CardAction<unknown>, "SpecialSummon", posList, materials).length) {
    return;
  }

  return materials.length === 0 ? emptyCells : [];
};

export const defaultRuleSpecialSummonPrepare = async (
  action: CardAction<SummonPrepared>,
  cell: DuelFieldCell | undefined,
  posList: TBattlePosition[],
  materials: DuelEntity[],
  cancelable: boolean
): Promise<ChainBlockInfoBase<SummonPrepared> | undefined> => {
  const availableCells = cell ? [cell] : action.entity.controller.getAvailableMonsterZones();
  if (availableCells.length === 0) {
    return;
  }

  const _posList = action.entity.controller.canSummon(
    action.entity.controller,
    action.entity,
    action as CardAction<unknown>,
    "SpecialSummon",
    posList,
    materials
  );
  if (_posList.length === 0) {
    return;
  }

  let pos: TBattlePosition = _posList.randomPick();
  let dest: DuelFieldCell = availableCells.randomPick();

  if (_posList.length) {
    if (_posList.includes("Attack")) {
      pos =
        (action.entity.atk ?? 0) > 0 && (action.entity.atk ?? 0) >= (action.entity.def ?? 0) ? "Attack" : _posList.filter((p) => p !== "Attack").randomPick();
    }
  }
  if (action.entity.controller.duelistType !== "NPC") {
    const res = await action.entity.field.duel.view.waitSelectSummonDest(action.entity, availableCells, _posList, cancelable);
    if (!res) {
      return;
    }

    dest = res.dest;
    pos = res.pos;
  }
  return { selectedEntities: [], chainBlockTags: [], prepared: { dest, pos, materials } };
};

export const defaultRuleSpecialSummonExecute = async (myInfo: ChainBlockInfo<SummonPrepared>): Promise<boolean> => {
  const movedAs: TDuelCauseReason[] = ["Rule", "SpecialSummon"];

  await myInfo.action.entity.summon(myInfo.prepared.dest, myInfo.prepared.pos, "SpecialSummon", movedAs, myInfo.action.entity, myInfo.activator);
  myInfo.action.entity.info.materials = myInfo.prepared.materials;
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

export const defaultDeclareAttackValidate = (action: CardAction<{ target: DuelEntity }>): DuelFieldCell[] | undefined => {
  if (action.entity.info.attackCount > 0 || action.entity.battlePosition !== "Attack" || !action.entity.controller.isTurnPlayer) {
    return undefined;
  }

  const enemies = action.entity.controller.getAttackTargetMonsters();

  if (enemies.length > 0) {
    return enemies.map((e) => e.fieldCell);
  }

  return [action.entity.controller.getOpponentPlayer().getHandCell()];
};
export const defaultDeclareAttackPrepare = async (
  action: CardAction<{ target: DuelEntity }>,
  cell: DuelFieldCell | undefined
): Promise<ChainBlockInfoBase<{ target: DuelEntity }> | undefined> => {
  if (action.entity.info.attackCount > 0 || action.entity.battlePosition !== "Attack") {
    return;
  }
  if (cell?.targetForAttack) {
    return { selectedEntities: [], chainBlockTags: [], prepared: { target: cell.targetForAttack } };
  }

  const choices = action.entity.controller.getAttackTargetMonsters();
  const opponent = action.entity.controller.getOpponentPlayer().entity;

  if (choices.length === 0) {
    return { selectedEntities: [], chainBlockTags: [], prepared: { target: opponent } };
  }
  if (choices.length === 1) {
    return { selectedEntities: [], chainBlockTags: [], prepared: { target: choices[0] } };
  }

  const targets = await action.entity.field.duel.view.waitSelectEntities(
    action.entity.controller,
    choices,
    1,
    (list) => list.length === 1,
    "攻撃対象を選択。",
    true
  );

  if (!targets) {
    return;
  }

  return { selectedEntities: [], chainBlockTags: [], prepared: { target: targets[0] } };
};
export const defaultDeclareAttackExecute = async (myInfo: ChainBlockInfo<{ target: DuelEntity }>): Promise<boolean> => {
  myInfo.action.entity.field.duel.declareAnAttack(myInfo.action.entity, myInfo.prepared.target);

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

export const defaultBattlePotisionChangeValidate = (action: CardAction<undefined>): DuelFieldCell[] | undefined => {
  if (action.entity.info.battlePotisionChangeCount > 0 || action.entity.info.attackCount > 0 || !action.entity.controller.isTurnPlayer) {
    return undefined;
  }
  return [];
};

export const defaultBattlePotisionChangeExecute = async (myInfo: ChainBlockInfo<undefined>): Promise<boolean> => {
  if (myInfo.action.entity.info.battlePotisionChangeCount > 0 || !myInfo.action.entity.controller.isTurnPlayer) {
    return false;
  }

  await myInfo.action.entity.setBattlePosition(
    myInfo.action.entity.battlePosition === "Attack" ? "Defense" : "Attack",
    ["Rule"],
    myInfo.action.entity,
    myInfo.activator
  );
  myInfo.action.entity.info.battlePotisionChangeCount++;
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
  action: CardAction<SummonPrepared>,
  materials: DuelEntity[],
  tunersValidator: (tuners: DuelEntity[]) => boolean,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean
): boolean => {
  if (!action.entity.origin.level) {
    return false;
  }
  // レベルを持たないモンスターが存在する場合、不可
  if (materials.some((material) => !material.lvl)) {
    return false;
  }

  //レベルが合わない場合、不可
  //TODO https://yugioh-wiki.net/index.php?%A1%D4%A5%C1%A5%E5%A1%BC%A5%CB%A5%F3%A5%B0%A1%A6%A5%B5%A5%DD%A1%BC%A5%BF%A1%BC%A1%D5#list
  if (materials.map((material) => material.lvl ?? 0).reduce((sum, lvl) => sum + lvl, 0) !== action.entity.origin.level) {
    return false;
  }

  // TODO https://yugioh-wiki.net/index.php?%A1%D4%B8%B8%B1%C6%B2%A6%20%A5%CF%A5%A4%A5%C9%A1%A6%A5%E9%A5%A4%A5%C9%A1%D5#list
  if (!tunersValidator(materials.filter((cost) => cost.status.monsterCategories?.some((cat) => cat === "Tuner")))) {
    return false;
  }

  // シンクロモンスター側から見た非チューナー側の条件チェック
  if (!nonTunersValidator(materials.filter((cost) => cost.status.monsterCategories?.every((cat) => cat !== "Tuner")))) {
    return false;
  }

  // 素材側から見た全体の条件チェック（デブリ・ドラゴンなど）
  if (!materials.every((m) => m.canBeMaterials("SyncroSummon", action as CardAction<unknown>, materials))) {
    return false;
  }

  // プレイヤーの特殊召喚可能チェック
  if (
    !action.entity.owner.canSummon(action.entity.owner, action.entity, action as CardAction<unknown>, "SyncroSummon", ["Attack", "Defense"], materials).length
  ) {
    return false;
  }

  return true;
};

const getEnableSyncroSummonPatterns = (
  action: CardAction<SummonPrepared>,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): DuelEntity[][] => {
  // 手札と場から全てのシンクロ素材にできるモンスターを収集する。
  let materials = [
    ...action.entity.controller.getMonstersOnField().filter((card) => card.battlePosition !== "Set"),
    ...action.entity.controller.getHandCell().entities.filter((card) => card.origin.kind === "Monster"),
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
  return materials.getAllOnOffPattern().filter((pattern) => defaultSyncroMaterialsValidator(action, pattern, tunersValidator, nonTunersValidator));
};
export const defaultSyncroSummonValidate = (
  action: CardAction<SummonPrepared>,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): DuelFieldCell[] | undefined => {
  return getEnableSyncroSummonPatterns(action, tunersValidator, nonTunersValidator).length > 0 ? [] : undefined;
};
export const defaultSyncroSummonPrepare = async (
  action: CardAction<SummonPrepared>,
  cell?: DuelFieldCell,
  cancelable?: boolean,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): Promise<ChainBlockInfoBase<SummonPrepared> | undefined> => {
  const patterns = getEnableSyncroSummonPatterns(action, tunersValidator, nonTunersValidator);

  let materials = patterns[0];

  if (patterns.length > 1) {
    const choices = patterns.flatMap((p) => p).getDistinct();
    const _materials = await action.entity.duel.view.waitSelectEntities(
      action.entity.controller,
      choices,
      undefined,
      (selected) => defaultSyncroMaterialsValidator(action, selected, tunersValidator, nonTunersValidator),
      "シンクロ素材とするモンスターを選択",
      true
    );
    //墓地へ送らなければキャンセル。
    if (!_materials) {
      return;
    }
    materials = _materials;
  }

  action.entity.field.duel.log.info(`シンクロ素材として、${materials.map((m) => "《" + m.nm + "》").join("")}を墓地に送り――`, action.entity.controller);
  await DuelEntity.sendManyToGraveyardForTheSameReason(materials, ["SyncroMaterial", "Rule", "SpecialSummonMaterial"], action.entity, action.entity.controller);

  const availableCells = [...action.entity.controller.getAvailableMonsterZones(), ...action.entity.controller.getAvailableExtraZones()];
  let pos: TBattlePosition = (action.entity.atk ?? 0) > 0 && (action.entity.atk ?? 0) >= (action.entity.def ?? 0) ? "Attack" : "Defense";
  let dest: DuelFieldCell = availableCells.randomPick();

  if (action.entity.controller.duelistType !== "NPC") {
    const res = await action.entity.field.duel.view.waitSelectSummonDest(action.entity, availableCells, ["Attack", "Defense"], false);
    if (!res) {
      return;
    }

    dest = res.dest;
    pos = res.pos;
  }
  return { selectedEntities: [], chainBlockTags: [], prepared: { dest, pos, materials } };
};
export const defaultSyncroSummonExecute = async (myInfo: ChainBlockInfo<SummonPrepared>): Promise<boolean> => {
  const movedAs: TDuelCauseReason[] = ["Rule", "SpecialSummon", "SyncroSummon"];

  await myInfo.action.entity.summon(myInfo.prepared.dest, myInfo.prepared.pos, "SyncroSummon", movedAs, myInfo.action.entity, myInfo.activator);

  myInfo.action.entity.info.isRebornable = true;
  return true;
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
    validate: (action: CardAction<SummonPrepared>) => defaultSyncroSummonValidate(action, tunersValidator, nonTunersValidator),
    prepare: (action: CardAction<SummonPrepared>, cell: DuelFieldCell | undefined, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultSyncroSummonPrepare(action, cell, cancelable, tunersValidator, nonTunersValidator),
    execute: defaultSyncroSummonExecute,
    settle: async () => true,
  };
};

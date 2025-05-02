import {
  type CardActionDefinition,
  type ChainBlockInfo,
  type ChainBlockInfoBase,
  type ChainBlockInfoPrepared,
  type TEffectTag,
} from "@ygo_duel/class/DuelCardAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { spellTrapZoneCellTypes, type DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { defaultPrepare } from "./DefaultCardAction";
export const defaultSpellTrapSetValidate = (myInfo: ChainBlockInfoBase<unknown>): DuelFieldCell[] | undefined => {
  if (myInfo.action.entity.status.spellCategory === "Field") {
    const fieldZone = myInfo.activator.getFieldZone();
    // TODO 盆回しなど
    return [fieldZone];
  }
  const availableCells = myInfo.activator.getAvailableSpellTrapZones();
  return availableCells.length > 0 ? availableCells : undefined;
};
export const defaultSpellTrapSetAction: CardActionDefinition<unknown> = {
  title: "セット",
  playType: "SpellTrapSet",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  isMandatory: false,
  validate: defaultSpellTrapSetValidate,
  prepare: defaultPrepare,
  execute: async () => true,
  settle: async () => true,
};

export const defaultSpellTrapValidate = <T>(myInfo: ChainBlockInfoBase<T>): DuelFieldCell[] | undefined => {
  if (myInfo.action.entity.info.isPending) {
    return;
  }
  if (myInfo.action.entity.info.isDying) {
    return;
  }
  if (myInfo.action.entity.info.isSettingSickness) {
    return;
  }
  if (spellTrapZoneCellTypes.some((ct) => ct === myInfo.action.entity.fieldCell.cellType)) {
    return myInfo.action.entity.face === "FaceDown" ? [] : undefined;
  }
  if (myInfo.action.spellSpeed === "Normal" && !myInfo.activator.isTurnPlayer) {
    return;
  }

  if (myInfo.action.entity.fieldCell.cellType === "Hand" && !myInfo.activator.isTurnPlayer) {
    return;
  }

  if (myInfo.action.entity.status.spellCategory === "Field") {
    return [myInfo.activator.getFieldZone()];
  }

  let availableCells = myInfo.activator.getAvailableSpellTrapZones();

  if (myInfo.action.entity.status.monsterCategories?.includes("Pendulum")) {
    // ペンデュラムの場合、発動先はペンデュラムゾーンのみ
    availableCells = availableCells.filter((cell) => cell.isAvailableForPendulum);
  }
  return availableCells.length > 0 ? availableCells : undefined;
};

export const defaultContinuousSpellCardActivateAction = {
  title: "発動",
  isMandatory: false,
  playType: "CardActivation",
  spellSpeed: "Normal",
  executableCells: ["Hand", "SpellAndTrapZone"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  validate: defaultSpellTrapValidate,
  prepare: defaultPrepare,
  execute: async () => true,
  settle: async () => true,
} as CardActionDefinition<unknown>;

export const defaultEquipSpellTrapValidate = <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  validateEquipOwner: (equipOwner: DuelEntity, equip: DuelEntity) => boolean = () => true
) => {
  const monsters = myInfo.action.entity.field
    .getMonstersOnFieldStrictly()
    .filter((monster) => monster.face === "FaceUp")
    .filter((monster) => monster.canBeTargetOfEffect(myInfo))
    .filter((monster) => validateEquipOwner(monster, myInfo.action.entity));
  return monsters.length ? defaultSpellTrapValidate(myInfo) : undefined;
};

export const defaultEquipSpellTrapPrepare = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfoPrepared<unknown>[]>,
  cancelable: boolean,
  chainBlockTags: TEffectTag[] | undefined,
  prepared: T,
  validateEquipOwner: (equipOwner: DuelEntity, equip: DuelEntity) => boolean = () => true
) => {
  const monsters = myInfo.action.entity.field
    .getMonstersOnFieldStrictly()
    .filter((monster) => monster.face === "FaceUp")
    .filter((monster) => monster.canBeTargetOfEffect(myInfo))
    .filter((monster) => validateEquipOwner(monster, myInfo.action.entity));
  const target = await myInfo.activator.waitSelectEntity(monsters, "装備対象モンスターを選択", cancelable);
  if (!target) {
    return undefined;
  }

  myInfo.action.entity.info.equipedBy = target;
  myInfo.action.entity.info.effectTargets[myInfo.action.seq] = [target];
  return { chainBlockTags: chainBlockTags ?? [], selectedEntities: [target], prepared };
};

export const defaultEquipSpellTrapExecute = async <T>(
  myInfo: ChainBlockInfo<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  validateEquipOwner: (equipOwner: DuelEntity, equip: DuelEntity) => boolean = () => true
) => {
  const target = myInfo.selectedEntities[0];
  myInfo.action.entity.info.equipedBy = target;
  myInfo.action.entity.info.effectTargets[myInfo.action.seq] = [target];
  if (!validateEquipOwner(target, myInfo.action.entity)) {
    await myInfo.action.entity.ruleDestory();
    myInfo.activator.writeInfoLog(`${target.toString()}が装備条件を満たさなくなったため、${myInfo.action.entity.toString()}は破壊された。`);
    return false;
  }

  myInfo.action.entity.info.equipedBy = target;
  myInfo.action.entity.info.validateEquipOwner = validateEquipOwner;

  target.info.equipEntities.push(myInfo.action.entity);
  return true;
};

export const getDefaultEquipSpellTrapAction = (filter: (monster: DuelEntity) => boolean = () => true): CardActionDefinition<unknown> => {
  return {
    title: "発動",
    isMandatory: false,
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    validate: (myInfo, chainBlockInfos) => defaultEquipSpellTrapValidate(myInfo, chainBlockInfos, filter),
    prepare: (myInfo, chainBlockInfos, cancelable) => defaultEquipSpellTrapPrepare(myInfo, chainBlockInfos, cancelable, [], undefined, filter),
    execute: defaultEquipSpellTrapExecute,
    settle: async () => true,
  };
};

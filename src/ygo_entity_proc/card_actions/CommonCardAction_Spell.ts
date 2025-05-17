import { type CardActionDefinition, type ChainBlockInfo, type ChainBlockInfoBase, type TEffectTag } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { type DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CommonCardAction";
import { SystemError } from "@ygo_duel/class/Duel";
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
  prepare: defaultPrepare,
  execute: async () => true,
  settle: async () => true,
};

export const defaultContinuousSpellCardActivateAction = {
  title: "発動",
  isMandatory: false,
  playType: "CardActivation",
  spellSpeed: "Normal",
  executableCells: ["Hand", "SpellAndTrapZone", "FieldSpellZone"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  prepare: defaultPrepare,
  execute: async () => true,
  settle: async () => true,
} as CardActionDefinition<unknown>;

export const defaultEquipSpellTrapPrepare = async <T>(
  myInfo: ChainBlockInfoBase<T>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean,
  chainBlockTags: TEffectTag[] | undefined,
  prepared: T
) => {
  const entities = myInfo.action.getTargetableEntities(myInfo, chainBlockInfos);
  if (!entities) {
    throw new SystemError("CardAction定義が正しくない", myInfo);
  }
  const target = await myInfo.activator.waitSelectEntity(entities, "装備対象モンスターを選択", cancelable);
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

export const getDefaultEquipSpellTrapAction = (
  validateEquipOwner: (equipOwner: DuelEntity, equip: DuelEntity) => boolean = () => true
): CardActionDefinition<unknown> => {
  return {
    title: "発動",
    isMandatory: false,
    playType: "CardActivation",
    spellSpeed: "Normal",
    executableCells: ["Hand", "SpellAndTrapZone"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    getTargetableEntities: (myInfo) =>
      myInfo.action.entity.field
        .getMonstersOnFieldStrictly()
        .filter((monster) => monster.face === "FaceUp")
        .filter((monster) => monster.canBeTargetOfEffect(myInfo))
        .filter((monster) => validateEquipOwner(monster, myInfo.action.entity)),
    getDests: (myInfo, chainBlockInfos) =>
      myInfo.action
        .getTargetableEntities(myInfo, chainBlockInfos)
        .filter((entity) => entity.isOnFieldAsMonsterStrictly)
        .map((monster) => monster.fieldCell),
    prepare: (myInfo, chainBlockInfos, cancelable) => defaultEquipSpellTrapPrepare(myInfo, chainBlockInfos, cancelable, [], undefined),
    execute: defaultEquipSpellTrapExecute,
    settle: async () => true,
  };
};

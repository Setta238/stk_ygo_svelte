import { faceupBattlePositions, type TBattlePosition } from "@ygo/class/YgoTypes";
import type { ChainBlockInfoBase, ChainBlockInfoPrepared, ChainBlockInfo, CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity, type TDuelCauseReason } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type { MaterialInfo } from "./CardDefinitions";
import { SystemError } from "@ygo_duel/class/Duel";

export const defaultXyzMaterialsValidator = (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  posList: Readonly<TBattlePosition[]>,
  cells: DuelFieldCell[],
  materials: DuelEntity[],
  qtyLowerBound: number = 2,
  qtyUpperBound: number = 2,
  validator: (materials: DuelEntity[]) => boolean
): MaterialInfo[] | undefined => {
  if (!myInfo.action.entity.origin.rank) {
    return;
  }

  if (materials.length < qtyLowerBound) {
    return;
  }

  if (materials.length > qtyUpperBound) {
    return;
  }

  // レベルを持たないモンスターが存在する場合、不可
  if (materials.some((material) => !material.lvl)) {
    return;
  }

  // ランクとレベルが異なる場合、不可
  if (materials.some((material) => material.lvl !== myInfo.action.entity.rank)) {
    return;
  }

  // エクシーズモンスター側から見た素材条件チェック
  if (!validator(materials)) {
    return;
  }

  const materialInfos = materials.map((material) => {
    return { material, level: material.status.level };
  });

  if (
    !myInfo.activator.getEnableSummonList(
      myInfo.activator,
      "SyncroSummon",
      ["Rule", "SpecialSummon"],
      myInfo.action,
      [{ monster: myInfo.action.entity, posList, cells }],
      materialInfos,
      false
    ).length
  ) {
    return;
  }
  return materialInfos;
};

const getEnableXyzSummonPatterns = (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  qtyLowerBound: number = 2,
  qtyUpperBound: number = 2,
  validator: (materials: DuelEntity[]) => boolean = (materials) => materials.length > 1
): MaterialInfo[][] => {
  // 場から全てのエクシーズ素材にできるモンスターを収集する。
  const materials = myInfo.activator.getMonstersOnField().filter((card) => card.battlePosition !== "Set");

  // 一枚以下はエクシーズ召喚不可
  if (materials.length < qtyLowerBound) {
    return [];
  }
  const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.getAvailableExtraZones()];

  //全パターンを試し、エクシーズ召喚可能なパターンを全て列挙する。
  return materials
    .getAllOnOffPattern()
    .filter((pattern) => pattern.length >= qtyLowerBound)
    .filter((pattern) => pattern.length <= qtyUpperBound)
    .map((pattern) => defaultXyzMaterialsValidator(myInfo, faceupBattlePositions, cells, pattern, qtyLowerBound, qtyUpperBound, validator) ?? [])
    .filter((pattern) => pattern.length);
};

export const defaultXyzSummonValidate = (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  qtyLowerBound: number = 2,
  qtyUpperBound: number = 2,
  validator: (materials: DuelEntity[]) => boolean = (materials) => materials.length > 1
): DuelFieldCell[] | undefined => {
  return getEnableXyzSummonPatterns(myInfo, qtyLowerBound, qtyUpperBound, validator).length > 0 ? [] : undefined;
};
export const defaultXyzSummonPrepare = async (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  cancelable?: boolean,
  qtyLowerBound: number = 2,
  qtyUpperBound: number = 2,
  validator: (materials: DuelEntity[]) => boolean = (materials) => materials.length > 1
): Promise<ChainBlockInfoPrepared<MaterialInfo[]> | undefined> => {
  const patterns = getEnableXyzSummonPatterns(myInfo, qtyLowerBound, qtyUpperBound, validator);

  let materials = patterns[0].map((info) => info.material);

  const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")];

  if (patterns.length > 1) {
    const choices = patterns.flatMap((p) => p.map((info) => info.material)).getDistinct();
    const _materials = await myInfo.action.entity.duel.view.waitSelectEntities(
      myInfo.activator,
      choices,
      undefined,
      (selected) => Boolean(defaultXyzMaterialsValidator(myInfo, faceupBattlePositions, cells, selected, qtyLowerBound, qtyUpperBound, validator)),
      "XYZ素材とするモンスターを選択",
      true
    );
    //選択しなければキャンセル。
    if (!_materials) {
      return;
    }
    materials = _materials;
  }

  const materialInfos = defaultXyzMaterialsValidator(myInfo, faceupBattlePositions, cells, materials, qtyLowerBound, qtyUpperBound, validator);
  if (!materialInfos) {
    throw new SystemError("想定されない状態", myInfo, materials);
  }

  await DuelEntity.convertManyToXyzMaterials(
    materialInfos.map((info) => info.material),
    ["XyzMaterial", "Rule", "Cost"],
    myInfo.action.entity,
    myInfo.activator
  );

  return { selectedEntities: [], chainBlockTags: [], prepared: materialInfos };
};

export const defaultXyzSummonExecute = async (myInfo: ChainBlockInfo<MaterialInfo[]>): Promise<boolean> => {
  const movedAs: TDuelCauseReason[] = ["Rule", "SpecialSummon", "XyzSummon"];
  const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")];

  const monster = await myInfo.activator.summon(
    "XyzSummon",
    movedAs,
    myInfo.action,
    myInfo.action.entity,
    faceupBattlePositions,
    cells,
    myInfo.prepared,
    false
  );

  return Boolean(monster);
};

export const getDefaultXyzSummonAction = (
  qtyLowerBound: number = 2,
  qtyUpperBound: number = 2,
  validator: (materials: DuelEntity[]) => boolean = (materials) => materials.length > 1
): CardActionDefinition<MaterialInfo[]> => {
  return {
    title: "エクシーズ召喚",
    isMandatory: false,

    playType: "SpecialSummon",
    spellSpeed: "Normal",
    executableCells: ["ExtraDeck"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    validate: (myInfo: ChainBlockInfoBase<MaterialInfo[]>) => defaultXyzSummonValidate(myInfo, qtyLowerBound, qtyUpperBound, validator),
    prepare: (myInfo: ChainBlockInfoBase<MaterialInfo[]>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultXyzSummonPrepare(myInfo, cancelable, qtyLowerBound, qtyUpperBound, validator),
    execute: defaultXyzSummonExecute,
    settle: async () => true,
  };
};

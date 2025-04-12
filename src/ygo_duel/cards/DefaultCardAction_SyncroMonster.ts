import { faceupBattlePositions, type TBattlePosition } from "@ygo/class/YgoTypes";
import type { ChainBlockInfoBase, ChainBlockInfoPrepared, ChainBlockInfo, CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity, type TDuelCauseReason } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type { MaterialInfo } from "./CardDefinitions";
import { SystemError } from "@ygo_duel/class/Duel";
export const defaultSyncroMaterialsValidator = (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  posList: Readonly<TBattlePosition[]>,
  cells: DuelFieldCell[],
  materials: DuelEntity[],
  tunersValidator: (tuners: DuelEntity[]) => boolean,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean
): MaterialInfo[] | undefined => {
  if (!myInfo.action.entity.origin.level) {
    return;
  }
  // レベルを持たないモンスターが存在する場合、不可
  if (materials.some((material) => !material.lvl)) {
    return;
  }

  //レベルが合わない場合、不可
  //TODO https://yugioh-wiki.net/index.php?%A1%D4%A5%C1%A5%E5%A1%BC%A5%CB%A5%F3%A5%B0%A1%A6%A5%B5%A5%DD%A1%BC%A5%BF%A1%BC%A1%D5#list
  if (materials.map((material) => material.lvl ?? 0).reduce((sum, lvl) => sum + lvl, 0) !== myInfo.action.entity.origin.level) {
    return;
  }

  const tuners = materials.filter((cost) => cost.status.monsterCategories?.some((cat) => cat === "Tuner"));
  const nonTuners = materials.filter((cost) => cost.status.monsterCategories?.every((cat) => cat !== "Tuner"));

  // TODO https://yugioh-wiki.net/index.php?%A1%D4%B8%B8%B1%C6%B2%A6%20%A5%CF%A5%A4%A5%C9%A1%A6%A5%E9%A5%A4%A5%C9%A1%D5#list
  // シンクロモンスター側から見たチューナー側の条件チェック
  if (!tunersValidator(tuners)) {
    return;
  }

  // シンクロモンスター側から見た非チューナー側の条件チェック
  if (!nonTunersValidator(nonTuners)) {
    return;
  }

  const materialInfos = [
    ...tuners.map((tuner) => {
      return { material: tuner, isAsTuner: true };
    }),
    ...nonTuners.map((nonTuner) => {
      return { material: nonTuner, isAsTuner: false };
    }),
  ];

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

const getEnableSyncroSummonPatterns = (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): MaterialInfo[][] => {
  // 手札と場から全てのシンクロ素材にできるモンスターを収集する。
  let materials = [
    ...myInfo.activator.getMonstersOnField().filter((card) => card.battlePosition !== "Set"),
    ...myInfo.activator.getHandCell().cardEntities.filter((card) => card.origin.kind === "Monster"),
  ];

  // 手札シンクロを許容するカードがない場合、手札のカードを排除する。
  if (materials.every((m) => !m.status.allowHandSyncro)) {
    materials = materials.filter((m) => m.fieldCell.isPlayFieldCell);
  }

  // 二枚以下はシンクロ召喚不可
  if (materials.length < 2) {
    return [];
  }
  const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")];
  const posList: TBattlePosition[] = ["Attack", "Defense"];

  //全パターンを試し、シンクロ召喚可能なパターンを全て列挙する。
  return materials
    .getAllOnOffPattern()
    .map((pattern) => defaultSyncroMaterialsValidator(myInfo, posList, cells, pattern, tunersValidator, nonTunersValidator) ?? [])
    .filter((materialInfos) => materialInfos.length);
};
export const defaultSyncroSummonValidate = (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): DuelFieldCell[] | undefined => {
  return getEnableSyncroSummonPatterns(myInfo, tunersValidator, nonTunersValidator).length > 0 ? [] : undefined;
};
export const defaultSyncroSummonPrepare = async (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  cancelable?: boolean,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): Promise<ChainBlockInfoPrepared<MaterialInfo[]> | undefined> => {
  const patterns = getEnableSyncroSummonPatterns(myInfo, tunersValidator, nonTunersValidator);

  let materials = patterns[0].map((info) => info.material);

  const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")];
  console.log(patterns, materials);

  if (patterns.length > 1) {
    const choices = patterns.flatMap((p) => p.map((info) => info.material)).getDistinct();
    const _materials = await myInfo.action.entity.duel.view.waitSelectEntities(
      myInfo.activator,
      choices,
      undefined,
      (selected) => Boolean(defaultSyncroMaterialsValidator(myInfo, faceupBattlePositions, cells, selected, tunersValidator, nonTunersValidator)),
      "シンクロ素材とするモンスターを選択",
      cancelable
    );
    //墓地へ送らなければキャンセル。
    if (!_materials) {
      return;
    }
    materials = _materials;
  }
  console.log(patterns, materials);

  const materialInfos = defaultSyncroMaterialsValidator(myInfo, faceupBattlePositions, cells, materials, tunersValidator, nonTunersValidator);
  if (!materialInfos) {
    throw new SystemError("想定されない状態", myInfo, materials);
  }
  await DuelEntity.sendManyToGraveyardForTheSameReason(
    materials,
    ["SyncroMaterial", "Cost", "Rule", "SpecialSummonMaterial"],
    myInfo.action.entity,
    myInfo.activator
  );
  return { selectedEntities: [], chainBlockTags: [], prepared: materialInfos };
};
export const defaultSyncroSummonExecute = async (myInfo: ChainBlockInfo<MaterialInfo[]>): Promise<boolean> => {
  const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")];

  const movedAs: TDuelCauseReason[] = ["Rule", "SpecialSummon", "SyncroSummon"];
  const monster = await myInfo.activator.summon(
    "SyncroSummon",
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

export const getDefaultSyncroSummonAction = (
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): CardActionDefinition<MaterialInfo[]> => {
  return {
    title: "シンクロ召喚",
    isMandatory: false,

    playType: "SpecialSummon",
    spellSpeed: "Normal",
    executableCells: ["ExtraDeck"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    validate: (myInfo: ChainBlockInfoBase<MaterialInfo[]>) => defaultSyncroSummonValidate(myInfo, tunersValidator, nonTunersValidator),
    prepare: (myInfo: ChainBlockInfoBase<MaterialInfo[]>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultSyncroSummonPrepare(myInfo, cancelable, tunersValidator, nonTunersValidator),
    execute: defaultSyncroSummonExecute,
    settle: async () => true,
  };
};

import type { ChainBlockInfoBase, ChainBlockInfoPrepared, ChainBlockInfo, CardActionDefinition } from "@ygo_duel/class/DuelCardAction";
import { DuelEntity, type TDuelCauseReason } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type { MaterialInfo } from "./CardDefinitions";
import { SystemError } from "@ygo_duel/class/Duel";

export const defaultLinkMaterialsValidator = (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  cells: DuelFieldCell[],
  materials: DuelEntity[],
  validator: (materials: DuelEntity[]) => boolean
): MaterialInfo[] | undefined => {
  if (!myInfo.action.entity.origin.link) {
    return;
  }

  if (myInfo.action.entity.origin.link < materials.length) {
    return;
  }

  // 素材情報作成
  let materialInfos = materials.map((material) => {
    return { material, link: 1 };
  });

  if (myInfo.action.entity.origin.link > materials.length) {
    // 不足している場合、補えるかチェック
    if (materials.every((material) => (material.origin.link ?? 1) < 2)) {
      return;
    }

    const patterns = [materialInfos];

    materials
      .filter((material) => (material.origin.link ?? 1) > 1)
      .forEach((monster) => {
        [...patterns].forEach((pattern) => {
          patterns.push([...pattern.filter((m) => m.material !== monster), { material: monster, link: monster.origin.link ?? 1 }]);
        });
      });

    const _materialInfos = patterns.find((pattern) => pattern.reduce((wip, info) => wip + info.link, 0) === myInfo.action.entity.origin.link);

    if (!_materialInfos) {
      return;
    }
    materialInfos = _materialInfos;
  }

  // リンクモンスター側から見た素材側の条件チェック
  if (!validator(materials)) {
    return;
  }

  if (
    !myInfo.activator.getEnableSummonList(
      myInfo.activator,
      "LinkSummon",
      ["Rule", "SpecialSummon"],
      myInfo.action,
      [{ monster: myInfo.action.entity, posList: ["Attack"], cells }],
      materialInfos,
      false
    ).length
  ) {
    return;
  }

  // ※※※ ここから先は、リンク召喚可能なものをreturnさせていく ※※※

  if (myInfo.activator.getAvailableExtraZones().length) {
    // エクストラモンスターゾーンが使用可能ならば、リンク召喚可能。
    return materialInfos;
  }

  // 全てのエクストラモンスターゾーンのモンスター
  const exZoneMonsters = myInfo.activator.duel.field
    .getCells("ExtraMonsterZone")
    .map((cell) => cell.cardEntities[0])
    .filter((monster) => monster);

  if (
    exZoneMonsters.filter((monster) => monster.controller === myInfo.activator).length > 0 &&
    exZoneMonsters.length === materials.filter((material) => material.fieldCell.cellType === "ExtraMonsterZone").length
  ) {
    // 自身のエクストラモンスターゾーンのモンスターを全て使用するなら、リンク召喚可能。
    return materialInfos;
  }

  if (
    myInfo.activator
      .getMonsterZones()
      .flatMap((cell) => cell.arrowheadSources)
      .some((linkMonster) => !materials.includes(linkMonster))
  ) {
    // 自分メインモンスターゾーンに向いたアローヘッドが残るならば、リンク召喚可能
    return materialInfos;
  }

  if (myInfo.activator.duel.field.canExtraLink(myInfo.action.entity, materialInfos)) {
    // エクストラリンクを成立させることができるならば、リンク召喚可能
    return materialInfos;
  }

  //リンク召喚不可
  return;
};

const getEnableLinkSummonPatterns = (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  validator: (materials: DuelEntity[]) => boolean = () => true
): DuelEntity[][] => {
  // 手札と場から全てのリンク素材にできるモンスターを収集する。
  let materials = [
    ...myInfo.activator.getMonstersOnField().filter((card) => card.battlePosition !== "Set"),
    ...myInfo.activator.getHandCell().entities.filter((card) => card.origin.kind === "Monster"),
  ];

  // 手札リンクを許容するカードがない場合、手札のカードを排除する。
  if (materials.every((m) => !m.status.allowHandLink)) {
    materials = materials.filter((m) => m.fieldCell.isPlayFieldCell);
  }

  // ０枚はリンク召喚不可
  if (materials.length < 1) {
    return [];
  }

  const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getAvailableExtraMonsterZones()];
  //全パターンを試し、リンク召喚可能なパターンを全て列挙する。
  return materials.getAllOnOffPattern().filter((pattern) => defaultLinkMaterialsValidator(myInfo, cells, pattern, validator));
};
export const defaultLinkSummonValidate = (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  validator: (materials: DuelEntity[]) => boolean = () => true
): DuelFieldCell[] | undefined => {
  return getEnableLinkSummonPatterns(myInfo, validator).length > 0 ? [] : undefined;
};
export const defaultLinkSummonPrepare = async (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  cancelable?: boolean,
  validator: (materials: DuelEntity[]) => boolean = () => true
): Promise<ChainBlockInfoPrepared<MaterialInfo[]> | undefined> => {
  const patterns = getEnableLinkSummonPatterns(myInfo, validator);
  const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getAvailableExtraMonsterZones()];

  let materials = patterns[0];

  if (patterns.length > 1) {
    const choices = patterns.flatMap((p) => p).getDistinct();
    const _materials = await myInfo.action.entity.duel.view.waitSelectEntities(
      myInfo.activator,
      choices,
      undefined,
      (selected) => Boolean(defaultLinkMaterialsValidator(myInfo, cells, selected, validator)),
      "リンク素材とするモンスターを選択",
      cancelable
    );
    //墓地へ送らなければキャンセル。
    if (!_materials) {
      return;
    }
    materials = _materials;
  }

  const materialInfos = defaultLinkMaterialsValidator(myInfo, cells, materials, validator);
  if (!materialInfos) {
    throw new SystemError("想定されない状態", myInfo, materials);
  }
  await DuelEntity.sendManyToGraveyardForTheSameReason(
    materials,
    ["LinkMaterial", "Cost", "Rule", "SpecialSummonMaterial"],
    myInfo.action.entity,
    myInfo.activator
  );
  return { selectedEntities: [], chainBlockTags: [], prepared: materialInfos };
};
export const defaultLinkSummonExecute = async (myInfo: ChainBlockInfo<MaterialInfo[]>): Promise<boolean> => {
  const movedAs: TDuelCauseReason[] = ["Rule", "SpecialSummon", "LinkSummon"];

  const availableCells = [
    ...myInfo.activator.getAvailableMonsterZones().filter((cell) => cell.arrowheadSources.length),
    ...myInfo.activator.duel.field.getAvailableExtraMonsterZones(),
  ];

  console.log(availableCells);

  const monster = await myInfo.activator.summon("LinkSummon", movedAs, myInfo.action, myInfo.action.entity, ["Attack"], availableCells, myInfo.prepared, false);

  return Boolean(monster);
};

export const getDefaultLinkSummonAction = (validator: (materials: DuelEntity[]) => boolean = () => true): CardActionDefinition<MaterialInfo[]> => {
  return {
    title: "リンク召喚",
    isMandatory: false,

    playType: "SpecialSummon",
    spellSpeed: "Normal",
    executableCells: ["ExtraDeck"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    validate: (myInfo: ChainBlockInfoBase<MaterialInfo[]>) => defaultLinkSummonValidate(myInfo, validator),
    prepare: (myInfo: ChainBlockInfoBase<MaterialInfo[]>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) =>
      defaultLinkSummonPrepare(myInfo, cancelable, validator),
    execute: defaultLinkSummonExecute,
    settle: async () => true,
  };
};

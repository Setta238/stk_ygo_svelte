import type { ChainBlockInfoBase, ChainBlockInfo, CardActionDefinition, SummonMaterialInfo, ActionCostInfo } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { SystemError } from "@ygo_duel/class/Duel";
import { defaultRuleSummonExecute, defaultRuleSummonPrepare } from "./CommonCardAction_Monster";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export const defaultLinkMaterialsValidator = (
  myInfo: ChainBlockInfoBase<unknown>,
  cells: DuelFieldCell[],
  materials: DuelEntity[],
  validator: (materials: DuelEntity[]) => boolean
): SummonMaterialInfo[] | undefined => {
  if (!myInfo.action.entity.origin.link) {
    return;
  }

  if (myInfo.action.entity.origin.link < materials.length) {
    return;
  }

  // 素材情報作成
  let materialInfos = materials.map((material) => {
    return { material, cell: material.fieldCell, link: 1 };
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
          patterns.push([...pattern.filter((m) => m.material !== monster), { material: monster, cell: monster.fieldCell, link: monster.origin.link ?? 1 }]);
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
    exZoneMonsters.filter((monster) => monster.controller === myInfo.activator).length &&
    exZoneMonsters.filter((monster) => monster.controller === myInfo.activator).length ===
      materials.filter((material) => material.fieldCell.cellType === "ExtraMonsterZone").length
  ) {
    // 自身のエクストラモンスターゾーンのモンスターを全て使用するなら、リンク召喚可能。
    return materialInfos;
  }

  if (
    myInfo.activator
      .getMonsterZones()
      .flatMap((cell) => cell.linkArrowSources)
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
  myInfo: ChainBlockInfoBase<unknown>,
  validator: (materials: DuelEntity[]) => boolean = () => true
): SummonMaterialInfo[][] => {
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
  return materials
    .getAllOnOffPattern()
    .filter((pattern) => pattern.some((monster) => monster.status.allowHandLink) || pattern.every((monster) => monster.isOnFieldAsMonsterStrictly))
    .map((pattern) => defaultLinkMaterialsValidator(myInfo, cells, pattern, validator) ?? [])
    .filter((materialInfos) => materialInfos.length);
};
const defaultLinkSummonPayCost = async (
  myInfo: ChainBlockInfoBase<unknown>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean
): Promise<ActionCostInfo | undefined> => {
  // パターンを先に列挙しておく
  const patterns = myInfo.action.getEnableMaterialPatterns(myInfo);

  // 逆引きできるように準備
  const entiteisPatterns = patterns.map((infos) => {
    return { infos, materialSeqList: infos.map((info) => info.material.seq).sort() };
  });

  // 初期候補をセット
  let materials = patterns[0].map((info) => info.material);

  if (patterns.length > 1) {
    const choices = patterns.flatMap((p) => p.map((info) => info.material)).getDistinct();
    const _materials = await myInfo.activator.waitSelectEntities(
      choices,
      undefined,
      (selected) => {
        //
        const materialSeqList = selected.map((monster) => monster.seq).sort();
        return entiteisPatterns.some(
          (item) => materialSeqList.length === item.materialSeqList.length && materialSeqList.every((seq, index) => seq === item.materialSeqList[index])
        );
      },
      "リンク素材とするモンスターを選択",
      cancelable
    );
    console.log(_materials);
    //墓地へ送らなければキャンセル。
    if (!_materials) {
      return;
    }
    materials = _materials;
  }

  const materialSeqList = materials.map((monster) => monster.seq).sort();
  const materialInfos = entiteisPatterns.find(
    (item) => materialSeqList.length === item.materialSeqList.length && materialSeqList.every((seq, index) => seq === item.materialSeqList[index])
  )?.infos;

  if (!materialInfos) {
    throw new SystemError("想定されない状態", myInfo, materials);
  }
  await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(
    materials,
    ["LinkMaterial", "Cost", "Rule", "SpecialSummonMaterial"],
    myInfo.action.entity,
    myInfo.activator
  );
  return { summonMaterialInfos: materialInfos };
};
export const getDefaultLinkSummonAction = (validator: (materials: DuelEntity[]) => boolean = () => true): CardActionDefinition<unknown> => {
  return {
    title: "リンク召喚",
    isMandatory: false,

    playType: "SpecialSummon",
    spellSpeed: "Normal",
    executableCells: ["ExtraDeck"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    getEnableMaterialPatterns: (myInfo) => getEnableLinkSummonPatterns(myInfo, validator),
    canPayCosts: (myInfo) => myInfo.action.getEnableMaterialPatterns(myInfo).length > 0,
    validate: (myInfo) =>
      !myInfo.ignoreCost || myInfo.activator.getAvailableExtraZones().length + myInfo.activator.getAvailableMonsterZones().length > 0 ? [] : undefined,
    payCosts: defaultLinkSummonPayCost,
    prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "LinkSummon", ["Rule", "SpecialSummon", "LinkSummon"], ["Attack"]),
    execute: defaultRuleSummonExecute,
    settle: async () => true,
  };
};

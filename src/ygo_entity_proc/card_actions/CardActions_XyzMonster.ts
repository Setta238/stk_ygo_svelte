import { faceupBattlePositions, type TBattlePosition } from "@ygo/class/YgoTypes";
import type {
  ChainBlockInfoBase,
  ChainBlockInfo,
  CardActionDefinition,
  SummonMaterialInfo,
  ActionCostInfo,
  CardActionDefinitionFunctions,
} from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { type DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { SystemError } from "@ygo_duel/class/Duel";
import { defaultRuleSummonExecute, defaultRuleSummonPrepare } from "./CardActions_Monster";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

const defaultXyzMaterialsValidator = (
  myInfo: ChainBlockInfoBase<unknown>,
  posList: Readonly<TBattlePosition[]>,
  cells: DuelFieldCell[],
  materials: DuelEntity[],
  qtyLowerBound: number = 2,
  qtyUpperBound: number = 2,
  validator: (materials: DuelEntity[]) => boolean
): SummonMaterialInfo[] | undefined => {
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
    return { material, cell: material.cell, level: material.status.level };
  });

  if (
    !myInfo.activator.getEnableSummonList(
      myInfo.activator,
      "XyzSummon",
      ["Rule", "XyzSummon", "SpecialSummon"],
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

function* getEnableXyzSummonPatterns(
  myInfo: ChainBlockInfoBase<unknown>,
  qtyLowerBound: number = 2,
  qtyUpperBound: number = 2,
  validator: (materials: DuelEntity[]) => boolean = (materials) => materials.length > 1
): Generator<SummonMaterialInfo[]> {
  // 場から全てのエクシーズ素材にできるモンスターを収集する。
  const materials = myInfo.activator.getMonstersOnField().filter((card) => card.battlePosition !== "Set");

  // 一枚以下はエクシーズ召喚不可
  if (materials.length < qtyLowerBound) {
    return;
  }
  const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.getAvailableExtraMonsterZones()];

  //全パターンを試し、エクシーズ召喚可能なパターンを全て列挙する。
  yield* materials
    .getAllOnOffPattern()
    .filter((pattern) => pattern.length >= qtyLowerBound)
    .filter((pattern) => pattern.length <= qtyUpperBound)
    .map((pattern) => defaultXyzMaterialsValidator(myInfo, faceupBattlePositions, cells, pattern, qtyLowerBound, qtyUpperBound, validator) ?? [])
    .filter((pattern) => pattern.length);
}

const defaultXyzSummonPayCost = async (
  myInfo: ChainBlockInfoBase<unknown>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean
): Promise<ActionCostInfo | undefined> => {
  // パターンを先に列挙しておく
  const patterns = myInfo.action.getEnableMaterialPatterns(myInfo).toArray();

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
      "エクシーズ素材とするモンスターを選択",
      cancelable
    );
    // 素材を選択しなければキャンセル
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

  await DuelEntityShortHands.convertManyToXyzMaterials(
    materialInfos.map((info) => info.material),
    ["XyzMaterial", "Rule", "Cost"],
    myInfo.action.entity,
    myInfo.activator
  );

  return { summonMaterialInfos: materialInfos };
};
export const getDefaultXyzSummonAction = (
  qtyLowerBound: number = 2,
  qtyUpperBound: number = 2,
  validator: (materials: DuelEntity[]) => boolean = (materials) => materials.length > 1
): CardActionDefinition<unknown> => {
  return {
    title: "エクシーズ召喚",
    isMandatory: false,
    playType: "SpecialSummon",
    spellSpeed: "Normal",
    executableCells: ["ExtraDeck"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    getEnableMaterialPatterns: (myInfo) => getEnableXyzSummonPatterns(myInfo, qtyLowerBound, qtyUpperBound, validator),
    canPayCosts: (myInfo) => myInfo.action.getEnableMaterialPatterns(myInfo).some((infos) => infos.length),
    canExecute: (myInfo) =>
      !myInfo.ignoreCosts || myInfo.activator.getAvailableExtraMonsterZones().length + myInfo.activator.getAvailableMonsterZones().length > 0,
    payCosts: defaultXyzSummonPayCost,
    prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "XyzSummon", ["Rule", "SpecialSummon", "XyzSummon"], ["Attack", "Defense"]),
    execute: defaultRuleSummonExecute,
    settle: async () => true,
  };
};

export const getPayXyzCostActionPartical = <T>(
  qtyLowerBound: number = 1,
  qtyUpperBound: number = 1,
  filter: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, entity: DuelEntity) => boolean = () => true
): Required<Pick<CardActionDefinitionFunctions<T>, "canPayCosts" | "payCosts">> => {
  return {
    canPayCosts: (...args) => {
      const [myInfo] = args;
      return myInfo.action.entity.getXyzMaterials().filter((entity) => filter(...args, entity)).length >= qtyLowerBound;
    },
    payCosts: async (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => {
      const cards = myInfo.action.entity.getXyzMaterials().filter((entity) => filter(myInfo, chainBlockInfos, entity));

      let costs = cards.slice(0, qtyLowerBound);

      if (cards.length > qtyLowerBound) {
        const qty = qtyLowerBound === qtyUpperBound ? qtyLowerBound : undefined;
        const _costs = await myInfo.activator.waitSelectEntities(
          cards,
          qty,
          (selected) => selected.length >= qtyLowerBound && selected.length <= qtyUpperBound,
          "コストとするXYZ素材を選択",
          cancelable
        );
        if (!_costs) {
          return;
        }
        costs = _costs;
      }

      const costInfo = costs.map((cost) => ({ cost, cell: cost.cell }));

      await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(costs, ["Cost"], myInfo.action.entity, myInfo.activator);
      return { xyzMaterial: costInfo };
    },
  };
};

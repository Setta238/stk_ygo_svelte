import { faceupBattlePositions, type TBattlePosition } from "@ygo/class/YgoTypes";
import type { ChainBlockInfoBase, SummonMaterialInfo, ChainBlockInfo, CardActionDefinitionFunctions, TActionTag } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import {
  duelFieldCellTypes,
  cellTypeToDefaultPosition,
  type DuelFieldCell,
  type DuelFieldCellType,
  type TDuelEntityMovePos,
  cellTypeToDefaultFace,
  type TBundleCellType,
} from "@ygo_duel/class/DuelFieldCell";
import { SystemError } from "@ygo_duel/class/Duel";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { isFilterTypeFusionMaterialInfo, isNameTypeFusionMaterialInfo, isOvermuchTypeFusionMaterialInfo } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultPrepare } from "./CardActions";
import { getKeys } from "@stk_utils/funcs/StkObjectUtils";

type MaterialDestMapper = { [from in DuelFieldCellType]: { to: TBundleCellType; position?: TDuelEntityMovePos } };

/**
 * 追加素材分を含まないパターンとして合致する場合、値を返す
 * @param monster
 * @param myInfo
 * @param posList
 * @param cells
 * @param materials
 * @param materialsValidator
 * @returns
 */
const validateFusionMaterials = (
  monster: DuelEntity,
  myInfo: ChainBlockInfoBase<unknown>,
  posList: Readonly<TBattlePosition[]>,
  cells: DuelFieldCell[],
  materials: DuelEntity[],
  materialsValidator: (myInfo: ChainBlockInfoBase<unknown>, monster: DuelEntity, materials: DuelEntity[]) => boolean
): SummonMaterialInfo[] | undefined => {
  const fusionMaterialInfos = monster.fusionMaterialInfos.filter((info) => info.type !== "Overmuch");
  if (!fusionMaterialInfos.length) {
    return;
  }
  if (!materials.length) {
    return;
  }
  if (fusionMaterialInfos.length !== materials.length) {
    return;
  }

  // 融合魔法側から見た素材の条件チェック
  if (!materialsValidator(myInfo, monster, materials)) {
    return;
  }

  if (!monster.validateFusionMaterials(materials)) {
    return;
  }

  // どの場所に配置できるか掛け算でチェックする
  const matrix = fusionMaterialInfos.map((info) => {
    const _materials: DuelEntity[] = [];
    if (isNameTypeFusionMaterialInfo(info)) {
      _materials.push(...materials.filter((material) => info.cardName === material.nm || material.status.fusionSubstitute));
    } else {
      _materials.push(...materials.filter(info.filter));
    }
    return { require: info, materials: _materials };
  });

  // 配置できない場所があれば不可
  if (matrix.some((row) => !row.materials.length)) {
    return;
  }

  // 配置されない素材があれば不可
  if (matrix.flatMap((row) => row.materials).getDistinct().length < materials.length) {
    return;
  }

  // 列挙結果格納用変数
  let patterns: SummonMaterialInfo[][] = [[]];

  // パターンを列挙
  for (const row of matrix) {
    patterns = [
      ...patterns.flatMap((pattern) =>
        row.materials.map((material) => {
          if (pattern.some((info) => info.material === material)) {
            //重複する場合、追加しない（※後で除外する）
            return [...pattern];
          }
          const info: SummonMaterialInfo = { material, cell: material.cell };
          if (isNameTypeFusionMaterialInfo(row.require)) {
            //名称指定の場合、素材情報に明記する。
            info.name = row.require.cardName;
          }
          return [...pattern, info];
        })
      ),
    ];
  }
  // 重複する場合および、融合素材代用モンスターを複数使用したパターンを除外する。
  patterns = patterns
    .filter((pattern) => pattern.length === materials.length)
    .filter((pattern) => pattern.filter((info) => info.name && info.material.nm !== info.name).length < 2);

  // 残ったパターンから実際に特殊召喚可能なパターンを検索し、最初の１つを返す。
  return patterns.find(
    (materialInfos) =>
      myInfo.activator.getEnableSummonList(
        myInfo.activator,
        "FusionSummon",
        ["Effect", "SpecialSummon"],
        myInfo.action,
        [{ monster: myInfo.action.entity, posList, cells }],
        materialInfos,
        false
      ).length
  );
};

/**
 * 追加素材分を含まないパターンを列挙する
 * @param myInfo
 * @param args
 * @returns
 */
function* getEnableFusionSummonPatterns(
  myInfo: ChainBlockInfoBase<unknown>,
  ...args: Parameters<typeof getDefaultFusionSummonAction>
): Generator<{ monster: DuelEntity; materialInfos: SummonMaterialInfo[] }> {
  const [summonFrom, monsterValidator, materialsFrom, materialValidator, options] = args;

  const monsters = myInfo.activator
    .getCells(...summonFrom)
    .flatMap((cell) => cell.cardEntities)
    .filter((monster) => monster.status.monsterCategories?.includes("Fusion"))
    .filter((monster) => monsterValidator(myInfo, monster));

  if (!monsters.length) {
    return;
  }

  // 指定されたセルから全ての素材にできるモンスターを収集する。
  const materials = myInfo.activator
    .getCells(...materialsFrom)
    .flatMap((cell) => cell.cardEntities)
    .filter((card) => card.isMonster)
    .filter((card) => card.face === "FaceUp" || card.cell.cellType !== "Banished")
    .filter((monster) => monster.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action));

  if (options?.requisitionFrom) {
    materials.push(
      ...myInfo.activator
        .getOpponentPlayer()
        .getCells(...options.requisitionFrom)
        .flatMap((cell) => cell.cardEntities)
        .filter((card) => card.isMonster)
        .filter((card) => card.face === "FaceUp")
        .filter((monster) => monster.canBeEffected(myInfo.activator, myInfo.action.entity, myInfo.action))
    );
  }

  if (!materials.length) {
    return;
  }
  const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")];
  const posList: TBattlePosition[] = ["Attack", "Defense"];

  //全パターンを試し、融合召喚可能なパターンを全て列挙する。
  for (const monster of monsters) {
    // 必須素材を抜き出し
    const requiredMaterials = monster.fusionMaterialInfos.filter((info) => info.type !== "Overmuch");

    if (!requiredMaterials.length) {
      // なければ融合召喚不可
      continue;
    }

    // ★処理負荷軽減のため、単純な事前チェックを行う。

    if (
      materials.every((material) => !material.status.fusionSubstitute) &&
      requiredMaterials.filter(isNameTypeFusionMaterialInfo).some((info) => materials.every((material) => material.nm !== info.cardName))
    ) {
      // 融合素材代用モンスターが存在せず、名称指定の素材に合致するモンスターがいない場合、不可
      continue;
    }
    if (requiredMaterials.filter(isFilterTypeFusionMaterialInfo).some((info) => materials.every((material) => !info.filter(material)))) {
      // 条件指定素材に合致するモンスターがいない場合、不可
      continue;
    }

    for (const pattern of materials
      .filter((material) => material !== monster)
      .getAllOnOffPattern()
      .filter((pattern) => pattern.length === requiredMaterials.length)) {
      const materialInfos = validateFusionMaterials(monster, myInfo, posList, cells, pattern, materialValidator);
      if (materialInfos) {
        yield { monster, materialInfos };
        console.log(monster, materialInfos);
      }
    }
  }
}

const defaultFusionSummonExecute = async (
  myInfo: ChainBlockInfo<unknown>,
  ...args: Required<Parameters<typeof getDefaultFusionSummonAction>>
): Promise<boolean> => {
  // パターンを先に列挙しておく
  const patternInfos = getEnableFusionSummonPatterns(myInfo, ...args).toArray();

  const monsters = patternInfos.map((info) => info.monster).getDistinct();

  const monster = await myInfo.activator.waitSelectEntity(monsters, "融合召喚するモンスターを選択。");

  if (!monster) {
    return false;
  }

  const overmuchs = monster.fusionMaterialInfos.filter(isOvermuchTypeFusionMaterialInfo);

  // 選択されなかったモンスターを除去
  const patterns = patternInfos.filter((info) => info.monster === monster).map((info) => info.materialInfos);

  // 逆引きできるように準備
  const entiteisPatterns = patterns.map((infos) => {
    return { infos, requiredSeqList: infos.map((info) => info.material.seq) };
  });

  // 初期候補をセット
  let materials = patterns[0].map((info) => info.material);

  if (patterns.length > 1 || overmuchs.length) {
    const choices = patterns.flatMap((p) => p.map((info) => info.material)).getDistinct();
    materials =
      (await myInfo.activator.waitSelectEntities(
        choices,
        undefined,
        (selected) =>
          entiteisPatterns.some(
            (item) =>
              item.requiredSeqList.every((seq) => selected.map((selected) => selected.seq).includes(seq)) &&
              selected.filter((selected) => !item.requiredSeqList.includes(selected.seq)).every((selected) => overmuchs.some((info) => info.filter(selected)))
          ),
        "融合素材とするモンスターを選択",
        false
      )) ?? materials;
  }

  // 逆引き
  const entiteisPattern = entiteisPatterns.find(
    (item) =>
      item.requiredSeqList.every((seq) => materials.map((selected) => selected.seq).includes(seq)) &&
      materials.filter((selected) => !item.requiredSeqList.includes(selected.seq)).every((selected) => overmuchs.some((info) => info.filter(selected)))
  );
  if (!entiteisPattern) {
    throw new SystemError("想定されない状態", myInfo, materials);
  }

  const materialInfos = entiteisPattern.infos;

  // 追加素材分を追加
  materialInfos.push(
    ...materials
      .filter((selected) => !entiteisPattern.requiredSeqList.includes(selected.seq))
      .map((material) => {
        return {
          material,
          cell: material.cell,
        };
      })
  );
  const [, , , , options] = args;
  const materialDestMapper = {
    ...duelFieldCellTypes.reduce((wip, current) => {
      const tmp = { ...wip };
      tmp[current] = current === "Graveyard" ? { to: "Banished" } : { to: "Graveyard" };
      return tmp;
    }, {} as MaterialDestMapper),
    ...options.materialDestMapper,
  };
  const mapped = Object.groupBy(materials, (m) => m.cell.cellType);

  for (const cellType of getKeys(mapped)) {
    const dest = materialDestMapper[cellType].to;
    const position = materialDestMapper[cellType].position ?? cellTypeToDefaultPosition[dest];
    const face = cellTypeToDefaultFace[dest];
    if (!mapped[cellType]) {
      continue;
    }

    await DuelEntityShortHands.bringManyToSameCellForTheSameReason(
      dest,
      position,
      mapped[cellType],
      face,
      "Vertical",
      ["FusionMaterial", "Effect", "SpecialSummonMaterial"],
      myInfo.action.entity,
      myInfo.activator
    );
  }

  //融合召喚
  await myInfo.activator.summon(
    "FusionSummon",
    ["Effect", "SpecialSummon"],
    myInfo.action,
    monster,
    faceupBattlePositions,
    [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")],
    materialInfos,
    false
  );

  monster.info.isRebornable = !monster.origin.monsterCategories?.includes("RegularSpecialSummonOnly");

  materialInfos.map((info) => info.material).forEach((material) => material.onUsedAsMaterial(myInfo, myInfo.action.entity));

  return true;
};

export const getDefaultFusionSummonAction = (
  summonFrom: Readonly<DuelFieldCellType[]>,
  monsterValidator: (myInfo: ChainBlockInfoBase<unknown>, monster: DuelEntity) => boolean,
  materialsFrom: Readonly<DuelFieldCellType[]>,
  materialsValidator: (myInfo: ChainBlockInfoBase<unknown>, monster: DuelEntity, materials: DuelEntity[]) => boolean,
  options: {
    materialDestMapper?: Partial<MaterialDestMapper>;
    requisitionFrom?: Readonly<DuelFieldCellType[]>;
  } = {}
): CardActionDefinitionFunctions<unknown> & { fixedTags: TActionTag[] } => {
  return {
    fixedTags: ["SpecialSummonFromExtraDeck"],
    canExecute: (myInfo) =>
      getEnableFusionSummonPatterns(myInfo, summonFrom, monsterValidator, materialsFrom, materialsValidator, options).some(
        (pattern) => pattern.materialInfos.length
      ),
    prepare: defaultPrepare,
    execute: (myInfo) => defaultFusionSummonExecute(myInfo, summonFrom, monsterValidator, materialsFrom, materialsValidator, options),
    settle: async () => true,
  };
};

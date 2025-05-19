import { faceupBattlePositions, type TBattlePosition } from "@ygo/class/YgoTypes";
import type { ChainBlockInfoBase, SummonMaterialInfo, TEffectTag, ChainBlockInfo, CardActionDefinitionFunctions } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell, DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import { SystemError } from "@ygo_duel/class/Duel";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { min } from "@stk_utils/funcs/StkMathUtils";

type TRitualLevelValitationType = "Equal" | "OrMore";

const defaultRitualMaterialsValidator = (
  monster: DuelEntity,
  myInfo: ChainBlockInfoBase<unknown>,
  posList: Readonly<TBattlePosition[]>,
  cells: DuelFieldCell[],
  materials: DuelEntity[],
  validator: (materials: DuelEntity[]) => boolean,
  levelValiType: TRitualLevelValitationType
): SummonMaterialInfo[] | undefined => {
  if (!monster.lvl) {
    return;
  }
  // レベルを持たないモンスターが存在する場合、不可
  if (materials.some((material) => !material.lvl)) {
    return;
  }

  const totalLevel = materials.map((material) => material.lvl ?? 0).reduce((sum, lvl) => sum + lvl, 0);
  const minLevel = min(...materials.map((material) => material.lvl ?? 0));

  //レベルが不足する場合、不可
  if (totalLevel < monster.lvl) {
    return;
  }

  // 等しい必要がある場合、不一致は不可
  if (levelValiType === "Equal" && totalLevel !== monster.lvl) {
    return;
  }

  // 余計なモンスターを含む場合、不可
  if (levelValiType === "OrMore" && totalLevel - minLevel >= monster.lvl) {
    return;
  }

  // 儀式魔法側から見たチューナー側の条件チェック
  if (!validator(materials)) {
    return;
  }

  const materialInfos = [
    ...materials.map((material) => {
      return { material, cell: material.fieldCell };
    }),
  ];

  if (
    !myInfo.activator.getEnableSummonList(
      myInfo.activator,
      "RitualSummon",
      ["Effect", "SpecialSummon"],
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

function* getEnableRitualSummonPatterns(
  myInfo: ChainBlockInfoBase<unknown>,
  ...args: Parameters<typeof getDefaultRitualSummonActionPartical>
): Generator<{ monster: DuelEntity; materialInfos: SummonMaterialInfo[] }> {
  const [summonFrom, monsterValidator, materialsFrom, materialValidator, levelValiType] = args;

  const monsters = myInfo.activator
    .getCells(...summonFrom)
    .flatMap((cell) => cell.cardEntities)
    .filter((monster) => monster.status.monsterCategories?.includes("Ritual"))
    .filter(monsterValidator);

  if (!monsters.length) {
    return;
  }
  // 手札と場から全ての素材にできるモンスターを収集する。
  const materials = myInfo.activator
    .getCells(...materialsFrom)
    .flatMap((cell) => cell.cardEntities)
    .filter((monster) => monster.lvl)
    .filter((monster) => monster.canBeReleased(myInfo.activator, myInfo.action.entity, ["RitualMaterial", "ReleaseAsEffect"], myInfo.action));

  if (!materials.length) {
    return;
  }
  const cells = myInfo.activator.getMonsterZones();
  const posList: TBattlePosition[] = ["Attack", "Defense"];

  //全パターンを試し、儀式召喚可能なパターンを全て列挙する。
  for (const monster of monsters) {
    for (const pattern of materials.filter((material) => material !== monster).getAllOnOffPattern()) {
      const materialInfos = defaultRitualMaterialsValidator(monster, myInfo, posList, cells, pattern, materialValidator, levelValiType);
      if (materialInfos) {
        yield { monster, materialInfos };
      }
    }
  }
}

const defaultRitualSummonExecute = async (
  myInfo: ChainBlockInfo<unknown>,
  ...args: Parameters<typeof getDefaultRitualSummonActionPartical>
): Promise<boolean> => {
  // パターンを先に列挙しておく
  const patternInfos = getEnableRitualSummonPatterns(myInfo, ...args).toArray();

  const monsters = patternInfos.map((info) => info.monster).getDistinct();

  const monster = await myInfo.activator.waitSelectEntity(monsters, "儀式召喚するモンスターを選択。");

  if (!monster) {
    return false;
  }

  const patterns = patternInfos.filter((info) => info.monster === monster).map((info) => info.materialInfos);

  // 逆引きできるように準備
  const entiteisPatterns = patterns.map((infos) => {
    return { infos, materialSeqList: infos.map((info) => info.material.seq).sort() };
  });

  // 初期候補をセット
  let materials = patterns[0].map((info) => info.material);

  if (patterns.length > 1) {
    const choices = patterns.flatMap((p) => p.map((info) => info.material)).getDistinct();
    materials =
      (await myInfo.activator.waitSelectEntities(
        choices,
        undefined,
        (selected) => {
          //
          const materialSeqList = selected.map((monster) => monster.seq).sort();
          return entiteisPatterns.some(
            (item) => materialSeqList.length === item.materialSeqList.length && materialSeqList.every((seq, index) => seq === item.materialSeqList[index])
          );
        },
        "リリースするモンスターを選択",
        false
      )) ?? materials;
  }

  const materialSeqList = materials.map((monster) => monster.seq).sort();
  const materialInfos = entiteisPatterns.find(
    (item) => materialSeqList.length === item.materialSeqList.length && materialSeqList.every((seq, index) => seq === item.materialSeqList[index])
  )?.infos;

  if (!materialInfos) {
    throw new SystemError("想定されない状態", myInfo, materials);
  }
  await DuelEntityShortHands.releaseManyForTheSameReason(
    materials,
    ["RitualMaterial", "Effect", "SpecialSummonMaterial"],
    myInfo.action.entity,
    myInfo.activator
  );
  await myInfo.activator.summon(
    "RitualSummon",
    ["Effect", "SpecialSummon"],
    myInfo.action,
    monster,
    faceupBattlePositions,
    myInfo.activator.getMonsterZones(),
    materialInfos,
    false
  );

  monster.info.isRebornable = !monster.origin.monsterCategories?.includes("RegularSpecialSummonOnly");

  materialInfos.map((info) => info.material).forEach((material) => material.onUsedAsMaterial(myInfo, myInfo.action.entity));
  return true;
};

export const getDefaultRitualSummonActionPartical = (
  summonFrom: DuelFieldCellType[],
  monsterValidator: (monster: DuelEntity) => boolean,
  materialsFrom: DuelFieldCellType[],
  materialValidator: (materials: DuelEntity[]) => boolean,
  levelValiType: TRitualLevelValitationType
): CardActionDefinitionFunctions<unknown> => {
  return {
    canExecute: (myInfo) =>
      getEnableRitualSummonPatterns(myInfo, summonFrom, monsterValidator, materialsFrom, materialValidator, levelValiType).some(
        (pattern) => pattern.materialInfos.length
      ),
    prepare: async () => {
      const tags: TEffectTag[] = [];
      if (summonFrom.includes("Hand")) {
        tags.push("SpecialSummonFromHand");
      }
      if (summonFrom.includes("Graveyard")) {
        tags.push("SpecialSummonFromGraveyard");
      }
      if (summonFrom.includes("ExtraDeck")) {
        tags.push("SpecialSummonFromExtraDeck");
      }
      if (summonFrom.includes("Banished")) {
        tags.push("SpecialSummonFromBanished");
      }
      if (summonFrom.includes("Deck")) {
        tags.push("SpecialSummonFromDeck");
      }
      return { selectedEntities: [], chainBlockTags: tags };
    },
    execute: (myInfo) => defaultRitualSummonExecute(myInfo, summonFrom, monsterValidator, materialsFrom, materialValidator, levelValiType),
    settle: async () => true,
  };
};

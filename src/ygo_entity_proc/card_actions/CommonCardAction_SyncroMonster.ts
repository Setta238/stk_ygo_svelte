import { type TBattlePosition } from "@ygo/class/YgoTypes";
import type { ChainBlockInfoBase, ChainBlockInfo, CardActionDefinition, SummonMaterialInfo, ActionCostInfo } from "@ygo_duel/class/DuelEntityAction";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { SystemError } from "@ygo_duel/class/Duel";
import { defaultRuleSummonExecute, defaultRuleSummonPrepare } from "./CommonCardAction_Monster";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
const defaultSyncroMaterialsValidator = (
  myInfo: ChainBlockInfoBase<unknown>,
  posList: Readonly<TBattlePosition[]>,
  cells: DuelFieldCell[],
  materials: DuelEntity[],
  tunersValidator: (tuners: DuelEntity[]) => boolean,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean
): SummonMaterialInfo[] | undefined => {
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
      return { material: tuner, cell: tuner.fieldCell, isAsTuner: true };
    }),
    ...nonTuners.map((nonTuner) => {
      return { material: nonTuner, cell: nonTuner.fieldCell, isAsTuner: false };
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

function* getEnableSyncroSummonPatterns(
  myInfo: ChainBlockInfoBase<unknown>,
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): Generator<SummonMaterialInfo[]> {
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
    return;
  }

  const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.duel.field.getCells("ExtraMonsterZone")];
  const posList: TBattlePosition[] = ["Attack", "Defense"];

  //全パターンを試し、シンクロ召喚可能なパターンを全て列挙する。
  yield* materials
    .getAllOnOffPattern()
    .map((tst) => {
      console.log(tst.map((e) => e.toString()));
      return tst;
    })
    .filter((pattern) => pattern.some((monster) => monster.status.allowHandSyncro) || pattern.every((monster) => monster.isOnFieldAsMonsterStrictly))
    .map((pattern) => defaultSyncroMaterialsValidator(myInfo, posList, cells, pattern, tunersValidator, nonTunersValidator) ?? [])
    .filter((materialInfos) => materialInfos.length);
}

const defaultSyncroSummonPayCost = async (
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
      "シンクロ素材とするモンスターを選択",
      cancelable
    );
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
    ["SyncroMaterial", "Cost", "Rule", "SpecialSummonMaterial"],
    myInfo.action.entity,
    myInfo.activator
  );
  return { summonMaterialInfos: materialInfos };
};

export const getDefaultSyncroSummonAction = (
  tunersValidator: (tuners: DuelEntity[]) => boolean = (tuners) => tuners.length === 1,
  nonTunersValidator: (nonTuners: DuelEntity[]) => boolean = (nonTuners) => nonTuners.length > 0
): CardActionDefinition<unknown> => {
  return {
    title: "シンクロ召喚",
    isMandatory: false,
    playType: "SpecialSummon",
    spellSpeed: "Normal",
    executableCells: ["ExtraDeck"],
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    getEnableMaterialPatterns: (myInfo) => getEnableSyncroSummonPatterns(myInfo, tunersValidator, nonTunersValidator),
    canPayCosts: (myInfo) => myInfo.action.getEnableMaterialPatterns(myInfo).some((infos) => infos.length),
    canExecute: (myInfo) => !myInfo.ignoreCost || myInfo.activator.getAvailableExtraZones().length + myInfo.activator.getAvailableMonsterZones().length > 0,
    payCosts: defaultSyncroSummonPayCost,
    prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "SyncroSummon", ["Rule", "SpecialSummon", "SyncroSummon"], ["Attack", "Defense"]),
    execute: defaultRuleSummonExecute,
    settle: async () => true,
  };
};

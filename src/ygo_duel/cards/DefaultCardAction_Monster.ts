import {} from "@stk_utils/funcs/StkArrayUtils";
import { type TBattlePosition } from "@ygo/class/YgoTypes";
import { SystemError } from "@ygo_duel/class/Duel";
import {
  CardAction,
  type CardActionDefinition,
  type CardActionDefinitionAttr,
  type ChainBlockInfo,
  type ChainBlockInfoBase,
  type ChainBlockInfoPrepared,
} from "@ygo_duel/class/DuelCardAction";
import { type TDuelCauseReason, DuelEntity, namedSummonRuleCauseReasons } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { defaultPrepare } from "./DefaultCardAction";
import type { Duelist } from "@ygo_duel/class/Duelist";
import type { MaterialInfo } from "./CardDefinitions";
import type { SubstituteEffectDefinition } from "@ygo_duel/class/DuelSubstituteEffect";
import type { SummonFilter } from "@ygo_duel/class_continuous_effect/DuelSummonFilter";
export const defaultNormalSummonValidate = (myInfo: ChainBlockInfoBase<MaterialInfo[]>): DuelFieldCell[] | undefined => {
  // 召喚権を使い切っていたら通常召喚不可。
  if (myInfo.activator.info.ruleNormalSummonCount >= myInfo.activator.info.maxRuleNormalSummonCount) {
    return;
  }

  // レベルがないモンスターは通常召喚不可
  if (!myInfo.action.entity.lvl) {
    return;
  }

  if (myInfo.action.entity.lvl < 5) {
    // 4以下はリリースモンスターの考慮不要
    const list = myInfo.activator.getEnableSummonList(
      myInfo.activator,
      "NormalSummon",
      ["Rule"],
      myInfo.action,
      [{ monster: myInfo.action.entity, posList: ["Attack", "Set"], cells: myInfo.activator.getMonsterZones() }],
      [],
      false
    );

    return list.length ? list.flatMap((item) => item.cells).getDistinct() : undefined;
  } else {
    const releasableMonsters = myInfo.activator.getReleasableMonsters();

    const qty = myInfo.action.entity.lvl < 7 ? 1 : 2;

    // リリース可能なモンスターが不足する場合、アドバンス召喚不可
    if (releasableMonsters.length < qty) {
      return;
    }

    // TODO ダブルコストモンスター
    const patterns = releasableMonsters.getAllOnOffPattern().filter((pattern) => pattern.length === qty);

    if (
      patterns.some(
        (pattern) =>
          myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "AdvanceSummon",
            ["Rule", "NormalSummon"],
            myInfo.action,
            [{ monster: myInfo.action.entity, posList: ["Attack", "Set"], cells: myInfo.activator.getMonsterZones() }],
            pattern.map((material) => {
              return { material };
            }),
            false
          ).length
      )
    ) {
      // リリース処理が先にくるので、選択可能なセルはなし
      return [];
    }
  }
  return;

  // TODO : クロス・ソウルの「しなければならない」の制限の考慮。エクストラモンスターゾーンまたは相手モンスターゾーンにしかリリース可能なモンスターがいない場合、空きが必要。
  // if (emptyCells.length > 0 || releasableMonsters.filter((m) => m.controller === entity.controller && m.fieldCell.cellType === "MonsterZone")) {
  //   return true;
  // }
};

export const defaultNormalSummonPrepare = async (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable: boolean
): Promise<ChainBlockInfoPrepared<MaterialInfo[]> | undefined> => {
  if (!myInfo.action.entity.lvl) {
    return;
  }
  let _cancelable = cancelable;
  let materialInfos: MaterialInfo[] = [];

  if (myInfo.action.entity.lvl > 4) {
    const availableCells = myInfo.activator.getAvailableMonsterZones();
    const releasableMonsters = myInfo.activator.getReleasableMonsters();
    const exZoneMonsters = myInfo.activator.getExtraMonsterZones();
    const qty = myInfo.action.entity.lvl < 7 ? 1 : 2;

    if (exZoneMonsters.length >= qty) {
      releasableMonsters.filter((monster) => monster.fieldCell.cellType !== "ExtraMonsterZone");
    }

    const materials =
      (await myInfo.activator.duel.view.waitSelectEntities(
        myInfo.activator,
        myInfo.activator.getReleasableMonsters(),
        qty,
        (selected) =>
          (_cancelable || selected.length > 0) &&
          (qty < 0 || selected.length === qty) &&
          (availableCells.length > 0 || selected.some((matetial) => matetial.fieldCell.cellType === "ExtraMonsterZone")),
        "リリースするモンスターを選択",
        cancelable
      )) ?? [];

    //リリースしなければキャンセル。
    if (!materials.length) {
      return;
    }
    // リリース後はキャンセル不可
    _cancelable = false;

    await DuelEntity.releaseManyForTheSameReason(materials, ["Cost", "AdvanceSummonRelease", "Rule"], myInfo.action.entity, myInfo.activator);

    // 詰め直し
    materialInfos = materials.map((material) => {
      return { material };
    });
  }

  return { selectedEntities: [], chainBlockTags: [], prepared: materialInfos };
};

export const defaultNormalSummonExecute = async (myInfo: ChainBlockInfo<MaterialInfo[]>): Promise<boolean> => {
  const movedAs: TDuelCauseReason[] = ["Rule", "NormalSummon"];
  let summonRule: TDuelCauseReason = "NormalSummon";
  if (myInfo.prepared.length > 0) {
    summonRule = "AdvanceSummon";
    movedAs.push("AdvanceSummon");
  }

  const availableCells = myInfo.dest ? [myInfo.dest] : myInfo.activator.getAvailableMonsterZones();

  await myInfo.activator.summon(summonRule, movedAs, myInfo.action, myInfo.action.entity, ["Attack", "Set"], availableCells, myInfo.prepared, false);

  return true;
};
export const defaultRuleSpecialSummonValidate = (
  myInfo: ChainBlockInfoBase<MaterialInfo[]>,
  posList: Readonly<TBattlePosition[]>,
  materials: MaterialInfo[]
): DuelFieldCell[] | undefined => {
  // セルを取得
  const cells = myInfo.activator.getMonsterZones();

  // エクストラデッキにいる場合、エクストラモンスターゾーンも使用可能
  if (myInfo.action.entity.fieldCell.cellType === "ExtraDeck") {
    cells.push(...myInfo.activator.getAvailableExtraZones());
  }
  const summmonList = myInfo.activator.getEnableSummonList(
    myInfo.activator,
    "SpecialSummon",
    ["Rule"],
    myInfo.action,
    [{ monster: myInfo.action.entity, posList, cells: cells }],
    materials,
    false
  );

  if (!summmonList.length) {
    return;
  }

  return materials.length === 0 ? cells : [];
};

export const defaultRuleSpecialSummonPrepare = async (materialInfos: MaterialInfo[]): Promise<ChainBlockInfoPrepared<MaterialInfo[]> | undefined> => {
  return { selectedEntities: [], chainBlockTags: [], prepared: materialInfos };
};

export const defaultRuleSpecialSummonExecute = async (myInfo: ChainBlockInfo<MaterialInfo[]>, posList: Readonly<TBattlePosition[]>): Promise<boolean> => {
  const movedAs: TDuelCauseReason[] = ["Rule", "SpecialSummon"];

  // セルを取得
  const cells = myInfo.activator.getMonsterZones();

  // エクストラデッキにいる場合、エクストラモンスターゾーンも使用可能
  if (myInfo.action.entity.fieldCell.cellType === "ExtraDeck") {
    cells.push(...myInfo.activator.getAvailableExtraZones());
  }
  const monster = await myInfo.activator.summon("SpecialSummon", movedAs, myInfo.action, myInfo.action.entity, posList, cells, myInfo.prepared, false);

  return Boolean(monster);
};

export const defaultNormalSummonAction: CardActionDefinition<MaterialInfo[]> = {
  title: "通常召喚",
  isMandatory: false,

  playType: "NormalSummon",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  validate: defaultNormalSummonValidate,
  prepare: defaultNormalSummonPrepare,
  execute: defaultNormalSummonExecute,
  settle: async () => true,
};

export const defaultDeclareAttackValidate = (myInfo: ChainBlockInfoBase<undefined>): DuelFieldCell[] | undefined => {
  if (!myInfo.activator.isTurnPlayer) {
    return undefined;
  }
  const targets = myInfo.action.entity.getAttackTargets();

  // 攻撃対象をダイレクトアタック含めて抽出し、セルに変換
  return targets.length ? targets.map((e) => e.fieldCell) : undefined;
};
export const defaultDeclareAttackPrepare = async (myInfo: ChainBlockInfoBase<undefined>): Promise<ChainBlockInfoPrepared<undefined> | undefined> => {
  if (myInfo.action.entity.info.attackCount > 0 || myInfo.action.entity.battlePosition !== "Attack") {
    return;
  }

  // 準備段階でセルを指定していた場合、エンティティに逆変換
  if (myInfo.dest?.targetForAttack) {
    return { selectedEntities: myInfo.dest.cardEntities, chainBlockTags: [], prepared: undefined };
  }

  const choices = myInfo.action.entity.getAttackTargets();

  if (choices.length === 0) {
    throw new SystemError("想定されない状態", myInfo);
  }
  if (choices.length === 1) {
    return { selectedEntities: choices, chainBlockTags: [], prepared: undefined };
  }

  if (myInfo.activator.duelistType === "NPC") {
    let target = myInfo.activator.selectAttackTargetForNPC(myInfo.action.entity, myInfo.action as CardAction<unknown>);
    if (!target) {
      myInfo.activator.duel.log.warn("NPCの攻撃対象選択に失敗したため、ランダムに攻撃対象を選択。");
      target = choices.randomPick();
    }
    return { selectedEntities: [target], chainBlockTags: [], prepared: undefined };
  }

  const targets = await myInfo.action.entity.field.duel.view.waitSelectEntities(
    myInfo.activator,
    choices,
    1,
    (list) => list.length === 1,
    "攻撃対象を選択。",
    true
  );

  if (!targets) {
    return;
  }

  return { selectedEntities: targets, chainBlockTags: [], prepared: undefined };
};
export const defaultDeclareAttackExecute = async (myInfo: ChainBlockInfo<undefined>): Promise<boolean> => {
  myInfo.action.entity.field.duel.declareAnAttack(myInfo.action.entity, myInfo.selectedEntities[0]);

  return true;
};

export const defaultAttackAction: CardActionDefinition<undefined> = {
  title: "攻撃宣言",
  isMandatory: false,

  playType: "Battle",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  executablePeriods: ["b1Battle", "b2Battle"],
  executableDuelistTypes: ["Controller"],
  validate: defaultDeclareAttackValidate,
  prepare: defaultDeclareAttackPrepare,
  execute: defaultDeclareAttackExecute,
  settle: async () => true,
};

export const defaultBattlePotisionChangeValidate = (myInfo: ChainBlockInfoBase<undefined>): DuelFieldCell[] | undefined => {
  if (myInfo.action.entity.info.battlePotisionChangeCount > 0 || myInfo.action.entity.info.attackCount > 0 || !myInfo.activator.isTurnPlayer) {
    return undefined;
  }
  return [];
};

export const defaultBattlePotisionChangeExecute = async (myInfo: ChainBlockInfo<undefined>): Promise<boolean> => {
  if (myInfo.action.entity.info.battlePotisionChangeCount > 0 || !myInfo.activator.isTurnPlayer) {
    return false;
  }

  await myInfo.action.entity.setBattlePosition(
    myInfo.action.entity.battlePosition === "Attack" ? "Defense" : "Attack",
    ["Rule"],
    myInfo.action.entity,
    myInfo.activator
  );

  console.log(myInfo.action.entity.toString());

  myInfo.action.entity.info.battlePotisionChangeCount++;
  return true;
};

export const defaultBattlePotisionChangeAction: CardActionDefinition<undefined> = {
  title: "表示形式変更",
  isMandatory: false,

  playType: "ChangeBattlePosition",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  validate: defaultBattlePotisionChangeValidate,
  prepare: defaultPrepare,
  execute: defaultBattlePotisionChangeExecute,
  settle: async () => true,
};

/**
 *
 * @param effectOwner
 * @param summoner
 * @param moveAs
 * @param actDefAttr
 * @param monster
 * @param materialInfos
 * @param posList
 * @param cells
 * @returns
 */
export const defaultNoLimitSummonFilter = (
  effectOwner: Duelist,
  summoner: Duelist,
  moveAs: TDuelCauseReason[],
  actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
  monster: DuelEntity,
  materialInfos: MaterialInfo[],
  posList: TBattlePosition[],
  cells: DuelFieldCell[]
): {
  posList: TBattlePosition[];
  cells: DuelFieldCell[];
} => {
  return { posList, cells };
};

export const defaultSelfRebornExecute = async <T>(myInfo: ChainBlockInfo<T>, posList: TBattlePosition[] = ["Attack", "Defense"]) => {
  const cells = myInfo.activator.getMonsterZones();
  if (myInfo.action.entity.wasMovedAfter(myInfo.isActivatedAt)) {
    return false;
  }
  await myInfo.activator.summon("SpecialSummon", ["Effect"], myInfo.action, myInfo.action.entity, posList, cells, [], false);

  return true;
};
/**
 * 通常の特殊召喚モンスター用
 * @param effectOwner
 * @param summoner
 * @param moveAs
 * @param actDefAttr
 * @param monster
 * @param materialInfos
 * @param posList
 * @param cells
 * @returns
 */
export const defaultSummonFilter = (
  filter: SummonFilter,
  filterTarget: DuelEntity,
  effectOwner: Duelist,
  summoner: Duelist,
  moveAs: TDuelCauseReason[],
  actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
  monster: DuelEntity,
  materialInfos: MaterialInfo[],
  posList: Readonly<TBattlePosition[]>,
  cells: DuelFieldCell[],
  ignoreSummoningConditions: boolean
): {
  posList: Readonly<TBattlePosition[]>;
  cells: DuelFieldCell[];
} => {
  const ok = { posList, cells };
  const notAllowed = { posList: [], cells: [] };

  // 素材は判定しない
  if (filterTarget !== monster) {
    return ok;
  }

  // モンスターのみ
  if (monster.status.kind !== "Monster") {
    return ok;
  }

  // モンスターのみ
  if (!monster.origin.monsterCategories) {
    return ok;
  }

  // 特殊召喚できないモンスター（※神、スピリットなど）
  if (monster.origin.monsterCategories.includes("NormalSummonOnly")) {
    if (moveAs.includes("NormalSummon") || moveAs.includes("AdvanceSummon")) {
      return ok;
    }
    return notAllowed;
  }

  // 特殊召喚モンスターでなければ全て可
  if (!monster.origin.monsterCategories.includes("SpecialSummon")) {
    return ok;
  }

  // 墓地に存在する場合、蘇生制限を満たしていれば可
  if (monster.isInTrashCell) {
    if (monster.info.isRebornable) {
      return ok;
    }
    return notAllowed;
  }

  // 名前のある召喚方法は可
  if (moveAs.union(namedSummonRuleCauseReasons).length) {
    return ok;
  }

  // 正規方法のみ可の場合でも、召喚条件を無視すれば可
  if (monster.origin.monsterCategories.includes("RegularSpecialSummonOnly")) {
    if (ignoreSummoningConditions) {
      return ok;
    }
    return notAllowed;
  }
  return ok;
};

// 使いまわしたほうがメモリの節約になったりする？
const _selfBattleSubstituteEffectDefinitionDic: { [times: number]: SubstituteEffectDefinition } = {};
export const getSelfBattleSubstituteEffectDefinition = (times: number): SubstituteEffectDefinition => {
  if (!_selfBattleSubstituteEffectDefinitionDic[times]) {
    _selfBattleSubstituteEffectDefinitionDic[times] = {
      title: `戦闘破壊耐性(${times})`,
      isMandatory: true,
      executableCells: ["MonsterZone"],
      executablePeriods: ["b1DDmgCalc", "b2DDmgCalc"],
      executableDuelistTypes: ["Controller"],
      isOnlyNTimesPerTurnIfFaceup: times,
      isApplicableTo: (effect, destroyType, targets) => {
        console.log(effect.entity.toString(), effect, destroyType, targets);
        if (!targets.includes(effect.entity)) {
          return [];
        }
        if (destroyType !== "BattleDestroy") {
          return [];
        }
        return [effect.entity];
      },
      substitute: async (effect, destroyType, targets) => {
        if (!targets.includes(effect.entity)) {
          return [];
        }
        if (destroyType !== "BattleDestroy") {
          return [];
        }
        if (!effect.entity.isEffective) {
          return [];
        }
        effect.entity.controller.writeInfoLog(`${effect.entity.toString()}は１ターンに１度だけ戦闘では破壊されない。`);
        return [effect.entity];
      },
    };
  }

  return _selfBattleSubstituteEffectDefinitionDic[times];
};

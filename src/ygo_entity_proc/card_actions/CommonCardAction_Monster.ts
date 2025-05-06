import {} from "@stk_utils/funcs/StkArrayUtils";
import { type TBattlePosition } from "@ygo/class/YgoTypes";
import { SystemError } from "@ygo_duel/class/Duel";
import {
  EntityAction,
  type ActionCostInfo,
  type CardActionDefinition,
  type CardActionDefinitionAttr,
  type ChainBlockInfo,
  type ChainBlockInfoBase,
  type ChainBlockInfoPrepared,
  type SummonMaterialInfo,
} from "../../ygo_duel/class/DuelEntityAction";
import { type TDuelCauseReason, type TSummonKindCauseReason, DuelEntity, namedSummonKindCauseReasons } from "@ygo_duel/class/DuelEntity";
import { monsterZoneCellTypes, type DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type { Duelist } from "@ygo_duel/class/Duelist";
import type { SubstituteEffectDefinition } from "@ygo_duel/class/DuelSubstituteEffect";
import type { SummonFilter } from "@ygo_duel/class_continuous_effect/DuelSummonFilter";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import { defaultPrepare } from "./CommonCardAction";
import { createRegularStatusOperatorHandler, type ContinuousEffectBase } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
const defaultNormalSummonValidate = (myInfo: ChainBlockInfoBase<unknown>): DuelFieldCell[] | undefined => {
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
    const releasableMonsters = myInfo.activator
      .getMonstersOnField()
      .filter((monster) => monster.canBeReleased(myInfo.activator, myInfo.action.entity, ["AdvanceSummonRelease"], myInfo.action));

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
              return { material, cell: material.fieldCell };
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

const defaultNormalSummonPayCost = async (
  myInfo: ChainBlockInfoBase<unknown>,
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
  cancelable?: boolean
): Promise<ActionCostInfo | undefined> => {
  if (!myInfo.action.entity.lvl) {
    return;
  }

  if (myInfo.action.entity.lvl < 5) {
    return {};
  }
  const availableCells = myInfo.activator.getAvailableMonsterZones();
  let releasableMonsters = myInfo.activator
    .getMonstersOnField()
    .filter((monster) => monster.canBeReleased(myInfo.activator, myInfo.action.entity, ["AdvanceSummonRelease"], myInfo.action));
  const exZoneMonsters = myInfo.activator.getExtraMonsterZones();
  const qty = myInfo.action.entity.lvl < 7 ? 1 : 2;

  if (exZoneMonsters.length >= qty) {
    releasableMonsters = releasableMonsters.filter((monster) => monster.fieldCell.cellType !== "ExtraMonsterZone");
  }

  const materials =
    (await myInfo.activator.waitSelectEntities(
      releasableMonsters,
      qty,
      (selected) =>
        (cancelable || selected.length > 0) &&
        (qty < 0 || selected.length === qty) &&
        (availableCells.length > 0 || selected.some((matetial) => matetial.fieldCell.cellType === "ExtraMonsterZone")),
      "リリースするモンスターを選択",
      cancelable ?? false
    )) ?? [];

  //リリースしなければキャンセル。
  if (!materials.length) {
    return;
  }
  await DuelEntityShortHands.releaseManyForTheSameReason(materials, ["Cost", "AdvanceSummonRelease", "Rule"], myInfo.action.entity, myInfo.activator);

  // 詰め直し
  const summonMaterialInfos = materials.map((material) => {
    return { material, cell: material.fieldCell };
  });

  return { summonMaterialInfos };
};

const defaultNormalSummonPrepare = async (myInfo: ChainBlockInfoBase<unknown>): Promise<ChainBlockInfoPrepared<unknown> | undefined> => {
  const movedAs: TDuelCauseReason[] = ["Rule", "NormalSummon"];
  let summonKind: TDuelCauseReason = "NormalSummon";
  if (myInfo.costInfo.summonMaterialInfos?.length) {
    summonKind = "AdvanceSummon";
    movedAs.push("AdvanceSummon");
  }

  const availableCells = myInfo.dest ? [myInfo.dest] : myInfo.activator.getAvailableMonsterZones();
  return defaultRuleSummonPrepare(myInfo, summonKind, movedAs, ["Attack", "Set"], availableCells);
};
export const defaultRuleSummonPrepare = async (
  myInfo: ChainBlockInfoBase<unknown>,
  summonKind: TSummonKindCauseReason,
  movedAs: TDuelCauseReason[],
  posList: Readonly<TBattlePosition[]>,
  cells?: DuelFieldCell[]
): Promise<ChainBlockInfoPrepared<unknown> | undefined> => {
  let _cells = myInfo.dest ? [myInfo.dest] : cells;

  if (!_cells) {
    // セルを取得
    _cells = myInfo.activator.getMonsterZones();

    // エクストラデッキにいる場合、エクストラモンスターゾーンも使用可能
    if (myInfo.action.entity.fieldCell.cellType === "ExtraDeck") {
      _cells.push(...myInfo.activator.duel.field.getCells("ExtraMonsterZone"));
    }
  }

  await myInfo.activator.summon(summonKind, movedAs, myInfo.action, myInfo.action.entity, posList, _cells, myInfo.costInfo.summonMaterialInfos ?? [], false);
  return { selectedEntities: [], chainBlockTags: [], prepared: undefined };
};
export const defaultRuleSummonExecute = async (myInfo: ChainBlockInfo<unknown>): Promise<boolean> => {
  myInfo.action.entity.info.isRebornable = !myInfo.action.entity.origin.monsterCategories?.includes("RegularSpecialSummonOnly");
  myInfo.action.entity.determine();
  myInfo.costInfo.summonMaterialInfos?.map((info) => info.material).forEach((material) => material.onUsedAsMaterial(myInfo, myInfo.action.entity));
  return true;
};

export const defaultNormalSummonAction: CardActionDefinition<unknown> = {
  title: "通常召喚",
  isMandatory: false,
  playType: "NormalSummon",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  validate: defaultNormalSummonValidate,
  payCosts: defaultNormalSummonPayCost,
  prepare: defaultNormalSummonPrepare,
  execute: defaultRuleSummonExecute,
  settle: async () => true,
};

export const defaultRuleSpecialSummonValidate = <T>(
  myInfo: ChainBlockInfoBase<T>,
  posList: Readonly<TBattlePosition[]>,
  materials: SummonMaterialInfo[]
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

  return materials.length === 0 ? summmonList.flatMap((item) => item.cells) : [];
};

export const defaultRuleSpecialSummonPrepare = async (
  materialInfos: SummonMaterialInfo[]
): Promise<ChainBlockInfoPrepared<SummonMaterialInfo[]> | undefined> => {
  return { selectedEntities: [], chainBlockTags: [], prepared: materialInfos };
};

export const defaultRuleSpecialSummonExecute = async (myInfo: ChainBlockInfo<SummonMaterialInfo[]>, posList: Readonly<TBattlePosition[]>): Promise<boolean> => {
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

const defaultDeclareAttackValidate = (myInfo: ChainBlockInfoBase<unknown>): DuelFieldCell[] | undefined => {
  if (!myInfo.activator.isTurnPlayer) {
    return undefined;
  }
  const targets = myInfo.action.entity.getAttackTargets();

  // 攻撃対象をダイレクトアタック含めて抽出し、セルに変換
  return targets.length ? targets.map((e) => e.fieldCell) : undefined;
};
const defaultDeclareAttackPrepare = async (myInfo: ChainBlockInfoBase<unknown>): Promise<ChainBlockInfoPrepared<unknown> | undefined> => {
  if (myInfo.action.entity.info.attackCount > 0 || myInfo.action.entity.battlePosition !== "Attack") {
    return;
  }

  // 準備段階でセルを指定していた場合、エンティティに逆変換
  if (myInfo.dest?.targetForAttack) {
    const opponent = myInfo.dest.entities.find((entity) => entity.entityType === "Duelist");

    return { selectedEntities: opponent ? [opponent] : myInfo.dest.cardEntities, chainBlockTags: [], prepared: undefined };
  }

  const choices = myInfo.action.entity.getAttackTargets();

  if (choices.length === 0) {
    throw new SystemError("想定されない状態", myInfo);
  }
  if (choices.length === 1) {
    return { selectedEntities: choices, chainBlockTags: [], prepared: undefined };
  }

  if (myInfo.activator.duelistType === "NPC") {
    let target = myInfo.activator.selectAttackTargetForNPC(myInfo.action.entity, myInfo.action as EntityAction<unknown>);
    if (!target) {
      myInfo.activator.duel.log.warn("NPCの攻撃対象選択に失敗したため、ランダムに攻撃対象を選択。");
      target = choices.randomPick();
    }
    return { selectedEntities: [target], chainBlockTags: [], prepared: undefined };
  }

  const target = await myInfo.activator.waitSelectEntity(choices, "攻撃対象を選択。", true);

  if (!target) {
    return;
  }

  return { selectedEntities: [target], chainBlockTags: [], prepared: undefined };
};
const defaultDeclareAttackExecute = async (myInfo: ChainBlockInfo<unknown>): Promise<boolean> => {
  myInfo.action.entity.field.duel.declareAnAttack(myInfo.action.entity, myInfo.selectedEntities[0]);

  return true;
};

export const defaultAttackAction: CardActionDefinition<unknown> = {
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

const defaultBattlePotisionChangePrepare = async (myInfo: ChainBlockInfoBase<unknown>): Promise<ChainBlockInfoPrepared<unknown> | undefined> => {
  if (myInfo.action.entity.info.battlePotisionChangeCount > 0 || !myInfo.activator.isTurnPlayer) {
    return;
  }
  await myInfo.action.entity.setBattlePosition(
    myInfo.action.entity.battlePosition === "Attack" ? "Defense" : "Attack",
    ["Rule"],
    myInfo.action.entity,
    myInfo.activator
  );

  myInfo.action.entity.info.battlePotisionChangeCount++;

  return { selectedEntities: [], chainBlockTags: [], prepared: undefined };
};

export const defaultFlipSummonAction: CardActionDefinition<unknown> = {
  title: "反転召喚",
  isMandatory: false,
  playType: "FlipSummon",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  validate: (myInfo) =>
    myInfo.action.entity.info.battlePotisionChangeCount === 0 &&
    myInfo.action.entity.info.attackCount === 0 &&
    myInfo.activator.isTurnPlayer &&
    myInfo.action.entity.face === "FaceDown"
      ? []
      : undefined,
  prepare: defaultBattlePotisionChangePrepare,
  execute: async (myInfo) => {
    myInfo.action.entity.determine();

    return true;
  },
  settle: async () => true,
};
export const defaultBattlePotisionChangeAction: CardActionDefinition<unknown> = {
  title: "表示形式変更",
  isMandatory: false,

  playType: "ChangeBattlePosition",
  spellSpeed: "Normal",
  executableCells: ["MonsterZone", "ExtraMonsterZone"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  validate: (myInfo) =>
    myInfo.action.entity.info.battlePotisionChangeCount === 0 &&
    myInfo.action.entity.info.attackCount === 0 &&
    myInfo.activator.isTurnPlayer &&
    myInfo.action.entity.face === "FaceUp"
      ? []
      : undefined,
  prepare: defaultBattlePotisionChangePrepare,
  execute: async (myInfo) => {
    myInfo.action.entity.determine();
    return true;
  },
  settle: async () => true,
};

export const defaultSelfRebornExecute = async <T>(myInfo: ChainBlockInfo<T>, posList: TBattlePosition[] = ["Attack", "Defense"]) => {
  const cells = myInfo.activator.getMonsterZones();
  if (myInfo.action.entity.wasMovedAfter(myInfo.isActivatedAt)) {
    return false;
  }
  await myInfo.activator.summon("SpecialSummon", ["Effect"], myInfo.action, myInfo.action.entity, posList, cells, [], false);

  return true;
};

export const defaultNormalMonsterActions = [defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction, defaultNormalSummonAction];

/**
 * 通常の特殊召喚モンスター用
 * @param effectOwner
 * @param summoner
 * @param movedAs
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
  movedAs: TDuelCauseReason[],
  actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
  monster: DuelEntity,
  materialInfos: SummonMaterialInfo[],
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
  if (monster.kind !== "Monster") {
    return ok;
  }

  // モンスターのみ
  if (!monster.origin.monsterCategories) {
    return ok;
  }

  // 特殊召喚できないモンスター（※神、スピリットなど）
  if (monster.origin.monsterCategories.includes("NormalSummonOnly")) {
    if (movedAs.includes("NormalSummon") || movedAs.includes("AdvanceSummon")) {
      return ok;
    }
    return notAllowed;
  }

  // 特殊召喚モンスターでなければ全て可
  if (!monster.origin.monsterCategories.includes("SpecialSummon")) {
    return ok;
  }

  // 墓地に存在する場合、蘇生制限を満たしていれば可
  if (monster.isInTrashCell && !monster.origin.monsterCategories.includes("RegularSpecialSummonOnly")) {
    return monster.info.isRebornable || monster.origin.monsterCategories.includes("FreeReborn") ? ok : notAllowed;
  }

  // カードの効果でのみ特殊召喚できる特殊召喚モンスターは、ペンデュラム召喚不可
  if (movedAs.includes("PendulumSummon")) {
    if (monster.origin.monsterCategories.includes("FreeReborn")) {
      return notAllowed;
    }
  }

  // 名前のある召喚方法は可
  if (movedAs.union(namedSummonKindCauseReasons).length) {
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

export const defaultSelfReleaseCanPayCosts = <T>(myInfo: ChainBlockInfoBase<T>) =>
  myInfo.activator.canRelease([myInfo.action.entity]) &&
  myInfo.action.entity.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action);

export const defaultSelfReleasePayCosts = async <T>(myInfo: ChainBlockInfoBase<T>) => {
  await myInfo.action.entity.release(["Cost"], myInfo.action.entity, myInfo.activator);
  return { release: [myInfo.action.entity] };
};

export const getDefaultAccelSyncroACtion = <T>(options: Partial<CardActionDefinition<T>>): CardActionDefinition<T> => {
  return {
    title: "シンクロ召喚",
    isMandatory: false,
    playType: "QuickEffect",
    spellSpeed: "Quick",
    executableCells: monsterZoneCellTypes,
    executablePeriods: ["main1", "main2"],
    executableDuelistTypes: ["Controller"],
    isOnlyNTimesPerChain: 1,
    validate: (myInfo) => {
      if (myInfo.activator.isTurnPlayer) {
        return;
      }
      const flg = myInfo.activator
        .getExtraDeck()
        .cardEntities.filter((monster) => monster.status.monsterCategories?.includes("Syncro"))
        .flatMap((monster) => monster.actions)
        .filter((action) => action.playType === "SpecialSummon")
        .map((action) => {
          return {
            index: -1,
            chainNumber: undefined,
            action,
            activator: myInfo.activator,
            targetChainBlock: undefined,
            isActivatedIn: action.entity.fieldCell,
            isActivatedAt: myInfo.isActivatedAt,
            costInfo: {},
            state: "unloaded",
            dest: undefined,
            ignoreCost: false,
          } as ChainBlockInfoBase<unknown>;
        })
        .some((childInfo) =>
          childInfo.action.getEnableMaterialPatterns(childInfo).some((infos) => {
            const materials = infos.map((info) => info.material);
            //全て自分フィールド上のモンスターかつ、このカード自身を含む必要がある。
            return (
              materials.every((material) => material.controller === myInfo.activator) &&
              materials.every((material) => material.isOnFieldAsMonsterStrictly) &&
              materials.includes(myInfo.action.entity)
            );
          })
        );
      return flg ? [] : undefined;
    },
    prepare: defaultPrepare,
    execute: async (myInfo): Promise<boolean> => {
      // 「このカードを含む自分フィールド上のモンスター」であるため、コントロール奪取をされていた場合不可
      if (myInfo.activator !== myInfo.action.entity.controller) {
        return false;
      }

      // レベルを持つモンスターが２体いない場合不可
      if (myInfo.activator.getMonstersOnField().filter((monster) => monster.lvl !== undefined).length < 2) {
        return false;
      }

      // シンクロ召喚できるシンクロモンスターを抜き出し
      const syncroMonsters = myInfo.activator
        .getExtraDeck()
        .cardEntities.filter((monster) => monster.status.monsterCategories?.includes("Syncro"))
        .flatMap((monster) => monster.actions)
        .filter((action) => action.playType === "SpecialSummon")
        .map((action) => {
          return {
            index: -1,
            chainNumber: undefined,
            action,
            activator: myInfo.activator,
            targetChainBlock: undefined,
            isActivatedIn: action.entity.fieldCell,
            isActivatedAt: myInfo.isActivatedAt,
            costInfo: {},
            state: "unloaded",
            dest: undefined,
            ignoreCost: false,
          } as ChainBlockInfoBase<unknown>;
        })
        .filter((childInfo) =>
          childInfo.action.getEnableMaterialPatterns(childInfo).some((infos) => {
            const materials = infos.map((info) => info.material);
            //全て自分フィールド上のモンスターかつ、このカード自身を含む必要がある。
            return (
              materials.every((material) => material.controller === myInfo.activator) &&
              materials.every((material) => material.isOnFieldAsMonsterStrictly) &&
              materials.includes(myInfo.action.entity)
            );
          })
        )
        .map((childInfo) => childInfo.action.entity)
        .getDistinct();

      if (!syncroMonsters.length) {
        return false;
      }

      const selected =
        (await myInfo.activator.waitSelectEntities(syncroMonsters, 1, (selected) => selected.length === 1, "シンクロ召喚するモンスターを選択。", false)) ?? [];

      if (!selected.length) {
        throw new SystemError("想定されない状態", myInfo);
      }

      const syncroSummonAction = selected[0].actions.find((action) => action.playType === "SpecialSummon");

      if (!syncroSummonAction) {
        throw new SystemError("想定されない状態", myInfo);
      }

      // 「このカードを含む自分フィールド上のモンスター」という制約を付加したダミーアクションを作成する。
      const dammySyncroSummonAction = syncroSummonAction.getClone((infos) => {
        const materials = infos.map((info) => info.material);
        //全て自分フィールド上のモンスターかつ、このカード自身を含む必要がある。
        return (
          materials.every((material) => material.controller === myInfo.activator) &&
          materials.every((material) => material.isOnFieldAsMonsterStrictly) &&
          materials.includes(myInfo.action.entity)
        );
      });

      // 次に行うアクションとして設定。
      myInfo.nextActionInfo = { action: dammySyncroSummonAction, originSeq: dammySyncroSummonAction.seq };

      return true;
    },
    settle: async () => true,
    ...options,
  };
};

export const defaultDirectAtackEffect = createRegularStatusOperatorHandler(
  "直接攻撃",
  "Monster",
  (source) => [source],
  (source) => {
    return [
      new StatusOperator(
        "直接攻撃",
        () => true,
        true,
        source,
        {},
        (operator, target) => operator.isSpawnedBy === target,
        (ope, wip) => {
          return { ...wip, canDirectAttack: true };
        }
      ),
    ];
  }
) as ContinuousEffectBase<unknown>;

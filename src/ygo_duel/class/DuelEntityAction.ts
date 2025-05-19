import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { DuelFieldCell, DuelFieldCellType } from "./DuelFieldCell";
import { type Duelist } from "./Duelist";
import { DuelEntity } from "./DuelEntity";
import { EntityActionBase, type EntityActionDefinitionBase } from "./DuelEntityActionBase";
import type { IDuelClock } from "./DuelClock";
import { SystemError, type ResponseActionInfo } from "./Duel";
import { max } from "@stk_utils/funcs/StkMathUtils";
import { DuelEntityShortHands } from "./DuelEntityShortHands";
import { Statable, type IStatable } from "./DuelUtilTypes";

export const executableDuelistTypes = ["Controller", "Opponent"] as const;
export type TExecutableDuelistType = (typeof executableDuelistTypes)[number];

export const cardActionRuleSummonTypes = ["NormalSummon", "SpecialSummon", "FlipSummon"] as const;
export type TCardActionRuleSummonType = (typeof cardActionRuleSummonTypes)[number];
export const cardActionChainBlockTypes = ["IgnitionEffect", "TriggerEffect", "QuickEffect", "CardActivation"] as const;
export type TCardActionChainBlockType = (typeof cardActionChainBlockTypes)[number];
export const cardActionCreateChainTypes = [...cardActionRuleSummonTypes, ...cardActionChainBlockTypes, "DeclareAttack"] as const;
export type TCardActionCreateChainTypes = (typeof cardActionCreateChainTypes)[number];
export const cardActionDeclareTypes = ["Surrender", "ChangePhase"] as const;
export type CardActionDeclareTypes = (typeof cardActionDeclareTypes)[number];
export const cardActionNonChainBlockTypes = ["ChangeBattlePosition", "SpellTrapSet", "LingeringEffect", "Battle"] as const;
export type TCardActionNonChainBlockType = (typeof cardActionNonChainBlockTypes)[number];
export type TCardActionType =
  | TCardActionCreateChainTypes
  | TCardActionNonChainBlockType
  | "Dammy"
  | "RuleDraw"
  | "SystemPeriodAction"
  | "AfterChainBlock"
  | "Exodia";

export const effectActiovationTypes = ["CardActivation", "EffectActivation", "NonActivate"] as const;
export type TEffectActiovationType = (typeof effectActiovationTypes)[number];
export const getEffectActiovationType = (actionType: TCardActionType): TEffectActiovationType => {
  if (actionType === "CardActivation") {
    return "CardActivation";
  }

  if (cardActionChainBlockTypes.some((at) => at === actionType)) {
    return "EffectActivation";
  }

  return "NonActivate";
};

export type TSpellSpeed = "Normal" | "Quick" | "Counter" | "Dammy";
export const effectTags = [
  "NormalSummon",
  "AdvanceSummon",
  "SpecialSummon",
  "SpecialSummonFromDeck", //うらら
  "SendToGraveyardFromDeck", //うらら
  "Draw", //うらら
  "SearchFromDeck", //うらら
  "BanishFromDeck", //今のところない？
  "BanishFromGraveyard", //わらし
  "AddToHandFromGraveyard", //わらし
  "ReturnToDeckFromGraveyard", //わらし
  "SpecialSummonFromGraveyard", //わらし
  "SpecialSummonFromBanished", //
  "ReturnToHandFromGraveyard", //
  "ReturnToHandFromField", //
  "BanishFromField", //今のところない？
  "BanishFromHand", //今のところない？
  "Destroy",
  "DestroyMultiple",
  "DestroyOnField", //スタダ
  "DestroyMultipleOnField", //大革命返し
  "DestroyOnOpponentField",
  "DestroyMultipleOnOpponentField", //スタロ
  "DestroyMonsterOnField", //悲劇の引き金（要対象確認）
  "DestroyMonstersOnField", //我が身を盾に
  "DestroySpellTrapOnField", //アヌビスの裁き
  "DestroySpellTrapsOnField", //アヌビスの裁き
  "SpecialSummonFromHand",
  "SpecialSummonFromExtraDeck",
  "IfNormarlSummonSucceed", //畳返し
  "IfSpecialSummonSucceed", //ツバメ返し
  "DamageToOpponent", //地獄の扉越し銃
  "DamageToSelf", //地獄の扉越し銃（セルフチェーン）
  "PayLifePoint", //キャッシュバック
  "DiscordAsCost",
  "DiscordAsEffect",
  "RollDice", //ダイスインパクト
  "BounceToHand", //リ・バウンド
  "NegateCardEffect",
  "NegateCardActivation",
  "NegateNormalSummon",
  "NegateSpecialSummon",
] as const;
export type TEffectTag = (typeof effectTags)[number];

export type SummonMaterialInfo = {
  material: DuelEntity;
  cell: DuelFieldCell;
  level?: number;
  link?: number;
  isAsTuner?: boolean;
  name?: string;
};
export const summonMaterialCostTypes = ["summonMaterialInfos"] as const;
export type TSummonMaterialCostType = (typeof summonMaterialCostTypes)[number];
export const NumericCostTypes = ["lifePoint", "xyzMaterial", "counter"] as const;
export type TNumericCostType = (typeof NumericCostTypes)[number];
export const EntityCostTypes = ["discard", "banish", "release", "returnToDeck", "returnToHand", "sendToGraveyard"] as const;
export type TEntityCostType = (typeof EntityCostTypes)[number];
export const CostTypes = [...NumericCostTypes, ...EntityCostTypes, ...summonMaterialCostTypes] as const;
export type TCostType = (typeof CostTypes)[number];

export type ActionCostInfo = {
  [key in TCostType]?: key extends TNumericCostType ? number : key extends TSummonMaterialCostType ? SummonMaterialInfo[] : DuelEntity[];
};

export type DummyActionInfo = {
  action: ICardAction;
  dests: DuelFieldCell[];
  dest?: DuelFieldCell;
  battlePosition?: TBattlePosition;
  originSeq: number;
};
type TChainBlockInfoState = "unloaded" | "ready" | "processing" | "done" | "failed" | "nagated";
export type ChainBlockInfoBase<T> = {
  /**
   * 配列上のindex
   */
  index: number;
  /**
   * 表示上の番号
   */
  chainNumber: number | undefined;
  action: EntityAction<T>;
  activator: Duelist;
  targetChainBlock: ChainBlockInfo<unknown> | undefined;
  state: TChainBlockInfoState;
  dest: DuelFieldCell | undefined;
  ignoreCost: boolean;
  data?: T;
};

export type ChainBlockInfoPreparing<T> = ChainBlockInfoBase<T> & {
  isActivatedIn: DuelFieldCell;
  isActivatedAt: IDuelClock;
  isNegatedActivationBy?: EntityAction<unknown>;
  isNegatedEffectBy?: EntityAction<unknown>;
  costInfo: ActionCostInfo;
  enableCellTypes: DuelFieldCellType[];
};

export type ChainBlockInfoPrepared = {
  chainBlockTags: TEffectTag[];
  selectedEntities: DuelEntity[];
  /** 緊急同調など */
  nextActionInfo?: ResponseActionInfo;
  /** 超融合など */
  nextChainBlockFilter?: (activator: Duelist, action: EntityAction<unknown>) => boolean;
};
export type ChainBlockInfo<T> = ChainBlockInfoPreparing<T> & ChainBlockInfoPrepared & IStatable<TChainBlockInfoState>;

export type CardActionDefinitionAttrs = EntityActionDefinitionBase & {
  playType: TCardActionType;
  spellSpeed: TSpellSpeed;
  hasToTargetCards?: boolean;
  /**
   * コスト払う必要があるかどうか（コピー効果用）
   */
  needsToPayCost?: boolean;
  /**
   * 光の護封剣などの例外のみ指定が必要
   */
  isLikeContinuousSpell?: boolean;

  /**
   *NPC用プロパティ
   */
  negatePreviousBlock?: boolean;

  /**
   * チェーンに乗らない召喚特殊召喚を無効にできるかどうか
   */
  negateSummon?: boolean;

  /**
   * チェーンチェック設定を無視して通知する
   */
  isNoticedForcibly?: boolean;
  /**
   * NPC用プロパティ
   */
  priorityForNPC?: number;

  // 夢幻泡影など
  canActivateCardDirectly?: boolean;
};
export type CardActionDefinitionFunctions<T> = {
  getEnableMaterialPatterns?: (myInfo: ChainBlockInfoBase<T>) => Generator<SummonMaterialInfo[]>;
  /**
   * コストの支払い可否判断
   * @param myInfo
   * @param chainBlockInfos
   * @returns
   */
  canPayCosts?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => boolean;
  /**
   * 発動条件判断
   * ※「自分フィールドに「ブラック・マジシャン」が存在する場合に発動できる。」など、コピー時に無視できることがある条件判断
   * @param myInfo
   * @param chainBlockInfos
   * @returns
   */
  meetsConditions?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => boolean;
  /**
   * 空撃ち判断など、発動に際して無視できない条件判断
   * @param myInfo
   * @param chainBlockInfos
   * @returns
   */
  canExecute?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => boolean | "RemoveMe";

  getTargetableEntities?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => DuelEntity[];

  /**
   * 発動時にドラッグ・アンド・ドロップ可能である場合の選択肢のcellを返す。
   * @param myInfo
   * @param chainBlockInfos
   * @returns 発動時にドラッグ・アンド・ドロップ可能である場合、選択肢のcellが返る。
   */
  getDests?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => DuelFieldCell[];

  payCosts?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => Promise<ActionCostInfo | undefined>;
  /**
   * 対象に取るなど
   * @param myInfo
   * @param chainBlockInfos
   * @param cancelable
   * @returns
   */
  prepare: (
    myInfo: ChainBlockInfoPreparing<T>,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    cancelable: boolean
  ) => Promise<ChainBlockInfoPrepared | undefined>;
  /**
   * 実際の処理部分
   * @param myInfo
   * @param chainBlockInfos
   * @returns
   */
  execute: (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => Promise<boolean>;
  settle: (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => Promise<boolean>;
};

export type CardActionDefinition<T> = CardActionDefinitionAttrs & CardActionDefinitionFunctions<T>;
export type ValidatedActionInfo = {
  action: EntityAction<unknown>;
  dests: DuelFieldCell[];
  originSeq: number;
};

export interface ICardAction {
  title: string;
  entity: DuelEntity;
  seq: number;
  getClone: () => ICardAction;
}

export class EntityAction<T> extends EntityActionBase implements ICardAction {
  public static readonly createNew = <T>(entity: DuelEntity, definition: CardActionDefinition<T>) => {
    return new EntityAction<T>("AutoSeq", entity, definition);
  };

  /**
   * @param entity
   * @param title
   * @param cells
   * @param pos
   * @returns
   */
  public static readonly createDummyAction = (
    entity: DuelEntity,
    title: string,
    dests: DuelFieldCell[],
    battlePosition?: TBattlePosition,
    origin?: EntityActionBase
  ): DummyActionInfo => {
    const action = EntityAction.createNew(entity, {
      title: title,
      isMandatory: false,
      executableCells: [],
      executablePeriods: [],
      executableDuelistTypes: [],
      playType: "Dammy",
      spellSpeed: "Dammy",
      getDests: () => dests,
      prepare: async () => undefined,
      execute: async () => false,
      settle: async () => false,
    }) as ICardAction;

    // TODO   tmp.dragAndDropOnly = cells.length > 1;

    return { action, dests, battlePosition, originSeq: origin?.seq ?? -1 };
  };
  public override get definition() {
    return super.definition as Readonly<CardActionDefinition<T>>;
  }
  public get playType() {
    return this.definition.playType;
  }

  public get spellSpeed() {
    return this.definition.spellSpeed;
  }
  public get needsToPayCost() {
    return this.definition.needsToPayCost ?? false;
  }

  public get hasToTargetCards() {
    return this.definition.hasToTargetCards ?? false;
  }

  public get isWithChainBlock() {
    return cardActionChainBlockTypes.some((t) => t === this.playType);
  }
  public readonly getTargetableEntities = (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
    if (this.definition.hasToTargetCards && !this.definition.getTargetableEntities) {
      throw new SystemError(`処理定義が矛盾している。${this.toFullString()}`, this);
    }
    if (!this.definition.getTargetableEntities) {
      return [];
    }
    return this.definition.getTargetableEntities(myInfo, chainBlockInfos);
  };
  public get isLikeContinuousSpell() {
    return this.definition.isLikeContinuousSpell || (this.entity.isLikeContinuousSpell && this.playType === "CardActivation");
  }

  public get isNoticedForcibly() {
    return (
      this.isMandatory ||
      this.definition.playType === "TriggerEffect" ||
      this.definition.playType === "LingeringEffect" ||
      this.negatePreviousBlock ||
      this.negateSummon
    );
  }

  public get negatePreviousBlock() {
    return this.definition.negatePreviousBlock ?? false;
  }

  public get negateSummon() {
    return this.definition.negateSummon ?? false;
  }

  public get priorityForNPC() {
    return this.definition.priorityForNPC ?? Number.NaN;
  }

  public readonly toString = () => {
    if (this.playType === "CardActivation") {
      return "カードの発動";
    }
    if (this.isWithChainBlock) {
      return `«${this.title}»`;
    }
    return this.title;
  };
  public readonly toFullString = () => {
    return `${this.entity.toString()}の${this.toString()}`;
  };

  /**
   * 素材情報に制限を加えて実行するときに使用する。
   */
  private readonly addhocMaterialLimitation: (materialInfos: SummonMaterialInfo[]) => boolean;

  protected constructor(
    seq: "AutoSeq" | number,
    entity: DuelEntity,
    definition: EntityActionDefinitionBase,
    addhocMaterialLimitation?: (materialInfos: SummonMaterialInfo[]) => boolean
  ) {
    super(seq, entity, definition);
    this.addhocMaterialLimitation = addhocMaterialLimitation ?? (() => true);
  }

  public readonly getClone = (addhocMateriallimitation?: (materialInfos: SummonMaterialInfo[]) => boolean) => {
    return new EntityAction<T>(this.seq, this.entity, this.definition, addhocMateriallimitation);
  };

  public *getEnableMaterialPatterns(myInfo: ChainBlockInfoBase<T>) {
    if (this.definition.getEnableMaterialPatterns) {
      yield* this.definition.getEnableMaterialPatterns(myInfo).filter(this.addhocMaterialLimitation);
    }
  }

  public readonly validateCount = (activator: Duelist, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>): boolean => {
    // このチェーン上で、同一の効果が発動している回数をカウント。
    const currentChainCount = chainBlockInfos.filter((info) => this.isSameGroup(info.action)).length;
    if (this.isOnlyNTimesPerDuel > 0) {
      if (
        this.entity.field.duel.chainBlockLog.records
          .filter((rec) => !rec.chainBlockInfo.isNegatedActivationBy)
          .filter((rec) => this.isSameGroup(rec.chainBlockInfo.action))
          .filter((rec) => rec.chainBlockInfo.activator === activator).length +
          currentChainCount >=
        this.isOnlyNTimesPerDuel
      ) {
        return false;
      }
    }
    if (this.isOnlyNTimesPerTurn > 0) {
      if (
        this.entity.field.duel.chainBlockLog.records
          .filter((rec) => !rec.chainBlockInfo.isNegatedActivationBy)
          .filter((rec) => this.isSameGroup(rec.chainBlockInfo.action))
          .filter((rec) => rec.clock.turn === this.entity.field.duel.clock.turn)
          .filter((rec) => rec.chainBlockInfo.activator === activator).length +
          currentChainCount >=
        this.isOnlyNTimesPerTurn
      ) {
        return false;
      }
    }
    if (this.isOnlyNTimesPerChain > 0 && currentChainCount >= this.isOnlyNTimesPerChain) {
      return false;
    }

    // このターンに発動した回数を加算
    const count = currentChainCount + this.entity.counterHolder.getActionCount(this);

    if (this.isOnlyNTimesPerTurnIfFaceup > 0 && count >= this.isOnlyNTimesPerTurnIfFaceup) {
      return false;
    }
    if (this.isOnlyNTimesIfFaceup > 0 && count >= this.isOnlyNTimesIfFaceup) {
      return false;
    }
    return true;
  };

  public readonly validate = (
    activator: Duelist,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    options: ("IgnoreCosts" | "IgnoreConditions" | "CopyEffectOnly")[] = []
  ): ValidatedActionInfo | undefined => {
    const ignoreCosts = options.includes("IgnoreCosts");
    const ignoreConditions = options.includes("IgnoreConditions");
    const copyEffectOnly = options.includes("CopyEffectOnly");

    if (this.isWithChainBlock && !this.entity.status.canActivateEffect) {
      return;
    }

    if (ignoreCosts && this.needsToPayCost) {
      return;
    }

    if (!this.validateCount(activator, chainBlockInfos)) {
      return;
    }

    const maxChainNumber = max(0, ...chainBlockInfos.map((info) => info.chainNumber ?? -1));

    const myInfo: ChainBlockInfoBase<T> = {
      index: chainBlockInfos.length,
      chainNumber: this.isWithChainBlock ? maxChainNumber + 1 : undefined,
      action: this,
      activator: activator,
      targetChainBlock: chainBlockInfos.slice(-1)[0],
      state: "unloaded",
      dest: undefined,
      ignoreCost: false,
    };

    if (this.definition.canPayCosts && !ignoreCosts) {
      if (!this.definition.canPayCosts(myInfo, this.playType === "AfterChainBlock" ? [] : chainBlockInfos)) {
        return;
      }
    }
    if (this.definition.meetsConditions && !ignoreConditions) {
      if (!this.definition.meetsConditions(myInfo, this.playType === "AfterChainBlock" ? [] : chainBlockInfos)) {
        return;
      }
    }
    if (this.definition.canExecute) {
      const canExecute = this.definition.canExecute(myInfo, this.playType === "AfterChainBlock" ? [] : chainBlockInfos);
      if (canExecute === "RemoveMe") {
        this.entity.actions.reset(...this.entity.actions.filter((action) => action.seq !== this.seq));
        return;
      }
      if (!canExecute) {
        return;
      }
    }

    const dests: DuelFieldCell[] = [];
    if (this.definition.getDests) {
      dests.push(...this.definition.getDests(myInfo, this.playType === "AfterChainBlock" ? [] : chainBlockInfos));
    }

    if (this.playType === "CardActivation" && !copyEffectOnly) {
      const _dests = this.getDestForCardActivation(activator);
      if (!_dests) {
        return;
      }
      dests.push(..._dests);
    } else if (this.playType === "SpellTrapSet") {
      if (this.entity.status.spellCategory === "Field") {
        dests.push(activator.getFieldZone());
      } else {
        dests.push(...activator.getAvailableSpellTrapZones());
      }
    }
    return { action: this as EntityAction<unknown>, dests, originSeq: this.seq };
  };

  private readonly getDestForCardActivation = (activator: Duelist): DuelFieldCell[] | undefined => {
    // 発動待機中は不可
    if (this.entity.info.isPending) {
      return;
    }
    // 破壊予定の場合は不可
    if (this.entity.info.isDying) {
      return;
    }
    // セットされたターンは発動不可
    if (this.entity.info.isSettingSickness) {
      return;
    }
    // フィールドの場合、セット状態であれば可、それ以外は不可
    if (this.entity.isOnFieldAsSpellTrapStrictly) {
      return this.entity.face === "FaceDown" ? [] : undefined;
    }

    // フィールドにも手札にもない場合、不可
    if (this.entity.fieldCell.cellType !== "Hand") {
      return;
    }

    //手札からの発動はレッド・リブートなどの特別な場合か、ターンプレイヤーのみ可能
    if (this.definition.canActivateCardDirectly || !activator.isTurnPlayer) {
      return;
    }

    // フィールド魔法は可
    if (this.entity.status.spellCategory === "Field") {
      return [activator.getFieldZone()];
    }

    let availableCells = activator.getAvailableSpellTrapZones();
    if (this.entity.status.monsterCategories?.includes("Pendulum")) {
      // ペンデュラムの場合、発動先はペンデュラムゾーンのみ
      availableCells = availableCells.filter((cell) => cell.isAvailableForPendulum);
    }
    return availableCells;
  };

  public readonly prepare = async (
    activator: Duelist,
    cell: DuelFieldCell | undefined,
    targetChainBlock: ChainBlockInfo<unknown> | undefined,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    cancelable: boolean,
    ignoreCosts: boolean
  ): Promise<ChainBlockInfo<T> | undefined> => {
    let _cell = cell;
    let _cancelable = cancelable;
    const chainNumber = this.isWithChainBlock ? max(0, ...chainBlockInfos.map((info) => info.chainNumber ?? -1)) + 1 : undefined;

    let logText = "";

    if (chainNumber !== undefined) {
      logText += `チェーン${chainNumber}: `;
    }

    if (this.playType === "CardActivation" || this.playType === "SpellTrapSet") {
      if (this.entity.fieldCell.cellType === "Hand") {
        //魔法・罠・ペンデュラムスケールのカードの発動またはセットの場合、コスト支払いの前に移動処理を行う。

        let availableCells = this.entity.status.spellCategory === "Field" ? [activator.getFieldZone()] : activator.getAvailableSpellTrapZones();

        if (this.entity.status.monsterCategories?.includes("Pendulum")) {
          // ペンデュラムの場合、発動先はペンデュラムゾーンのみ
          availableCells = availableCells.filter((cell) => cell.isAvailableForPendulum);
        }
        if (_cell && availableCells.includes(_cell)) {
          // ドラッグ・アンド・ドロップが移動先の指定として行われていた場合、置き換え
          availableCells = [_cell];
          // 以降の処理に渡さないために初期化
          _cell = undefined;
        }

        if (this.entity.status.spellCategory === "Field") {
          // フィールド魔法を手札から発動する場合、既存のフィールドがあれば上書き
          const olds = activator.getFieldZone().cardEntities;
          if (olds.length) {
            const oldOne = olds[0];
            await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(activator.getFieldZone().cardEntities, ["Rule"], this.entity, activator);
            activator.writeInfoLog(`フィールド魔法の上書きにより、${oldOne.toString()}は墓地に送られた。`);
            _cancelable = false;
          }
        }

        let dest = availableCells[0];

        if (availableCells.length > 1) {
          dest = availableCells.randomPick();
          const actionTitle = this.playType === "SpellTrapSet" ? "セット" : "カードの発動";
          const _dest = await this.duel.view.waitSelectDestination(
            activator,
            this.entity,
            availableCells,
            "カードを移動先へドラッグ",
            actionTitle,
            _cancelable
          );
          if (!_dest) {
            return;
          }
          dest = _dest;
        }

        logText += `手札から`;
        if (this.playType === "SpellTrapSet") {
          logText += "魔法・罠カードをセット。";
        } else {
          logText += `${this.entity.toString()}を発動。`;
        }

        activator.writeInfoLog(logText);

        _cancelable = false;
        if (this.playType === "CardActivation") {
          this.entity.info.isPending = true;
        }
        if (this.entity.status.monsterCategories?.includes("Pendulum")) {
          await this.entity.activateAsPendulumScale(dest, ["CardActivation"], this.entity, activator);
        } else if (this.playType === "CardActivation") {
          await this.entity.activateSpellTrapFromHand(dest, this.entity.kind, ["CardActivation"], this.entity, activator);
        } else {
          await this.entity.setAsSpellTrap(dest, this.entity.kind, ["SpellTrapSet"], this.entity, activator);
        }
      } else if (this.entity.isOnField && this.entity.face === "FaceDown") {
        logText += `セットされていた${this.entity.toString()}を発動。`;

        activator.writeInfoLog(logText);
        _cancelable = false;
        if (this.playType === "CardActivation") {
          this.entity.info.isPending = true;
        }

        // セット状態からの発動ならば、表にする。
        await this.entity.setNonFieldMonsterPosition(this.entity.origin.kind, "FaceUp", ["Rule"]);
      }
    } else if (chainNumber !== undefined) {
      logText += `${this.toFullString()}を発動。`;

      activator.writeInfoLog(logText);
    }

    // チェーンブロック情報の準備
    const myInfo: ChainBlockInfoPreparing<T> = {
      index: chainBlockInfos.length,
      chainNumber,
      action: this,
      activator: activator,
      targetChainBlock,
      isActivatedIn: this.entity.fieldCell,
      isActivatedAt: this.duel.clock.getClone(),
      enableCellTypes: [...this.entity.info.isEffectiveIn],
      costInfo: {},
      state: "ready",
      dest: _cell,
      ignoreCost: false,
    };

    if (this.definition.payCosts && !ignoreCosts) {
      const costInfo = await this.definition.payCosts(myInfo, chainBlockInfos, _cancelable);
      if (!costInfo) {
        return;
      }
      myInfo.costInfo = costInfo;
      _cancelable = false;
    }

    // 準備
    const prepared = await this.definition.prepare(myInfo, chainBlockInfos, _cancelable);
    if (prepared === undefined) {
      return;
    }
    const _prepared = { ...prepared };
    if (cardActionRuleSummonTypes.some((type) => type === this.playType)) {
      const tmpFilter = prepared.nextChainBlockFilter ?? (() => true);
      _prepared.nextChainBlockFilter = (activator, action) => action.negateSummon && tmpFilter(activator, action);
    }

    const result: Partial<ChainBlockInfo<T>> = new Statable<TChainBlockInfoState>(myInfo.state);
    const temp = { ...myInfo, ..._prepared };
    (Object.keys(temp) as (keyof typeof temp)[])
      .filter((key) => key !== "state")
      .forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        result[key] = temp[key];
      });
    return result as ChainBlockInfo<T>;
  };

  public readonly execute = async (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
    if (myInfo.action.isLikeContinuousSpell && (myInfo.action.entity.face === "FaceDown" || !myInfo.action.entity.isOnField)) {
      // 永続魔法類は、フィールドに表側表示で存在しないと処理できない。
      this.entity.info.isPending = false;
      myInfo.state = "failed";
      return false;
    }

    myInfo.state = "processing";

    let result = false;
    if (myInfo.chainNumber) {
      myInfo.activator.writeInfoLog(`チェーン${myInfo.chainNumber}: ${myInfo.action.toFullString()}の効果処理。`);
    }

    // 有効無効判定
    if (myInfo.isNegatedActivationBy) {
      myInfo.state = "nagated";
      // 発動無効時は全ての処理を行わない
      if (myInfo.chainNumber) {
        myInfo.activator.writeInfoLog(
          `チェーン${myInfo.chainNumber}: ${myInfo.action.toFullString()}を${myInfo.isNegatedActivationBy.toFullString()}によって発動が無効にされた。`
        );
      }
    } else {
      // 効果無効時は後処理のみ行う

      // カードの効果が有効かどうか
      let isEffective = myInfo.action.entity.isEffective;

      // ログ出力するテキストを用意
      let nagationText = "";

      if (isEffective) {
        if (myInfo.isNegatedEffectBy) {
          // うららなどの効果処理のみ無効にするタイプ
          nagationText = `チェーン${myInfo.chainNumber}: ${myInfo.action.toFullString()}を${myInfo.isNegatedEffectBy.toFullString()}によって効果を無効にした。`;
          isEffective = false;
        } else if (this.isWithChainBlock && !myInfo.enableCellTypes.includes(myInfo.isActivatedIn.cellType)) {
          // 発動時にエフェクト・ヴェーラーなどに発動場所を参照する無効が適用されていた場合、移動ログを検索する。
          const moveLogRecord = myInfo.action.entity.moveLog.records.findLast((rec) => rec.face === "FaceDown" && rec.orientation === "Horizontal");

          // 同じチェーン中に、一度以上裏守備を経由していればいいはず
          // TODO 要検討
          isEffective = (moveLogRecord && myInfo.activator.duel.clock.isSameChain(moveLogRecord.movedAt)) ?? false;
        }
      }

      // 有効であれば、効果処理を行う。
      if (isEffective) {
        result = await this.definition.execute(myInfo, chainBlockInfos);
        myInfo.state = result ? "done" : "failed";
      } else {
        myInfo.state = "nagated";
        if (myInfo.chainNumber) {
          nagationText =
            nagationText || `チェーン${myInfo.chainNumber}: カードの効果が無効となっているため${myInfo.action.toFullString()}の効果処理を行えない。`;
        }
        myInfo.activator.writeInfoLog(nagationText);
      }

      // TODO 確認：永続魔法類の発動時の効果処理と適用開始はどちらが先か？
      // 一旦、早すぎた埋葬に便利なので、効果処理を先に行う。
      this.entity.determine();

      // 誓約効果などの適用
      if (this.isOnlyNTimesPerTurnIfFaceup > 0) {
        this.entity.counterHolder.incrementActionCountPerTurn(this);
      } else if (this.isOnlyNTimesIfFaceup > 0) {
        this.entity.counterHolder.incrementActionCount(this);
      }
      this.definition.settle(myInfo, chainBlockInfos);
    }
    return result;
  };
  /**
   * 緊急同調など
   * @param activator
   * @param ignoreCost
   * @returns
   */
  public readonly directExecute = async (activator: Duelist, targetChainBlock: ChainBlockInfo<unknown> | undefined, ignoreCost: boolean) => {
    // チェーンブロック情報の準備
    const myInfo = await this.prepare(activator, undefined, targetChainBlock, [], false, ignoreCost);
    if (!myInfo) {
      throw new SystemError("想定されない状態", this, activator, ignoreCost);
    }
    activator.duel.chainBlockLog.push(myInfo);
    return await this.execute(myInfo, []);
  };

  public readonly isSame = (other: EntityAction<unknown>) => this.entity.origin.name === other.entity.origin.name && this.title === other.title;
  public readonly isSameGroup = (other: EntityAction<unknown>) =>
    this.actionGroupName ? this.entity.origin.name === other.entity.origin.name && this.actionGroupName === other.actionGroupName : this.isSame(other);

  public readonly calcChainBlockTagsForDestroy = (activator: Duelist, entities: DuelEntity[]): TEffectTag[] => {
    if (!effectTags.length) {
      return [];
    }
    const tags: TEffectTag[] = ["Destroy"];

    if (effectTags.length > 1) {
      tags.push("DestroyMultiple");
    }

    const cardsOnFields = entities.filter((card) => card.isOnFieldStrictly);

    if (cardsOnFields.length) {
      tags.push("DestroyOnField");
      if (cardsOnFields.length > 1) {
        tags.push("DestroyMultipleOnField");
      }
    }
    const monstersOnField = cardsOnFields.filter((card) => card.kind === "Monster");

    if (monstersOnField.length) {
      tags.push("DestroyMonsterOnField");
      if (monstersOnField.length > 1) {
        tags.push("DestroyMonstersOnField");
      }
    }

    const spellTraps = cardsOnFields.filter((card) => card.kind !== "Monster");
    if (spellTraps.length) {
      tags.push("DestroySpellTrapOnField");
      if (monstersOnField.length > 1) {
        tags.push("DestroySpellTrapsOnField");
      }
    }
    const cardsOnOpponentField = cardsOnFields.filter((card) => card.controller !== activator);
    if (cardsOnOpponentField.length) {
      tags.push("DestroyOnOpponentField");
      if (cardsOnOpponentField.length > 1) {
        tags.push("DestroyMultipleOnOpponentField");
      }
    }

    return tags;
  };
}

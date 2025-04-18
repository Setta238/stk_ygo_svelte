import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { DuelFieldCell } from "./DuelFieldCell";
import { type Duelist } from "./Duelist";
import { DuelEntity } from "./DuelEntity";
import { CardActionBase, type CardActionDefinitionBase } from "./DuelCardActionBase";
import type { IDuelClock } from "./DuelClock";
import { SystemError } from "./Duel";
import { max } from "@stk_utils/funcs/StkMathUtils";
export const executableDuelistTypes = ["Controller", "Opponent"] as const;
export type TExecutableDuelistType = (typeof executableDuelistTypes)[number];

export const cardActionRuleSummonTypes = ["NormalSummon", "SpecialSummon", "FlipSummon"] as const;
export type TCardActionRuleSummonType = (typeof cardActionRuleSummonTypes)[number];
export const cardActionChainBlockTypes = ["IgnitionEffect", "TriggerEffect", "QuickEffect", "CardActivation"] as const;
export type TCardActionChainBlockType = (typeof cardActionChainBlockTypes)[number];
export const cardActionCreateChainTypes = [...cardActionRuleSummonTypes, ...cardActionChainBlockTypes] as const;
export type TCardActionCreateChainTypes = (typeof cardActionCreateChainTypes)[number];
export const cardActionNonChainBlockTypes = ["ChangeBattlePosition", "Battle", "SpellTrapSet", "LingeringEffect"] as const;
export type TCardActionNonChainBlockType = (typeof cardActionNonChainBlockTypes)[number];
export type TCardActionType = TCardActionCreateChainTypes | TCardActionNonChainBlockType | "Dammy" | "RuleDraw" | "SystemPeriodAction";

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

export type ChainBlockInfoBase<T> = {
  /**
   * 配列上のindex
   */
  index: number;
  /**
   * 表示上の番号
   */
  chainNumber: number | undefined;
  action: CardAction<T>;
  activator: Duelist;
  targetChainBlock: ChainBlockInfo<unknown> | undefined;
  isActivatedIn: DuelFieldCell;
  isActivatedAt: IDuelClock;
  isNegatedActivationBy?: CardAction<unknown>;
  isNegatedEffectBy?: CardAction<unknown>;
  costInfo: ActionCostInfo;
  state: "unloaded" | "ready" | "done" | "failed";
  dest: DuelFieldCell | undefined;
  ignoreCost: boolean;
};

export type ChainBlockInfoPrepared<T> = {
  chainBlockTags: TEffectTag[];
  selectedEntities: DuelEntity[];
  prepared: T;
  nextAction?: CardAction<unknown>;
};
export type ChainBlockInfo<T> = ChainBlockInfoBase<T> & ChainBlockInfoPrepared<T>;

export type CardActionDefinitionAttr = CardActionDefinitionBase & {
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
   * NPC用プロパティ
   */
  priorityForNPC?: number;
};
export type CardActionDefinition<T> = CardActionDefinitionAttr & {
  getEnableMaterialPatterns?: (myInfo: ChainBlockInfoBase<T>) => SummonMaterialInfo[][];
  canPayCosts?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => boolean;

  /**
   * 発動可能かどうかの検証
   * @param myInfo
   * @param chainBlockInfos
   * @returns 発動時にドラッグ・アンド・ドロップ可能である場合、選択肢のcellが返る。
   */
  validate: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => DuelFieldCell[] | undefined;

  payCosts?: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, cancelable: boolean) => Promise<ActionCostInfo | undefined>;
  /**
   * コストの支払い、対象に取るなど
   * @param myInfo
   * @param cell
   * @param chainBlockInfos
   * @param cancelable
   * @returns
   */
  prepare: (
    myInfo: ChainBlockInfoBase<T>,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    cancelable: boolean
  ) => Promise<ChainBlockInfoPrepared<T> | undefined>;
  /**
   * 実際の処理部分
   * @param entity
   * @param activator
   * @param cell
   * @param prepared
   * @returns
   */
  execute: (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => Promise<boolean>;
  settle: (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => Promise<boolean>;
};
export interface ICardAction<T> {
  title: string;
  entity: DuelEntity;
  seq: number;
  playType: TCardActionType;
  spellSpeed: TSpellSpeed;
  hasToTargetCards: boolean;
  isOnlyNTimesPerTurn: number;
  isOnlyNTimesPerDuel: number;
  isOnlyNTimesPerChain: number;
  isLikeContinuousSpell: boolean;
  getClone: () => ICardAction<T>;
  /**
   *
   * @returns 発動時にドラッグ・アンド・ドロップ可能である場合、選択肢のcellが返る。
   */
  validate: (activator: Duelist, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, ignoreCosts: boolean) => DuelFieldCell[] | undefined;
  /**
   * チェーンに乗る処理の場合、コストの支払いや対象に取る処理までを行う。
   * @param cell 効果発動時にドラッグ・アンド・ドロップなどで指定されたセルがある場合、値が入る。
   * @returns 実行時に必要な任意の情報
   */
  prepare: (
    activator: Duelist,
    cell: DuelFieldCell | undefined,
    targetChainBlock: ChainBlockInfo<unknown> | undefined,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    cancelable: boolean,
    ignoreCosts: boolean
  ) => Promise<ChainBlockInfo<T> | undefined>;
  /**
   *
   * @param activator 効果発動時のコントローラー
   * @param cell 効果発動時にドラッグ・アンド・ドロップなどで指定されたセルがある場合、値が入る。
   * @param prepared 実行時に必要な任意の情報
   * @returns 不発の場合、false
   */
  execute: (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => Promise<boolean>;
  settle: (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => Promise<boolean>;
  autoWord?: string;
  cell?: DuelFieldCell;
  pos?: TBattlePosition;
  dragAndDropOnly?: boolean;
}

export class CardAction<T> extends CardActionBase implements ICardAction<T> {
  public static readonly createNew = <T>(entity: DuelEntity, definition: CardActionDefinition<T>) => {
    return new CardAction<T>("AutoSeq", entity, definition);
  };

  /**
   * @param entity
   * @param title
   * @param cells
   * @param pos
   * @returns
   */
  public static readonly createDammyAction = (entity: DuelEntity, title: string, cells: DuelFieldCell[], pos?: TBattlePosition): ICardAction<void> => {
    const tmp = CardAction.createNew(entity, {
      title: title,
      isMandatory: false,
      executableCells: [],
      executablePeriods: [],
      executableDuelistTypes: [],
      playType: "Dammy",
      spellSpeed: "Dammy",
      validate: () => cells,
      prepare: async () => undefined,
      execute: async () => false,
      settle: async () => false,
    }) as ICardAction<void>;

    tmp.pos = pos;
    tmp.cell = cells[0];
    tmp.dragAndDropOnly = cells.length > 1;

    return tmp;
  };
  protected override get definition() {
    return super.definition as CardActionDefinition<T>;
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

  public get isLikeContinuousSpell() {
    return this.definition.isLikeContinuousSpell || (this.entity.isLikeContinuousSpell && this.playType === "CardActivation");
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

  public readonly toString = () => (this.isWithChainBlock ? ` «${this.title}»` : this.title);

  /**
   * 素材情報に制限を加えて実行するときに使用する。
   */
  private readonly addhocMateriallimitation: (materialInfos: SummonMaterialInfo[]) => boolean;

  protected constructor(
    seq: "AutoSeq" | number,
    entity: DuelEntity,
    definition: CardActionDefinitionBase,
    addhocMateriallimitation?: (materialInfos: SummonMaterialInfo[]) => boolean
  ) {
    super(seq, entity, definition);
    this.addhocMateriallimitation = addhocMateriallimitation ?? (() => true);
  }

  public readonly getClone = (addhocMateriallimitation?: (materialInfos: SummonMaterialInfo[]) => boolean) => {
    return new CardAction<T>(this.seq, this.entity, this.definition, addhocMateriallimitation);
  };

  public readonly getEnableMaterialPatterns = (myInfo: ChainBlockInfoBase<T>) =>
    this.definition.getEnableMaterialPatterns?.(myInfo).filter(this.addhocMateriallimitation) ?? [];

  public readonly validate = (activator: Duelist, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, ignoreCosts: boolean) => {
    // カードの発動はフィールド表側表示ではできない
    if (this.playType === "CardActivation" && this.entity.isOnField && this.entity.face === "FaceUp") {
      return;
    }
    if (this.isOnlyNTimesPerDuel > 0) {
      if (
        this.entity.field.duel.chainBlockLog.records
          .filter((rec) => !rec.chainBlockInfo.isNegatedActivationBy)
          .filter((rec) => this.isSameGroupPerTurn(rec.chainBlockInfo.action))
          .filter((rec) => rec.chainBlockInfo.activator === activator).length >= this.isOnlyNTimesPerDuel
      ) {
        return;
      }
    }
    if (this.isOnlyNTimesPerTurn > 0) {
      if (
        this.entity.field.duel.chainBlockLog.records
          .filter((rec) => !rec.chainBlockInfo.isNegatedActivationBy)
          .filter((rec) => this.isSameGroupPerTurn(rec.chainBlockInfo.action))
          .filter((rec) => rec.clock.turn === this.entity.field.duel.clock.turn)
          .filter((rec) => rec.chainBlockInfo.activator === activator).length >= this.isOnlyNTimesPerTurn
      ) {
        return;
      }
    }
    // このチェーン上で、同一の効果が発動している回数をカウント。
    const currentChainCount = chainBlockInfos.filter((info) => info.action.seq === this.seq).length;
    if (this.isOnlyNTimesPerChain > 0 && currentChainCount >= this.isOnlyNTimesPerChain) {
      return;
    }

    // このターンに発動した回数を加算
    const count = currentChainCount + this.entity.counterHolder.getActionCount(this);

    if (this.isOnlyNTimesPerTurnIfFaceup > 0 && count >= this.isOnlyNTimesPerTurnIfFaceup) {
      return;
    }
    if (this.isOnlyNTimesIfFaceup > 0 && count >= this.isOnlyNTimesIfFaceup) {
      return;
    }
    const maxChainNumber = max(0, ...chainBlockInfos.map((info) => info.chainNumber ?? -1));

    const myInfo: ChainBlockInfoBase<T> = {
      index: chainBlockInfos.length,
      chainNumber: this.isWithChainBlock ? maxChainNumber + 1 : undefined,
      action: this,
      activator: activator,
      targetChainBlock: chainBlockInfos.slice(-1)[0],
      isActivatedIn: this.entity.fieldCell,
      isActivatedAt: this.duel.clock.getClone(),
      costInfo: {},
      state: "unloaded",
      dest: undefined,
      ignoreCost: false,
    };

    if (this.definition.canPayCosts && !ignoreCosts) {
      if (!this.definition.canPayCosts(myInfo, chainBlockInfos)) {
        return;
      }
    }
    return this.definition.validate(myInfo, chainBlockInfos);
  };
  public readonly prepare = async (
    activator: Duelist,
    cell: DuelFieldCell | undefined,
    targetChainBlock: ChainBlockInfo<unknown> | undefined,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    cancelable: boolean,
    ignoreCosts: boolean
  ) => {
    let _cancelable = cancelable;
    if (this.isLikeContinuousSpell) {
      this.entity.info.isPending = true;
    }

    const chainNumber = this.isWithChainBlock ? max(0, ...chainBlockInfos.map((info) => info.chainNumber ?? -1)) + 1 : undefined;

    let logText = "";

    if (chainNumber !== undefined) {
      logText += `チェーン${chainNumber}: `;
    }

    if (this.playType === "CardActivation" || this.playType === "SpellTrapSet") {
      //魔法・罠・ペンデュラムスケールのカードの発動またはセットの場合、コスト支払いの前に移動処理を行う。

      if (this.entity.fieldCell.cellType === "Hand") {
        // 手札からの発動・セットの場合

        let availableCells = cell ? [cell] : this.entity.status.spellCategory === "Field" ? [activator.getFieldZone()] : activator.getAvailableSpellTrapZones();

        if (this.entity.status.spellCategory === "Field") {
          // フィールド魔法を手札から発動する場合、既存のフィールドがあれば上書き
          const olds = activator.getFieldZone().cardEntities;
          if (olds.length) {
            const oldOne = olds[0];
            await DuelEntity.sendManyToGraveyardForTheSameReason(activator.getFieldZone().cardEntities, ["Rule"], this.entity, activator);
            activator.writeInfoLog(`フィールド魔法の上書きにより、${oldOne.toString()}は墓地に送られた。`);
            _cancelable = false;
          }
        }

        if (this.entity.status.monsterCategories?.includes("Pendulum")) {
          // ペンデュラムの場合、発動先はペンデュラムゾーンのみ
          availableCells = availableCells.filter((cell) => cell.isAvailableForPendulum);
        }

        let dest = availableCells[0];

        if (availableCells.length > 1) {
          dest = availableCells.randomPick();
          const actionTitle = this.playType === "SpellTrapSet" ? "セット" : "カードの発動";
          const _dest = await this.duel.view.waitDammyActions(activator, this.entity, availableCells, "カードを移動先へドラッグ", actionTitle, _cancelable);
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

        if (this.entity.status.monsterCategories?.includes("Pendulum")) {
          await this.entity.activateAsPendulumScale(dest, ["CardActivation"], this.entity, activator);
        } else if (this.playType === "CardActivation") {
          await this.entity.activateSpellTrapFromHand(dest, this.entity.status.kind, ["CardActivation"], this.entity, activator);
        } else {
          await this.entity.setAsSpellTrap(dest, this.entity.status.kind, ["SpellTrapSet"], this.entity, activator);
        }
        _cancelable = false;
      } else if (this.entity.isOnFieldAsSpellTrap && this.entity.face === "FaceDown") {
        logText += `セットされていた${this.entity.toString()}を発動。`;

        activator.writeInfoLog(logText);

        // セット状態からの発動ならば、表にする。
        await this.entity.setNonFieldMonsterPosition(this.entity.origin.kind, "FaceUp", ["Rule"]);
        _cancelable = false;
      }
    } else if (chainNumber !== undefined) {
      logText += `${this.entity.toString()}の効果、${this.toString()}を発動。`;

      activator.writeInfoLog(logText);
    }

    // チェーンブロック情報の準備
    const myInfo: ChainBlockInfoBase<T> = {
      index: chainBlockInfos.length,
      chainNumber,
      action: this,
      activator: activator,
      targetChainBlock,
      isActivatedIn: this.entity.fieldCell,
      isActivatedAt: this.duel.clock.getClone(),
      costInfo: {},
      state: "ready",
      dest: cell,
      ignoreCost: false,
    };

    if (this.definition.payCosts && !ignoreCosts) {
      const costInfo = await this.definition.payCosts(myInfo, chainBlockInfos, _cancelable);
      if (!costInfo) {
        return;
      }
      myInfo.costInfo = costInfo;
    }

    // 準備
    const prepared = await this.definition.prepare(myInfo, chainBlockInfos, _cancelable);
    if (prepared === undefined) {
      return;
    }
    console.log(this.entity.toString(), prepared);
    return { ...myInfo, ...prepared };
  };

  public readonly execute = async (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
    if (myInfo.action.isLikeContinuousSpell && !myInfo.action.entity.isOnField) {
      this.entity.info.isPending = false;
      return false;
    }

    const result = await this.definition.execute(myInfo, chainBlockInfos);

    // TODO 確認：永続魔法類の発動時の効果処理と適用開始はどちらが先か？
    // 一旦、早すぎた埋葬に便利なので、効果処理を先に行う。
    if (myInfo.action.isLikeContinuousSpell) {
      for (const ce of this.entity.continuousEffects) {
        this.entity.info.isPending = false;
        await ce.updateState();
      }
    }
    return result;
  };
  public readonly settle = (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
    if (this.isOnlyNTimesPerTurnIfFaceup > 0) {
      this.entity.counterHolder.incrementActionCountPerTurn(this);
    } else if (this.isOnlyNTimesIfFaceup > 0) {
      this.entity.counterHolder.incrementActionCount(this);
    }
    return this.definition.settle(myInfo, chainBlockInfos);
  };

  /**
   * 緊急同調など
   * @param activator
   * @param ignoreCost
   * @returns
   */
  public readonly directExecute = async (activator: Duelist, ignoreCost: boolean) => {
    // チェーンブロック情報の準備
    const myInfo = await this.prepare(activator, undefined, undefined, [], false, ignoreCost);
    if (!myInfo) {
      throw new SystemError("想定されない状態", this, activator, ignoreCost);
    }
    const flg = await this.execute(myInfo, []);
    this.settle(myInfo, []);
    return flg;
  };

  public readonly isSame = (other: CardAction<unknown>) => this.entity.origin.name === other.entity.origin.name && this.title === other.title;
  public readonly isSameGroupPerTurn = (other: CardAction<unknown>) =>
    this.actionGroupNamePerTurn
      ? this.entity.origin.name === other.entity.origin.name && this.actionGroupNamePerTurn === other.actionGroupNamePerTurn
      : this.isSame(other);

  public readonly calcChainBlockTagsForDestroy = (entites: DuelEntity[]): TEffectTag[] => {
    if (!effectTags.length) {
      return [];
    }
    const tags: TEffectTag[] = ["Destroy"];

    if (effectTags.length > 1) {
      tags.push("DestroyMultiple");
    }

    const cardsOnFields = entites.filter((card) => card.isOnField);

    if (cardsOnFields.length) {
      tags.push("DestroyOnField");
      if (cardsOnFields.length > 1) {
        tags.push("DestroyMultipleOnField");
      }
    }
    const monstersOnField = cardsOnFields.filter((card) => card.status.kind === "Monster");

    if (monstersOnField.length) {
      tags.push("DestroyMonsterOnField");
      if (monstersOnField.length > 1) {
        tags.push("DestroyMonstersOnField");
      }
    }

    const spellTraps = cardsOnFields.filter((card) => card.status.kind !== "Monster");
    if (spellTraps.length) {
      tags.push("DestroySpellTrapOnField");
      if (monstersOnField.length > 1) {
        tags.push("DestroySpellTrapsOnField");
      }
    }
    const cardsOnOpponentField = cardsOnFields.filter((card) => card.controller !== this.entity.controller);
    if (cardsOnOpponentField.length) {
      tags.push("DestroyOnOpponentField");
      if (cardsOnOpponentField.length > 1) {
        tags.push("DestroyMultipleOnOpponentField");
      }
    }

    return tags;
  };
}

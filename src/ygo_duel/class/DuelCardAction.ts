import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { DuelFieldCell, DuelFieldCellType } from "./DuelFieldCell";
import { type Duelist } from "./Duelist";
import type { DuelEntity } from "./DuelEntity";
import type { TDuelPeriodKey } from "./DuelPeriod";
export const executableDuelistTypes = ["Controller", "Opponent"] as const;
export type TExecutableDuelistType = (typeof executableDuelistTypes)[number];

export const cardActionChainBlockTypes = [
  "IgnitionEffect",
  "MandatoryIgnitionEffect",
  "TriggerEffect",
  "MandatoryTriggerEffect",
  "QuickEffect",
  "CardActivation",
] as const;
export type TCardActionChainBlockType = (typeof cardActionChainBlockTypes)[number];
export const cardActionNonChainBlockTypes = [
  "NormalSummon",
  "SpecialSummon",
  "ChangeBattlePosition",
  "Battle",
  "SpellTrapSet",
  "LingeringEffect",
  "MandatoryLingeringEffect",
] as const;
export type TCardActionNonChainBlockType = (typeof cardActionNonChainBlockTypes)[number];
export type TCardActionType = TCardActionChainBlockType | TCardActionNonChainBlockType | "Dammy" | "RuleDraw" | "SystemAction";

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
  "Banish", //今のところない？
  "BanishFromField", //今のところない？
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
] as const;
export type TEffectTag = (typeof effectTags)[number];
export type ChainBlockInfoBase<T> = {
  index: number;
  action: CardAction<T>;
  activator: Duelist;
  isActivatedIn: DuelFieldCell;
  isNegatedActivationBy?: CardAction<unknown>;
  isNegatedEffectBy?: CardAction<unknown>;
  state: "unloaded" | "ready" | "done" | "failed";
};

export type ChainBlockInfoPrepared<T> = {
  chainBlockTags: TEffectTag[];
  selectedEntities: DuelEntity[];
  prepared: T;
};
export type ChainBlockInfo<T> = ChainBlockInfoBase<T> & ChainBlockInfoPrepared<T>;

export type CardActionBaseAttr = {
  title: string;
  playType: TCardActionType;
  spellSpeed: TSpellSpeed;
  hasToTargetCards?: boolean;
  executableCells: Readonly<DuelFieldCellType[]>;
  executablePeriods: Readonly<TDuelPeriodKey[]>;
  executableDuelistTypes: TExecutableDuelistType[];
  isOnlyNTimesPerTurn?: number;
  isOnlyNTimesPerDuel?: number;
  isOnlyNTimesPerTurnIfFaceup?: number;
  isOnlyNTimesIfFaceup?: number;
  actionGroupNamePerTurn?: string;
  /**
   * 光の護封剣などの例外のみ指定が必要
   */
  isLikeContinuousSpell?: boolean;

  /**
   *NPC用プロパティ
   */
  negatePreviousBlock?: boolean;

  /**
   * NPC用プロパティ
   */
  priorityForNPC?: number;
};
export type CardActionBase<T> = CardActionBaseAttr & {
  /**
   * 発動可能かどうかの検証
   * @param entity
   * @returns 発動時にドラッグ・アンド・ドロップ可能である場合、選択肢のcellが返る。
   */
  validate: (myInfo: ChainBlockInfoBase<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => DuelFieldCell[] | undefined;
  /**
   * コストの支払い、対象に取るなど
   * フィールドに残らない魔法罠の場合、isDyingの設定が必要
   * @param entity
   * @param cell
   * @returns
   */
  prepare: (
    myInfo: ChainBlockInfoBase<T>,
    cell: DuelFieldCell | undefined,
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
  isLikeContinuousSpell: boolean;
  getClone: () => ICardAction<T>;
  /**
   *
   * @returns 発動時にドラッグ・アンド・ドロップ可能である場合、選択肢のcellが返る。
   */
  validate: (activator: Duelist, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => DuelFieldCell[] | undefined;
  /**
   * チェーンに乗る処理の場合、コストの支払いや対象に取る処理までを行う。
   * @param cell 効果発動時にドラッグ・アンド・ドロップなどで指定されたセルがある場合、値が入る。
   * @returns 実行時に必要な任意の情報
   */
  prepare: (
    activator: Duelist,
    cell: DuelFieldCell | undefined,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    cancelable: boolean
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

export const convertCardActionToString = (action: ICardAction<unknown>) =>
  action.playType === "CardActivation" ? action.entity.nm : `${action.entity.nm}«${action.title}»`;

export class CardAction<T> implements ICardAction<T> {
  private static nextActionSeq = 0;
  public get isMandatory() {
    return this.playType === "MandatoryIgnitionEffect" || this.playType === "MandatoryLingeringEffect" || this.playType === "MandatoryTriggerEffect";
  }

  public static readonly createNew = <T>(entity: DuelEntity, cardActionBase: CardActionBase<T>) => {
    return new CardAction<T>(CardAction.nextActionSeq++, entity, cardActionBase);
  };
  /**
   * @param entity
   * @param title
   * @param cells
   * @param pos
   * @returns
   */
  public static readonly createDammyAction = (entity: DuelEntity, title: string, cells: DuelFieldCell[], pos?: TBattlePosition): ICardAction<void> => {
    return {
      seq: CardAction.nextActionSeq++,
      title: title,
      entity: entity,
      playType: "Dammy",
      spellSpeed: "Dammy",
      hasToTargetCards: false,
      isOnlyNTimesPerDuel: 0,
      isOnlyNTimesPerTurn: 0,
      isLikeContinuousSpell: false,
      getClone: function () {
        return this;
      },
      validate: () => cells,
      prepare: async () => undefined,
      execute: async () => false,
      settle: async () => false,
      pos: pos,
      cell: cells[0],
      dragAndDropOnly: cells.length > 1,
    };
  };
  public readonly seq: number;
  public readonly entity: DuelEntity;
  private readonly cardActionBase: CardActionBase<T>;
  public get title() {
    return this.cardActionBase.title;
  }

  public get playType() {
    return this.cardActionBase.playType;
  }

  public get spellSpeed() {
    return this.cardActionBase.spellSpeed;
  }

  public get hasToTargetCards() {
    return this.cardActionBase.hasToTargetCards ?? false;
  }

  public get executableCells() {
    return this.cardActionBase.executableCells;
  }
  public get executablePeriods() {
    return this.cardActionBase.executablePeriods;
  }
  public get executableDuelistTypes() {
    return this.cardActionBase.executableDuelistTypes;
  }
  public get executableDuelists() {
    const duelists: Duelist[] = [];

    if (this.cardActionBase.executableDuelistTypes.includes("Controller")) {
      duelists.push(this.entity.controller);
    }
    if (this.cardActionBase.executableDuelistTypes.includes("Opponent")) {
      duelists.push(this.entity.controller.getOpponentPlayer());
    }

    return duelists;
  }
  public get isOnlyNTimesPerDuel() {
    return this.cardActionBase.isOnlyNTimesPerDuel ?? 0;
  }

  public get isOnlyNTimesPerTurn() {
    return this.cardActionBase.isOnlyNTimesPerTurn ?? 0;
  }
  public get isOnlyNTimesPerTurnIfFaceup() {
    return this.cardActionBase.isOnlyNTimesPerTurnIfFaceup ?? 0;
  }
  public get isOnlyNTimesIfFaceup() {
    return this.cardActionBase.isOnlyNTimesIfFaceup ?? 0;
  }
  public get isLikeContinuousSpell() {
    return this.cardActionBase.isLikeContinuousSpell || (this.entity.isLikeContinuousSpell && this.playType === "CardActivation");
  }

  public get actionGroupNamePerTurn() {
    return this.cardActionBase.actionGroupNamePerTurn;
  }

  public get negatePreviousBlock() {
    return this.cardActionBase.negatePreviousBlock ?? false;
  }
  public get priorityForNPC() {
    return this.cardActionBase.priorityForNPC ?? Number.NaN;
  }

  private constructor(seq: number, entity: DuelEntity, cardActionBase: CardActionBase<T>) {
    this.seq = seq;
    this.entity = entity;
    this.cardActionBase = cardActionBase;
  }

  public readonly getClone = () => {
    return new CardAction<T>(this.seq, this.entity, this.cardActionBase);
  };

  public readonly validate = (activator: Duelist, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
    // カードの発動はフィールド表側表示ではできない
    if (this.playType === "CardActivation" && this.entity.isOnField && this.entity.face === "FaceUp") {
      return;
    }
    if (this.isOnlyNTimesPerDuel > 0) {
      if (
        this.entity.field.duel.chainBlockLog.records
          .filter((rec) => !rec.chainBlockInfo.isNegatedActivationBy)
          .filter((rec) => this.isSame(rec.chainBlockInfo.action))
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

    if (this.isOnlyNTimesPerTurnIfFaceup > 0 && this.entity.counterHolder.getActionCount(this) + currentChainCount >= this.isOnlyNTimesPerTurnIfFaceup) {
      return;
    }
    if (this.isOnlyNTimesIfFaceup > 0 && this.entity.counterHolder.getActionCount(this) + currentChainCount >= this.isOnlyNTimesIfFaceup) {
      return;
    }

    const myInfo: ChainBlockInfoBase<T> = {
      index: chainBlockInfos.length,
      action: this,
      activator: activator,
      isActivatedIn: this.entity.fieldCell,
      state: "unloaded",
    };
    return this.cardActionBase.validate(myInfo, chainBlockInfos);
  };
  public readonly prepare = async (
    activator: Duelist,
    cell: DuelFieldCell | undefined,
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    cancelable: boolean
  ) => {
    if (this.isLikeContinuousSpell) {
      this.entity.info.isPending = true;
    }

    const isActivatedIn = this.entity.fieldCell;

    const myInfo: ChainBlockInfoBase<T> = {
      index: chainBlockInfos.length,
      action: this,
      activator: activator,
      isActivatedIn: isActivatedIn,
      state: "ready",
    };
    const prepared = await this.cardActionBase.prepare(myInfo, cell, chainBlockInfos, cancelable);
    if (prepared === undefined) {
      return;
    }

    return { ...myInfo, ...prepared };
  };

  public readonly execute = async (myInfo: ChainBlockInfo<T>, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>) => {
    if (myInfo.action.isLikeContinuousSpell && !myInfo.action.entity.isOnField) {
      this.entity.info.isPending = false;
      return false;
    }

    const result = await this.cardActionBase.execute(myInfo, chainBlockInfos);

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
      this.entity.counterHolder.incrementActionCountPerTurn(myInfo.action);
    } else if (this.isOnlyNTimesIfFaceup > 0) {
      this.entity.counterHolder.incrementActionCount(myInfo.action);
    }
    return this.cardActionBase.settle(myInfo, chainBlockInfos);
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

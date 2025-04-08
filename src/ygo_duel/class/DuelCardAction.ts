import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { DuelFieldCell } from "./DuelFieldCell";
import { type Duelist } from "./Duelist";
import { DuelEntity } from "./DuelEntity";
import { CardActionBase, type CardActionDefinitionBase } from "./DuelCardActionBase";
import type { IDuelClock } from "./DuelClock";
export const executableDuelistTypes = ["Controller", "Opponent"] as const;
export type TExecutableDuelistType = (typeof executableDuelistTypes)[number];

export const cardActionChainBlockTypes = ["IgnitionEffect", "TriggerEffect", "QuickEffect", "CardActivation"] as const;
export type TCardActionChainBlockType = (typeof cardActionChainBlockTypes)[number];
export const cardActionNonChainBlockTypes = ["NormalSummon", "SpecialSummon", "ChangeBattlePosition", "Battle", "SpellTrapSet", "LingeringEffect"] as const;
export type TCardActionNonChainBlockType = (typeof cardActionNonChainBlockTypes)[number];
export type TCardActionType = TCardActionChainBlockType | TCardActionNonChainBlockType | "Dammy" | "RuleDraw" | "SystemPeriodAction";

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
] as const;
export type TEffectTag = (typeof effectTags)[number];

export const NumericCostTypes = ["LifePoint", "XyzMaterial", "Counter"] as const;
export type TNumericCostType = (typeof NumericCostTypes)[number];
export const EntityCostTypes = ["Discard", "Banish", "Release", "ReturnToDeck", "ReturnToHand", "SendToGraveyard"] as const;
export type TEntityCostType = (typeof EntityCostTypes)[number];
export const CostTypes = [...NumericCostTypes, ...EntityCostTypes] as const;
export type TCostType = (typeof CostTypes)[number];

export type ActionCostInfo = { [key in TCostType]?: key extends TNumericCostType ? number : DuelEntity[] };

export type ChainBlockInfoBase<T> = {
  index: number;
  action: CardAction<T>;
  activator: Duelist;
  isActivatedIn: DuelFieldCell;
  isActivatedAt: IDuelClock;
  isNegatedActivationBy?: CardAction<unknown>;
  isNegatedEffectBy?: CardAction<unknown>;
  costInfo: ActionCostInfo;
  state: "unloaded" | "ready" | "done" | "failed";
};

export type ChainBlockInfoPrepared<T> = {
  chainBlockTags: TEffectTag[];
  selectedEntities: DuelEntity[];
  prepared: T;
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
   * NPC用プロパティ
   */
  priorityForNPC?: number;
};
export type CardActionDefinition<T> = CardActionDefinitionAttr & {
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
  validate: (activator: Duelist, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, ignoreCosts: boolean) => DuelFieldCell[] | undefined;
  /**
   * チェーンに乗る処理の場合、コストの支払いや対象に取る処理までを行う。
   * @param cell 効果発動時にドラッグ・アンド・ドロップなどで指定されたセルがある場合、値が入る。
   * @returns 実行時に必要な任意の情報
   */
  prepare: (
    activator: Duelist,
    cell: DuelFieldCell | undefined,
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

export const convertCardActionToString = (action: ICardAction<unknown>) =>
  action.playType === "CardActivation" ? action.entity.nm : `${action.entity.nm}«${action.title}»`;

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

  public get isLikeContinuousSpell() {
    return this.definition.isLikeContinuousSpell || (this.entity.isLikeContinuousSpell && this.playType === "CardActivation");
  }

  public get actionGroupNamePerTurn() {
    return this.definition.actionGroupNamePerTurn;
  }

  public get negatePreviousBlock() {
    return this.definition.negatePreviousBlock ?? false;
  }
  public get priorityForNPC() {
    return this.definition.priorityForNPC ?? Number.NaN;
  }

  public readonly getClone = () => {
    return new CardAction<T>(this.seq, this.entity, this.definition);
  };

  public readonly validate = (activator: Duelist, chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>, ignoreCosts: boolean) => {
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
      isActivatedAt: this.duel.clock.getClone(),
      costInfo: {},
      state: "unloaded",
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
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    cancelable: boolean,
    ignoreCosts: boolean
  ) => {
    let _cancelable = cancelable;
    if (this.isLikeContinuousSpell) {
      this.entity.info.isPending = true;
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

        if (this.entity.status.monsterCategories?.includes("Pendulum")) {
          await this.entity.activateAsPendulumScale(dest, ["CardActivation"], this.entity, activator);
        } else if (this.playType === "CardActivation") {
          await this.entity.activateSpellTrapFromHand(dest, this.entity.status.kind, ["CardActivation"], this.entity, activator);
        } else {
          await this.entity.setAsSpellTrap(dest, this.entity.status.kind, ["SpellTrapSet"], this.entity, activator);
        }
        _cancelable = false;
      } else if (this.entity.isOnFieldAsSpellTrap && this.entity.face === "FaceDown") {
        // セット状態からの発動ならば、表にする。
        await this.entity.setNonFieldMonsterPosition(this.entity.origin.kind, "FaceUp", ["Rule"]);
        _cancelable = false;
      }
    }
    // チェーンブロック情報の準備
    const myInfo: ChainBlockInfoBase<T> = {
      index: chainBlockInfos.length,
      action: this,
      activator: activator,
      isActivatedIn: this.entity.fieldCell,
      isActivatedAt: this.duel.clock.getClone(),
      costInfo: {},
      state: "ready",
    };

    if (this.definition.payCosts && !ignoreCosts) {
      const costInfo = await this.definition.payCosts(myInfo, chainBlockInfos, _cancelable);
      if (!costInfo) {
        return;
      }
      myInfo.costInfo = costInfo;
    }

    // 準備
    const prepared = await this.definition.prepare(myInfo, cell, chainBlockInfos, _cancelable);
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

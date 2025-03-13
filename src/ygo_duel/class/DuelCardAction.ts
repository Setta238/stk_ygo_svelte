import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { DuelFieldCell, DuelFieldCellType } from "./DuelFieldCell";
import type Duelist from "./Duelist";
import type { DuelEntity } from "./DuelEntity";

export const cardActionChainBlockTypes = [
  "TriggerEffect",
  "TriggerMandatoryEffect",
  "MandatoryEffect",
  "QuickEffect",
  "IgnitionEffect",
  "CardActivation",
] as const;
export type TCardActionChainBlockType = (typeof cardActionChainBlockTypes)[number];
export const cardActionNonChainBlockTypes = ["NormalSummon", "SpecialSummon", "ChangeBattlePosition", "Battle", "SpellTrapSet", "SpellTrapActivate"] as const;
export type TCardActionNonChainBlockType = (typeof cardActionNonChainBlockTypes)[number];
export type TCardActionType = TCardActionChainBlockType | TCardActionNonChainBlockType | "Dammy" | "RuleDraw";
export type TSpellSpeed = "Normal" | "Quick" | "Counter" | "Dammy";
export type CardActionBase<T> = {
  title: string;
  playType: TCardActionType;
  spellSpeed: TSpellSpeed;
  hasToTargetCards?: boolean;
  executableCells: DuelFieldCellType[];
  isOnlyNTimesPerTurn?: number;
  isOnlyNTimesPerDuel?: number;
  actionGroupNamePerTurn?: string;
  canExecuteOnDamageStep?: boolean;
  /**
   * 発動可能かどうかの検証
   * @param entity
   * @returns 発動時にドラッグ・アンド・ドロップ可能である場合、選択肢のcellが返る。
   */
  validate: (entity: DuelEntity) => DuelFieldCell[] | undefined;
  /**
   * コストの支払い、対象に取るなど
   * フィールドに残らない魔法罠の場合、isDyingの設定が必要
   * @param entity
   * @param cell
   * @returns
   */
  prepare: (entity: DuelEntity, cell?: DuelFieldCell, cancelable?: boolean) => Promise<T | undefined>;
  /**
   * 実際の処理部分
   * @param entity
   * @param activater
   * @param cell
   * @param prepared
   * @returns
   */
  execute: (entity: DuelEntity, activater: Duelist, cell?: DuelFieldCell, prepared?: T) => Promise<boolean>;
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
  executableCells: DuelFieldCellType[];

  getClone: () => ICardAction<T>;
  /**
   *
   * @returns 発動時にドラッグ・アンド・ドロップ可能である場合、選択肢のcellが返る。
   */
  validate: () => DuelFieldCell[] | undefined;
  /**
   * チェーンに乗る処理の場合、コストの支払いや対象に取る処理までを行う。
   * @param cell 効果発動時にドラッグ・アンド・ドロップなどで指定されたセルがある場合、値が入る。
   * @returns 実行時に必要な任意の情報
   */
  prepare: (cell?: DuelFieldCell, cancelable?: boolean) => Promise<T | undefined>;
  /**
   *
   * @param activater 効果発動時のコントローラー
   * @param cell 効果発動時にドラッグ・アンド・ドロップなどで指定されたセルがある場合、値が入る。
   * @param prepared 実行時に必要な任意の情報
   * @returns 不発の場合、false
   */
  execute: (activater: Duelist, cell?: DuelFieldCell, prepared?: T) => Promise<boolean>;
  autoWord?: string;
  cell?: DuelFieldCell;
  pos?: TBattlePosition;
  dragAndDropOnly?: boolean;
}

export class CardAction<T> implements ICardAction<T> {
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

  public get isOnlyNTimesPerDuel() {
    return this.cardActionBase.isOnlyNTimesPerDuel ?? 0;
  }

  public get isOnlyNTimesPerTurn() {
    return this.cardActionBase.isOnlyNTimesPerTurn ?? 0;
  }
  public get actionGroupNamePerTurn() {
    return this.cardActionBase.actionGroupNamePerTurn;
  }
  public get canExecuteOnDamageStep() {
    return this.cardActionBase.canExecuteOnDamageStep ?? false;
  }

  constructor(seq: number, entity: DuelEntity, cardActionBase: CardActionBase<T>) {
    this.seq = seq;
    this.entity = entity;
    this.cardActionBase = cardActionBase;
  }

  public readonly getClone = () => {
    return new CardAction<T>(this.seq, this.entity, this.cardActionBase);
  };

  public readonly validate = () => {
    if (this.isOnlyNTimesPerDuel > 0) {
      if (
        this.entity.field.duel.cardActionLog.records.filter((rec) => this.isSame(rec.cardAction)).filter((rec) => rec.activater).length >=
        this.isOnlyNTimesPerDuel
      ) {
        return;
      }
    }
    if (this.isOnlyNTimesPerTurn > 0) {
      if (
        this.entity.field.duel.cardActionLog.records
          .filter((rec) => this.isSameGroupPerTurn(rec.cardAction))
          .filter((rec) => rec.turn === this.entity.field.duel.clock.turn)
          .filter((rec) => rec.activater).length >= this.isOnlyNTimesPerTurn
      ) {
        return;
      }
    }
    return this.cardActionBase.validate(this.entity);
  };
  public readonly prepare = async (cell?: DuelFieldCell) => {
    const prepared = await this.cardActionBase.prepare(this.entity, cell);
    if (prepared === undefined) {
      return;
    }

    this.entity.field.duel.cardActionLog.push(this.entity.controller, this as CardAction<unknown>);

    return prepared;
  };

  public readonly execute = (activater: Duelist, cell?: DuelFieldCell, prepared?: T) => this.cardActionBase.execute(this.entity, activater, cell, prepared);

  public readonly isSame = (other: CardAction<unknown>) => this.entity.origin.name === other.entity.origin.name && this.title === other.title;
  public readonly isSameGroupPerTurn = (other: CardAction<unknown>) =>
    this.actionGroupNamePerTurn
      ? this.entity.origin.name === other.entity.origin.name && this.actionGroupNamePerTurn === other.actionGroupNamePerTurn
      : this.isSame(other);
}

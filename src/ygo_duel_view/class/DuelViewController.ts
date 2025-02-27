import StkEvent from "@stk_utils/class/StkEvent";
import { Duel, DuelEnd, SystemError, type DuelistAction } from "@ygo_duel/class/Duel";
import type { DuelEntity, CardAction, CardActionWIP } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell, TDuelEntityPos } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
import { DuelModalController } from "./DuelModalController";
import type { CardActionSelectorArg } from "@ygo_duel_view/components/DuelActionSelector.svelte";
import type { DuelEntitiesSelectorArg } from "@ygo_duel_view/components/DuelEntitiesSelector.svelte";
export type TDuelWaitMode = "None" | "SelectFieldAction" | "SelectAction" | "SelectFieldEntities" | "SelectEntites";
export type WaitStartEventArg = {
  resolve: (action: DuelistAction) => void;
  enableActions: CardAction<unknown>[];
  qty: number | undefined;
  selectableEntities: DuelEntity[];
  entitiesValidator: (selectedEntities: DuelEntity[]) => boolean;
  cardActionSelectorArg?: CardActionSelectorArg; //TODO 要判断
  duelEntitiesSelectorArg?: DuelEntitiesSelectorArg; //TODO 要判断
};

export type AnimationStartEventArg = {
  entity: DuelEntity;
  to: DuelFieldCell;
  index: TDuelEntityPos;
  resolve: () => void;
};

export class DuelViewController {
  private onDuelUpdateEvent = new StkEvent<void>();
  public get onDuelUpdate() {
    return this.onDuelUpdateEvent.expose();
  }
  public readonly requireUpdate = () => {
    this.onDuelUpdateEvent.trigger();
  };
  private onWaitStartEvent = new StkEvent<WaitStartEventArg>();
  public get onWaitStart() {
    return this.onWaitStartEvent.expose();
  }
  private onWaitEndEvent = new StkEvent<void>();
  public get onWaitEnd() {
    return this.onWaitEndEvent.expose();
  }
  private onDragStartEvent = new StkEvent<CardActionWIP<unknown>[]>();
  public get onDragStart() {
    return this.onDragStartEvent.expose();
  }
  private onDragEndEvent = new StkEvent<void>();
  public get onDragEnd() {
    return this.onDragEndEvent.expose();
  }
  private onAnimationStartEvent = new StkEvent<AnimationStartEventArg>();
  public get onAnimation() {
    return this.onAnimationStartEvent.expose();
  }
  public readonly duel: Duel;
  public readonly modalController: DuelModalController;
  //  private draggingAction: CardActionWIP | undefined;
  public message: string;
  public waitMode: TDuelWaitMode;
  constructor(duel: Duel) {
    this.duel = duel;
    this.message = "";
    this.waitMode = "None";
    this.modalController = new DuelModalController(this);
  }

  public readonly getCell = (row: number, column: number): DuelFieldCell => {
    return this.duel.field.cells[row][column];
  };

  public readonly dispose = () => {
    this.onDragStartEvent.clear();
    this.onDragEndEvent.clear();
    this.onDuelUpdateEvent.clear();
    this.onWaitStartEvent.clear();
    this.onWaitEndEvent.clear();
  };

  /**
   * メインフェイズまたはバトルフェイズ中のターンプレイヤーのアクション類の待機
   * @param message
   * @returns
   */
  public readonly waitFieldAction = async (enableActions: CardAction<unknown>[], message: string): Promise<DuelistAction> => {
    if (this.duel.getTurnPlayer().duelistType === "NPC") {
      const action = enableActions
        .toSorted((left, right) => (right.entity.atk || 0) - (left.entity.atk || 0))
        .find((act) => act.playType === "NormalSummon" || act.playType === "SpecialSummon");
      return action ? { actionWIP: action as CardActionWIP<unknown> } : { phaseChange: this.duel.nextPhaseList[0] };
    }
    return await this._waitDuelistAction(enableActions, "SelectFieldAction", message);
  };

  /**
   * 優先権プレイヤーのクイックエフェクト類の待機
   * @param title
   * @returns
   */
  public readonly waitQuickEffect = async (
    enableActions: CardAction<unknown>[],
    message: string,
    cancelable: boolean
  ): Promise<CardActionWIP<unknown> | undefined> => {
    if (enableActions.length === 0) {
      return;
    }

    const promiseList: Promise<CardActionWIP<unknown> | undefined>[] = [];

    promiseList.push(
      this.modalController
        .selectAction(this, {
          title: message,
          actions: enableActions as CardActionWIP<unknown>[],
          cancelable: cancelable,
        })
        .then((action) => {
          return action && (action as CardActionWIP<unknown>);
        })
    );

    promiseList.push(
      this._waitDuelistAction(enableActions, "SelectAction", this.message).then((result) => {
        return result.actionWIP;
      })
    );

    return await Promise.any(promiseList);
  };

  /**
   * コスト支払い中、チェーン処理中などに発生する処理の待機。
   * @param chooser
   * @param enableActions
   * @param message
   * @param cancelable エラーチェックにのみ使用
   * @returns
   */
  public readonly waitSubAction = async (
    chooser: Duelist,
    enableActions: CardAction<unknown>[],
    message: string,
    cancelable: boolean = false
  ): Promise<DuelistAction> => {
    if (chooser.duelistType === "NPC") {
      throw Error("Not implemented");
    }
    return await this._waitDuelistAction(enableActions, "SelectAction", message, undefined, undefined, undefined, cancelable);
  };

  /**
   * コスト支払い中、チェーン処理中などに発生するエンティティ選択処理の待機。
   * @param duelist
   * @param entities
   * @param qty 数量固定の場合
   * @param entitiesValidator
   * @param message
   * @param cancelable エラーチェックにのみ使用
   * @returns
   */
  public readonly waitSelectEntities = async (
    chooser: Duelist,
    choises: DuelEntity[],
    qty: number | undefined,
    validator: (selected: DuelEntity[]) => boolean,
    message: string,
    cancelable: boolean = false
  ): Promise<DuelEntity[] | undefined> => {
    let selected: DuelEntity[] = [];

    if (qty && choises.length === qty) {
      return [...choises];
    }

    if (chooser.duelistType === "NPC") {
      // NPCはランダムに選択する
      while (!validator(selected)) {
        // 一個も選択しないパターンは最初にチェックするので、それ以外をランダムに試行する。
        const _qty = qty && qty > 0 ? qty : Math.floor(Math.random() * choises.length) + 1;
        selected = choises.randomPick(_qty);
      }
      return selected;
    }
    this.waitMode = choises.every(
      (e) =>
        ((e.fieldCell.cellType === "MonsterZone" || e.fieldCell.cellType === "ExtraMonsterZone") && e.getIndexInCell() === 0) ||
        (e.fieldCell.cellType === "Hand" && e.controller === chooser)
    )
      ? "SelectEntites"
      : "SelectFieldEntities";

    const actions = await this._waitDuelistAction([], "SelectAction", message, choises, qty, validator, cancelable);

    return actions.selectedEntities;
  };

  private readonly _waitDuelistAction = async (
    enableActions: CardAction<unknown>[],
    waitMode: TDuelWaitMode,
    message: string,
    selectableEntities?: DuelEntity[],
    qty?: number,
    entitiesValidator?: (selected: DuelEntity[]) => boolean,
    cancelable: boolean = false
  ): Promise<DuelistAction> => {
    this.waitMode = waitMode;
    this.message = message;

    this.onDuelUpdateEvent.trigger();
    const userAction: DuelistAction = await new Promise<DuelistAction>((resolve) => {
      this.onWaitStartEvent.trigger({
        resolve,
        enableActions,
        qty: qty,
        entitiesValidator: entitiesValidator || (() => false),
        selectableEntities: selectableEntities || [],
      });
    });

    this.waitMode = "None";
    console.log(userAction);
    this.onWaitEndEvent.trigger();
    if (userAction.surrender) {
      throw new DuelEnd(this.duel.duelists.Above);
    }
    if (!cancelable && userAction.cancel) {
      throw new SystemError("キャンセル不可のアクションがキャンセルされた。", userAction, enableActions, waitMode, selectableEntities);
    }
    return userAction;
  };

  public readonly waitAnimation = async (args: Omit<AnimationStartEventArg, "resolve">): Promise<void> => {
    return new Promise<void>((resolve) => this.onAnimationStartEvent.trigger({ ...args, resolve }));
  };

  public readonly setDraggingActions = (actions: CardActionWIP<unknown>[]) => {
    this.onDragStartEvent.trigger(actions);
    this.requireUpdate();
  };
  public readonly removeDraggingActions = () => {
    this.onDragEndEvent.trigger();
  };
}

import StkEvent from "@stk_utils/class/StkEvent";
import { Duel, DuelEnd, SystemError, type DuelistResponse } from "@ygo_duel/class/Duel";
import type { DuelEntity, CardAction } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell, TDuelEntityMovePos } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
import { DuelModalController } from "./DuelModalController";
import type { CardActionSelectorArg } from "@ygo_duel_view/components/DuelActionSelector.svelte";
import type { DuelEntitiesSelectorArg } from "@ygo_duel_view/components/DuelEntitiesSelector.svelte";
export type TDuelWaitMode = "None" | "SelectFieldAction" | "SelectAction" | "SelectFieldEntities" | "SelectEntities";
export type WaitStartEventArg = {
  resolve: (action: DuelistResponse) => void;
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
  index: TDuelEntityMovePos;
  resolve: () => void;
  count: number;
};

export type TDuelDeskInfoBoardState = "Log" | "CellInfo";
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
  private onDragStartEvent = new StkEvent<CardAction<unknown>[]>();
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
  private onShowCardEntityEvent = new StkEvent<DuelEntity | undefined>();
  public get onShowCardEntity() {
    return this.onShowCardEntityEvent.expose();
  }
  public readonly duel: Duel;
  public readonly modalController: DuelModalController;
  //  private draggingAction: CardAction | undefined;
  public message: string;
  public waitMode: TDuelWaitMode;
  public infoBoardState: TDuelDeskInfoBoardState;
  public infoBoardCell: DuelFieldCell;
  constructor(duel: Duel) {
    this.duel = duel;
    this.message = "";
    this.waitMode = "None";
    this.infoBoardState = "Log";
    this.infoBoardCell = duel.duelists.Below.getExtraDeck();
    this.modalController = new DuelModalController(this);
  }

  public readonly getCell = (row: number, column: number): DuelFieldCell => {
    return this.duel.field.cells[row][column];
  };

  public readonly showCardInfo = (card?: DuelEntity) => {
    this.onShowCardEntityEvent.trigger(card);
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
  public readonly waitFieldAction = async (enableActions: CardAction<unknown>[], message: string): Promise<DuelistResponse> => {
    console.log(enableActions);
    if (this.duel.getTurnPlayer().duelistType === "NPC") {
      const action = enableActions
        .toSorted((left, right) => (right.entity.atk || 0) - (left.entity.atk || 0))
        .find((act) => act.playType === "NormalSummon" || act.playType === "SpecialSummon");
      return action ? { actionWIP: action as CardAction<unknown> } : { phaseChange: this.duel.nextPhaseList[0] };
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
  ): Promise<CardAction<unknown> | undefined> => {
    if (enableActions.length === 0) {
      return;
    }

    const promiseList: Promise<CardAction<unknown> | undefined>[] = [];

    promiseList.push(
      this.modalController
        .selectAction(this, {
          title: message,
          actions: enableActions as CardAction<unknown>[],
          cancelable: cancelable,
        })
        .then((action) => {
          return action && (action as CardAction<unknown>);
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
  ): Promise<DuelistResponse> => {
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
      ? "SelectFieldEntities"
      : "SelectEntities";

    console.log(this.waitMode);

    const actions = await this._waitDuelistAction([], this.waitMode, message, choises, qty, validator, cancelable);

    console.log(actions);

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
  ): Promise<DuelistResponse> => {
    this.waitMode = waitMode;
    this.message = message;

    this.onDuelUpdateEvent.trigger();

    const userAction: DuelistResponse = await new Promise<DuelistResponse>((resolve) => {
      const args: WaitStartEventArg = {
        resolve,
        enableActions,
        qty: qty,
        entitiesValidator: entitiesValidator || (() => false),
        selectableEntities: selectableEntities || [],
      };
      console.log(selectableEntities);
      console.log(entitiesValidator);
      console.log(this.waitMode);
      console.log(this.waitMode === "SelectEntities");
      if (selectableEntities && entitiesValidator && this.waitMode === "SelectEntities")
        args.duelEntitiesSelectorArg = {
          title: message,
          entities: selectableEntities,
          validator: entitiesValidator,
          qty: qty ?? -1,
          cancelable: false,
        };
      console.log(args);
      this.onWaitStartEvent.trigger(args);
    });

    console.log(userAction);
    this.waitMode = "None";
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
    this.onDuelUpdateEvent.trigger();
    return new Promise<void>((resolve) => this.onAnimationStartEvent.trigger({ ...args, resolve }));
  };

  public readonly setDraggingActions = (actions: CardAction<unknown>[]) => {
    this.onDragStartEvent.trigger(actions);
    this.requireUpdate();
  };
  public readonly removeDraggingActions = () => {
    this.onDragEndEvent.trigger();
  };
}

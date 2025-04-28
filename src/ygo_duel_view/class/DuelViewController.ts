import { StkEvent } from "@stk_utils/class/StkEvent";
import { Duel, DuelEnd, IllegalCancelError, SystemError, type DuelistResponse, type ResponseActionInfo } from "@ygo_duel/class/Duel";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelFieldCell, type TDuelEntityMovePos } from "@ygo_duel/class/DuelFieldCell";
import { type Duelist } from "@ygo_duel/class/Duelist";
import { DuelModalController } from "./DuelModalController";
import type { CardActionSelectorArg } from "@ygo_duel_view/components/DuelActionSelector.svelte";
import type { DuelEntitiesSelectorArg } from "@ygo_duel_view/components/DuelEntitiesSelector.svelte";
import { CardAction, type ChainBlockInfo, type DummyActionInfo, type ICardAction, type ValidatedActionInfo } from "@ygo_duel/class/DuelCardAction";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { createPromiseSweet } from "@stk_utils/funcs/StkPromiseUtil";
import type { TCardDetailMode } from "@ygo_duel_view/components/DuelCardDetail.svelte";
import type { TDuelPhase } from "@ygo_duel/class/DuelPeriod";
import type { CardActionBase } from "@ygo_duel/class/DuelCardActionBase";
export type TDuelWaitMode = "None" | "SelectFieldAction" | "SelectAction" | "SelectFieldEntities" | "SelectEntities" | "Animation";

export type ResolvedDummyActionInfo = {
  action: ICardAction;
  dest?: DuelFieldCell;
  battlePosition?: TBattlePosition;
  originSeq: number;
};

export type DuelistResponseBase = {
  phaseChange?: TDuelPhase;
  selectedEntities?: DuelEntity[];
  sendMessage?: string;
  actionInfo?: ResolvedDummyActionInfo;
  cancel?: boolean;
  surrender?: boolean;
};

export type WaitStartEventArg = {
  resolve: (action: DuelistResponseBase) => void;
  activator: Duelist;
  dummyActionInfos: DummyActionInfo[];
  qty: number | undefined;
  selectableEntities: DuelEntity[];
  entitiesValidator: (selectedEntities: DuelEntity[]) => boolean;
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>;
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
  private onDragStartEvent = new StkEvent<DummyActionInfo[]>();
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
  private onShowCardEntityEvent = new StkEvent<{ card: DuelEntity; mode: TCardDetailMode }>();
  public get onShowCardEntity() {
    return this.onShowCardEntityEvent.expose();
  }
  public readonly duel: Duel;
  public readonly modalController: DuelModalController;
  //  private draggingAction: CardAction | undefined;
  private _message: string;
  public get message() {
    return this._message || this.duel.log.lastRecord.text;
  }
  public waitMode: TDuelWaitMode;
  public infoBoardState: TDuelDeskInfoBoardState;
  public infoBoardCell: DuelFieldCell;
  constructor(duel: Duel) {
    this.duel = duel;
    this._message = "";
    this.waitMode = "None";
    this.infoBoardState = "Log";
    this.infoBoardCell = duel.duelists.Below.getExtraDeck();
    this.modalController = new DuelModalController(this);
  }
  public readonly getCell = (row: number, column: number): DuelFieldCell => {
    return this.duel.field.cells[row][column];
  };

  public readonly showCardInfo = (card: DuelEntity, mode: TCardDetailMode) => {
    this.onShowCardEntityEvent.trigger({ card, mode });
  };

  public readonly dispose = () => {
    this.onDragStartEvent.clear();
    this.onDragEndEvent.clear();
    this.onDuelUpdateEvent.clear();
    this.onWaitStartEvent.clear();
    this.onWaitEndEvent.clear();
  };

  //TODO この関数はここではないので引っ越しが必要
  /**
   * メインフェイズまたはバトルフェイズ中のターンプレイヤーのアクション類の待機
   * @param message
   * @returns
   */
  public readonly waitFieldAction = async (validatedActionInfos: ValidatedActionInfo[]): Promise<DuelistResponse> => {
    if (this.duel.getTurnPlayer().duelistType === "NPC") {
      const actionInfo = this.duel.getTurnPlayer().selectActionForNPC(validatedActionInfos, []);
      return actionInfo ? { actionInfo } : { phaseChange: this.duel.nextPhaseList[0] };
    }
    const res = await this._waitDuelistAction(this.duel.getTurnPlayer(), validatedActionInfos, "SelectFieldAction", "");

    if (!res.actionInfo) {
      return { ...res, actionInfo: undefined };
    }

    const actionInfo = { ...res.actionInfo };
    const selected = validatedActionInfos.find((info) => res.actionInfo?.originSeq === info.originSeq);
    if (!selected) {
      throw new SystemError("想定されない状態", validatedActionInfos, res);
    }

    return { ...res, actionInfo: { dest: actionInfo.dest, battlePosition: actionInfo.battlePosition, action: selected.action, originSeq: selected.originSeq } };
  };

  //TODO この関数はここではないので引っ越しが必要
  /**
   * 優先権プレイヤーのクイックエフェクト類の待機
   * @param title
   * @returns
   */
  public readonly waitQuickEffect = async (
    activator: Duelist,
    validatedActionInfos: ValidatedActionInfo[],
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>,
    message: string,
    cancelable: boolean
  ): Promise<ResponseActionInfo | undefined> => {
    if (validatedActionInfos.length === 0) {
      return;
    }

    if (activator.duelistType === "NPC") {
      return activator.selectActionForNPC(validatedActionInfos, chainBlockInfos);
    }

    const promiseList: Promise<ResponseActionInfo | undefined>[] = [];

    promiseList.push(
      this.modalController
        .selectAction(this, {
          title: message,
          activator: activator,
          dummyActionInfos: validatedActionInfos,
          cancelable: cancelable,
        })
        .then((actionInfo) => {
          if (!actionInfo) {
            return;
          }
          return validatedActionInfos.find((info) => info.originSeq === actionInfo.originSeq);
        })
    );

    promiseList.push(
      this._waitDuelistAction(activator, validatedActionInfos, "SelectAction", this.message).then((result) => {
        this.infoBoardState = "Log";
        return validatedActionInfos.find((info) => result.actionInfo?.originSeq === info.originSeq);
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
    dummyActionInfos: DummyActionInfo[],
    message: string,
    cancelable: boolean = false
  ): Promise<ResolvedDummyActionInfo | undefined> => {
    if (chooser.duelistType === "NPC") {
      throw Error("Not implemented");
    }
    const response = await this._waitDuelistAction(chooser, dummyActionInfos, "SelectAction", message, undefined, undefined, undefined, cancelable);

    if (!response) {
      return;
    }
    if (!response.actionInfo) {
      return;
    }
    return response.actionInfo;
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
    choices: DuelEntity[],
    qty: number | undefined,
    validator: (selected: DuelEntity[]) => boolean,
    message: string,
    cancelable: boolean = false
  ): Promise<DuelEntity[] | undefined> => {
    if (!choices.length) {
      return;
    }
    let selected: DuelEntity[] = [];

    if (qty && choices.length === qty) {
      return [...choices];
    }

    if (chooser.duelistType === "NPC") {
      // NPCはランダムに選択する

      while (!validator(selected)) {
        // 一個も選択しないパターンは最初にチェックするので、それ以外をランダムに試行する。
        const _qty = qty && qty > 0 ? qty : Math.floor(Math.random() * choices.length) + 1;
        selected = choices.randomPickMany(_qty);
      }
      return selected;
    }

    this.waitMode = choices.every(
      (e) => (e.fieldCell.isPlayFieldCell && e.getIndexInCell() === 0) || (e.fieldCell.cellType === "Hand" && e.controller === chooser)
    )
      ? "SelectFieldEntities"
      : "SelectEntities";

    const actions = await this._waitDuelistAction(chooser, [], this.waitMode, message, choices, qty, validator, cancelable);

    return [...(actions.selectedEntities ?? [])];
  };

  private readonly _waitDuelistAction = async (
    activator: Duelist,
    dummyActionInfos: DummyActionInfo[],
    waitMode: TDuelWaitMode,
    message: string,
    selectableEntities?: DuelEntity[],
    qty?: number,
    entitiesValidator?: (selected: DuelEntity[]) => boolean,
    cancelable: boolean = false
  ): Promise<DuelistResponseBase> => {
    this.waitMode = waitMode;
    this._message = message;

    this.onDuelUpdateEvent.trigger();

    // Promise一式作成
    const promiseSweet = createPromiseSweet<DuelistResponseBase>();

    // 待機のための引数作成。解決のためのresolveを渡す
    const args: WaitStartEventArg = {
      resolve: promiseSweet.resolve,
      activator: activator,
      dummyActionInfos,
      qty: qty,
      chainBlockInfos: activator.duel.chainBlockInfos,
      entitiesValidator: entitiesValidator || (() => false),
      selectableEntities: selectableEntities || [],
    };

    // エンティティ選択の場合引数追加
    if (selectableEntities && entitiesValidator && this.waitMode === "SelectEntities") {
      args.duelEntitiesSelectorArg = {
        title: message,
        entities: selectableEntities,
        validator: entitiesValidator,
        qty: qty ?? -1,
        cancelable: false,
        chainBlockInfos: activator.duel.chainBlockInfos,
      };
    }

    // 待機開始を通知
    this.onWaitStartEvent.trigger(args);

    // 待機開始
    const userAction: DuelistResponseBase = await promiseSweet.promise;

    this.waitMode = "None";
    this.onWaitEndEvent.trigger();
    if (userAction.surrender) {
      throw new DuelEnd(this.duel.duelists.Above);
    }
    if (!cancelable && userAction.cancel) {
      throw new SystemError("キャンセル不可のアクションがキャンセルされた。", userAction, dummyActionInfos, waitMode, selectableEntities);
    }
    this.infoBoardState = "Log";

    return userAction;
  };

  public readonly waitSelectText = async (choises: { seq: number; text: string }[], msg: string, cancelable: boolean = false): Promise<number | undefined> => {
    return this.duel.view.modalController.selectText(this.duel.view, {
      title: msg,
      choises: choises,
      cancelable: cancelable,
    });
  };

  public readonly waitAnimation = async (args: Omit<AnimationStartEventArg, "resolve">): Promise<void> => {
    this._message = "";
    this.waitMode = "Animation";
    this.onDuelUpdateEvent.trigger();
    return new Promise<void>((resolve) => this.onAnimationStartEvent.trigger({ ...args, resolve }));
  };

  public readonly setDraggingActions = (validatedActionInfos: (DummyActionInfo & { battlePosition?: TBattlePosition })[]) => {
    this.onDragStartEvent.trigger(validatedActionInfos);
    this.requireUpdate();
  };

  public readonly removeDraggingActions = () => {
    this.onDragEndEvent.trigger();
  };

  public readonly waitSelectAction = async <T extends CardActionBase>(
    chooser: Duelist,
    items: { entity: DuelEntity; title: string; origin: T }[],
    message: string,
    cancelable: boolean
  ): Promise<T | undefined> => {
    // 入力待ちのためにdammyAction化
    const dummyActionInfos = items.map((item) => CardAction.createDummyAction(item.entity, item.title, [], undefined, item.origin));
    const actionInfo = await this._waitDammyAction(chooser, dummyActionInfos, message, cancelable);
    if (!actionInfo) {
      return;
    }
    const result = items.find((item) => item.origin.seq === actionInfo.originSeq)?.origin;
    if (!result) {
      throw new SystemError("想定されない状態", items, actionInfo);
    }
    return result;
  };

  public readonly waitSelectSummonDestination = async (
    summoner: Duelist,
    entity: DuelEntity,
    availableCells: DuelFieldCell[],
    posList: Readonly<TBattlePosition[]>,
    cancelable: boolean
  ): Promise<{ dest: DuelFieldCell; battlePosition: TBattlePosition } | undefined> => {
    const message = availableCells.length > 1 ? "カードを召喚先へドラッグ。" : "表示形式を選択。";

    if (!availableCells.length && !posList.length) {
      if (cancelable) {
        return;
      }
      throw new SystemError("想定されない状態", summoner, entity, availableCells, posList, cancelable);
    }

    const result = { dest: availableCells.randomPick(), battlePosition: posList[0] };

    const dummyActionInfos = posList.map((pos) => CardAction.createDummyAction(entity, pos, availableCells, pos));

    const act = await this._waitDammyAction(summoner, dummyActionInfos, message, cancelable);
    if (!act) {
      return;
    }
    result.dest = act.dest ?? result.dest;
    result.battlePosition = act.battlePosition ?? result.battlePosition;

    return result;
  };

  public readonly waitSelectDestination = async (
    chooser: Duelist,
    entity: DuelEntity,
    selectableCells: DuelFieldCell[],
    message: string,
    actionTitle: string,
    cancelable: boolean = false
  ): Promise<DuelFieldCell | undefined> => {
    if (!selectableCells.length) {
      return;
    }
    let dest: DuelFieldCell = selectableCells.randomPick();
    const dummyActionInfos = [CardAction.createDummyAction(entity, actionTitle, selectableCells, undefined)];
    const act = await this._waitDammyAction(chooser, dummyActionInfos, message, cancelable);
    if (!act) {
      return;
    }
    dest = act.dest ?? dest;
    return dest;
  };
  private readonly _waitDammyAction = async (
    chooser: Duelist,
    dummyActionInfos: DummyActionInfo[],
    message: string,
    cancelable: boolean = false
  ): Promise<ResolvedDummyActionInfo | undefined> => {
    if (!dummyActionInfos.length) {
      return;
    }

    const sample = dummyActionInfos.randomPick();

    let result: ResolvedDummyActionInfo = { ...sample, dest: sample.dest ?? sample.dests.randomPick() };

    if (chooser.duelistType !== "NPC") {
      const promises = [
        this.duel.view.modalController.selectAction(this.duel.view, {
          title: message,
          activator: chooser,
          dummyActionInfos,
          cancelable: false,
        }),
        this.duel.view.waitSubAction(chooser, dummyActionInfos, message, cancelable),
      ];
      const act = await Promise.any(promises);
      if (!act && !cancelable) {
        throw new IllegalCancelError(act);
      }
      if (!act) {
        return;
      }
      result = act ?? result;
    }

    return result;
  };
}

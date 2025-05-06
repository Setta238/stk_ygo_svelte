import { StkEvent } from "@stk_utils/class/StkEvent";
import { Duel, DuelEnd, IllegalCancelError, SystemError, type DuelistResponse, type ResponseActionInfo } from "@ygo_duel/class/Duel";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelFieldCell, type TDuelEntityMovePos } from "@ygo_duel/class/DuelFieldCell";
import { type Duelist } from "@ygo_duel/class/Duelist";
import { DuelModalController } from "./DuelModalController";
import { EntityAction, type ChainBlockInfo, type DummyActionInfo, type ICardAction, type ValidatedActionInfo } from "../../ygo_duel/class/DuelEntityAction";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { createPromiseSweet, delay } from "@stk_utils/funcs/StkPromiseUtil";
import type { TCardDetailMode } from "@ygo_duel_view/components/DuelCardDetail.svelte";
import type { TDuelPhase } from "@ygo_duel/class/DuelPeriod";
import type { EntityActionBase } from "@ygo_duel/class/DuelEntityActionBase";
import { randomChoice, type ChoicesSweet } from "@ygo_duel/class/DuelUtilTypes";
import { userAgentInfo } from "@stk_utils/class/StkUserAgentInfo";
export type TDuelWaitMode = "None" | "Free" | "Modal" | "Animation";

export type ResolvedDummyActionInfo = {
  action: ICardAction;
  dest?: DuelFieldCell;
  battlePosition?: TBattlePosition;
  originSeq: number;
};

export type DuelistResponseBase = {
  phaseChange?: TDuelPhase;
  selectedEntities?: DuelEntity[];
  selectedCells?: DuelFieldCell[];
  sendMessage?: string;
  actionInfo?: ResolvedDummyActionInfo;
  cancel?: boolean;
  surrender?: boolean;
};

export type WaitStartEventArg = {
  resolve: (response: DuelistResponseBase) => void;
  activator: Duelist;
  dummyActionInfos: DummyActionInfo[];
  entitiesChoices: ChoicesSweet<DuelEntity> | undefined;
  cellsChoices: ChoicesSweet<DuelFieldCell> | undefined;
  chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>;
};

export type AnimationStartEventArg = {
  entity: DuelEntity;
  to: DuelFieldCell;
  index: TDuelEntityMovePos;
  resolve: () => void;
  count: number;
};
export type TDuelDeskInfoBoardState = "Default" | "Log" | "CellInfo";

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
    return (this._message || this.duel.log.lastRecord?.text) ?? "";
  }
  public waitMode: TDuelWaitMode;
  public infoBoardState: TDuelDeskInfoBoardState;
  public infoBoardCell: DuelFieldCell;
  constructor(duel: Duel) {
    this.duel = duel;
    this._message = "";
    this.waitMode = "None";
    this.infoBoardState = "Default";
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
    const res = await this._waitDuelistAction(this.duel.getTurnPlayer(), validatedActionInfos, "Free", "", undefined, undefined, false);

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

    const promiseList = [
      this.modalController.actionSelector.show({
        title: message,
        activator: activator,
        dummyActionInfos: validatedActionInfos,
        cancelable: cancelable,
      }),
      this._waitDuelistAction(activator, validatedActionInfos, "Modal", this.message, undefined, undefined, false).then((result) => result.actionInfo),
    ];

    const actionInfo = await Promise.any(promiseList);
    if (!actionInfo) {
      return;
    }

    this.infoBoardState = "Default";

    const origin = validatedActionInfos.find((info) => actionInfo.originSeq === info.originSeq);
    if (!origin) {
      throw new SystemError("想定されない状態", actionInfo);
    }
    return { ...origin, dest: actionInfo.dest };
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
    const response = await this._waitDuelistAction(chooser, dummyActionInfos, "Modal", message, undefined, undefined, cancelable);

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
    entitiesChoices: ChoicesSweet<DuelEntity>,
    message: string
  ): Promise<DuelEntity[] | undefined> => {
    if (!entitiesChoices.selectables.length) {
      return;
    }
    if (entitiesChoices.qty && entitiesChoices.selectables.length === entitiesChoices.qty) {
      return [...entitiesChoices.selectables];
    }

    if (chooser.duelistType === "NPC") {
      // NPCはランダムに選択する
      return randomChoice(entitiesChoices);
    }

    let cellsChoices: ChoicesSweet<DuelFieldCell> | undefined = undefined;

    if (entitiesChoices.selectables.some((e) => e.entityType === "Duelist")) {
      cellsChoices = {
        ...entitiesChoices,
        selectables: entitiesChoices.selectables.filter((e) => e.entityType === "Duelist").map((e) => e.fieldCell),
        qty: 1,
        validator: (selected) => selected.length === 1,
      };
    }

    const response = await this._waitDuelistAction(chooser, [], "Modal", message, entitiesChoices, cellsChoices, entitiesChoices.cancelable);

    const result = [
      ...(response.selectedEntities ?? []),
      ...(response.selectedCells ?? []).flatMap((cell) => cell.entities).filter((e) => e.entityType === "Duelist"),
    ];

    return result.length ? result : [];
  };

  public readonly waitSelectText = async <C extends { seq: number; text: string }>(
    chooser: Duelist,
    choises: C[],
    title: string,
    cancelable: boolean = false
  ): Promise<C | undefined> => {
    if (chooser.duelistType === "NPC") {
      return choises.randomPick();
    }

    const selected = await this.modalController.textSelector.show({ title, choises, cancelable });

    if (selected === undefined) {
      if (!cancelable) {
        throw new IllegalCancelError(chooser, choises, title, cancelable);
      }
      return;
    }

    return choises.find((c) => c.seq === selected);
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

  public readonly waitSelectAction = async <T extends EntityActionBase>(
    chooser: Duelist,
    items: { entity: DuelEntity; title: string; origin: T }[],
    message: string,
    cancelable: boolean
  ): Promise<T | undefined> => {
    // 入力待ちのためにdammyAction化
    const dummyActionInfos = items.map((item) => EntityAction.createDummyAction(item.entity, item.title, [], undefined, item.origin));
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
    const message = availableCells.length > 1 && userAgentInfo.canDragElement ? "カードを召喚先へドラッグ。" : "表示形式を選択。";

    if (!availableCells.length && !posList.length) {
      if (cancelable) {
        return;
      }
      throw new SystemError("想定されない状態", summoner, entity, availableCells, posList, cancelable);
    }

    let _posList = [...posList];

    while (true) {
      const result = { dest: availableCells.randomPick(), battlePosition: _posList[0] };

      if (_posList.length === 1 && !userAgentInfo.canDragElement) {
        const dest = await this.waitSelectCell(summoner, availableCells, cancelable, "召喚先を選択。");
        if (!dest) {
          return;
        }
        return { ...result, dest };
      }

      const dummyActionInfos = _posList.map((pos) => EntityAction.createDummyAction(entity, pos, availableCells, pos));

      const act = await this._waitDammyAction(summoner, dummyActionInfos, message, cancelable);
      if (!act) {
        return;
      }

      if (act.battlePosition) {
        _posList = [act.battlePosition];
      }

      if (availableCells.length > 1 && !act.dest) {
        continue;
      }

      result.dest = act.dest ?? result.dest;
      result.battlePosition = act.battlePosition ?? result.battlePosition;

      return result;
    }
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
    if (selectableCells.length === 1) {
      return selectableCells[0];
    }
    if (!userAgentInfo.canDragElement) {
      return await this.waitSelectCell(chooser, selectableCells, cancelable, message);
    }

    let dest: DuelFieldCell = selectableCells.randomPick();
    const dummyActionInfos = [EntityAction.createDummyAction(entity, actionTitle, selectableCells, undefined)];
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
        this.modalController.actionSelector.show({
          title: message,
          activator: chooser,
          dummyActionInfos,
          cancelable: false,
        }),
        this.duel.view.waitSubAction(chooser, dummyActionInfos, message, cancelable),
      ];
      const act = await Promise.any(promises);
      if (!act && !cancelable) {
        throw new IllegalCancelError(act, promises);
      }
      if (!act) {
        return;
      }
      result = act ?? result;
    }

    return result;
  };

  public readonly waitSelectCell = async (
    chooser: Duelist,
    selectableCells: DuelFieldCell[],
    cancelable: boolean,
    message: string
  ): Promise<DuelFieldCell | undefined> => {
    if (!selectableCells.length) {
      return;
    }

    if (chooser.duelistType === "NPC") {
      return selectableCells.randomPick();
    }
    const selected =
      (await this.waitSelectCells(chooser, { selectables: selectableCells, qty: 1, validator: (selected) => selected.length === 1, cancelable }, message)) ??
      [];

    return selected[0];
  };
  public readonly waitSelectCells = async (
    chooser: Duelist,
    cellsChoices: ChoicesSweet<DuelFieldCell>,
    message: string
  ): Promise<DuelFieldCell[] | undefined> => {
    if (!cellsChoices.selectables.length) {
      return;
    }

    if (chooser.duelistType === "NPC") {
      return randomChoice(cellsChoices);
    }
    const response = await this._waitDuelistAction(chooser, [], "Modal", message, undefined, cellsChoices, cellsChoices.cancelable);

    if ((!response || !response.selectedCells) && !cellsChoices.cancelable) {
      throw new IllegalCancelError(chooser, cellsChoices, message);
    }

    return response.selectedCells;
  };
  private readonly _waitDuelistAction = async (
    activator: Duelist,
    dummyActionInfos: DummyActionInfo[],
    waitMode: TDuelWaitMode,
    message: string,
    entitiesChoices: ChoicesSweet<DuelEntity> | undefined,
    cellsChoices: ChoicesSweet<DuelFieldCell> | undefined,
    cancelable: boolean = false
  ): Promise<DuelistResponseBase> => {
    this.waitMode = waitMode;
    this._message = message;

    // TODO セルの初期化が終わっていないことがあるので待機が必要だが、判定方法が正しくない。
    while (this.onDuelUpdateEvent.length < 38) {
      await delay(1);
    }
    this.onDuelUpdateEvent.trigger();

    // Promise一式作成
    const promiseSweet = createPromiseSweet<DuelistResponseBase>();

    // 待機のための引数作成。解決のためのresolveを渡す
    const args: WaitStartEventArg = {
      resolve: promiseSweet.resolve,
      activator,
      dummyActionInfos,
      chainBlockInfos: activator.duel.chainBlockInfos,
      entitiesChoices,
      cellsChoices,
    };

    console.info("wait start", args);

    // 待機開始を通知
    this.onWaitStartEvent.trigger(args);
    // 待機開始
    const userAction: DuelistResponseBase = await promiseSweet.promise;
    console.info("response", userAction);

    this.modalController.terminateAll();

    this.waitMode = "None";
    this.onWaitEndEvent.trigger();
    if (userAction.surrender) {
      throw new DuelEnd(activator.getOpponentPlayer(), `${activator.profile.name}がサレンダーした。`);
    }
    if (!cancelable && userAction.cancel) {
      throw new SystemError("キャンセル不可のアクションがキャンセルされた。", userAction, dummyActionInfos, waitMode, entitiesChoices, cellsChoices);
    }
    this.infoBoardState = "Default";

    return userAction;
  };
}

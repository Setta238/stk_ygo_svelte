import StkEvent from "@stk_utils/class/StkEvent";
import { Duel, DuelEnd, type DuelistAction } from "@ygo_duel/class/Duel";
import type DuelEntity from "@ygo_duel/class/DuelEntity";
import type { CardAction, TCardActionType, TSpellSpeed } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import type Duelist from "@ygo_duel/class/Duelist";
import { modalController } from "./ModalController";
export type TDuelWaitMode = "None" | "CardAction" | "EntitiesSelect" | "SubActionSelect";

export class DuelViewController {
  private onDuelUpdateEvent = new StkEvent<void>();
  public get onDuelUpdate() {
    return this.onDuelUpdateEvent.expose();
  }
  public readonly requireUpdate = () => {
    this.onDuelUpdateEvent.trigger();
  };
  private onWaitStartEvent = new StkEvent<{ resolve: (action: DuelistAction) => void; entitiesValidator: (selectedEntities: DuelEntity[]) => boolean }>();
  public get onWaitStart() {
    return this.onWaitStartEvent.expose();
  }
  private onWaitEndEvent = new StkEvent<void>();
  public get onWaitEnd() {
    return this.onWaitEndEvent.expose();
  }
  public readonly duel: Duel;
  private draggingAction: CardAction | undefined;
  public message: string;
  public waitMode: TDuelWaitMode;
  public readonly enableCardPlayTypes: TCardActionType[];
  public readonly enableSpellSpeeds: TSpellSpeed[];
  public readonly enableActions: CardAction[];
  constructor(duel: Duel) {
    this.duel = duel;
    this.message = "";
    this.waitMode = "None";
    this.enableCardPlayTypes = [];
    this.enableSpellSpeeds = [];
    this.enableActions = [];
  }

  public readonly waitUserSelectEntitiesOnField = async (
    duelist: Duelist,
    entities: DuelEntity[],
    qty: number,
    validator: (selected: DuelEntity[]) => boolean,
    cancelable: boolean, //TODO
    message: string
  ): Promise<DuelEntity[] | undefined> => {
    let selected: DuelEntity[] = [];

    if (duelist.duelistType === "NPC") {
      // NPCはランダムに選択する
      while (!validator(selected)) {
        // 一個も選択しないパターンは最初にチェックするので、それ以外をランダムに試行する。
        const _qty = qty > 0 ? qty : Math.floor(Math.random() * entities.length) + 1;
        selected = entities.randomPick(_qty);
      }
      return selected;
    }

    this.duel.field.getAllEntities().forEach((e) => (e.isSelectable = entities.includes(e)));

    this.waitMode = "EntitiesSelect";
    this.message = message;
    const userAction: DuelistAction = await new Promise<DuelistAction>((resolve) => {
      this.onDuelUpdateEvent.trigger();
      this.onWaitStartEvent.trigger({
        resolve: (tmp) => {
          resolve(tmp);
        },
        entitiesValidator: validator,
      });
    });
    this.waitMode = "None";
    this.onWaitEndEvent.trigger();
    if (userAction.surrender) {
      throw new DuelEnd(this.duel.duelists.Above);
    }
    if (userAction.selectedEntities) {
      return userAction.selectedEntities;
    }
    return;
  };

  public readonly waitUserAction = async (
    priorityHolder: Duelist,
    enableCardPlayTypes: TCardActionType[],
    enableSpellSpeeds: TSpellSpeed[]
  ): Promise<DuelistAction> => {
    const actions = this._prepareUserAction(priorityHolder, enableCardPlayTypes, enableSpellSpeeds);

    if (priorityHolder.duelistType === "NPC") {
      const action = actions.find((act) => act.playType === "Summon");
      return action
        ? { action: action }
        : {
            phaseChange: this.duel.nextPhaseList[0],
          };
    }
    this.message = `あなたの行動順です。`;
    return await this._waitUserAction(priorityHolder, "CardAction");
  };
  public readonly waitUserSubAction = async (duelist: Duelist, enableActions: CardAction[], message: string): Promise<DuelistAction> => {
    this.enableCardPlayTypes.reset();
    this.enableSpellSpeeds.reset();
    this.enableActions.reset(...enableActions);
    this.message = message;
    return await this._waitUserAction(duelist, "SubActionSelect");
  };

  public readonly waitUserQuickEffect = async (
    priorityHolder: Duelist,
    enableCardPlayTypes: TCardActionType[],
    enableSpellSpeeds: TSpellSpeed[],
    title: string
  ): Promise<{ action: CardAction; cell?: DuelFieldCell } | undefined> => {
    const actions = this._prepareUserAction(priorityHolder, enableCardPlayTypes, enableSpellSpeeds);
    if (actions.length === 0) {
      return;
    }
    const promise1 = modalController
      .selectAction(this.duel, {
        title: title,
        actions: actions,
        cancelable: true,
      })
      .then((action) => {
        return action && ({ action: action, cell: undefined } as { action: CardAction; cell?: DuelFieldCell });
      });
    const promise2 = this._waitUserAction(priorityHolder, "SubActionSelect").then((result) => {
      return { action: result.action, cell: result.cell } as { action: CardAction; cell?: DuelFieldCell } | undefined;
    });
    return await Promise.any([promise1, promise2]);
  };

  private readonly _prepareUserAction = (priorityHolder: Duelist, enableCardPlayTypes: TCardActionType[], enableSpellSpeeds: TSpellSpeed[]): CardAction[] => {
    this.duel.priorityHolder = priorityHolder;
    this.enableCardPlayTypes.reset(...enableCardPlayTypes);
    this.enableSpellSpeeds.reset(...enableSpellSpeeds);
    const result = this.duel.field
      .getAllEntities()
      .filter((entity) => entity.controller === priorityHolder)
      .map((entity) => entity.actions)
      .flat()
      .filter((action) => this.enableCardPlayTypes.includes(action.playType))
      .filter((action) => this.enableSpellSpeeds.includes(action.spellSpeed))
      .filter((action) => action.validate());
    this.enableActions.reset(...result);
    return result;
  };

  private readonly _waitUserAction = async (duelist: Duelist, waitMode: TDuelWaitMode): Promise<DuelistAction> => {
    this.waitMode = waitMode;

    const userAction: DuelistAction = await new Promise<DuelistAction>((resolve) => {
      this.onDuelUpdateEvent.trigger();
      this.onWaitStartEvent.trigger({ resolve, entitiesValidator: () => false });
    });

    this.waitMode = "None";
    this.onWaitEndEvent.trigger();
    if (userAction.surrender) {
      throw new DuelEnd(this.duel.duelists.Above);
    }
    return userAction;
  };
  public readonly getDraggingAction = (): CardAction | undefined => {
    return this.draggingAction;
  };
  public readonly setDraggingAction = (action: CardAction) => {
    this.draggingAction = action;
    const targetList = action.validate() || [];
    this.duel.field.getAllCells().forEach((cell) => (cell.canAcceptDrop = targetList.includes(cell)));
    this.requireUpdate();
  };
  public readonly removeDraggingAction = () => {
    this.duel.field.getAllCells().forEach((cell) => (cell.canAcceptDrop = false));
    this.requireUpdate();
  };
}

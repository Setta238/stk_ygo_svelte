import StkEvent from "@stk_utils/class/StkEvent";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { CardActionSelectorArg } from "@ygo_duel_view/components/DuelActionSelector.svelte";
import type { DuelEntitiesSelectorArg } from "@ygo_duel_view/components/DuelEntitiesSelector.svelte";
import type { DuelViewController } from "./DuelViewController";
import type { ICardAction } from "@ygo_duel/class/DuelCardAction";

const modalNames = ["DuelEntitiesSelector", "DuelActionSelector"] as const;
export type TModalName = (typeof modalNames)[number];
export type TModalState = "Disable" | "Shown";

export class DuelModalController {
  private onUpdateEvent = new StkEvent<void>();
  public get onUpdate() {
    return this.onUpdateEvent.expose();
  }
  public readonly states: { [key in TModalName]: TModalState };
  public readonly view: DuelViewController;
  public readonly cancelAll = (): void => {
    modalNames.forEach((name) => (this.states[name] = "Disable"));
    console.info(this, "cancelAll");
    this.onUpdateEvent.trigger();
  };

  public duelEntitiesSelectorArg: DuelEntitiesSelectorArg = {
    title: "対象を選択",
    entities: [],
    validator: () => true,
    qty: -1,
    cancelable: false,
  };
  public duelEntitiesSelectorValue: DuelEntity[] | undefined;
  public duelEntitiesSelectorResolve: (value: DuelEntity[] | undefined) => void = () => {};
  public constructor(view: DuelViewController) {
    this.view = view;
    this.states = modalNames.reduce(
      (dic, name) => {
        dic[name] = "Disable";
        return dic;
      },
      {} as { [key in TModalName]: TModalState }
    );
  }
  public readonly selectDuelEntities = async (arg: DuelEntitiesSelectorArg): Promise<DuelEntity[] | undefined> => {
    this.duelEntitiesSelectorArg = arg;
    this.states.DuelEntitiesSelector = "Shown";
    this.onUpdateEvent.trigger();
    return new Promise((resolve) => {
      this.duelEntitiesSelectorResolve = (value: DuelEntity[] | undefined) => {
        this.states.DuelEntitiesSelector = "Disable";
        this.onUpdateEvent.trigger();
        resolve(value);
      };
    });
  };
  public cardActionSelectorArg: CardActionSelectorArg = {
    title: "カード操作を選択。",
    actions: [],
    cancelable: false,
  };
  public cardActionSelectorResolve: (action: ICardAction<unknown> | undefined) => void = () => {};
  public cardActionSelectorValue: ICardAction<unknown> | undefined;

  public readonly selectAction = async (view: DuelViewController, arg: CardActionSelectorArg): Promise<ICardAction<unknown> | undefined> => {
    this.cardActionSelectorArg = arg;
    this.states.DuelActionSelector = "Shown";

    view.onWaitEnd.append(this.cancelAll);
    this.onUpdateEvent.trigger();
    return new Promise((resolve) => {
      this.cardActionSelectorResolve = (value: ICardAction<unknown> | undefined) => {
        console.log(value);
        this.states.DuelActionSelector = "Disable";
        view.onWaitEnd.remove(this.cancelAll);
        this.onUpdateEvent.trigger();
        resolve(value);
      };
    });
  };
}

import type { Duel } from "@ygo_duel/class/Duel";
import StkEvent from "../../stk_utils/class/StkEvent";
import type { CardAction } from "../../ygo_duel/class/DuelEntity";
import type DuelEntity from "../../ygo_duel/class/DuelEntity";
import type { CardActionSelectorArg } from "../components/DuelActionSelector.svelte";
import type { DuelEntitiesSelectorArg } from "../components/DuelEntitiesSelector.svelte";

const modalNames = ["DuelEntitiesSelector", "DuelActionSelector"] as const;
export type TModalName = (typeof modalNames)[number];
export type TModalState = "Disable" | "Shown";

class ModalController {
  private onUpdateEvent = new StkEvent<void>();
  public get onUpdate() {
    return this.onUpdateEvent.expose();
  }
  public readonly states: { [key in TModalName]: TModalState };
  public readonly cancelAll = (): void => {
    modalNames.forEach((name) => (this.states[name] = "Disable"));
    console.log(this, "cancelAll");
    this.onUpdateEvent.trigger();
  };

  public duelEntitiesSelectorArg: DuelEntitiesSelectorArg = {
    title: "対象を選択",
    entities: [],
    validator: () => true,
    cancelable: false,
  };
  public duelEntitiesSelectorValue: DuelEntity[] | undefined;
  public duelEntitiesSelectorResolve: (value: DuelEntity[] | undefined) => void = () => {};
  public constructor() {
    this.states = modalNames.reduce(
      (dic, name) => {
        dic[name] = "Disable";
        return dic;
      },
      {} as { [key in TModalName]: TModalState }
    );
  }
  public readonly selectDuelEntities = async (duel: Duel, arg: DuelEntitiesSelectorArg): Promise<DuelEntity[] | undefined> => {
    this.duelEntitiesSelectorArg = arg;
    this.states.DuelEntitiesSelector = "Shown";
    console.log(this);
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
  public cardActionSelectorResolve: (action: CardAction | undefined) => void = () => {};
  public cardActionSelectorValue: CardAction | undefined;

  public readonly selectAction = async (duel: Duel, arg: CardActionSelectorArg): Promise<CardAction | undefined> => {
    this.cardActionSelectorArg = arg;
    this.states.DuelActionSelector = "Shown";

    duel.onWaitEnd.append(this.cancelAll);
    this.onUpdateEvent.trigger();
    return new Promise((resolve) => {
      this.cardActionSelectorResolve = (value: CardAction | undefined) => {
        this.states.DuelActionSelector = "Disable";
        duel.onWaitEnd.remove(this.cancelAll);
        this.onUpdateEvent.trigger();
        resolve(value);
      };
    });
  };
}
export const modalController = new ModalController();

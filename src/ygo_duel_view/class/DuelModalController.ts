import { StkEvent } from "@stk_utils/class/StkEvent";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { CardActionSelectorArgs } from "@ygo_duel_view/components/DuelActionSelector.svelte";
import type { DuelEntitiesSelectorArg } from "@ygo_duel_view/components/DuelEntitiesSelector.svelte";
import type { DuelViewController, ResolvedDummyActionInfo } from "./DuelViewController";
import type { DuelTextSelectorArg } from "@ygo_duel_view/components/DuelTextSelector.svelte";
import { DuelModalBase } from "./DuelModalBase";

export class DuelModalController {
  private onUpdateEvent = new StkEvent<void>();
  public get onUpdate() {
    return this.onUpdateEvent.expose();
  }

  public readonly actionSelector = new DuelModalBase<CardActionSelectorArgs, ResolvedDummyActionInfo>({
    title: "カード操作を選択。",
    activator: undefined!,
    dummyActionInfos: [],
    cancelable: false,
  });
  public readonly entitySelector = new DuelModalBase<DuelEntitiesSelectorArg, DuelEntity[]>({
    title: "対象を選択",
    entitiesChoices: { selectables: [], validator: () => true, cancelable: false },
    cancelable: false,
    chainBlockInfos: [],
  });
  public readonly textSelector = new DuelModalBase<DuelTextSelectorArg, number>({
    title: "カード操作を選択。",
    choises: [],
    cancelable: false,
  });

  public readonly modals = [this.actionSelector, this.entitySelector, this.textSelector] as const;

  public readonly view: DuelViewController;
  public readonly terminateAll = (): void => {
    this.modals.forEach((modal) => modal.terminate());
    this.onUpdateEvent.trigger();
  };

  public constructor(view: DuelViewController) {
    this.view = view;
    this.modals.forEach((modal) => modal.onUpdate.append(() => this.onUpdateEvent.trigger()));
  }
}

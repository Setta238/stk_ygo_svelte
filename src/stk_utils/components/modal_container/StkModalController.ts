import { StkEvent, type IStkEvent } from "@stk_utils/class/StkEvent";
import { StkModalDefinitionBase, type IStkModalDefinition, type ModalArgsBase } from "@stk_utils/components/modal_container/StkModalDefinitionBase";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eventHolderKeys = ["onDragStart", "onDragEnd"] as const;
type TEventHolderKey = (typeof eventHolderKeys)[number];

export type EventHolder = {
  [key in TEventHolderKey]: IStkEvent<unknown>;
};

export type TextSelectorArgs = ModalArgsBase & {
  choises: { seq: number; text: string }[];
};
export abstract class StkModalControllerBase {
  public readonly textSelector: StkModalDefinitionBase<TextSelectorArgs, number> = new StkModalDefinitionBase<TextSelectorArgs, number>({
    title: "選択。",
    position: "Middle",
    choises: [],
    cancelable: false,
  });
  private onUpdateEvent = new StkEvent<void>();
  public get onUpdate() {
    return this.onUpdateEvent.expose();
  }

  public readonly modals: IStkModalDefinition[];
  public readonly eventHolder: EventHolder;

  public constructor(eventHolder: EventHolder, ...modals: IStkModalDefinition[]) {
    this.modals = [this.textSelector, ...modals];
    this.eventHolder = eventHolder;
    this.modals.forEach((modal) =>
      modal.onUpdate.append(() => {
        this.onUpdateEvent.trigger();
      })
    );
  }

  public readonly terminateAll = (): void => {
    this.modals.forEach((modal) => modal.terminate());
    this.onUpdateEvent.trigger();
  };
}

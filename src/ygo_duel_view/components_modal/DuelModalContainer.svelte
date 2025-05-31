<script lang="ts" module>
  import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
  import type { CardActionSelectorArgs } from "@ygo_duel_view/components_modal/DuelActionSelector.svelte";
  import type { DuelEntitiesSelectorArg } from "@ygo_duel_view/components_modal/DuelEntitiesSelector.svelte";
  import type { DuelViewController, ResolvedDummyActionInfo } from "@ygo_duel_view/class/DuelViewController";
  import { StkModalDefinitionBase } from "@stk_utils/components/modal_container/StkModalDefinitionBase";
  import { StkModalControllerBase } from "@stk_utils/components/modal_container/StkModalController";
  type ModalMap = {
    actionSelector: StkModalDefinitionBase<CardActionSelectorArgs, ResolvedDummyActionInfo>;
    entitySelector: StkModalDefinitionBase<DuelEntitiesSelectorArg, DuelEntity[]>;
  };
  export type DuelModalController = DuelModalControllerFactory & ModalMap;
  export class DuelModalControllerFactory extends StkModalControllerBase {
    public static readonly createModalController = (view: DuelViewController): DuelModalController => {
      const modalMap = {
        actionSelector: new StkModalDefinitionBase<CardActionSelectorArgs, ResolvedDummyActionInfo>({
          title: "カード操作を選択。",
          position: "Bottom",
          activator: undefined!,
          dummyActionInfos: [],
          cancelable: false,
        }),
        entitySelector: new StkModalDefinitionBase<DuelEntitiesSelectorArg, DuelEntity[]>({
          title: "対象を選択",
          position: "Middle",
          entitiesChoices: { selectables: [], validator: () => true, cancelable: false },
          cancelable: false,
          chainBlockInfos: [],
        }),
      } as const;
      return Object.assign(new DuelModalControllerFactory(view, modalMap), modalMap);
    };

    private constructor(view: DuelViewController, modalMap: ModalMap) {
      super(view, ...Object.values(modalMap));
    }
  }
</script>

<script lang="ts">
  import DuelEntitiesSelector from "@ygo_duel_view/components_modal/DuelEntitiesSelector.svelte";
  import DuelActionSelector from "@ygo_duel_view/components_modal/DuelActionSelector.svelte";
  import StkModalContainer from "@stk_utils/components/modal_container/StkModalContainer.svelte";
  export let modalController: DuelModalController;
</script>

<StkModalContainer {modalController}>
  {#if modalController.entitySelector.state === "Shown"}
    <DuelEntitiesSelector
      eventHolder={modalController.eventHolder}
      args={modalController.entitySelector.args}
      resolve={modalController.entitySelector.resolve}
    />
  {/if}
  {#if modalController.actionSelector.state === "Shown"}
    <DuelActionSelector eventHolder={modalController.eventHolder} args={modalController.actionSelector.args} resolve={modalController.actionSelector.resolve} />
  {/if}
</StkModalContainer>

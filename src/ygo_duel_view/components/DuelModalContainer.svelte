<script lang="ts">
  import { DuelEntity } from "@ygo_duel/class/DuelEntity";
  import DuelEntitiesSelector from "@ygo_duel_view/components/DuelEntitiesSelector.svelte";
  import DuelActionSelector from "@ygo_duel_view/components/DuelActionSelector.svelte";
  import { DuelModalController } from "@ygo_duel_view/class/DuelModalController";
  import type { ICardAction } from "@ygo_duel/class/DuelCardAction";
  import DuelTextSelector from "./DuelTextSelector.svelte";
  export let modalController: DuelModalController;

  const onModalControllerUpdate = () => {
    modalController = modalController;
  };
  modalController?.onUpdate?.append(onModalControllerUpdate);
</script>

<div class="base">
  {#if modalController.states.DuelEntitiesSelector === "Shown"}
    <DuelEntitiesSelector
      title={modalController.duelEntitiesSelectorArg.title}
      entities={modalController.duelEntitiesSelectorArg.entities}
      validator={modalController.duelEntitiesSelectorArg.validator}
      qty={modalController.duelEntitiesSelectorArg.qty}
      cancelable={modalController.duelEntitiesSelectorArg.cancelable}
      resolve={(selectedList: DuelEntity[] | undefined) => {
        modalController.duelEntitiesSelectorResolve(selectedList);
      }}
    />
  {/if}
  {#if modalController.states.DuelActionSelector === "Shown"}
    <DuelActionSelector
      view={modalController.view}
      title={modalController.cardActionSelectorArg.title}
      actions={modalController.cardActionSelectorArg.actions}
      dragAndDropOnly={modalController.cardActionSelectorArg.dragAndDropOnly ?? false}
      cancelable={modalController.cardActionSelectorArg.cancelable}
      resolve={(action: ICardAction<unknown> | undefined) => {
        console.info(action);
        modalController.cardActionSelectorResolve(action);
      }}
    />
  {/if}
  {#if modalController.states.DuelTextSelector === "Shown"}
    <DuelTextSelector
      arg={modalController.duelTextSelectorArg}
      resolve={(action: number | undefined) => {
        console.info(action);
        modalController.duelTextSelectorResolve(action);
      }}
    />
  {/if}
</div>

<style>
  .base {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }
</style>

<script lang="ts">
  import DuelEntitiesSelector from "@ygo_duel_view/components_modal/DuelEntitiesSelector.svelte";
  import DuelActionSelector from "@ygo_duel_view/components_modal/DuelActionSelector.svelte";
  import DuelTextSelector from "@ygo_duel_view/components_modal/DuelTextSelector.svelte";
  import { DuelModalController } from "@ygo_duel_view/class/DuelModalController";
  export let modalController: DuelModalController;
  let isDragging = false;
  const onModalControllerUpdate = () => {
    modalController = modalController;
  };

  const onDragStart = () => {
    isDragging = true;
    onModalControllerUpdate();
  };
  const onDragEnd = () => {
    isDragging = false;
    onModalControllerUpdate();
  };
  modalController.view.onDragStart.append(onDragStart);
  modalController.view.onDragEnd.append(onDragEnd);
  const close = () => {
    modalController.modals.filter((modal) => modal.args.cancelable).forEach((modal) => modal.cancel());
  };

  modalController?.onUpdate?.append(onModalControllerUpdate);
</script>

<div class="base">
  {#if modalController.modals.some((modal) => modal.state === "Shown")}
    <button class="overlay {isDragging ? 'pointer_events_none' : ''}" onclick={close}>☆</button>
    {#if modalController.entitySelector.state === "Shown"}
      <DuelEntitiesSelector args={modalController.entitySelector.args} resolve={modalController.entitySelector.resolve} />
    {/if}
    {#if modalController.actionSelector.state === "Shown"}
      <DuelActionSelector view={modalController.view} args={modalController.actionSelector.args} resolve={modalController.actionSelector.resolve} />
    {/if}
    {#if modalController.textSelector.state === "Shown"}
      <DuelTextSelector args={modalController.textSelector.args} resolve={modalController.textSelector.resolve} />
    {/if}
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
  .overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: gray;
    opacity: 0.5;
    border-radius: 0%;
    pointer-events: initial;
  }
  .overlay.pointer_events_none {
    pointer-events: none;
  }
</style>

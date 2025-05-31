<script lang="ts">
  import type { StkModalControllerBase } from "./StkModalController";
  import StkModalTextSelector from "./StkModalTextSelector.svelte";
  export let modalController: StkModalControllerBase;
  let isDragging = false;
  const onModalControllerUpdate = () => {
    modalController = modalController;
  };

  const onDragStart = () => {
    console.log("hoge");
    isDragging = true;
    onModalControllerUpdate();
  };
  const onDragEnd = () => {
    isDragging = false;
    onModalControllerUpdate();
  };
  modalController.eventHolder.onDragStart.append(onDragStart);
  modalController.eventHolder.onDragEnd.append(onDragEnd);
  const close = () => modalController.modals.filter((modal) => modal.args.cancelable).forEach((modal) => modal.cancel());

  modalController.onUpdate.append(onModalControllerUpdate);
</script>

<div class="base {isDragging ? 'base_is_dragging' : ''}">
  {#if modalController.modals.some((modal) => modal.state === "Shown")}
    <button class="overlay {isDragging ? 'pointer_events_none' : ''}" onclick={close}>☆</button>
    <slot></slot>
    {#if modalController.textSelector.state === "Shown"}
      <StkModalTextSelector eventHolder={modalController.eventHolder} args={modalController.textSelector.args} resolve={modalController.textSelector.resolve} />
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
  .base_is_dragging {
    opacity: 0.5;
  }
  .overlay {
    display: block;
    color: grey;
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

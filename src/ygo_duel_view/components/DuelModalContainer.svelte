<script lang="ts">
  import DuelEntitiesSelector from "@ygo_duel_view/components/DuelEntitiesSelector.svelte";
  import DuelActionSelector from "@ygo_duel_view/components/DuelActionSelector.svelte";
  import { DuelModalController } from "@ygo_duel_view/class/DuelModalController";
  import DuelTextSelector from "./DuelTextSelector.svelte";
  export let modalController: DuelModalController;

  const onModalControllerUpdate = () => {
    modalController = modalController;
  };

  const close = () => {
    modalController.modals.forEach((modal) => modal.cancel());
  };

  modalController?.onUpdate?.append(onModalControllerUpdate);
</script>

<div class="base">
  {#if modalController.modals.some((modal) => modal.state === "Shown")}
    <button class="overlay" onclick={close}>☆</button>
    {#if modalController.entitySelector.state === "Shown"}
      <DuelEntitiesSelector args={modalController.entitySelector.args} resolve={modalController.entitySelector.resolve} />
    {/if}
    {#if modalController.actionSelector.state === "Shown"}
      <DuelActionSelector view={modalController.view} args={modalController.actionSelector.args} resolve={modalController.actionSelector.resolve} />
    {/if}
    {#if modalController.textSelector.state === "Shown"}
      <DuelTextSelector arg={modalController.textSelector.args} resolve={modalController.textSelector.resolve} />
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
  }
</style>

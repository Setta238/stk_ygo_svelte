<script lang="ts" module>
  import { writable } from "svelte/store";
  import DuelEntity, { type CardAction } from "@ygo_duel/class/DuelEntity";
  import { modalController } from "@ygo_duel_view/class/ModalController";
  import DuelEntitiesSelector from "@ygo_duel_view/components/DuelEntitiesSelector.svelte";
  import DuelActionSelector from "@ygo_duel_view/components/DuelActionSelector.svelte";
  let states = writable(modalController.states);

  const onModalControllerUpdate = () => {
    console.log(states);
    states.set(modalController.states);
  };
  modalController?.onUpdate?.append(onModalControllerUpdate);
</script>

<div class="base">
  {#if $states.DuelEntitiesSelector === "Shown"}
    <DuelEntitiesSelector
      title={modalController.duelEntitiesSelectorArg.title}
      entities={modalController.duelEntitiesSelectorArg.entities}
      validator={modalController.duelEntitiesSelectorArg.validator}
      cancelable={modalController.duelEntitiesSelectorArg.cancelable}
      resolve={(selectedList: DuelEntity[] | undefined) => {
        console.log(selectedList);
        modalController.duelEntitiesSelectorResolve(selectedList);
      }}
    />
  {/if}
  {#if $states.DuelActionSelector === "Shown"}
    <DuelActionSelector
      title={modalController.cardActionSelectorArg.title}
      actions={modalController.cardActionSelectorArg.actions}
      cancelable={modalController.cardActionSelectorArg.cancelable}
      resolve={(action: CardAction | undefined) => {
        console.log(action);
        modalController.cardActionSelectorResolve(action);
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

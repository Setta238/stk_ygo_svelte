<script lang="ts" module>
  export type DuelTextSelectorArg = {
    title: string;
    choises: { seq: number; text: string };
    validator: (entities: DuelEntity[]) => boolean;
    qty: number;
    cancelable: boolean;
  };
</script>

<script lang="ts">
  import type { DuelEntity } from "../../ygo_duel/class/DuelEntity";
  import DuelCard from "@ygo_duel_view/components/DuelCard.svelte";
  let { resolve, title, entities, validator, qty, cancelable } = $props();
  let selectedList = $state([] as DuelEntity[]);

  let isShown = true;

  const close = () => {};
</script>

{#if isShown}
  <div class="base">
    <button class="overlay" onclick={close}>★</button>
    <div class="window">
      <div>{title}</div>
      <div class="entities_list">
        {#each entities as entity}<div>
            <DuelCard
              {entity}
              isVisibleForcibly={true}
              state="Selectable"
              entitySelectResolve={(selected: DuelEntity[]) => resolve(selected)}
              {qty}
              bind:selectedList
            />
          </div>
        {/each}
      </div>
      <div>
        <button disabled={!validator(selectedList)} onclick={() => resolve(selectedList)}>OK</button>
        {#if cancelable}
          <button onclick={() => resolve(undefined)}>Cancel</button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .window {
    display: block;
    background-color: white;
    opacity: 0.9;
    max-width: 50%;
  }
  .entities_list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .base {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: initial;
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

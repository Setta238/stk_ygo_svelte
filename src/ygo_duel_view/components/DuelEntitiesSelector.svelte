<script lang="ts" module>
  export type DuelEntitiesSelectorArg = {
    title: string;
    entities: DuelEntity[];
    validator: (entities: DuelEntity[]) => boolean;
    qty: number;
    cancelable: boolean;
  };
</script>

<script lang="ts">
  import type { DuelEntity } from "../../ygo_duel/class/DuelEntity";
  import DuelCard from "@ygo_duel_view/components/DuelCard.svelte";
  let { resolve, title, entities, validator, qty, cancelable }: DuelEntitiesSelectorArg & { resolve: (selected: DuelEntity[] | undefined) => void } = $props();
  let selectedList = $state([] as DuelEntity[]);

  let isShown = true;

  const close = () => {};
</script>

{#if isShown}
  <div class="base">
    <button class="overlay" onclick={close}>☆</button>
    <div class="window">
      <div>{title}</div>
      {#each entities.map((e) => e.controller.seat).getDistinct() as seat}
        <div class="entities_list {seat}">
          {#each entities.filter((e) => e.controller.seat === seat) as entity}<div>
              <DuelCard
                {entity}
                isVisibleForcibly={true}
                state="Selectable"
                entitySelectResolve={(selected: DuelEntity[]) => resolve(selected)}
                {qty}
                cardActionResolve={undefined}
                bind:selectedList
              />
            </div>
          {/each}
        </div>
      {/each}

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
    padding: 0.5rem;
  }
  .entities_list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0.3rem;
    padding: 0.5rem;
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
  .window button {
    background-color: #ffffff;
    display: inline-block;
    padding: 0em 1em;
    text-decoration: none;
    color: #67c5ff;
    border: solid 0.2rem #67c5ff;
    border-radius: 3px;
    transition: 0.4s;
    margin: 0.1rem 0.3rem;
  }

  .window button:hover {
    background: #67c5ff;
    color: white;
  }
  .entities_list.Below {
    background-color: azure;
  }
  .entities_list.Above {
    background-color: blanchedalmond;
  }
</style>

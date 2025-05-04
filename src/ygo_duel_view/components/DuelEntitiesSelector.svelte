<script lang="ts" module>
  import type { ChainBlockInfo } from "@ygo_duel/class/DuelEntityAction";

  export type DuelEntitiesSelectorArg = {
    title: string;
    entitiesChoices: ChoicesSweet<DuelEntity>;
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>;
    cancelable: boolean;
  };
</script>

<script lang="ts">
  import { cardEntitySorter, type DuelEntity } from "../../ygo_duel/class/DuelEntity";
  import DuelCard from "@ygo_duel_view/components/DuelCard.svelte";
  import type { ChoicesSweet } from "@ygo_duel/class/DuelUtilTypes";
  let { args, resolve }: { args: DuelEntitiesSelectorArg; resolve: (selected: DuelEntity[] | undefined) => void } = $props();
  let selectedList = $state([] as DuelEntity[]);

  let isShown = true;
  let targetsInPreviousChainBlocks = args.chainBlockInfos.flatMap((info) => info.selectedEntities).getDistinct();
  const _resolve = () => {
    resolve(selectedList);
  };
</script>

{#if isShown}
  <div class="modal_window">
    <div>{args.title}</div>
    {#each args.entitiesChoices.selectables.map((e) => e.controller.seat).getDistinct() as seat}
      <div class="entities_list {seat}">
        {#each args.entitiesChoices.selectables.filter((e) => e.controller.seat === seat).toSorted(cardEntitySorter) as entity}
          <div class="entities_list_item {targetsInPreviousChainBlocks.includes(entity) ? `effect_target` : ``}">
            <DuelCard
              {entity}
              isVisibleForcibly={true}
              state="Selectable"
              entitySelectResolve={(selected: DuelEntity[]) => resolve(selected)}
              qty={args.entitiesChoices.qty}
              cardActionResolve={undefined}
              bind:selectedList
            />
          </div>
        {/each}
      </div>
    {/each}

    <div>
      <button disabled={!args.entitiesChoices.validator(selectedList)} onclick={_resolve}>OK</button>
      {#if args.entitiesChoices.cancelable}
        <button onclick={() => resolve(undefined)}>Cancel</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal_window {
    display: block;
    background-color: white;
    opacity: 0.9;
    max-width: 50%;
    padding: 0.5rem;
    width: fit-content;
  }
  .entities_list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0.3rem;
    padding: 0.5rem;
  }
  .entities_list_item {
    display: flex;
    flex-direction: column;
  }
  .entities_list_item::before {
    content: "{効果対象}";
    visibility: hidden;
  }
  .entities_list_item.effect_target::before {
    visibility: initial;
  }

  .modal_window button {
    background-color: #ffffff;
    display: inline-block;
    padding: 0em 1em;
    text-decoration: none;
    color: #67c5ff;
    border: solid 0.2rem #67c5ff;
    border-radius: 3px;
    transition: 0.4s;
    margin: 0.1rem 0.3rem;
    pointer-events: initial;
  }

  .modal_window button:hover {
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

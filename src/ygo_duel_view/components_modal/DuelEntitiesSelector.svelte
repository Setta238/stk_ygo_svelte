<script lang="ts" module>
  import type { ModalArgsBase } from "@stk_utils/components/modal_container/StkModalDefinitionBase";
  import type { ChainBlockInfo } from "@ygo_duel/class/DuelEntityAction";

  export type DuelEntitiesSelectorArg = ModalArgsBase & {
    entitiesChoices: ChoicesSweet<DuelEntity>;
    chainBlockInfos: Readonly<ChainBlockInfo<unknown>[]>;
  };
</script>

<script lang="ts">
  import { cardEntitySorter, type DuelEntity } from "@ygo_duel/class/DuelEntity";
  import DuelCard from "@ygo_duel_view/components/DuelCard.svelte";
  import type { ChoicesSweet } from "@ygo_duel/class/DuelUtilTypes";
  import StkModalWindow from "@stk_utils/components/modal_container/StkModalWindow.svelte";
  import type { EventHolder } from "@stk_utils/components/modal_container/StkModalController";
  let { eventHolder, args, resolve }: { eventHolder: EventHolder; args: DuelEntitiesSelectorArg; resolve: (selected: DuelEntity[] | undefined) => void } =
    $props();
  let selectedList = $state([] as DuelEntity[]);

  let isShown = true;
  let targetsInPreviousChainBlocks = args.chainBlockInfos.flatMap((info) => info.selectedEntities).getDistinct();
  const _resolve = () => resolve(selectedList);
</script>

{#if isShown}
  <StkModalWindow {eventHolder} {args}>
    <div slot="body">
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
              <div class="cell_type_name">〈{entity.fieldCell.shortName}〉</div>
            </div>
          {/each}
        </div>
      {/each}
    </div>

    <div slot="footer" class="modal_window_footer">
      {#if (args.entitiesChoices.qty ?? 1000) > 1}
        <button disabled={!args.entitiesChoices.validator(selectedList)} onclick={_resolve}>OK</button>
      {/if}
      {#if args.cancelable}
        <button class="cancel_button" onclick={() => resolve(undefined)}>Cancel</button>
      {/if}
    </div>
  </StkModalWindow>
{/if}

<style>
  .entities_list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
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

  .modal_window_footer button {
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

  .modal_window_footer button:hover {
    background: #67c5ff;
    color: white;
  }
  .modal_window_footer button:disabled {
    background: grey;
  }
  .entities_list.Below {
    background-color: azure;
  }
  .entities_list.Above {
    background-color: blanchedalmond;
  }
  .cell_type_name {
    font-size: 1rem;
  }
</style>

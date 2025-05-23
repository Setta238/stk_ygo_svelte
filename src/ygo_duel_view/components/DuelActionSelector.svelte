<script lang="ts" module>
  import { writable } from "svelte/store";
  import type { DummyActionInfo } from "@ygo_duel/class/DuelEntityAction";
  export type CardActionSelectorArgs = {
    title: string;
    activator: Duelist;
    dummyActionInfos: DummyActionInfo[];
    dragAndDropOnly?: boolean;
    cancelable: boolean;
  };
  export const dataKeys = {
    action_entity_name: "action_entity_name",
    action_title: "action_title",
    action_seq: "action_seq",
  };
</script>

<script lang="ts">
  import DuelCard from "@ygo_duel_view/components/DuelCard.svelte";
  import type { DuelViewController, ResolvedDummyActionInfo } from "@ygo_duel_view/class/DuelViewController";
  import type { Duelist } from "@ygo_duel/class/Duelist";
  export let view: DuelViewController;
  export let args: CardActionSelectorArgs;
  export let resolve: (selected?: ResolvedDummyActionInfo) => void;

  let isShown = true;

  let isDragging = writable(false);

  const onDragStart = () => isDragging.set(true);
  const onDragEnd = () => isDragging.set(false);
  view.onDragStart.append(onDragStart);
  view.onDragEnd.append(onDragEnd);
</script>

{#if isShown}
  <div class="modal_window">
    <div>{args.title}</div>
    <div class="flex" style="display: flex;">
      {#each args.dummyActionInfos as info}
        <div class="duel_card_wrapper">
          <DuelCard
            entity={info.action.entity}
            isVisibleForcibly={true}
            state={info.dests.length ? "Draggable" : "Clickable"}
            dummyActionInfos={args.dragAndDropOnly ? [] : [info]}
            cardActionResolve={resolve}
          />
          <div>«{info.action.title}»</div>
        </div>
      {/each}
    </div>
    {#if args.cancelable}
      <div>
        <button class="cancel_button" onclick={() => resolve()}>Cancel</button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .flex {
    display: flex;
  }
  button.cancel_button {
    border: 1px solid #000;
    background: #fff;
    font-weight: 700;
    line-height: 1.1;
    display: inline-block;
    padding: 0.3rem 1.1rem;
    cursor: pointer;
    margin: 0.5rem;
  }

  button.cancel_button:hover {
    color: #fff;
    background: #000;
  }
  .modal_window {
    display: block;
    background-color: white;
    opacity: 0.9;
    position: absolute;
    bottom: 0;
    pointer-events: initial;
    width: fit-content;
    max-width: 90vw;
    min-width: 10vw;
    height: fit-content;
    max-height: 40vh;
    min-height: 10vh;
    overflow-x: auto;
  }
  .duel_card_wrapper {
    font-size: 0.9rem;
    height: fit-content;
    width: fit-content;
  }
</style>

<script lang="ts" module>
  import { writable } from "svelte/store";
  import type { DummyActionInfo } from "@ygo_duel/class/DuelEntityAction";
  export type CardActionSelectorArgs = ModalArgsBase & {
    activator: Duelist;
    dummyActionInfos: DummyActionInfo[];
    dragAndDropOnly?: boolean;
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
  import type { ModalArgsBase } from "@ygo_duel_view/class/DuelModalBase";
  import DuelModalWindow from "./DuelModalWindow.svelte";
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
  <DuelModalWindow {args}>
    <div slot="body" style="display: flex;">
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
    <div slot="footer">
      {#if args.cancelable}
        <button class="cancel_button" onclick={() => resolve(undefined)}>Cancel</button>
      {/if}
    </div>
  </DuelModalWindow>
{/if}

<style>
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
  .duel_card_wrapper {
    font-size: 0.9rem;
    height: fit-content;
    width: fit-content;
  }
</style>

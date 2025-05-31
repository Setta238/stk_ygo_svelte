<script lang="ts" module>
  import type { DummyActionInfo } from "@ygo_duel/class/DuelEntityAction";
  import type { ModalArgsBase } from "@stk_utils/components/modal_container/StkModalDefinitionBase";
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
  import StkModalWindow from "@stk_utils/components/modal_container/StkModalWindow.svelte";
  import type { EventHolder } from "@stk_utils/components/modal_container/StkModalController";
  import DuelCard from "@ygo_duel_view/components/DuelCard.svelte";
  import type { ResolvedDummyActionInfo } from "@ygo_duel_view/class/DuelViewController";
  import type { Duelist } from "@ygo_duel/class/Duelist";
  export let eventHolder: EventHolder;
  export let args: CardActionSelectorArgs;
  export let resolve: (selected?: ResolvedDummyActionInfo) => void;

  let isShown = true;
</script>

{#if isShown}
  <StkModalWindow {eventHolder} {args}>
    <div class="action_list" slot="body" style="display: flex; justify-content: space-around;">
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
  </StkModalWindow>
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

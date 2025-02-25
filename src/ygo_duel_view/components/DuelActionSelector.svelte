<script lang="ts" module>
  import { writable } from "svelte/store";
  import type { CardActionWIP } from "@ygo_duel/class/DuelEntity";

  export type CardActionSelectorArg = {
    title: string;
    actions: CardActionWIP<unknown>[];
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
  import DuelFieldCell from "@ygo_duel_view/components/DuelFieldCell.svelte";
  interface IProp {
    resolve: (action?: CardActionWIP<unknown>, cell?: DuelFieldCell) => void;
    title: string;
    actions: CardActionWIP<unknown>[];
    cancelable: boolean;
  }
  let { resolve, title, actions, cancelable }: IProp = $props();

  let isShown = true;

  let isDragging = writable(false);

  const click = (action: CardActionWIP<unknown>) => {
    resolve(action);
  };
  const dragStart = (ev: DragEvent, action: CardActionWIP<unknown>) => {
    console.log("drag start", ev, action);
    action.entity.field.duel.view.setDraggingAction(action);
    isDragging.set(true);
  };

  const dragEnd = (ev: DragEvent, action: CardActionWIP<unknown>) => {
    console.log("drag end", ev, action);
    action.entity.field.duel.view.removeDraggingAction();
    if (ev.dataTransfer) {
      isDragging.set(false);
    }
  };
  const close = () => {
    if (cancelable) {
      resolve(undefined);
    }
  };
  const isDraggable = (action: CardActionWIP<unknown>) => {
    const tmp = action.validate();
    return tmp ? tmp.length > 0 : false;
  };
</script>

{#if isShown}
  <div class={`base ${$isDragging ? "minimum_mode" : ""}`}>
    <button class={`overlay ${$isDragging ? "minimum_mode" : ""}`} onclick={close}>★</button>
    <div class={`window ${$isDragging ? "minimum_mode" : ""}`}>
      <div>{title}</div>
      <div class="flex">
        {#each actions as action}
          <button
            class="action_card button_style_reset"
            draggable={isDraggable(action)}
            onclick={() => click(action)}
            ondragstart={(ev) => dragStart(ev, action)}
            ondragend={(ev) => dragEnd(ev, action)}
          >
            <DuelCard entity={action.entity} isVisibleForcibly={true} />
            <div>【{action.title}】</div>
          </button>
        {/each}
      </div>
      {#if cancelable}
        <div>
          <button onclick={() => resolve()}>Cancel</button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .flex {
    display: flex;
  }
  .button_style_reset {
    display: block;
    border-radius: 0%;
    padding: 0px;
    outline: none;
    font: inherit;
    color: inherit;
    background: none;
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
    pointer-events: none;
  }
  .overlay {
    pointer-events: initial;
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
  .overlay.minimum_mode {
    display: none;
  }
  .window {
    display: block;
    background-color: white;
    opacity: 0.9;
    position: fixed;
    bottom: 0px;
    pointer-events: initial;
  }
  .window.minimum_mode {
    opacity: 0.5;
  }
</style>

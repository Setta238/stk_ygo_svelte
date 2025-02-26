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
  import DuelCard, { type TCardState } from "@ygo_duel_view/components/DuelCard.svelte";
  import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
  import DuelModalContainer from "./DuelModalContainer.svelte";
  import type { DuelViewController } from "@ygo_duel_view/class/DuelViewController";
  interface IProp {
    view: DuelViewController;
    resolve: (action?: CardActionWIP<unknown>, cell?: DuelFieldCell) => void;
    title: string;
    actions: CardActionWIP<unknown>[];
    cancelable: boolean;
  }
  let { view, resolve, title, actions, cancelable }: IProp = $props();

  let isShown = true;

  const close = () => {
    if (cancelable) {
      resolve(undefined);
    }
  };

  let isDragging = writable(false);

  const onDragStart = () => isDragging.set(true);
  const onDragEnd = () => isDragging.set(false);
  view.onDragStart.append(onDragStart);
  view.onDragEnd.append(onDragEnd);
  const validateActions = (action: CardActionWIP<unknown>): TCardState => {
    const tmp = action.validate();
    return tmp && tmp.length > 0 ? "Draggable" : "Clickable";
  };
</script>

{#if isShown}
  <div class={`base ${$isDragging ? "minimum_mode" : ""}`}>
    <button class={`overlay ${$isDragging ? "minimum_mode" : ""}`} onclick={close}>★</button>
    <div class={`window ${$isDragging ? "minimum_mode" : ""}`}>
      <div>{title}</div>
      <div class="flex">
        {#each actions as action}
          <div>
            <DuelCard entity={action.entity} isVisibleForcibly={true} state={validateActions(action)} actions={[action]} cardActionResolve={resolve} />
            <div>«{action.title}»</div>
          </div>
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

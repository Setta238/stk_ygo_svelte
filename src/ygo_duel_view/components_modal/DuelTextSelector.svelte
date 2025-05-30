<script lang="ts" module>
  import type { ModalArgsBase } from "@ygo_duel_view/class/DuelModalBase";
  import type { DuelViewController } from "@ygo_duel_view/class/DuelViewController";

  export type DuelTextSelectorArgs = ModalArgsBase & {
    choises: { seq: number; text: string }[];
  };
</script>

<script lang="ts">
  import DuelModalWindow from "@ygo_duel_view/components_modal/DuelModalWindow.svelte";
  export let view: DuelViewController;
  export let args: DuelTextSelectorArgs;
  export let resolve: (selected?: number) => void;
  let isShown = true;
</script>

{#if isShown}
  <DuelModalWindow {view} {args}>
    <ui slot="body" class="text_list">
      {#each args.choises as { seq, text }}
        <li class="text_item {seq}"><button onclick={() => resolve(seq)}> {text} </button></li>
      {/each}
    </ui>
    <div slot="footer">
      {#if args.cancelable}
        <button class="cancel_button" onclick={() => resolve(undefined)}>Cancel</button>
      {/if}
    </div>
  </DuelModalWindow>
{/if}

<style>
  .text_list {
    padding: 0.2rem;
    display: flex;
    flex-direction: column;
  }
  .text_item {
    padding: 0.2rem;
    display: flex;
    flex-direction: column;
  }
  .text_list button {
    background-color: #ffffff;
    display: inline-block;
    padding: 0em 1em;
    text-decoration: none;
    color: #67c5ff;
    border: solid 0.2rem #67c5ff;
    border-radius: 3px;
    transition: 0.4s;
    margin: 0.5rem 0.3rem;
  }

  .text_list button:hover {
    background: #67c5ff;
    color: white;
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
</style>

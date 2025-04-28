<script lang="ts" module>
  export type DuelTextSelectorArg = {
    title: string;
    choises: { seq: number; text: string }[];
    cancelable: boolean;
  };
</script>

<script lang="ts">
  export let arg: DuelTextSelectorArg;
  export let resolve: (selected?: number) => void;
  let isShown = true;
</script>

{#if isShown}
  <div class="modal_window">
    <div>{arg.title}</div>
    <ui class="text_list">
      {#each arg.choises as { seq, text }}
        <li class="text_item {seq}"><button onclick={() => resolve(seq)}> {text} </button></li>
      {/each}
    </ui>
    {#if arg.cancelable}
      <button onclick={() => resolve(undefined)}>Cancel</button>
    {/if}
  </div>
{/if}

<style>
  .modal_window {
    display: block;
    background-color: white;
    opacity: 0.9;
    max-width: 50%;
    width: fit-content;
  }
  .modal_window * {
    pointer-events: initial;
  }
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
</style>

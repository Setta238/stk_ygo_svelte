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
      <button class="cancel_button" onclick={() => resolve(undefined)}>Cancel</button>
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
    padding: 1rem;
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

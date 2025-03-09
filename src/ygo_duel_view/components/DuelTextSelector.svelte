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

  const close = () => {
    if (!arg.cancelable) {
      return;
    }
    resolve(undefined);
    isShown = false;
  };
</script>

{#if isShown}
  <div class="base">
    <button class="overlay" onclick={close}>★</button>
    <div class="window">
      <div>{arg.title}</div>
      <div class="text_list">
        {#each arg.choises as { seq, text }}<div>
            {seq}{text}
          </div>
        {/each}
      </div>
      {#if arg.cancelable}
        <button onclick={() => resolve(undefined)}>Cancel</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .window {
    display: block;
    background-color: white;
    opacity: 0.9;
    max-width: 50%;
  }
  .text_list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
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
  .overlay {
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
</style>

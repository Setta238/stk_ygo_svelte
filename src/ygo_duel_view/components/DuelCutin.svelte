<script lang="ts">
  import { tick } from "svelte";
  import type DuelLog from "@ygo_duel/class/DuelLog";
  import type { DuelLogRecord } from "@ygo_duel/class/DuelLog";
  import type { Duel } from "@ygo_duel/class/Duel";
  import type { ChainBlockInfo } from "@ygo_duel/class/DuelEntityAction";
  import { delay } from "@stk_utils/funcs/StkPromiseUtil";
  import { flip } from "svelte/animate";
  import { fly, slide } from "svelte/transition";
  import type { ChainBlockLogRecord } from "@ygo_duel/class/DuelChainBlockLog";
  export let duel: Duel;
  let records: ChainBlockLogRecord[] = [];
  let timerPromise = Promise.resolve();

  const onInsert = (record: ChainBlockLogRecord) => {
    timerPromise = timerPromise
      .then(() => {
        records = [...records, record];
      })
      .then(() => delay(200));
  };

  duel.chainBlockLog.onInsert.append(onInsert);
</script>

<div class="cut_in">
  {#each records.filter((record) => record.chainBlockInfo.state === "ready") as record (record.seq)}
    <div class="cut_in_row" animate:flip={{ duration: 200 }} transition:fly>
      <div>{record.chainBlockInfo.activator.profile.name}</div>
      <div>{record.chainBlockInfo.action.toString()}</div>
    </div>
  {/each}
</div>

<style>
  .cut_in {
    position: relative;
    display: flex;
    flex-direction: column;
    pointer-events: none;
    z-index: 2;
  }
  .cut_in_row {
    background-color: aliceblue;
    border-style: solid;
    flex-direction: column;
    pointer-events: none;
    font-size: 1.6rem;
    opacity: 0.95;
  }
</style>

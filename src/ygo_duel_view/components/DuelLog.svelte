<script lang="ts">
  import { tick } from "svelte";
  import type DuelLog from "@ygo_duel/class/DuelLog";
  let duelLogRef: HTMLDivElement | undefined = undefined;
  export let log: DuelLog;

  const onlogUpdate = () => {
    log = log;
    tick().then(() => duelLogRef && duelLogRef.scroll(0, duelLogRef.clientHeight * 10));
  };
  log?.onUpdate?.append(onlogUpdate);
</script>

<div class="duel_log" bind:this={duelLogRef}>
  <table>
    <tbody>
      {#each log.records as record}
        <tr><td style=" white-space: nowrap;text-align: center;">{record.duelist?.profile.name || "SYSTEM"}</td><td>{record.text}</td></tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .duel_log {
    overflow-y: auto;
    max-height: 100%;
  }
</style>

<script lang="ts">
  import { tick } from "svelte";
  import type DuelLog from "@ygo_duel/class/DuelLog";
  let duelLogRef: HTMLDivElement | undefined = undefined;
  export let log: DuelLog;

  const onlogUpdate = () => {
    log = log;
    tick().then(() => duelLogRef && duelLogRef.scroll(0, duelLogRef.clientHeight * 990));
  };
  log?.onUpdate?.append(onlogUpdate);
</script>

<div class="duel_log" bind:this={duelLogRef}>
  <table>
    <tbody>
      {#each log.records as record}
        <tr>
          <td class="duelist {record.duelist?.seat}" style=" white-space: nowrap;text-align: center;">{record.duelist?.profile.name || "SYSTEM"}</td>
          <td>{record.text}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .duel_log {
    overflow-y: auto;
    max-height: 100%;
    background-color: beige;
  }
  .duel_log td {
    padding: 0rem 0.5rem;
  }
  .duelist {
    border-left-style: solid;
    border-left-width: 0.3rem;
    padding: 0.2rem 0.5rem;
    width: fit-content;
  }
  .duelist {
    border-left-color: gray;
    background-color: whitesmoke;
  }
  .duelist.Below {
    border-left-color: deepskyblue;
    background-color: azure;
  }
  .duelist.Above {
    border-left-color: tomato;
    background-color: blanchedalmond;
  }
</style>

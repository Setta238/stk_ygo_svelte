<script lang="ts">
  import { tick } from "svelte";
  import type DuelLog from "@ygo_duel/class/DuelLog";
  import type { DuelLogRecord } from "@ygo_duel/class/DuelLog";
  let duelLogBodyRef: HTMLDivElement | undefined = undefined;
  export let log: DuelLog;
  let lastRecord: DuelLogRecord | undefined;

  let logTree: DuelLogRecord[][][][] = [];

  const onlogUpdate = () => {
    const startIndex = (lastRecord?.seq ?? -1) + 1;
    console.log(log, startIndex, logTree.length);
    log.records.slice(startIndex).forEach((record) => {
      if (!lastRecord) {
        logTree = [[[[record]]]];
        lastRecord = record;
        return;
      }
      if (!logTree[record.clock.turn]) {
        logTree[record.clock.turn] = [[[record]]];
        lastRecord = record;
        return;
      }
      if (!logTree[record.clock.turn][record.clock.phaseSeq]) {
        logTree[record.clock.turn][record.clock.phaseSeq] = [[record]];
        lastRecord = record;
        return;
      }
      if (
        lastRecord.clock.chainSeq === record.clock.chainSeq &&
        lastRecord.clock.chainBlockSeq === record.clock.chainBlockSeq &&
        lastRecord.duelist === record.duelist
      ) {
        logTree[record.clock.turn][record.clock.phaseSeq].slice(-1)[0].push(record);
        lastRecord = record;
        return;
      }
      logTree[record.clock.turn][record.clock.phaseSeq].push([record]);
      lastRecord = record;
      return;
    });
    logTree = logTree;
    tick().then(() => duelLogBodyRef && duelLogBodyRef.scroll(0, duelLogBodyRef.clientHeight * 990));
  };
  log.onUpdate.append(onlogUpdate);
  log.duel.view.onDuelUpdate.append(onlogUpdate);
</script>

{#if log.duel.view.infoBoardState === "Log"}
  <div class="duel_log">
    <div class="duel_log_header"></div>
    <div class="duel_log_body" bind:this={duelLogBodyRef}>
      {#each logTree as turnArray}
        <div class="duel_log_block_turn duel_log_block_turn_{turnArray[0][0][0].clock.turn}">
          {#if turnArray[0][0][0].clock.turn > 0}
            <div class="title">ターン：{turnArray[0][0][0].clock.turn}</div>
          {/if}
          {#each turnArray as phaseArray}
            <div class="duel_log_block_phase duel_log_block_phase_{phaseArray[0][0].clock.period.key}">
              {#if phaseArray[0][0].clock.turn > 0}
                <div class="title">{phaseArray[0][0].clock.period.name}</div>
              {/if}
              {#each phaseArray as duelistArray}
                <div class="duel_log_block_duelist duel_log_block_duelist_{duelistArray[0].duelist?.seat ?? 'system'}">
                  <div class="duelist {duelistArray[0].duelist?.seat}" style=" white-space: nowrap;text-align: center;">
                    {duelistArray[0].duelist?.profile.name || "SYSTEM"}
                  </div>
                  {#each duelistArray as record}
                    <div class="duel_log_record">{record.text}</div>
                  {/each}
                </div>
              {/each}
            </div>
          {/each}
        </div>
      {/each}
    </div>
    <div class="duel_log_footer"></div>
  </div>
{/if}

<style>
  .duel_log {
    max-height: 100%;
    background-color: beige;
    display: flex;
    flex-direction: column;
  }
  .duel_log_header,
  .duel_log_footer {
    flex-grow: 0;
  }
  .duel_log_body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 0.2rem 0.2rem;
  }

  .duel_log_block_turn {
    margin: 0.2rem;
    padding: 0.2rem 0.2rem;
    background-color: gainsboro;
    border: solid black thin;
  }
  .duel_log_block_turn > .title {
    font-size: 0.9rem;
    background-color: thistle;
    width: fit-content;
    padding: 0.1rem 0.5rem;
    border-radius: 0.4rem;
    margin: 0.3rem;
  }
  .duel_log_block_phase {
    margin: 0.2rem;
    padding: 0.2rem 0.2rem;
    background-color: wheat;
    border: solid black thin;
  }
  .duel_log_block_phase > .title {
    font-size: 0.7rem;
    background-color: silver;
    width: fit-content;
    padding: 0.1rem 0.5rem;
    border-radius: 0.3rem;
    margin: 0.2rem;
  }
  .duel_log_block_duelist {
    margin: 0.2rem;
    padding: 0.2rem 0.2rem;
    background-color: whitesmoke;
    border: solid black thin;
  }

  .duel_log_record {
    display: flex;
    flex-direction: column;
    padding: 0.1rem;
  }
  .duel_log_record {
    margin: 0.2rem 0.5rem;
  }
  .duel_log_block_duelist > .duelist {
    border-left-style: solid;
    border-left-width: 0.3rem;
    padding: 0.2rem 0.5rem;
    width: fit-content;
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

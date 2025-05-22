<script lang="ts">
  import type { Duel } from "@ygo_duel/class/Duel";
  import { delay } from "@stk_utils/funcs/StkPromiseUtil";
  import { flip } from "svelte/animate";
  import { fly } from "svelte/transition";
  import type { ChainBlockLogRecord } from "@ygo_duel/class/DuelChainBlockLog";
  import { DuelClock } from "@ygo_duel/class/DuelClock";
  export let duel: Duel;
  type Record = ChainBlockLogRecord & { isKnown?: boolean };
  let records: (ChainBlockLogRecord & { isKnown?: boolean })[] = [];
  let removeTimerPromise = Promise.resolve();
  let insertTimerPromise = Promise.resolve();

  const minLifespan = 1000;
  const flipDuration = 500;
  const flyDuration = 400;

  const onInsert = (newRecord: ChainBlockLogRecord) => {
    const _newRecord: Record = { ...newRecord };
    _newRecord.isKnown = newRecord.chainBlockInfo.action.entity.controller.duelistType === "Player" || newRecord.chainBlockInfo.action.entity.face === "FaceUp";
    _newRecord.chainBlockInfo.onStateChange.append((newState) => {
      if (newState === "done" || newState === "failed" || newState === "nagated") {
        removeTimerPromise = removeTimerPromise
          .then(async () => {
            const ms = new Date().getTime() - _newRecord.chainBlockInfo.wasSpawnedAt.getTime();
            if (ms < minLifespan) {
              await delay(minLifespan - ms);
            }
            records = records.filter((record) => record.seq !== _newRecord.seq);
            await delay(flipDuration + flyDuration);
          })
          .then();
        return "RemoveMe";
      }
      records = records;
    });
    insertTimerPromise = insertTimerPromise.then(async () => {
      records = [_newRecord, ...records].sort((left, right) => {
        if (DuelClock.isSameChain(left.clock, right.clock) && left.chainBlockInfo.action.isWithChainBlock && right.chainBlockInfo.action.isWithChainBlock) {
          // 同じチェーン内であれば、処理順は逆転する。
          return right.clock.totalProcSeq - left.clock.totalProcSeq;
        }
        return left.clock.totalProcSeq - right.clock.totalProcSeq;
      });
      await delay(300);
    });
    removeTimerPromise = removeTimerPromise.then(() => delay(1000));
  };

  duel.chainBlockLog.onInsert.append(onInsert);
</script>

<div class="cut_in_container">
  {#each records as record (record.seq)}
    {@const { activator, action, appendix } = record.chainBlockInfo}
    <div
      class="cut_in_row {!record.chainBlockInfo.chainNumber || record.chainBlockInfo.chainNumber === 1 ? `cut_in_row_first` : ''}"
      animate:flip={{ duration: flipDuration }}
    >
      <div
        class="cut_in_item cut_in_item_{activator.seat.toLowerCase()} cut_in_item_{record.chainBlockInfo.state}"
        transition:fly={new Date().getTime() - record.chainBlockInfo.wasSpawnedAt.getTime() < minLifespan
          ? { x: -100, duration: flyDuration }
          : { y: -100, duration: flyDuration }}
      >
        {#if record.chainBlockInfo.chainNumber}
          <div class="chain_number">チェーン：{record.chainBlockInfo.chainNumber}</div>
        {/if}
        <div class="duelist_name duelist_{activator.seat.toLowerCase()}_name">{activator.profile.name}</div>
        <div
          class="duel_card duel_card_{activator.seat.toLowerCase()} {record.isKnown
            ? (action.entity.status.monsterCategories ?? []).join(' ')
            : 'Token'} {record.isKnown ? action.entity.origin.kind : ''} {action.entity.entityType} "
        >
          {#if action.entity.entityType === "Card" || action.entity.entityType === "Token"}
            <div class="duel_card_row">{record.isKnown ? action.entity.nm : "？？？"}</div>
          {/if}
          <div class="duel_card_row">
            <div>
              {action.toString()}
            </div>
            {#if appendix}
              <div class="appendix_wrapper">
                {#each appendix as text}
                  <div class="appendix">{text}</div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .cut_in_container {
    position: relative;
    display: flex;
    flex-direction: column;
    pointer-events: none;
    height: 100%;
    z-index: 2;
    padding: 5rem;
    font-weight: bold;
  }
  .cut_in_row {
    width: 30rem;
  }
  .cut_in_row_first {
    margin-bottom: 1rem;
  }
  .cut_in_item {
    padding: 0.2rem;
    background-color: aliceblue;
    border-style: solid;
    flex-direction: column;
    pointer-events: none;
    font-size: 1.6rem;
    opacity: 0.95;
    width: 25rem;
    transition: 500ms;
  }
  .cut_in_item_nagated {
    filter: grayscale();
  }
  .cut_in_item > * {
    margin: 0.3rem;
    margin-left: 1rem;
  }
  .cut_in_item > *:first-child {
    margin-left: 0.3rem;
  }
  .cut_in_item_left {
    margin-right: auto;
    margin-left: 0px;
  }
  .cut_in_item_above {
    margin-right: 0px;
    margin-left: auto;
  }
  .chain_number {
    font-size: 1.2rem;
    width: fit-content;
  }

  .duelist_name {
    border-left-style: solid;
    border-left-width: 0.5rem;
    padding: 0.25rem 0.5rem 0.25rem 0rem;
    font-size: 1rem;
    width: fit-content;
    word-wrap: break-word;
    padding-left: 0.3rem;
  }
  .duel_card {
    padding: 0.4rem;
  }
  .duel_card_row:first-child {
    border-style: solid;
    border-width: 1px;
    border-color: black;
    margin-left: 0px;
    padding-left: 0.3rem;
  }
  .duel_card_row {
    display: flex;
    flex-direction: row;
    padding: 0.23rem;
    text-align: left;
    font-size: 1rem;
    text-wrap-mode: nowrap;
    margin-left: 0.4rem;
  }
  .appendix_wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: 0.4rem;
    padding-left: 0.5rem;
  }
  .appendix_wrapper .appendix {
    background-color: azure;
    border-radius: 1rem;
    padding: 0px 1rem;
    font-size: 0.8rem;
    margin: 0.2rem;
    vertical-align: middle;
  }
</style>

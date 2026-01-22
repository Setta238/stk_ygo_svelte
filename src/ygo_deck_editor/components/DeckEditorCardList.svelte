<script lang="ts">
  import { type CardInfoJson } from "@ygo/class/YgoTypes";
  import type { CardControlEventHandlers } from "@ygo_deck_editor/components/DeckEditor.svelte";
  import DeckEditorCard from "@ygo_deck_editor/components/DeckEditorCard.svelte";

  export let cardList: CardInfoJson[];
  export let mode: "List" | "Deck";
  export let state: "Open" | "Close";
  export let onAttention: (cardInfo: CardInfoJson) => void;
  export let cardControlEventHandlers: CardControlEventHandlers;

  const qtyDiff = 20;
  let indexLowerBound = 0;
  let indexUpperBound = qtyDiff;
  let ulHeight = 0;
  let _liHeight = 0;
  let liHeight = 0;
  $: {
    if (uList) {
      uList.scrollTop = 0;
      if (mode === "List") {
        const qty = cardList.length > qtyDiff ? qtyDiff : cardList.length;
        if (!liHeight) {
          _liHeight = uList.scrollHeight / qty;
          liHeight = Math.ceil(_liHeight);
        }
        console.log(state, cardList.length);

        if (cardList.length > qtyDiff) {
          // 最後に表示される分の高さについては、小数点以下を気にする必要がある
          // 最後のマイナス１によってほぼぴったりになるが、原因不明
          ulHeight = liHeight * (cardList.length - qtyDiff * 2) + Math.ceil(_liHeight * (qtyDiff * 2 - 1));
        } else {
          ulHeight = liHeight * cardList.length;
        }
      } else {
        indexUpperBound = cardList.length;
      }
    }
  }

  let uList: HTMLUListElement;
</script>

<div
  class="deck_editor_card_list_wrapper"
  on:scroll={(ev) => {
    if (!liHeight) {
      return;
    }
    const currentIndex = Math.ceil(ev.currentTarget.scrollTop / liHeight);
    indexLowerBound = currentIndex < qtyDiff ? 0 : currentIndex - qtyDiff;
    indexUpperBound = currentIndex + qtyDiff;
  }}
>
  <ul
    class="deck_editor_card_list {state.toLowerCase()}  indexLowerBound_{indexLowerBound} indexUpperBound={indexUpperBound}"
    style="height: {ulHeight ? ulHeight + 'px' : 'fit-content'};padding-top: {indexLowerBound * liHeight}px"
    bind:this={uList}
  >
    {#each cardList as cardInfo, index}
      {#if index >= indexLowerBound && index <= indexUpperBound}
        <li class="deck_editor_item">
          <DeckEditorCard {mode} {cardInfo} {onAttention} {cardControlEventHandlers} />
          {#if mode === "Deck"}
            <button
              class="button_style_reset plus_minus_button"
              disabled={!cardInfo.isImplemented}
              title={cardInfo.isImplemented ? "※shiftキー同時押しで一括投入\n※ctrlキー同時押しで枚数制限無視" : ""}
              on:click={(ev) => cardControlEventHandlers.onCardAppend(ev, cardInfo)}
            >
              +
            </button>
            <button
              class="button_style_reset plus_minus_button"
              disabled={cardList.every((_info) => _info.name !== cardInfo.name)}
              title={cardInfo.isImplemented ? "※shiftキー同時押しで一括外し" : ""}
              on:click={(ev) => cardControlEventHandlers.onCardRemove(ev, cardInfo)}
            >
              -
            </button>
          {/if}
        </li>
      {/if}
    {/each}
  </ul>
</div>

<style>
  .deck_editor_card_list_wrapper {
    max-height: 100%;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    position: absolute;
    top: 0;
    left: 0;
    transition: 0.5s linear; /* アニメーションの設定 */
  }
  .deck_editor_card_list {
    max-height: unset;
    padding-right: 0.3rem;
  }
  .deck_editor_item {
    display: flex;
  }

  .plus_minus_button {
    background-color: #ffffff;
    display: inline-block;
    padding: 0em 1em;
    text-decoration: none;
    color: #67c5ff;
    border: solid 0.2rem #67c5ff;
    border-radius: 3px;
    transition: 0.4s;
    margin: 0.1rem 0.3rem;
  }

  .plus_minus_button:hover {
    background: #67c5ff;
    color: white;
  }
  .plus_minus_button:disabled {
    filter: grayscale(90);
    transition: 0s;
    color: #67c5ff;
    background-color: red;
    cursor: not-allowed;
  }
</style>

<script lang="ts">
  import { monsterCategoryEmojiDic, monsterTypeEmojiDic, spellCategoryDic, trapCategoryDic, type CardInfo } from "@ygo/class/YgoTypes";
  import type { CardControlEventHandlers } from "./DeckEditor.svelte";
  export let mode: "Deck" | "List" | "Dragging";
  export let cardInfo: CardInfo;
  export let onAttention: (cardInfo: CardInfo) => void;
  export let cardControlEventHandlers: CardControlEventHandlers;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  role="listitem"
  class={`deck_editor_card duel_card ${cardInfo.kind} ${cardInfo?.monsterCategories?.join(" ")} ${cardInfo.isImplemented ? "is_implemented" : "is_not_implemented"}`}
  on:click={() => onAttention(cardInfo)}
  on:touchstart={(ev) => cardControlEventHandlers.onCardDragStart(ev, mode, cardInfo)}
  on:touchmove={(ev) => cardControlEventHandlers.onCardDragging(ev, mode)}
  on:touchend={cardControlEventHandlers.onCardDragEnd}
  on:touchcancel={cardControlEventHandlers.onCardDragCancel}
  on:mousedown={(ev) => cardControlEventHandlers.onCardDragStart(ev, mode, cardInfo)}
  on:mousemove={(ev) => cardControlEventHandlers.onCardDragging(ev, mode)}
  on:mouseup={cardControlEventHandlers.onCardDragEnd}
>
  <div>
    <div class="duel_card_row card_name">
      {cardInfo.name}
    </div>
    <div style="display:flex; flex-wrap: wrap;">
      <div style="">
        {#if cardInfo.kind === "Monster"}
          {#if cardInfo.level}
            ★{cardInfo.level}
          {:else if cardInfo.rank}
            ☆{cardInfo.rank}
          {:else if cardInfo.link}
            Ｌ{cardInfo.link}
          {/if}
          {#each cardInfo.attributes ?? [] as attr}
            <div class="monster_attr {attr}"></div>
          {/each}
          {#each cardInfo.types ?? [] as type}
            {monsterTypeEmojiDic[type]}
          {/each}
          {#each cardInfo.monsterCategories ?? [] as cat}
            {monsterCategoryEmojiDic[cat]}
          {/each}
        {/if}
        {#if cardInfo.spellCategory}
          {spellCategoryDic[cardInfo.spellCategory]}魔法
        {/if}
        {#if cardInfo.trapCategory}
          {trapCategoryDic[cardInfo.trapCategory]}罠
        {/if}
      </div>
      <div class="atk_def">
        {#if cardInfo.kind === "Monster"}
          <span class="atk">{cardInfo.attack ?? "?"}</span>
          <span class="slash">/</span>
          <span class="def">{cardInfo.defense ?? "?"}</span>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  div {
    text-align: left;
    max-height: initial;
    text-wrap-mode: nowrap;
  }
  .duel_card {
    margin-bottom: 0.2rem;
    border: 0.1rem solid black;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
  }
  .duel_card_row.card_name {
    padding: 0;
  }
  .deck_editor_card {
    display: flex;
    flex-grow: 1;
    padding: 0rem 0.4rem 0rem 0.4rem;
  }
  .deck_editor_card > div {
    flex-grow: 1;
  }
  .deck_editor_card .monster_attr {
    display: inline-block;
    position: relative;
    font-size: 0.7rem;
  }
  .atk_def {
    text-wrap-mode: nowrap;
    flex-grow: 1;
    text-align: right;
  }
  .atk_def .atk,
  .atk_def .def {
    display: inline-block;
    width: 2rem;
    text-align: right;
  }
  .atk_def .slash {
    margin: 0rem 0.5rem;
    text-align: center;
  }
</style>

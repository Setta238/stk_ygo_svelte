<script lang="ts">
  import { monsterCategoryEmojiDic, monsterTypeEmojiDic, spellCategoryDic, trapCategoryDic, type CardInfoJson } from "@ygo/class/YgoTypes";

  export let cardInfo: CardInfoJson;
  export let onAttention: (cardInfo: CardInfoJson) => void;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  role="listitem"
  class={`deck_editor_card duel_card ${cardInfo.kind} ${cardInfo?.monsterCategories?.join(" ")} ${cardInfo.isImplemented ? "is_implemented" : "is_not_implemented"}`}
  on:click={() => onAttention(cardInfo)}
>
  <div>
    <div>
      {cardInfo.name}
    </div>
    <div style="display:flex; flex-wrap: wrap;">
      <div style="text-wrap-mode: nowrap;">
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
          <span> {cardInfo.attack ?? "?"}</span> /
          <span>{cardInfo.defense ?? "?"}</span>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  div {
    text-align: left;
    max-height: initial;
  }
  .duel_card {
    margin-bottom: 0.1rem;
    border: 0.1rem solid black;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
  }
  .deck_editor_card {
    display: flex;
    flex-grow: 1;
    padding: 0rem 0.4rem;
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
  .atk_def span {
    display: inline-block;
    width: 2rem;
    text-align: right;
  }
</style>

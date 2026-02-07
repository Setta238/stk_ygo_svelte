<script lang="ts">
  import {
    getDeckCardKind,
    getKonamiUrl,
    linkArrowDic,
    monsterAttributeDic,
    monsterCategoryDic,
    monsterCategoryEmojiDic,
    monsterTypeDic,
    monsterTypeEmojiDic,
    spellCategoryDic,
    trapCategoryDic,
    type CardInfo,
    type CardTree,
  } from "@ygo/class/YgoTypes";
  import type { CardControlEventHandlers } from "./DeckEditor.svelte";
  export let cardInfo: CardInfo | undefined = undefined;
  export let onAttention: (cardInfo: CardInfo) => void;
  export let cardControlEventHandlers: CardControlEventHandlers;
  export let deckCardTree: CardTree;
  export let refOnly: boolean;
</script>

{#if cardInfo}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="duel_card duel_card_info {cardInfo.kind} {cardInfo.monsterCategories?.join(' ')}" on:click={() => onAttention(cardInfo)}>
    <div class="duel_card_info_header">
      <div class="duel_card_info_row">
        <div>{cardInfo.name}</div>
      </div>
      {#if cardInfo.kind === "Monster"}
        <div class="duel_card_info_row" style="position:sticky; top:0;">
          {#if cardInfo.level && cardInfo.level > 0}
            <div>{"★".repeat(cardInfo.level)}</div>
          {:else if cardInfo.rank && cardInfo.rank > 0}
            <div>{"★".repeat(cardInfo.rank)}</div>
          {:else if cardInfo.linkArrowKeys}
            <div class="link_arrow_emoji">{cardInfo.linkArrowKeys.map((key) => linkArrowDic[key].emoji).join("")}</div>
          {/if}
        </div>
      {/if}
      {#if !refOnly}
        <div class="plus_minus_button_area">
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
            disabled={deckCardTree[getDeckCardKind(cardInfo)].every((_info) => _info.name !== cardInfo.name)}
            title={cardInfo.isImplemented ? "※shiftキー同時押しで一括外し" : ""}
            on:click={(ev) => cardControlEventHandlers.onCardRemove(ev, cardInfo)}
          >
            -
          </button>
        </div>
      {/if}
    </div>
    <div class="duel_card_info_body">
      {#if cardInfo.monsterCategories?.includes("Pendulum")}
        <div class="duel_card_info_row">
          <div><pre class="description">{cardInfo.pendulumDescription}</pre></div>
        </div>
        <div class="duel_card_info_row" style=" justify-content: space-between;">
          <div>◀ {cardInfo.pendulumScaleL}</div>
          <div>{cardInfo.pendulumScaleR} ▶</div>
        </div>
      {/if}
      {#if cardInfo.kind === "Monster"}
        <div class="duel_card_info_row">
          {#if cardInfo.attributes}
            <div class="monster_attr {cardInfo.attributes[0]}"></div>
            <div>{monsterAttributeDic[cardInfo.attributes[0]]}属性</div>
          {/if}
          {#if cardInfo.types}
            <div class="monster_cat {cardInfo.types[0]}">{monsterTypeEmojiDic[cardInfo.types[0]]}{monsterTypeDic[cardInfo.types[0]]}族</div>
          {/if}
          <div style="flex-grow: 1;"></div>
          <div class="monster_attack">{cardInfo.attack ?? "?"}</div>
          {#if !cardInfo.monsterCategories?.includes("Link")}
            <span>/</span>
            <div class="monster_defense">{cardInfo.defense ?? "?"}</div>
          {/if}
        </div>
        <div class="duel_card_info_row">
          {#each cardInfo.monsterCategories ?? [] as cat}
            <div class="monster_cat {cat}">{monsterCategoryEmojiDic[cat]}{monsterCategoryDic[cat]}</div>
          {/each}
        </div>
      {:else if cardInfo.kind === "Spell" && cardInfo.spellCategory}
        <div class="duel_card_row">
          <div></div>
          <div>{spellCategoryDic[cardInfo.spellCategory]}魔法</div>
        </div>
      {:else if cardInfo.kind === "Trap" && cardInfo.trapCategory}
        <div class="duel_card_row">
          <div></div>
          <div>{trapCategoryDic[cardInfo.trapCategory]}罠</div>
        </div>
      {/if}

      <div class="duel_card_info_row description">
        <div><pre class="description">{cardInfo.description}</pre></div>
        {#if cardInfo.releaseDate}
          <div>初版発売日：{cardInfo.releaseDate.formatToYYYYMMDD("-")}</div>
        {/if}
      </div>

      {#if cardInfo.isOldVersion}
        <div class="duel_card_info_row">
          <div>※エラッタ前カードです</div>
        </div>
      {/if}
      {#if cardInfo.isForTest}
        <div class="duel_card_info_row">
          <div>※テスト用カードです</div>
        </div>
      {:else}
        <div class="duel_card_info_links">
          <a href={getKonamiUrl(cardInfo)} target="_blank" rel="noopener noreferrer" title="コナミカードデータベース">
            ⇒{cardInfo.cardId ? "公式カードページ" : "公式で検索"}
          </a>
          <a href={`https://yugioh-wiki.net/index.php?${cardInfo.wikiEncodedName}`} target="_blank" rel="noopener noreferrer" title="遊戯王カードWiki">
            ⇒遊戯王カードWiki
          </a>
          <a href={`https://www.google.com/search?q=遊戯王 ${cardInfo.name}`} target="_blank" rel="noopener noreferrer" title="google"> ⇒google検索 </a>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .duel_card_info {
    position: relative;
    padding: 0.1rem;
    margin: 0.1rem 0.3rem;
    border: solid 1px #778ca3;
    text-align: left;
    font-size: 1.1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    flex-grow: 1;
  }
  .button_style_reset {
    display: block;
    border-radius: 0%;
    padding: 0px;
    outline: none;
    font: inherit;
    color: inherit;
    background: none;
  }
  .duel_card_info_header {
    position: sticky;
    background: inherit;
    top: 0;
  }
  .duel_card_info_header > .duel_card_info_row:first-child {
    border: solid 0.01rem darkslategray;
  }
  .duel_card_info_body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: 100%;

    max-height: initial;
  }
  .duel_card_info_links {
    position: sticky;
    bottom: 0;
    background: inherit;
  }
  .duel_card_info_row {
    padding: 0rem 0.15rem;
    display: flex;
    max-width: 100%;
    overflow: auto;
    flex-wrap: wrap;
  }
  .duel_card_info_row * {
    max-width: 100%;
  }
  .duel_card_info_links {
    background-color: white;
  }
  .duel_card_info_row.description {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .duel_card_info_row .description {
    white-space: pre-wrap;
    margin: 0.5rem 0rem;
    max-height: initial;
  }
  .duel_card_info .monster_attr {
    position: relative;
    font-size: 1rem;
  }
  .duel_card_info_row.enum {
    flex-wrap: wrap;
    justify-content: left;
  }
  .duel_card_info_row > div {
    margin: 0 0.3rem;
  }

  .plus_minus_button_area {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
  }

  .plus_minus_button {
    background-color: #ffffff;
    font-size: 1.5rem;
    font-weight: 1000;
    line-height: 0;
    padding: 1em;
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

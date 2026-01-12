<script lang="ts">
  import {
    getKonamiUrl,
    linkArrowDic,
    monsterAttributeDic,
    monsterCategoryDic,
    monsterCategoryEmojiDic,
    monsterTypeDic,
    monsterTypeEmojiDic,
    spellCategoryDic,
    trapCategoryDic,
    type CardInfoJson,
  } from "@ygo/class/YgoTypes";
  export let cardInfo: CardInfoJson | undefined = undefined;
  export let onAttention: (cardInfo: CardInfoJson) => void;
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
          <a href={`https://yugioh-wiki.net/index.php?${cardInfo.wikiEncodedName}`} target="_blank" rel="noopener noreferrer" title="遊戯王カードWiki">
            ⇒遊戯王カードWiki
          </a>
          <a href={getKonamiUrl(cardInfo)} target="_blank" rel="noopener noreferrer" title="コナミカードデータベース">
            ⇒{cardInfo.cardId ? "公式カードページ" : "公式で検索"}
          </a>
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
</style>

<script lang="ts">
  import { cardInfoDic } from "@ygo/class/CardInfo";
  import {
    monsterAttributeDic,
    monsterCategoryDic,
    monsterCategoryEmojiDic,
    monsterTypeDic,
    monsterTypeEmojiDic,
    spellCategoryDic,
    trapCategoryDic,
    type CardInfoJson,
    type EntityStatus,
  } from "@ygo/class/YgoTypes";
  import { DuelEntity, type CardAction } from "@ygo_duel/class/DuelEntity";
  import { writable } from "svelte/store";
  export let cardInfo: CardInfoJson | undefined = undefined;
  const getInfo = () => (cardInfo ? cardInfoDic[cardInfo.name] : undefined);
</script>

{#if cardInfo}
  <div class="duel_card duel_card_info {cardInfo.kind} {cardInfo.monsterCategories?.join(' ')}">
    <div class="duel_card_info_header">
      <div class="duel_card_info_row">
        <div>{cardInfo.name}</div>
      </div>
      <div class="duel_card_info_row" style="position:sticky; top:0;">
        <div>{"★".repeat(cardInfo.level || 0)}</div>
        <div>{"☆".repeat(cardInfo.rank || 0)}</div>
      </div>
    </div>
    <div class="duel_card_info_body">
      {#if cardInfo.monsterCategories?.includes("Pendulum")}
        <div class="duel_card_info_row">
          <div><pre class="description">{cardInfoDic[cardInfo.name].pendulumDescription}</pre></div>
        </div>
        <div class="duel_card_info_row" style=" justify-content: space-between;">
          <div>◀ {cardInfo.pendulumScaleL}</div>
          <div>{cardInfo.pendulumScaleR} ▶</div>
        </div>
      {/if}
      {#if cardInfo.kind === "Monster"}
        <div class="duel_card_info_row">
          {#if cardInfo.attribute}
            <div class="monster_attr {cardInfo.attribute}"></div>
            <div>{monsterAttributeDic[cardInfo.attribute]}属性</div>
          {/if}
          {#if cardInfo.type}
            <div class="monster_cat {cardInfo.type}">{monsterTypeEmojiDic[cardInfo.type]}{monsterTypeDic[cardInfo.type]}族</div>
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
        <div><pre class="description">{getInfo()?.description}</pre></div>
      </div>
      <div class="duel_card_info_links">
        <a href={getInfo()?.wikiHref} target="_blank" rel="noopener noreferrer" title="遊戯王カードWiki">⇒遊戯王カードWiki</a>
      </div>
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

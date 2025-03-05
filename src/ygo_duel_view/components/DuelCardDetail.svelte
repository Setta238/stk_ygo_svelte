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
    type TEntityStatus,
  } from "@ygo/class/YgoTypes";
  import { DuelEntity, type CardAction } from "@ygo_duel/class/DuelEntity";
  import { writable } from "svelte/store";
  export let entity: DuelEntity | undefined = undefined;
  const getInfo = () => (entity ? cardInfoDic[entity.origin.name] : undefined);
</script>

{#if entity}
  <div class="duel_card_info {entity.origin.kind} {entity.origin.monsterCategories?.join(' ')}">
    <div class="duel_card_info_row" style="position:relative">
      <div>{entity.nm}</div>
    </div>
    <div class="duel_card_info_row">
      <div>{"★".repeat(entity.status.level || 0)}</div>
      <div>{"☆".repeat(entity.status.rank || 0)}</div>
    </div>
    {#if entity.status.monsterCategories?.includes("Pendulum")}
      <div class="duel_card_info_row">
        <div><pre class="description">{cardInfoDic[entity.origin.name].pendulumDescription}</pre></div>
      </div>
      <div class="duel_card_info_row" style=" justify-content: space-between;">
        <div>◀ {entity.psL}</div>
        <div>{entity.psR} ▶</div>
      </div>
    {/if}
    {#if entity.status.kind === "Monster"}
      <div class="duel_card_info_row">
        {#each entity.attr as attr}
          <div class="monster_attr {attr}"></div>
          <div>{monsterAttributeDic[attr]}属性</div>
        {/each}
        {#if entity.status.type}
          <div class="monster_cat {entity.status.type}">{monsterTypeEmojiDic[entity.status.type]}{monsterTypeDic[entity.status.type]}族</div>
        {/if}
      </div>
      <div class="duel_card_info_row">
        {#each entity.status.monsterCategories ?? [] as cat}
          <div class="monster_cat {cat}">{monsterCategoryEmojiDic[cat]}{monsterCategoryDic[cat]}</div>
        {/each}
      </div>
    {:else if entity.status.kind === "Spell" && entity.status.spellCategory}
      <div class="duel_card_row">
        <div></div>
        <div>{spellCategoryDic[entity.status.spellCategory]}魔法</div>
      </div>
    {:else if entity.status.kind === "Trap" && entity.status.trapCategory}
      <div class="duel_card_row">
        <div></div>
        <div>{trapCategoryDic[entity.status.trapCategory]}罠</div>
      </div>
    {/if}
    <div class="duel_card_info_row">
      <div><pre class="description">{getInfo()?.description}</pre></div>
    </div>
    <div class="duel_card_info_links"><a href={getInfo()?.wikiHref} title="遊戯王カードWiki">⇒遊戯王カードWiki</a></div>
  </div>
{/if}

<style>
  .duel_card_info {
    position: relative;
    margin: 0.1rem 0.3rem;
    padding: 0.1rem;
    border: solid 1px #778ca3;
    margin: 0.1rem 0.3rem;
    padding: 0.1rem;
    border: solid 1px #778ca3;
    font-size: 0.7rem;
    text-align: left;
    height: 70%;
    font-size: 1.1rem;
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
  .duel_card_info_row {
    padding: 0rem 0.15rem;
    display: flex;
    max-width: 100%;
    overflow: hidden;
  }
  .duel_card_info_row * {
    max-width: 100%;
  }
  .duel_card_info_links {
    display: block;
    background-color: white;
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    right: 0.5rem;
  }
  .duel_card_info_row .description {
    max-width: 98%;
    white-space: pre-wrap;
    margin: 0.5rem 0rem;
  }
  .duel_card_info .monster_attr {
    border-radius: 100%;
    border: solid thin;
    margin: auto 0.1rem;
    width: 0.7rem;
    height: 0.7rem;
  }
  .duel_card_info .monster_attr.Light {
    color: yellow;
    background-color: gold;
  }
  .duel_card_info .monster_attr.Dark {
    color: indigo;
    background-color: black;
  }
  .duel_card_info .monster_attr.Earth {
    color: brown;
    background-color: darkred;
  }
  .duel_card_info .monster_attr.Water {
    color: aqua;
    background-color: aquamarine;
  }
  .duel_card_info .monster_attr.Fire {
    color: crimson;
    background-color: orange;
  }
  .duel_card_info .monster_attr.Wind {
    color: springgreen;
    background-color: whitesmoke;
  }
  .duel_card_info .monster_attr.Divine {
    color: blanchedalmond;
    background-color: yellow;
  }
  .duel_card_info_row.enum {
    flex-wrap: wrap;
    justify-content: left;
  }
  .duel_card_info_row > div {
    margin: 0 0.3rem;
  }
  .duel_card_info_row:first-child {
    border: solid 0.01rem darkslategray;
  }
  .duel_card_info.Normal {
    background-color: cornsilk;
  }
  .duel_card_info.Effect {
    background-color: chocolate;
  }
  .duel_card_info.Spell {
    background-color: forestgreen;
    color: white;
  }
</style>

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
  } from "@ygo/class/YgoTypes";
  import { DuelEntity } from "@ygo_duel/class/DuelEntity";
  export let entity: DuelEntity | undefined = undefined;
  const getInfo = () => (entity ? cardInfoDic[entity.origin.name] : undefined);
</script>

{#if entity}
  <div class="duel_card duel_card_info {entity.origin.kind} {entity.origin.monsterCategories?.join(' ')}">
    <div class="duel_card_info_header">
      <div class="duel_card_info_row">
        <div>{entity.nm}</div>
      </div>
      <div class="duel_card_info_row" style="position:sticky; top:0;">
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
    </div>

    <div class="duel_card_info_body">
      <div class="duel_card_info_row">
        <div><pre class="description">{getInfo()?.description}</pre></div>
      </div>
    </div>
    <div class="duel_card_info_footer">
      <div class="duel_card_info_links">
        <a href={getInfo()?.wikiHref} target="_blank" rel="noopener noreferrer" title="遊戯王カードWiki">⇒遊戯王カードWiki</a>
      </div>
    </div>
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
    max-height: 70%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
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
    display: initial;
  }
  .duel_card_info_footer {
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
  .duel_card_info_row .description {
    max-width: 98%;
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

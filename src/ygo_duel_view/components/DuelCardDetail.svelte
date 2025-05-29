<script lang="ts" module>
  export type TCardDetailMode = "Normal" | "Debug";
</script>

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

  const getKonamiUrl = () => {
    return entity && (entity.origin.cardId ?? 0 > 0)
      ? `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=${entity.origin.cardId}`
      : `https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&rp=10&mode=&sort=1&keyword=${getInfo()?.name}&stype=1&ctype=&othercon=2&starfr=&starto=&pscalefr=&pscaleto=&linkmarkerfr=&linkmarkerto=&link_m=2&atkfr=&atkto=&deffr=&defto=&releaseDStart=1&releaseMStart=1&releaseYStart=1999&releaseDEnd=&releaseMEnd=&releaseYEnd=`;
  };
  export let mode: TCardDetailMode = "Normal";
  const onRightClick = () => {
    mode = mode === "Normal" ? "Debug" : "Normal";
    console.info(entity);
    return true;
  };
</script>

{#if entity}
  <div role="contentinfo" class="duel_card duel_card_info {entity.origin.kind} {entity.origin.monsterCategories?.join(' ')}" oncontextmenu={onRightClick}>
    <div class="duel_card_info_header">
      <div class="duel_card_info_row">
        <div>{entity.nm}</div>
      </div>
      <div class="duel_card_info_row" style="position:sticky; top:0;">
        <div>{"★".repeat(entity.lvl || 0)}</div>
        <div>{"☆".repeat(entity.rank || 0)}</div>
      </div>
      {#if mode === "Normal"}
        {#if entity.status.monsterCategories?.includes("Pendulum")}
          <div class="duel_card_info_row" style=" justify-content: space-between;">
            <div>◀ {entity.psL}</div>
            <div>{entity.psR} ▶</div>
          </div>
        {/if}
        {#if entity.kind === "Monster"}
          <div class="duel_card_info_row">
            {#each entity.attr as attr}
              <div class="monster_attr {attr}"></div>
              <div>{monsterAttributeDic[attr]}属性</div>
            {/each}
            {#each entity.types as type}
              <div class="monster_cat {type}">{monsterTypeEmojiDic[type]}{monsterTypeDic[type]}族</div>
            {/each}
          </div>
          <div class="duel_card_info_row">
            {#each entity.status.monsterCategories ?? [] as cat}
              <div class="monster_cat {cat}">{monsterCategoryEmojiDic[cat]}{monsterCategoryDic[cat]}</div>
            {/each}
          </div>
        {:else if entity.kind === "Spell" && entity.status.spellCategory}
          <div class="duel_card_row">
            <div></div>
            <div>{spellCategoryDic[entity.status.spellCategory]}魔法</div>
          </div>
        {:else if entity.kind === "Trap" && entity.status.trapCategory}
          <div class="duel_card_row">
            <div></div>
            <div>{trapCategoryDic[entity.status.trapCategory]}罠</div>
          </div>
        {/if}
      {/if}
    </div>

    <div class="duel_card_info_body">
      {#if mode === "Normal"}
        {#if entity.status.monsterCategories?.includes("Pendulum")}
          <div class="duel_card_info_row" style="border-style: solid; border-width: 1px;">
            <pre class="description">{cardInfoDic[entity.origin.name].pendulumDescription}</pre>
          </div>
        {/if}
        <div class="duel_card_info_row">
          <pre class="description">{getInfo()?.description}</pre>
        </div>
      {:else}
        <div class="duel_card_info_row">
          <div>
            {#each ["info", "status"] as const as prop}
              <div>"{prop}" :{"{"}</div>
              {#each Object.entries(entity[prop]) as [key, value]}
                <div>
                  "{key}" :
                  {#if Array.isArray(value)}
                    [
                    {#each value as item}
                      {item.toString()},
                    {/each}
                    ],
                  {:else}
                    {value?.toString()},
                  {/if}
                </div>
              {/each}
              <div>{"},"}</div>
            {/each}
            <div>"actions" :{"["}</div>
            {#each entity.actions as action}
              <div>"{action.playType} {action.title}",</div>
            {/each}
            <div>{"],"}</div>
            <div>"substituteEffects" :{"["}</div>
            {#each entity.substituteEffects as action}
              <div>"{action.title}",</div>
            {/each}
            <div>{"],"}</div>
            <div>"continuousEffects" :{"["}</div>
            {#each entity.continuousEffects as continuousEffect}
              <div>"{continuousEffect.isStarted}",</div>
            {/each}
            <div>{"],"}</div>
            <div>"procFilters" :{"["}</div>
            {#each entity.procFilterBundle.operators as pf}
              <div>"{pf.isSpawnedBy.toString()} {pf.title} {pf.isEffective} ",</div>
            {/each}
            <div>{"],"}</div>
            <div>"numericStateOperators" :{"["}</div>
            {#each entity.numericOprsBundle.operators as pf}
              <div>"{pf.isSpawnedBy.toString()} {pf.title} {pf.isEffective} {pf.isContinuous} {pf.targetState} {pf.targetStateGen} ",</div>
            {/each}
            <div>{"],"}</div>
            <div>"stateOperators" :{"["}</div>
            {#each entity.statusOperatorBundle.operators as pf}
              <div>"{pf.isSpawnedBy.toString()} {pf.title} {pf.isEffective} ",</div>
            {/each}
            <div>{"],"}</div>
            <div>"lastMoveLogRecord" :{"{"}</div>
            <div>"movedBy":"{entity.moveLog.latestRecord.movedBy?.toString()}",</div>
            <div>"movedAs":"{entity.moveLog.latestRecord.movedAs.join(" ")}",</div>
            <div>"movedAt":"{entity.moveLog.latestRecord.movedAt.totalProcSeq}",</div>
            <div>{"},"}</div>
          </div>
        </div>
      {/if}
    </div>
    <div class="duel_card_info_footer">
      {#if entity?.origin.isForTest}
        <div>※テスト用カードです</div>
      {:else}
        <div class="duel_card_info_links">
          <a href={`https://yugioh-wiki.net/index.php?${entity.origin.wikiEncodedName}`} target="_blank" rel="noopener noreferrer" title="遊戯王カードWiki">
            ⇒遊戯王カードWiki
          </a>
          <a href={getKonamiUrl()} target="_blank" rel="noopener noreferrer" title="コナミカードデータベース">
            ⇒{entity?.origin.cardId ? "公式カードページ" : "公式で検索"}
          </a>
        </div>
      {/if}
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
    min-width: 90%;
    max-width: 100%;
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
    max-height: initial;
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
    flex-wrap: wrap;
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

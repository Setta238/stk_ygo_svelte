<script lang="ts">
  import { cardDefinitionDic, cardInfoDic } from "@ygo/class/CardInfo";
  import { DeckInfo } from "@ygo/class/DeckInfo";
  import {
    cardKindDic,
    cardKinds,
    deckTypeDic,
    deckTypes,
    exMonsterCategories,
    monsterCategoryEmojiDic,
    monsterTypeEmojiDic,
    spellCategoryDic,
    trapCategoryDic,
    type CardInfoJson,
    type TCardKind,
    type TDeckTypes,
  } from "@ygo/class/YgoTypes";
  import { CardEntitySorter, CardSorter, type TDuelEntityFace } from "@ygo_duel/class/DuelEntity";

  export let allCardInfos: CardInfoJson[];
  export let deckCardInfos: CardInfoJson[];
  export let mode: "List" | "Deck";
  export let onAttention: (cardInfo: CardInfoJson) => void;
  const listGroup: { [key in TDeckTypes]: TCardKind[] } = {
    Deck: ["Monster", "Spell", "Trap"],
    ExtraDeck: ["Monster"],
  };
  const filterCardList = (deckType?: TDeckTypes, kind?: TCardKind) =>
    (mode === "List" ? allCardInfos : deckCardInfos)
      .filter((cardInfo) => cardDefinitionDic.has(cardInfo.name) || cardInfo.monsterCategories?.includes("Normal"))
      .filter((cardInfo) => !kind || cardInfo.kind === kind)
      .filter(
        (cardInfo) =>
          !deckType ||
          (deckType === "Deck" && !cardInfo?.monsterCategories?.union(exMonsterCategories).length) ||
          (deckType === "ExtraDeck" && cardInfo?.monsterCategories?.union(exMonsterCategories).length)
      )
      .toSorted(CardSorter);
  const onPlusButtonClick = (ev: MouseEvent, cardInfo: CardInfoJson) => {
    const currentQty = deckCardInfos.filter((_cardInfo) => _cardInfo.name === cardInfo.name).length;
    if (currentQty > 2) {
      return;
    }
    const qty = ev.shiftKey ? 3 - currentQty : 1;
    if (qty < 1) {
      return;
    }

    deckCardInfos.push(...Array(qty).fill(cardInfo));
    deckCardInfos.sort(CardSorter);
    deckCardInfos = deckCardInfos;
  };
  const onMinusButtonClick = (ev: MouseEvent, cardInfo: CardInfoJson) => {
    let count = 0;
    deckCardInfos = deckCardInfos.filter((_cardInfo) => {
      if (_cardInfo.name !== cardInfo.name) {
        return true;
      }

      count++;
      return !ev.shiftKey && count > 1;
    });
    deckCardInfos.sort(CardSorter);
  };
</script>

<div class="deck_editor_card_list">
  {#each deckTypes as deckType}
    <div class="deck_editor_deck_type">
      <span>{deckTypeDic[deckType]}</span>
      {#each listGroup[deckType] as kind}
        <div class="deck_editor_card_kind">
          <span>{cardKindDic[kind]}</span>
          <ul>
            {#each filterCardList(deckType, kind) as cardInfo}
              <li class="deck_editor_item">
                <div
                  role="listitem"
                  class={`deck_editor_card duel_card ${cardInfo.kind} ${cardInfo?.monsterCategories?.join(" ")} ${cardDefinitionDic.has(cardInfo.name) ? "is_implemented" : "is_not_implemented"}`}
                  on:mouseenter={() => onAttention(cardInfo)}
                >
                  <div>
                    <div>
                      {cardInfo.name}
                    </div>
                    <div style="display:flex">
                      <div>
                        {#if cardInfo.level}
                          ★{cardInfo.level}
                        {/if}
                        {#if cardInfo.rank}
                          ☆{cardInfo.rank}
                        {/if}
                        {#if cardInfo.attribute !== undefined}
                          <div class="monster_attr {cardInfo.attribute}"></div>
                        {/if}
                        {#if cardInfo.type !== undefined}
                          {monsterTypeEmojiDic[cardInfo.type]}
                        {/if}
                        {#each cardInfo.monsterCategories ?? [] as cat}
                          {monsterCategoryEmojiDic[cat]}
                        {/each}
                        {#if cardInfo.spellCategory !== undefined}
                          {spellCategoryDic[cardInfo.spellCategory]}魔法
                        {/if}
                        {#if cardInfo.trapCategory !== undefined}
                          {trapCategoryDic[cardInfo.trapCategory]}罠
                        {/if}
                      </div>
                      <div style="flex-grow: 1; width:0.1rem"></div>
                      <div>
                        {#if cardInfo.attack !== undefined}
                          <span> {cardInfo.attack}</span> /
                          <span style="display: inline-block;width:2rem;text-align: right;">{cardInfo.defense ?? "-"}</span>
                        {/if}
                      </div>
                    </div>
                  </div>
                </div>
                <button class="button_style_reset" on:click={(ev) => onPlusButtonClick(ev, cardInfo)}>+</button>
                <button class="button_style_reset" on:click={(ev) => onMinusButtonClick(ev, cardInfo)}>-</button>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .deck_editor_card_list {
    overflow-y: auto;
  }
  div {
    text-align: left;
    max-height: initial;
  }
  .deck_editor_item {
    display: flex;
  }
  .plus_minus_button_area {
    display: flex;
    flex-direction: column;
    font-size: 1.5rem;
    line-height: 0.6;
    font-weight: 1000;
    vertical-align: top;
  }
  .deck_editor_item button {
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

  .deck_editor_item button:hover {
    background: #67c5ff;
    color: white;
  }
  .deck_editor_deck_type {
    padding: 0.4rem;
    margin-bottom: 0.4rem;
    background-color: antiquewhite;
    border-radius: 0.5rem;
  }
  .deck_editor_deck_type > * {
    margin-left: 0.7rem;
    margin-bottom: 0.4rem;
    padding: 0.2rem;
  }
  .deck_editor_deck_type > *:first-child {
    margin-left: 0rem;
  }
  .deck_editor_card_kind {
    margin: 0.4rem 0rem 0.4rem 0.7rem;
    background-color: azure;
    padding: 0.4rem;
  }
  .deck_editor_card_kind > * {
    margin-left: 0.7rem;
  }
  .deck_editor_card_kind > *:first-child {
    margin-left: 0rem;
  }
  .duel_card {
    margin-bottom: 0.1rem;
    border: 0.1rem solid black;
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
</style>

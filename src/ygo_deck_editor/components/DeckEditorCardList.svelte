<script lang="ts">
  import {
    cardKindDic,
    cardSorter,
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
  import type { SearchCondition } from "./DeckEditor.svelte";
  import { getKeys } from "@stk_utils/funcs/StkObjectUtils";
  import { delay } from "@stk_utils/funcs/StkPromiseUtil";
  import { isNumber } from "@stk_utils/funcs/StkMathUtils";

  export let allCardInfos: CardInfoJson[];
  export let deckCardInfos: CardInfoJson[];
  export let mode: "List" | "Deck";
  export let onAttention: (cardInfo: CardInfoJson) => void;
  export let searchCondition: SearchCondition | undefined = undefined;

  const listGroup: { [key in TDeckTypes]: TCardKind[] } = {
    Deck: ["Monster", "Spell", "Trap"],
    ExtraDeck: ["Monster"],
  };

  const cardTree: { [deckType in TDeckTypes]: { [kind in Exclude<TCardKind, "XyzMaterial">]: CardInfoJson[] } } = {
    Deck: {
      Monster: [],
      Spell: [],
      Trap: [],
    },
    ExtraDeck: {
      Monster: [],
      Spell: [],
      Trap: [],
    },
  };

  const isBelongTo = (cardInfo: CardInfoJson) => (cardInfo.monsterCategories?.union(exMonsterCategories).length ? "ExtraDeck" : "Deck");

  const createCardTree = (cardInfos: CardInfoJson[]) => {
    Object.values(cardTree).forEach((branch) => Object.values(branch).forEach((array) => array.reset()));
    cardInfos
      .filter((cardInfo) => cardInfo.kind !== "XyzMaterial")
      .forEach((cardInfo) => {
        if (cardInfo.kind === "XyzMaterial") {
          return;
        }
        const deckType: TDeckTypes = cardInfo.monsterCategories?.union(exMonsterCategories).length ? "ExtraDeck" : "Deck";
        cardTree[deckType][cardInfo.kind].push(cardInfo);
      });
    Object.values(cardTree).forEach((branch) => Object.values(branch).forEach((array) => array.sort(cardSorter)));
  };

  const initPromise =
    mode === "List"
      ? new Promise<void>((resolve) => {
          createCardTree(allCardInfos);
          resolve();
        })
      : Promise.resolve();

  const getCardTree = () => {
    if (mode === "Deck") {
      createCardTree(deckCardInfos);
      indexUpperBound = deckCardInfos.length;
    }
    return cardTree;
  };

  const onClearButtonClick = (ev: MouseEvent, deckType: TDeckTypes, kind?: TCardKind) => {
    deckCardInfos = deckCardInfos.filter((cardInfo) => isBelongTo(cardInfo) !== deckType || (cardInfo.kind !== kind && kind));
  };

  const onPlusButtonClick = (ev: MouseEvent, cardInfo: CardInfoJson) => {
    try {
      if (ev.ctrlKey) {
        deckCardInfos.push(cardInfo);
        return;
      }
      const currentQty = deckCardInfos.filter((_cardInfo) => _cardInfo.name === cardInfo.name).length;
      if (currentQty > 2) {
        return;
      }

      const qty = ev.shiftKey ? 3 - currentQty : 1;
      if (qty < 1) {
        return;
      }

      deckCardInfos.push(...Array(qty).fill(cardInfo));
    } finally {
      deckCardInfos.sort(cardSorter);
      deckCardInfos = deckCardInfos;
    }
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
    deckCardInfos.sort(cardSorter);
  };

  // 描画を段階的に行うためのディレイ
  let indexUpperBound = 100;
  const incrementIndexUpperBound = () => {
    indexUpperBound += 10;
    if (indexUpperBound > 499) {
      return;
    }
    if (indexUpperBound > allCardInfos.length + deckCardInfos.length) {
      return;
    }
    delay(100).then(incrementIndexUpperBound);
  };

  const filter = (cardInfo: CardInfoJson, index: number, array: CardInfoJson[], kind?: TCardKind) => {
    // 検索条件を変更したとき、段階的に描画するようにする
    if (index === 0 && kind === "Monster") {
      indexUpperBound = 100;
      delay(100).then(incrementIndexUpperBound);
    }
    if (!searchCondition) {
      return true;
    }
    if (!searchCondition.cardKinds.includes(cardInfo.kind)) {
      return false;
    }

    if (searchCondition.name.trim().length) {
      const tags = [cardInfo.name, ...(cardInfo.nameTags ?? []), ...(cardInfo.textTags ?? [])];
      if (tags.every((tag) => !tag.includes(searchCondition.name))) {
        return false;
      }
    }

    if (!cardInfo.isImplemented && !searchCondition.others.includes("implemented")) {
      return false;
    }

    if (cardInfo.isForTest && !searchCondition.others.includes("test")) {
      return false;
    }

    if (cardInfo.isOldVersion && !searchCondition.others.includes("oldVersion")) {
      return false;
    }

    if (cardInfo.kind === "Monster") {
      if (cardInfo.attributes && !searchCondition.monsterAttributes.union(cardInfo.attributes).length) {
        return false;
      }
      if (cardInfo.types && !searchCondition.monsterTypes.union(cardInfo.types).length) {
        return false;
      }

      const star = cardInfo.level ?? cardInfo.rank ?? cardInfo.link;

      if (isNumber(searchCondition.starLowerBound) && (star ?? 0) < searchCondition.starLowerBound) {
        return false;
      }

      if (isNumber(searchCondition.starUpperBound) && (star ?? 0) > searchCondition.starUpperBound) {
        return false;
      }

      if (isNumber(searchCondition.atkLowerBound) && (cardInfo.attack ?? 0) < searchCondition.atkLowerBound) {
        return false;
      }
      if (isNumber(searchCondition.atkUpperBound) && (cardInfo.attack ?? 0) > searchCondition.atkUpperBound) {
        return false;
      }
      if (isNumber(searchCondition.defLowerBound) && (cardInfo.defense ?? 0) < searchCondition.defLowerBound) {
        return false;
      }
      if (isNumber(searchCondition.defUpperBound) && (cardInfo.defense ?? 0) > searchCondition.defUpperBound) {
        return false;
      }
      if (isNumber(searchCondition.atkPlusDef)) {
        if (!isNumber(cardInfo.attack)) {
          return false;
        }
        if (!isNumber(cardInfo.defense)) {
          return false;
        }
        if (cardInfo.attack + cardInfo.defense !== searchCondition.atkPlusDef) {
          return false;
        }
      }

      if (!cardInfo.monsterCategories) {
        return false;
      }
      return cardInfo.monsterCategories.union(searchCondition.monsterCategories).length;
    }
    if (cardInfo.kind === "Spell") {
      return cardInfo.spellCategory && searchCondition.spellCategories.includes(cardInfo.spellCategory);
    }
    if (cardInfo.kind === "Trap") {
      return cardInfo.trapCategory && searchCondition.trapCategories.includes(cardInfo.trapCategory);
    }
  };
</script>

<div class="deck_editor_card_list">
  {#await initPromise}
    <div>読み込み中...</div>
  {:then}
    {@const tree = getCardTree()}
    {#each deckTypes as deckType}
      {@const branch1all = Object.values(tree[deckType]).flatMap((cardInfos) => cardInfos)}
      <div class="deck_editor_deck_type">
        <div class="deck_editor_deck_type_header">
          <div>{deckTypeDic[deckType]}（{branch1all.filter(filter).length} / {branch1all.length}枚）</div>
          {#if mode === "Deck" && branch1all.some(filter)}
            <div>
              <button class="button_style_reset" title="※shiftキー同時押しで一括外し" on:click={(ev) => onClearButtonClick(ev, deckType, undefined)}>
                クリア
              </button>
            </div>
          {/if}
        </div>
        {#each getKeys(tree[deckType]).filter((kind) => listGroup[deckType].includes(kind)) as kind}
          {@const branch2 = tree[deckType][kind].filter((...args) => filter(...args, kind))}
          <div class="deck_editor_card_kind">
            <div class="deck_editor_card_kind_header">
              <div>{cardKindDic[kind]}（{branch2.length} / {tree[deckType][kind].length}枚）</div>
              {#if mode === "Deck" && branch2.length}
                <div>
                  <button class="button_style_reset" title="※shiftキー同時押しで一括外し" on:click={(ev) => onClearButtonClick(ev, deckType, kind)}>
                    クリア
                  </button>
                </div>
              {/if}
            </div>
            <ul>
              {#each branch2 as cardInfo, index}
                {#if index < indexUpperBound}
                  <li class="deck_editor_item">
                    <div
                      role="listitem"
                      class={`deck_editor_card duel_card ${cardInfo.kind} ${cardInfo?.monsterCategories?.join(" ")} ${cardInfo.isImplemented ? "is_implemented" : "is_not_implemented"}`}
                      on:mouseenter={() => onAttention(cardInfo)}
                    >
                      <div>
                        <div>
                          {cardInfo.name}
                        </div>
                        <div style="display:flex">
                          <div>
                            {#if cardInfo.kind === "Monster"}
                              {#if cardInfo.level}
                                ★{cardInfo.level}
                              {/if}
                              {#if cardInfo.rank}
                                ☆{cardInfo.rank}
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
                          <div style="flex-grow: 1; width:0.1rem"></div>
                          <div>
                            {#if cardInfo.kind === "Monster"}
                              <span> {cardInfo.attack ?? "?"}</span> /
                              <span style="display: inline-block;width:2rem;text-align: right;">{cardInfo.defense ?? "?"}</span>
                            {/if}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      class="button_style_reset"
                      disabled={!cardInfo.isImplemented}
                      title={cardInfo.isImplemented ? "※shiftキー同時押しで一括投入" : ""}
                      on:click={(ev) => onPlusButtonClick(ev, cardInfo)}>+</button
                    >
                    <button
                      class="button_style_reset"
                      disabled={!cardInfo.isImplemented}
                      title={cardInfo.isImplemented ? "※shiftキー同時押しで一括外し" : ""}
                      on:click={(ev) => onMinusButtonClick(ev, cardInfo)}>-</button
                    >
                  </li>
                {/if}
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {/each}
  {/await}
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
  .deck_editor_deck_type_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.3rem;
  }
  .deck_editor_deck_type_header button {
    font-size: 0.7rem;
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
  .deck_editor_card_kind_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.3rem;
  }
  .deck_editor_card_kind_header button {
    font-size: 0.7rem;
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
  button {
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

  button:hover {
    background: #67c5ff;
    color: white;
  }
  button:disabled {
    filter: grayscale(100);
    transition: 0s;
    color: #67c5ff;
    background: #67c5ff;
    cursor: not-allowed;
  }
</style>

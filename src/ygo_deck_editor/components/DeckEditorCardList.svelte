<script lang="ts">
  import {
    cardSorter,
    deckCardKindDic,
    deckCardKinds,
    exMonsterCategories,
    getDeckCardKind,
    monsterCategoryEmojiDic,
    monsterTypeEmojiDic,
    spellCategoryDic,
    trapCategoryDic,
    type CardInfoJson,
    type EntityStatusBase,
    type TCardKind,
    type TDeckCardKind,
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
  export let selectedCardInfo: CardInfoJson | undefined = undefined;

  let selectedDeckCardKind: TDeckCardKind = "ExtraMonster";

  const maxIndexUpperBound = 500;

  const cardTree: { [kind in TDeckCardKind]: CardInfoJson[] } = {
    ExtraMonster: [],
    Monster: [],
    Spell: [],
    Trap: [],
  } as const;

  const isBelongTo = (cardInfo: CardInfoJson) => (cardInfo.monsterCategories?.union(exMonsterCategories).length ? "ExtraDeck" : "Deck");

  const sortCardTree = () => {
    const _cardSorter = (left: EntityStatusBase, right: EntityStatusBase) =>
      cardSorter(
        left,
        right,
        searchCondition?.sort.filter((sortItem) => sortItem.priority > 0).toSorted((l, r) => l.priority - r.priority)
      );
    Object.values(cardTree).forEach((array) => array.sort(_cardSorter));
  };

  const createCardTree = (cardInfos: CardInfoJson[]) => {
    Object.values(cardTree).forEach((array) => array.reset());
    cardInfos
      .filter((cardInfo) => cardInfo.kind !== "XyzMaterial")
      .forEach((cardInfo) => {
        if (cardInfo.kind === "XyzMaterial") {
          return;
        }
        const deckCardKind = getDeckCardKind(cardInfo);
        cardTree[deckCardKind].push(cardInfo);
      });
    sortCardTree();
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

  const onClearButtonClick = (ev: MouseEvent, deckCardKind: TDeckCardKind) => {
    const deckType = deckCardKind === "ExtraMonster" ? "ExtraDeck" : "Deck";
    const kind = deckCardKind === "ExtraMonster" ? "Monster" : deckCardKind;
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
    onAttention(cardInfo);
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
    onAttention(cardInfo);
  };

  // 描画を段階的に行うためのディレイ
  let indexUpperBound = 100;
  const incrementIndexUpperBound = () => {
    indexUpperBound += 10;
    if (indexUpperBound >= maxIndexUpperBound) {
      return;
    }
    if (indexUpperBound > allCardInfos.length + deckCardInfos.length) {
      return;
    }
    delay(100).then(incrementIndexUpperBound);
  };

  let oldSort = "";
  let oldDeckCardInfos = [...deckCardInfos];

  $: {
    if (oldDeckCardInfos.length !== deckCardInfos.length) {
      if (selectedCardInfo && mode === "Deck") {
        const deckCardKind = getDeckCardKind(selectedCardInfo);
        if (cardTree[deckCardKind].filter(filter).length > 1 || deckCardInfos.length > oldDeckCardInfos.length) {
          selectedDeckCardKind = deckCardKind;
        } else {
          selectedDeckCardKind = getKeys(cardTree).find((key) => cardTree[key].find(filter)) ?? "ExtraMonster";
        }
      }
      oldDeckCardInfos = [...deckCardInfos];
    }
  }
  $: {
    if (mode === "List") {
      // ここにsearchConditionが入っているので、変更を監視してくれる
      const newSort = JSON.stringify(searchCondition?.sort);

      // 子要素までは追跡してくれないらしいので、自力で変更を検知する
      if (oldSort !== newSort) {
        oldSort = newSort;
        sortCardTree();
      }

      // 検索条件を変更したとき、段階的に描画するようにする
      indexUpperBound = 100;

      if (!cardTree[selectedDeckCardKind].find(filter)) {
        selectedDeckCardKind = getKeys(cardTree).find((key) => cardTree[key].find(filter)) ?? "ExtraMonster";
      }

      delay(100).then(incrementIndexUpperBound);
    }
  }

  const filter = (cardInfo: CardInfoJson, index: number, array: CardInfoJson[], kind?: TCardKind) => {
    if (!searchCondition) {
      return true;
    }

    if (cardInfo.kind === "XyzMaterial") {
      return false;
    }

    const deckCardKind = getDeckCardKind(cardInfo);

    if (!searchCondition.deckCardKinds.includes(deckCardKind)) {
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

      if (deckCardKind === "ExtraMonster" && !cardInfo.monsterCategories.union(searchCondition.exMonsterCategories).length) {
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
    {#each deckCardKinds as deckCardKind, deckCardKindIndex}
      {@const branch2 = tree[deckCardKind].filter(filter)}
      {#if branch2.length}
        <div class="deck_editor_card_kind deckCardKind {deckCardKind === selectedDeckCardKind ? 'selected' : ''}">
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="deck_editor_card_kind_header"
            on:click={() => {
              if (selectedDeckCardKind !== deckCardKind) {
                selectedDeckCardKind = deckCardKind;
                return;
              }
              selectedDeckCardKind =
                deckCardKinds
                  .map((_, index) => index + deckCardKindIndex)
                  .map((index) => index % deckCardKinds.length)
                  .map((index) => deckCardKinds[index])
                  .filter((key) => key !== deckCardKind)
                  .find((key) => cardTree[key].find(filter)) ?? deckCardKind;
            }}
          >
            <div>
              {deckCardKindDic[deckCardKind]}（{branch2.length.toLocaleString()} / {tree[deckCardKind].length.toLocaleString()}枚）
              {#if branch2.length > maxIndexUpperBound}
                ※表示上限{maxIndexUpperBound.toLocaleString()}枚
              {/if}
            </div>
            {#if mode === "Deck" && branch2.length}
              <div>
                <button class="button_style_reset" on:click={(ev) => onClearButtonClick(ev, deckCardKind)}> クリア </button>
              </div>
            {/if}
          </div>
          <div class="deck_editor_card_kind_body">
            <ul class={deckCardKind}>
              {#each branch2 as cardInfo, index}
                {#if index < indexUpperBound && (index < 20 || selectedDeckCardKind === deckCardKind)}
                  <li class="deck_editor_item">
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
                          <div style="flex-grow: 1; height:0px; width:0px"></div>
                          <div style="text-wrap-mode: nowrap;">
                            {#if cardInfo.kind === "Monster"}
                              <span> {cardInfo.attack ?? "?"}</span> /
                              <span style="display: inline-block;width:2rem;text-align: right;">{cardInfo.defense ?? "?"}</span>
                            {/if}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      class="button_style_reset plus_minus_button"
                      disabled={!cardInfo.isImplemented}
                      title={cardInfo.isImplemented ? "※shiftキー同時押しで一括投入" : ""}
                      on:click={(ev) => onPlusButtonClick(ev, cardInfo)}>+</button
                    >
                    <button
                      class="button_style_reset plus_minus_button"
                      disabled={!cardInfo.isImplemented}
                      title={cardInfo.isImplemented ? "※shiftキー同時押しで一括外し" : ""}
                      on:click={(ev) => onMinusButtonClick(ev, cardInfo)}>-</button
                    >
                  </li>
                {/if}
              {/each}
            </ul>
          </div>
        </div>
      {/if}
    {/each}
  {/await}
</div>

<style>
  .deck_editor_card_list {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0;
    flex-basis: auto;
    overflow: hidden;
    padding: 0.5rem 0;
    background-color: antiquewhite;
    border-radius: 0.3rem;
  }
  .deck_editor_card_kind {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    flex-shrink: 0.01;
    transition: 0.1s linear; /* アニメーションの設定 */
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    border-style: none;
    overflow-y: hidden;
    height: max-content;
  }
  .deck_editor_card_kind_body {
    position: relative;
    overflow: visible;
    height: 100%;
  }
  .deck_editor_card_kind_body ul {
    position: absolute;
    transition: 0.1s linear; /* アニメーションの設定 */
    visibility: hidden;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }
  .deck_editor_card_kind .deck_editor_card_kind_header {
    background-color: azure;
    border-radius: 1rem;
    padding: 0.4rem 1rem;
    margin: 0.3rem;
  }
  .deck_editor_card_kind.selected {
    flex-grow: 1;
    flex-shrink: 1;
  }
  .deck_editor_card_kind.selected ul {
    visibility: visible;
    display: block;
    overflow-y: scroll;
    height: fit-content;
  }
  .deck_editor_card_kind > * {
    margin-left: 1rem;
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
  .deck_editor_card_kind_header button:hover {
    background: #67c5ff;
    color: white;
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
  .plus_minus_button {
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

  .plus_minus_button:hover {
    background: #67c5ff;
    color: white;
  }
  .plus_minus_button:disabled {
    filter: grayscale(100);
    transition: 0s;
    color: #67c5ff;
    background: #67c5ff;
    cursor: not-allowed;
  }
</style>

<script lang="ts">
  import {
    cardSorter,
    deckCardKindDic,
    deckCardKinds,
    getDeckCardKind,
    type CardInfoJson,
    type CardTree,
    type EntityStatusBase,
    type TDeckCardKind,
  } from "@ygo/class/YgoTypes";
  import type { CardControlEventHandlers, SearchCondition } from "@ygo_deck_editor/components/DeckEditor.svelte";
  import { getKeys } from "@stk_utils/funcs/StkObjectUtils";
  import { delay } from "@stk_utils/funcs/StkPromiseUtil";
  import { isNumber, max } from "@stk_utils/funcs/StkMathUtils";
  import { userAgentInfo } from "@stk_utils/class/StkUserAgentInfo";
  import DeckEditorCard from "@ygo_deck_editor/components/DeckEditorCard.svelte";

  export let allCardTree: CardTree;
  export let deckCardTree: CardTree;
  export let mode: "List" | "Deck";
  export let onAttention: (cardInfo: CardInfoJson) => void;
  export let searchCondition: SearchCondition | undefined = undefined;
  export let cardControlEventHandlers: CardControlEventHandlers;
  let selectedDeckCardKind: TDeckCardKind = "ExtraMonster";

  // 描画を段階的に行うためのディレイ
  const maxIndexUpperBound = userAgentInfo.terminalTypeName === "PC" ? 500 : userAgentInfo.terminalTypeName === "Tablet Device" ? 300 : 100;
  const minIndexUpperBound = 20;
  let indexUpperBound = minIndexUpperBound;
  const incrementIndexUpperBound = (recursion: boolean = false) => {
    if (!recursion) {
      indexUpperBound = minIndexUpperBound;
    }
    indexUpperBound += 10;
    if (mode === "List") {
      if (indexUpperBound >= maxIndexUpperBound) {
        return;
      }
    } else {
      if (indexUpperBound > max(...Object.values(deckCardTree).map((array) => array.length))) {
        return;
      }
    }
    delay(100).then(() => incrementIndexUpperBound(true));
  };

  const cardTree: CardTree = mode === "List" ? allCardTree : deckCardTree;

  const sortCardTree = (...kinds: TDeckCardKind[]) => {
    const _kinds = kinds.length ? kinds : getKeys(cardTree);
    const _cardSorter = (left: EntityStatusBase, right: EntityStatusBase) =>
      cardSorter(
        left,
        right,
        searchCondition?.sort.filter((sortItem) => sortItem.priority > 0).toSorted((l, r) => l.priority - r.priority),
      );
    _kinds.forEach((kind) => cardTree[kind].sort(_cardSorter));
  };

  const onClearButtonClick = (ev: MouseEvent, deckCardKind: TDeckCardKind) => {
    deckCardTree[deckCardKind] = [];
  };

  // 監視する変数ごとにラベルを分ける

  // デッキ内のカードの監視
  let oldCardTree: CardTree = structuredClone(cardTree);
  $: {
    if (mode === "Deck") {
      getKeys(cardTree).forEach((key) => (cardTree[key] = deckCardTree[key]));
      if (!cardTree[selectedDeckCardKind].length) {
        selectedDeckCardKind = getKeys(cardTree).find((key) => cardTree[key].find(filter)) ?? "ExtraMonster";
      } else {
        const target = getKeys(cardTree)
          .map((kind) => ({ kind, cardInfos: cardTree[kind] }))
          .filter(({ cardInfos }) => cardInfos.length)
          .find(({ kind, cardInfos }) => cardInfos.length !== oldCardTree[kind].length);
        if (target && selectedDeckCardKind !== target.kind) {
          selectedDeckCardKind = target.kind;
        }
      }
      // 監視用の変数を置き換え
      oldCardTree = structuredClone(cardTree);
    }
  }

  // 検索条件の監視
  let oldSort = "";
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
      incrementIndexUpperBound();
    }
  }

  const filter = (cardInfo: CardInfoJson) => {
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
  {#each deckCardKinds as deckCardKind, deckCardKindIndex}
    {@const branch2 = cardTree[deckCardKind].filter(filter)}
    <div class="deck_editor_card_kind deckCardKind {deckCardKind === selectedDeckCardKind ? 'selected' : ''} {branch2.length ? '' : 'empty'}">
      {#if branch2.length}
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
            {deckCardKindDic[deckCardKind]}（{branch2.length.toLocaleString()}
            {#if mode === "List"}
              / {cardTree[deckCardKind].length.toLocaleString()}
            {/if}
            枚）
            {#if branch2.length > maxIndexUpperBound}
              ※表示上限{maxIndexUpperBound.toLocaleString()}枚
            {/if}
          </div>
          <div style="display: flex;">
            {#if mode === "Deck" && branch2.length}
              <div>
                <button class="button_style_reset" on:click={(ev) => onClearButtonClick(ev, deckCardKind)}> クリア </button>
              </div>
            {/if}
            <div class="triangle">▲</div>
          </div>
        </div>
        <div class="deck_editor_card_kind_body">
          <ul class={deckCardKind}>
            {#each branch2 as cardInfo, index}
              {#if index < indexUpperBound && (index < 20 || selectedDeckCardKind === deckCardKind)}
                <li class="deck_editor_item">
                  <DeckEditorCard {mode} {cardInfo} {onAttention} {cardControlEventHandlers} />
                  {#if mode === "Deck"}
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
                      disabled={mode !== "Deck" && deckCardTree[deckCardKind].every((_info) => _info.name !== cardInfo.name)}
                      title={cardInfo.isImplemented ? "※shiftキー同時押しで一括外し" : ""}
                      on:click={(ev) => cardControlEventHandlers.onCardRemove(ev, cardInfo)}
                    >
                      -
                    </button>
                  {/if}
                </li>
              {/if}
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {/each}
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
    transition: 0.3s linear; /* アニメーションの設定 */
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    border-style: none;
    overflow-y: hidden;
  }
  .deck_editor_card_kind_body {
    position: relative;
    overflow: visible;
    height: 100%;
  }
  .deck_editor_card_kind_body ul {
    position: absolute;
    transition: 0.5s linear; /* アニメーションの設定 */
    padding-right: 0.3rem;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    overflow-y: scroll;
  }
  .deck_editor_card_kind .deck_editor_card_kind_header {
    background-color: azure;
    border-radius: 1rem;
    padding: 0.4rem 1rem;
    margin: 0.3rem;
  }
  .deck_editor_card_kind .deck_editor_card_kind_header .triangle {
    transition: 0.3s ease;
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    text-align: center;
    border-radius: 1rem;
    border-width: 1px;
    border-style: solid;
    background-color: white;
    box-shadow: steelblue 1px;
  }
  .deck_editor_card_kind.selected .deck_editor_card_kind_header .triangle {
    rotate: 180deg;
    filter: invert();
  }
  .deck_editor_card_kind.selected {
    flex-grow: 1;
  }
  .deck_editor_card_kind.selected ul {
    visibility: visible;
  }
  .deck_editor_card_kind.empty {
    flex-shrink: 1;
    height: 0;
    margin: 0;
    padding: 0;
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
    filter: grayscale(90);
    transition: 0s;
    color: #67c5ff;
    background-color: red;
    cursor: not-allowed;
  }
</style>

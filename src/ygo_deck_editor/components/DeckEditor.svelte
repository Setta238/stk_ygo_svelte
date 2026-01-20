<script lang="ts" module>
  export type SearchCondition = {
    name: string;
    deckCardKinds: TDeckCardKind[];
    exMonsterCategories: TMonsterExSummonCategory[];
    monsterCategories: Exclude<TMonsterCategory, TMonsterExSummonCategory>[];
    monsterAttributes: TMonsterAttribute[];
    monsterTypes: TMonsterType[];
    spellCategories: TSpellCategory[];
    trapCategories: TTrapCategory[];
    starLowerBound?: number;
    starUpperBound?: number;
    atkLowerBound?: number;
    atkUpperBound?: number;
    defLowerBound?: number;
    defUpperBound?: number;
    atkPlusDef?: number;
    others: ("test" | "oldVersion" | "implemented")[];
    sort: TSortSetting;
  };
  type Position = { clientX: number; clientY: number };
  type CardControlEvArg = { shiftKey?: boolean; ctrlKey?: boolean; preventDefault?: () => void; stopPropagation: () => void } & (
    | { clientX: number; clientY: number; changedTouches?: undefined }
    | { changedTouches: TouchList }
  );
  export type CardControlEventHandlers = {
    onCardAppend: (ev: CardControlEvArg, cardInfo: CardInfoJson) => void;
    onCardRemove: (ev: CardControlEvArg, cardInfo: CardInfoJson) => void;
    onCardDragStart: (ev: CardControlEvArg, from: string, cardInfo: CardInfoJson) => void;
    onCardDragging: (ev: CardControlEvArg, from: string) => void;
    onCardDragEnd: (ev: CardControlEvArg) => void;
    onCardDragCancel: (ev: CardControlEvArg) => void;
  };
</script>

<script lang="ts">
  import { cardDefinitionsPrms, loadTextData } from "@ygo/class/CardInfo";
  import { DeckInfo } from "@ygo/class/DeckInfo";
  import DeckEditorCardList from "./DeckEditorCardList.svelte";
  import DeckEditorCardDetail from "./DeckEditorCardDetail.svelte";
  import {
    cardSorter,
    cardSortKeyDic,
    createCardTree,
    deckCardKindDic,
    deckCardKinds,
    defaultSortSetting,
    exMonsterCategories,
    getDeckCardKind,
    monsterAttributeDic,
    monsterAttributes,
    monsterCategories,
    monsterCategoryDic,
    monsterCategoryEmojiDic,
    monsterTypeDic,
    monsterTypeEmojiDic,
    monsterTypes,
    spellCategories,
    spellCategoryDic,
    trapCategories,
    trapCategoryDic,
    type CardInfoJson,
    type CardTree,
    type TDeckCardKind,
    type TMonsterAttribute,
    type TMonsterCategory,
    type TMonsterExSummonCategory,
    type TMonsterType,
    type TSortSetting,
    type TSpellCategory,
    type TTrapCategory,
  } from "@ygo/class/YgoTypes";
  import {} from "@stk_utils/funcs/StkDateUtils";
  import { slide } from "svelte/transition";
  import DeckEditorModalContainer, { DeckEditorModalControllerFactory } from "@ygo_deck_editor/components_modal/DeckEditorModalContainer.svelte";
  import { getKeys } from "@stk_utils/funcs/StkObjectUtils";
  import DeckEditorCard from "./DeckEditorCard.svelte";
  import { delay } from "@stk_utils/funcs/StkPromiseUtil";

  const modalController = DeckEditorModalControllerFactory.createModalController({
    onDragStart: { append: () => {}, remove: () => {} },
    onDragEnd: { append: () => {}, remove: () => {} },
  });
  const searchConditionDefaultValues: SearchCondition = {
    name: "",
    deckCardKinds: [...deckCardKinds],
    exMonsterCategories: [...exMonsterCategories],
    monsterCategories: monsterCategories.filter((cat) => !(exMonsterCategories as Readonly<string[]>).includes(cat)) as Exclude<
      TMonsterCategory,
      TMonsterExSummonCategory
    >[],
    monsterAttributes: [...monsterAttributes],
    monsterTypes: [...monsterTypes],
    spellCategories: spellCategories.filter((sc) => sc !== "PendulumScale"),
    trapCategories: [...trapCategories],
    starLowerBound: 0,
    starUpperBound: 13,
    atkLowerBound: 0,
    atkUpperBound: 5000,
    defLowerBound: 0,
    defUpperBound: 5000,
    atkPlusDef: undefined,
    others: ["test", "oldVersion", "implemented"],
    sort: [...defaultSortSetting],
  };

  const searchCondition = structuredClone(searchConditionDefaultValues);
  searchCondition.others = ["oldVersion"];
  searchCondition.monsterCategories = ["Effect", "Tuner", "Pendulum"];

  let main_view_mode: "SearchCondition" | "DeckEdit" = "DeckEdit";
  let left_pain_mode: "SearchCondition" | "CardDetail" = "SearchCondition";
  const allResetSearchCondition = () => {
    if (!searchCondition.deckCardKinds.length) {
      getKeys(searchCondition).forEach((key) => {
        if (Array.isArray(searchCondition[key]) && Array.isArray(searchConditionDefaultValues[key])) {
          (searchCondition[key] as string[]) = [...searchConditionDefaultValues[key]] as string[];
        } else {
          // @ts-expect-error
          searchCondition[key] = searchConditionDefaultValues[key];
        }
      });
      return;
    }
    searchCondition.name = "";
    searchCondition.deckCardKinds = [];
    searchCondition.exMonsterCategories = [];
    searchCondition.monsterCategories = [];
    searchCondition.monsterAttributes = [];
    searchCondition.monsterTypes = [];
    searchCondition.spellCategories = [];
    searchCondition.trapCategories = [];
    searchCondition.others = [];
    searchCondition.atkLowerBound = 0;
    searchCondition.atkUpperBound = 5000;
    searchCondition.defLowerBound = 0;
    searchCondition.defUpperBound = 5000;
    searchCondition.atkPlusDef = undefined;
    searchCondition.sort = [...defaultSortSetting];
  };

  const onResetSearchCondition = (keys: (keyof typeof searchCondition)[]) => {
    keys.forEach((key) => {
      if (Array.isArray(searchCondition[key]) && Array.isArray(searchConditionDefaultValues[key])) {
        (searchCondition[key] as string[]) = searchCondition[key].length ? [] : ([...searchConditionDefaultValues[key]] as string[]);
      } else {
        // @ts-expect-error
        searchCondition[key] = searchConditionDefaultValues[key];
      }
    });
  };

  // TODO : このあたりのCardControlEventHandlersのメソッド群を別モジュールに切り出そうとしたが、うまく動かなかった。要調査、要整理
  let draggedCard: { from: "Deck" | "List"; cardInfo: CardInfoJson; pos: Position; startPos: Position } | undefined;
  let _draggedCard: typeof draggedCard;

  let canDropToDeck = false;
  const dragStartDelay = 200;

  const onCardDragCancel = () => {
    canDropToDeck = false;
    draggedCard = undefined;
    _draggedCard = undefined;
  };
  const onCardAppend = (ev: CardControlEvArg, cardInfo: CardInfoJson) => {
    const deckCardKind = getDeckCardKind(cardInfo);
    const currentQty = tmpDeck.cardTree[deckCardKind].filter((_cardInfo) => _cardInfo.name === cardInfo.name).length;
    let qty = ev.shiftKey ? 3 - currentQty : 1;
    console.debug(cardInfo, deckCardKind, currentQty, qty);
    if (!ev.ctrlKey && currentQty > 2) {
      qty = 0;
    }
    if (qty) {
      tmpDeck.cardTree[deckCardKind] = [...tmpDeck.cardTree[deckCardKind], ...Array(qty).fill(cardInfo)].sort(cardSorter);
    }
    onCardDragCancel();
    onAttention(cardInfo);
  };
  const onCardRemove = (ev: CardControlEvArg, cardInfo: CardInfoJson) => {
    const deckCardKind = getDeckCardKind(cardInfo);
    let count = 0;
    tmpDeck.cardTree[deckCardKind] = tmpDeck.cardTree[deckCardKind].filter((_cardInfo) => {
      if (_cardInfo.name !== cardInfo.name) {
        return true;
      }

      count++;
      return !ev.shiftKey && count > 1;
    });
    onCardDragCancel();
    onAttention(cardInfo);
  };
  const getPosFromEvArg = (ev: CardControlEvArg): Position | undefined => {
    if (ev.changedTouches && ev.changedTouches.length !== 1) {
      return;
    }
    const { clientX, clientY } = ev.changedTouches ? ev.changedTouches[0] : ev;
    return { clientX, clientY };
  };
  const cardControlEventHandlers: CardControlEventHandlers = {
    onCardAppend,
    onCardRemove,
    onCardDragCancel,
    onCardDragStart: (ev, from, cardInfo) => {
      onAttention(cardInfo);
      if (from !== "List" && from !== "Deck") {
        onCardDragCancel();
        return;
      }
      if (from === "List" && !cardInfo.isImplemented) {
        onCardDragCancel();
        return;
      }
      const pos = getPosFromEvArg(ev);

      if (!pos) {
        onCardDragCancel();
        return;
      }

      _draggedCard = { from, cardInfo, pos, startPos: pos };

      delay(dragStartDelay).then(() => {
        if (_draggedCard?.cardInfo === cardInfo) {
          draggedCard = _draggedCard;
        }
      });

      canDropToDeck = false;
    },
    onCardDragging: (ev, from) => {
      if (draggedCard && ev.preventDefault) {
        ev.preventDefault();
      }
      if (draggedCard && ev.stopPropagation) {
        ev.stopPropagation();
      }
      if (!_draggedCard) {
        onCardDragCancel();
        return;
      }
      const pos = getPosFromEvArg(ev);

      if (!pos) {
        onCardDragCancel();
        return;
      }
      const __draggedCard = draggedCard || _draggedCard;
      canDropToDeck = Boolean(
        __draggedCard.from === "List" &&
          __draggedCard.cardInfo.isImplemented &&
          document
            .elementsFromPoint(pos.clientX, pos.clientY)
            .some((element) => element.classList.contains("deck_editor_body_right_body") || element.classList.contains("deck_editor_body_right_dummy")),
      );
      if (canDropToDeck) {
        main_view_mode = "DeckEdit";
      }
      if (draggedCard) {
        draggedCard = { ...draggedCard, pos };
      } else {
        _draggedCard.pos = { ...pos };
      }
    },
    onCardDragEnd: (ev) => {
      if (!_draggedCard || !draggedCard) {
        onCardDragCancel();
        return;
      }

      const pos = getPosFromEvArg(ev);

      if (!pos) {
        onCardDragCancel();
        return;
      }

      if (
        draggedCard.from === "List" &&
        draggedCard.cardInfo.isImplemented &&
        document.elementsFromPoint(pos.clientX, pos.clientY).some((element) => element.classList.contains("deck_editor_body_right_body"))
      ) {
        onCardAppend(ev, draggedCard.cardInfo);
      }
      if (
        draggedCard.from === "Deck" &&
        !document.elementsFromPoint(pos.clientX, pos.clientY).some((element) => element.classList.contains("deck_editor_body_right_body"))
      ) {
        onCardRemove(ev, draggedCard.cardInfo);
      }
      onCardDragCancel();
    },
  };
  const ondblclick = (ev: MouseEvent, key: keyof typeof searchCondition, value: string) => {
    if (Array.isArray(searchCondition[key]) && Array.isArray(searchConditionDefaultValues[key])) {
      (searchCondition[key] as string[]) = [value];
    }
  };

  const onSelectDeckChange = async () => {
    const deckInfos = await deckInfosPromise;
    const deckInfo = deckInfos.find((deckInfo) => deckInfo.id === selectedId);
    if (!deckInfo) {
      return;
    }
    const cardDefinitions = await cardDefinitionsPrms;
    tmpDeck = {
      ...deckInfo,
      cardTree: createCardTree(
        deckInfo.cardNames
          .map((name) => {
            const cardInfo = cardDefinitions.getCardInfo(name);
            if (cardInfo === undefined) {
              console.error(name);
            }
            return cardInfo;
          })
          .filter((i) => i !== undefined),
      ),
    };
  };

  const initDeck = () =>
    DeckInfo.getAllDeckInfo().then((deckInfos) => {
      selectedId = (
        deckInfos.find((deckInfo) => deckInfo.lastUsedAt.getTime() === Math.max(...deckInfos.map((deckInfo) => deckInfo.lastUsedAt.getTime()))) ?? deckInfos[0]
      ).id;
      return deckInfos;
    });

  let selectedId = -1;
  let deckInfosPromise: Promise<DeckInfo[]> = initDeck();
  let deckInfosObjectURLPromise: Promise<string> = deckInfosPromise.then((deckInfos) => DeckInfo.convertToObjectURL(deckInfos));

  deckInfosPromise.then(onSelectDeckChange);
  const reloadAllDeckInfo = () => {
    deckInfosPromise = initDeck();
    deckInfosObjectURLPromise = deckInfosPromise.then((deckInfos) => DeckInfo.convertToObjectURL(deckInfos));
    onSelectDeckChange();
  };

  let tmpDeck = {
    id: -Number.MAX_VALUE,
    name: "",
    description: "",
    lastUsedAt: new Date(),
    cardTree: {
      ExtraMonster: [],
      Monster: [],
      Spell: [],
      Trap: [],
    } as CardTree,
  };

  let selectedCardInfo: CardInfoJson | undefined = undefined;
  let latestAttentionCardId = 0;

  const onAttention = (_cardInfo: CardInfoJson) => {
    left_pain_mode = "CardDetail";
    if (_cardInfo.cardId !== undefined && !_cardInfo.description && !_cardInfo.pendulumDescription) {
      latestAttentionCardId = _cardInfo.cardId;
      loadTextData([_cardInfo.cardId]).then(() => {
        if (_cardInfo.cardId === latestAttentionCardId) {
          selectedCardInfo = _cardInfo;
        }
      });
    }
    selectedCardInfo = _cardInfo;
  };

  const getSelectedDeck = async () => {
    const deckInfos = await deckInfosPromise;
    const deckInfo = deckInfos.find((deckInfo) => deckInfo.id === selectedId);
    if (!deckInfo) {
      throw new Error("illegal state");
    }
    return deckInfo;
  };

  const onSaveDeckClick = async () => {
    const deckInfo = await getSelectedDeck();
    await deckInfo.saveDeckInfo({
      ...deckInfo,
      name: tmpDeck.name,
      cardNames: Object.values(tmpDeck.cardTree)
        .flatMap((a) => a)
        .map((info) => info.name),
      lastUsedAt: new Date(),
    });
    reloadAllDeckInfo();
  };
  const onCopyDeckClick = async () => {
    const newDeck = await DeckInfo.createNewDeck(
      `デッキ_${new Date().formatToYYYYMMDD_HHMMSS("", "", "")}`,
      `コピー日時：${new Date().formatToYYYYMMDD_HHMMSS("-", " ", ":")}`,
      Object.values(tmpDeck.cardTree)
        .flatMap((a) => a)
        .map((info) => info.name),
    );
    newDeck.saveDeckInfo();
    reloadAllDeckInfo();
  };
  const onDeleteDeckClick = async (ev: MouseEvent) => {
    const deckInfo = await getSelectedDeck();
    // TODO メッセージボックス作成
    if (!ev.shiftKey && !confirm(`デッキ【${deckInfo.name}】を削除します。\nよろしいですか？`)) {
      return;
    }
    await deckInfo.delete();
    reloadAllDeckInfo();
  };

  const onUploadClick = async () => {
    const result = await modalController.deckUploader.show({
      title: "デッキ情報アップロード",
      position: "Middle",
      cancelable: true,
    });
    if (!result) {
      return;
    }

    const expiredIdList: number[] = [];

    if (result.replaceAll) {
      if (!confirm(`既存デッキ情報を全て削除し、アップロードしたファイルに置き換えます。\nよろしいですか？`)) {
        return;
      }

      expiredIdList.push(...(await deckInfosPromise).map((deckInfo) => deckInfo.id));
    }
    await Promise.all(result.deckInfos.map((deckInfo) => DeckInfo.createNewDeck(deckInfo.name, deckInfo.description, deckInfo.cardNames, deckInfo.lastUsedAt)));

    if (expiredIdList.length) {
      await Promise.all(expiredIdList.map(DeckInfo.remove));
    }

    reloadAllDeckInfo();
  };
  const getScreenSize = () => {
    if (innerWidth <= 1400) {
      return "compact";
    }
    return "wide";
  };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="deck_editor
         screen_size_{getScreenSize()}
         left_pain_mode_{left_pain_mode.toLowerCase()}
         main_view_mode_{main_view_mode.toLowerCase()}
         {draggedCard ? 'dragging_card' : ''}
         "
  on:touchmove={(ev) => draggedCard && cardControlEventHandlers.onCardDragging(ev, "Overlay")}
  on:mousemove={(ev) => draggedCard && cardControlEventHandlers.onCardDragging(ev, "Overlay")}
>
  <div class="deck_editor_header"></div>
  <div class="deck_editor_body">
    <div class="deck_editor_body_left">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <div
        role="contentinfo"
        class="deck_editor_search_box"
        on:focusin={() => {
          left_pain_mode = "SearchCondition";
          main_view_mode = "SearchCondition";
        }}
        on:click={() => {
          left_pain_mode = "SearchCondition";
          main_view_mode = "SearchCondition";
        }}
      >
        <div class="deck_editor_search_box_header">
          <div><button class="deck_editor_search_box_title" on:click={allResetSearchCondition}>検索条件</button></div>
          <div class="deck_editor_sort_setting_container">
            {#each searchCondition.sort as sortSettingItem}
              <button
                class="deck_editor_sort_setting_item {sortSettingItem.order} priority_{sortSettingItem.priority}"
                on:click={() => {
                  searchCondition.sort.forEach((item) => item.priority++);
                  sortSettingItem.order = sortSettingItem.order === "asc" ? "desc" : "asc";
                  sortSettingItem.priority = 1;
                }}
              >
                {cardSortKeyDic[sortSettingItem.key]}
                {sortSettingItem.order === "asc" ? "▲" : "▼"}
              </button>
            {/each}
          </div>
        </div>
        <div class="deck_editor_search_box_body">
          <div class="deck_editor_search_box_row">
            <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["name"])}>名称</button></div>
            <div>
              <input type="text" bind:value={searchCondition.name} style="width:100%" placeholder="※ルビには対応していません" />
            </div>
          </div>
          <div class="deck_editor_search_box_row card_kind">
            <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["deckCardKinds"])}>種類</button></div>
            <div>
              {#each deckCardKinds as key}
                <label>
                  <input type="checkbox" class="search_condition" value={key} bind:group={searchCondition.deckCardKinds} />
                  {deckCardKindDic[key]}
                </label>
              {/each}
            </div>
          </div>
          {#if searchCondition.deckCardKinds.includes("ExtraMonster")}
            <div class="deck_editor_search_box_row monster_ex_categories" transition:slide={{ delay: 0, duration: 100 }}>
              <div>
                <button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["exMonsterCategories"])}>エクストラ</button>
              </div>
              <div>
                {#each exMonsterCategories as key}
                  <label>
                    <input type="checkbox" class="search_condition" value={key} bind:group={searchCondition.exMonsterCategories} />
                    {monsterCategoryEmojiDic[key]}{monsterCategoryDic[key]}
                  </label>
                {/each}
              </div>
            </div>
          {/if}
          {#if searchCondition.deckCardKinds.includes("Monster") || searchCondition.deckCardKinds.includes("ExtraMonster")}
            <div class="deck_editor_search_box_row monster_categories" transition:slide={{ delay: 0, duration: 100 }}>
              <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["monsterCategories"])}>モンスター</button></div>
              <div>
                {#each monsterCategories.filter((cat) => !(exMonsterCategories as Readonly<string[]>).includes(cat)) as key}
                  <label>
                    <input type="checkbox" class="search_condition" value={key} bind:group={searchCondition.monsterCategories} />
                    {monsterCategoryEmojiDic[key]}{monsterCategoryDic[key]}
                  </label>
                {/each}
              </div>
            </div>
            <div class="deck_editor_search_box_row monster_attributes" transition:slide={{ delay: 0, duration: 100 }}>
              <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["monsterAttributes"])}>属性</button></div>
              <div>
                {#each monsterAttributes as key}
                  <label>
                    <input type="checkbox" class="search_condition" value={key} bind:group={searchCondition.monsterAttributes} />
                    <div style="display: inline-block;" class="monster_attr {key}"></div>
                    {monsterAttributeDic[key]}
                  </label>
                {/each}
              </div>
            </div>
            <div class="deck_editor_search_box_row" transition:slide={{ delay: 0, duration: 100 }}>
              <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["monsterTypes"])}>種族</button></div>
              <div>
                {#each monsterTypes as key}
                  <label on:dblclick={(ev) => ondblclick(ev, "monsterTypes", key)}>
                    <input type="checkbox" class="search_condition" value={key} bind:group={searchCondition.monsterTypes} />
                    {monsterTypeEmojiDic[key]}
                    {monsterTypeDic[key]}
                  </label>
                {/each}
              </div>
            </div>
            <div class="deck_editor_search_box_row" transition:slide={{ delay: 0, duration: 100 }}>
              <div>
                <button
                  class="search_condition_title black_button"
                  on:click={() =>
                    onResetSearchCondition([
                      "starLowerBound",
                      "starUpperBound",
                      "atkLowerBound",
                      "atkUpperBound",
                      "defLowerBound",
                      "defUpperBound",
                      "atkPlusDef",
                    ])}>星攻守</button
                >
              </div>
              <div>
                <div class="star_range">
                  <span>星</span>
                  <input type="number" min="0" max="13" bind:value={searchCondition.starLowerBound} />
                  <span>～</span>
                  <input type="number" min="0" max="13" bind:value={searchCondition.starUpperBound} />
                </div>
                <div class="atk_range">
                  <span>攻</span>
                  <input type="number" min="0" max="5000" step="100" bind:value={searchCondition.atkLowerBound} />
                  <span>～</span>
                  <input type="number" min="0" max="5000" step="100" bind:value={searchCondition.atkUpperBound} />
                </div>
                <div class="def_range">
                  <span>守</span>
                  <input type="number" min="0" max="5000" step="100" bind:value={searchCondition.defLowerBound} />
                  <span>～</span>
                  <input type="number" min="0" max="5000" step="100" bind:value={searchCondition.defUpperBound} />
                </div>
                <div class="atk_plus_def">
                  <span>攻+守</span>
                  <input type="number" min="0" max="10000" step="100" bind:value={searchCondition.atkPlusDef} />
                </div>
              </div>
            </div>
          {/if}
          {#if searchCondition.deckCardKinds.includes("Spell")}
            <div class="deck_editor_search_box_row" transition:slide={{ delay: 0, duration: 100 }}>
              <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["spellCategories"])}>魔法</button></div>
              <div>
                {#each spellCategories.filter((sc) => sc !== "PendulumScale") as key}
                  <label>
                    <input type="checkbox" class="search_condition" value={key} bind:group={searchCondition.spellCategories} />
                    {spellCategoryDic[key]}
                  </label>
                {/each}
              </div>
            </div>
          {/if}
          {#if searchCondition.deckCardKinds.includes("Trap")}
            <div class="deck_editor_search_box_row" transition:slide={{ delay: 0, duration: 100 }}>
              <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["trapCategories"])}>罠</button></div>
              <div>
                {#each trapCategories as key}
                  <label>
                    <input type="checkbox" class="search_condition" value={key} bind:group={searchCondition.trapCategories} />
                    {trapCategoryDic[key]}
                  </label>
                {/each}
              </div>
            </div>
          {/if}
          <div class="deck_editor_search_box_row" transition:slide={{ delay: 0, duration: 100 }}>
            <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["others"])}>その他</button></div>
            <div>
              {#each [{ key: "test", text: "テスト用カード" }, { key: "oldVersion", text: "エラッタ前カード" }, { key: "implemented", text: "未実装カード" }] as item}
                <label>
                  <input type="checkbox" class="search_condition" value={item.key} bind:group={searchCondition.others} />
                  {item.text}
                </label>
              {/each}
            </div>
          </div>
        </div>
      </div>
      {#if left_pain_mode === "CardDetail" && selectedCardInfo}
        <div class="deck_editor_card_detail">
          <DeckEditorCardDetail cardInfo={selectedCardInfo} {onAttention} {cardControlEventHandlers} deckCardTree={tmpDeck.cardTree} />
        </div>
      {/if}
    </div>
    <div class="deck_editor_body_center">
      <div class="deck_editor_body_center_body">
        {#await cardDefinitionsPrms}
          <div>カード情報読込中</div>
        {:then cardInfo}
          <DeckEditorCardList
            mode="List"
            allCardTree={cardInfo.tree}
            {onAttention}
            {searchCondition}
            bind:deckCardTree={tmpDeck.cardTree}
            {cardControlEventHandlers}
          />
        {/await}
      </div>
    </div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="deck_editor_body_right"
      on:click={() => {
        main_view_mode = "DeckEdit";
      }}
      on:focusin={() => {
        main_view_mode = "DeckEdit";
      }}
    >
      {#if main_view_mode === "DeckEdit" || getScreenSize() === "wide"}
        {#await deckInfosPromise}
          <div>デッキ情報読込中</div>
        {:then deckInfos}
          <div class="deck_editor_body_right_header">
            <div class="deck_editor_body_right_header_row">
              <div>編集対象</div>
              <div>
                <select style="width:100%" bind:value={selectedId} on:change={onSelectDeckChange}>
                  {#each deckInfos as deckInfo}
                    <option value={deckInfo.id}>{deckInfo.name}</option>
                  {/each}
                </select>
              </div>
            </div>
            <div class="deck_editor_body_right_header_row">
              <div>新規名称</div>
              <div>
                <input type="text" style="width:100%" bind:value={tmpDeck.name} />
              </div>
            </div>
            <div class="deck_editor_body_right_header_row"></div>
            <div class="deck_editor_body_right_header_row">
              <div>基本操作</div>
              <div><button class="white_button" on:click={onSaveDeckClick}>デッキを保存</button></div>
              <div><button class="white_button" on:click={onCopyDeckClick}>デッキを複製</button></div>
              <div><button class="white_button" on:click={onDeleteDeckClick} title="shiftキー押下で確認メッセージスキップ">デッキを削除</button></div>
            </div>
            <div class="deck_editor_body_right_header_row">
              <div>DL/UL</div>
              {#await getSelectedDeck()}
                <div></div>
              {:then deckInfo}
                <div><a class="white_button" href={DeckInfo.convertToObjectURL([deckInfo])} download="SVS_DeckInfos.json">ダウンロード</a></div>
              {/await}
              {#await deckInfosObjectURLPromise}
                <div></div>
              {:then url}
                <div><a class="white_button" href={url} download="SVS_DeckInfos.json">ダウンロード(一括)</a></div>
              {/await}
              <div><button class="white_button" on:click={onUploadClick}>アップロード</button></div>
            </div>
          </div>
          <div class="deck_editor_body_right_body {canDropToDeck ? 'can_drop' : ''}">
            <DeckEditorCardList
              mode="Deck"
              allCardTree={{ ExtraMonster: [], Monster: [], Spell: [], Trap: [] }}
              bind:deckCardTree={tmpDeck.cardTree}
              {onAttention}
              {cardControlEventHandlers}
            />
          </div>
        {/await}
      {:else}
        <div class="deck_editor_body_right_dummy"></div>
      {/if}
    </div>
    <!-- TODO 終了タグの位置を直すと半角スペースが入るので、治す
               
              <textarea class="deck_editor_card_list" rows="90" cols="50"
          >{deckInfo.cardNames
            .map((cardName) => cardInfoDic[cardName])
            .toSorted(cardSorter)
            .map((info) => info.name)
            .join("\n")
            .trim()}</textarea
        >
            
        -->
  </div>
  <div class="footer"></div>
</div>

{#if draggedCard}
  <div
    style="position: fixed;
          top:{draggedCard.pos.clientY}px;
          left:{draggedCard.pos.clientX}px;
          z-index:3; 
          filter: opacity(0.8);
        	transform: translateX(-50%) translateY(-50%);"
  >
    <DeckEditorCard mode="Dragging" cardInfo={draggedCard.cardInfo} {onAttention} {cardControlEventHandlers} />
  </div>
{/if}
<DeckEditorModalContainer {modalController} />

<style>
  .deck_editor {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 2rem;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    background-color: thistle;
    border-radius: 1.2rem;
  }
  .deck_editor.dragging_card::before {
    content: "";
    position: absolute;
    background-color: slategray;
    height: 100%;
    width: 100%;
    filter: opacity(0.5);
    z-index: 1;
    border-radius: 1.2rem;
    transition: 1s;
  }

  .deck_editor_body {
    display: flex;
    height: 1rem;
    flex-grow: 1;
    min-width: 50rem;
  }
  .deck_editor_body > div {
    width: 1rem;
    display: flex;
    flex-direction: column;
    text-align: left;
    margin: 0.8rem;
    transition: 0.5s;
  }
  .deck_editor_body_left {
    min-width: 40%;
    flex-grow: 1;
  }

  .deck_editor_body_center {
    min-width: 26%;
    flex-grow: 0;
    display: flex;
  }
  .deck_editor_body_center_body {
    flex-grow: 1;
  }

  .deck_editor_body_right {
    min-width: 26%;
    flex-grow: 0;
    display: flex;
  }
  .deck_editor_body_right_body {
    flex-grow: 1;
    position: relative;
    z-index: 2;
  }
  .deck_editor_body_right_dummy {
    border-radius: 1rem;
    height: 100%;
    background: repeating-linear-gradient(-45deg, wheat, wheat 4px, blanchedalmond 3px, blanchedalmond 8px);
    position: relative;
    z-index: 2;
  }
  .deck_editor_body_right_body.can_drop::after {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    border-style: dashed;
    border-color: red;
    border-width: 2px;
  }

  .deck_editor_body_left > div {
    flex-grow: 1;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }

  .deck_editor_search_box {
    display: flex;
    flex-direction: column;
  }
  .deck_editor_search_box_title {
    display: flex;
    align-items: center;
    margin-left: 0.1rem;
    padding: 0.4rem 0.7rem;
    background-color: #f2f2f2;
    color: #333333;
    font-size: 1.2rem;
    font-weight: bolder;
  }
  .deck_editor_search_box_title:hover {
    filter: invert();
  }
  .deck_editor_search_box_title::before {
    display: inline-block;
    width: 5px;
    height: 1.5rem;
    margin-right: 0.5rem;
    background-color: slategray;
    content: "";
  }
  .deck_editor_sort_setting_container {
    display: flex;
    height: 100%;
    vertical-align: bottom;
  }
  .deck_editor_sort_setting_item {
    display: inline-block;
    height: 70%;
    min-height: max-content;
    margin: auto 0.3rem;
    padding: 0 0.5rem;
    border-radius: 0.8rem;
    background-color: blue;
    color: azure;
  }
  .deck_editor_sort_setting_item.desc {
    background-color: red;
  }
  .deck_editor_sort_setting_item.priority_1 {
    border-width: 2px;
    border-color: white;
    border-style: dotted;
  }

  .deck_editor_search_box_body {
    overflow-y: auto;
  }
  .left_pain_mode_carddetail .deck_editor_search_box {
    min-height: 10rem;
    flex-grow: 1;
  }

  .deck_editor_search_box_header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: burlywood;
    border-radius: 0.5rem;
    padding: 0.2rem;
  }
  .black_button {
    width: 100%;
    border: 2px solid #000;
    border-radius: 0;
    background: #fff;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    padding: 0.1rem 0rem 0.1rem 0.5rem;
  }
  .black_button:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    content: "";
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    background: #000;
  }

  .black_button:hover {
    color: #fff;
    background: #000;
  }

  .black_button:hover:before {
    background: #fff;
  }
  .white_button {
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

  .deck_editor_search_box_row {
    display: flex;
    flex-direction: row;
    background-color: whitesmoke;
    border-radius: 0.5rem;
    padding: 0.2rem;
    margin: 0.4rem 1rem 0.4rem 0.4rem;
    transition: 0.1s;
  }
  .deck_editor_search_box_row > div:first-child {
    margin: auto 0rem;
    text-wrap-mode: nowrap;
    min-width: 5.5em;
  }
  .deck_editor_search_box_row > div:last-child {
    flex-grow: 1;
    padding: 0rem 0.4rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .deck_editor_body_right_header {
    display: flex;
    flex-direction: column;
    font-size: 0.89rem;
    background-color: cornsilk;
    padding: 0.2rem;
    margin: 0.3rem 0rem;
  }
  .deck_editor_body_right_header_row {
    display: flex;
    flex-direction: row;
    margin: 0.2rem;
  }
  .deck_editor_body_right_header_row > div {
    flex-grow: 1;
  }
  .deck_editor_body_right_header_row > div:first-child {
    margin: auto 0rem;
    text-wrap-mode: nowrap;
    min-width: 5em;
    flex-grow: 0;
  }
  .white_button {
    background-color: #ffffff;
    display: inline-block;
    padding: 0em 1em;
    text-decoration: none;
    color: #67c5ff;
    border: solid 0.2rem #67c5ff;
    border-radius: 3px;
    transition: 0.4s;
    margin: 0.1rem 0.3rem;
    text-wrap-mode: nowrap;
    line-height: 1.3;
  }

  .white_button:hover {
    background: #67c5ff;
    color: white;
  }
  .footer {
    position: absolute;
    bottom: 0.2rem;
    left: 0.8rem;
  }
  .deck_editor_search_box_row input[type="number"],
  .deck_editor_search_box_row input[type="text"] {
    font-size: max(0.8rem 16px);
  }
  .deck_editor_search_box_row .star_range input[type="number"] {
    width: 3em;
  }
  .deck_editor_search_box_row .def_range input[type="number"],
  .deck_editor_search_box_row .atk_range input[type="number"] {
    width: 4em;
  }
  .deck_editor_search_box_row .atk_plus_def input[type="number"] {
    width: 5em;
  }
  input[type="checkbox"].search_condition {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    position: absolute;
    width: 0px;
    height: 0px;
  }
  label:has(input[type="checkbox"].search_condition) {
    border-radius: 4rem;
    margin: 0.4rem;
    padding: 0 1em;
    background-color: #6c757d;
    color: #f8f9fa;
    transition: all 0.3s ease;
    border-color: darkgray;
    border-width: 1px;
    border-style: solid;
  }
  .card_kind label:has(input[type="checkbox"].search_condition) {
    padding: 0 2em;
  }
  .card_kind label:has(input[type="checkbox"][value="ExtraMonster"].search_condition:checked) {
    background-color: mediumblue;
    color: white;
  }
  .card_kind label:has(input[type="checkbox"][value="Monster"].search_condition:checked) {
    background-color: chocolate;
    color: white;
  }
  .card_kind label:has(input[type="checkbox"][value="Spell"].search_condition:checked) {
    background-color: forestgreen;
    color: white;
  }
  .card_kind label:has(input[type="checkbox"][value="Trap"].search_condition:checked) {
    background-color: orchid;
    color: white;
  }
  .monster_ex_categories label:has(input[type="checkbox"][value="Fusion"].search_condition:checked) {
    background-color: mediumorchid;
    color: white;
  }
  .monster_ex_categories label:has(input[type="checkbox"][value="Syncro"].search_condition:checked) {
    background-color: snow;
    color: black;
  }
  .monster_ex_categories label:has(input[type="checkbox"][value="Xyz"].search_condition:checked) {
    background-color: black;
    color: white;
  }
  .monster_ex_categories label:has(input[type="checkbox"][value="Link"].search_condition:checked) {
    background-color: mediumblue;
    color: white;
  }
  .monster_attributes label:has(input[type="checkbox"][value="Light"].search_condition:checked) {
    background-color: yellow;
    color: black;
  }
  .monster_attributes label:has(input[type="checkbox"][value="Dark"].search_condition:checked) {
    background-color: indigo;
    color: white;
  }
  .monster_attributes label:has(input[type="checkbox"][value="Earth"].search_condition:checked) {
    background-color: brown;
    color: white;
  }
  .monster_attributes label:has(input[type="checkbox"][value="Water"].search_condition:checked) {
    background-color: aqua;
    color: black;
  }
  .monster_attributes label:has(input[type="checkbox"][value="Fire"].search_condition:checked) {
    background-color: crimson;
    color: white;
  }
  .monster_attributes label:has(input[type="checkbox"][value="Wind"].search_condition:checked) {
    background-color: springgreen;
    color: black;
  }
  .monster_attributes label:has(input[type="checkbox"][value="Divine"].search_condition:checked) {
    background-color: blanchedalmond;
    color: black;
  }
  label:has(input[type="checkbox"].search_condition:checked) {
    border-color: #007bff;
    background-color: #f8f9fa;
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
    color: black;
    border-style: none;
    font-weight: bolder;
  }
  .deck_editor_body_right_header_row input[type="text"] {
    font-size: max(0.8rem 16px);
  }
  .deck_editor_body_right_header_row select {
    font-size: 0.8rem;
  }
  .deck_editor_body_right_header_row > div {
    margin: 0rem 0rem;
    padding: 0rem 0rem;
  }
  .deck_editor_body_right_header_row button {
    padding: 0rem 0.3rem;
  }

  .screen_size_compact.main_view_mode_searchcondition .deck_editor_body_left * {
    font-size: max(1.5rem 16px) !important;
  }
  .screen_size_compact.main_view_mode_searchcondition .deck_editor_body_right {
    min-width: 5%;
    flex-grow: 0;
  }
</style>

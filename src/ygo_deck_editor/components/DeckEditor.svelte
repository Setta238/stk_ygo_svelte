<script lang="ts" module>
  export type SearchCondition = {
    name: string;
    cardKinds: TCardKind[];
    monsterCategories: TMonsterCategory[];
    monsterAttributes: TMonsterAttribute[];
    monsterTypes: TMonsterType[];
    spellCategories: TSpellCategory[];
    trapCategories: TTrapCategory[];
    atkLowerBound?: number;
    atkUpperBound?: number;
    defLowerBound?: number;
    defUpperBound?: number;
    atkPlusDef?: number;
    others: ("test" | "oldVersion" | "implemented")[];
  };
</script>

<script lang="ts">
  import { cardDefinitionsPrms, loadTextData } from "@ygo/class/CardInfo";
  import { DeckInfo } from "@ygo/class/DeckInfo";
  import DeckEditorCardList from "./DeckEditorCardList.svelte";
  import DeckEditiorCardDetail from "./DeckEditiorCardDetail.svelte";
  import {
    cardKindDic,
    cardKinds,
    exMonsterCategories,
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
    type TCardKind,
    type TMonsterAttribute,
    type TMonsterCategory,
    type TMonsterType,
    type TSpellCategory,
    type TTrapCategory,
  } from "@ygo/class/YgoTypes";
  import {} from "@stk_utils/funcs/StkDateUtils";
  import { slide } from "svelte/transition";
  import DeckEditorModalContainer, { DeckEditorModalControllerFactory } from "@ygo_deck_editor/components_modal/DeckEditorModalContainer.svelte";
  const modalController = DeckEditorModalControllerFactory.createModalController({
    onDragStart: { append: () => {}, remove: () => {} },
    onDragEnd: { append: () => {}, remove: () => {} },
  });
  const searchConditionDefaultValues: SearchCondition = {
    name: "",
    cardKinds: cardKinds.filter((kind) => kind !== "XyzMaterial"),
    monsterCategories: [...monsterCategories],
    monsterAttributes: [...monsterAttributes],
    monsterTypes: [...monsterTypes],
    spellCategories: [...spellCategories],
    trapCategories: [...trapCategories],
    atkLowerBound: 0,
    atkUpperBound: 5000,
    defLowerBound: 0,
    defUpperBound: 5000,
    atkPlusDef: undefined,
    others: ["test", "oldVersion", "implemented"],
  };

  const searchCondition = structuredClone(searchConditionDefaultValues);
  searchCondition.others = ["oldVersion"];

  let mode: "SearchCondition" | "CardDetail" = "SearchCondition";

  const onClearSearchConditionClick = async () => {
    searchCondition.name = "";
    searchCondition.cardKinds = [];
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
      cardInfos: deckInfo.cardNames
        .map((name) => {
          const cardInfo = cardDefinitions.getCardInfo(name);
          if (cardInfo === undefined) {
            console.error(name);
          }
          return cardInfo;
        })
        .filter((i) => i !== undefined),
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
    cardInfos: [] as CardInfoJson[],
  };

  let cardInfo: CardInfoJson | undefined = undefined;
  let latestAttentionCardId = 0;

  const onAttention = (_cardInfo: CardInfoJson) => {
    mode = "CardDetail";
    if (_cardInfo.cardId !== undefined && !_cardInfo.description && !_cardInfo.pendulumDescription) {
      latestAttentionCardId = _cardInfo.cardId;
      loadTextData([_cardInfo.cardId]).then(() => {
        if (_cardInfo.cardId === latestAttentionCardId) {
          cardInfo = _cardInfo;
        }
      });
    }
    cardInfo = _cardInfo;
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
      cardNames: tmpDeck.cardInfos.map((info) => info.name),
      lastUsedAt: new Date(),
    });
    reloadAllDeckInfo();
  };
  const onCopyDeckClick = async () => {
    const newDeck = await DeckInfo.createNewDeck(
      `デッキ_${new Date().formatToYYYYMMDD_HHMMSS("", "", "")}`,
      `コピー日時：${new Date().formatToYYYYMMDD_HHMMSS("-", " ", ":")}`,
      tmpDeck.cardInfos.map((info) => info.name)
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
</script>

<div class="deck_editor">
  <div class="deck_editor_header"></div>
  <div class="deck_editor_body">
    <div class="deck_editor_body_left">
      <div role="contentinfo" class="deck_editor_search_box {mode === 'SearchCondition' ? '' : 'minimum'}" on:mouseenter={() => (mode = "SearchCondition")}>
        <div class="deck_editor_search_box_header">
          <div>検索条件</div>
          <div><button class="white_button" on:click={onClearSearchConditionClick}>条件クリア</button></div>
        </div>
        <div class="deck_editor_search_box_row">
          <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["name"])}>名称</button></div>
          <div>
            <input type="text" bind:value={searchCondition.name} style="width:70%" />
            <span> ※ルビには対応していません </span>
          </div>
        </div>
        <div class="deck_editor_search_box_row">
          <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["cardKinds"])}>種類</button></div>
          <div>
            {#each cardKinds.filter((kind) => kind !== "XyzMaterial") as key}
              <label>
                <input type="checkbox" value={key} bind:group={searchCondition.cardKinds} />
                {cardKindDic[key]}
              </label>
            {/each}
          </div>
        </div>
        {#if searchCondition.cardKinds.includes("Monster")}
          <div class="deck_editor_search_box_row" transition:slide={{ delay: 0, duration: 100 }}>
            <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["monsterCategories"])}>モンスター</button></div>
            <div>
              {#each monsterCategories as key}
                <label>
                  <input type="checkbox" value={key} bind:group={searchCondition.monsterCategories} />
                  {monsterCategoryEmojiDic[key]}{monsterCategoryDic[key]}
                </label>
              {/each}
            </div>
          </div>
          <div class="deck_editor_search_box_row" transition:slide={{ delay: 0, duration: 100 }}>
            <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["monsterAttributes"])}>属性</button></div>
            <div>
              {#each monsterAttributes as key}
                <label>
                  <input type="checkbox" value={key} bind:group={searchCondition.monsterAttributes} />
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
                  <input type="checkbox" value={key} bind:group={searchCondition.monsterTypes} />
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
                on:click={() => onResetSearchCondition(["atkLowerBound", "atkUpperBound", "defLowerBound", "defUpperBound"])}>攻守</button
              >
            </div>
            <div>
              <div>
                <span>攻</span>
                <input type="number" min="0" max="5000" step="100" bind:value={searchCondition.atkLowerBound} />
                <span>～</span>
                <input type="number" min="0" max="5000" step="100" bind:value={searchCondition.atkUpperBound} />
              </div>
              <div>
                <span>守</span>
                <input type="number" min="0" max="5000" step="100" bind:value={searchCondition.defLowerBound} />
                <span>～</span>
                <input type="number" min="0" max="5000" step="100" bind:value={searchCondition.defUpperBound} />
              </div>
              <div>
                <span>攻+守</span>
                <input type="number" min="0" max="5000" step="100" bind:value={searchCondition.atkPlusDef} />
              </div>
            </div>
          </div>
        {/if}
        {#if searchCondition.cardKinds.includes("Spell")}
          <div class="deck_editor_search_box_row" transition:slide={{ delay: 0, duration: 100 }}>
            <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["spellCategories"])}>魔法</button></div>
            <div>
              {#each spellCategories as key}
                <label>
                  <input type="checkbox" value={key} bind:group={searchCondition.spellCategories} />
                  {spellCategoryDic[key]}
                </label>
              {/each}
            </div>
          </div>
        {/if}
        {#if searchCondition.cardKinds.includes("Trap")}
          <div class="deck_editor_search_box_row" transition:slide={{ delay: 0, duration: 100 }}>
            <div><button class="search_condition_title black_button" on:click={() => onResetSearchCondition(["trapCategories"])}>罠</button></div>
            <div>
              {#each trapCategories as key}
                <label>
                  <input type="checkbox" value={key} bind:group={searchCondition.trapCategories} />
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
                <input type="checkbox" value={item.key} bind:group={searchCondition.others} />
                {item.text}
              </label>
            {/each}
          </div>
        </div>
      </div>
      <DeckEditiorCardDetail {cardInfo} />
    </div>
    <div class="deck_editor_body_center">
      {#await cardDefinitionsPrms}
        <div>カード情報読込中</div>
      {:then cardInfo}
        <DeckEditorCardList mode="List" allCardInfos={Object.values(cardInfo.dic)} {onAttention} {searchCondition} bind:deckCardInfos={tmpDeck.cardInfos} />
      {/await}
    </div>
    <div class="deck_editor_body_right">
      {#await deckInfosPromise}
        <div>デッキ情報読込中</div>
      {:then deckInfos}
        <div class="deck_editor_body_right_header">
          <div class="deck_editor_body_right_header_row">
            <div>
              編集対象
              <select bind:value={selectedId} on:change={onSelectDeckChange}>
                {#each deckInfos as deckInfo}
                  <option value={deckInfo.id}>{deckInfo.name}</option>
                {/each}
              </select>
            </div>
            <div></div>
            <div>
              新規名称
              <input type="text" bind:value={tmpDeck.name} />
            </div>
          </div>
          <div class="deck_editor_body_right_header_row"></div>
          <div class="deck_editor_body_right_header_row">
            <div>基本操作</div>
            <div><button class="white_button" on:click={onSaveDeckClick}>デッキを保存</button></div>
            <div></div>
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
        <DeckEditorCardList mode="Deck" allCardInfos={[]} bind:deckCardInfos={tmpDeck.cardInfos} {onAttention} />
      {/await}
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
  <div class="footer">
    {#await cardDefinitionsPrms}
      読み込み中
    {:then status}
      実装済カード{status.definitionCount + status.nonDefinitionCount}枚（内、効果のないモンスター{status.nonDefinitionCount}枚）
    {/await}
  </div>
</div>
<DeckEditorModalContainer {modalController} />

<style>
  .deck_editor {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 95vh;
    width: 95vw;
    padding: 1rem;
    background-color: thistle;
  }

  .deck_editor_body {
    display: flex;
    height: 1rem;
    flex-grow: 1;
    min-width: 50rem;
  }
  .deck_editor_body > div {
    width: 1rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    text-align: left;
    margin: 0.8rem;
  }
  .deck_editor_body_left {
    min-width: 40%;
  }
  .deck_editor_body_left > div {
    flex-grow: 1;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  }
  .deck_editor_search_box_title {
    background-color: transparent;
    display: block;
    pointer-events: none;
  }
  .deck_editor_search_box.minimum .deck_editor_search_box_title {
    pointer-events: initial;
  }
  .deck_editor_search_box.minimum {
    height: 10rem;
    flex-grow: 0;
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
    border: 2px solid #000;
    border-radius: 0;
    background: #fff;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    width: 90%;
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
    margin: 0.4rem;
    transition: 0.1s;
  }
  .deck_editor_search_box_row > div:first-child {
    margin: auto 0rem;
    text-wrap-mode: nowrap;
    min-width: 5rem;
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
    flex-wrap: wrap;
    margin: 0.2rem;
  }
  .deck_editor_body_right_header_row > div {
    flex-grow: 1;
  }
  .deck_editor_body_right_header_row > div:first-child {
    margin: auto 0rem;
    text-wrap-mode: nowrap;
    min-width: 5rem;
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
</style>

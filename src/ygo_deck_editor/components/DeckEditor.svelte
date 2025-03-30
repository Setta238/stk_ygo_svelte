<script lang="ts">
  import { cardInfoDic } from "@ygo/class/CardInfo";
  import { DeckInfo, type IDeckInfo } from "@ygo/class/DeckInfo";
  import { type TDuelEntityFace } from "@ygo_duel/class/DuelEntity";
  import DeckEditorCardList from "./DeckEditorCardList.svelte";
  import DuelCardDetail from "@ygo_duel_view/components/DuelCardDetail.svelte";
  import DeckEditiorCardDetail from "./DeckEditiorCardDetail.svelte";
  import {
    cardKindDic,
    cardKinds,
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
    type TMonsterCategory,
    type TSpellCategory,
    type TTrapCategory,
  } from "@ygo/class/YgoTypes";
  import {} from "@stk_utils/funcs/StkDateUtils";

  const onClearSearchConditionClick = async () => {
    seachCondition.name = "";
    seachCondition.cardKinds = [];
    seachCondition.monsterCategories = [];
    seachCondition.monsterAttributes = [];
    seachCondition.monsterTypes = [];
    seachCondition.spellCategories = [];
    seachCondition.trapCategories = [];
    seachCondition.isForTest = false;
  };

  const onSelectDeckChange = async () => {
    const deckInfos = await deckInfosPromise;
    const deckInfo = deckInfos.find((deckInfo) => deckInfo.id === selectedId);
    if (!deckInfo) {
      return;
    }
    tmpDeck = { ...deckInfo, cardInfos: deckInfo.cardNames.map((name) => cardInfoDic[name]) };
  };

  const initDeck = () =>
    DeckInfo.getAllDeckInfo().then((deckInfos) => {
      deckInfos.forEach((deckInfo) => console.log(deckInfo.id, deckInfo.lastUsedAt, deckInfo.lastUsedAt.getTime()));
      console.log(Math.max(...deckInfos.map((deckInfo) => deckInfo.lastUsedAt.getTime())));
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

  let cardInfo: CardInfoJson = cardInfoDic["ゾンビーノ"];

  const seachCondition = {
    name: "" as string,
    cardKinds: [...cardKinds] as TCardKind[],
    monsterCategories: [...monsterCategories].filter((cat) => cat !== "Normal" && cat !== "Token") as TMonsterCategory[],
    monsterAttributes: [...monsterAttributes],
    monsterTypes: [...monsterTypes],
    spellCategories: [...spellCategories] as TSpellCategory[],
    trapCategories: [...trapCategories] as TTrapCategory[],
    isForTest: false,
  };

  const getCardList = () => {
    return Object.values(cardInfoDic).filter((cardInfo) => {
      if (!seachCondition.cardKinds.includes(cardInfo.kind)) {
        return false;
      }
      if (seachCondition.name.trim().length && !cardInfo.name.includes(seachCondition.name)) {
        return false;
      }

      if (cardInfo.isForTest && !seachCondition.isForTest) {
        return false;
      }

      if (cardInfo.kind === "Monster") {
        if (cardInfo.attributes && !seachCondition.monsterAttributes.union(cardInfo.attributes).length) {
          return false;
        }
        if (cardInfo.types && !seachCondition.monsterTypes.union(cardInfo.types).length) {
          return false;
        }

        if (!cardInfo.monsterCategories) {
          return false;
        }
        return cardInfo.monsterCategories.union(seachCondition.monsterCategories).length;
      }
      if (cardInfo.kind === "Spell") {
        return cardInfo.spellCategory && seachCondition.spellCategories.includes(cardInfo.spellCategory);
      }
      if (cardInfo.kind === "Trap") {
        return cardInfo.trapCategory && seachCondition.trapCategories.includes(cardInfo.trapCategory);
      }
    });
  };

  const onAttention = (_cardInfo: CardInfoJson) => {
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
</script>

<div class="deck_editor">
  <div class="deck_editor_header"></div>
  <div class="deck_editor_body">
    <div class="deck_editor_body_left">
      <div class="deck_editor_search_box">
        <div class="deck_editor_search_box_header">
          <div>検索条件</div>
          <div><button class="white_button" on:click={onClearSearchConditionClick}>条件クリア</button></div>
        </div>
        <div class="deck_editor_search_box_row">
          <div>名称</div>
          <div>
            <input type="text" bind:value={seachCondition.name} style="width:70%" />※ルビには対応していません
          </div>
        </div>
        <div class="deck_editor_search_box_row">
          <div>種類</div>
          <div>
            {#each cardKinds as key}
              <label>
                <input type="checkbox" value={key} bind:group={seachCondition.cardKinds} />
                {cardKindDic[key]}
              </label>
            {/each}
          </div>
        </div>
        <div class="deck_editor_search_box_row">
          <div>モンスター</div>
          <div>
            {#each monsterCategories as key}
              <label>
                <input type="checkbox" value={key} bind:group={seachCondition.monsterCategories} />
                {monsterCategoryEmojiDic[key]}{monsterCategoryDic[key]}
              </label>
            {/each}
          </div>
        </div>
        <div class="deck_editor_search_box_row">
          <div>属性</div>
          <div>
            {#each monsterAttributes as key}
              <label>
                <input type="checkbox" value={key} bind:group={seachCondition.monsterAttributes} />
                <div style="display: inline-block;" class="monster_attr {key}"></div>
                {monsterAttributeDic[key]}
              </label>
            {/each}
          </div>
        </div>
        <div class="deck_editor_search_box_row">
          <div>種族</div>
          <div>
            {#each monsterTypes as key}
              <label>
                <input type="checkbox" value={key} bind:group={seachCondition.monsterTypes} />
                {monsterTypeEmojiDic[key]}
                {monsterTypeDic[key]}
              </label>
            {/each}
          </div>
        </div>
        <div class="deck_editor_search_box_row">
          <div>魔法</div>
          <div>
            {#each spellCategories as key}
              <label>
                <input type="checkbox" value={key} bind:group={seachCondition.spellCategories} />
                {spellCategoryDic[key]}
              </label>
            {/each}
          </div>
        </div>
        <div class="deck_editor_search_box_row">
          <div>罠</div>
          <div>
            {#each trapCategories as key}
              <label>
                <input type="checkbox" value={key} bind:group={seachCondition.trapCategories} />
                {trapCategoryDic[key]}
              </label>
            {/each}
          </div>
        </div>
        <div class="deck_editor_search_box_row">
          <div>テスト用</div>
          <div>
            <label>
              <input type="checkbox" bind:checked={seachCondition.isForTest} />
              テスト用カードを表示する
            </label>
          </div>
        </div>
      </div>
      <DeckEditiorCardDetail {cardInfo} />
    </div>
    <div class="deck_editor_body_center">
      <DeckEditorCardList mode="List" allCardInfos={getCardList()} {onAttention} bind:deckCardInfos={tmpDeck.cardInfos} />
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
              <div><a class="white_button" href={url} download="SVS_DeckInfos.json">ダウンロード（一括）</a></div>
            {/await}
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
</div>

<style>
  .deck_editor {
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
  .deck_editor_body_left > div {
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
  }
  .deck_editor_search_box_row > div:first-child {
    margin: auto 0rem;
    text-wrap-mode: nowrap;
    min-width: 4rem;
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
    line-height: 1.3;
  }

  .white_button:hover {
    background: #67c5ff;
    color: white;
  }
</style>

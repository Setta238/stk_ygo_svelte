<script lang="ts" module>
  export type DeckUploaderArgs = ModalArgsBase;
  export type DeckUploaderResult = { deckInfos: IDeckInfo[]; replaceAll: boolean };
</script>

<script lang="ts">
  import StkModalWindow from "@stk_utils/components/modal_container/StkModalWindow.svelte";
  import type { EventHolder } from "@stk_utils/components/modal_container/StkModalController";
  import type { ModalArgsBase } from "@stk_utils/components/modal_container/StkModalDefinitionBase";
  import { cardDefinitionsPrms } from "@ygo/class/CardInfo";
  import { DeckInfo, type IDeckInfo } from "@ygo/class/DeckInfo";
  import { exMonsterCategories } from "@ygo/class/YgoTypes";
  export let eventHolder: EventHolder;
  export let args: DeckUploaderArgs;
  export let resolve: (result?: DeckUploaderResult) => void;
  let deckInfosPromise: Promise<IDeckInfo[]> = Promise.resolve([]);

  let jsonFiles: FileList;

  const clearDeckInfos = () => {
    jsonFiles = new DataTransfer().files;
    deckInfosPromise = Promise.resolve([]);
  };

  const onFileDragover = async (ev: DragEvent & { currentTarget: EventTarget & HTMLLabelElement }) => {
    ev.preventDefault();
    console.log("hoge", ev);
  };

  const onFileDrop = async (ev: DragEvent & { currentTarget: EventTarget & HTMLLabelElement }) => {
    ev.preventDefault();
    if (!ev.dataTransfer) {
      return;
    }
    setdeckInfos(ev.dataTransfer.files);
  };

  const onFileSelectorChange = () => {
    setdeckInfos(jsonFiles);
  };

  const setdeckInfos = async (jsonFiles: FileList) => {
    if (!jsonFiles.length) {
      return;
    }

    const errorMessages: string[] = [];
    const deckInfos: IDeckInfo[] = [];
    for (const jsonFile of jsonFiles) {
      try {
        deckInfos.push(...(await DeckInfo.createfromJson(jsonFile)));
      } catch (error) {
        if (error instanceof Error) {
          errorMessages.push(error.message);
        }
      }
    }

    if (errorMessages.length) {
      console.log(...errorMessages);
      return;
    }

    deckInfosPromise = deckInfosPromise.then(() => deckInfos);
  };
  const onFileSelectorCancel = clearDeckInfos;
</script>

<StkModalWindow {eventHolder} {args}>
  <div slot="body" class="modal_body">
    {#await cardDefinitionsPrms then cardDefinitions}
      {#await deckInfosPromise then deckInfos}
        {#if deckInfos.length}
          <ul class="deck_info_list">
            {#each deckInfos as deckInfo}
              <li class="deck_info_list_item">
                <div>{deckInfo.name}</div>
                <div>
                  {deckInfo.cardNames.filter((name) => !cardDefinitions.getCardInfo(name)?.monsterCategories?.union(exMonsterCategories).length).length}
                  /
                  {deckInfo.cardNames.filter((name) => cardDefinitions.getCardInfo(name)?.monsterCategories?.union(exMonsterCategories).length).length}
                </div>
                <div>
                  最終使用日時 ： {deckInfo.lastUsedAt.formatToYYYYMMDD_HHMM("/", " ", ":")}
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <label
            for="file_selector"
            class="upload_area"
            role="region"
            aria-label="ファイルアップロードエリア"
            on:drop={onFileDrop}
            on:dragover={onFileDragover}
          >
            <div class="upload_area_message">ここにファイルをドロップ</div>
            <div class="upload_area_footer">
              <input
                type="file"
                id="file_selector"
                name="file_selector"
                accept=".json"
                multiple
                bind:files={jsonFiles}
                on:change={onFileSelectorChange}
                on:cancel={onFileSelectorCancel}
              />
            </div>
          </label>
        {/if}
      {/await}
    {/await}
  </div>
  <div slot="footer" class="modal_window_footer">
    {#await deckInfosPromise then deckInfos}
      {#if deckInfos.length}
        <button disabled={deckInfos.length === 0} on:click={() => resolve({ deckInfos, replaceAll: false })}>追加</button>
        <button disabled={deckInfos.length === 0} on:click={() => resolve({ deckInfos, replaceAll: true })}>削除して追加</button>
        <button on:click={onFileSelectorCancel}>戻る</button>
      {:else if args.cancelable}
        <button on:click={() => resolve(undefined)}>Cancel</button>
      {/if}
    {/await}
  </div>
</StkModalWindow>

<style>
  .modal_body {
    padding: 0.2rem;
    display: flex;
    flex-direction: column;
    width: 40vw;
  }
  .upload_area {
    height: 20vh;
    max-height: 20vh;
    width: 95%;
    border-style: dotted;
    margin: auto;
    position: relative;
    display: grid;
    place-content: center;
  }
  .upload_area_message {
    font-size: 2rem;
  }
  .upload_area_footer {
    position: absolute;
    display: inline-block;
    margin: auto;
    left: 0px;
    right: 0px;
    bottom: 0.5rem;
  }
  .deck_info_list {
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .deck_info_list_item {
    display: flex;
    flex-direction: row;
    border-bottom: black dashed 1px;
    padding: 0.2rem 0 0 0;
  }
  .deck_info_list_item > div:first-child {
    text-align: left;
    flex-grow: 1;
  }
  .deck_info_list_item > div {
    padding: 0rem 0.5rem;
    min-width: 6rem;
    text-align: center;
  }
  .modal_window_footer button {
    border: 1px solid #000;
    background: #fff;
    font-weight: 700;
    line-height: 1.1;
    display: inline-block;
    padding: 0.3rem 1.1rem;
    cursor: pointer;
    margin: 0.5rem;
  }

  .modal_window_footer button:hover {
    color: #fff;
    background: #000;
  }
  .modal_window_footer button:disabled {
    background: grey;
  }
</style>

<script lang="ts" module>
  export const tblNames = ["TblDeckHeader", "TblDeckDetail", "TblDuelistProfile"] as const;
  export type TTblNames = (typeof tblNames)[number];
  export const currentVersion = 3;
</script>

<script lang="ts">
  import { DeckInfo, sampleDecks } from "@ygo/class/DeckInfo";
  import { DuelistProfile, nonPlayerCharacters } from "@ygo/class/DuelistProfile";
  import { Duel } from "@ygo_duel/class/Duel";
  import DuelDesk from "@ygo_duel_view/components/DuelDesk.svelte";
  import DeckEditor from "@ygo_deck_editor/components/DeckEditor.svelte";
  import { StkIndexedDB } from "@stk_utils/class/StkIndexedDB";

  const idb = new StkIndexedDB<TTblNames>("stk_ygo_svelte", currentVersion, tblNames);

  let duel: Duel | undefined;
  let mode = "None" as "Duel" | "DeckEdit" | "None";

  const userProfilePromise = DuelistProfile.getOrCreateNew(idb);
  let userDecksPromise = DeckInfo.getAllDeckInfo(idb);

  const saveUserProfile = async () => {
    const userProfile = await userProfilePromise;
    userProfile.save();
  };
  const reloadDeckInfos = () => {
    userDecksPromise = DeckInfo.getAllDeckInfo(idb);
  };
  const prepareSampleDeck = async () => {
    const userDecks = await userDecksPromise;
    if (userDecks.length) {
      return;
    }
    await DeckInfo.prepareSampleDeck();
    reloadDeckInfos();
  };
  const onDuelStartClick = async () => {
    await Promise.all([saveUserProfile(), prepareSampleDeck()]);
    duel = new Duel(await userProfilePromise, "Player", (await userDecksPromise)[0], nonPlayerCharacters[0], "NPC", sampleDecks[0]);
  };
  const onEditClick = async () => {
    console.log("hoge");
    await Promise.all([saveUserProfile(), prepareSampleDeck()]);
    mode = "DeckEdit";
  };
  const onDuelistNameKeyPress = async (ev: KeyboardEvent) => {
    await saveUserProfile();

    if (ev.key === "Enter" && !ev.repeat) {
      const userProfile = await userProfilePromise;
      userProfile.save();
    }
  };
  prepareSampleDeck();
</script>

<main>
  {#if duel}
    <DuelDesk {duel} />
  {:else if mode === "DeckEdit"}
    <DeckEditor />
  {:else}
    <div class="app_body">
      {#await userProfilePromise}
        <div>デュエリスト情報の読み込み、もしくは作成中...</div>
      {:then userProfile}
        <div>
          <label for="duelist_name" class="duelist_name">名前：</label>
          <input id="duelist_name" class="duelist_name" type="text" bind:value={userProfile.name} on:keypress={onDuelistNameKeyPress} />
        </div>
        <div>
          <button class="btn" on:click={onDuelStartClick}>duel start!</button>
        </div>
        <div>
          <button class="btn" on:click={onEditClick}>deck edit</button>
        </div>
      {/await}
    </div>
  {/if}
  <div class="screen_info"></div>
</main>

<style>
  main {
    display: flex;
    height: 100%;
    width: fit-content;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image:
      repeating-linear-gradient(-45deg, transparent, transparent 10px, snow 10px, rgba(222, 240, 247, 0.5) 20px),
      repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(182, 239, 247, 0.5) 10px, rgba(240, 230, 247, 0.5) 20px);
  }
  .app_body {
    display: flex;
    flex-direction: column;
  }
  .app_body > div {
    margin: 1rem;
  }
  .screen_info {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
  }
  .duelist_name {
    font-size: 1.4rem;
    text-decoration: none;
  }
  .btn {
    font-size: 1.4rem;
    background-color: #ffffff;
    display: inline-block;
    padding: 0em 1em;
    text-decoration: none;
    color: #67c5ff;
    border: solid 2px #67c5ff;
    border-radius: 3px;
    transition: 0.4s;
    margin: 0px 2px;
  }

  .btn:hover {
    background: #00bcd4;
    color: white;
  }
</style>

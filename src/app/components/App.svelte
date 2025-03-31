<script lang="ts" module>
  export const tblNames = ["TblDeckHeader", "TblDeckDetail", "TblDuelistProfile"] as const;
  export type TTblNames = (typeof tblNames)[number];
  export const currentVersion = 3;
</script>

<script lang="ts">
  import { DeckInfo, sampleDecks } from "@ygo/class/DeckInfo";
  import { DuelistProfile, nonPlayerCharacters } from "@ygo/class/DuelistProfile";
  import { Duel, duelStartModeDic, type TDuelStartMode } from "@ygo_duel/class/Duel";
  import DuelDesk from "@ygo_duel_view/components/DuelDesk.svelte";
  import DeckEditor from "@ygo_deck_editor/components/DeckEditor.svelte";
  import { StkIndexedDB } from "@stk_utils/class/StkIndexedDB";
  import timestampJson from "@stk_utils/json/timestamp.json";
  import { getKeys } from "@stk_utils/funcs/StkObjectUtils";
  import { min } from "@stk_utils/funcs/StkMathUtils";
  const idb = new StkIndexedDB<TTblNames>("stk_ygo_svelte", currentVersion, tblNames);

  let duel: Duel | undefined;
  let mode = "None" as "Duel" | "DeckEdit" | "None";
  let selectedDeckId = 0;
  let selectedNpcId = min(...nonPlayerCharacters.map((npc) => npc.id));
  let startMode: TDuelStartMode = "Random";
  const userProfilePromise = DuelistProfile.getOrCreateNew(idb);
  let userDecksPromise = DeckInfo.getAllDeckInfo(idb).then((deckInfos) => {
    Promise.all(
      deckInfos
        .filter((deckInfo) => !deckInfo.lastUsedAt)
        .map((deckInfo) => {
          deckInfo.saveDeckInfo();
        })
    );
    selectedDeckId = (
      deckInfos.find((deckInfo) => deckInfo.lastUsedAt.getTime() === Math.max(...deckInfos.map((deckInfo) => deckInfo.lastUsedAt.getTime()))) ?? deckInfos[0]
    ).id;
    return deckInfos;
  });

  const getSelectedDeckInfo = async () => {
    let deckInfo = (await userDecksPromise).find((info) => info.id === selectedDeckId);
    if (!deckInfo) {
      deckInfo = (await reloadDeckInfos()).find((info) => info.id === selectedDeckId);
    }
    if (!deckInfo) {
      throw new Error("illegal state");
    }
    return deckInfo;
  };

  const saveUserProfile = async () => {
    const userProfile = await userProfilePromise;
    userProfile.save();
  };
  const reloadDeckInfos = () => {
    userDecksPromise = DeckInfo.getAllDeckInfo(idb).then((deckInfos) => {
      selectedDeckId = (
        deckInfos.find((deckInfo) => deckInfo.lastUsedAt.getTime() === Math.max(...deckInfos.map((deckInfo) => deckInfo.lastUsedAt.getTime()))) ?? deckInfos[0]
      ).id;
      return deckInfos;
    });

    return userDecksPromise;
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
    const selectedDeck = await getSelectedDeckInfo();
    selectedDeck.updateTimestamp();
    const npc = nonPlayerCharacters.find((npc) => npc.id === selectedNpcId);
    let npcDeck = sampleDecks.slice(-1)[0];
    if (!npc) {
      return;
    }
    if (npc.id === -1) {
      npcDeck = sampleDecks.find((info) => info.id === -1) ?? npcDeck;
    }

    console.log(npc);
    duel = new Duel(await userProfilePromise, "Player", await getSelectedDeckInfo(), [], npc, "NPC", npcDeck, [], startMode);
  };
  const onEditClick = async () => {
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
  <div class="link">
    <a href="https://github.com/Setta238/stk_ygo_svelte" target="_blank" rel="noopener noreferrer" title="repository">repository</a>
    <a href="https://x.com/ninja_no" target="_blank" rel="noopener noreferrer" title="repository">X(Twitter)</a>
    <a href="https://posfie.com/@ninja_no/p/Lx7FLj3" target="_blank" rel="noopener noreferrer" title="posfie">posfie(toggeter)</a>
  </div>
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
        {#await userDecksPromise}
          <div>デッキ情報の読み込み、もしくは作成中...</div>
        {:then userDecks}
          <div>
            <label for="deck_selector" class="deck_selector">デッキ：</label>
            <select id="deck_selector" class="deck_selector" bind:value={selectedDeckId}>
              {#each userDecks as userDeck}
                <option value={userDeck.id}>{userDeck.name}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="npc_selector" class="npc_selector">対戦相手：</label>
            <select id="npc_selector" class="npc_selector" bind:value={selectedNpcId}>
              {#each nonPlayerCharacters as npc}
                <option value={npc.id}>{npc.name}</option>
              {/each}
            </select>
            <div>※{nonPlayerCharacters.find((npc) => npc.id === selectedNpcId)?.description}</div>
          </div>
          <div>
            <label for="npc_selector" class="npc_selector">先攻後攻：</label>
            <select id="npc_selector" class="npc_selector" bind:value={startMode}>
              {#each getKeys(duelStartModeDic) as key}
                <option value={key}>{duelStartModeDic[key]}</option>
              {/each}
            </select>
          </div>
          <div>
            <button class="btn" on:click={onDuelStartClick}>duel start!</button>
          </div>
        {/await}
        <div>
          <button class="btn" on:click={onEditClick}>deck edit</button>
        </div>
      {/await}
    </div>
  {/if}
  <div class="debug_info">
    <span>build at: {timestampJson.timestamp}</span>
    <span class="screen_info"></span>
  </div>
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
    background-color: seashell;
    border-style: ridge;
    border-color: black;
    border-width: 0.5rem;
  }
  .app_body > div {
    margin: 1rem;
  }
  .link {
    position: absolute;
    top: 0.3rem;
    left: 1rem;
  }
  .link a {
    margin: 0rem 1rem;
  }
  .debug_info {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
  }
  .duelist_name,
  .deck_selector,
  .npc_selector {
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

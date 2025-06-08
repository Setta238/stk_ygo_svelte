<script lang="ts" module>
  export const tblNames = ["TblDeckHeader", "TblDeckDetail", "TblDuelistProfile"] as const;
  export type TTblNames = (typeof tblNames)[number];
  export const currentVersion = 3;
</script>

<script lang="ts">
  import { DeckInfo, sampleDecks, type IDeckInfo } from "@ygo/class/DeckInfo";
  import { difficulties, DuelistProfile, gameModes, nonPlayerCharacters, type IDuelistProfile, type TGameMode } from "@ygo/class/DuelistProfile";
  import { Duel, duelStartModeDic, type TDuelStartMode } from "@ygo_duel/class/Duel";
  import DuelDesk from "@ygo_duel_view/components/DuelDesk.svelte";
  import DeckEditor from "@ygo_deck_editor/components/DeckEditor.svelte";
  import { StkIndexedDB } from "@stk_utils/class/StkIndexedDB";
  import { getKeys } from "@stk_utils/funcs/StkObjectUtils";
  import { fade, slide } from "svelte/transition";
  import { userAgentInfo } from "@stk_utils/class/StkUserAgentInfo";
  import {} from "@stk_utils/funcs/StkStringUtils";
  import {} from "@stk_utils/funcs/StkArrayUtils";
  import {} from "@stk_utils/funcs/StkDateUtils";
  const idb = new StkIndexedDB<TTblNames>("stk_ygo_svelte", currentVersion, tblNames);

  let innerWidth = 0;
  let innerHeight = 0;
  let duel: Duel | undefined;
  let gameMode: TGameMode = "FtkChallenge";
  let dspMode: "Duel" | "DeckEdit" | "None" = "None";
  let selectedDeckId = 0;
  let npcDescription = "";
  let selectedNpc: IDuelistProfile | undefined = undefined;
  const userProfilePromise = DuelistProfile.getOrCreateNew(idb).then((userProfile) => {
    gameMode = gameModes.includes(userProfile.previousGameMode) ? userProfile.previousGameMode : "FtkChallenge";
    setNpc(userProfile.previousNpcId);
    return userProfile;
  });

  const setDeckId = (deckInfos: DeckInfo[]) => {
    const selectedDeck =
      deckInfos.find((deckInfo) => deckInfo.lastUsedAt.getTime() === Math.max(...deckInfos.map((deckInfo) => deckInfo.lastUsedAt.getTime()))) ?? deckInfos[0];
    selectedDeckId = selectedDeck.id;
    if (gameMode === "FtkChallenge" && selectedDeck.deckType !== "Preset") {
      selectedDeckId = sampleDecks.find((deck) => deck.deckType === "Preset")?.id ?? selectedDeckId;
    }
  };
  let userDecksPromise = DeckInfo.getAllDeckInfo(idb).then((deckInfos) => {
    Promise.all(
      deckInfos
        .filter((deckInfo) => !deckInfo.lastUsedAt)
        .map((deckInfo) => {
          deckInfo.saveDeckInfo();
        })
    );
    setDeckId(deckInfos);
    return deckInfos;
  });

  const getSelectedDeckInfo = async () => {
    const _selectedDeckId = selectedDeckId;
    let deckInfo =
      (await userDecksPromise).find((info) => info.id === _selectedDeckId) ?? (await reloadDeckInfos()).find((info) => info.id === _selectedDeckId);
    if (deckInfo) {
      await deckInfo.updateTimestamp();
    }

    let iDeckInfo: IDeckInfo | undefined = deckInfo;
    if (!iDeckInfo) {
      iDeckInfo = sampleDecks.find((info) => info.id === _selectedDeckId);
    }
    if (!iDeckInfo) {
      throw new Error("illegal state");
    }
    return iDeckInfo;
  };

  const saveUserProfile = async () => {
    const userProfile = await userProfilePromise;
    userProfile.save({ previousGameMode: gameMode });
  };
  const reloadDeckInfos = () => {
    userDecksPromise = DeckInfo.getAllDeckInfo(idb).then((deckInfos) => {
      setDeckId(deckInfos);

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
    const userProfile = await userProfilePromise;
    let npc = nonPlayerCharacters.find((npc) => npc.id === Number.MIN_SAFE_INTEGER) ?? nonPlayerCharacters[0];
    let npcDeck = sampleDecks.find((deck) => deck.id === Number.MIN_SAFE_INTEGER) ?? sampleDecks[0];
    let startMode: TDuelStartMode = "PlayFirst";

    if (gameMode === "FtkChallenge") {
      npc = nonPlayerCharacters.filter((npc) => npc.npcType === "FtkChallenge").find((npc) => npc.difficulty === userProfile.previousDifficulty) ?? npc;
    } else if (gameMode === "Free") {
      npc = nonPlayerCharacters.find((npc) => npc.id === userProfile.previousNpcId) ?? npc;
      npcDeck = sampleDecks.slice(-1)[0];
      startMode = userProfile.previousStartMode;
    }

    if (npc.npcType !== "FtkChallenge" && userProfile.previousNpcDeckId > -1) {
      npcDeck = (await userDecksPromise).find((info) => info.id === userProfile.previousNpcDeckId) ?? npcDeck;
    } else {
      npcDeck = sampleDecks.find((info) => info.id === npc.id) ?? npcDeck;
    }

    duel = new Duel(userProfile, "Player", selectedDeck, [], npc, "NPC", npcDeck, [], startMode);
    duel.onDuelEnd.append(() => {
      duel = duel;
      return "RemoveMe";
    });
  };
  const onEditClick = async () => {
    await Promise.all([saveUserProfile(), prepareSampleDeck()]);
    dspMode = "DeckEdit";
  };
  const onDuelistNameKeyPress = async (ev: KeyboardEvent) => {
    await saveUserProfile();

    if (ev.key === "Enter" && !ev.repeat) {
      const userProfile = await userProfilePromise;
      userProfile.save();
    }
  };
  const onReturnToTopClick = () => {
    userDecksPromise = reloadDeckInfos();
    duel = undefined;
    dspMode = "None";
  };

  let timer = Date.now();

  const onGameModeChange = (mode: TGameMode) => {
    if (Date.now() - timer < 200) {
      return;
    }
    timer = Date.now();
    gameMode = mode;
    reloadDeckInfos();
  };
  const onNpcIdChange = (
    ev: Event & {
      currentTarget: EventTarget & HTMLSelectElement;
    }
  ) => {
    setNpc(Number(ev.currentTarget.value));
  };
  const setNpc = (npcId: number) => {
    selectedNpc = nonPlayerCharacters.find((npc) => npc.id === npcId);
    npcDescription = selectedNpc?.description ?? "";
  };
  prepareSampleDeck();
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<main style="flex-direction: column; display :flex">
  <div class="link link_left">
    <a href="https://github.com/Setta238/stk_ygo_svelte" target="_blank" rel="noopener noreferrer" title="repository">repository</a>
    <a href="https://x.com/ninja_no" target="_blank" rel="noopener noreferrer" title="repository">X(Twitter)</a>
    <a href="https://posfie.com/@ninja_no/p/Lx7FLj3" target="_blank" rel="noopener noreferrer" title="posfie">posfie(toggeter)</a>
  </div>
  <div class="link link_right">
    <!-- svelte-ignore a11y_missing_attribute -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <a class="a_button" role="button" tabindex="0" on:click={onReturnToTopClick}>TOPへ戻る</a>
    <a href="/stk_ygo_svelte/note.html" target="_blank" rel="noopener noreferrer" title="repository">現時点とこの先のこと</a>
  </div>
  {#if duel}
    {#await userProfilePromise then userProfile}
      <DuelDesk {duel} {userProfile} />
    {/await}
  {:else if dspMode === "DeckEdit"}
    <DeckEditor />
  {:else}
    <div class="app_body">
      <table class="config_table">
        <tbody>
          {#await userProfilePromise}
            <tr> <td colspan="2"><div>デュエリスト情報の読み込み、もしくは作成中...</div></td></tr>
          {:then userProfile}
            <tr class="config_row" transition:slide={{ duration: 200 }}>
              <td transition:slide={{ duration: 200 }}>
                <div transition:slide={{ duration: 200 }}>
                  <label for="duelist_name" class="config_row_label duelist_name">名前：</label>
                </div>
              </td>
              <td transition:slide={{ duration: 200 }}>
                <div transition:slide={{ duration: 200 }}>
                  <input id="duelist_name" class="duelist_name" type="text" bind:value={userProfile.name} on:keypress={onDuelistNameKeyPress} />
                </div></td
              >
            </tr>
            {#await userDecksPromise}
              <tr> <td colspan="2"><div>デッキ情報の読み込み、もしくは作成中...</div></td></tr>
            {:then userDecks}
              <tr class="config_row" transition:slide={{ duration: 200 }}>
                <td transition:slide={{ duration: 200 }}>
                  <div transition:slide={{ duration: 200 }}>
                    <label class="config_row_label" for="game_mode_radio_preset"> ゲームモード： </label>
                  </div>
                </td>
                <td transition:slide={{ duration: 200 }}>
                  <div transition:slide={{ duration: 200 }}>
                    {#each gameModes as mode}
                      <input
                        id="game_mode_radio_{mode.toLowerCase()}"
                        class="game_mode_radio"
                        value={mode}
                        type="radio"
                        name="game_mode"
                        checked={gameMode === mode}
                        on:change={() => onGameModeChange(mode)}
                      />
                      <label class="game_mode_tab_label game_mode_tab_{mode.toLowerCase()}" for="game_mode_radio_{mode.toLowerCase()}"> {mode} </label>
                    {/each}
                  </div>
                </td>
              </tr>
              <tr class="config_row" transition:slide={{ duration: 200 }}>
                <td transition:slide={{ duration: 200 }}>
                  <div transition:slide={{ duration: 200 }}>
                    <label for="deck_selector" class="config_row_label deck_selector">デッキ：</label>
                  </div>
                </td>
                <td transition:slide={{ duration: 200 }}>
                  <div transition:slide={{ duration: 200 }}>
                    <select id="deck_selector" class="deck_selector" bind:value={selectedDeckId}>
                      {#each gameMode === "FtkChallenge" ? sampleDecks.filter((info) => info.deckType === "Preset") : userDecks as userDeck}
                        <option value={userDeck.id}>{userDeck.name}</option>
                      {/each}
                    </select>
                  </div>
                </td>
              </tr>
              {#if gameMode === "Free"}
                <tr class="config_row" transition:slide={{ duration: 200 }}>
                  <td transition:slide={{ duration: 200 }}>
                    <div transition:slide={{ duration: 200 }}>
                      <label for="npc_selector" class="config_row_label npc_selector">対戦相手：</label>
                    </div>
                  </td>
                  <td transition:slide={{ duration: 200 }}>
                    <div transition:slide={{ duration: 200 }}>
                      <select id="npc_selector" class="npc_selector" on:change={onNpcIdChange} bind:value={userProfile.previousNpcId}>
                        {#each nonPlayerCharacters as npc}
                          <option value={npc.id}>{npc.name}</option>
                        {/each}
                      </select>
                      <div>※{npcDescription}</div>
                    </div>
                  </td>
                </tr>
                {#if selectedNpc?.npcType !== "FtkChallenge"}
                  <tr class="config_row" transition:slide={{ duration: 200 }}>
                    <td transition:slide={{ duration: 200 }}>
                      <div transition:slide={{ duration: 200 }}>
                        <label for="npc_deck_selector" class="config_row_label deck_selector">デッキ：</label>
                      </div>
                    </td>
                    <td transition:slide={{ duration: 200 }}>
                      <div transition:slide={{ duration: 200 }}>
                        <select id="npc_deck_selector" class="deck_selector" bind:value={userProfile.previousNpcDeckId}>
                          <option value={Number.MIN_SAFE_INTEGER}>デフォルト</option>
                          {#each userDecks as userDeck}
                            <option value={userDeck.id}>{userDeck.name}</option>
                          {/each}
                        </select>
                      </div>
                    </td>
                  </tr>
                {/if}
                <tr class="config_row" transition:slide={{ duration: 200 }}>
                  <td transition:slide={{ duration: 200 }}>
                    <div transition:slide={{ duration: 200 }}>
                      <label for="npc_selector" class="config_row_label npc_selector">先攻後攻：</label>
                    </div>
                  </td>
                  <td transition:slide={{ duration: 200 }}>
                    <div transition:slide={{ duration: 200 }}>
                      <select id="npc_selector" class="npc_selector" bind:value={userProfile.previousStartMode}>
                        {#each getKeys(duelStartModeDic) as key}
                          <option value={key}>{duelStartModeDic[key]}</option>
                        {/each}
                      </select>
                    </div>
                  </td>
                </tr>
              {:else if gameMode === "FtkChallenge"}
                <tr class="config_row" transition:slide={{ duration: 200 }}>
                  <td transition:slide={{ duration: 200 }}>
                    <div transition:slide={{ duration: 200 }}>
                      <label for="difficulty_selector" class="config_row_label difficulty_selector">難易度：</label>
                    </div>
                  </td>
                  <td transition:slide={{ duration: 200 }}>
                    <div transition:slide={{ duration: 200 }}>
                      <select id="difficulty_selector" class="difficulty_selector" bind:value={userProfile.previousDifficulty}>
                        {#each difficulties as difficulty}
                          <option value={difficulty}>{difficulty}</option>
                        {/each}
                      </select>
                    </div>
                  </td>
                </tr>
              {/if}
              <tr>
                <td colspan="2">
                  <div transition:slide={{ duration: 200 }}>
                    <button class="btn" on:click={onDuelStartClick}>duel start!</button>
                  </div>
                </td>
              </tr>
            {/await}
            {#if gameMode === "Free"}
              <tr transition:slide={{ duration: 200 }}>
                <td colspan="2" transition:slide={{ duration: 200 }}>
                  <div transition:slide={{ duration: 200 }}>
                    <button class="btn" on:click={onEditClick}>deck edit</button>
                  </div>
                </td>
              </tr>
            {/if}
          {/await}
        </tbody>
      </table>
    </div>
  {/if}
  <div class="debug_info">
    <span>build at: {import.meta.env.VITE_BUILD_TIMESTAMP}</span>
    <span class="user_agent_info">{userAgentInfo.text}</span>
    <span class="screen_info">w:{innerWidth}px h:{innerHeight}px</span>
  </div>
  {#if duel && duel.isEnded}
    <div class="result" transition:fade={{ delay: 200, duration: 200 }}>
      {#if duel.winner}
        {#if duel.winner.seat === "Below"}
          <div class="result_title result_win">YOU WIN</div>
        {:else if duel.winner.seat === "Above"}
          <div class="result_title result_lose">YOU LOSE</div>
        {/if}
      {:else}
        <div class="result_title result_draw">DRAW</div>
      {/if}
      <div class="reason_of_end">{duel.reasonOfEnd}</div>
      <button class="white_button" on:click={onReturnToTopClick}>TOPへ戻る</button>
    </div>
  {/if}
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
  .config_table td {
    padding: 1rem 2rem;
  }
  .config_row td:first-child {
    text-align: right;
    padding-right: 0.3rem;
  }
  .config_row td:last-child {
    text-align: left;
    padding-left: 0.3rem;
  }
  .link.link_left {
    position: absolute;
    top: 0.3rem;
    left: 1rem;
  }
  .link.link_right {
    position: absolute;
    top: 0.3rem;
    right: 1rem;
  }
  .link a {
    margin: 0rem 1rem;
  }
  .a_button {
    cursor: pointer;
  }
  .debug_info {
    position: fixed;
    right: 0.5rem;
    bottom: 0.5rem;
    background: rgba(255, 255, 255, 0.7);
    pointer-events: none;
  }
  .debug_info * {
    padding: 0.1rem 0.5rem;
    font-size: 1rem;
  }

  /* スマホ用に調整 */
  @media screen and (max-width: 600px) {
    .debug_info {
      right: 0.1rem;
      bottom: 0.1rem;
      font-size: 0.8rem;
      padding: 0.2rem 0.2rem;
    }
    .debug_info * {
      font-size: 0.8rem;
      padding: 0.05rem 0.2rem;
    }
  }
  .config_row * {
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
  .game_mode_tab_label {
    color: White;
    background: LightGray;
    margin-right: 1rem;
    padding: 0.4rem 1rem;
    order: -1;
  }
  .game_mode_tab_label:hover {
    filter: invert();
  }
  .game_mode_radio:checked + .game_mode_tab_label {
    background: DeepSkyBlue;
  }
  .game_mode_radio {
    display: none;
  }
  .result {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    opacity: 0.8;
    background-color: #555555;
    display: flex;
    flex-direction: column;
  }
  .result > div {
    margin: 2.3rem;
  }
  .result > .result_title {
    font-size: 5rem;
    font-weight: bold;
    background-color: beige;
    border-radius: 0.3rem;
    padding: 1.5rem 5rem;
    line-height: normal;
  }
  .result > .result_win {
    color: blue;
  }
  .result > .result_lose {
    color: red;
  }
  .result > .result_draw {
    color: black;
  }
  .reason_of_end {
    background-color: blanchedalmond;
    border-radius: 0.3rem;
    font-size: 1.6rem;
    padding: 0.9rem 2rem;
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
    pointer-events: initial;
    font-size: 2rem;
  }

  .white_button:hover {
    background: #67c5ff;
    color: white;
  }
</style>

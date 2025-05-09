<script lang="ts">
  import DuelCard from "./DuelCard.svelte";
  import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
  import { cardEntitySorter, type TDuelEntityFace } from "@ygo_duel/class/DuelEntity";
  import type { DuelistProfile } from "@ygo/class/DuelistProfile";
  import { chainConfigDic, chainConfigKeys } from "@ygo_duel/class/Duelist";
  import type { DuelViewController } from "@ygo_duel_view/class/DuelViewController";
  export let viewController: DuelViewController;
  export let userProfile: DuelistProfile;
</script>

{#if viewController.infoBoardState === "Config"}
  <div class="duel_config">
    <div class="duel_config_title">デュエル設定</div>
    <div class="duel_config_group">
      <div class="duel_config_group_title">チェーン設定</div>
      {#each chainConfigKeys as key}
        <div class="duel_config_item">
          <label class="toggle">
            <input type="checkbox" bind:checked={userProfile.chainConfig[key]} on:change={() => userProfile.save()} />
          </label>
          <span>{chainConfigDic[key]}</span>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .duel_config {
    display: flex;
    flex-direction: column;
    margin-top: 0.2rem;
    padding: 0.7rem;
    border-radius: 1rem;
    background-color: papayawhip;
    background-image: -webkit-linear-gradient(transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 50%, rgba(0, 0, 0, 0.1) 100%);
    background-image: linear-gradient(transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 50%, rgba(0, 0, 0, 0.1) 100%);
    box-shadow:
      0 2px 2px 0 rgba(255, 255, 255, 0.2) inset,
      0 2px 10px 0 rgba(255, 255, 255, 0.5) inset,
      0 -2px 2px 0 rgba(0, 0, 0, 0.1) inset;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .duel_config_title {
    font-size: 1.5rem;
    padding: 0.5rem;
  }
  .duel_config_group {
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    border-style: solid;
    border-width: 1px;
  }
  .duel_config_group_title {
    font-size: 1.4rem;
  }
  .duel_config_item {
    margin-left: 0.5rem;
  }
  .duel_config_item * {
    vertical-align: middle;
  }
  .duel_config_item span {
    font-size: 1.3rem;
    margin: 0rem 0.5rem;
  }
  .toggle {
    display: inline-block;
    position: relative;
    width: 2.6rem;
    height: 1.3rem;
    border-radius: 1.3rem;
    background-color: silver;
    cursor: pointer;
    transition: background-color 0.4s;
  }

  .toggle:has(:checked) {
    background-color: #4bd865;
  }

  .toggle::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    box-shadow: 0 0 5px rgb(0 0 0 / 20%);
    background-color: seashell;
    content: "";
    transition: left 0.2s;
  }

  .toggle:has(:checked)::after {
    left: 1.3rem;
  }

  .toggle input {
    display: none;
  }
</style>

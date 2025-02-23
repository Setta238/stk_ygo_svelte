<script lang="ts">
  import DuelFieldCell from "./DuelFieldCell.svelte";
  import cardInfoDic from "../../ygo/class/CardInfo";
  import DuelistProfile from "../../ygo/class/DuelistProfile";
  import DeckInfo from "../../ygo/class/DeckInfo";
  import { Duel, type DuelistAction } from "../../ygo_duel/class/Duel";
  import DuelLog from "./DuelLog.svelte";
  import DuelDuelist from "./DuelDuelist.svelte";
  import type DuelEntity from "@ygo_duel/class/DuelEntity";
  console.log("foobar");

  const duelist1Profile = new DuelistProfile();
  duelist1Profile.name = "あなた";
  const duelist2Profile = new DuelistProfile();
  duelist2Profile.name = "NPC";
  const deck1 = new DeckInfo();
  const deck2 = new DeckInfo();
  deck1.cardNames = Object.keys(cardInfoDic).slice(100, 140);
  deck2.cardNames = Object.keys(cardInfoDic).slice(600, 640);

  let duel = new Duel(duelist1Profile, "Player", deck1, duelist2Profile, "NPC", deck2);

  let action: (Action: DuelistAction) => void = () => {};
  let selectedEntitiesValidator: (selectedEntities: DuelEntity[]) => boolean = () => true;
  const onDuelAction: (args: { resolve: (action: DuelistAction) => void; entitiesValidator: (selectedEntities: DuelEntity[]) => boolean }) => void = (args) => {
    action = args.resolve;
    selectedEntitiesValidator = args.entitiesValidator;
  };

  export let selectedList = [] as DuelEntity[];
  const onDuelUpdate = () => {
    duel = duel;
  };
  duel.onDuelUpdate.append(onDuelUpdate);
  duel.onWaitStart.append(onDuelAction);
  const onOkClick = () => {
    console.log(selectedList);
    if (selectedEntitiesValidator(selectedList)) {
      action({ selectedEntities: selectedList });
    }
  };

  duel.main();
</script>

<!-- <div><button on:click={() => {
    duel.field.pushDeck(duel.duelists.Below);
  }}>hoge</button></div>-->
<div class="flex duel_desk">
  <div class="duel_desk_left v_flex">
    <DuelDuelist duelist={duel.duelists.Above}></DuelDuelist>
    <DuelDuelist duelist={duel.duelists.Below}></DuelDuelist>
  </div>
  <div class=" duel_desk_center v_flex">
    <div class="duel_field_header">{`[TURN:${duel.turn}][PHASE:${duel.phase}] ${duel.message}`}</div>
    <div>
      {#if duel.turn > 0}
        <table class="duel_field">
          <tbody>
            {#each duel.field.cells as row, rowIndex}
              <tr class={`duel_desk_row_${rowIndex}`}>
                {#each row as cell, colIndex}
                  <DuelFieldCell {cell} bind:selectedList />
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
    <div class="duel_field_footer">
      {#if duel.waitMode === "EntitiesSelect"}
        <button on:click={onOkClick}>OK</button>
        <!-- <button on:click={onCancelClick}>cancel</button> -->
      {/if}
    </div>
  </div>
  <div class=" duel_desk_right" style="text-align: left;">
    <DuelLog log={duel.log} />
  </div>
</div>

<style>
  .v_flex {
    display: flex;
    flex-direction: column;
  }
  .flex {
    display: flex;
  }
  .duel_desk {
    margin: 0px;
    max-height: 90%;
    min-height: 90%;
    justify-content: space-between;
  }
  .duel_desk * {
    margin: 0px;
    padding: 0px;
    font-size: 0.7rem;
  }
  .duel_desk_left {
    height: auto;
    min-width: 15%;
    justify-content: space-between;
    align-items: center;
  }
  .duel_field_header {
    font-size: x-large;
  }
  .duel_desk_center {
    min-width: 60%;
    justify-content: space-between;
    align-items: center;
  }
  .duel_field_footer button {
    padding: 0 10px;
    font-size: x-large;
    border: 2px solid #000;
    background: #fff;
    font-weight: 700;
    line-height: 1.5;
    position: relative;
    display: inline-block;
    padding: 0.3rem 2rem;
    cursor: pointer;
  }

  .duel_field_footer button:hover {
    color: #fff;
    background: #000;
  }
  .duel_desk_right {
    min-width: 15%;
    overflow: hidden;
    max-height: 100;
  }
  .duel_field {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
  }
</style>

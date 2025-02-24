<script lang="ts">
  import DuelFieldCell from "./DuelFieldCell.svelte";
  import cardInfoDic from "../../ygo/class/CardInfo";
  import DuelistProfile from "../../ygo/class/DuelistProfile";
  import DeckInfo from "../../ygo/class/DeckInfo";
  import { Duel, type DuelistAction } from "../../ygo_duel/class/Duel";
  import DuelLog from "./DuelLog.svelte";
  import DuelDuelist from "./DuelDuelist.svelte";
  import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
  import type { WaitStartEventArg } from "@ygo_duel_view/class/DuelViewController";
  import {} from "@stk_utils/funcs/StkArrayUtils";
  import ModalContainer from "@ygo_duel_view/components/DuelModalContainer.svelte";

  const duelist1Profile = new DuelistProfile();
  duelist1Profile.name = "あなた";
  const duelist2Profile = new DuelistProfile();
  duelist2Profile.name = "NPC";
  const deck1 = new DeckInfo();
  const deck2 = new DeckInfo();
  deck1.cardNames = [
    "アレキサンドライドラゴン",
    "幻殻竜",
    "しゃりの軍貫",
    "ジェネティック・ワーウルフ",
    "機界騎士アヴラム",
    "ジョングルグールの幻術師",
    "ゾンビーノ",
    "幻のグリフォン",
    "ライドロン",
    "フロストザウルス",
    "エレキテルドラゴン",
    "デーモンの召喚",
    "青眼の白龍",
  ];
  deck1.cardNames = [...deck1.cardNames, ...deck1.cardNames, ...deck1.cardNames];
  deck2.cardNames = Object.keys(cardInfoDic).randomPick(40);

  let duel = new Duel(duelist1Profile, "Player", deck1, duelist2Profile, "NPC", deck2);
  let retryFlg = false;
  let action: (Action: DuelistAction) => void = () => {};
  let selectedEntitiesValidator: (selectedEntities: DuelEntity[]) => boolean = () => true;
  let selectableEntities: DuelEntity[];
  const onWaitStart: (args: WaitStartEventArg) => void = (args) => {
    action = args.resolve;
    selectedEntitiesValidator = args.entitiesValidator;
    selectableEntities = args.selectableEntities;
  };

  export let selectedList = [] as DuelEntity[];
  const onDuelUpdate = () => {
    duel = duel;
  };
  duel.view.onDuelUpdate.append(onDuelUpdate);
  duel.view.onWaitStart.append(onWaitStart);
  const onOkClick = () => {
    console.log(selectedList);
    if (selectedEntitiesValidator(selectedList)) {
      action({ selectedEntities: selectedList });
    }
  };

  const onRetryButtonClick = () => {
    retryFlg = true;
    action({
      surrender: true,
    });
  };
  const onSurrenderButtonClick = () => {
    action({
      surrender: true,
    });
  };
  duel.main();
</script>

<!-- <div><button on:click={() => {
    duel.field.pushDeck(duel.duelists.Below);
  }}>hoge</button></div>-->
<ModalContainer modalController={duel.view.modalController} />
<div class="flex duel_desk">
  <div class="duel_desk_left v_flex">
    <DuelDuelist duelist={duel.duelists.Above}></DuelDuelist>
    <DuelDuelist duelist={duel.duelists.Below}></DuelDuelist>
  </div>
  <div class=" duel_desk_center v_flex">
    <div class="duel_field_header">
      {#if !duel.isEnded}
        <div class="duel_field_header_message">{`[TURN:${duel.turn}][PHASE:${duel.phase}] ${duel.view.message}`}</div>
        <div class="duel_field_header_buttons">
          <!--        <button on:click={onRetryButtonClick}>リトライ</button>-->
          <button on:click={onSurrenderButtonClick}>サレンダー</button>
        </div>
      {/if}
    </div>
    <div>
      {#if duel.turn > 0}
        <table class="duel_field">
          <tbody>
            {#each duel.field.cells as row, rowIndex}
              <tr class={`duel_desk_row_${rowIndex}`}>
                {#each row as cell, colIndex}
                  <DuelFieldCell view={duel.view} row={rowIndex} column={colIndex} bind:selectedList />
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
    <div class="duel_field_footer">
      {#if selectableEntities && selectableEntities.length > 0}
        <button on:click={onOkClick} disabled={!selectedEntitiesValidator(selectedList)}>OK</button>
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
    position: relative;
    width: 100%;
  }
  .duel_field_header_message {
    font-size: x-large;
  }
  .duel_field_header_buttons {
    position: absolute;
    text-align: left;
    top: 0px;
    left: 0px;
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

  .duel_field_header_buttons button {
    padding: 0 10px;
    font-size: x-large;
    border: 2px solid #000;
    background: #fff;
    font-weight: 700;
    line-height: 1.5;
    position: relative;
    display: inline-block;
    padding: 0.2rem 1rem;
    cursor: pointer;
  }
  .duel_field_header_buttons button:hover {
    color: #fff;
    background: #000;
  }
</style>

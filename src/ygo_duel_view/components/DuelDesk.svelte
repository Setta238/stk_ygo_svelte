<script lang="ts" module>
  import { crossfade } from "svelte/transition";

  export const cardCrossFade = crossfade({
    duration: 400,
  });
</script>

<script lang="ts">
  import DuelFieldCell from "./DuelFieldCell.svelte";
  import { cardInfoDic } from "../../ygo/class/CardInfo";
  import DuelistProfile from "../../ygo/class/DuelistProfile";
  import DeckInfo from "../../ygo/class/DeckInfo";
  import { Duel, type DuelistResponse } from "../../ygo_duel/class/Duel";
  import DuelLog from "./DuelLog.svelte";
  import DuelDuelist from "./DuelDuelist.svelte";
  import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
  import type { WaitStartEventArg } from "@ygo_duel_view/class/DuelViewController";
  import {} from "@stk_utils/funcs/StkArrayUtils";
  import ModalContainer from "@ygo_duel_view/components/DuelModalContainer.svelte";
  import DuelCardInfo from "./DuelCardInfo.svelte";

  const duelist1Profile = new DuelistProfile();
  duelist1Profile.name = "あなた";
  const duelist2Profile = new DuelistProfile();
  duelist2Profile.name = "NPC";
  const deck1 = new DeckInfo();
  const deck2 = new DeckInfo();
  deck1.cardNames = ["おろかな埋葬", "成金ゴブリン", "強欲な壺", "天使の施し", "増援", "Ｅ－エマージェンシーコール"];
  deck1.cardNames = [
    ...deck1.cardNames,
    ...deck1.cardNames,
    ...deck1.cardNames,
    "アレキサンドライドラゴン",
    "ジェネティック・ワーウルフ",
    "機界騎士アヴラム",
    "ジョングルグールの幻術師",
    "ゾンビーノ",
    "幻のグリフォン",
    "フロストザウルス",
    "エレキテルドラゴン",
    "青眼の白龍",
    "サイバー・ドラゴン",
    "幻殻竜",
    "しゃりの軍貫",
    "チューン・ウォリアー",
    "ライドロン",
    "Ａ・マインド",
    "ウォーター・スピリット",
    "エンジェル・トランペッター",
    "ガード・オブ・フレムベル",
    "ギャラクシーサーペント",
    "ジェネクス・コントローラー",
    "スペース・オマジナイ・ウサギ",
    "ハロハロ",
    "ライブラの魔法秤",
    "ラブラドライドラゴン",
    "守護竜ユスティア",
    "竜核の呪霊者",
    "Ｅ・ＨＥＲＯ クレイマン",
    "Ｅ・ＨＥＲＯ スパークマン",
    "Ｅ・ＨＥＲＯ ネオス",
    "Ｅ・ＨＥＲＯ バーストレディ",
    "Ｅ・ＨＥＲＯ フェザーマン",
  ];
  deck2.cardNames = Object.keys(cardInfoDic).randomPick(40);

  let duel = new Duel(duelist1Profile, "Player", deck1, duelist2Profile, "NPC", deck2);
  let retryFlg = false;
  let response: (Action: DuelistResponse) => void = () => {};
  let selectedEntitiesValidator: (selectedEntities: DuelEntity[]) => boolean = () => true;
  let selectableEntities: DuelEntity[];
  const onWaitStart: (args: WaitStartEventArg) => void = (args) => {
    console.log(args);
    response = args.resolve;
    selectedEntitiesValidator = args.entitiesValidator;
    selectableEntities = args.selectableEntities;
    if (args.duelEntitiesSelectorArg) {
      duel.view.modalController.selectDuelEntities(args.duelEntitiesSelectorArg).then((selected) => {
        response({
          selectedEntities: selected,
        });
      });
    }
  };
  duel.view.onWaitStart.append(onWaitStart);

  let focusedCard: DuelEntity | undefined = undefined;
  const onShowCardEntity = (card?: DuelEntity) => {
    focusedCard = card;
  };
  duel.view.onShowCardEntity.append(onShowCardEntity);

  export let selectedList = [] as DuelEntity[];
  const onDuelUpdate = () => {
    console.log(duel);
    duel = duel;
  };
  duel.view.onDuelUpdate.append(onDuelUpdate);
  const onOkClick = () => {
    if (selectedEntitiesValidator(selectedList)) {
      response({ selectedEntities: selectedList });
    }
  };

  const onRetryButtonClick = () => {
    retryFlg = true;
    response({
      surrender: true,
    });
  };
  const onSurrenderButtonClick = () => {
    response({
      surrender: true,
    });
  };
  duel.main();
</script>

<!-- <div><button on:click={() => {
    duel.field.pushDeck(duel.duelists.Below);
  }}>hoge</button></div>-->
<div class="flex duel_desk">
  <div class="duel_desk_left v_flex">
    <DuelDuelist duelist={duel.duelists.Above}></DuelDuelist>
    <DuelCardInfo entity={focusedCard}></DuelCardInfo>
    <DuelDuelist duelist={duel.duelists.Below}></DuelDuelist>
  </div>
  <div class=" duel_desk_center v_flex">
    <div class="duel_field_header">
      {#if !duel.isEnded}
        <div class="duel_field_header_message">{`[TURN:${duel.clock.turn}][PHASE:${duel.phase}] ${duel.view.message}`}</div>
        <div class="duel_field_header_buttons">
          <!--        <button on:click={onRetryButtonClick}>リトライ</button>-->
          <button on:click={onSurrenderButtonClick}>サレンダー</button>
        </div>
      {/if}
    </div>
    <div>
      {#if duel.clock.turn > 0}
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

<ModalContainer modalController={duel.view.modalController} />

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
    justify-content: space-between;
  }
  .duel_desk * {
    margin: 0px;
    padding: 0px;
    font-size: 0.7rem;
  }
  @media screen and (max-width: 1400px) {
    .duel_desk_left,
    .duel_desk_right {
      display: none;
    }
  }
  .duel_desk_left {
    height: auto;
    min-width: 20%;
    justify-content: space-between;
    align-items: center;
  }
  .duel_field_header {
    position: relative;
    width: 100%;
  }
  .duel_field_header_message {
    font-size: 1.4rem;
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
    font-size: 1.4rem;
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
    font-size: 1.4rem;
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

<script lang="ts" module>
  import { crossfade, slide } from "svelte/transition";

  export const cardCrossFade = crossfade({
    duration: 400,
  });
</script>

<script lang="ts">
  import DuelFieldCell from "./DuelFieldCell.svelte";
  import { Duel } from "@ygo_duel/class/Duel";
  import { DuelFieldCell as FieldCell } from "@ygo_duel/class/DuelFieldCell";
  import DuelLog from "./DuelLog.svelte";
  import DuelDuelist from "./DuelDuelist.svelte";
  import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
  import type { DuelistResponseBase, WaitStartEventArg } from "@ygo_duel_view/class/DuelViewController";

  import ModalContainer from "@ygo_duel_view/components_modal/DuelModalContainer.svelte";
  import DuelCardDetail, { type ShowCardEntityEventArgs, type TCardDetailMode } from "./DuelCardDetail.svelte";
  import DuelFieldCellInfo from "./DuelFieldCellInfo.svelte";
  import type { DummyActionInfo } from "@ygo_duel/class/DuelEntityAction";
  import type { ChoicesSweet } from "@ygo_duel/class/DuelUtilTypes";
  import type { DuelistProfile } from "@ygo/class/DuelistProfile";
  import DuelConfig from "./DuelConfig.svelte";
  import DuelCutin from "./DuelCutin.svelte";
  export let duel: Duel;
  export let userProfile: DuelistProfile;

  let innerWidth = 0;
  let innerHeight = 0;
  let selectedEntities = [] as DuelEntity[];
  let selectedCells = [] as FieldCell[];

  let response: (response: DuelistResponseBase) => void = () => {};
  let userActionInfos: DummyActionInfo[] = [];
  let entitiesChoices: ChoicesSweet<DuelEntity> | undefined;
  let cellsChoices: ChoicesSweet<FieldCell> | undefined;
  let validator: () => boolean = () => false;
  let cancelable = false;

  const onWaitStart: (args: WaitStartEventArg) => void = (args) => {
    response = args.resolve;
    userActionInfos = args.dummyActionInfos
      .filter((info) => info.action.entity.entityType === "Duelist")
      .filter((info) => info.action.entity.controller.seat === "Below");
    entitiesChoices = undefined;
    cellsChoices = undefined;
    selectedCells = [];
    selectedEntities = [];
    cancelable = false;
    if (args.entitiesChoices) {
      entitiesChoices = args.entitiesChoices;
      validator = () => args.entitiesChoices?.validator(selectedEntities) ?? false;
      cancelable = args.entitiesChoices.cancelable;
      if (
        !entitiesChoices.selectables.every(
          (e) =>
            (e.cell.isPlayFieldCell && e.getIndexInCell() === 0) ||
            (e.cell.cellType === "Hand" && e.controller.duelistType === "Player") ||
            e.entityType === "Duelist"
        )
      ) {
        // エンティティの選択肢が可視範囲外にあるとき、モーダルウィンドウを表示する。
        duel.view.modalController.entitySelector
          .show({
            title: duel.view.message,
            position: "Middle",
            entitiesChoices: args.entitiesChoices,
            chainBlockInfos: args.chainBlockInfos,
            cancelable: args.entitiesChoices.cancelable,
          })
          .then((selected) => {
            response({
              selectedEntities: selected,
            });
          });
      }
    }
    if (args.cellsChoices) {
      cellsChoices = args.cellsChoices;
      validator = () => args.cellsChoices?.validator(selectedCells) ?? false;
      cancelable = args.cellsChoices.cancelable;
    }
  };
  duel.view.onWaitStart.append(onWaitStart);

  const onWaitEnd: () => void = () => {
    response = () => {};
    cellsChoices = undefined;
    entitiesChoices = undefined;
    selectedCells = [];
    selectedEntities = [];
    validator = () => false;
    cancelable = false;
  };

  duel.view.onWaitEnd.append(onWaitEnd);

  let focusedCard: DuelEntity | undefined = undefined;
  let focusedCardMode: TCardDetailMode = "Normal";
  const onShowCardEntity = ({ card, mode }: ShowCardEntityEventArgs) => {
    focusedCard = card;
    focusedCardMode = mode ?? (focusedCard === card || focusedCardMode === "Normal" ? "Detail" : "Normal");
  };
  duel.view.onShowCardEntity.append(onShowCardEntity);

  const onDuelUpdate = () => {
    duel = duel;
  };
  duel.view.onDuelUpdate.append(onDuelUpdate);
  duel.log.onUpdate.append(onDuelUpdate);

  const onOkClick = () => {
    if (entitiesChoices && entitiesChoices.validator(selectedEntities)) {
      response({ selectedEntities });
    }
    if (cellsChoices && cellsChoices.validator(selectedCells)) {
      response({ selectedCells });
    }
  };
  const onCancelClick = () => {
    response({});
  };
  const onActionButtonClick = (actionInfo: DummyActionInfo) => {
    response({ actionInfo });
  };
  const onSurrenderButtonClick = () => {
    response({
      surrender: true,
    });
  };
  duel.main();
  const getScreenMode = () => {
    if (innerWidth <= 1400) {
      return "compact";
    }
    return "wide";
  };
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="flex duel_desk {getScreenMode()}_mode">
  {#if getScreenMode() === "wide"}
    <div class="duel_desk_left v_flex">
      <DuelDuelist duelist={duel.duelists.Above}></DuelDuelist>
      <DuelCardDetail entity={focusedCard} mode={focusedCardMode}></DuelCardDetail>
      <DuelDuelist duelist={duel.duelists.Below}></DuelDuelist>
    </div>
  {/if}
  <div class=" duel_desk_center v_flex">
    <div class="duel_field_header">
      {#if !duel.isEnded}
        <button
          class="duel_field_header_message"
          on:click={() => {
            duel.view.infoBoardState = "Log";
          }}
        >
          {`[TURN:${duel.clock.turn}][PHASE:${duel.phase}] ${duel.view.message}`}
        </button>
        <div class="duel_field_header_buttons">
          <!--        <button on:click={onRetryButtonClick}>リトライ</button>-->
          <button on:click={onSurrenderButtonClick}>サレンダー</button>
        </div>
      {/if}
    </div>
    <div class="duel_field_body">
      {#if duel.clock.turn > 0}
        <table class="duel_field">
          <tbody>
            {#each duel.field.cells as row, rowIndex}
              <tr class={`duel_desk_row_${rowIndex}`}>
                {#each row as cell, colIndex}
                  <DuelFieldCell view={duel.view} row={rowIndex} column={colIndex} bind:selectedEntities bind:selectedCells />
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
    <div class="duel_field_footer">
      {#if (entitiesChoices && entitiesChoices.selectables.length) || (cellsChoices && cellsChoices.selectables)}
        {#if ((entitiesChoices && entitiesChoices.qty) ?? (cellsChoices && cellsChoices.qty) ?? 9999) > 1}
          <button on:click={onOkClick} disabled={!validator()}>OK</button>
        {/if}
        {#if cancelable}
          <button on:click={onCancelClick}>cancel</button>
        {/if}
      {:else}
        {#each userActionInfos as actionInfo}
          <button on:click={() => onActionButtonClick(actionInfo)}>{actionInfo.action.title}</button>
        {/each}
      {/if}
    </div>
  </div>
  {#if innerWidth > 1400 || duel.view.infoBoardState !== "Default"}
    <div
      class="duel_desk_right duel_desk_right_{duel.view.infoBoardState.toLowerCase()} "
      style="text-align: left;"
      transition:slide={{ duration: innerWidth > 1400 ? 0 : 200, axis: "x" }}
    >
      <DuelLog log={duel.log} />
      <DuelFieldCellInfo cell={duel.view.infoBoardCell} />
      <DuelConfig {userProfile} viewController={duel.view} />
    </div>
  {/if}
</div>
<div style="position:fixed;bottom:0">{duel.clock.toFullString()}</div>

<ModalContainer modalController={duel.view.modalController} />

<div class="cutin {getScreenMode()}_mode">
  <DuelCutin {duel} position={getScreenMode() === "wide" ? "right" : "left"} />
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
    justify-content: space-between;
    position: fixed;
    top: 2rem;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
  }
  .duel_desk * {
    margin: 0px;
    padding: 0px;
    font-size: 0.7rem;
  }
  .duel_desk_right {
    background: linear-gradient(27deg, snow 2px, transparent 4px), linear-gradient(beige 25%, transparent 50%, blueviolet 75%, indigo);
    background-color: whitesmoke;
    background-size: 0.3rem 0.3rem;
    border-radius: 0.5rem;
  }

  .compact_mode .duel_desk_left,
  .compact_mode .duel_desk_right_default {
    display: none;
  }
  .compact_mode .duel_desk_right {
    display: inherit;
    transform: 0.5s;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    opacity: 0.9;
  }
  .duel_desk_left {
    height: auto;
    min-width: 20%;
    justify-content: space-between;
    align-items: center;
  }
  .duel_desk_center {
    min-width: 60%;
    justify-content: space-between;
    align-items: center;
  }
  .duel_field_header {
    position: relative;
    width: 100%;
  }
  .duel_field_header_message {
    display: inline;
    border: none;
    font-size: 1.4rem;
  }
  .duel_field_header_buttons {
    position: absolute;
    text-align: left;
    top: 0px;
    left: 0px;
    z-index: 1;
  }
  .duel_field_header_buttons button {
    border-radius: 0.5rem;
  }
  .duel_field_body {
    position: relative;
  }

  .duel_field_header_buttons button,
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

  .duel_field_header_buttons button:hover,
  .duel_field_footer button:hover {
    color: #fff;
    background: #000;
  }
  .duel_field_header_buttons button:disabled,
  .duel_field_footer button:disabled {
    background-color: grey;
  }
  .duel_desk_right {
    min-width: 20%;
    max-height: 100%;
  }
  .duel_field {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
  }

  .cutin {
    position: absolute;
    top: 0;
    right: 0;
  }
  .cutin.compact_mode {
    right: initial;
    left: 0;
  }
</style>

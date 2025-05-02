<script lang="ts" module>
  import { crossfade } from "svelte/transition";

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
  import {} from "@stk_utils/funcs/StkArrayUtils";
  import ModalContainer from "@ygo_duel_view/components/DuelModalContainer.svelte";
  import DuelCardDetail, { type TCardDetailMode } from "./DuelCardDetail.svelte";
  import DuelFieldCellInfo from "./DuelFieldCellInfo.svelte";
  import type { DummyActionInfo } from "@ygo_duel/class/DuelCardAction";
  import type { ChoicesSweet } from "@ygo_duel/class/DuelUtilTypes";

  export let duel: Duel;
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
            (e.fieldCell.isPlayFieldCell && e.getIndexInCell() === 0) ||
            (e.fieldCell.cellType === "Hand" && e.controller.duelistType === "Player") ||
            e.entityType === "Duelist"
        )
      ) {
        // エンティティの選択肢が可視範囲外にあるとき、モーダルウィンドウを表示する。
        duel.view.modalController.entitySelector
          .show({
            title: duel.view.message,
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
  const onShowCardEntity = ({ card, mode }: { card: DuelEntity; mode: TCardDetailMode }) => {
    focusedCard = card;
    focusedCardMode = mode;
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
</script>

<!-- <div><button on:click={() => {
    duel.field.pushDeck(duel.duelists.Below);
  }}>hoge</button></div>-->
<div class="flex duel_desk">
  <div class="duel_desk_left v_flex">
    <DuelDuelist duelist={duel.duelists.Above}></DuelDuelist>
    <DuelCardDetail entity={focusedCard} mode={focusedCardMode}></DuelCardDetail>
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
        <button on:click={onOkClick} disabled={!validator()}>OK</button>
        {#if cancelable}
          <button on:click={onCancelClick}>cancel</button>
        {/if}
      {:else if userActionInfos && userActionInfos.length}
        {#each userActionInfos as actionInfo}
          <button on:click={() => onActionButtonClick(actionInfo)}>{actionInfo.action.title}</button>
        {/each}
      {/if}
    </div>
  </div>
  <div class=" duel_desk_right" style="text-align: left;">
    <DuelLog log={duel.log} />
    <DuelFieldCellInfo cell={duel.view.infoBoardCell} />
  </div>
</div>
<div style="position:absolute;left:0;bottom:0">{duel.clock.toString()}</div>

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
    max-height: 90%;
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
  .duel_field_header_buttons button {
    border-radius: 0.5rem;
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
    min-width: 20%;
    max-height: 100%;
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

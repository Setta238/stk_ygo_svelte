<script lang="ts">
  import DuelCard from "./DuelCard.svelte";
  import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
  import { cardEntitySorter, type TDuelEntityFace } from "@ygo_duel/class/DuelEntity";
  export let cell: DuelFieldCell;

  const onCellUpdate = () => {
    cell = cell;
  };

  const getList = (face: TDuelEntityFace) => cell.cardEntities.filter((card) => card.face === face);

  cell.field.duel.view.onDuelUpdate.append(onCellUpdate);
</script>

{#if cell.field.duel.view.infoBoardState === "CellInfo"}
  <div class="duel_field_cell_info">
    <div class="duel_field_cell_info_header item_btn">
      <div>{cell.owner?.profile.name}</div>
      <div>{cell.cellType}</div>
    </div>
    <div class="duel_field_cell_info_body">
      {#each ["FaceUp", "FaceDown"] as TDuelEntityFace[] as face}
        {#if getList(face).length}
          <div class="duel_field_cell_info_box">
            <div class="duel_field_cell_info_label">
              {face === "FaceUp" ? "表向き" : "裏向き"}
            </div>
            {#each getList(face).toSorted(cardEntitySorter) as card}
              <div class="duel_field_cell_info_item">
                <DuelCard entity={card} isVisibleForcibly={cell.owner === cell.field.duel.duelists.Below} isWideMode={true} cardActionResolve={undefined} />
              </div>
            {/each}
          </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style>
  .duel_field_cell_info {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    padding: 0.5rem;
  }
  .duel_field_cell_info_header {
    display: flex;
    flex-direction: initial;
    position: sticky;
    font-weight: bold;
    padding: 0.25em 0.5em;
    text-decoration: none;
    color: #000000;
    transition: 0.4s;
    vertical-align: middle;
    background: #00bcd4;
  }
  .duel_field_cell_info_header div {
    border-radius: 10%;
    background-color: seashell;
    color: black;
    margin: 0rem 0.5rem;
    padding: 0rem 0.5rem;
    font-size: 1.1rem;
  }
  .duel_field_cell_info_body {
    display: flex;
    flex-direction: row;
    max-height: 100%;
    width: 100%;
    overflow-y: auto;
    flex-wrap: wrap;
    padding: 0.5rem;
  }
  .duel_field_cell_info_label {
    border-radius: 10%;
    background-color: navajowhite;
    color: black;
    font-size: 1rem;
    width: fit-content;
    padding: 0.05rem 1rem;
    text-align: center;
  }
  .duel_field_cell_info_box {
    width: 89%;
  }
  .duel_field_cell_info_item {
    margin: 0.31rem 0.1rem;
  }
</style>

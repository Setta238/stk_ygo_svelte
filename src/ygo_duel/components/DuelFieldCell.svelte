<script lang="ts">
  import { DuelFieldCell } from "../class/DuelFieldCell";
  import { type DuelistAction, type TDuelPhase } from "../class/Duel";

  import DuelCard from "../components/DuelCard.svelte";
  import DuelEntity from "../class/DuelEntity";
  import { modalController } from "../../ygo_duel_modal/class/ModalController";

  export let cell: DuelFieldCell;

  export let selectedList = [] as DuelEntity[];

  const onCellUpdate = () => {
    cell = cell;
  };

  cell?.onUpdate?.append(onCellUpdate);
  cell?.field.duel.onDuelUpdate.append(onCellUpdate);

  let action: (Action: DuelistAction) => void = () => {};
  let selectedEntitiesValidator: (selectedEntities: DuelEntity[]) => boolean = () => true;
  const onDuelAction: (args: { resolve: (action: DuelistAction) => void; entitiesValidator: (selectedEntities: DuelEntity[]) => boolean }) => void = (args) => {
    action = args.resolve;
    selectedEntitiesValidator = args.entitiesValidator;
  };

  cell.field.duel.onWaitStart.append(onDuelAction);

  const onPhaseButtonClick = (phase: TDuelPhase) => {
    console.log(phase);
    action({
      phaseChange: phase,
    });
  };
  const onSurrenderButtonClick = () => {
    action({
      surrender: true,
    });
  };
  const onActionButtonClick = (...entities: DuelEntity[]) => {
    if (entities.length === 1) {
      modalController
        .selectAction(cell.field.duel, {
          title: "行動を選択。",
          actions: entities[0].getEnableActions(),
          cancelable: true,
        })
        .then((_action) => {
          action({
            action: _action,
          });
        });
      return;
    }
  };

  const dragover = (ev: DragEvent) => {
    ev.preventDefault();
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
  };
  const drop = (ev: DragEvent) => {
    ev.preventDefault();
    console.log(ev);
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
    try {
      if (cell.canAcceptDrop) {
        const cardAction = cell.field.getDraggingAction();
        if (cardAction) {
          action({
            action: cardAction,
            cell: cell,
          });
        }
      }
    } finally {
      cell.field.removeDraggingAction();
    }
  };
  const canAction = (...entities: DuelEntity[]) => {
    return cell.field.duel.enableActions.filter((action) => entities.includes(action.entity)).length > 0;
  };
</script>

<td class={`duel_field_cell duel_field_cell_${cell.cellType}`} colspan={cell.cellType === "Hand" ? 7 : 1}>
  <div
    class={`${cell.canAcceptDrop ? "can_accept_drop" : ""}`}
    role="listitem"
    style="min-height:90px;padding:5px"
    ondragover={(ev) => dragover(ev)}
    ondrop={(ev) => drop(ev)}
  >
    {#if cell.cellType === "PhaseButton"}
      <div>【{cell.field.duel.phase}】</div>
      {#if cell.field.duel.waitMode === "CardAction"}
        {#each cell.field.duel.nextPhaseList as phase}
          <div><button class="phase_button" onclick={() => onPhaseButtonClick(phase)}>{phase}</button></div>
        {/each}
      {/if}
    {:else if cell.cellType === "SurrenderButton"}
      <div><button class="surrender_button" onclick={onSurrenderButtonClick}>サレンダー</button></div>
    {:else if cell.cellType === "Hand"}
      <div class="flex" style="  margin: 0 auto;">
        {#each cell.entities as entity}
          <button disabled={cell.field.duel.waitMode !== "CardAction" || !canAction(entity)} class="action_button" onclick={() => onActionButtonClick(entity)}>
            <DuelCard {entity} isSelectable={cell.field.duel.waitMode === "EntitiesSelect" && entity.isSelectable} bind:selectedList />
          </button>
        {/each}
      </div>
    {:else}
      <div>
        <button
          disabled={!cell.field.duel.waitMode || !canAction(...cell.entities)}
          class="action_button"
          onclick={() => onActionButtonClick(...cell.entities)}
        >
          {#if cell.entities.length > 0}
            <DuelCard
              entity={cell.entities[0]}
              isSelectable={cell.field.duel.waitMode === "EntitiesSelect" && cell.entities[0].isSelectable}
              bind:selectedList
            />
          {/if}
          {#if cell.cellType === "Deck" || cell.cellType === "ExtraDeck" || cell.cellType === "Graveyard" || cell.cellType === "Banished"}
            <div>{cell.entities.length}枚</div>
          {/if}
        </button>
      </div>
    {/if}
  </div>
</td>

<style>
  .flex {
    display: flex;
  }
  .duel_field_cell {
    background-color: slategrey;
    width: 200px;
  }
  .duel_field_cell > div {
    border: solid 1px #778ca3;
    padding: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .duel_field_cell > div.can_accept_drop {
    border: dotted 3px red;
  }
  .action_button {
    display: block;
    background-color: red;
    width: fit-content;
    border-radius: 0%;
    padding: 0px;
    font-family: inherit;
    color: inherit;
  }
  .action_button:disabled {
    display: block;
    background-color: transparent;
    cursor: default;
    pointer-events: none;
  }
  .action_button * {
    pointer-events: none;
  }
  .surrender_button,
  .phase_button {
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
  .surrender_button:hover,
  .phase_button:hover {
    color: #fff;
    background: #000;
  }
  .duel_field_cell_Hand > div {
    display: flex;
  }
  .duel_field_cell_Hand {
    background-color: cornsilk;
  }
  .duel_field_cell_Deck {
    background-color: sienna;
  }
  .duel_field_cell_MonsterZone {
    background-color: lightsalmon;
  }
  .duel_field_cell_MagicZone {
    background-color: teal;
  }
  .duel_field_cell_Graveyard {
    background-color: aliceblue;
  }
  .duel_field_cell_Banished {
    background-color: midnightblue;
    color: aliceblue;
  }
  .duel_field_cell_FieldZone {
    background-color: lightgreen;
  }
  .duel_field_cell_ExtraDeck {
    background-color: blueviolet;
  }
  .duel_field_cell_ExtraMonsterZone {
    background-color: steelblue;
  }
</style>

<script lang="ts">
  import { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
  import { type DuelistAction, type TDuelPhase } from "@ygo_duel/class/Duel";

  import DuelCard from "@ygo_duel_view/components/DuelCard.svelte";
  import { DuelEntity, type CardAction, type CardActionWIP } from "@ygo_duel/class/DuelEntity";
  import type { DuelViewController, WaitStartEventArg } from "@ygo_duel_view/class/DuelViewController";
  import {} from "@stk_utils/funcs/StkArrayUtils";
  export let view: DuelViewController;

  export let row: number;

  export let column: number;

  export let selectedList = [] as DuelEntity[];

  let cell = view.getCell(row, column);

  const onCellUpdate = () => {
    cell = view.getCell(row, column);
  };

  cell.onUpdate.append(onCellUpdate);
  view.onDuelUpdate.append(onCellUpdate);
  view.modalController.onUpdate.append(onCellUpdate);

  let enableActions: CardAction<unknown>[];
  let action: (Action: DuelistAction) => void = () => {};
  let selectedEntitiesValidator: (selectedEntities: DuelEntity[]) => boolean = () => true;
  let selectableEntities: DuelEntity[];
  const onWaitStart: (args: WaitStartEventArg) => void = (args) => {
    selectedList.reset();
    action = args.resolve;
    enableActions = args.enableActions;
    selectableEntities = args.selectableEntities;
    selectedEntitiesValidator = args.entitiesValidator;
  };
  view.onWaitStart.append(onWaitStart);

  let draggingAction: CardActionWIP<unknown> | undefined;
  let canAcceptDrop = false;
  const onDragStart = (action: CardActionWIP<unknown>) => {
    draggingAction = action;
    canAcceptDrop = action.validate()?.includes(cell) || false;
    onCellUpdate();
  };
  const onDragEnd = () => {
    draggingAction = undefined;
    canAcceptDrop = false;
    onCellUpdate();
  };
  view.onDragStart.append(onDragStart);
  view.onDragEnd.append(onDragEnd);

  const onPhaseButtonClick = (phase: TDuelPhase) => {
    console.log(phase);
    action({
      phaseChange: phase,
    });
  };
  const onActionButtonClick = (...entities: DuelEntity[]) => {
    const map = Map.groupBy(enableActions, (action) => action.entity);
    if (entities.length === 1) {
      cell.field.duel.view.modalController
        .selectAction(view, {
          title: "行動を選択。",
          actions: (map.get(entities[0]) as CardActionWIP<unknown>[]) || [],
          cancelable: true,
        })
        .then((_action) => {
          action({
            actionWIP: _action,
          });
        });
      return;
    }
    //TODO デッキ発動、墓地発動、エクストラデッキ発動
  };

  const dragover = (ev: DragEvent) => {
    ev.preventDefault();
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
  };
  const drop = (ev: DragEvent) => {
    ev.preventDefault();
    console.log("drop", ev, canAcceptDrop, draggingAction);
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
    try {
      if (canAcceptDrop && draggingAction) {
        console.log(draggingAction, cell);
        action({
          actionWIP: { ...draggingAction, cell },
        });
      }
    } finally {
      view.removeDraggingAction();
    }
  };
  const canAction = (...entities: DuelEntity[]) => {
    console.log(view.modalController.states);
    console.log(Object.values(view.modalController.states).some((stat) => stat === "Shown"));
    if (!enableActions) {
      return false;
    }
    if (view.waitMode !== "SelectFieldAction") {
      return false;
    }
    if (Object.values(view.modalController.states).some((stat) => stat === "Shown")) {
      return false;
    }
    return enableActions.filter((action) => entities.includes(action.entity)).length > 0;
  };
</script>

<td class={`duel_field_cell duel_field_cell_${cell.cellType}`} colspan={cell.cellType === "Hand" ? 7 : 1}>
  <div
    class={`${canAcceptDrop ? "can_accept_drop" : ""}`}
    role="listitem"
    style="min-height:90px;padding:5px"
    ondragover={(ev) => dragover(ev)}
    ondrop={(ev) => drop(ev)}
  >
    {#if cell.cellType === "PhaseButton"}
      <div>【{view.duel.phase}】</div>
      {#if view.waitMode === "SelectFieldAction"}
        {#if !view.duel.isEnded}
          {#each view.duel.nextPhaseList as phase}
            <div><button class="phase_button" onclick={() => onPhaseButtonClick(phase)}>{phase}</button></div>
          {/each}
        {/if}
      {/if}
    {:else if cell.cellType === "Hand"}
      <div class="flex" style="  margin: 0 auto;">
        {#each cell.cardEntities as entity}
          <button disabled={!canAction(entity)} class="action_button {canAction(entity) && 'action_button_enable'}" onclick={() => onActionButtonClick(entity)}>
            <DuelCard {entity} isSelectable={selectableEntities && selectableEntities.includes(entity)} bind:selectedList />
          </button>
        {/each}
      </div>
    {:else}
      <div>
        <button
          disabled={!canAction(...cell.cardEntities)}
          class="action_button {canAction(...cell.cardEntities) && 'action_button_enable'}"
          onclick={() => onActionButtonClick(...cell.cardEntities)}
        >
          {#if cell.cardEntities.length > 0}
            <DuelCard entity={cell.cardEntities[0]} isSelectable={selectableEntities && selectableEntities.includes(cell.cardEntities[0])} bind:selectedList />
          {/if}
          {#if cell.cellType === "Deck" || cell.cellType === "ExtraDeck" || cell.cellType === "Graveyard" || cell.cellType === "Banished"}
            <div>{cell.cardEntities.length}枚</div>
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

  .action_button_enable {
    position: relative;
  }
  /* ボタンの波紋 */
  .action_button_enable::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    border: 0.2rem solid red;
    border-radius: 30%;
    background-color: transparent;
    box-sizing: border-box;
    pointer-events: none;
    animation: pulsate 1.5s linear infinite;
  }

  .pulse-btn::after {
    animation-delay: 1s;
  }

  /* ボタンの波紋が広がっていくアニメーション */
  @keyframes pulsate {
    0% {
      transform: scale(1.2);
      opacity: 0.8;
    }

    80% {
      transform: scale(1.3);
      opacity: 0;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
  .phase_button {
    padding: 0 10px;
    font-size: x-large;
    border: 2px solid #000;
    background: #fff;
    font-weight: 700;
    line-height: 1.5;
    display: inline-block;
    padding: 0.2rem 1rem;
    cursor: pointer;
  }
  .phase_button:hover {
    color: #fff;
    background: #000;
  }
  .duel_field_cell_Hand > div {
    display: flex;
  }
  .duel_field_cell_Hand {
    background-color: aliceblue;
  }
  .duel_field_cell_Deck {
    background-color: sienna;
  }
  .duel_field_cell_MonsterZone {
    background-color: lightsalmon;
  }
  .duel_field_cell_SpellAndTrapZone {
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

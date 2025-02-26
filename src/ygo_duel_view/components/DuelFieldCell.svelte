<script lang="ts">
  import { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
  import { type DuelistAction, type TDuelPhase } from "@ygo_duel/class/Duel";

  import DuelCard, { type TCardState } from "@ygo_duel_view/components/DuelCard.svelte";
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

  let enableActions: CardActionWIP<unknown>[] = [];
  let action: (Action: DuelistAction) => void = () => {};
  let selectedEntitiesValidator: (selectedEntities: DuelEntity[]) => boolean = () => true;
  let selectableEntities: DuelEntity[];
  const onWaitStart: (args: WaitStartEventArg) => void = (args) => {
    selectedList.reset();
    action = args.resolve;
    enableActions = args.enableActions as CardActionWIP<unknown>[];
    selectableEntities = args.selectableEntities;
    selectedEntitiesValidator = args.entitiesValidator;
  };
  view.onWaitStart.append(onWaitStart);

  let draggingActions: CardActionWIP<unknown>[] | undefined;
  let canAcceptDrop = false;
  const onDragStart = (actions: CardActionWIP<unknown>[]) => {
    draggingActions = actions;
    canAcceptDrop = actions.some((action) => action.validate()?.includes(cell)) || false;
    onCellUpdate();
  };
  const onDragEnd = () => {
    draggingActions = undefined;
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

  const dragover = (ev: DragEvent) => {
    ev.preventDefault();
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
  };
  const drop = (ev: DragEvent) => {
    ev.preventDefault();
    console.log("drop", ev, canAcceptDrop, draggingActions);
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
    try {
      if (canAcceptDrop && draggingActions) {
        console.log(draggingActions, cell);
        if (draggingActions.length === 1) {
          action({
            actionWIP: { ...draggingActions[0], cell },
          });
        } else if (draggingActions.length > 1) {
          cell.field.duel.view.modalController.cancelAll();
          cell.field.duel.view.modalController.selectAction(cell.field.duel.view, {
            title: "選択",
            actions: draggingActions,
            cancelable: false,
          });
        }
      }
    } finally {
      view.removeDraggingActions();
    }
  };
  const validateActions = (...entities: DuelEntity[]): TCardState => {
    if (selectableEntities && selectableEntities.find((e1) => entities.find((e2) => e1 === e2))) {
      console.log(
        selectableEntities && selectableEntities.map((e) => e.seq),
        entities.map((e) => e.seq)
      );
      return "Selectable";
    }
    if (!enableActions || enableActions.length === 0) {
      return "Disabled";
    }
    if (view.waitMode !== "SelectFieldAction") {
      return "Disabled";
    }
    if (Object.values(view.modalController.states).some((stat) => stat === "Shown")) {
      return "Disabled";
    }
    const actions = enableActions.filter((action) => entities.includes(action.entity));
    if (actions.length === 0) {
      return "Disabled";
    }
    if (actions.length > 1) {
      return "Clickable";
    }
    if (enableActions[0].playType === "RuleDraw") {
      return "Draggable";
    }
    if (["Deck", "ExtraDeck", "Graveyard", "Banished"].includes(cell.cellType)) {
      return "Clickable";
    }
    if (actions[0].entity !== entities[0]) {
      return "Clickable";
    }
    const tmp = actions[0].validate();
    return tmp && tmp.length > 0 ? "Draggable" : "Clickable";
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
          <DuelCard
            {entity}
            state={validateActions(entity)}
            actions={enableActions.filter((action) => action.entity === entity)}
            cardActionResolve={undefined}
            bind:selectedList
          />
        {/each}
      </div>
    {:else}
      <div>
        {#if cell.cardEntities.length > 0}
          <DuelCard
            entity={cell.cardEntities[0]}
            state={validateActions(...cell.cardEntities)}
            actions={enableActions.filter((action) => action.entity === cell.cardEntities[0])}
            cardActionResolve={undefined}
            bind:selectedList
          />
        {/if}
        {#if cell.cellType === "Deck" || cell.cellType === "ExtraDeck" || cell.cellType === "Graveyard" || cell.cellType === "Banished"}
          <div>{cell.cardEntities.length}枚</div>
        {/if}
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

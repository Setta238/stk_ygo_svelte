<script lang="ts">
  import { crossfade } from "svelte/transition";
  import { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
  import { type DuelistAction, type TDuelPhase } from "@ygo_duel/class/Duel";

  import DuelCard, { type TCardState } from "@ygo_duel_view/components/DuelCard.svelte";
  import { DuelEntity, type CardAction, type CardActionWIP } from "@ygo_duel/class/DuelEntity";
  import type { AnimationStartEventArg, DuelViewController, WaitStartEventArg } from "@ygo_duel_view/class/DuelViewController";
  import {} from "@stk_utils/funcs/StkArrayUtils";
  import { cardCrossFade } from "@ygo_duel_view/components/DuelDesk.svelte";
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
    animationArg = undefined;
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
  const [send, receive] = cardCrossFade;

  let animationArg: AnimationStartEventArg | undefined = undefined;
  const onCrossFade = (args: AnimationStartEventArg) => {
    if (cell === args.to || cell.entities.includes(args.entity)) {
      animationArg = args;
      console.log(animationArg);
      console.log(animationArg && animationArg.entity);
      console.log(animationArg && animationArg.entity && animationArg.to === cell);
      console.log(animationArg && animationArg.entity && animationArg.to === cell && animationArg.index === "Top");
      setTimeout(() => {
        animationArg = undefined;
        if (cell === args.to) {
          args.resolve();
        }
      }, 1200);
    }
  };
  view.onAnimation.append(onCrossFade);

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
    class={`duel_card_wrapper ${canAcceptDrop ? "can_accept_drop" : ""}`}
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
      {#each cell.cardEntities as entity}
        {#if animationArg && animationArg.entity && animationArg.to === cell && animationArg.index === "Bottom"}
          <div class="card_animation_receiver" in:receive={{ key: animationArg.entity.seq }}>
            <DuelCard entity={animationArg.entity} state="Disabled" actions={[]} cardActionResolve={undefined} showInfo={false} />
          </div>
        {/if}
        {#if !animationArg || animationArg.entity.seq !== entity.seq}
          <div out:send={{ key: entity.seq }}>
            <DuelCard
              {entity}
              state={validateActions(entity)}
              actions={enableActions.filter((action) => action.entity === entity)}
              cardActionResolve={undefined}
              showInfo={true}
              bind:selectedList
            />
          </div>
        {/if}
        {#if animationArg && animationArg.entity && animationArg.to === cell && animationArg.index === "Top"}
          <div class="card_animation_receiver" in:receive={{ key: animationArg.entity.seq }}>
            <DuelCard entity={animationArg.entity} state="Disabled" actions={[]} cardActionResolve={undefined} showInfo={false} />
          </div>
        {/if}
      {/each}
    {:else}
      {#if animationArg && animationArg.entity && animationArg.to === cell && animationArg.index === "Bottom"}
        <div class="card_animation_receiver" in:receive={{ key: animationArg.entity.seq }}>
          <DuelCard entity={animationArg.entity} state="Disabled" actions={[]} cardActionResolve={undefined} showInfo={false} />
        </div>
      {/if}
      {#if cell.cardEntities.length > 0}
        {#if !animationArg || animationArg.entity.seq !== cell.cardEntities[0].seq}
          <div out:send={{ key: cell.cardEntities[0].seq }}>
            <DuelCard
              entity={cell.cardEntities[0]}
              state={validateActions(...cell.cardEntities)}
              actions={enableActions.filter((action) => action.entity === cell.cardEntities[0])}
              cardActionResolve={undefined}
              showInfo={!animationArg || animationArg.entity.seq !== cell.cardEntities[0].seq}
              bind:selectedList
            />
          </div>
        {/if}
        {#if cell.cellType === "Deck" || cell.cellType === "ExtraDeck" || cell.cellType === "Graveyard" || cell.cellType === "Banished"}
          <div class="bottom_text">{cell.cardEntities.length}枚</div>
        {/if}
      {/if}
      {#if animationArg && animationArg.entity && animationArg.to === cell && animationArg.index === "Top"}
        <div class="card_animation_receiver" in:receive={{ key: animationArg.entity.seq }}>
          <DuelCard entity={animationArg.entity} state="Disabled" actions={[]} cardActionResolve={undefined} />
        </div>
      {/if}
    {/if}
  </div>
</td>

<style>
  .flex {
    display: flex;
  }
  .v_flex {
    display: flex;
    flex-direction: column;
  }
  .duel_field_cell {
    background-color: slategrey;
    width: 12rem;
    padding: 0px;
  }
  .duel_field_cell > div {
    border: solid 1px #778ca3;
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .duel_field_cell > div.can_accept_drop {
    border: dotted 3px red;
  }
  .duel_card_wrapper {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .duel_card_wrapper > .card_animation_receiver {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
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
  .duel_field_cell > .duel_card_wrapper {
    display: flex;
    flex-direction: column;
  }
  .duel_field_cell.duel_field_cell_Hand > .duel_card_wrapper {
    display: flex;
    flex-direction: row;
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

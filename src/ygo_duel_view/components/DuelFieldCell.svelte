<script lang="ts">
  import { crossfade } from "svelte/transition";
  import { DuelFieldCell, stackCellTypes } from "@ygo_duel/class/DuelFieldCell";
  import { type DuelistResponse, type TDuelPhase } from "@ygo_duel/class/Duel";

  import DuelCard, { type TCardState } from "@ygo_duel_view/components/DuelCard.svelte";
  import { DuelEntity } from "@ygo_duel/class/DuelEntity";
  import type { AnimationStartEventArg, DuelViewController, WaitStartEventArg } from "@ygo_duel_view/class/DuelViewController";
  import {} from "@stk_utils/funcs/StkArrayUtils";
  import { cardCrossFade } from "@ygo_duel_view/components/DuelDesk.svelte";
  import { CardAction, type ICardAction } from "@ygo_duel/class/DuelCardAction";
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

  let enableActions: ICardAction<unknown>[] = [];
  let responseResolve: (action: DuelistResponse) => void = () => {};
  let selectedEntitiesValidator: (selectedEntities: DuelEntity[]) => boolean = () => true;
  let selectableEntities: DuelEntity[];
  const onWaitStart: (args: WaitStartEventArg) => void = (args) => {
    animationArg = undefined;
    selectedList.reset();
    responseResolve = args.resolve;
    enableActions = args.enableActions as ICardAction<unknown>[];
    selectableEntities = args.selectableEntities;
    selectedEntitiesValidator = args.entitiesValidator;
  };
  view.onWaitStart.append(onWaitStart);

  let draggingActions: ICardAction<unknown>[] | undefined;
  let canAcceptDrop = false;
  const onDragStart = (actions: ICardAction<unknown>[]) => {
    draggingActions = actions;
    canAcceptDrop = actions.some((action) => action.validate(view.duel.chainBlockInfos)?.includes(cell)) || false;
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
      const resolve = args.resolve;
      cell = cell;
      setTimeout(() => {
        animationArg = undefined;
        args.count++;
        if (args.count > 1) {
          resolve();
        }
      }, 600);
    }
  };
  view.onAnimation.append(onCrossFade);

  const onPhaseButtonClick = (phase: TDuelPhase) => {
    responseResolve({
      phaseChange: phase,
    });
  };

  const canAction = () => {
    return (
      cell.isStackCell && cell.entities.flatMap((e) => e.actions).filter((act) => enableActions.map((a) => a.seq).some((seq) => seq === act.seq)).length > 0
    );
  };

  const onCellClick = () => {
    cell.field.duel.view.infoBoardState = "Log";

    if (cell.isStackCell) {
      cell.field.duel.view.infoBoardState = "CellInfo";
      cell.field.duel.view.infoBoardCell = cell;
      cell.field.duel.view.requireUpdate();
      const actions = cell.entities.flatMap((e) => e.actions).filter((act) => enableActions.map((a) => a.seq).some((seq) => seq === act.seq));
      console.log(enableActions);
      console.log(actions);
      if (actions.length) {
        const view = cell.field.duel.view;
        view.modalController
          .selectAction(view, {
            title: "カードを選択。",
            actions: actions,
            cancelable: true,
          })
          .then((_action) => {
            responseResolve({
              action: _action,
            });
          });
        return;
      }
    }
    cell.field.duel.view.requireUpdate();
    console.info(cell);
  };

  const dragover = (ev: DragEvent) => {
    ev.preventDefault();
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
  };
  const drop = (ev: DragEvent) => {
    ev.preventDefault();
    console.info("drop", ev, canAcceptDrop, draggingActions);
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
    try {
      if (canAcceptDrop && draggingActions) {
        console.info(draggingActions, cell);
        if (draggingActions.length === 1) {
          const action = draggingActions[0].getClone();
          action.cell = cell;
          responseResolve({ action: action });
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
    if (cell.isStackCell) {
      return "Clickable";
    }
    if (actions[0].entity !== entities[0]) {
      return "Clickable";
    }
    const tmp = actions[0].validate(view.duel.chainBlockInfos);
    return tmp && tmp.length > 0 ? "Draggable" : "Clickable";
  };
</script>

<td class={`duel_field_cell duel_field_cell_${cell.cellType}`} colspan={cell.cellType === "Hand" ? 7 : 1}>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class={`duel_card_wrapper ${cell.cellType} ${canAcceptDrop ? "can_accept_drop" : ""} ${canAction() ? "can_action" : ""}`}
    role="listitem"
    onclick={onCellClick}
    ondragover={(ev) => dragover(ev)}
    ondrop={(ev) => drop(ev)}
  >
    {#if cell.cellType === "Disable"}
      {#if cell.row === 3}
        {#if cell.column === 1}
          <div class="phase_display"><span>{String(cell.field.duel.clock.turn).padStart(2, "0")}</span>{cell.field.duel.phase.toUpperCase()}</div>
        {:else if cell.column === 3}
          <div class="lifepoint_display">
            <div>{cell.field.duel.duelists.Above.lp}</div>
            <div>{cell.field.duel.duelists.Below.lp}</div>
          </div>
        {:else if cell.column === 5}
          {#if view.waitMode === "SelectFieldAction"}
            {#if !view.duel.isEnded}
              {#each view.duel.nextPhaseList as phase}
                <div><button class="phase_button" onclick={() => onPhaseButtonClick(phase)}>{phase.toUpperCase()}</button></div>
              {/each}
            {/if}
          {/if}
        {/if}
      {/if}
    {:else if cell.cellType === "Hand"}
      {#if animationArg && animationArg.entity && animationArg.to === cell && animationArg.index === "Top"}
        <div class="card_animation_receiver {cell.cellType}" in:receive={{ key: animationArg.entity.seq }}>
          <DuelCard entity={animationArg.entity} state="Disabled" actions={[]} cardActionResolve={undefined} />
        </div>
      {/if}
      {#each cell.cardEntities as entity}
        {#if !animationArg || animationArg.entity.seq !== entity.seq}
          <div out:send={{ key: entity.seq }}>
            <DuelCard
              {entity}
              state={validateActions(entity)}
              actions={enableActions.filter((action) => action.entity === entity)}
              cardActionResolve={undefined}
              bind:selectedList
            />
          </div>
        {/if}
      {/each}

      {#if animationArg && animationArg.entity && animationArg.to === cell && animationArg.index === "Bottom"}
        <div class="card_animation_receiver {cell.cellType}" in:receive={{ key: animationArg.entity.seq }}>
          <DuelCard entity={animationArg.entity} state="Disabled" actions={[]} cardActionResolve={undefined} />
        </div>
      {/if}
    {:else}
      {#if animationArg && animationArg.entity && animationArg.to === cell && animationArg.index === "Bottom"}
        <div style="position: absolute;" class="card_animation_receiver" in:receive={{ key: animationArg.entity.seq }}>
          <DuelCard entity={animationArg.entity} state="Disabled" actions={[]} cardActionResolve={undefined} />
        </div>
      {/if}
      {#if cell.cardEntities.length > 0}
        {#each cell.cardEntities.toReversed() as entity, index}
          {#if !animationArg || animationArg.entity.seq !== entity.seq}
            <div style="position: absolute; display:flex;justify-content: center;" out:send={{ key: entity.seq }}>
              <DuelCard
                {entity}
                state={index === 0 && !cell.isStackCell ? validateActions(...cell.cardEntities) : undefined}
                actions={index === 0 ? enableActions.filter((action) => cell.cardEntities.includes(action.entity)) : undefined}
                cardActionResolve={undefined}
                bind:selectedList
              />
            </div>
          {/if}
        {/each}
        {#if cell.cardEntities[0].battlePosition}
          <div style="position: absolute; bottom:0rem">
            【{cell.cardEntities[0].battlePosition === "Attack"
              ? "攻撃表示"
              : cell.cardEntities[0].battlePosition === "Defense"
                ? "表守備表示"
                : "裏守備表示"}】
          </div>
        {/if}
      {/if}
      {#if cell.isStackCell}
        <div class="badge">{cell.cardEntities.length}</div>
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
    box-sizing: border-box;
    background-color: slategrey;
    max-width: 12rem;
    width: 12rem;
    padding: 0px;
    border: solid 1px #778ca3;
  }
  .duel_field_cell > div {
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .duel_field_cell > div.can_accept_drop {
    border: dotted 3px red;
  }
  .duel_card_wrapper {
    display: block;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 7rem;
    padding: 0rem;
    pointer-events: auto;
  }
  .duel_card_wrapper > .card_animation_receiver {
    position: absolute;
    max-width: 4rem;
    margin: auto;
  }
  .duel_card_wrapper.Hand {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .duel_card_wrapper.Hand > .card_animation_receiver {
    position: static;
    margin: 0px;
  }
  .badge {
    position: absolute;
    top: 0.3rem;
    left: 0.3rem;
    background-color: red;
    color: white;
    border-radius: 100%;
    height: 1.1rem;
    width: 1.1rem;
    text-align: center;
    box-shadow: 0 0 0.5rem #333;
  }
  .phase_display {
    font-size: 1.5rem;
    position: relative;
    overflow: hidden;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    border: 2px solid #000;
    background-color: antiquewhite;
    color: black;
  }

  .phase_display span {
    z-index: 1;
    left: 0;
    margin-right: 0.5rem;
    padding: 0rem 0.5rem;
    background-color: #000;
    color: #fff;
  }

  .lifepoint_display {
    visibility: hidden;
    margin: 0px;
    min-height: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: black;
    line-height: 1.1;
  }
  @media screen and (max-width: 1400px) {
    .lifepoint_display {
      visibility: inherit;
    }
  }
  .lifepoint_display div {
    padding: 0.2rem 1rem;
    font-size: 1.4rem;
    background-color: snow;
  }
  .phase_button {
    padding: 0 10px;
    font-size: 1.4rem;
    border: 2px solid #000;
    background: #fff;
    font-weight: 700;
    line-height: 1.5;
    display: inline-block;
    padding: 0.2rem 1rem;
    cursor: pointer;
    border-radius: 0.5rem;
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
  /* ボタンの波紋 */
  .can_action::before,
  .can_action::before,
  .can_action::after,
  .can_action::after {
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
    border: 0.2rem solid yellow;
    border-radius: 30%;
    box-sizing: border-box;
    pointer-events: none;
    animation: pulsate 2s ease-out infinite;
  }

  /* ボタンの波紋が広がっていくアニメーション */
  @keyframes pulsate {
    0% {
      transform: scale(0.9);
      filter: blur(0.3rem);
      opacity: 0.8;
    }

    50% {
      transform: scale(0.8);
      filter: blur(0.5rem);
      opacity: 0.6;
    }
    100% {
      transform: scale(0.9);
      filter: blur(0.3rem);
      opacity: 0.8;
    }
  }
</style>

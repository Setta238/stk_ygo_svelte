<script lang="ts">
  import { SystemError, type DuelistResponse } from "@ygo_duel/class/Duel";

  import DuelCard, { type TCardState } from "@ygo_duel_view/components/DuelCard.svelte";
  import { DuelEntity } from "@ygo_duel/class/DuelEntity";
  import type { AnimationStartEventArg, DuelViewController, WaitStartEventArg } from "@ygo_duel_view/class/DuelViewController";
  import {} from "@stk_utils/funcs/StkArrayUtils";
  import { cardCrossFade } from "@ygo_duel_view/components/DuelDesk.svelte";
  import { type ICardAction } from "@ygo_duel/class/DuelCardAction";
  import { actualCounterEmojiDic, type TActualCounterName } from "@ygo_duel/class/DuelCounter";
  import type { TDuelPhase } from "@ygo_duel/class/DuelPeriod";
  import type { Duelist } from "@ygo_duel/class/Duelist";
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

  let activator: Duelist | undefined = undefined;
  let enableActions: ICardAction<unknown>[] = [];
  let responseResolve: (action: DuelistResponse) => void = () => {};
  let selectedEntitiesValidator: (selectedEntities: DuelEntity[]) => boolean = () => true;
  let selectableEntities: DuelEntity[];
  let targetsInPreviousChainBlocks: DuelEntity[] = [];
  const onWaitStart: (args: WaitStartEventArg) => void = (args) => {
    animationArg = undefined;
    selectedList.reset();
    activator = args.activator;
    responseResolve = args.resolve;
    enableActions = args.enableActions as ICardAction<unknown>[];
    targetsInPreviousChainBlocks = args.chainBlockInfos.flatMap((info) => info.selectedEntities).getDistinct();
    selectableEntities = args.selectableEntities;
    selectedEntitiesValidator = args.entitiesValidator;
  };
  view.onWaitStart.append(onWaitStart);

  const onWaitEnd = () => {
    activator = undefined;
    enableActions = [];
    responseResolve = () => {};
    selectedEntitiesValidator = () => true;
    selectableEntities = [];
    targetsInPreviousChainBlocks = [];
  };

  view.onWaitEnd.append(onWaitEnd);
  let draggingActions: ICardAction<unknown>[] | undefined;
  let canAcceptDrop = false;
  const onDragStart = (actions: ICardAction<unknown>[]) => {
    draggingActions = actions;
    canAcceptDrop = actions.some((action) => action.validate(view.duel.priorityHolder, view.duel.chainBlockInfos, false)?.includes(cell)) || false;
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
    activator = undefined;
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

      if (actions.length) {
        if (!activator) {
          return;
        }

        const view = cell.field.duel.view;
        view.modalController
          .selectAction(view, {
            title: "カードを選択。",
            activator,
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
          action.pos = draggingActions[0].pos;
          responseResolve({ action: action });
        } else if (draggingActions.length > 1) {
          if (!activator) {
            throw new SystemError("想定されない状態");
          }
          cell.field.duel.view.modalController.cancelAll();
          cell.field.duel.view.modalController.selectAction(cell.field.duel.view, {
            title: "選択",
            activator,
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
    if (view.waitMode === "Animation") {
      return "Disabled";
    }

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
    if (cell.isStackCell) {
      return "Clickable";
    }
    if (actions[0].entity !== entities[0]) {
      return "Clickable";
    }
    const tmp = actions[0].validate(view.duel.priorityHolder, view.duel.chainBlockInfos, false);
    return tmp && tmp.length > 0 ? "Draggable" : "Clickable";
  };
</script>

<td
  class={`duel_field_cell duel_field_cell_${cell.cellType} ${cell.linkArrowSources.length === 0 ? "" : "duel_field_cell_linked"}`}
  colspan={cell.cellType === "Hand" ? 7 : 1}
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class={`duel_card_wrapper ${cell.cellType} ${canAcceptDrop ? "can_accept_drop" : ""} ${canAction() ? "can_action" : ""} `}
    role="listitem"
    onclick={onCellClick}
    ondragover={(ev) => dragover(ev)}
    ondrop={(ev) => drop(ev)}
  >
    {#if cell.isDisabledCell}
      <!-- 使用不可セルの場合-->
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
      <!-- 手札の場合-->
      {#if animationArg && animationArg.entity && animationArg.to === cell && animationArg.index === "Top"}
        <div class="card_animation_receiver {cell.cellType}" in:receive={{ key: animationArg.entity.seq }}>
          <DuelCard entity={animationArg.entity} state="Disabled" actions={[]} cardActionResolve={undefined} />
        </div>
      {/if}
      {#each cell.visibleEntities as entity}
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

      {#if animationArg && animationArg.entity && animationArg.to === cell && animationArg.index !== "Top"}
        <div class="card_animation_receiver {cell.cellType}" in:receive={{ key: animationArg.entity.seq }}>
          <DuelCard entity={animationArg.entity} state="Disabled" actions={[]} cardActionResolve={undefined} />
        </div>
      {/if}
    {:else}
      <!-- それ以外のセルの場合-->
      {#if animationArg && animationArg.entity && animationArg.to === cell && animationArg.index !== "Top"}
        <!-- アニメーションの目的地-->
        <div style="position: absolute;" class="card_animation_receiver" in:receive={{ key: animationArg.entity.seq }}>
          <DuelCard entity={animationArg.entity} state="Disabled" actions={[]} cardActionResolve={undefined} />
        </div>
      {/if}
      {#if cell.visibleEntities.length > 0}
        {#each cell.visibleEntities
          .map((entity, index) => {
            // 元々の配列だと上下が逆になってしまうので、反転してループする。
            // index===0を判定したいので、反転する前にindexを付与する。
            return { index, entity };
          })
          .toReversed() as item}
          {#if !animationArg || animationArg.entity.seq !== item.entity.seq}
            {#if targetsInPreviousChainBlocks.includes(item.entity)}
              <div style="position: absolute; top:0rem">｛効果対象｝</div>
            {/if}
            <div style="position: absolute; display:flex;justify-content: center;" out:send={{ key: item.entity.seq }}>
              <DuelCard
                entity={item.entity}
                state={!cell.isStackCell && item.index === 0 ? validateActions(...cell.visibleEntities) : undefined}
                actions={item.index === 0 ? enableActions.filter((action) => cell.visibleEntities.includes(action.entity)) : undefined}
                cardActionResolve={undefined}
                bind:selectedList
              />
            </div>
          {/if}
        {/each}
        {#if cell.visibleEntities[0].battlePosition}
          <!-- 表示形式、カウンターの表示-->
          <div style="position: absolute; bottom:0rem">
            【{cell.visibleEntities[0].battlePositionName}】
            {#each Object.keys(cell.visibleEntities[0].status.maxCounterQty) as TActualCounterName[] as counter}
              【
              {actualCounterEmojiDic[counter]}{cell.visibleEntities[0].counterHolder.getQty(counter)}
              {#if cell.visibleEntities[0].status.maxCounterQty[counter] ?? 9999 < 100}
                /{cell.visibleEntities[0].status.maxCounterQty[counter]}
              {/if}
              】
            {/each}
          </div>
        {/if}
      {/if}
      {#if cell.isStackCell}
        <!-- バッチ-->
        <div class="badge">{cell.visibleEntities.length}</div>
      {/if}
      {#if animationArg && animationArg.entity && animationArg.to === cell && animationArg.index === "Top"}
        <!-- アニメーションの目的地-->
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
  .duel_field_cell_linked {
    background-color: #ffe9a7;
    z-index: -1;
    background-image:
      linear-gradient(30deg, #ffc107 12%, transparent 12.5%, transparent 87%, #ffc107 87.5%, #ffc107),
      linear-gradient(150deg, #ffc107 12%, transparent 12.5%, transparent 87%, #ffc107 87.5%, #ffc107),
      linear-gradient(30deg, #ffc107 12%, transparent 12.5%, transparent 87%, #ffc107 87.5%, #ffc107),
      linear-gradient(150deg, #ffc107 12%, transparent 12.5%, transparent 87%, #ffc107 87.5%, #ffc107),
      linear-gradient(60deg, #ffc10777 25%, transparent 25.5%, transparent 75%, #ffc10777 75%, #ffc10777),
      linear-gradient(60deg, #ffc10777 25%, transparent 25.5%, transparent 75%, #ffc10777 75%, #ffc10777);
    background-size: 40px 70px;
    background-position:
      0 0,
      0 0,
      20px 35px,
      20px 35px,
      0 0,
      20px 35px;
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

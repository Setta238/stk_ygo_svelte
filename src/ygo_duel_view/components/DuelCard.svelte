<script lang="ts" module>
  export type TCardState = "Selectable" | "Clickable" | "Draggable" | "Disabled";
</script>

<script lang="ts">
  import type { DuelistAction } from "@ygo_duel/class/Duel";

  import { DuelEntity, type CardAction, type CardActionWIP } from "@ygo_duel/class/DuelEntity";
  import { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
  import type { WaitStartEventArg } from "@ygo_duel_view/class/DuelViewController";
  export let entity: DuelEntity;
  export let state: TCardState = "Disabled";
  export let selectedList = [] as DuelEntity[];
  export let isVisibleForcibly = false;
  export let showInfo = false;
  export let actions: CardActionWIP<unknown>[] = [];
  export let cardActionResolve: ((action?: CardActionWIP<unknown>, cell?: DuelFieldCell) => void) | undefined;
  let isSelected = false;
  let duelistActionResolve: (Action: DuelistAction) => void = () => {};
  let qty: number | undefined;
  const onWaitStart: (args: WaitStartEventArg) => void = (args) => {
    isSelected = false;
    qty = args.qty;
    duelistActionResolve = args.resolve;
  };
  entity.field.duel.view.onWaitStart.append(onWaitStart);
  let isDragging = false;
  const click = () => {
    console.log(state, actions, cardActionResolve);
    if (state === "Disabled") {
      return;
    }
    if (state === "Selectable") {
      isSelected = !isSelected;
      selectedList = isSelected ? [...selectedList, entity] : selectedList.filter((e) => e !== entity);
      if (qty && qty === 1) {
        duelistActionResolve({
          selectedEntities: [entity],
        });
      }
      console.log(entity, isSelected, selectedList);
      return;
    }
    if (actions.length === 1) {
      if (cardActionResolve) {
        cardActionResolve(actions[0]);
        return;
      }
      duelistActionResolve({
        actionWIP: actions[0],
      });
      return;
    }
    const view = entity.field.duel.view;
    view.modalController
      .selectAction(view, {
        title: "行動を選択。",
        actions: actions,
        cancelable: true,
      })
      .then((_action) => {
        duelistActionResolve({
          actionWIP: _action,
        });
      });
    return;
  };

  const dragStart = (ev: DragEvent) => {
    console.log("drag start", ev, actions);
    entity.field.duel.view.setDraggingActions(actions);
    isDragging = true;
  };

  const dragEnd = (ev: DragEvent) => {
    console.log("drag end", ev, actions);
    entity.field.duel.view.removeDraggingActions();
    if (ev.dataTransfer) {
      isDragging = false;
    }
  };
</script>

{#if entity.face === "FaceUp" || isVisibleForcibly || (entity.controller.seat === "Below" && entity.isUnderControl)}
  <button
    class="duel_card button_style_reset {entity.status.monsterCategories?.join(' ') || ''} {isSelected
      ? 'duel_card_selected'
      : ''} {state} duel_card_{entity.orientation} {isDragging ? 'isDragging' : ''}"
    disabled={entity.field.duel.isEnded || state === "Disabled"}
    draggable={state === "Draggable"}
    on:dragstart={dragStart}
    on:dragend={dragEnd}
    on:click={click}
  >
    <div class="duel_card duel_card_face_up">
      <div class="duel_card_row">
        <div>{entity.nm}</div>
        <div>{entity.attr.join(" ")}</div>
      </div>
      <div class="duel_card_row">
        <div>{"★".repeat(entity.status.level || 0)}</div>
        <div>{"★".repeat(entity.status.rank || 0)}</div>
      </div>
      {#if entity.status.monsterCategories?.includes("Pendulum")}
        <div class="duel_card_row">
          <div>◀ {entity.psL}</div>
          <div>{entity.psR} ▶</div>
        </div>
      {/if}
      <div class="duel_card_row enum">
        {#each entity.status.monsterCategories ?? [] as cat}<div>{cat}</div>{/each}
      </div>
      <div class="duel_card_row">
        <div>{entity.type}</div>
        <div>{entity.atk ?? "?"} / {entity.def ?? "?"}</div>
      </div>
    </div>
  </button>
{:else}
  <div class="duel_card duel_card_face_down"><div></div></div>
{/if}
{#if entity.battlePotion && showInfo}
  <div>【{entity.battlePotion === "Attack" ? "攻撃表示" : entity.battlePotion === "Defense" ? "表守備表示" : "裏守備表示"}】</div>
{/if}

<style>
  .button_style_reset {
    display: block;
    border-radius: 0%;
    padding: 0px;
    outline: none;
    font: inherit;
    color: inherit;
    background: none;
  }
  .duel_card_row {
    padding: 0rem 0.15rem;
    display: flex;
    justify-content: space-between;
  }
  .duel_card_row.enum {
    flex-wrap: wrap;
    justify-content: left;
  }
  .duel_card_row > div {
    margin: 0 0.3rem;
  }
  .duel_card {
    margin: 0.1rem 0.3rem;
    border: solid 1px #778ca3;
  }

  .duel_card.duel_card_face_up {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 5.3rem;
  }
  .duel_card.Normal {
    background-color: cornsilk;
  }
  .duel_card.Effect {
    background-color: chocolate;
  }
  .duel_card:disabled,
  .duel_card:disabled * {
    cursor: default;
    pointer-events: none;
  }
  .duel_card.Selectable {
    display: block;
    min-width: 1px;
    height: fit-content;
    border: dotted 0.4px blue;
    pointer-events: initial;
  }
  .duel_card.duel_card_selected {
    display: block;
    min-width: 1px;
    height: fit-content;
    margin: 1px 5px;
    border: solid 4px red;
  }
  .duel_card_face_down {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4.1rem;
    height: 5.3rem;
    background-color: brown;
  }
  .duel_card_face_down > div {
    width: 30px;
    height: 50px;
    border-radius: 50%;
    margin: auto;
    background-color: black;
  }
  .action_button * {
    pointer-events: none;
  }

  .duel_card.Clickable,
  .duel_card.Draggable {
    position: relative;
  }
  /* ボタンの波紋 */
  .duel_card.Clickable::before,
  .duel_card.Draggable::before,
  .duel_card.Clickable::after,
  .duel_card.Draggable::after {
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
    border-radius: 10%;
    box-sizing: border-box;
    pointer-events: none;
    animation: pulsate 2s ease-out infinite;
  }

  .duel_card.Clickable.isDragging::before,
  .duel_card.Draggable.isDragging::before,
  .duel_card.Clickable.isDragging::after,
  .duel_card.Draggable.isDragging::after {
    content: "";
    display: none;
  }

  /* ボタンの波紋が広がっていくアニメーション */
  @keyframes pulsate {
    0% {
      transform: scale(1.05);
      filter: blur(0.2rem);
      opacity: 0.8;
    }

    50% {
      transform: scale(1.1);
      filter: blur(0.23rem);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.05);
      filter: blur(0.2rem);
      opacity: 0.8;
    }
  }
</style>

<script lang="ts" module>
  export type TCardState = "Selectable" | "Clickable" | "Draggable" | "Disabled";
</script>

<script lang="ts">
  import { monsterCategoryDic, monsterCategoryEmojiDic, monsterTypeDic, monsterTypeEmojiDic, spellCategoryDic, trapCategoryDic } from "@ygo/class/YgoTypes";

  import type { DuelistResponse } from "@ygo_duel/class/Duel";

  import { DuelEntity, type CardAction } from "@ygo_duel/class/DuelEntity";
  import { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
  import type { WaitStartEventArg } from "@ygo_duel_view/class/DuelViewController";
  export let entity: DuelEntity;
  export let state: TCardState = "Disabled";
  export let selectedList = [] as DuelEntity[];
  export let isVisibleForcibly = false;
  export let isWideMode = false;
  export let actions: CardAction<unknown>[] = [];
  export let cardActionResolve: ((action?: CardAction<unknown>, cell?: DuelFieldCell) => void) | undefined;
  export let entitySelectResolve: ((entities: DuelEntity[]) => void) | undefined = () => {};
  let isSelected = false;
  let duelistResponseResolve: (res: DuelistResponse) => void = () => {};
  export let qty: number | undefined = undefined;
  const onWaitStart: (args: WaitStartEventArg) => void = (args) => {
    isSelected = false;
    qty = args.qty;
    duelistResponseResolve = args.resolve;
  };
  entity.field.duel.view.onWaitStart.append(onWaitStart);
  let isDragging = false;
  const dblclick = () => {
    if (state === "Disabled") {
      return;
    }
    console.log(qty);
    if (state === "Selectable" && qty && qty === 1) {
      if (selectedList.some((card) => card.seq !== entity.seq)) {
        selectedList = [entity];
        return;
      }
      if (qty && qty === 1 && entitySelectResolve) {
        entitySelectResolve([entity]);
      }
    }
  };
  const click = () => {
    console.log(entity, state);
    if (entity.face === "FaceUp" || (entity.owner === entity.field.duel.duelists.Below && (entity.isUnderControl || isVisibleForcibly))) {
      entity.field.duel.view.showCardInfo(entity);
    }
    if (state === "Disabled") {
      return;
    }
    if (state === "Selectable") {
      isSelected = !isSelected;
      selectedList = isSelected ? [...selectedList, entity] : selectedList.filter((e) => e !== entity);
      return;
    }
    if (actions.length === 0) {
      return;
    }
    if (actions.length === 1) {
      if (actions[0].dragAndDropOnly) {
        return;
      }
      if (cardActionResolve) {
        cardActionResolve(actions[0]);
        return;
      }
      console.log(actions[0], duelistResponseResolve);
      duelistResponseResolve({
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
        duelistResponseResolve({
          actionWIP: _action,
        });
      });
    return;
  };

  const dragStart = (ev: DragEvent) => {
    console.info("drag start", ev, actions);
    entity.field.duel.view.setDraggingActions(actions);
    isDragging = true;
  };

  const dragEnd = (ev: DragEvent) => {
    console.info("drag end", ev, actions);
    entity.field.duel.view.removeDraggingActions();
    if (ev.dataTransfer) {
      isDragging = false;
    }
  };
</script>

{#if entity.face === "FaceUp" || isVisibleForcibly || (entity.controller.seat === "Below" && entity.isUnderControl)}
  <button
    class="duel_card button_style_reset {entity.status.kind} {entity.status.monsterCategories?.join(' ') || ''} {isSelected
      ? 'duel_card_selected'
      : ''} {state} duel_card_{entity.orientation} {isDragging ? 'isDragging' : ''} {isWideMode ? 'duel_card_wide' : ''}"
    draggable={state === "Draggable"}
    on:dragstart={dragStart}
    on:dragend={dragEnd}
    on:click={click}
    on:dblclick={dblclick}
    title={entity.nm}
  >
    <div class="duel_card duel_card_face_up">
      <div class="duel_card_row" style="position:relative">
        <div>{entity.nm}</div>
        {#each entity.attr as attr}
          <div class="monster_attr {attr}">●</div>
        {/each}
      </div>
      {#if entity.status.kind === "Monster"}
        <div class="duel_card_row">
          <div>{"★".repeat(entity.status.level || 0)}</div>
          <div>{"☆".repeat(entity.status.rank || 0)}</div>
        </div>
      {:else if entity.status.kind === "Spell" && entity.status.spellCategory}
        <div class="duel_card_row">
          <div></div>
          <div>{spellCategoryDic[entity.status.spellCategory]}魔法</div>
        </div>
      {:else if entity.status.kind === "Trap" && entity.status.trapCategory}
        <div class="duel_card_row">
          <div></div>
          <div>{trapCategoryDic[entity.status.trapCategory]}罠</div>
        </div>
      {/if}
      {#if entity.status.monsterCategories?.includes("Pendulum")}
        <div class="duel_card_row">
          <div>◀ {entity.psL}</div>
          <div>{entity.psR} ▶</div>
        </div>
      {/if}
      {#if entity.status.kind === "Monster"}
        <div class="duel_card_row">
          <div title={entity.status.monsterCategories?.join(" ")}>
            {entity.status.monsterCategories?.map((cat) => monsterCategoryEmojiDic[cat] + (isWideMode ? monsterCategoryDic[cat] : "")).join()}
          </div>
        </div>
        <div class="duel_card_row duel_card_row_wide">
          <div>
            {entity.type.map((t) => monsterTypeEmojiDic[t] + (isWideMode ? monsterTypeDic[t] : "")).join()}
          </div>
          <div>{entity.atk ?? "?"} / {entity.def ?? "?"}</div>
        </div>
      {/if}
    </div>
  </button>
{:else}
  <div class="duel_card duel_card_face_down"><div></div></div>
{/if}

<style>
  .duel_card {
    margin: 0.1rem 0.3rem;
    padding: 0.1rem;
    border: solid 1px #778ca3;
    margin: 0.1rem 0.3rem;
    padding: 0.1rem;
    border: solid 1px #778ca3;
    font-size: 0.7rem;
  }
  .duel_card_wide {
    width: 100%;
  }
  .duel_card_face_up {
    display: flex;
    flex-direction: column;
    height: 4.3rem;
    margin: 0.1rem 0.3rem;
    padding: 0.1rem;
    border: solid 1px #778ca3;
    min-width: 5rem;
    max-width: 8rem;
  }
  .duel_card_wide .duel_card_face_up {
    max-width: initial;
  }
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
    white-space: nowrap;
    max-width: 6rem;
    overflow: hidden;
  }
  .duel_card_wide .duel_card_row {
    max-width: initial;
  }
  .duel_card .monster_attr {
    position: absolute;
    right: 0rem;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 100%;
    border: solid thin;
    margin: auto 0.1rem;
  }
  .duel_card .monster_attr.Light {
    color: yellow;
    background-color: gold;
  }
  .duel_card .monster_attr.Dark {
    color: indigo;
    background-color: black;
  }
  .duel_card .monster_attr.Earth {
    color: brown;
    background-color: darkred;
  }
  .duel_card .monster_attr.Water {
    color: aqua;
    background-color: aquamarine;
  }
  .duel_card .monster_attr.Fire {
    color: crimson;
    background-color: orange;
  }
  .duel_card .monster_attr.Wind {
    color: springgreen;
    background-color: whitesmoke;
  }
  .duel_card .monster_attr.Divine {
    color: blanchedalmond;
    background-color: yellow;
  }
  .duel_card_row.enum {
    flex-wrap: wrap;
    justify-content: left;
  }
  .duel_card_row > div {
    margin: 0 0.3rem;
  }

  .duel_card_row:first-child {
    border: solid 0.01rem darkslategray;
  }
  .duel_card.Normal {
    background-color: cornsilk;
  }
  .duel_card.Effect {
    background-color: chocolate;
  }
  .duel_card.Syncro {
    background-color: snow;
  }
  .duel_card.Spell {
    background-color: forestgreen;
    color: white;
  }
  .duel_card.Disabled,
  .duel_card.Disabled * {
    cursor: default;
    pointer-events: painted;
  }
  .duel_card.Selectable {
    display: block;
    min-width: 1px;
    height: fit-content;
    border: dotted 0.2rem blue;
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
    max-width: 4.1rem;
    height: 5.3rem;
    background-color: brown;
  }
  .duel_card_face_down > div {
    width: 1.8rem;
    height: 3rem;
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
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -webkit-touch-callout: none;
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

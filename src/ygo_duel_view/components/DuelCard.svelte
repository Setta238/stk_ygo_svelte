<script lang="ts" module>
  export type TCardState = "Selectable" | "Clickable" | "Draggable" | "Disabled";
</script>

<script lang="ts">
  import { monsterCategoryDic, monsterCategoryEmojiDic, monsterTypeDic, monsterTypeEmojiDic, spellCategoryDic, trapCategoryDic } from "@ygo/class/YgoTypes";

  import { DuelEntity } from "@ygo_duel/class/DuelEntity";
  import type { DuelistResponseBase, WaitStartEventArg } from "@ygo_duel_view/class/DuelViewController";
  import type { TCardDetailMode } from "./DuelCardDetail.svelte";
  import type { Duelist } from "@ygo_duel/class/Duelist";
  import type { DummyActionInfo } from "@ygo_duel/class/DuelCardAction";
  export let entity: DuelEntity;
  export let state: TCardState = "Disabled";
  export let selectedList = [] as DuelEntity[];
  export let isVisibleForcibly = false;
  export let isWideMode = false;
  export let dummyActionInfos: DummyActionInfo[] = [];
  export let cardActionResolve: ((action?: DummyActionInfo) => void) | undefined;
  export let entitySelectResolve: ((entities: DuelEntity[]) => void) | undefined = () => {};

  let activator: Duelist | undefined = undefined;
  let isSelected = false;
  let duelistResponseResolve: (res: DuelistResponseBase) => void = () => {};
  export let qty: number | undefined = undefined;
  const onWaitStart: (args: WaitStartEventArg) => void = (args) => {
    activator = args.activator;
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

    if (state === "Selectable" && qty === 1) {
      if (selectedList.some((card) => card.seq !== entity.seq)) {
        selectedList = [entity];
        return;
      }
      if (qty === 1 && entitySelectResolve) {
        entitySelectResolve([entity]);
      }
    }
  };

  const showCardInfo = (mode?: TCardDetailMode) => {
    if (entity.face === "FaceUp" || (entity.owner === entity.field.duel.duelists.Below && (entity.isUnderControl || isVisibleForcibly))) {
      entity.field.duel.view.showCardInfo(entity, mode ?? "Normal");
    }
  };

  const onClick = () => {
    showCardInfo();
    if (state === "Disabled") {
      return;
    }
    if (state === "Selectable") {
      isSelected = !isSelected;
      if (qty === 1) {
        selectedList.splice(0);
        entity.duel.view.requireUpdate();
      }
      selectedList = isSelected ? [...selectedList, entity] : selectedList.filter((e) => e !== entity);
      return;
    }
    if (dummyActionInfos.length === 0) {
      return;
    }
    if (dummyActionInfos.length === 1) {
      const actionInfo = dummyActionInfos[0];
      if (cardActionResolve) {
        cardActionResolve(actionInfo);
        return;
      }

      duelistResponseResolve({
        actionInfo,
      });
      return;
    }
    if (!activator) {
      return;
    }
    const view = entity.field.duel.view;
    view.modalController
      .selectAction(view, {
        title: "行動を選択。",
        activator,
        dummyActionInfos,
        cancelable: true,
      })
      .then((_action) => {
        if (!_action) {
          return;
        }
        duelistResponseResolve({
          actionInfo: _action,
        });
      });
    return;
  };

  const dragStart = (ev: DragEvent) => {
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
    console.info("drag start", ev, dummyActionInfos);
    entity.field.duel.view.setDraggingActions(dummyActionInfos);
    isDragging = true;
  };
  const dragEnd = (ev: DragEvent) => {
    console.info("drag end", ev, dummyActionInfos);
    entity.field.duel.view.removeDraggingActions();
    if (ev.dataTransfer) {
      isDragging = false;
    }
  };

  const onRightClick = () => {
    showCardInfo("Debug");
    return false;
  };
</script>

{#if entity.face === "FaceUp" || isVisibleForcibly || (entity.controller.duelistType === "Player" && entity.isUnderControl)}
  <button
    class="duel_card button_style_reset {entity.origin.kind} {entity.status.monsterCategories?.join(' ') || ''} {isSelected
      ? 'duel_card_selected'
      : ''} {state} duel_card_{entity.orientation} {isDragging ? 'isDragging' : ''} {isWideMode
      ? 'duel_card_wide'
      : ''} duel_card_{entity.face} {entity.isOnField ? 'duel_card_is_on_field' : ''}"
    draggable={state === "Draggable"}
    on:dragstart={dragStart}
    on:dragend={dragEnd}
    on:click={onClick}
    on:dblclick={dblclick}
    on:mouseenter={() => showCardInfo()}
    on:contextmenu={onRightClick}
    title={entity.nm}
  >
    <div class="duel_card duel_card_visible">
      <div class="duel_card_row" style="position:relative">
        <div>{entity.nm}</div>
        <div></div>

        {#each entity.attr as attr}
          <div class="monster_attr {attr}"></div>
        {/each}
      </div>
      {#if entity.status.kind === "Monster"}
        <div class="duel_card_row">
          <div class={entity.lvl !== entity.origin.level ? "different_from_its_origin" : ""}>{"★".repeat(entity.lvl || 0)}</div>
          <div class={entity.rank !== entity.origin.rank ? "different_from_its_origin" : ""}>{"☆".repeat(entity.rank || 0)}</div>
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
          <div class={entity.psL !== entity.origin.pendulumScaleL ? "different_from_its_origin" : ""}>◀ {entity.psL}</div>
          <div class={entity.psR !== entity.origin.pendulumScaleR ? "different_from_its_origin" : ""}>{entity.psR} ▶</div>
        </div>
      {/if}
      {#if entity.status.kind === "Spell" && entity.isPendulumScale}
        <div class="duel_card_row">
          <div></div>
          <div>ペンデュラム</div>
        </div>
      {/if}
      {#if entity.status.kind === "Monster"}
        <div class="duel_card_row duel_card_detail">
          <div>
            {entity.types.map((t) => monsterTypeEmojiDic[t] + (isWideMode ? monsterTypeDic[t] : "")).join()}
            {entity.status.monsterCategories?.map((cat) => monsterCategoryEmojiDic[cat] + (isWideMode ? monsterCategoryDic[cat] : "")).join()}
          </div>
        </div>
        <div class="duel_card_row duel_card_detail">
          <div></div>
          <div>
            <span class={entity.atk !== entity.origin.attack ? "different_from_its_origin" : ""}> {entity.atk ?? "?"}</span>
            /
            <span class={entity.def !== entity.origin.defense ? "different_from_its_origin" : ""}>{entity.def ?? "?"}</span>
          </div>
        </div>
      {/if}
    </div>
  </button>
{:else if entity.battlePosition === "Set"}
  <button
    class="duel_card duel_card_face_down duel_card_face_down_defense {state}  {isSelected ? 'duel_card_selected' : ''}"
    on:click={onClick}
    on:dblclick={dblclick}><div>裏守備</div></button
  >
{:else}
  <div class="duel_card duel_card_face_down"><div>セット</div></div>
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
  .duel_card_visible {
    display: flex;
    flex-direction: column;
    height: 4.3rem;
    margin: 0.1rem 0.3rem;
    padding: 0.1rem 0.3rem;
    border: solid 1px #778ca3;
    min-width: 5rem;
    max-width: 8rem;
  }
  .duel_card.duel_card_FaceDown.duel_card_is_on_field {
    filter: grayscale(0.5);
  }
  .duel_card_wide .duel_card_visible {
    max-width: initial;
  }

  .duel_card_row:first-child {
    border: solid 0.01rem darkslategray;
  }
  .duel_card .monster_attr {
    padding: 0;
    margin: 0;
    display: inline-block;
    position: sticky;
    right: 0em;
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
  .duel_card_row.enum {
    flex-wrap: wrap;
    justify-content: left;
  }
  .duel_card_row > div {
    margin: 0 0.3rem;
  }
  .different_from_its_origin {
    color: red;
    font-weight: bold;
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
    height: 5.6rem;
    background-color: brown;
  }
  .duel_card_face_down > div {
    width: 1.8rem;
    height: 3rem;
    border-radius: 100%;
    background-color: black;
    color: black;
    text-align: center;
    font-size: 1px;
  }
  .duel_card_face_down_defense {
    width: 5.6rem;
    height: 4.1rem;
  }
  .duel_card_face_down_defense.Selectable {
    display: flex;
    width: 5.6rem;
    height: 4.1rem;
    min-width: initial;
  }
  .duel_card_face_down_defense > div {
    width: 3rem;
    height: 1.8rem;
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

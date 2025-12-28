<script lang="ts">
  import { DuelError } from "@ygo_duel/class_error/DuelError";

  import DuelCard, { type TCardState } from "@ygo_duel_view/components/DuelCard.svelte";
  import { DuelFieldCell as FieldCell } from "@ygo_duel/class/DuelFieldCell";
  import { DuelEntity } from "@ygo_duel/class/DuelEntity";
  import type { AnimationStartEventArg, DuelistResponseBase, DuelViewController, WaitStartEventArg } from "@ygo_duel_view/class/DuelViewController";

  import { cardCrossFade } from "@ygo_duel_view/components/DuelDesk.svelte";
  import { type DummyActionInfo } from "@ygo_duel/class/DuelEntityAction";
  import { getCounterEmoji } from "@ygo_duel/class/DuelCounter";
  import type { TDuelPhase } from "@ygo_duel/class/DuelPeriod";
  import type { Duelist } from "@ygo_duel/class/Duelist";
  import type { ChoicesSweet } from "@ygo_duel/class/DuelUtilTypes";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { getKeys } from "@stk_utils/funcs/StkObjectUtils";
  export let view: DuelViewController;

  export let row: number;

  export let column: number;

  export let selectedEntities = [] as DuelEntity[];
  export let selectedCells = [] as FieldCell[];

  let cell = view.getCell(row, column);
  let aboveLp = new Tween(cell.field.duel.duelists.Above.lp, {
    duration: 400,
    easing: cubicOut,
  });
  let belowLp = new Tween(cell.field.duel.duelists.Below.lp, {
    duration: 400,
    easing: cubicOut,
  });

  const onCellUpdate = () => {
    cell = view.getCell(row, column);
    aboveLp.target = cell.field.duel.duelists.Above.lp;
    belowLp.target = cell.field.duel.duelists.Below.lp;
  };

  cell.onUpdate.append(onCellUpdate);
  view.onDuelUpdate.append(onCellUpdate);
  view.modalController.onUpdate.append(onCellUpdate);

  let activator: Duelist | undefined = undefined;
  let dummyActionInfos: DummyActionInfo[] = [];
  let responseResolve: (action: DuelistResponseBase) => void = () => console.log("hoge");
  let entitiesChoices: ChoicesSweet<DuelEntity> | undefined;
  let targetsInBuildingChain: DuelEntity[] = [];
  let isSelected = false;
  let isSelectable = false;
  let canDirectResoleve = false;
  const onWaitStart: (args: WaitStartEventArg) => void = (args) => {
    animationArgs = [];
    selectedEntities.reset();
    activator = args.activator;
    responseResolve = args.resolve;
    dummyActionInfos = args.dummyActionInfos;
    targetsInBuildingChain = args.chainBlockInfos.flatMap((info) => info.selectedEntities).getDistinct();
    entitiesChoices = args.entitiesChoices;
    isSelected = false;
    isSelectable = args.cellsChoices?.selectables.includes(cell) ?? false;
    canDirectResoleve = isSelectable && args.cellsChoices?.qty === 1;
    onCellUpdate();
  };
  view.onWaitStart.append(onWaitStart);
  const onWaitEnd = () => {
    activator = undefined;
    dummyActionInfos = [];
    responseResolve = () => {
      console.log("hoge");
    };
    entitiesChoices = undefined;
    targetsInBuildingChain = [];
    isSelected = false;
    isSelectable = false;
    canDirectResoleve = false;
  };

  view.onWaitEnd.append(onWaitEnd);
  let canAcceptDrop = false;

  let draggingDummyActionInfos: DummyActionInfo[] = [];
  const onDragStart = (dummyActionInfos: DummyActionInfo[]) => {
    // ドラッグされたアクションのうち、受け入れられるもののみを抽出
    draggingDummyActionInfos = dummyActionInfos.filter((info) => info.dests.includes(cell));

    canAcceptDrop = draggingDummyActionInfos.length > 0;
    onCellUpdate();
  };
  const onDragEnd = () => {
    draggingDummyActionInfos = [];
    canAcceptDrop = false;
    onCellUpdate();
  };
  view.onDragStart.append(onDragStart);
  view.onDragEnd.append(onDragEnd);
  const [send, receive] = cardCrossFade;

  let animationArgs: AnimationStartEventArg[] = [];
  const onCrossFade = (args: AnimationStartEventArg) => {
    activator = undefined;
    if (cell === args.to || cell.entities.includes(args.entity)) {
      animationArgs = [...animationArgs, args];
      const resolve = args.resolve;
      cell = cell;
      setTimeout(() => {
        animationArgs = animationArgs.filter((item) => item !== args);
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
      cell.isStackCell &&
      cell.entities.flatMap((e) => e.actions).filter((act) => dummyActionInfos.map((info) => info.action.seq).some((seq) => seq === act.seq)).length > 0
    );
  };

  const onCellClick = (ev: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) => {
    if ((ev.target as HTMLDivElement)?.id === "config_button") {
      view.infoBoardState = "Config";
      view.requireUpdate();
      return;
    }
    view.infoBoardState = "Default";
    if (canDirectResoleve) {
      responseResolve({ selectedCells: [cell] });
    } else if (isSelectable) {
      isSelected = !isSelected;
      selectedCells = isSelected ? [...selectedCells, cell] : selectedCells.filter((e) => e !== cell);
    } else if (cell.isStackCell) {
      view.infoBoardState = "CellInfo";
      view.infoBoardCell = cell;
      view.requireUpdate();
      const cellActionSeqs = cell.entities.flatMap((e) => e.actions).map((action) => action.seq);
      const cellActionInfos = dummyActionInfos.filter((info) => cellActionSeqs.includes(info.action.seq));

      if (cellActionInfos.length) {
        if (!activator) {
          return;
        }

        view.modalController.actionSelector
          .show({
            title: "カードを選択。",
            position: "Bottom",
            activator,
            dummyActionInfos: cellActionInfos,
            cancelable: true,
          })
          .then((_info) => {
            if (_info) {
              responseResolve({
                actionInfo: _info,
              });
            }
          });
        return;
      }
    }
    view.requireUpdate();
    console.info(cell, validateActions(...cell.visibleEntities));
  };

  const dragover = (ev: DragEvent) => {
    ev.preventDefault();
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
  };
  const drop = (ev: DragEvent) => {
    ev.preventDefault();
    console.info("drop", ev, canAcceptDrop, draggingDummyActionInfos);
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "move";
    }
    try {
      if (canAcceptDrop && draggingDummyActionInfos) {
        if (draggingDummyActionInfos.length === 1) {
          const info = draggingDummyActionInfos[0];
          responseResolve({ actionInfo: { ...info, dest: cell } });
        } else if (draggingDummyActionInfos.length > 1) {
          if (!activator) {
            throw new DuelError("想定されない状態");
          }
          cell.field.duel.view.modalController.terminateAll();
          cell.field.duel.view.modalController.actionSelector
            .show({
              title: "選択",
              position: "Bottom",
              activator,
              dummyActionInfos: draggingDummyActionInfos.map((info) => {
                return { ...info, dest: cell };
              }),
              cancelable: false,
            })
            .then((_info) => {
              responseResolve({
                actionInfo: _info,
              });
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

    if (entitiesChoices && entitiesChoices.selectables.find((e1) => entities.find((e2) => e1 === e2))) {
      return "Selectable";
    }

    if (!dummyActionInfos || dummyActionInfos.length === 0) {
      return "Disabled";
    }
    if (view.waitMode !== "Free") {
      return "Disabled";
    }
    if (Object.values(view.modalController.modals).some((motal) => motal.state === "Shown")) {
      return "Disabled";
    }
    const actions = dummyActionInfos.filter((info) => entities.includes(info.action.entity));
    if (actions.length === 0) {
      return "Disabled";
    }
    if (cell.isStackCell) {
      return "Clickable";
    }
    if (actions[0].action.entity !== entities[0]) {
      return "Clickable";
    }
    return actions.some((info) => info.dests.length) ? "Draggable" : "Clickable";
  };
</script>

<td
  class={`duel_field_cell duel_field_cell_${cell.cellType} ${cell.linkArrowSources.length === 0 ? "" : "duel_field_cell_linked"}`}
  colspan={cell.cellType === "Hand" ? 7 : 1}
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class={`duel_field_cell_inner_box ${cell.cellType} ${canAcceptDrop ? "can_accept_drop" : ""} ${canAction() ? "can_action" : ""} ${isSelected ? "is_selected" : isSelectable ? "is_selectable" : ""} `}
    role="listitem"
    onclick={onCellClick}
    ondragover={dragover}
    ondrop={drop}
  >
    {#if cell.isDisabledCell}
      <!-- 使用不可セルの場合-->
      {#if cell.row === 3}
        {#if cell.column === 1}
          <div class="phase_display"><span>{String(cell.field.duel.clock.turn).padStart(2, "0")}</span>{cell.field.duel.phase.toUpperCase()}</div>
        {:else if cell.column === 3}
          <div class="lifepoint_display">
            <div>{Math.floor(aboveLp.current)}</div>
            <div>{Math.floor(belowLp.current)}</div>
          </div>
        {:else if cell.column === 5}
          {#if view.waitMode === "Free"}
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
      {@const args = animationArgs.find((args) => args.to === cell)}
      {#if args && args.index === "Top"}
        <div class="card_animation_receiver {cell.cellType}" in:receive={{ key: args.entity.seq }}>
          <DuelCard entity={args.entity} state="Disabled" dummyActionInfos={[]} cardActionResolve={undefined} />
        </div>
      {/if}
      {#each cell.visibleEntities as entity}
        {#if animationArgs.every((args) => args.entity.seq !== entity.seq)}
          <div out:send={{ key: entity.seq }}>
            <DuelCard
              {entity}
              state={validateActions(entity)}
              dummyActionInfos={dummyActionInfos.filter((info) => info.action.entity === entity)}
              cardActionResolve={undefined}
              bind:selectedList={selectedEntities}
            />
          </div>
        {/if}
      {/each}

      {#if args && args.index !== "Top"}
        <div class="card_animation_receiver {cell.cellType}" in:receive={{ key: args.entity.seq }}>
          <DuelCard entity={args.entity} state="Disabled" dummyActionInfos={[]} cardActionResolve={undefined} />
        </div>
      {/if}
      {#if cell.owner.seat === "Below"}
        <div class="config_button_wrapper">
          <button id="config_button"> ⚙</button>
        </div>
      {/if}
    {:else}
      <!-- それ以外のセルの場合-->
      {@const args = animationArgs.find((args) => args.to === cell)}
      {#if args && args.index !== "Top"}
        <!-- アニメーションの目的地-->
        <div style="position: absolute;" class="card_animation_receiver" in:receive={{ key: args.entity.seq }}>
          <DuelCard entity={args.entity} state="Disabled" dummyActionInfos={[]} cardActionResolve={undefined} />
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
          {#if animationArgs.every((args) => args.entity.seq !== item.entity.seq)}
            {@const state = !cell.isStackCell && item.index === 0 ? validateActions(...cell.visibleEntities) : undefined}
            {#if targetsInBuildingChain.includes(item.entity)}
              <div style="position: absolute; top:0rem">｛効果対象｝</div>
            {/if}
            <div
              class="duel_card_wrapper {item.entity.exist ? 'duel_card_wrapper_exists' : ''}"
              style="position: absolute; display:flex;justify-content: center;"
              out:send={{ key: item.entity.seq }}
            >
              <DuelCard
                entity={item.entity}
                {state}
                dummyActionInfos={item.index === 0 ? dummyActionInfos.filter((info) => cell.visibleEntities.includes(info.action.entity)) : undefined}
                cardActionResolve={undefined}
                bind:selectedList={selectedEntities}
              />
            </div>
          {/if}
        {/each}
        {#if cell.visibleEntities[0].battlePosition}
          <!-- 表示形式、カウンターの表示-->
          <div style="position: absolute; bottom:0rem">
            【{cell.visibleEntities[0].battlePositionName}】
            {#each getKeys(cell.visibleEntities[0].status.maxCounterQty) as counter}
              【
              {getCounterEmoji(counter)}{cell.visibleEntities[0].counterHolder.getQty(counter)}
              {#if (cell.visibleEntities[0].status.maxCounterQty[counter] ?? 9999) < 100}
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
      {#if args && args.index === "Top"}
        <!-- アニメーションの目的地-->
        <div class="card_animation_receiver" in:receive={{ key: args.entity.seq }}>
          <DuelCard entity={args.entity} state="Disabled" dummyActionInfos={[]} cardActionResolve={undefined} />
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
  .duel_field_cell > div.is_selected {
    border: dotted 3px red;
  }
  .duel_field_cell > div.is_selectable {
    border: dotted 3px blue;
  }
  .duel_field_cell_inner_box {
    display: block;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 7rem;
    padding: 0rem;
    pointer-events: auto;
  }
  .duel_field_cell_inner_box > .card_animation_receiver {
    position: absolute;
    max-width: 4rem;
    margin: auto;
  }
  .duel_field_cell_inner_box.Hand {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .duel_field_cell_inner_box.Hand > .card_animation_receiver {
    position: static;
    margin: 0px;
  }

  .duel_card_wrapper {
    transition: 400ms;
    opacity: 0;
  }
  .duel_card_wrapper.duel_card_wrapper_exists {
    opacity: 1;
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
  .config_button_wrapper {
    position: absolute;
    right: 0px;
    bottom: 0px;
    padding: 0rem;
  }
  #config_button {
    font-size: 2rem;
    font-family:
      "Twitter Color Emoji", "EmojiOne Color", "Apple カラー絵文字", "Apple Color Emoji", "Gecko Emoji", "Noto Emoji", "Noto Color Emoji", "Segoe UI Emoji",
      OpenSansEmoji, EmojiSymbols, DFPEmoji, "Segoe UI Symbol 8", "Segoe UI Symbol", "Noto Sans Symbols", Symbola, Quivira, "和田研中丸ゴシック2004絵文字",
      WadaLabChuMaruGo2004Emoji, "和田研細丸ゴシック2004絵文字", WadaLabMaruGo2004Emoji, "DejaVu Sans", "VL Pゴシック", YOzFont, "Nishiki-teki",
      "Android Emoji", "Sun-ExtA", symbols, places, people, objects, nature, fantasy;
    margin: 0rem;
    border-style: none;
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
  .duel_field_cell > .duel_field_cell_inner_box {
    display: flex;
    flex-direction: column;
  }
  .duel_field_cell.duel_field_cell_Hand > .duel_field_cell_inner_box {
    display: flex;
    flex-direction: row;
  }
  .duel_field_cell_Hand {
    background-color: aliceblue;
    overflow-y: auto;
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

  .duel_field_cell_MonsterZone.duel_field_cell_linked {
    background-color: lightsalmon;
    background-image:
      repeating-linear-gradient(135deg, #3af0fc22 0 2px, transparent 2px 40px), repeating-linear-gradient(45deg, #3af0fc22 0 2px, transparent 2px 40px),
      linear-gradient(120deg, #00ffd055 0%, #00bfff22 100%);
    box-shadow: 0 0 12px 2px #00eaff44 inset;
    border: 1.5px solid #00eaff55;
    z-index: -1;
  }
  .duel_field_cell_ExtraMonsterZone.duel_field_cell_linked {
    background-color: steelblue;
    background-image:
      repeating-linear-gradient(135deg, #3af0fc22 0 2px, transparent 2px 40px), repeating-linear-gradient(45deg, #3af0fc22 0 2px, transparent 2px 40px),
      linear-gradient(120deg, #00ffd055 0%, #00bfff22 100%);
    box-shadow: 0 0 12px 2px #00eaff44 inset;
    border: 1.5px solid #00eaff55;
    z-index: -1;
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

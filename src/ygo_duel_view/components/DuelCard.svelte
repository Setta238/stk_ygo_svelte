<script lang="ts">
  import type { DuelEntity } from "../../ygo_duel/class/DuelEntity";

  export let entity: DuelEntity;
  export let isSelectable = false;
  export let selectedList = [] as DuelEntity[];
  export let isVisibleForcibly = false;
  let isSelected = false;

  const click = () => {
    console.log(isSelectable);
    if (!isSelectable) {
      return;
    }
    isSelected = !isSelected;
    selectedList = isSelected ? [...selectedList, entity] : selectedList.filter((e) => e !== entity);
    console.log(entity, isSelected, selectedList);
  };
</script>

{#if entity.face === "FaceUp" || isVisibleForcibly || (entity.controller.seat === "Below" && entity.isUnderControl)}
  <button
    class="duel_card button_style_reset {entity.status.monsterCategories?.join(' ') || ''} {isSelected ? 'duel_card_selected' : ''} {isSelectable
      ? 'duel_card_selectable'
      : ''} duel_card_{entity.orientation}"
    disabled={entity.field.duel.isEnded || !isSelectable}
    on:click={click}
  >
    <table>
      <tbody>
        <tr>
          <td> {entity.nm} </td>
          <td> {entity.attr.join(" ")} </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: left;"> {"★".repeat(entity.status.level || 0)} </td>
        </tr>
        {#if entity.status.monsterCategories?.includes("Pendulum")}
          <tr>
            <td colspan="2">
              <div style="display:flex; justify-content: space-between; min-width:100%;">
                <div>◀ {entity.psL}</div>
                <div>{entity.psR} ▶</div>
              </div>
            </td>
          </tr>
        {/if}
        <tr>
          <td>
            <div style="display: flex;flex-direction: column;">
              <div>{entity.type}</div>
              {#each entity.status.monsterCategories ?? [] as cat}<div style="margin-right: 0.2rem;">{cat}</div>{/each}
            </div>
          </td>
          <td>
            <div>{entity.atk}</div>
            <div>{entity.def || 0}</div>
            <!-- TODO FIX IT -->
          </td>
        </tr>
      </tbody>
    </table>
  </button>
  {#if entity.battlePotion}
    <div>【{entity.battlePotion === "Attack" ? "攻撃表示" : entity.battlePotion === "Defense" ? "表守備表示" : "裏守備表示"}】</div>
  {/if}
{:else}
  <div class="duel_card duel_card_face_down"><div></div></div>
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
  .duel_card {
    min-width: 1px;
    height: fit-content;
    margin: 1px 5px;
    border: solid 1px #778ca3;
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
  .duel_card.duel_card_selectable {
    display: block;
    min-width: 1px;
    height: fit-content;
    margin: 1px 5px;
    border: dotted 4px blue;
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
    width: 60px;
    height: 80px;
    background-color: brown;
  }
  .duel_card_face_down > div {
    width: 30px;
    height: 50px;
    border-radius: 50%;
    margin: auto;
    background-color: black;
  }
</style>

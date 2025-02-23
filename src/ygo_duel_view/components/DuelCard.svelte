<script lang="ts">
  import type DuelEntity from "../../ygo_duel/class/DuelEntity";

  export let entity: DuelEntity;
  export let isSelectable = false;
  export let selectedList = [] as DuelEntity[];
  export let isVisibleForcibly = false;
  let isSelected = false;

  const click = () => {
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
    class="DuelCard button_style_reset {isSelected ? 'DuelCard_IsSelected' : ''} {isSelectable ? 'DuelCard_Is_Selectable' : ''}"
    disabled={!isSelectable}
    on:click={click}
  >
    <table>
      <tbody>
        <tr>
          <td> {entity.status.name} </td>
          <td> {entity.status.attribute} </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: left;"> {"★".repeat(entity.status.level || 0)} </td>
        </tr>
        {#if entity.status.monsterCategories?.includes("Pendulum")}
          <tr>
            <td colspan="2">
              <div style="display:flex; justify-content: space-between; min-width:100%;">
                <div>◀ {entity.status.pendulumScaleL}</div>
                <div>{entity.status.pendulumScaleR} ▶</div>
              </div>
            </td>
          </tr>
        {/if}
        <tr>
          <td>
            <div style="display: flex;flex-direction: column;">
              {#each entity.status.monsterCategories ?? [] as cat}<div style="margin-right: 0.2rem;">{cat}</div>{/each}
            </div>
          </td>
          <td>
            <div>{entity.status.attack}</div>
            <div>{entity.status.defense}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </button>
  {#if entity.battlePotion}
    <div>【{entity.battlePotion === "Attack" ? "攻撃" : entity.battlePotion === "Defense" ? "表守備" : "裏守備"}】</div>
  {/if}
{:else}
  <div class="DuelCard DuelCardFaceDown"><div></div></div>
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
  .DuelCard {
    min-width: 1px;
    height: fit-content;
    margin: 1px 5px;
    border: solid 1px #778ca3;
  }
  .DuelCard:disabled,
  .DuelCard:disabled * {
    cursor: default;
    pointer-events: none;
  }
  .DuelCard.DuelCard_Is_Selectable {
    display: block;
    min-width: 1px;
    height: fit-content;
    margin: 1px 5px;
    border: dotted 4px blue;
    pointer-events: initial;
  }
  .DuelCard.DuelCard_IsSelected {
    display: block;
    min-width: 1px;
    height: fit-content;
    margin: 1px 5px;
    border: solid 4px red;
  }
  .DuelCardFaceDown {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 80px;
    background-color: brown;
  }
  .DuelCardFaceDown > div {
    width: 30px;
    height: 50px;
    border-radius: 50%;
    margin: auto;
    background-color: black;
  }
</style>

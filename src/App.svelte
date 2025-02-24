<script lang="ts">
  import DuelDesk from "@ygo_duel_view/components/DuelDesk.svelte";
  import ModalContainer from "@ygo_duel_view/components/ModalContainer.svelte";
</script>

<ModalContainer />
<main>
  <DuelDesk />
</main>

<style>
  main {
    display: flex;
    height: 100%;
    width: fit-content;
    justify-content: center;
    align-items: center;
    padding: 10rem 0;
  }
</style>

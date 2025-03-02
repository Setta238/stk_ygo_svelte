<script lang="ts">
  import DuelDesk from "@ygo_duel_view/components/DuelDesk.svelte";
</script>

<main>
  <DuelDesk />
  <div class="screen_info"></div>
</main>

<style>
  main {
    display: flex;
    height: 100%;
    width: fit-content;
    justify-content: center;
    align-items: center;
  }
  .screen_info {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
  }
</style>

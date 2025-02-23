<script lang="ts">
  import type Duelist from "@ygo_duel/class/Duelist";

  export let duelist: Duelist;

  const onlogUpdate = () => {
    duelist = duelist;
  };
  duelist.duel.onDuelUpdate?.append(onlogUpdate);
</script>

<div class="duelist">
  <div class="duelist_name">{duelist.profile.name}</div>
  <div class="duelist_lp">{duelist.getLp()}</div>
</div>

<style>
  .duelist {
    text-align: left;
    margin-right: 1rem;
  }
  .duelist_name {
    font-size: 2rem;
  }
  .duelist_lp {
    font-size: 6rem;
  }
</style>

<script lang="ts">
  import { delay } from "@stk_utils/funcs/StkPromiseUtil";
  import type Duelist from "@ygo_duel/class/Duelist";

  export let duelist: Duelist;
  let lifepoint = 0;
  let resolve: (() => void) | undefined;

  const setLifePointLazy = async () => {
    const diff = duelist.lp - lifepoint;
    if (!resolve || Math.abs(diff) < 10) {
      lifepoint = duelist.lp;
      if (resolve) {
        resolve();
        resolve = undefined;
      }
      return;
    }
    lifepoint += Math.floor(Math.random() * diff);
    await delay(100);
    setLifePointLazy();
  };
  const onlogUpdate = () => {
    duelist = duelist;
    if (!resolve && duelist.lp !== lifepoint) {
      new Promise<void>((_resolve) => {
        resolve = _resolve;
        setLifePointLazy();
      });
    }
  };
  duelist.duel.log.onUpdate.append(onlogUpdate);

  setLifePointLazy();
</script>

<div class="duelist">
  <div class="duelist_name">{duelist.profile.name}</div>
  <div class="duelist_lp">{lifepoint}</div>
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

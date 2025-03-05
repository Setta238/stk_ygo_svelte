<script lang="ts">
  import { delay } from "@stk_utils/funcs/StkPromiseUtil";
  import type Duelist from "@ygo_duel/class/Duelist";

  export let duelist: Duelist;
  let lifepoint = 0;
  let resolve: (() => void) | undefined;
  let count = 0;
  let amplitude = 0;
  let maxDIff = 0;
  const setLifePointLazy = async () => {
    const diff = duelist.lp - lifepoint;
    if (!resolve || Math.abs(diff) < 10) {
      lifepoint = duelist.lp;
      if (resolve) {
        amplitude = 0;
        count = 0;
        resolve();
        resolve = undefined;
      }
      return;
    }

    count++;
    amplitude = Math.abs(diff / maxDIff) * (count % 2 === 0 ? 1 : -1);

    lifepoint += Math.floor(Math.random() * diff);
    await delay(100);
    setLifePointLazy();
  };
  const onlogUpdate = () => {
    duelist = duelist;
    if (!resolve && duelist.lp !== lifepoint) {
      new Promise<void>((_resolve) => {
        resolve = _resolve;
        maxDIff = Math.abs(duelist.lp - lifepoint);
        amplitude = 1;
        count = 0;
        setLifePointLazy();
      });
    }
  };
  duelist.duel.log.onUpdate.append(onlogUpdate);

  setLifePointLazy();
</script>

<div class="duelist">
  <div class="duelist_name">{duelist.profile.name}</div>
  <div class="duelist_lp" style="top:{amplitude * 4}rem">{lifepoint}</div>
</div>

<style>
  .duelist {
    position: relative;
    text-align: left;
    margin-right: 1rem;
    line-height: 1.1;
    width: 80%;
  }
  .duelist_name {
    font-size: 2rem;
  }
  .duelist_lp {
    position: relative;
    font-size: 6rem;
  }
</style>

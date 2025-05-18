<script lang="ts">
  import { delay } from "@stk_utils/funcs/StkPromiseUtil";
  import { type Duelist } from "@ygo_duel/class/Duelist";

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

<div class="duelist duelist_{duelist.seat.toLowerCase()}">
  <div class="duelist_name duelist_{duelist.seat.toLowerCase()}_name">{duelist.profile.name}</div>
  <div class="duelist_lp {resolve ? 'vibration' : ''}">{lifepoint}</div>
</div>

<style>
  .duelist {
    position: relative;
    text-align: left;
    margin-right: 1rem;
    line-height: 1.1;
    width: 90%;
    padding: 0.3rem;
    background-color: whitesmoke;
  }

  .duelist_name {
    border-left-style: solid;
    border-left-width: 1rem;
    padding: 0.5rem 1rem 0.5rem 0rem;
    font-size: 2rem;
    width: fit-content;
    word-wrap: break-word;
  }

  .duelist_lp {
    position: relative;
    text-align: right;
    font-size: 6rem;
  }
  .vibration {
    animation: vibration 0.1s infinite;
  }
  @keyframes vibration {
    0% {
      transform: translate(0px, 0px) rotateZ(0deg);
    }
    25% {
      transform: translate(1.4rem, 0.5rem) rotateZ(1deg);
    }
    50% {
      transform: translate(0px, 0.5rem) rotateZ(0deg);
    }
    75% {
      transform: translate(1.4rem, 0px) rotateZ(-1deg);
    }
    100% {
      transform: translate(0px, 0px) rotateZ(0deg);
    }
  }
</style>

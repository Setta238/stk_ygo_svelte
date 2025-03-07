<script lang="ts">
  import { cardInfoDic } from "@ygo/class/CardInfo";
  import { DeckInfo } from "@ygo/class/DeckInfo";
  import { CardEntitySorter, CardSorter, type TDuelEntityFace } from "@ygo_duel/class/DuelEntity";

  export let deckInfo: DeckInfo;

  let cardNames = [...deckInfo.cardNames]
    .map((name) => cardInfoDic[name])
    .toSorted(CardSorter)
    .map((info) => info.name)
    .join("\n");
</script>

<div>
  <div>
    <input type="text" value={deckInfo.name} />
  </div>
  <div><textarea style="width: 30rem;height: 30rem;">{cardNames}</textarea></div>
</div>

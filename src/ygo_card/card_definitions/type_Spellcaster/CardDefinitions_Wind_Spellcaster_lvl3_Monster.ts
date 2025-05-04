import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
} from "@ygo_card/card_actions/DefaultCardAction_Monster";

import type { CardDefinition } from "@ygo_card/class/DuelCardDefinition";

export default function* generate(): Generator<CardDefinition> {
  yield {
    name: "エキセントリック・ボーイ",
    actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultNormalSummonAction, defaultFlipSummonAction],
    defaultSummonFilter: (filter, target, effectOwner, summoner, movedAs, attr, monster, materialInfos, posList, cells) => {
      const ok = { posList, cells };
      const notAllowed = { posList: [], cells: [] };
      if (!movedAs.includes("SyncroSummon")) {
        return ok;
      }
      const myInfo = materialInfos.find((info) => info.material === filter.isSpawnedBy);

      if (!myInfo) {
        return ok;
      }

      if (!myInfo.cell.isMonsterZoneLikeCell) {
        // TODO 要確認：エキセントリックボーイが手札でシンクロできる可能性。
        return notAllowed;
      }

      if (materialInfos.length !== 2) {
        return notAllowed;
      }

      return materialInfos.filter((info) => info !== myInfo).every((info) => info.cell.cellType === "Hand") ? ok : notAllowed;
    },
    defaultStatus: { allowHandSyncro: true },
    onUsedAsMaterial: (myInfo, monster) => {
      if (!monster.info.summonKinds.includes("SyncroSummon")) {
        return;
      }
      monster.info.willBeBanished = true;
      monster.info.isEffectiveIn = monster.info.isEffectiveIn
        .filter((cellType) => cellType !== "ExtraMonsterZone")
        .filter((cellType) => cellType !== "MonsterZone");
    },
  };
}

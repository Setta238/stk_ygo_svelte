import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultNormalSummonAction,
} from "@ygo_duel/cards/DefaultCardAction_Monster";

import type { CardDefinition } from "@ygo_duel/cards/CardDefinitions";

export const createCardDefinitions_Wind_Spellcaster_lvl3_Monster = (): CardDefinition[] => {
  const result: CardDefinition[] = [];
  result.push({
    name: "エキセントリック・ボーイ",
    actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultNormalSummonAction, defaultFlipSummonAction],
    defaultSummonFilter: (filter, target, effectOwner, summoner, movedAs, attr, monster, materialInfos, posList, cells) => {
      const ok = { posList, cells };
      const notAllowed = { posList: [], cells: [] };
      if (!movedAs.includes("SyncroSummon")) {
        return ok;
      }
      const materials = materialInfos.map((info) => info.material);
      const me = materials.find((material) => material === filter.isSpawnedBy);

      if (!me) {
        return ok;
      }

      if (!me.isOnFieldAsMonster) {
        // TODO 要確認：エキセントリックボーイが手札でシンクロできる可能性。
        return notAllowed;
      }

      if (materials.length !== 2) {
        return notAllowed;
      }

      return materials.filter((material) => material !== me).every((material) => material.fieldCell.cellType === "Hand") ? ok : notAllowed;
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
  });

  return result;
};

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "エキセントリック・ボーイ",
    actions: [],
    summonFilter: (filter, target, effectOwner, summoner, movedAs, attr, monster, materialInfos, posList, cells) => {
      const ok = { posList, cells };
      const notAllowed = { posList: [], cells: [] };
      if (!movedAs.includes("SynchroSummon")) {
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
    defaultStatus: { allowHandSynchro: true },
    onUsedAsMaterial: (myInfo, monster) => {
      if (!monster.info.summonKinds.includes("SynchroSummon")) {
        return;
      }

      myInfo.action.entity.statusOperatorBundle.push(
        new StatusOperator(
          "除外予定",
          () => true,
          false,
          myInfo.action.entity,
          myInfo.action,
          (ope, target) => target.isOnFieldAsMonsterStrictly && target.face === "FaceUp",
          () => {
            return { willBeBanished: true };
          }
        )
      );

      monster.info.isEffectiveIn = monster.info.isEffectiveIn
        .filter((cellType) => cellType !== "ExtraMonsterZone")
        .filter((cellType) => cellType !== "MonsterZone");
    },
  };
}

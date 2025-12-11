import { defaultSelfReleaseCanPayCosts, defaultSelfReleasePayCosts } from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import {} from "@ygo_duel/class/DuelEntityShortHands";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "イービル・ソーン",
    actions: [
      {
        title: "①イービル・バースト",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        fixedTags: ["SpecialSummonFromDeck", "DamageToOpponent"],
        canPayCosts: defaultSelfReleaseCanPayCosts,
        canExecute: (myInfo) => {
          const latestArrivalRecord = myInfo.action.entity.moveLog.latestArrivalRecord;

          if (latestArrivalRecord && latestArrivalRecord.movedAs.includes("Effect") && latestArrivalRecord.movedBy?.origin.name === "イービル・ソーン") {
            return false;
          }

          // 特殊召喚効果は任意なので、特殊召喚できるかどうかのチェックは不要。
          return true;
        },
        payCosts: defaultSelfReleasePayCosts,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          // 300ポイントダメージ
          const damageInfos = myInfo.activator.getOpponentPlayer().effectDamage(300, myInfo);

          // ダメージが与えられなかった場合、特殊召喚効果を使用できない
          if (!damageInfos.some((info) => info.duelist === myInfo.activator.getOpponentPlayer())) {
            return false;
          }

          const monsters = myInfo.activator.getDeckCell().cardEntities.filter((card) => card.nm === "イービル・ソーン");
          if (!monsters.length) {
            return true;
          }
          const cells = myInfo.activator.getMonsterZones();
          if (!cells.length) {
            return true;
          }

          // この特殊召喚はキャンセル可能
          const summoned = await myInfo.activator.summonMany(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            monsters.map((monster) => {
              return {
                monster,
                cells,
                posList: ["Attack"],
              };
            }),
            [],
            false,
            undefined,
            (summoned) => summoned.length < 3,
            true
          );

          if (summoned) {
            myInfo.activator.getDeckCell().shuffle();
          }

          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

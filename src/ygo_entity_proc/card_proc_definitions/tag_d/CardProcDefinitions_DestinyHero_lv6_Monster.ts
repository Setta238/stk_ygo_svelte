import { type EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultEffectSpecialSummonExecute, defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { getPaySelfBanishCostsActionPartical } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Banish";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "Ｄ－ＨＥＲＯ ディアボリックガイ",
    actions: [
      {
        title: "①リクルート",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        fixedTags: ["SpecialSummonFromDeck"],
        priorityForNPC: 10,
        ...getPaySelfBanishCostsActionPartical(),
        canExecute: (myInfo) => {
          const nextOne = myInfo.activator.getDeckCell().cardEntities.find((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ");
          if (!nextOne) {
            return false;
          }
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            [{ monster: nextOne, posList: faceupBattlePositions, cells }],
            [],
            false,
          );
          return list.length > 0;
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const newOne = myInfo.activator.getDeckCell().cardEntities.find((card) => card.nm === "Ｄ－ＨＥＲＯ ディアボリックガイ");
          if (!newOne) {
            return false;
          }
          return defaultEffectSpecialSummonExecute(myInfo, [newOne]);
        },
        settle: async () => true,
      },
    ],
  };
}

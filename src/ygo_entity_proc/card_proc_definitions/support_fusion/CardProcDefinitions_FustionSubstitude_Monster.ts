import {
  defaultAttackAction,
  defaultBattlePotisionChangeAction,
  defaultFlipSummonAction,
  defaultFusionSubstituteEffect,
  defaultNormalSummonAction,
} from "@ygo_entity_proc/card_actions/CommonCardAction_Monster";

import {} from "@stk_utils/funcs/StkArrayUtils";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultCanPaySelfDiscardCosts, defaultPaySelfDiscardCosts } from "@ygo_entity_proc/card_actions/CommonCardAction";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { getDefaultFusionSummonAction } from "@ygo_entity_proc/card_actions/CommonCardAction_FusionSpell";

export default function* generate(): Generator<EntityProcDefinition> {
  for (const name of ["心眼の女神", "沼地の魔獣王", "イリュージョン・シープ", "破壊神 ヴァサーゴ"]) {
    yield {
      name,
      actions: [defaultAttackAction, defaultBattlePotisionChangeAction, defaultFlipSummonAction, defaultNormalSummonAction],
      continuousEffects: [defaultFusionSubstituteEffect],
    };
  }
  yield {
    name: "沼地の魔神王",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      defaultNormalSummonAction,
      {
        title: "融合サーチ",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        canPayCosts: defaultCanPaySelfDiscardCosts,
        canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.nm === "融合") && myInfo.activator.canAddToHandFromDeck,
        getDests: (myInfo) => [myInfo.activator.getGraveyard()],
        payCosts: defaultPaySelfDiscardCosts,
        prepare: async () => {
          return { selectedEntities: [], chainBlockTags: ["SearchFromDeck"], prepared: undefined };
        },
        execute: async (myInfo) => {
          const spells = myInfo.activator.getDeckCell().cardEntities.filter((card) => card.nm === "融合");
          if (!spells.length) {
            return false;
          }
          const target = await myInfo.activator.waitSelectEntity(spells, "手札に加えるカードを選択", false);
          if (!target) {
            return false;
          }
          await target.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
    ],
    continuousEffects: [defaultFusionSubstituteEffect],
  };
  yield {
    name: "パラサイト・フュージョナー",
    actions: [
      defaultAttackAction,
      defaultBattlePotisionChangeAction,
      defaultFlipSummonAction,
      defaultNormalSummonAction,
      {
        title: "融合",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        ...getDefaultFusionSummonAction(
          ["ExtraDeck"],
          () => true,
          ["MonsterZone", "ExtraMonsterZone"],
          () => true,
          "Graveyard"
        ),
        settle: async () => true,
      },
    ],
    summonFilter: (filter, target, effectOwner, summoner, movedAs, attr, monster, materialInfos, posList, cells) => {
      const ok = { posList, cells };
      const notAllowed = { posList: [], cells: [] };
      if (!movedAs.includes("FusionSummon")) {
        return ok;
      }
      const myInfo = materialInfos.find((info) => info.material === filter.isSpawnedBy);

      if (!myInfo) {
        return ok;
      }
      if (!myInfo.name) {
        return notAllowed;
      }

      // https://yugioh-wiki.net/index.php?%A1%D4%A5%D1%A5%E9%A5%B5%A5%A4%A5%C8%A1%A6%A5%D5%A5%E5%A1%BC%A5%B8%A5%E7%A5%CA%A1%BC%A1%D5
      // Ｑ：「《Ｅ・ＨＥＲＯ エッジマン》」と「《ヒーロー・マスク》で《Ｅ・ＨＥＲＯ ワイルドマン》になっている《パラサイト・フュージョナー》」で《Ｅ・ＨＥＲＯ ワイルドジャギーマン》を融合召喚できますか？
      // Ａ：いいえ、(1)の効果を適用できていないため融合素材にできません。
      //    「《Ｅ・ＨＥＲＯ ワイルドマン》」と「《ヒーロー・マスク》で《Ｅ・ＨＥＲＯ ワイルドマン》になっている《パラサイト・フュージョナー》」の組み合わせならば、《パラサイト・フュージョナー》が《Ｅ・ＨＥＲＯ エッジマン》の代わりとなるため融合召喚が可能です。
      return myInfo.name !== filter.isSpawnedBy.nm ? ok : notAllowed;
    },
    continuousEffects: [defaultFusionSubstituteEffect],
  };
}

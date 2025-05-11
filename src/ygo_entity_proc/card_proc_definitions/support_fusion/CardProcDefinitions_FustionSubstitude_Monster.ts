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
        validate: (myInfo) => {
          // デッキに対象カードが一枚以上必要。
          if (!myInfo.activator.getDeckCell().cardEntities.some((card) => card.nm === "融合")) {
            return;
          }
          if (!myInfo.activator.canAddToHandFromDeck) {
            return;
          }
          return [myInfo.activator.getGraveyard()];
        },
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
}

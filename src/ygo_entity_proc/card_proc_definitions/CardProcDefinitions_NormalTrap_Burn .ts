import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";
import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultPrepare, getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CardActions";
import { playFieldCellTypes } from "@ygo_duel/class/DuelFieldCell";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "マジカル・エクスプロージョン",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["DamageToOpponent"],
        meetsConditions: (myInfo) =>
          !myInfo.activator.getHandCell().cardEntities.length && myInfo.activator.getGraveyard().cardEntities.some((card) => card.kind === "Spell"),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const spells = myInfo.activator.getGraveyard().cardEntities.filter((card) => card.kind === "Spell");
          if (!spells.length) {
            return false;
          }
          myInfo.activator.getOpponentPlayer().effectDamage(spells.length * 200, myInfo);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "残骸爆破",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["DamageToOpponent"],
        meetsConditions: (myInfo) => myInfo.activator.getGraveyard().cardEntities.length >= 30,
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          myInfo.activator.getOpponentPlayer().effectDamage(3000, myInfo);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "仕込みマシンガン",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["DamageToOpponent"],
        meetsConditions: (myInfo) =>
          Boolean(myInfo.activator.getOpponentPlayer().getHandCell().cardEntities.length || myInfo.activator.getOpponentPlayer().getEntiteisOnField().length),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cardQty =
            myInfo.activator.getOpponentPlayer().getHandCell().cardEntities.length + myInfo.activator.getOpponentPlayer().getEntiteisOnField().length;
          if (!cardQty) {
            return false;
          }
          myInfo.activator.getOpponentPlayer().effectDamage(cardQty * 200, myInfo);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "仕込み爆弾",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["DamageToOpponent"],
        meetsConditions: (myInfo) => Boolean(myInfo.activator.getOpponentPlayer().getEntiteisOnField().length),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.activator.getOpponentPlayer().getEntiteisOnField();
          if (!cards.length) {
            return false;
          }
          myInfo.activator.getOpponentPlayer().effectDamage(cards.length * 500, myInfo);
          return true;
        },
        settle: async () => true,
      },
      {
        title: "②誘爆",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["DamageToOpponent"],
        triggerPattern: { triggerType: "Departure", needsByOpponent: true, needsByDestory: true, from: playFieldCellTypes },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          myInfo.activator.getOpponentPlayer().effectDamage(1000, myInfo);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "不運の爆弾",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["DamageToOpponent", "DamageToSelf"],
        isOnlyNTimesPerTurn: 1,
        ...getSingleTargetActionPartical(
          (myInfo) =>
            myInfo.activator
              .getOpponentPlayer()
              .getEntiteisOnField()
              .filter((monster) => monster.face === "FaceUp")
              .filter((monster) => monster.atk),
          { tags: ["DamageToOpponent", "DamageToSelf"] },
        ),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const monster = myInfo.selectedEntities
            .filter((monster) => monster.isOnFieldAsMonsterStrictly)
            .filter((monster) => monster.face === "FaceUp")
            .find((monster) => monster.atk);
          if (!monster) {
            return false;
          }
          const records = myInfo.activator.effectDamage(Math.floor(monster.atk ?? 0 / 2), myInfo);
          const dmg = records.map((record) => record.beforeLp - record.afterLp).reduce((wip, current) => wip + current);
          if (dmg < 1) {
            return false;
          }
          await myInfo.activator.duel.clock.incrementProcSeq();
          myInfo.activator.getOpponentPlayer().effectDamage(dmg, myInfo);
          return true;
        },
        settle: async () => true,
      },
      {
        title: "②誘爆",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["DamageToOpponent"],
        triggerPattern: { triggerType: "Departure", needsByOpponent: true, needsByDestory: true, from: playFieldCellTypes },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          myInfo.activator.getOpponentPlayer().effectDamage(1000, myInfo);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "自業自得",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Quick",
        executableCells: ["SpellAndTrapZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["DamageToOpponent"],
        meetsConditions: (myInfo) => Boolean(myInfo.activator.getOpponentPlayer().getMonstersOnField().length),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.activator.getOpponentPlayer().getMonstersOnField();
          if (!cards.length) {
            return false;
          }
          myInfo.activator.getOpponentPlayer().effectDamage(cards.length * 500, myInfo);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

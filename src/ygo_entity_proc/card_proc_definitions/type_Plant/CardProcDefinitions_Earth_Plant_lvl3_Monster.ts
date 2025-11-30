import { canSelfSepcialSummon, defaultActions, defaultSelfSpecialSummonExecute } from "@ygo_entity_proc/card_actions/CardActions_Monster";

import type { EntityDefinition, EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { damageStepPeriodKeys, freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import {} from "@ygo_duel/class/DuelEntityShortHands";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
import { SummonFilter } from "@ygo_duel/class_continuous_effect/DuelSummonFilter";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";

const fluffTokenDefinition: EntityDefinition = {
  name: "綿毛トークン",
  actions: defaultActions,
  staticInfo: {
    name: "綿毛トークン",
    kind: "Monster",
    monsterCategories: ["Normal", "Token"],
    level: 1,
    attack: 0,
    defense: 0,
    attributes: ["Wind"],
    types: ["Plant"],
    wikiEncodedName: "%CC%CA%CC%D3%A5%C8%A1%BC%A5%AF%A5%F3",
  },
};

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ダンディライオン",
    actions: [
      {
        title: "綿毛トークン生成",
        isMandatory: true,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["Graveyard"],
        executablePeriods: [...freeChainDuelPeriodKeys, ...damageStepPeriodKeys],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonToken"],
        triggerPattern: { triggerType: "Departure" },

        canExecute: (myInfo) => {
          // 特殊召喚可能かどうかの判定のため、この時点でトークンを作成しておく必要がある。
          const tokens = DuelEntity.prepareTokenEntities(myInfo.activator, myInfo.action.entity, fluffTokenDefinition, 2);
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            tokens.map((monster) => {
              return {
                monster,
                cells,
                posList: ["Defense"],
              };
            }),
            [],
            false
          );
          return list.length > 1 && list.flatMap((sc) => sc.cells).getDistinct().length > 1;
        },
        prepare: async () => {
          return { selectedEntities: [] };
        },
        execute: async (myInfo) => {
          const tokens = DuelEntity.prepareTokenEntities(myInfo.activator, myInfo.action.entity, fluffTokenDefinition, 2);
          const cells = myInfo.activator.getMonsterZones();
          const summoned =
            (await myInfo.activator.summonMany(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              tokens.map((monster) => {
                return {
                  monster,
                  cells,
                  posList: ["Defense"],
                };
              }),
              [],
              false,
              2,
              (summoned) => summoned.length == 2,
              false
            )) ?? [];

          if (!summoned.length) {
            return false;
          }

          summoned.forEach((token) => {
            token.procFilterBundle.push(
              new ProcFilter({
                title: "アドバンス召喚リリース不可",
                validateAlive: (ope) => ope.duel.clock.isSameTurn(ope.isSpawnedAt),
                isContinuous: false,
                isSpawnedBy: myInfo.action.entity,
                actionAttr: myInfo.action,
                isApplicableTo: (ope, target) => target.parent === myInfo.action.entity,
                procTypes: ["AdvanceSummonRelease"],
                filter: () => false,
              })
            );
          });

          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

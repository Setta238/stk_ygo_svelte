import {
  canSelfSepcialSummon,
  defaultActions,
  defaultRuleSummonExecute,
  defaultRuleSummonPrepare,
  getDestsForSelfSpecialSummon,
} from "@ygo_entity_proc/card_actions/CardActions_Monster";
import type { EntityDefinition, EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { NumericStateOperator } from "@ygo_duel/class_continuous_effect/DuelNumericStateOperator";
import { faceupBattlePositions, type TEntityFlexibleNumericStatusKey } from "@ygo/class/YgoTypes";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import {
  defaultPrepare,
  defaultTargetMonstersRebornExecute,
  defaultTargetMonstersRebornPrepare,
  getSingleTargetActionPartical,
} from "@ygo_entity_proc/card_actions/CardActions";
import { createRegularProcFilterHandler } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { getPayBanishCostsActionPartical } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Banish";
import { IllegalActionError } from "@ygo_duel/class_error/DuelError";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";

const vagueShadowTokenDefinition: EntityDefinition = {
  name: "朧影トークン",
  actions: defaultActions,
  staticInfo: {
    name: "朧影トークン",
    kind: "Monster",
    monsterCategories: ["Normal", "Token"],
    level: 1,
    attack: 0,
    defense: 0,
    attributes: ["Dark"],
    types: ["WingedBeast"],
    wikiEncodedName: "%DB%B0%B1%C6%A5%C8%A1%BC%A5%AF%A5%F3",
  },
  continuousEffects: [
    createRegularProcFilterHandler(
      "リリース不可",
      "Monster",
      (source) => [source],
      (source) => [
        ProcFilter.createContinuous(
          "②リリース不可",
          () => true,
          source,
          () => true,
          ["AdvanceSummonRelease", "ReleaseAsEffect", "ReleaseAsCost"],
          () => false
        ),
      ]
    ),
  ],
  summonFilter: (filter, filterTarget, effectOwner, summoner, movedAs, attr, monster, materialInfos, posList, cells) => {
    const ok = { posList, cells };
    const notAllowed = { posList: [], cells: [] };

    console.log(filterTarget, movedAs);

    if (!movedAs.includes("SynchroSummon")) {
      return ok;
    }
    return notAllowed;
  },
};

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ＢＦ－朧影のゴウフウ",
    actions: [
      {
        title: "特殊召喚",
        isMandatory: false,
        playType: "SpecialSummon",
        spellSpeed: "Normal",
        executableCells: ["Hand"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        canExecute: (myInfo) => canSelfSepcialSummon(myInfo, faceupBattlePositions, [], ["Rule"]) && !myInfo.activator.getMonstersOnField().length,
        getDests: (myInfo) => getDestsForSelfSpecialSummon(myInfo, faceupBattlePositions, [], ["Rule"]),
        prepare: (myInfo) => defaultRuleSummonPrepare(myInfo, "SpecialSummon", ["SpecialSummon", "Rule"], faceupBattlePositions),
        execute: defaultRuleSummonExecute,
        settle: async () => true,
      },
      {
        title: "①トークン生成",
        isMandatory: false,
        playType: "TriggerEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: freeChainDuelPeriodKeys,
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonToken"],
        triggerPattern: { triggerType: "Arrival", arrivalReasons: ["SpecialSummon"], from: ["Hand"] },
        canExecute: (myInfo) => {
          // 特殊召喚可能かどうかの判定のため、この時点でトークンを作成しておく必要がある。
          const tokens = DuelEntity.prepareTokenEntities(myInfo.activator, myInfo.action.entity, vagueShadowTokenDefinition, 2);
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
                posList: faceupBattlePositions,
              };
            }),
            [],
            false
          );
          return list.length > 1 && list.flatMap((sc) => sc.cells).getDistinct().length > 1;
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const tokens = DuelEntity.prepareTokenEntities(myInfo.activator, myInfo.action.entity, vagueShadowTokenDefinition, 2);
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
                  posList: faceupBattlePositions,
                };
              }),
              [],
              false,
              2,
              (summoned) => summoned.length == 2,
              false
            )) ?? [];

          return Boolean(summoned.length);
        },
        settle: async () => true,
      },
      {
        title: "②ファントムシンクロ",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        hasToTargetCards: true,
        ...getPayBanishCostsActionPartical(
          (myInfo) => {
            // 自身以外に素材にできるモンスター
            const materials = myInfo.activator
              .getMonstersOnField()
              .filter((monster) => monster !== myInfo.action.entity)
              .filter((monster) => monster.lvl)
              .filter((monster) => !monster.status.monsterCategories?.includes("Tuner"));
            if (!materials.length) {
              return [];
            }

            // レベル下限
            const baseLvl = myInfo.action.entity.lvl;
            if (!baseLvl) {
              return [];
            }

            // 蘇生対象モンスター
            const monsters = myInfo.activator
              .getGraveyard()
              .cardEntities.filter((monster) => monster.status.nameTags?.includes("ＢＦ"))
              .filter((monster) => monster.status.monsterCategories?.includes("Synchro"))
              .filter((monster) => monster.lvl && monster.lvl > baseLvl);
            if (!monsters.length) {
              return [];
            }

            // 特殊召喚先
            const cells = myInfo.activator.getMonsterZones();

            const selectable = new Set<DuelEntity>();
            for (const pattern of materials.getAllOnOffPattern(1)) {
              const lvl = baseLvl + pattern.map((material) => material.lvl ?? 0).reduce((sum, lvl) => sum + lvl, 0);
              const list = myInfo.activator.getEnableSummonList(
                myInfo.activator,
                "SpecialSummon",
                ["Effect"],
                myInfo.action,
                monsters.filter((monster) => monster.lvl === lvl).map((monster) => ({ monster, cells, posList: faceupBattlePositions })),
                [myInfo.action.entity, ...pattern].map((material) => ({ material, cell: material.cell })),
                false
              );

              if (list.length) {
                pattern.forEach(selectable.add);
                if (selectable.size === materials.length) {
                  break;
                }
              }
            }

            if (!selectable.size) {
              return [];
            }

            return [myInfo.action.entity, ...selectable];
          },
          (selected, myInfo) => {
            if (!selected.includes(myInfo.action.entity)) {
              return false;
            }
            if (selected.length < 2) {
              return false;
            }
            const lvl = selected.map((material) => material.lvl ?? 0).reduce((sum, lvl) => sum + lvl, 0);
            const cells = myInfo.activator.getMonsterZones();
            // 蘇生対象モンスター
            const monsters = myInfo.activator
              .getGraveyard()
              .cardEntities.filter((monster) => monster.status.nameTags?.includes("ＢＦ"))
              .filter((monster) => monster.status.monsterCategories?.includes("Synchro"))
              .filter((monster) => monster.lvl === lvl);
            if (!monsters.length) {
              return false;
            }

            const list = myInfo.activator.getEnableSummonList(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              monsters.filter((monster) => monster.lvl === lvl).map((monster) => ({ monster, cells, posList: faceupBattlePositions })),
              selected.map((material) => ({ material, cell: material.cell })),
              false
            );
            return Boolean(list.length);
          },
          2
        ),
        prepare: async (myInfo) => {
          const infos = myInfo.costInfo.banish;
          if (!infos || !infos.length) {
            throw new IllegalActionError("IllegalActionCost", myInfo);
          }

          const lvl = infos.map((info) => info.cost.lvl ?? 0).reduce((sum, lvl) => sum + lvl, 0);
          if (!lvl) {
            throw new IllegalActionError("IllegalActionCost", myInfo);
          }

          const targets = myInfo.activator
            .getGraveyard()
            .cardEntities.filter((card) => card.lvl === lvl)
            .filter((monster) => monster.status.nameTags?.includes("ＢＦ"))
            .filter((monster) => monster.status.monsterCategories?.includes("Synchro"));

          if (!targets.length) {
            throw new IllegalActionError("IllegalActionCost", myInfo);
          }

          return defaultTargetMonstersRebornPrepare(myInfo, targets, faceupBattlePositions);
        },

        execute: async (myInfo, chainBlockInfos) => {
          if (!defaultTargetMonstersRebornExecute(myInfo, chainBlockInfos)) {
            return false;
          }

          myInfo.selectedEntities.forEach((monster) => {
            monster.statusOperatorBundle.push(
              new StatusOperator({
                title: "チューナー扱い",
                validateAlive: (operator) => true,
                isContinuous: false,
                isSpawnedBy: myInfo.action.entity,
                actionAttr: myInfo.action,
                isApplicableTo: (operator, target) => target.isOnFieldAsMonsterStrictly && target.face === "FaceUp",
                statusCalculator: (bundleOwner, operator, wipStatus) => ({ monsterCategories: ["Tuner", ...(wipStatus.monsterCategories ?? [])] }),
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

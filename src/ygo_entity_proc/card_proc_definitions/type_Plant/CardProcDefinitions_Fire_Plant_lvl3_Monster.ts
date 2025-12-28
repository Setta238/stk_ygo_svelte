import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import {} from "@ygo_duel/class/DuelEntityShortHands";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "ローンファイア・ブロッサム",
    actions: [
      {
        title: "植物族リクルート",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: monsterZoneCellTypes,
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        fixedTags: ["SpecialSummonFromDeck"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        canPayCosts: (myInfo) =>
          myInfo.activator
            .getMonstersOnField()
            .filter((monster) => monster.types.includes("Plant"))
            .filter((monster) => monster.face === "FaceUp")
            .filter((plant) => myInfo.activator.canRelease([plant]))
            .some((plant) => plant.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action)),
        canExecute: (myInfo) => {
          const plants = myInfo.activator.getDeckCell().cardEntities.filter((monster) => monster.types.includes("Plant"));
          if (!plants.length) {
            return false;
          }
          const cells = myInfo.activator.getMonsterZones();

          return myInfo.activator
            .getMonstersOnField()
            .filter((monster) => monster.types.includes("Plant"))
            .filter((monster) => monster.face === "FaceUp")
            .filter((plant) => myInfo.activator.canRelease([plant]))
            .filter((plant) => plant.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action))
            .some((material) => {
              const list = myInfo.activator.getEnableSummonList(
                myInfo.activator,
                "SpecialSummon",
                ["Effect"],
                myInfo.action,
                plants.map((monster) => ({
                  monster,
                  cells,
                  posList: faceupBattlePositions,
                })),
                [{ material, cell: material.cell }],
                false
              );
              return list.length;
            });
        },
        payCosts: async (myInfo) => {
          const plants = myInfo.activator.getDeckCell().cardEntities.filter((monster) => monster.types.includes("Plant"));
          const cells = myInfo.activator.getMonsterZones();
          const materials = myInfo.activator
            .getMonstersOnField()
            .filter((monster) => monster.types.includes("Plant"))
            .filter((monster) => monster.face === "FaceUp")
            .filter((plant) => myInfo.activator.canRelease([plant]))
            .filter((plant) => plant.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action))
            .filter((material) => {
              const list = myInfo.activator.getEnableSummonList(
                myInfo.activator,
                "SpecialSummon",
                ["Effect"],
                myInfo.action,
                plants.map((monster) => ({
                  monster,
                  cells,
                  posList: faceupBattlePositions,
                })),
                [{ material, cell: material.cell }],
                false
              );
              return list.length;
            });

          const cost = await myInfo.activator.waitSelectEntity(materials, "リリースする植物族を選択。", true);
          if (!cost) {
            return undefined;
          }

          const costInfo = { cost, cell: cost.cell };

          await cost.release(["Cost"], myInfo.action.entity, myInfo.activator);

          return { release: [costInfo] };
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const plants = myInfo.activator.getDeckCell().cardEntities.filter((monster) => monster.types.includes("Plant"));
          const cells = myInfo.activator.getMonsterZones();
          const monster = await myInfo.activator.summonOne(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            plants.map((plant) => {
              return { monster: plant, posList: faceupBattlePositions, cells };
            }),
            (myInfo.costInfo.release ?? []).map((info) => ({ material: info.cost, cell: info.cell })),
            false,
            false
          );
          if (!monster) {
            return false;
          }

          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

import type { CardActionDefinition, ChainBlockInfo } from "@ygo_duel/class/DuelCardAction";
import { defaultPrepare } from "./DefaultCardAction";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";

const pendulumSummonAction = {
  title: "ペンデュラム召喚",
  isMandatory: false,
  playType: "SpecialSummon",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  isOnlyNTimesPerTurn: 1,
  validate: (myInfo) => {
    const scales = myInfo.activator.getPendulumScales();
    if (!scales) {
      return;
    }
    if (scales.upperBound - scales.lowerBound < 2) {
      return;
    }

    const monsters = [
      ...myInfo.activator.getHandCell().cardEntities.filter((card) => card.status.kind === "Monster"),
      ...myInfo.activator.getExtraDeck().cardEntities.filter((monster) => monster.face === "FaceUp"),
    ]
      .filter((card) => card.status.kind === "Monster")
      .filter((card) => card.lvl && card.lvl > scales.lowerBound)
      .filter((card) => card.lvl && card.lvl < scales.upperBound);

    if (!monsters.length) {
      return;
    }

    const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.getEmptyExtraZones()];

    const list = myInfo.activator.getEnableSummonList(
      myInfo.activator,
      "PendulumSummon",
      ["Rule"],
      myInfo.action,
      monsters.map((monster) => {
        return {
          monster,
          cells,
          posList: faceupBattlePositions,
        };
      }),
      [],
      false
    );
    return list.length ? [] : undefined;
  },
  prepare: async (myInfo) => {
    const scales = myInfo.activator.getPendulumScales();
    if (!scales) {
      return;
    }
    if (scales.upperBound - scales.lowerBound < 2) {
      return;
    }

    const monsters = [
      ...myInfo.activator.getHandCell().cardEntities.filter((card) => card.status.kind === "Monster"),
      ...myInfo.activator.getExtraDeck().cardEntities.filter((monster) => monster.face === "FaceUp"),
    ]
      .filter((card) => card.status.kind === "Monster")
      .filter((card) => card.lvl && card.lvl > scales.lowerBound)
      .filter((card) => card.lvl && card.lvl < scales.upperBound);

    if (!monsters.length) {
      return;
    }

    const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.getEmptyExtraZones()];
    await myInfo.activator.summonMany(
      myInfo.activator,
      "PendulumSummon",
      ["Rule"],
      myInfo.action,
      monsters.map((monster) => {
        return { monster: monster, posList: faceupBattlePositions, cells };
      }),
      [],
      false,
      undefined,
      (summoned) => summoned.length > 0,
      false
    );

    return defaultPrepare();
  },
  execute: async (myInfo: ChainBlockInfo<unknown>): Promise<boolean> => {
    myInfo.activator.getPendingMonstersOnField().forEach((monster) => monster.determine());
    return true;
  },
  settle: async () => true,
} as CardActionDefinition<unknown>;

export const duelistActions = [pendulumSummonAction] as const;

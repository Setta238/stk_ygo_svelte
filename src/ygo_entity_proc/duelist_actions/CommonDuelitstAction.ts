import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { CardActionDefinition, ChainBlockInfo } from "../../ygo_duel/class/DuelEntityAction";
import { defaultPrepare } from "../card_actions/CardActions";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { DuelEnd, SystemError } from "@ygo_duel/class/Duel";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
export const pendulumSummonAction: CardActionDefinition<unknown> = {
  title: "ペンデュラム召喚",
  isMandatory: false,
  playType: "SpecialSummon",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  executablePeriods: ["main1", "main2"],
  executableDuelistTypes: ["Controller"],
  isOnlyNTimesPerTurn: 1,
  canExecute: (myInfo) => {
    const scales = myInfo.activator.getPendulumScales();
    if (!scales) {
      return false;
    }
    if (scales.upperBound - scales.lowerBound < 2) {
      return false;
    }

    const monsters = [
      ...myInfo.activator.getHandCell().cardEntities.filter((card) => card.kind === "Monster"),
      ...myInfo.activator.getExtraDeck().cardEntities.filter((monster) => monster.face === "FaceUp"),
    ]
      .filter((card) => card.kind === "Monster")
      .filter((card) => card.lvl && card.lvl > scales.lowerBound)
      .filter((card) => card.lvl && card.lvl < scales.upperBound);

    if (!monsters.length) {
      return false;
    }

    const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.getAvailableMonsterZones()];

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
    return list.length > 0;
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
      ...myInfo.activator.getHandCell().cardEntities.filter((card) => card.kind === "Monster"),
      ...myInfo.activator.getExtraDeck().cardEntities.filter((monster) => monster.face === "FaceUp"),
    ]
      .filter((card) => card.kind === "Monster")
      .filter((card) => card.lvl && card.lvl > scales.lowerBound)
      .filter((card) => card.lvl && card.lvl < scales.upperBound);

    if (!monsters.length) {
      return;
    }

    const cells = [...myInfo.activator.getMonsterZones(), ...myInfo.activator.getAvailableExtraMonsterZones()];
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
    for (const monster of myInfo.activator.getPendingMonstersOnField()) {
      await monster.determine();
    }
    return true;
  },
  settle: async () => true,
};
export const ftkChallengeFailedAction: CardActionDefinition<unknown> = {
  title: "強制勝利",
  isMandatory: true,
  playType: "LingeringEffect",
  spellSpeed: "Normal",
  executableCells: ["Hand"],
  executablePeriods: ["main2"],
  executableDuelistTypes: ["Controller"],
  isOnlyNTimesPerTurn: 1,
  canExecute: (myInfo) => myInfo.activator.duel.clock.turn > 1,
  prepare: async (myInfo) => {
    await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(
      myInfo.activator.duel.field.getCardsOnFieldStrictly(),
      ["Rule"],
      myInfo.action.entity,
      myInfo.activator
    );
    return { selectedEntities: [], nextChainBlockFilter: () => false };
  },
  execute: async (myInfo) => {
    const items = [
      { name: "封印されし者の左足", column: 4 },
      { name: "封印されし者の右足", column: 2 },
      { name: "封印されし者の左腕", column: 5 },
      { name: "封印されし者の右腕", column: 1 },
      { name: "封印されしエクゾディア", column: 3 },
    ];

    for (const item of items) {
      const exodiaParts = [
        myInfo.activator.duel.field
          .getAllCardEntities()
          .filter((card) => card.owner === myInfo.activator)
          .find((card) => card.origin.name === item.name),
        myInfo.activator
          .getOpponentPlayer()
          .getHandCell()
          .cardEntities.find((card) => card.origin.name === item.name),
      ].filter((part): part is DuelEntity => part !== undefined);

      if (!exodiaParts.length) {
        throw new SystemError("想定されない状態", myInfo.activator.getHandCell().cardEntities, item.name);
      }

      await DuelEntity.moveMany(
        exodiaParts.map((part) => {
          return {
            entity: part,
            to:
              part.controller.getMonsterZones().find((cell) => cell.column === (part.controller.seat === "Above" ? 6 - item.column : item.column)) ??
              part.controller.getFieldZone(),
            kind: "Monster",
            face: "FaceUp",
            orientation: "Vertical",
            pos: "Top",
            movedAs: ["Rule"],
            movedBy: undefined,
            actionOwner: undefined,
            chooser: undefined,
          };
        })
      );
    }
    throw new DuelEnd(myInfo.activator, `${myInfo.activator.getOpponentPlayer().name}がワンターンキルに失敗した。`);
  },
  settle: async () => true,
};

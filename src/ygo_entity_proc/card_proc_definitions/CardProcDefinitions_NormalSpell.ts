import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { duelFieldCellTypes, monsterZoneCellTypes, spellTrapZoneCellTypes, type DuelFieldCellType } from "@ygo_duel/class/DuelFieldCell";
import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";
import { IllegalCancelError, SystemError } from "@ygo_duel/class/Duel";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import {
  defaultPayLifePoint,
  defaultPrepare,
  defaultTargetMonstersRebornExecute,
  defaultTargetMonstersRebornPrepare,
  getSystemPeriodAction,
} from "@ygo_entity_proc/card_actions/CardActions";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { executableDuelistTypes, type ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { defaultActions } from "@ygo_entity_proc/card_actions/CardActions_Monster";

export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "死者蘇生",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromGraveyard"],
        hasToTargetCards: true,
        // 墓地に蘇生可能モンスター、場に空きが必要。
        canExecute: (myInfo) => {
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator.duel.field
              .getCells("Graveyard")
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo))
              .map((monster) => {
                return { monster, posList: faceupBattlePositions, cells };
              }),
            [],
            false
          );
          return list.length > 0;
        },
        prepare: (myInfo) =>
          defaultTargetMonstersRebornPrepare(
            myInfo,
            myInfo.activator.duel.field
              .getCells("Graveyard")
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card.kind === "Monster")
              .filter((card) => card.canBeTargetOfEffect(myInfo))
          ),
        execute: defaultTargetMonstersRebornExecute,
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };

  for (const item of [
    { name: "大嵐", cellTypes: spellTrapZoneCellTypes, isOnlyEnemies: false },
    { name: "ハーピィの羽根帚", cellTypes: spellTrapZoneCellTypes, isOnlyEnemies: true },
    { name: "ブラック・ホール", cellTypes: monsterZoneCellTypes, isOnlyEnemies: false },
    { name: "サンダー・ボルト", cellTypes: monsterZoneCellTypes, isOnlyEnemies: true },
  ] as { name: string; cellTypes: Readonly<DuelFieldCellType[]>; isOnlyEnemies: boolean }[]) {
    yield {
      name: item.name,
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          fixedTags: ["DestroyOnField"],
          canExecute: (myInfo) => {
            let cards = myInfo.action.entity.field
              .getCells(...item.cellTypes)
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card !== myInfo.action.entity);
            if (item.isOnlyEnemies) {
              cards = cards.filter((card) => card.controller !== myInfo.activator);
            }
            return cards.length > 0;
          },
          prepare: async (myInfo) => {
            let cards = myInfo.action.entity.field
              .getCells(...item.cellTypes)
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card !== myInfo.action.entity);
            if (item.isOnlyEnemies) {
              cards = cards.filter((card) => card.controller !== myInfo.activator);
            }

            return { selectedEntities: [], chainBlockTags: myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, cards) };
          },
          execute: async (myInfo) => {
            let cards = myInfo.action.entity.field
              .getCells(...item.cellTypes)
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card !== myInfo.action.entity);
            if (item.isOnlyEnemies) {
              cards = cards.filter((card) => card.controller !== myInfo.activator);
            }

            await DuelEntityShortHands.tryDestroy(cards, myInfo);

            return true;
          },
          settle: async () => true,
        },
        defaultSpellTrapSetAction,
      ],
    };
  }
  yield {
    name: "ハリケーン",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["BounceToHand"],
        canExecute: (myInfo) =>
          myInfo.action.entity.field
            .getCells("SpellAndTrapZone", "FieldSpellZone")
            .flatMap((cell) => cell.cardEntities)
            .some((card) => card !== myInfo.action.entity),
        prepare: async () => {
          return { selectedEntities: [] };
        },
        execute: async (myInfo, chainBlockInfos) => {
          // 発動済の魔法罠はバウンスできない
          const activatedCards = chainBlockInfos
            .map((info) => info.action)
            .filter((action) => action.playType === "CardActivation")
            .map((action) => action.entity)
            .filter((card) => card.face === "FaceUp");

          // ※自分自身も上のリストに含まれているはず
          const cards = myInfo.action.entity.field
            .getCells("SpellAndTrapZone", "FieldSpellZone")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => !activatedCards.includes(card));

          await DuelEntityShortHands.returnManyToHandForTheSameReason(cards, ["Effect"], myInfo.action.entity, myInfo.activator);
          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };

  const getOrCreateSecurityToken = (myInfo: ChainBlockInfoBase<unknown>) =>
    myInfo.activator.duel.field.getWaitingRoomCell().cardEntities.find((entity) => entity.parent === myInfo.action.entity) ??
    DuelEntity.createTokenEntity(myInfo.activator, myInfo.action.entity, {
      name: "セキュリティトークン",
      actions: defaultActions,
      staticInfo: {
        name: "セキュリティトークン",
        kind: "Monster",
        monsterCategories: ["Normal", "Token"],
        level: 4,
        attack: 2000,
        defense: 2000,
        attributes: ["Light"],
        types: ["Cyberse"],
        wikiEncodedName: "%A5%BB%A5%AD%A5%E5%A5%EA%A5%C6%A5%A3%A5%C8%A1%BC%A5%AF%A5%F3",
      },
    });

  yield {
    name: "ワンタイム・パスコード",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        isOnlyNTimesPerTurn: 1,
        fixedTags: ["SpecialSummon", "SpecialSummonToken"],
        canExecute: (myInfo) => {
          const token = getOrCreateSecurityToken(myInfo);
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            [{ monster: token, posList: ["Defense"], cells }],
            [],
            false
          );
          return list.length > 0;
        },
        prepare: async () => {
          return { selectedEntities: [] };
        },
        execute: async (myInfo) => {
          const token = getOrCreateSecurityToken(myInfo);
          const cells = myInfo.activator.getMonsterZones();

          const summoned = await myInfo.activator.summon("SpecialSummon", ["Effect"], myInfo.action, token, ["Defense"], cells, [], false);
          return Boolean(summoned);
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };

  yield {
    name: "ワン・フォー・ワン",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromDeck"],
        priorityForNPC: 40,
        canPayCosts: (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.every((card) => (card.lvl ?? 12) > 1)) {
            if (myInfo.activator.getHandCell().cardEntities.every((card) => (card.lvl ?? 12) > 1)) {
              return false;
            }
            if (myInfo.activator.getHandCell().cardEntities.filter((card) => card.kind === "Monster").length < 2) {
              return false;
            }
          } else if (myInfo.activator.getHandCell().cardEntities.filter((card) => card.kind === "Monster").length === 0) {
            return false;
          }

          return true;
        },
        canExecute: (myInfo) => {
          let allLvl1Monsters = [
            ...myInfo.activator.getDeckCell().cardEntities.filter((card) => (card.lvl ?? 12) === 1),
            ...myInfo.activator.getHandCell().cardEntities.filter((card) => (card.lvl ?? 12) === 1),
          ];
          const handMonsters = myInfo.activator.getHandCell().cardEntities;

          if (handMonsters.length < 2 || !myInfo.ignoreCosts) {
            allLvl1Monsters = allLvl1Monsters.filter((lvl1) => !handMonsters.includes(lvl1));
          }
          const cells = myInfo.activator.getMonsterZones();
          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            allLvl1Monsters.map((lvl1) => {
              return { monster: lvl1, posList: faceupBattlePositions, cells };
            }),
            [],
            false
          );
          return list.length > 0;
        },
        payCosts: async (myInfo, chainBlockInfos, cancelable) => {
          // 特殊召喚できるレベル１を取得
          const allLvl1Monsters = [
            ...myInfo.activator.getDeckCell().cardEntities.filter((card) => (card.lvl ?? 12) === 1),
            ...myInfo.activator.getHandCell().cardEntities.filter((card) => (card.lvl ?? 12) === 1),
          ];
          const cells = myInfo.activator.getMonsterZones();

          const list = myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            allLvl1Monsters.map((lvl1) => {
              return { monster: lvl1, posList: faceupBattlePositions, cells };
            }),
            [],
            false
          );
          let choices: DuelEntity[] = myInfo.activator.getHandCell().cardEntities.filter((card) => card.kind === "Monster");

          //特殊召喚できるレベル１が一体しかいない場合、そのモンスターは手札コストにできない。
          if (list.length === 1) {
            choices = choices.filter((monster) => !list.map((item) => item.monster).includes(monster));
          }

          const cost = await myInfo.activator.waitSelectEntity(choices, "墓地へ送るモンスターを選択", cancelable);
          if (!cost) {
            throw new IllegalCancelError(myInfo);
          }

          await cost.sendToGraveyard(["Cost"], myInfo.action.entity, myInfo.activator);

          return { sendToGraveyard: [cost] };
        },
        prepare: async () => {
          return { selectedEntities: [] };
        },
        execute: async (myInfo) => {
          const monsters = [
            ...myInfo.activator.getDeckCell().cardEntities.filter((card) => card.lvl === 1),
            ...myInfo.activator.getHandCell().cardEntities.filter((card) => card.lvl === 1),
          ];

          const cells = myInfo.activator.getMonsterZones();
          const monster = await myInfo.activator.summonOne(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            monsters.map((lvl1) => {
              return { monster: lvl1, posList: faceupBattlePositions, cells };
            }),
            [],
            false,
            false
          );
          if (!monster) {
            return false;
          }
          myInfo.activator.getDeckCell().shuffle();

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };

  yield {
    name: "封印の黄金櫃",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["BanishFromDeck"],
        canExecute: (myInfo) =>
          myInfo.activator.getDeckCell().cardEntities.some((card) => myInfo.activator.canTryBanish(card, "BanishAsEffect", myInfo.action)),
        prepare: async () => {
          return { selectedEntities: [] };
        },
        execute: async (myInfo) => {
          const cards = myInfo.activator.getDeckCell().cardEntities.filter((card) => myInfo.activator.canTryBanish(card, "BanishAsEffect", myInfo.action));
          const selected = await myInfo.activator.waitSelectEntity(cards, "除外するカードを選択。", false);

          if (!selected) {
            throw new IllegalCancelError(myInfo);
          }

          const salvageables = await DuelEntityShortHands.tryBanish("BanishAsEffect", [selected], myInfo);

          //回収可能な場合、一旦既存の封印の黄金櫃カウンターを全て取り除く
          salvageables.forEach((card) => card.counterHolder.removeAll("GoldSarcophagus"));

          return true;
        },
        settle: async () => true,
      },
      getSystemPeriodAction("回収カウント進行", ["stanby"], (myInfo) => {
        if (!myInfo.activator.isTurnPlayer) {
          return;
        }

        // 封印の黄金櫃カウンターを置く
        myInfo.action.entity.field
          .getCells("Banished")
          .flatMap((cell) => cell.cardEntities)
          .filter((card) => card.moveLog.latestRecord.movedBy === myInfo.action.entity)
          .filter((card) => card.moveLog.latestRecord.actionOwner === myInfo.activator)
          .forEach((card) => {
            card.counterHolder.add("GoldSarcophagus", 1, myInfo.action.entity);
            const qty = card.counterHolder.getQty("GoldSarcophagus", myInfo.action.entity);
            if (qty < 3) {
              myInfo.activator.duel.log.info(`${card.toString()}のターンカウント：${qty - 1}⇒${qty}`);
            }
          });
      }),
      {
        title: "回収",
        isMandatory: true,
        playType: "LingeringEffect",
        spellSpeed: "Normal",
        executableCells: duelFieldCellTypes, //回収効果はカード本体の状態に係わらず、使用可能
        executablePeriods: ["stanby"],
        executableDuelistTypes,
        canExecute: (myInfo) =>
          myInfo.activator.isTurnPlayer &&
          myInfo.action.entity.field
            .getCells("Banished")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.moveLog.latestRecord.movedBy === myInfo.action.entity)
            .filter((card) => card.moveLog.latestRecord.actionOwner === myInfo.activator)
            .some((card) => card.counterHolder.getQty("GoldSarcophagus") === 2),
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const cards = myInfo.action.entity.field
            .getCells("Banished")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.moveLog.latestRecord.movedBy === myInfo.action.entity)
            .filter((card) => card.moveLog.latestRecord.actionOwner === myInfo.activator)
            .filter((card) => card.counterHolder.getQty("GoldSarcophagus") === 2);
          if (!cards.length) {
            throw new SystemError("想定されない状態", myInfo);
          }

          let card = cards[0];

          if (cards.length > 1) {
            const selected = await myInfo.activator.waitSelectEntity(cards, "回収するカードを選択。", false);
            if (!selected) {
              throw new IllegalCancelError(myInfo);
            }

            card = selected;
          }

          await card.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
  yield {
    name: "魔の試着部屋",
    actions: [
      {
        title: "発動",
        isMandatory: false,
        playType: "CardActivation",
        spellSpeed: "Normal",
        executableCells: ["Hand", "SpellAndTrapZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        fixedTags: ["SpecialSummonFromDeck"],
        canPayCosts: (myInfo) => myInfo.activator.lp >= 800,
        canExecute: (myInfo) =>
          myInfo.activator.getDeckCell().cardEntities.length > 0 &&
          myInfo.activator.getEnableSummonList(
            myInfo.activator,
            "SpecialSummon",
            ["Effect"],
            myInfo.action,
            myInfo.activator
              .getDeckCell()
              .cardEntities.filter((card) => card.kind === "Monster")
              .filter((monster) => monster.status.monsterCategories?.includes("Normal"))
              .filter((monster) => (monster.lvl ?? 12) < 4)
              .map((monster) => {
                return { monster, posList: faceupBattlePositions, cells: myInfo.activator.getMonsterZones() };
              }),
            [],
            false
          ).length > 0,
        payCosts: (myInfo, chainBlockInfos) => defaultPayLifePoint(myInfo, chainBlockInfos, 800),
        prepare: async () => {
          return { selectedEntities: [] };
        },
        execute: async (myInfo) => {
          if (myInfo.activator.getDeckCell().cardEntities.length < 4) {
            return false;
          }
          const cards = await DuelEntityShortHands.excavateManyFromDeck(myInfo.activator, 4, ["Effect"], myInfo.action.entity, myInfo.activator);

          const monsters = cards
            .filter((card) => card.kind === "Monster")
            .filter((monster) => monster.status.monsterCategories?.includes("Normal"))
            .filter((monster) => (monster.lvl ?? 12) < 4);

          if (monsters.length) {
            const cells = myInfo.activator.getMonsterZones();
            const qty = monsters.length > cells.length ? cells.length : monsters.length;
            await myInfo.activator.summonMany(
              myInfo.activator,
              "SpecialSummon",
              ["Effect", "Excavate"],
              myInfo.action,
              monsters.map((monster) => {
                return {
                  monster,
                  cells,
                  posList: faceupBattlePositions,
                };
              }),
              [],
              false,
              qty,
              (summoned) => summoned.length === qty,
              false
            );
          }

          await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(
            monsters.filter((monster) => !monster.isOnFieldAsMonsterStrictly),
            ["Effect", "Excavate"],
            myInfo.action.entity,
            myInfo.activator
          );

          await DuelEntityShortHands.returnManyToDeckForTheSameReason(
            "Random",
            cards.filter((card) => card.cell.cellType === "Deck"),
            ["Effect"],
            myInfo.action.entity,
            myInfo.activator
          );

          return true;
        },
        settle: async () => true,
      },
      defaultSpellTrapSetAction,
    ],
  };
}

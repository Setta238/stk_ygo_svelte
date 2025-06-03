import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { canSelfSepcialSummon, defaultSelfSpecialSummonExecute, defaultSummonFilter } from "@ygo_entity_proc/card_actions/CardActions_Monster";
import { createRegularProcFilterHandler } from "@ygo_duel/class_continuous_effect/DuelContinuousEffect";
import { ProcFilter } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { monsterZoneCellTypes, playFieldCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { ChainBlockInfo, ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { SystemError } from "@ygo_duel/class/Duel";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";

export default function* generate(): Generator<EntityProcDefinition> {
  {
    const getAlbionRevivePatterns = (myInfo: ChainBlockInfoBase<unknown> | ChainBlockInfo<unknown>) => {
      //すでに対象に取っている場合、そのモンスターたちを使用する
      // また対象に取っていない場合、お互いの墓地から対象に取れるモンスターを抽出
      const monsters =
        "selectedEntities" in myInfo
          ? myInfo.selectedEntities
          : myInfo.action.entity.field
              .getCells("Graveyard")
              .flatMap((cell) => cell.cardEntities)
              .filter((card) => card.isMonster)
              .filter((card) => card.canBeTargetOfEffect(myInfo));
      console.log(monsters);
      //二体未満なら不可
      if (monsters.length < 2) {
        return;
      }
      console.log(monsters);

      // それぞれプレイヤーの場に出せるパターンを抽出
      let patterns = [myInfo.activator, myInfo.activator.getOpponentPlayer()].map((duelist) =>
        myInfo.activator.getEnableSummonList(
          myInfo.activator,
          "SpecialSummon",
          ["Effect"],
          myInfo.action,
          monsters.map((monster) => ({ monster, cells: duelist.getMonsterZones(), posList: faceupBattlePositions })),
          [],
          false
        )
      );

      console.log(monsters, patterns);
      // どちらかのプレイヤーの場に出せないなら不可
      if (patterns.some((pattern) => !pattern.length)) {
        return;
      }
      console.log(monsters, patterns);

      if (patterns.every((pattern) => pattern.length === 1)) {
        // どちらのプレイヤーの場に出すパターンも１種類しかなく、そのモンスターが一致するなら不可
        if (
          patterns
            .flat()
            .map((sc) => sc.monster.seq)
            .getDistinct().length === 1
        ) {
          return;
        }
      } else if (patterns.map((pattern) => pattern.length === 1)) {
        // どちらかのプレイヤーに出すパターンが一種類しかない場合、そのモンスターは出す先が固定される。

        // 上記条件を満たすモンスターを取得（配列として取得しているが、ここまでの条件のためにここは必ず要素数１になる）
        const reservedMonsters = patterns
          .filter((pattern) => pattern.length === 1)
          .flat()
          .map((sc) => sc.monster);
        // もう片方から、上記モンスターのパターンを除外
        patterns = patterns.map((pattern) => (pattern.length < 2 ? pattern : pattern.filter((sc) => !reservedMonsters.includes(sc.monster))));
      }

      // 作成したパターンを返す。
      return patterns;
    };

    const getAlbionReleaseCosts = (myInfo: ChainBlockInfoBase<unknown>) =>
      myInfo.activator.duel.field
        .getCells(...monsterZoneCellTypes)
        .filter((cell) => cell.row === 3 || cell.column === 3)
        .filter((cell) => cell.cardEntities.length)
        .map((cell) => cell.cardEntities[0])
        .filter((monster) => monster.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action));
    yield {
      name: "真炎竜アルビオン",
      fusionMaterialInfos: [
        { type: "Name", cardName: "アルバスの落胤" },
        { type: "Filter", filter: (entity) => entity.attr.includes("Light") && entity.types.includes("Spellcaster") },
      ],
      actions: [
        {
          title: "②蘇生",
          isMandatory: false,
          playType: "QuickEffect",
          spellSpeed: "Quick",
          executableCells: playFieldCellTypes,
          executablePeriods: freeChainDuelPeriodKeys,
          executableDuelistTypes: ["Controller"],
          fixedTags: ["SpecialSummonFromGraveyard"],
          isOnlyNTimesPerTurn: 1,
          canExecute: (myInfo) => !myInfo.activator.isTurnPlayer && Boolean(getAlbionRevivePatterns(myInfo)),
          prepare: async (myInfo, chainBlockInfos, cancelable) => {
            const patterns = getAlbionRevivePatterns(myInfo);
            if (!patterns) {
              throw new SystemError("想定されない状態");
            }
            const selectedEntities = await myInfo.activator.waitSelectEntities(
              patterns
                .flat()
                .map((sc) => sc.monster)
                .getDistinct(),
              2,
              (selected) => selected.length == 2 && patterns.every((pattern) => pattern.map((sc) => sc.monster).some((monster) => selected.includes(monster))),
              "蘇生するモンスターを選択。",
              cancelable
            );

            return { selectedEntities };
          },
          execute: async (myInfo) => {
            if (myInfo.selectedEntities.some((entity) => entity.wasMovedAfter(myInfo.isActivatedAt))) {
              return false;
            }

            const patterns = getAlbionRevivePatterns(myInfo);

            if (!patterns) {
              return false;
            }
            await myInfo.activator.summonEachFields(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              patterns.flat(),
              [],
              false,
              1,
              (summoned) => summoned.length === 1,
              false
            );
            return true;
          },
          settle: async () => true,
        },
        {
          title: "③自己再生",
          isMandatory: false,
          playType: "IgnitionEffect",
          spellSpeed: "Normal",
          executableCells: ["Graveyard"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          fixedTags: ["SpecialSummonFromGraveyard"],
          isOnlyNTimesPerTurn: 1,
          canPayCosts: (myInfo) => getAlbionReleaseCosts(myInfo).length === 4,
          canExecute: (myInfo) =>
            canSelfSepcialSummon(
              myInfo,
              faceupBattlePositions,
              getAlbionReleaseCosts(myInfo).map((monster) => ({
                material: monster,
                cell: monster.cell,
                isAsEffectCost: true,
              })),
              ["Effect"]
            ),
          payCosts: async (myInfo) => {
            const costs = getAlbionReleaseCosts(myInfo);
            await DuelEntityShortHands.releaseManyForTheSameReason(costs, ["Release", "Cost"], myInfo.action.entity, myInfo.activator);
            return { release: costs };
          },
          prepare: defaultPrepare,
          execute: defaultSelfSpecialSummonExecute,
          settle: async () => true,
        },
      ],
      continuousEffects: [
        createRegularProcFilterHandler(
          "①対象耐性",
          "Monster",
          (source) => [source],
          (source) => [
            ProcFilter.createContinuous(
              "①対象耐性",
              () => true,
              source,
              () => true,
              ["EffectTarget"],
              (bundleOwner, activator) => bundleOwner.controller === activator
            ),
          ]
        ),
      ],
      summonFilter: (...args) => {
        const [filter, , , , movedAs, , , materialInfos] = args;
        const notAllowed = { posList: [], cells: [] };

        if (!movedAs.includes("FusionSummon")) {
          return defaultSummonFilter(...args);
        }

        if (!materialInfos.some((info) => info.material === filter.isSpawnedBy)) {
          return defaultSummonFilter(...args);
        }

        return notAllowed;
      },
    };
  }
}

import { faceupBattlePositions } from "@ygo/class/YgoTypes";
import { SystemError } from "@ygo_duel/class/Duel";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { entityCostTypes, type ActionCostInfo, type ChainBlockInfoBase } from "@ygo_duel/class/DuelEntityAction";
import { isNameTypeFusionMaterialInfo, type EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import type { SummonChoice } from "@ygo_duel/class/Duelist";
import { freeChainDuelPeriodKeys } from "@ygo_duel/class/DuelPeriod";
import { defaultTargetMonstersRebornExecute } from "@ygo_entity_proc/card_actions/CardActions";
import { defaultCanPayReleaseCost } from "@ygo_entity_proc/card_actions/partical_pay_cost/CardActionPartical_PayCost_Release";
import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";
import { monsterZoneCellTypes } from "@ygo_duel/class/DuelFieldCell";
import { StkPicker } from "@stk_utils/class/StkPicker";

export default function* generate(): Generator<EntityProcDefinition> {
  {
    type BrandedExpulsionRevivePatterns = { share?: SummonChoice[][]; takeAll: SummonChoice[] } | { share: SummonChoice[][]; takeAll?: SummonChoice[] };
    const isBrandedExpulsionRevivePatterns = (p: Partial<BrandedExpulsionRevivePatterns>): p is BrandedExpulsionRevivePatterns => Boolean(p.share || p.takeAll);

    const getBrandedExpulsionRevivePatterns = (
      myInfo: ChainBlockInfoBase<unknown>,
      costInfo: ActionCostInfo,
      selectedEntities?: DuelEntity[]
    ): BrandedExpulsionRevivePatterns | undefined => {
      // すでに対象に取っている場合、そのモンスターたちを使用する
      // まだ対象に取っていない場合、お互いの墓地から対象に取れるモンスターを抽出
      const monsters = selectedEntities
        ? selectedEntities
        : myInfo.activator.duel.field
            .getCells("Graveyard", "Banished")
            .flatMap((cell) => cell.cardEntities)
            .filter((card) => card.isMonster)
            .filter((card) => !card.status.monsterCategories?.includes("Fusion"))
            .filter((card) => card.canBeTargetOfEffect(myInfo));

      //二体未満なら不可
      if (monsters.length < 2) {
        return;
      }

      // アルバスの落胤指定の融合モンスターをコストにする場合、総取りも可能
      const canTakeAll = Boolean(
        costInfo.release
          ?.flatMap((info) => info.cost.fusionMaterialInfos)
          .filter(isNameTypeFusionMaterialInfo)
          .map((info) => info.cardName)
          .includes("アルバスの落胤")
      );

      // 召喚チェックに使う素材情報
      const materialInfos = entityCostTypes
        .flatMap((type) => costInfo[type] ?? [])
        .map((info) => ({ material: info.cost, isAsEffectCost: true, cell: info.cell }));

      // 結果格納用変数
      const result: Partial<ReturnType<typeof getBrandedExpulsionRevivePatterns>> = {};

      if (canTakeAll) {
        // 総取りの場合のチェック
        const _takeAllPattern = myInfo.activator.getEnableSummonList(
          myInfo.activator,
          "SpecialSummon",
          ["Effect"],
          myInfo.action,
          monsters.map((monster) => ({ monster, cells: myInfo.activator.getMonsterZones(), posList: ["Defense"] })),
          materialInfos,
          false
        );

        // 条件を満たすなら結果に格納
        if (_takeAllPattern.length > 1 && _takeAllPattern.flatMap((sc) => sc.cells).getDistinct().length > 1) {
          result.takeAll = _takeAllPattern;
        }
      }

      // それぞれプレイヤーの場に出せるパターンを抽出
      const patterns = [myInfo.activator, myInfo.activator.getOpponentPlayer()].map((duelist) =>
        myInfo.activator.getEnableSummonList(
          myInfo.activator,
          "SpecialSummon",
          ["Effect"],
          myInfo.action,
          monsters.map((monster) => ({ monster, cells: duelist.getMonsterZones(), posList: faceupBattlePositions })),
          materialInfos,
          false
        )
      );

      if (patterns.some((pattern) => !pattern.length)) {
        // どちらかのプレイヤーの場に出せないならば不可
      } else if (patterns.every((pattern) => pattern.length === 1)) {
        // どちらのプレイヤーの場に出すパターンも１種類しかなく、そのモンスターが一致するなら不可
        if (
          patterns
            .flat()
            .map((sc) => sc.monster.seq)
            .getDistinct().length !== 1
        ) {
          result.share = patterns;
        }
      } else if (patterns.some((pattern) => pattern.length === 1)) {
        // どちらかのプレイヤーに出すパターンが一種類しかない場合、そのモンスターは出す先が固定される。

        // 上記条件を満たすモンスターを取得（配列として取得しているが、ここまでの条件のためにここは必ず要素数１になる）
        const reservedMonsters = patterns
          .filter((pattern) => pattern.length === 1)
          .flat()
          .map((sc) => sc.monster);
        // もう片方から、上記モンスターのパターンを除外
        result.share = patterns.map((pattern) => (pattern.length < 2 ? pattern : pattern.filter((sc) => !reservedMonsters.includes(sc.monster))));
      } else {
        result.share = patterns;
      }

      // どちらかの方法でモンスターを出せる場合、値を返す
      return isBrandedExpulsionRevivePatterns(result) ? result : undefined;
    };

    yield {
      name: "分かつ烙印",
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Quick",
          executableCells: ["SpellAndTrapZone"],
          executablePeriods: freeChainDuelPeriodKeys,
          executableDuelistTypes: ["Controller"],
          fixedTags: ["SpecialSummonFromGraveyard"],
          isOnlyNTimesPerTurn: 1,
          canPayCosts: (myInfo) =>
            defaultCanPayReleaseCost(
              myInfo,
              monsterZoneCellTypes,
              (entity) => Boolean(entity.status.monsterCategories?.includes("Fusion")),
              StkPicker.create(1)
            ),
          canExecute: (myInfo, chainBlockInfos, irregularExecuteInfo) => {
            if (irregularExecuteInfo) {
              // 非正規コストで発動する場合、検証するのは１パターンで良い
              return Boolean(getBrandedExpulsionRevivePatterns(myInfo, irregularExecuteInfo.costInfo));
            }

            // 正規コストで発動する場合、融合モンスターを１体ずつ検証する
            return myInfo.activator
              .getMonstersOnField()
              .filter((card) => card.status.monsterCategories?.includes("Fusion"))
              .filter((fusionMonster) => fusionMonster.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action))
              .some((fusionMonster) => getBrandedExpulsionRevivePatterns(myInfo, { release: [{ cost: fusionMonster, cell: fusionMonster.cell }] }));
          },
          payCosts: async (myInfo, chainBlockInfos, cancelable) => {
            // コスト支払いの際は、全融合モンスターを検証する
            const cost = await myInfo.activator.waitSelectEntity(
              myInfo.activator
                .getMonstersOnField()
                .filter((card) => card.status.monsterCategories?.includes("Fusion"))
                .filter((fusionMonster) => fusionMonster.canBeReleased(myInfo.activator, myInfo.action.entity, ["ReleaseAsCost"], myInfo.action))
                .filter((fusionMonster) => getBrandedExpulsionRevivePatterns(myInfo, { release: [{ cost: fusionMonster, cell: fusionMonster.cell }] })),
              "リリースするモンスターを選択。",
              cancelable
            );

            // 選択されなければキャンセル
            if (!cost) {
              return;
            }

            const costInfo = { cost, cell: cost.cell };

            await cost.release(["Cost"], myInfo.action.entity, myInfo.activator);

            return { release: [costInfo] };
          },
          prepare: async (myInfo, chainBlockInfos, cancelable) => {
            // 蘇生可能パターンを抽出
            const patterns = getBrandedExpulsionRevivePatterns(myInfo, myInfo.costInfo);
            if (!patterns) {
              throw new SystemError("想定されない状態");
            }

            // 一旦モンスターを全て混ぜる
            const monsters: DuelEntity[] = [];
            if (patterns.share) {
              monsters.push(...patterns.share.flat().map((sc) => sc.monster));
            }
            if (patterns.takeAll) {
              monsters.push(...patterns.takeAll.map((sc) => sc.monster));
            }

            const selectedEntities = await myInfo.activator.waitSelectEntities(
              monsters.getDistinct(),
              2,
              (selected) => {
                // 二体のみ可
                if (selected.length !== 2) {
                  return false;
                }

                // どちらかのパターンに合致すれば可
                if (patterns.share) {
                  // 分け合いパターン
                  if (patterns.share.every((pattern) => pattern.map((sc) => sc.monster).some((monster) => selected.includes(monster)))) {
                    return true;
                  }
                }

                if (patterns.takeAll) {
                  // 総取りパターン
                  const takeAll = patterns.takeAll;
                  if (selected.every((monster) => takeAll.map((sc) => sc.monster).includes(monster))) {
                    return true;
                  }
                }

                return false;
              },
              "蘇生するモンスターを選択。",
              cancelable
            );

            return { selectedEntities };
          },
          execute: async (myInfo, chainBlockInfos) => {
            // 対象のモンスターが移動していれば不可
            if (myInfo.selectedEntities.some((entity) => entity.wasMovedAfter(myInfo.isActivatedAt))) {
              return false;
            }

            // パターン取得
            const patterns = getBrandedExpulsionRevivePatterns(myInfo, myInfo.costInfo, myInfo.selectedEntities);
            if (!patterns) {
              return false;
            }

            // 総取りフラグ
            let takeAllFlg = Boolean(patterns.takeAll);

            // 総取りと分け合い両方できる場合、メッセージボックスで確認
            if (patterns.share && patterns.takeAll) {
              const response = await myInfo.activator.waitYesNo("自分の場に両方のモンスターを特殊召喚する？");
              takeAllFlg = response;
            }

            // 総取りフラグが立っていれば、普通の二体特殊召喚をして完了
            if (takeAllFlg) {
              return defaultTargetMonstersRebornExecute(myInfo, chainBlockInfos, { posList: ["Defense"], allOrNothing: true });
            }

            if (!patterns.share) {
              throw new SystemError("想定されない状態");
            }

            await myInfo.activator.summonEachFields(
              myInfo.activator,
              "SpecialSummon",
              ["Effect"],
              myInfo.action,
              patterns.share.flat(),
              entityCostTypes.flatMap((type) => myInfo.costInfo[type] ?? []).map((info) => ({ material: info.cost, isAsEffectCost: true, cell: info.cell })),
              false,
              1,
              (summoned) => summoned.length === 1,
              false
            );
            return true;
          },
          settle: async () => true,
        },
        defaultSpellTrapSetAction,
      ],
    };
  }
}

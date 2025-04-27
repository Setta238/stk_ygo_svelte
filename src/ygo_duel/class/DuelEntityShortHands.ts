import { Duel, SystemError } from "./Duel";
import { CardAction, type ChainBlockInfo } from "./DuelCardAction";
import { DuelEntity, type TDuelCauseReason, type TDuelEntityFace, type TDuelEntityOrientation, destoryCauseReasonDic } from "./DuelEntity";
import type { Duelist } from "./Duelist";
import type { TBanishProcType } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
import type { DuelFieldCell, TBundleCellType, TDuelEntityMovePos } from "./DuelFieldCell";

export class DuelEntityShortHands {
  private static readonly _tryMarkForDestory = (entity: DuelEntity, chainBlockInfo: ChainBlockInfo<unknown>): boolean => {
    if (entity.info.isDying) {
      return false;
    }
    if (entity.status.kind === "XyzMaterial") {
      return false;
    }
    if (!entity.isOnFieldStrictly && entity.fieldCell.cellType !== "Deck" && entity.fieldCell.cellType !== "Hand") {
      return false;
    }

    const destroyType = chainBlockInfo.action.playType === "Battle" ? "BattleDestroy" : "EffectDestroy";
    const movedBy =
      destroyType === "BattleDestroy" && chainBlockInfo.action.entity === entity ? chainBlockInfo.selectedEntities[0] : chainBlockInfo.action.entity;
    entity.info.isDying = entity.validateDestory(destroyType, chainBlockInfo.activator, movedBy, chainBlockInfo.action);
    if (entity.info.isDying) {
      entity.info.causeOfDeath = [destroyType];
      entity.info.isKilledBy = movedBy;
      entity.info.isKilledByWhom = chainBlockInfo.activator;
      // 戦闘破壊のみ、情報を書き換え。
      if (destroyType === "BattleDestroy") {
        entity.info.isKilledByWhom = movedBy.controller;
      }
    }
    return entity.info.isDying;
  };

  public static readonly releaseManyForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    activator: Duelist
  ): Promise<void> => {
    if (!entities.length) {
      return Promise.resolve();
    }
    if (movedAs.includes("Cost")) {
      activator.writeInfoLog(`${entities.map((entity) => entity.toString()).join(" ")}をリリースし――、`);
    }
    return DuelEntityShortHands.bringManyToSameCellForTheSameReason(
      "Graveyard",
      "Top",
      entities,
      "FaceUp",
      "Vertical",
      ["Release", ...movedAs],
      movedBy,
      activator
    );
  };
  public static readonly sendManyToGraveyardForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    if (!entities.length) {
      return Promise.resolve();
    }
    if (activator && movedAs.includes("Cost")) {
      if (movedAs.includes("FusionMaterial")) {
        activator.writeInfoLog(`${entities.map((entity) => entity.toString()).join(" ")}を融合素材とし――、`);
      } else if (movedAs.includes("SyncroMaterial")) {
        activator.writeInfoLog(`${entities.map((entity) => entity.toString()).join(" ")}をシンクロと素材し――、`);
      } else if (movedAs.includes("LinkMaterial")) {
        activator.writeInfoLog(`${entities.map((entity) => entity.toString()).join(" ")}をリンクマーカーにセッティング――、`);
      } else {
        activator.writeInfoLog(`${entities.map((entity) => entity.toString()).join(" ")}を墓地に送り――、`);
      }
    }
    return DuelEntityShortHands.bringManyToSameCellForTheSameReason("Graveyard", "Top", entities, "FaceUp", "Vertical", movedAs, movedBy, activator);
  };
  public static readonly addManyToHand = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    if (!entities.length) {
      return Promise.resolve();
    }
    return DuelEntityShortHands.bringManyToSameCellForTheSameReason("Hand", "Bottom", entities, "FaceDown", "Vertical", movedAs, movedBy, activator);
  };
  public static readonly discardManyForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    if (!entities.length) {
      return Promise.resolve();
    }
    if (activator && movedAs.includes("Cost")) {
      activator.writeInfoLog(`${entities.map((entity) => entity.toString()).join(" ")}を手札から捨て――、`);
    }
    return DuelEntityShortHands.bringManyToSameCellForTheSameReason(
      "Graveyard",
      "Top",
      entities,
      "FaceUp",
      "Vertical",
      ["Discard", ...movedAs],
      movedBy,
      activator
    );
  };
  public static readonly banishManyForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    if (!entities.length) {
      return Promise.resolve();
    }
    if (activator && movedAs.includes("Cost")) {
      activator.writeInfoLog(`${entities.map((entity) => entity.toString()).join(" ")}をゲームから除外し――、`);
    }
    return DuelEntityShortHands.bringManyToSameCellForTheSameReason("Banished", "Top", entities, "FaceUp", "Vertical", movedAs, movedBy, activator);
  };
  public static readonly returnManyToDeckForTheSameReason = (
    pos: TDuelEntityMovePos,
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    if (!entities.length) {
      return Promise.resolve();
    }
    if (activator && movedAs.includes("Cost")) {
      activator.writeInfoLog(`${entities.map((entity) => entity.toString()).join(" ")}をデッキに戻し――、`);
    }
    return DuelEntityShortHands.bringManyToSameCellForTheSameReason("Deck", pos, entities, "FaceDown", "Vertical", movedAs, movedBy, activator);
  };

  public static readonly returnManyToHandForTheSameReason = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    if (!entities.length) {
      return Promise.resolve();
    }
    if (activator && movedAs.includes("Cost")) {
      activator.writeInfoLog(`${entities.map((entity) => entity.toString()).join(" ")}を手札に戻し――、`);
    }
    return DuelEntityShortHands.bringManyToSameCellForTheSameReason("Hand", "Bottom", entities, "FaceDown", "Vertical", movedAs, movedBy, activator);
  };

  public static readonly convertManyToXyzMaterials = (
    entities: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    activator: Duelist
  ): Promise<void> => {
    if (!entities.length) {
      return Promise.resolve();
    }
    if (activator && movedAs.includes("Cost")) {
      activator.writeInfoLog(`${entities.map((entity) => entity.toString()).join(" ")}によって、オーバーレイネットワークを構築――、`);
    }
    return DuelEntity.moveMany(
      entities.map((entity) => [entity, entity.fieldCell, "XyzMaterial", "FaceUp", "Vertical", "Top", movedAs, movedBy, activator, activator])
    );
  };
  public static readonly moveToXyzOwner = (
    dest: DuelFieldCell,
    xyzMaterials: DuelEntity[],
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity,
    activator: Duelist
  ): Promise<void> => {
    if (!xyzMaterials.length) {
      return Promise.resolve();
    }
    if (movedAs.includes("Effect")) {
      activator.writeInfoLog(`${xyzMaterials.map((entity) => entity.toString()).join(" ")}をXYZ素材として吸収。`);
    }
    return DuelEntity.moveMany(
      xyzMaterials.map((entity) => [entity, dest, "XyzMaterial", "FaceUp", "Vertical", "Top", movedAs, movedBy, activator, activator])
    );
  };

  /**
   *
   * @param items
   * @param excludedList 再帰処理時のみ指定する想定
   */
  public static readonly banishMany = (
    items: {
      entity: DuelEntity;
      causedAs: TDuelCauseReason[];
      causedBy: DuelEntity | undefined;
      activator: Duelist | undefined;
    }[],
    excludedList?: DuelEntity[]
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCell(
      "Banished",
      "Top",
      items.map((item) => {
        return { ...item, face: "FaceUp", orientation: "Vertical" };
      }),
      excludedList
    );
  };

  public static readonly bringManyToSameCellForTheSameReason = (
    to: TBundleCellType,
    pos: TDuelEntityMovePos,
    entities: DuelEntity[],
    face: TDuelEntityFace,
    orientation: TDuelEntityOrientation,
    movedAs: TDuelCauseReason[],
    movedBy: DuelEntity | undefined,
    activator: Duelist | undefined
  ): Promise<void> => {
    return DuelEntity.bringManyToSameCell(
      to,
      pos,
      entities.map((entity) => {
        return {
          entity: entity,
          face: face,
          orientation: orientation,
          causedAs: movedAs,
          causedBy: movedBy,
          activator: activator,
        };
      })
    );
  };

  public static readonly tryDestroy = async (cards: DuelEntity[], chainBlockInfo: ChainBlockInfo<unknown>): Promise<DuelEntity[]> => {
    const result = await DuelEntityShortHands.tryMarkForDestory(cards, chainBlockInfo);

    await DuelEntityShortHands.waitCorpseDisposal(chainBlockInfo.activator.duel);

    return result;
  };

  public static readonly waitCorpseDisposal = (duel: Duel) => {
    return DuelEntity.sendManyToGraveyard(
      [...duel.field.getCardsOnFieldStrictly(), ...duel.field.getPendingCardsOnField()]
        .filter((entity) => entity.info.isDying)
        .map((entity) => {
          return {
            entity: entity,
            causedAs: entity.info.causeOfDeath ?? [],
            causedBy: entity.info.isKilledBy,
            activator: entity.info.isKilledByWhom,
          };
        })
    );
  };
  /**
   * 処理イメージ：最初に破壊可能な対象全てにマーキング。身代わり効果でマーキングを剥がす。最終的に破壊マーキングが残ったものを返す。
   * @param cards
   * @param chainBlockInfo
   * @returns 引数に指定されたもののうち、最終的に破壊マーキングができたものを返す
   */
  public static readonly tryMarkForDestory = async (cards: DuelEntity[], chainBlockInfo: ChainBlockInfo<unknown>): Promise<DuelEntity[]> => {
    // 破壊できるもののみ一旦マーキング
    let _cards = cards.filter((card) => DuelEntityShortHands._tryMarkForDestory(card, chainBlockInfo));
    if (!_cards.length) {
      return [];
    }

    // 破壊種別
    const destroyType = chainBlockInfo.action.playType === "Battle" ? "BattleDestroy" : "EffectDestroy";

    // 強制効果で破壊を免れたもののマークを元に戻す。
    (
      await Promise.all(
        cards[0].field.getAllEntities().flatMap((sacrifice) =>
          sacrifice.substituteEffects
            .filter((effect) => effect.isMandatory)
            .filter((effect) => effect.executableCells.includes(sacrifice.fieldCell.cellType))
            .filter((effect) => effect.isApplicableTo(destroyType, cards, chainBlockInfo).length)
            .flatMap((effect) => effect.substitute(destroyType, cards, chainBlockInfo))
        )
      )
    )
      .flatMap((survivors) => survivors)
      .forEach((survivor) => {
        survivor.resetCauseOfDeath();
      });

    // 身代わりできなかったもの
    _cards = _cards.filter((card) => card.info.isDying);

    // 任意の身代わり効果を収拾。
    let substituteEffectItems = cards[0].field.getAllEntities().flatMap((sacrifice) =>
      sacrifice.substituteEffects
        .filter((effect) => !effect.isMandatory)
        .filter((effect) => effect.executableCells.includes(sacrifice.fieldCell.cellType))
        .filter((effect) => effect.isApplicableTo(destroyType, cards, chainBlockInfo).length)
        .map((effect) => {
          return { chooser: sacrifice.owner, effect, sacrifice };
        })
    );

    // プレイヤーでループ
    for (const chooser of substituteEffectItems.map((item) => item.sacrifice.controller).getDistinct()) {
      // 自分の使用できる身代わり効果を抽出
      const items = substituteEffectItems.filter((item) => item.sacrifice.controller === chooser);

      // 入力待ちのためにdammyAction化
      const dammyActions = items.map((item) => CardAction.createDammyAction(item.sacrifice, item.effect.title, [], undefined, item.effect));

      // 入力待ち
      const selected = await cards[0].duel.view.waitSubAction(chooser, dammyActions, "身代わり効果を適用する？", true);

      // キャンセルした場合、次のプレイヤーへ
      if (!selected || !selected.action) {
        continue;
      }

      // 選択されたdammyActionから身代わり効果に戻す。
      const pair = items.filter((pair) => pair.effect.title === selected.action?.title).find((pair) => pair.sacrifice === selected.action?.entity);
      if (!pair) {
        throw new SystemError("想定されない状態", selected, dammyActions, _cards);
      }

      // 身代わりを実施し、破壊フラグをリセット。
      (await pair.effect.substitute(destroyType, _cards, chainBlockInfo)).forEach((survivor) => {
        survivor.resetCauseOfDeath();
      });

      // 身代わりできなかったものを再抽出
      _cards = _cards.filter((card) => card.info.isDying);

      // 全員生き残ったならここで中断
      if (!_cards.length) {
        return [];
      }

      // 使用できる身代わり効果を再抽出
      substituteEffectItems = substituteEffectItems.filter((item) => item.effect.isApplicableTo(destroyType, cards, chainBlockInfo).length);
    }

    const result = _cards.filter((card) => card.info.isDying);

    // ログ出力
    result.forEach((card) => card.duel.log.info(`${card.toString()}を${destoryCauseReasonDic[destroyType]}。`, card.info.isKilledByWhom));

    return result;
  };

  public static readonly tryBanish = async (procType: TBanishProcType, cards: DuelEntity[], chainBlockInfo: ChainBlockInfo<unknown>): Promise<DuelEntity[]> => {
    const _cards = cards.filter((card) => card.canBeBanished(procType, chainBlockInfo.activator, chainBlockInfo.action.entity, chainBlockInfo.action));
    await DuelEntityShortHands.banishManyForTheSameReason(_cards, ["Effect"], chainBlockInfo.action.entity, chainBlockInfo.activator);
    return _cards.filter((card) => card.fieldCell.cellType === "Banished").filter((card) => card.moveLog.latestRecord.movedBy === chainBlockInfo.action.entity);
  };

  public static readonly negateSummonMany = (movedBy: DuelEntity, activator: Duelist): DuelEntity[] => {
    const monsters = activator.duel.field.getPendingMonstersOnField();
    monsters.forEach((monster) => {
      monster.info.summonKinds = [];
      monster.info.materials = [];
      monster.moveLog.negateSummon(movedBy, activator);
    });

    activator.writeInfoLog(`${monsters.map((monster) => monster.toString()).join(" ")}.の召喚は無効にされた。`);
    return monsters;
  };
  private constructor() {}
}

// class Piyo<T> {
//   private static nextSeq: 0;
//   public readonly seq: number;
//   public readonly t: T;
//   constructor(t: T) {
//     this.seq = Piyo.nextSeq++;
//     this.t = t;
//   }
// }

// type Hoge = {
//   text: string;
//   piyos: Piyo<unknown>[];
// };

// const piyoUnknown = new Piyo(undefined as unknown);
// const piyoNever = new Piyo(undefined as never);
// const piyoString = new Piyo("piyo");
// const piyoNumber = new Piyo(123);

// const hoge: Hoge = {
//   text: "hoge",
//   piyos: [piyoUnknown, piyoNever, piyoString, piyoNumber],
// };

// const getPiyoSeqArray_1 = (piyos: Piyo<unknown>[]) => {
//   return piyos.map((piyo) => piyo.seq);
// };
// const getPiyoSeqArray_2 = (piyos: Piyo<never>[]) => {
//   return piyos.map((piyo) => piyo.seq);
// };
// const getPiyoSeqArray_3 = <T>(piyos: Piyo<T>[]) => {
//   return piyos.map((piyo) => piyo.seq);
// };

// getPiyoSeqArray_1([piyoUnknown, piyoNever, piyoString, piyoNumber]);
// getPiyoSeqArray_2([piyoUnknown, piyoNever, piyoString, piyoNumber]);
// getPiyoSeqArray_3([piyoUnknown, piyoNever, piyoString, piyoNumber]);

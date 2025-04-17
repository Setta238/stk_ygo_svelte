import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { SystemError } from "./Duel";
import { type CardActionDefinitionAttr, CardAction, type ChainBlockInfo, type ICardAction, type ChainBlockInfoBase } from "./DuelCardAction";
import { DuelEntity, type TSummonRuleCauseReason, destoryCauseReasonDic, posToSummonPos } from "./DuelEntity";
import type { Duelist } from "./Duelist";
import type { TBanishProcType, TProcType } from "@ygo_duel/class_continuous_effect/DuelProcFilter";
import type { IDuelClock } from "./DuelClock";

declare module "./DuelEntity" {
  interface DuelEntity {
    hasBeenSummonedNow(summonRules: (TSummonRuleCauseReason | "FlipSummon")[], posList?: TBattlePosition[]): boolean;
    getAttackTargets(): DuelEntity[];
    /**
     * 相手側の状態を考慮せず、攻撃できる状態か判定
     */
    hasAttackRight(): boolean;
    /**
     * モンスターへ攻撃できる状態かどうか判定
     */
    canAttackToMonster(): boolean;
    /**
     * 直接攻撃できる状態かどうか判定
     */
    canDirectAttack(): boolean;
    canBeEffected(activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionDefinitionAttr>): boolean;
    canBeBanished(procType: TBanishProcType, activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionDefinitionAttr>): boolean;
    canBeTargetOfEffect<T>(chainBlockInfo: ChainBlockInfoBase<T>): boolean;
    canBeTargetOfBattle(activator: Duelist, entity: DuelEntity): boolean;
    validateDestory(destroyType: TDestoryCauseReason, activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionDefinitionAttr>): boolean;
    getIndexInCell(): number;
    getXyzMaterials(): DuelEntity[];
    wasMovedAfter(clock: IDuelClock): boolean;
  }
  interface DuelEntityConstructor {
    isEmpty(value: string): boolean;
  }
}

DuelEntity.prototype.hasBeenSummonedNow = function (
  summonRules: (TSummonRuleCauseReason | "FlipSummon")[],
  posList: TBattlePosition[] = ["Attack", "Defense"]
): boolean {
  const entity = this as DuelEntity;
  const _posList = posList.map(posToSummonPos);
  const movedAs = entity.moveLog.latestRecord.movedAs;

  if (!entity.wasMovedAtPreviousChain) {
    return false;
  }
  if (!movedAs.union(summonRules).length) {
    return false;
  }
  if (!movedAs.union(_posList).length) {
    return false;
  }
  return true;
};

DuelEntity.prototype.getAttackTargets = function (): DuelEntity[] {
  if (!this.hasAttackRight()) {
    return [];
  }

  // ダイレクトアタックを阻害しうるモンスターを抽出
  const enemies = this.controller
    .getOpponentPlayer()
    .getMonstersOnField()
    .filter((enemy) => enemy.status.isSelectableForAttack);

  if (this.status.canDirectAttack || !enemies.length) {
    enemies.push(this.controller.getOpponentPlayer().entity);
  }

  // 自分、相手ともにフィルタリングが必要。
  return enemies
    .filter((enemy) => enemy.canBeTargetOfBattle(this.controller, this))
    .filter((enemy) =>
      this.procFilterBundle.operators.filter((pf) => pf.procTypes.includes("BattleTarget")).every((pf) => pf.filter(this.controller, this, {}, [enemy]))
    );
};
DuelEntity.prototype.canDirectAttack = function (): boolean {
  return this.getAttackTargets().some((enemy) => enemy.entityType === "Duelist");
};

DuelEntity.prototype.canAttackToMonster = function (): boolean {
  return this.getAttackTargets().some((enemy) => enemy.entityType !== "Duelist");
};

DuelEntity.prototype.hasAttackRight = function (): boolean {
  // TODO 連続攻撃モンスター、絶対防御将軍などの考慮
  return this.battlePosition === "Attack" && this.info.attackCount === 0 && this.status.canAttack;
};

DuelEntity.prototype.canBeEffected = function (activator: Duelist, causedBy: DuelEntity, action: Partial<CardActionDefinitionAttr>): boolean {
  const entity = this as DuelEntity;
  return entity.procFilterBundle.operators
    .filter((pf) => pf.procTypes.some((t) => t === "Effect"))
    .every((pf) => pf.filter(activator, causedBy, action, [this]));
};

const _canBeDoneSomethingByEffect = (
  entity: DuelEntity,
  procType: TProcType,
  activator: Duelist,
  causedBy: DuelEntity,
  action: Partial<CardActionDefinitionAttr>
): boolean => {
  return (
    entity.canBeEffected(activator, causedBy, action) &&
    entity.procFilterBundle.operators.filter((pf) => pf.procTypes.some((t) => t === procType)).every((pf) => pf.filter(activator, causedBy, action, [entity]))
  );
};

DuelEntity.prototype.canBeTargetOfEffect = function <T>(chainBlockInfo: ChainBlockInfoBase<T>): boolean {
  return _canBeDoneSomethingByEffect(this, "EffectTarget", chainBlockInfo.activator, chainBlockInfo.action.entity, chainBlockInfo.action);
};

DuelEntity.prototype.canBeBanished = function (
  procType: TBanishProcType,
  activator: Duelist,
  causedBy: DuelEntity,
  action: Partial<CardActionDefinitionAttr>
): boolean {
  if (this.fieldCell.cellType === "Banished") {
    return false;
  }
  return _canBeDoneSomethingByEffect(this, procType, activator, causedBy, action);
};

DuelEntity.prototype.canBeTargetOfBattle = function (activator: Duelist, causedBy: DuelEntity): boolean {
  const entity = this as DuelEntity;
  return entity.procFilterBundle.operators
    .filter((pf) => pf.procTypes.some((t) => t === "BattleTarget"))
    .every((pf) => pf.filter(activator, causedBy, {}, [entity]));
};

DuelEntity.prototype.validateDestory = function (
  destroyType: "BattleDestroy" | "EffectDestroy",
  activator: Duelist,
  causedBy: DuelEntity,
  action: Partial<CardActionDefinitionAttr>
): boolean {
  const entity = this as DuelEntity;
  let flg = entity.procFilterBundle.operators
    .filter((pf) => pf.procTypes.includes(destroyType))
    .every((pf) => pf.filter(activator, causedBy, action ?? {}, [entity]));

  if (flg && destroyType === "EffectDestroy") {
    flg = entity.canBeEffected(activator, causedBy, action);
  }

  return flg;
};

DuelEntity.prototype.getIndexInCell = function (): number {
  const entity = this as DuelEntity;

  if (entity.info.isVanished) {
    return -1;
  }

  const index = entity.fieldCell.cardEntities.indexOf(entity);

  if (index < 0) {
    throw new SystemError("エンティティとセルの状態が矛盾している。", [entity, entity.fieldCell]);
  }

  return index;
};

DuelEntity.prototype.getXyzMaterials = function (): DuelEntity[] {
  const entity = this as DuelEntity;

  return (entity.status.monsterCategories ?? []).includes("Xyz") ? entity.fieldCell.xyzMaterials : [];
};
DuelEntity.prototype.wasMovedAfter = function (clock: IDuelClock): boolean {
  console.log(this.toString(), this.moveLog.latestRecord.movedAt.totalProcSeq, clock.totalProcSeq);
  return this.moveLog.latestRecord.movedAt.totalProcSeq > clock.totalProcSeq;
};

const _tryMarkForDestory = (entity: DuelEntity, chainBlockInfo: ChainBlockInfo<unknown>): boolean => {
  if (entity.info.isDying) {
    return false;
  }
  if (entity.status.kind === "XyzMaterial") {
    return false;
  }
  if (!entity.isOnField && entity.fieldCell.cellType !== "Deck" && entity.fieldCell.cellType !== "Hand") {
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

export class DuelEntityShortHands {
  public static readonly tryDestroy = async (cards: DuelEntity[], chainBlockInfo: ChainBlockInfo<unknown>): Promise<DuelEntity[]> => {
    const result = await DuelEntityShortHands.tryMarkForDestory(cards, chainBlockInfo);

    await DuelEntity.waitCorpseDisposal(chainBlockInfo.activator.duel);

    return result;
  };
  /**
   * 処理イメージ：最初に破壊可能な対象全てにマーキング。身代わり効果でマーキングを剥がす。最終的に破壊マーキングが残ったものを返す。
   * @param cards
   * @param chainBlockInfo
   * @returns 引数に指定されたもののうち、最終的に破壊マーキングができたものを返す
   */
  public static readonly tryMarkForDestory = async (cards: DuelEntity[], chainBlockInfo: ChainBlockInfo<unknown>): Promise<DuelEntity[]> => {
    // 破壊できるもののみ一旦マーキング
    let _cards = cards.filter((card) => _tryMarkForDestory(card, chainBlockInfo));
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
      const dammyActions = items.map((item) => CardAction.createDammyAction(item.sacrifice, item.effect.title, []) as ICardAction<unknown>);

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
    await DuelEntity.banishManyForTheSameReason(_cards, ["Effect"], chainBlockInfo.action.entity, chainBlockInfo.activator);
    return _cards.filter((card) => card.fieldCell.cellType === "Banished").filter((card) => card.moveLog.latestRecord.movedBy === chainBlockInfo.action.entity);
  };

  public static readonly negateSummonMany = (movedBy: DuelEntity, activator: Duelist): DuelEntity[] => {
    const monsters = activator.duel.field.getPendingMonstersOnField();
    monsters.forEach((monster) => monster.moveLog.negateSummon(movedBy, activator));
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

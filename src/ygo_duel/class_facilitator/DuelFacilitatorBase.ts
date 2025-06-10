import { type Duel, type ResponseActionInfo, type TSeat } from "../class/Duel";
import type { TDuelPhase } from "@ygo_duel/class/DuelPeriod";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { ChainBlockInfo, EntityAction, TSpellSpeed, ValidatedActionInfo } from "@ygo_duel/class/DuelEntityAction";
import type { Duelist } from "@ygo_duel/class/Duelist";
import type { DuelFieldCell } from "@ygo_duel/class/DuelFieldCell";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";

export abstract class DuelFacilitatorBase {
  public readonly duel: Duel;
  /**
   * 継承クラスはthis.duel.clock.phaseから取得するので、private
   */
  private readonly phase: TDuelPhase;
  private _priorityHolder: Duelist;
  protected set priorityHolder(duelist: Duelist) {
    this._priorityHolder = duelist;
  }
  public get priorityHolder() {
    return this._priorityHolder;
  }
  protected readonly turnPlayer: Duelist;
  protected get nonTurnPlayer() {
    return this.turnPlayer.getOpponentPlayer();
  }
  public abstract get nextPhaseList(): TDuelPhase[];
  public abstract get attackingMonster(): DuelEntity | undefined;
  public abstract get targetForAttack(): DuelEntity | undefined;

  private _chainBlockInfos: ChainBlockInfo<unknown>[] = [];
  public get chainBlockInfos() {
    return this._chainBlockInfos as Readonly<ChainBlockInfo<unknown>[]>;
  }

  protected constructor(duel: Duel, phase: TDuelPhase) {
    this.duel = duel;
    this.phase = phase;
    this.duel.clock.setPhase(this.duel, this.phase);
    this.turnPlayer = this.duel.getTurnPlayer();
    this._priorityHolder = this.turnPlayer;
  }

  public abstract readonly declareAttack: (attacker: DuelEntity, defender: DuelEntity, reselect: boolean) => void;

  //一応、何かしらの処理を挟めるようにしておく。
  public readonly proceed = async () => {
    return await this._proceed();
  };

  protected abstract readonly _proceed: () => Promise<DuelFacilitatorBase>;

  protected readonly procSpellSpeed1 = async () => {
    // ターンプレイヤーから処理を行う
    this.priorityHolder = this.turnPlayer;

    // 強制効果が処理し終わり、お互いにキャンセルしたら終了
    let skipCount = 0;

    const mandatoryCount: { [seat in TSeat]: number } = {
      Above: Number.MAX_VALUE,
      Below: Number.MAX_VALUE,
    };

    while (true) {
      // 優先権保持者の可能な処理をリストアップ
      const actionInfos = this.priorityHolder.getEnableActions(
        ["IgnitionEffect", "QuickEffect", "CardActivation", "LingeringEffect"],
        ["Normal", "Quick", "Counter"],
        []
      );

      // 強制効果の数を更新
      mandatoryCount[this.priorityHolder.seat] = actionInfos.filter((info) => info.action.isMandatory).length;

      // 強制効果が残っておらず、お互いスキップしたならばループを抜ける。
      if (Object.values(mandatoryCount).every((count) => count === 0)) {
        if (skipCount > 1) {
          break;
        }
      }

      // 強制効果を適当にピックアップしておく
      const sample = actionInfos.find((info) => info.action.isMandatory);
      let actionInfo: ResponseActionInfo | undefined = sample
        ? {
            action: sample.action,
            originSeq: sample.action.seq,
          }
        : undefined;

      // 強制効果が残っていて、お互いにキャンセルすることの防止
      let cancelable = Boolean(!actionInfo);

      // ターンプレイヤーと非ターンプレイヤーではキャンセル可能条件が異なる
      if (this.priorityHolder.isTurnPlayer) {
        if (skipCount === 0) {
          cancelable = true;
        }
      } else {
        if (mandatoryCount[this.turnPlayer.seat]) {
          cancelable = true;
        }
      }

      // 0件または強制効果1件のときのみ効果選択をスキップ
      // TODO 強制効果1件のときも一回まではキャンセルできるので、考慮が必要。
      if (actionInfos.length && (actionInfos.length > 1 || !actionInfo)) {
        // この部分のチェーンチェックは、設定と状況によってスキップ可能とする。
        if (this.priorityHolder.chainConfig.noticeFreeChain || actionInfos.some((info) => info.action.isNoticedForcibly)) {
          actionInfo = await this.duel.view.waitQuickEffect(this.priorityHolder, actionInfos, [], this.duel.clock.period.name, cancelable);
        }
      }

      // どちらかのプレイヤーが効果を発動する場合、チェーン処理へ。
      if (actionInfo) {
        const chainProcResult = await this.procChain({ activator: this.priorityHolder, actionInfo }, undefined);
        // 選択したアクションを取り消す場合、優先権を変えずにループの先頭に戻す。
        if (chainProcResult === "cancel") {
          continue;
        }

        // フリーチェーン処理
        if (!(await this.procFreeChain())) {
          return false;
        }
        // ターンプレイヤーに優先権が戻る
        this.priorityHolder = this.turnPlayer;

        // スキップカウントをリセット
        skipCount = 0;
        continue;
      }
      // 優先権プレイヤーを切り替え、スキップカウントを加算
      this.priorityHolder = this.priorityHolder.getOpponentPlayer();
      skipCount++;
    }
    return true;
  };

  /**
   *
   * @param canContinue ループを継続できるかどうか。バトルステップの場合、攻撃宣言モンスターが存在しなくなるなどすればこのループから抜ける必要がある。
   * @returns
   */
  protected readonly procFreeChain = async (canContinue: () => boolean = () => true): Promise<boolean> => {
    // periodが変更される場合、ループが継続できない
    const currentPeriodKey = this.duel.clock.period.key;

    // フリーチェーン処理
    while ((await this.procChain(undefined, undefined)) !== "pass") {
      if (this.duel.clock.period.key !== currentPeriodKey) {
        return false;
      }
      if (!canContinue()) {
        return false;
      }
    }
    return true;
  };

  protected readonly procTriggerEffects = async () => {
    while ((await this.procChain(undefined, undefined, true)) === "done") {
      //
    }
  };

  /**
   * チェーンが発生しうる場合の処理
   * @param firstBlock
   * @param triggerEffects
   * @param chainBlockInfos
   * @returns チェーンが発生したかどうか
   */
  protected readonly procChain = async (
    firstBlock: { activator: Duelist; actionInfo: ResponseActionInfo } | undefined,
    triggerEffects: { activator: Duelist; actionInfo: ValidatedActionInfo; targetChainBlock: ChainBlockInfo<unknown> | undefined }[] | undefined,
    isOnlyTriggerEffects?: boolean
  ): Promise<"done" | "pass" | "cancel"> => {
    // チェーン開始判定
    const isStartPoint = this.chainBlockInfos.length === 0;

    // 起点となる効果がない場合、両方のプレイヤーのトリガーエフェクトを収集する。
    //    ※トリガーエフェクトの収集はタイミングごとに一回のみ
    //    ※フェイズのトリガーエフェクトは起動効果として設定しているのでここでは収集しない。
    let _triggerEffets = firstBlock
      ? []
      : (triggerEffects ??
        Object.values(this.duel.duelists).flatMap((activator) => {
          // この効果の収拾のみ、優先権が移らない。
          return activator.getEnableActions(["TriggerEffect"], [this.chainBlockInfos.length ? "Quick" : "Normal"], this.chainBlockInfos).map((actionInfo) => {
            return { activator, actionInfo, targetChainBlock: this.chainBlockInfos.slice(-1)[0] };
          });
        }));

    // この呼び出しで積むチェーンブロック
    let chainBlock:
      | { activator: Duelist; action: EntityAction<unknown>; targetChainBlock: ChainBlockInfo<unknown> | undefined; dest?: DuelFieldCell }
      | undefined;

    // 起点の効果がある場合、最初に積む。
    if (firstBlock) {
      chainBlock = { activator: firstBlock.activator, action: firstBlock.actionInfo.action, dest: firstBlock.actionInfo.dest, targetChainBlock: undefined };
      this.priorityHolder = chainBlock.activator;
    } else if (_triggerEffets.length > 0) {
      // 次にトリガーエフェクトが存在する場合、まずそちらからチェーンを積む
      const triggerEffect = await this.selectTriggerEffect(_triggerEffets);

      // トリガーエフェクトが選択された場合、積む
      if (triggerEffect) {
        _triggerEffets = _triggerEffets.filter((effect) => effect !== triggerEffect);
        chainBlock = { ...triggerEffect, action: triggerEffect.actionInfo.action };
        // トリガーエフェクトは優先権を無視してチェーンブロックを積むが、その次のブロックは優先権に従うので都度更新しておく。
        // クイックエフェクトのループの先頭で反転する点に注意
        this.priorityHolder = chainBlock.activator;
      } else {
        // トリガーエフェクトが選択されなかった場合、リストをリセットする。
        _triggerEffets = [];
      }
    }

    // ここまででチェーンブロックが積まれていない場合、任意効果のクイックエフェクト
    if (!chainBlock) {
      if (isOnlyTriggerEffects) {
        return "pass";
      }
      // 任意効果のクイックエフェクト
      let skipCount = 0;
      while (skipCount < 2) {
        this.priorityHolder = this.priorityHolder.getOpponentPlayer();

        const spellSpeeds: TSpellSpeed[] = ["Counter"];

        if (this.chainBlockInfos.every((info) => info.action.spellSpeed !== "Counter")) {
          spellSpeeds.push("Quick");
        }

        // この部分のチェーンチェックは設定と状況によってスキップ可能とする

        // 先にアクションを収拾
        const actions = this.priorityHolder.getEnableActions(["QuickEffect", "CardActivation"], spellSpeeds, this.chainBlockInfos);

        // 強制通知の効果がある、あるいは攻撃宣言中であれば通知
        let noticeflg = actions.some((info) => info.action.isNoticedForcibly) || Boolean(this.attackingMonster);

        if (!noticeflg) {
          if (this.chainBlockInfos.length) {
            // チェーンが積まれている場合、フラグと前チェーンの発動者で判断
            noticeflg = this.priorityHolder.chainConfig.noticeSelfChain || this.chainBlockInfos.slice(-1)[0].activator !== this.priorityHolder;
          } else {
            // チェーンが積まれていない場合、フラグで判断
            noticeflg = this.priorityHolder.chainConfig.noticeFreeChain;
          }
        }

        if (noticeflg) {
          const msg = this.chainBlockInfos.some((info) => info.action.isWithChainBlock)
            ? "チェーンして効果を発動しますか？"
            : "クイックエフェクト発動タイミング。効果を発動しますか？";

          const actionInfo = await this.duel.view.waitQuickEffect(
            this.priorityHolder,
            this.priorityHolder.getEnableActions(["QuickEffect", "CardActivation"], spellSpeeds, this.chainBlockInfos),
            this.chainBlockInfos,
            msg,
            true
          );

          // どちらかのプレイヤーが効果を発動する場合、チェーン処理へ。
          if (actionInfo) {
            chainBlock = { ...actionInfo, activator: this.priorityHolder, targetChainBlock: this.chainBlockInfos.slice(-1)[0] };
            // トリガーエフェクトが選択されなかった場合、リストをリセットする。
            break;
          }
        }
        skipCount++;
      }
    }

    console.info("selected action: ", chainBlock);

    if (chainBlock) {
      const activator = chainBlock.activator;

      // コスト処理
      const chainBlockInfo = await chainBlock.action.prepare(
        activator,
        chainBlock.dest,
        chainBlock.targetChainBlock,
        this.chainBlockInfos,
        isStartPoint,
        false
      );
      if (!chainBlockInfo) {
        return "cancel";
      }

      this.duel.chainBlockLog.push(chainBlockInfo);
      this._chainBlockInfos.push(chainBlockInfo);

      this.duel.clock.incrementProcSeq();
      this.duel.clock.incrementChainBlockSeq();

      // 誘発効果のプールから、今回選んだものと、それによって回数超過するものを除外
      //   ※星杯の妖精リースを同時に特殊召喚した場合など
      _triggerEffets = _triggerEffets
        .filter((e) => e.actionInfo.action.seq !== chainBlock?.action.seq)
        .filter((e) => e.actionInfo.action.validateCount(e.activator, this.chainBlockInfos));

      if (chainBlockInfo.action.isChainable) {
        // ★★★★★ 再帰実行 ★★★★★
        await this.procChain(undefined, _triggerEffets.length ? _triggerEffets : undefined);
      }

      await chainBlockInfo.action.execute(chainBlockInfo, this.chainBlockInfos);

      if (chainBlockInfo.state === "done" || chainBlockInfo.state === "failed") {
        for (const duelist of [this.turnPlayer, this.nonTurnPlayer]) {
          // エクゾディア判定
          for (const afterChainBlockEffect of duelist.getEnableActions(["Exodia"], ["Normal"], [])) {
            await afterChainBlockEffect.action.directExecute(duelist, chainBlockInfo, false);
          }
          for (const afterChainBlockEffect of duelist.getEnableActions(["AfterChainBlock"], ["Normal"], [chainBlockInfo])) {
            await afterChainBlockEffect.action.directExecute(duelist, chainBlockInfo, false);
            // エクゾディア判定
            for (const afterChainBlockEffect of duelist.getEnableActions(["Exodia"], ["Normal"], [])) {
              await afterChainBlockEffect.action.directExecute(duelist, chainBlockInfo, false);
            }
          }
        }
      }

      if (isStartPoint) {
        // このチェーンでカードの発動を行った、永続類ではない魔法罠を全て墓地送りにする。
        await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(
          this._chainBlockInfos
            .filter((info) => info.action.playType === "CardActivation")
            .filter((info) => !info.action.isLikeContinuousSpell)
            .map((info) => info.action.entity)
            .filter((card) => card.isOnFieldStrictly)
            .filter((card) => card.face === "FaceUp"),
          ["Rule"],
          undefined,
          undefined
        );
        // チェーン情報を破棄
        this._chainBlockInfos.reset();

        if (chainBlockInfo.nextActionInfo) {
          // ★★★★★ 再帰実行 ★★★★★
          //   ※ 緊急同調など、直後にチェーンに乗らない特殊召喚をチェーン１を行う場合は昇天の角笛を発動できる。
          //   ※ ！重要！ チェーン番号は同じまま進める。このチェーンが終わったあとに、誘発効果の収拾を行うため。
          await this.procChain({ activator: chainBlockInfo.activator, actionInfo: chainBlockInfo.nextActionInfo }, undefined);
        }
        // チェーン番号を加算。
        this.duel.clock.incrementChainSeq();
      } else {
        if (chainBlockInfo.nextActionInfo) {
          // ※ 緊急同調など、直後にチェーンに乗らない特殊召喚を行う場合
          await chainBlockInfo.nextActionInfo.action.directExecute(chainBlockInfo.activator, undefined, false);
        }
        // チェーンブロック番号を加算。
        this.duel.clock.incrementChainBlockSeq();
      }
    }

    return chainBlock ? "done" : "pass";
  };

  private readonly selectTriggerEffect = async (
    triggerEffects: { activator: Duelist; actionInfo: ValidatedActionInfo; targetChainBlock: ChainBlockInfo<unknown> | undefined }[]
  ): Promise<{ activator: Duelist; actionInfo: ValidatedActionInfo; targetChainBlock: ChainBlockInfo<unknown> | undefined } | undefined> => {
    // トリガーエフェクトの処理順に従って効果を抽出する。
    if (triggerEffects.length > 0) {
      for (const isMandatory of [true, false]) {
        for (const activator of [this.turnPlayer, this.nonTurnPlayer]) {
          // トリガーエフェクトを抽出
          const effects = triggerEffects.filter((effect) => effect.actionInfo.action.isMandatory === isMandatory && effect.activator === activator);

          // なければ次の条件へ
          if (effects.length === 0) {
            continue;
          }

          // 強制効果が残り１の場合、選択をスキップ
          if (effects.length === 1 && isMandatory) {
            return effects[0];
          }

          // 任意効果の場合、スキップ可能
          const _actionInfo = await this.duel.view.waitQuickEffect(
            activator,
            effects.map((obj) => obj.actionInfo),
            this.chainBlockInfos,
            "トリガーエフェクトを選択。",
            !isMandatory
          );

          if (_actionInfo) {
            return effects.find((effect) => effect.actionInfo.action === _actionInfo.action);
          }
        }
      }
    }
  };
}

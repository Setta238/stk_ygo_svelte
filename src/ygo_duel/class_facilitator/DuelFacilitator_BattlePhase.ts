import { DuelEnd, IllegalCancelError, SystemError, type Duel } from "@ygo_duel/class/Duel";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { TDuelPhase, TDuelPhaseStep, TDuelPhaseStepStage } from "@ygo_duel/class/DuelPeriod";
import { DuelFacilitatorBase } from "@ygo_duel/class_facilitator/DuelFacilitatorBase";
import { DuelFacilitator_MainPhase } from "./DuelFacilitator_MainPhase";
import { Duelist } from "@ygo_duel/class/Duelist";

export class DuelFacilitator_BattlePhase extends DuelFacilitatorBase {
  public get nextPhaseList(): TDuelPhase[] {
    return ["main2"];
  }
  private _attackingMonster: DuelEntity | undefined;
  public get attackingMonster(): DuelEntity | undefined {
    return this._attackingMonster;
  }
  private _targetForAttack: DuelEntity | undefined;

  public get targetForAttack(): DuelEntity | undefined {
    return this._targetForAttack;
  }
  public constructor(duel: Duel, phase: "battle1" | "battle2") {
    super(duel, phase);
  }
  public override readonly declareAttack = (attacker: DuelEntity, defender: DuelEntity, reselect: boolean = false): void => {
    this._attackingMonster = attacker;
    this._targetForAttack = defender;
    let def = " (" + (defender.battlePosition === "Attack" ? defender.atk : defender.def)?.toString() + ")";
    if (defender.face === "FaceDown") {
      def = " (????)";
    }

    if (defender.entityType === "Duelist") {
      def = "";
    }

    const msgTitle = reselect ? "攻撃対象再選択" : "攻撃宣言";

    if (!reselect) {
      attacker.info.attackDeclareCount++;
    }

    this.duel.log.info(`${msgTitle}:${attacker.toString()} (${attacker.atk})⇒ ${defender.toString()}${def}`, attacker.controller);
  };
  protected override readonly _proceed = async (): Promise<DuelFacilitatorBase> => {
    // フェイズ強制処理
    if (await this.procBattlePhaseStartStep()) {
      await this.procBattlePhaseBattleStep();
    }
    await this.procBattlePhaseEndStep();

    return new DuelFacilitator_MainPhase(this.duel, "main2");
  };
  private readonly procBattlePhaseStartStep = async () => {
    await this.setStep("start");
    this.priorityHolder = this.turnPlayer;

    this._attackingMonster = undefined;
    this._targetForAttack = undefined;

    // フェイズ強制処理
    return await this.procSpellSpeed1();
  };
  private readonly procBattlePhaseBattleStep = async () => {
    while (true) {
      await this.setStep("battle");

      // 初期化
      this.priorityHolder = this.turnPlayer;
      this._attackingMonster = undefined;
      this._targetForAttack = undefined;

      //ユーザー入力を待機。
      const response = await this.duel.view.waitFieldAction(
        this.priorityHolder.getEnableActions(["DeclareAttack", "QuickEffect", "CardActivation"], ["Normal", "Quick", "Counter"], [])
      );

      if (response.phaseChange) {
        //エンドステップへ（※優先権の移動はない）
        break;
      }
      if (!response.actionInfo) {
        continue;
      }

      // ユーザー入力がカードアクションだった場合、チェーン処理へ
      const result = await this.procChain({ activator: this.priorityHolder, actionInfo: response.actionInfo }, undefined);
      if (result === "cancel") {
        continue;
      }

      if (!this.attackingMonster || !this.targetForAttack) {
        await this.procTriggerEffects();

        continue;
      }
      //フリーチェーン処理のループ。
      //一回のチェーンごとに、戦闘可否判定を行い、否であればループを抜ける。
      while (this.attackingMonster && this.targetForAttack) {
        // 巻き戻し計算のために値を控える。
        const oldTotalProcSeq = this.duel.clock.totalProcSeq;
        const oldMonsters = this.nonTurnPlayer.getMonstersOnField();

        const procChainResult = await this.procChain(undefined, undefined);
        await this.procTriggerEffects();

        if (!this.attackingMonster) {
          throw new SystemError("想定されない状態");
        }

        if (!this.canContinueBattle()) {
          break;
        }
        const attackTargets = this.attackingMonster.getAttackTargets();

        if (
          oldMonsters.some((monster) => !monster.isOnFieldAsMonsterStrictly) ||
          this.nonTurnPlayer
            .getMonstersOnField()
            .flatMap((monster) => monster.moveLog.records)
            .filter((record) => record.movedAt.totalProcSeq > oldTotalProcSeq)
            .some((record) => !record.cell.isMonsterZoneLikeCell)
        ) {
          this.duel.log.info(`モンスターの数が増減したためバトルステップの巻き戻しが発生。`);
          this._targetForAttack = undefined;
        } else if (
          this.targetForAttack.entityType === "Duelist" &&
          attackTargets.every((monster) => monster !== this.targetForAttack) &&
          !this.attackingMonster.status.canDirectAttack
        ) {
          this.duel.log.info(`${this.attackingMonster.toString()}が直接攻撃能力を喪失したため、バトルステップの巻き戻しが発生。`);
          this._targetForAttack = undefined;
        }
        if (!this.targetForAttack) {
          if (!attackTargets.length) {
            this.duel.log.info("攻撃可能な対象が存在しないため、攻撃対象選択を選択肢しなおせない。");
            break;
          }
          if (this.turnPlayer.duelistType === "Player") {
            if (!(await this.duel.view.waitYesOrNo(this.turnPlayer, "攻撃対象選択を選択し直す？"))) {
              this.turnPlayer.writeInfoLog(`${this.attackingMonster.toString()}の攻撃宣言をキャンセル。`);
              break;
            }
          }
          const _targetForAttack = await this.turnPlayer.waitSelectEntity(attackTargets, "攻撃対象を選択。", true);
          if (!_targetForAttack) {
            this.turnPlayer.writeInfoLog(`${this.attackingMonster.toString()}の攻撃宣言をキャンセル。`);
            break;
          }

          this.declareAttack(this.attackingMonster, _targetForAttack, true);

          continue;
        }
        if (procChainResult === "pass") {
          break;
        }
      }

      if (this.attackingMonster && this.targetForAttack) {
        //ダメージステップ処理へ
        await this.procBattlePhaseDamageStep();
      }
    }
  };
  private readonly procBattlePhaseDamageStep = async () => {
    if (!this.attackingMonster || !this.targetForAttack) {
      throw new SystemError("想定されない状態", this.attackingMonster, this.targetForAttack);
    }

    if (this.targetForAttack.entityType !== "Duelist" && !this.targetForAttack.isOnFieldAsMonsterStrictly) {
      throw new SystemError("想定されない状態", this.attackingMonster, this.targetForAttack);
    }

    for (const procBattlePhaseDamageStep of [
      this.procBattlePhaseDamageStep1,
      this.procBattlePhaseDamageStep2,
      this.procBattlePhaseDamageStep3,
      this.procBattlePhaseDamageStep4,
      this.procBattlePhaseDamageStep5,
    ]) {
      if (!(await procBattlePhaseDamageStep())) {
        return;
      }
    }
  };
  private readonly procBattlePhaseDamageStep1 = async (): Promise<boolean> => {
    await this.setStage("start");
    //ダメージステップ開始時
    // https://yugioh-wiki.net/index.php?%A5%C0%A5%E1%A1%BC%A5%B8%A5%B9%A5%C6%A5%C3%A5%D7%B3%AB%BB%CF%BB%FE
    // 「ダメージ計算を行わずに」などと記載された効果は、原則としてここで発動する。
    //『ダメージステップ開始時』であることを条件とする誘発効果は、ダメージステップ開始時の最初のチェーン上でのみ発動できる。
    return await this.procFreeChain(this.canContinueBattle);
  };
  private readonly procBattlePhaseDamageStep2 = async (): Promise<boolean> => {
    if (!this.attackingMonster) {
      throw new SystemError("想定されない状態", this.attackingMonster);
    }
    if (!this.targetForAttack) {
      throw new SystemError("想定されない状態", this.targetForAttack);
    }
    const attacker = this.attackingMonster;
    const defender = this.targetForAttack;
    await this.setStage("beforeDmgCalc");
    //ダメージ計算前 ※裏側守備表示モンスターを表にする
    if (defender.battlePosition === "Set") {
      defender.setBattlePosition("Defense", ["Flip", "Battle"], attacker, attacker.controller);
    }
    //TODO 「ライトロード・モンク エイリン」「ドリルロイド」等、
    return await this.procFreeChain(this.canContinueBattle);
  };
  private readonly procBattlePhaseDamageStep3 = async (): Promise<boolean> => {
    if (!this.attackingMonster) {
      throw new SystemError("想定されない状態", this.attackingMonster);
    }
    if (!this.targetForAttack) {
      throw new SystemError("想定されない状態", this.targetForAttack);
    }
    const attacker = this.attackingMonster;
    const defender = this.targetForAttack;
    if (attacker.atk === undefined) {
      throw new SystemError("想定されない状態", this.attackingMonster, this.targetForAttack);
    }

    //ダメージ計算時①永続効果（チェーンを組まない効果）の適用『開始』。 ※《メタル化・魔法反射装甲》など
    await this.setStage("dmgCalc");
    //ダメージ計算時

    //ダメージ計算時②各種効果の発動 ※《プライドの咆哮》など
    // TODO １つ目のチェーンのみ、「ダメージ計算時」を条件とする効果を発動できる
    if (!(await this.procFreeChain(this.canContinueBattle))) {
      return false;
    }

    //ダメージ計算時 ③ダメージ計算

    // ダメージ計算のための数値を取得
    const atkPoint = attacker.atk;
    const defPoint = (defender.battlePosition === "Attack" ? defender.atk : defender.def) ?? 0;
    const activator = this.turnPlayer;
    const battleAction = attacker.actions.find((action) => action.playType === "Battle");

    if (!battleAction) {
      throw new SystemError(`${attacker.toString()}に戦闘アクションが定義されていない。`);
    }

    const battleChainBlockInfo = await battleAction.prepare(activator, defender.cell, undefined, [], false, false);

    if (!battleChainBlockInfo) {
      throw new IllegalCancelError(`戦闘アクションがキャンセルされた。`);
    }

    this.duel.chainBlockLog.push(battleChainBlockInfo);

    if (defender.entityType === "Duelist") {
      activator.writeInfoLog(`ダメージ計算：${attacker.toString()} (${atkPoint}) ⇒ ${defender.toString()}`);
    } else {
      activator.writeInfoLog(`ダメージ計算：${attacker.toString()} (${atkPoint}) ⇒ ${defender.toString()} (${defPoint})`);
    }

    // ダメージ計算時 ④ダメージ数値確定
    // 貫通効果や戦闘で破壊されない効果（戦闘ダメージ０）の効果の適用。

    // ダメージ計算時 ④ダメージ数値確定 その１：数値計算
    const damageInfos: ReturnType<typeof Duelist.calcBattleDamage>[] = [];

    if (defender.entityType === "Duelist") {
      // ダイレクトアタックの場合
      damageInfos.push(Duelist.calcBattleDamage(attacker.controller.getOpponentPlayer(), atkPoint - defPoint, attacker, defender, battleChainBlockInfo));
    } else if (atkPoint > 0 && atkPoint > defPoint) {
      if (defender.battlePosition === "Attack") {
        // 攻撃対象が攻撃表示の場合
        damageInfos.push(Duelist.calcBattleDamage(attacker.controller.getOpponentPlayer(), atkPoint - defPoint, attacker, defender, battleChainBlockInfo));
      } else {
        // 貫通効果がある場合
        attacker.status.piercingTo
          .getDistinct()
          .forEach((duelist) => damageInfos.push(Duelist.calcBattleDamage(duelist, atkPoint - defPoint, attacker, defender, battleChainBlockInfo)));
      }
    } else if (atkPoint < defPoint) {
      // 反射ダメージが発生する場合
      // 絶対防御将軍が守備表示で攻撃しても反射ダメージが発生するとのこと。
      damageInfos.push(Duelist.calcBattleDamage(attacker.controller, defPoint - atkPoint, defender, attacker, battleChainBlockInfo));
    }

    // ダメージ計算時 ④ダメージ数値確定 その２：戦闘破壊判定
    const destroyed: DuelEntity[] = [];
    if (atkPoint > 0 && (atkPoint > defPoint || (atkPoint === defPoint && defender.battlePosition === "Attack"))) {
      destroyed.push(defender);
    }

    if (defender.battlePosition === "Attack" && atkPoint <= defPoint) {
      destroyed.push(attacker);
    }

    //ダメージ計算時 ⑥戦闘破壊確定
    // ※被破壊側の永続効果の終了、破壊側（ハデスなど）の永続効果の適用が確定する。
    //     ※混沌の黒魔術師はエラッタで誘発効果になった
    // ※墓地送りはprocBattlePhaseDamageStep5で行う。
    await DuelEntityShortHands.tryMarkForDestroy(destroyed, battleChainBlockInfo);

    // FIXME 本来ここに置くのは適切ではないが、ジャスミンの戦闘破壊耐性の判定はライフポイント増減前に行う必要があるためここに配置する。修正する場合、戦闘破壊のロジックを書き換える必要がある。
    //ダメージ計算時 ⑤戦闘ダメージの発生
    damageInfos.forEach((damageInfo) => damageInfo.damageTo.battleDamage(damageInfo));

    // ここはどうでもいい。適当に値を設定しているだけ
    battleChainBlockInfo.state = atkPoint > defPoint ? "done" : "failed";

    // ログを追加
    attacker.info.battleLog.push({ enemy: defender, timestamp: this.duel.clock.getClone() });
    defender.info.battleLog.push({ enemy: attacker, timestamp: this.duel.clock.getClone() });

    // 勝敗判定
    const losers = Object.values(this.duel.duelists).filter((duelist) => duelist.lp <= 0);

    if (losers.length) {
      if (losers.length === 1) {
        throw new DuelEnd(losers[0].getOpponentPlayer(), `戦闘ダメージによって、${losers[0].name}のライフポイントがゼロになった。`);
      }
      throw new DuelEnd(undefined, "戦闘ダメージによって、お互いのライフポイントがゼロになった。");
    }

    return true;
  };
  private readonly procBattlePhaseDamageStep4 = async (): Promise<boolean> => {
    await this.setStage("afterDmgCalc");
    //ダメージ計算後
    // ダメージ発生、戦闘発生をトリガーとする効果、またはダメージ計算後を直接指定する効果
    // チェーンは一度だけ
    await this.procChain(undefined, undefined);

    return true;
  };
  private readonly procBattlePhaseDamageStep5 = async () => {
    await this.setStage("end");

    // 戦闘破壊・墓地送り実施
    await DuelEntityShortHands.waitCorpseDisposal(this.duel);

    // チェーン番号を加算
    await this.duel.clock.incrementChainSeq();

    //ダメージステップ終了時
    // 戦闘破壊されて墓地に送られた場合の効果
    if (!(await this.procFreeChain())) {
      return false;
    }
    return true;
  };

  private readonly procBattlePhaseEndStep = async () => {
    await this.setStep("end");
    this.priorityHolder = this.turnPlayer;

    // フェイズ強制処理
    await this.procSpellSpeed1();
  };

  private readonly canContinueBattle = (): boolean => {
    if (!this.attackingMonster) {
      return false;
    }
    if (!this.attackingMonster.isOnFieldStrictly) {
      this.duel.log.info(`${this.attackingMonster.toString()}がフィールドに存在しなくなっため、戦闘が中断された。`);
      this._attackingMonster = undefined;
    } else if (this.attackingMonster.face === "FaceDown") {
      this.duel.log.info(`${this.attackingMonster.toString()}が裏側守備表示になったため、戦闘が中断された。`);
      this._attackingMonster = undefined;
    } else if (this.attackingMonster.orientation === "Horizontal") {
      // TODO 絶対防御将軍などの考慮
      this.duel.log.info(`${this.attackingMonster.toString()}が守備表示になったため、戦闘が中断された。`);
      this._attackingMonster = undefined;
    }
    return Boolean(this.attackingMonster);
  };
  private readonly setStep = (step: TDuelPhaseStep) => this.duel.clock.setStep(this.duel, step);
  private readonly setStage = (stage: TDuelPhaseStepStage) => this.duel.clock.setStage(this.duel, stage);
}

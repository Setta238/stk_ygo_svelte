import StkEvent from "@stk_utils/class/StkEvent";
import {
  duelPeriodDic,
  type DuelPeriod,
  type TDuelPeriodKey,
  type TDuelPhase,
  type TDuelPhaseStep,
  type TDuelPhaseStepStage,
} from "@ygo_duel/class/DuelPeriod";
import { Duel, SystemError } from "./Duel";

export interface IDuelClock {
  turn: number;
  phaseSeq: number;
  stepSeq: number;
  stageSeq: number;
  chainSeq: number;
  chainBlockSeq: number;
  procSeq: number;
  totalProcSeq: number;
}
export class DuelClock implements IDuelClock {
  private onTotalProcSeqChangeEvent = new StkEvent<number>();
  public get onTotalProcSeqChange() {
    return this.onTotalProcSeqChangeEvent.expose();
  }
  private onStageChangeEvent = new StkEvent<DuelPeriod>();
  public get onStageChange() {
    return this.onStageChangeEvent.expose();
  }
  private _turn: number = 0;
  private _phaseSeq: number = 0;
  private _stepSeq: number = 0;
  private _stageSeq: number = 0;
  private _chainSeq: number = 0;
  private _chainBlockSeq: number = 0;
  private _procSeq: number = 0;
  private _procTotalSeq: number = 0;
  private _periodKey: TDuelPeriodKey;
  private set periodKey(periodKey: TDuelPeriodKey) {
    if (this._periodKey === periodKey) {
      return;
    }
    this._periodKey = periodKey;
    this._chainSeq = 0;
    this._chainBlockSeq = 0;
    this._procSeq = 0;
    console.log(this.period);
    this.onStageChangeEvent.trigger(this.period);
    this.incrementTotalProcSeq();
  }
  private get periodKey() {
    return this._periodKey;
  }
  public get period() {
    return duelPeriodDic[this.periodKey];
  }

  public get turn() {
    return this._turn;
  }
  public get phaseSeq() {
    return this._phaseSeq;
  }
  public get stepSeq() {
    return this._stepSeq;
  }
  public get stageSeq() {
    return this._stageSeq;
  }
  public get chainSeq() {
    return this._chainSeq;
  }
  public get chainBlockSeq() {
    return this._chainBlockSeq;
  }
  public get procSeq() {
    return this._procSeq;
  }
  public get totalProcSeq() {
    return this._procTotalSeq;
  }
  public get isFirstChain() {
    return this.chainSeq === 0;
  }

  public constructor() {
    this._periodKey = "end";
  }
  public readonly setPhase = (duel: Duel, phase: TDuelPhase) => {
    const period = Object.values(duelPeriodDic)
      .filter((period) => period.phase === phase)
      .find((period) => (period.step ?? "start") === "start");

    if (!period) {
      throw new SystemError("想定されない状態", this.period, phase, duelPeriodDic);
    }

    if (phase === "draw") {
      duel.log.info(`ターン終了。`, duel.getTurnPlayer());
      this._turn++;
      this._phaseSeq = 0;
    } else {
      duel.log.info(`フェイズ移行（${this.period.name}→${period.name}）`, duel.getTurnPlayer());
      this._phaseSeq++;
    }

    this._stepSeq = 0;
    this._stageSeq = 0;
    this.periodKey = period.key;
  };
  public readonly setStep = (duel: Duel, step: TDuelPhaseStep) => {
    const currentPhase = this.period.phase;

    const period = Object.values(duelPeriodDic)
      .filter((period) => period.phase === currentPhase)
      .find((period) => (period.step ?? "") === step);

    if (!period) {
      throw new SystemError("想定されない状態", this.period, step, duelPeriodDic);
    }

    if (this.period.name === period.name) {
      return;
    }

    duel.log.info(`ステップ移行（${this.period.name}→${period.name}）`, duel.getTurnPlayer());

    this._stepSeq++;
    this._stageSeq = 0;

    this.periodKey = period.key;
  };
  public readonly setStage = (duel: Duel, stage: TDuelPhaseStepStage) => {
    const currentPeriod = this.period;

    const period = Object.values(duelPeriodDic)
      .filter((period) => period.phase === currentPeriod.phase)
      .filter((period) => period.step === currentPeriod.step)
      .find((period) => (period.stage ?? "") === stage);

    if (!period) {
      throw new SystemError("想定されない状態", this.period, stage, duelPeriodDic);
    }

    duel.log.info(`タイミング移行（${this.period.name}→${period.name}）`, duel.getTurnPlayer());

    this._stageSeq++;

    this.periodKey = period.key;
  };
  public readonly incrementChainSeq = () => {
    this._chainSeq++;
    this._chainBlockSeq = 0;
    this._procSeq = 0;
    this.incrementTotalProcSeq();
  };
  public readonly incrementChainBlockSeq = () => {
    this._chainBlockSeq++;
    this._procSeq = 0;
    this.incrementTotalProcSeq();
  };
  public readonly incrementProcSeq = () => {
    this._procSeq++;
    this.incrementTotalProcSeq();
  };
  public readonly incrementTotalProcSeq = () => {
    this._procTotalSeq++;
    this.onTotalProcSeqChangeEvent.trigger(this.totalProcSeq);
  };
  public readonly toString = () => {
    return `${this.totalProcSeq}(t${this.turn}-phs${this.phaseSeq}-stp${this.stepSeq}-stg${this.stepSeq}-c${this.chainSeq}-cb${this.chainBlockSeq}-prc${this.procSeq})`;
  };
  public readonly getClone = (): IDuelClock => {
    return {
      turn: this.turn,
      phaseSeq: this.phaseSeq,
      stepSeq: this.stepSeq,
      stageSeq: this.stageSeq,
      chainSeq: this.chainSeq,
      chainBlockSeq: this.chainBlockSeq,
      procSeq: this.procSeq,
      totalProcSeq: this.totalProcSeq,
    };
  };
  public readonly isSameTurn = (other: IDuelClock): boolean => {
    return this.turn === other.turn;
  };
  public readonly isSameChain = (other: IDuelClock): boolean => {
    return (
      this.turn === other.turn &&
      this.phaseSeq === other.phaseSeq &&
      this.stepSeq === other.stepSeq &&
      this.stageSeq === other.stageSeq &&
      this.chainSeq === other.chainSeq
    );
  };
  public readonly isPreviousChain = (other: IDuelClock): boolean => {
    return (
      this.turn === other.turn &&
      this.phaseSeq === other.phaseSeq &&
      this.stepSeq === other.stepSeq &&
      this.stageSeq === other.stageSeq &&
      this.chainSeq === other.chainSeq + 1
    );
  };
  public readonly isPreviousProc = (other: IDuelClock): boolean => {
    return this.totalProcSeq === other.totalProcSeq + 1;
  };
  public readonly isUponAttackDeclaration = (): boolean => {
    // バトルステップかつ、chainSeqが1の場合、攻撃宣言時（※0は攻撃宣言そのものに振られる）
    return this.period.step === "battle" && this.chainSeq === 1;
  };
}

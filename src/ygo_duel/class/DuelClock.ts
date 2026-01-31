import { StkAsyncEvent } from "@stk_utils/class/StkEvent";
import {
  duelPeriodDic,
  type DuelPeriod,
  type TDuelPeriodKey,
  type TDuelPhase,
  type TDuelPhaseStep,
  type TDuelPhaseStepStage,
} from "@ygo_duel/class/DuelPeriod";
import { type Duel } from "@ygo_duel/class/Duel";
import { DuelError } from "@ygo_duel/class_error/DuelError";
const duelClockSubKeys = ["turn", "phaseSeq", "stepSeq", "stageSeq", "chainSeq", "chainBlockSeq", "procSeq"] as const;
export type TDuelClockSubKey = (typeof duelClockSubKeys)[number];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const duelClockKeys = [...duelClockSubKeys, "totalProcSeq"] as const;
type TDuelClockKey = (typeof duelClockKeys)[number];

export type IDuelClock = Readonly<
  {
    [key in TDuelClockKey]: number;
  } & {
    period: DuelPeriod;
  }
>;

export class DuelClock implements IDuelClock {
  public static readonly isSameChain = (left: IDuelClock, right: IDuelClock): boolean => {
    return (
      left.turn === right.turn &&
      left.phaseSeq === right.phaseSeq &&
      left.stepSeq === right.stepSeq &&
      left.stageSeq === right.stageSeq &&
      left.chainSeq === right.chainSeq
    );
  };

  private onClockChangeEvents: { [key in TDuelClockSubKey]: StkAsyncEvent<IDuelClock> } = {
    turn: new StkAsyncEvent<IDuelClock>(),
    phaseSeq: new StkAsyncEvent<IDuelClock>(),
    stepSeq: new StkAsyncEvent<IDuelClock>(),
    stageSeq: new StkAsyncEvent<IDuelClock>(),
    chainSeq: new StkAsyncEvent<IDuelClock>(),
    chainBlockSeq: new StkAsyncEvent<IDuelClock>(),
    procSeq: new StkAsyncEvent<IDuelClock>(),
  };

  public get onTurnChange() {
    return this.onClockChangeEvents["turn"].expose();
  }
  public get onStageChange() {
    return this.onClockChangeEvents["stageSeq"].expose();
  }
  public get onProcSeqChange() {
    return this.onClockChangeEvents["procSeq"].expose();
  }
  private _turn: number = 0;
  private _phaseSeq: number = 0;
  private _stepSeq: number = 0;
  private _stageSeq: number = 0;
  private _chainSeq: number = 0;
  private _chainBlockSeq: number = 0;
  private _procSeq: number = 0;
  private _totalProcSeq: number = 0;
  private _periodKey: TDuelPeriodKey;
  private readonly _previousStartPoints: { [key in TDuelClockSubKey]: number } = {
    turn: 0,
    phaseSeq: 0,
    stepSeq: 0,
    stageSeq: 0,
    chainSeq: 0,
    chainBlockSeq: 0,
    procSeq: 0,
  };
  private readonly _currentStartPoints: { [key in TDuelClockSubKey]: number } = {
    turn: 0,
    phaseSeq: 0,
    stepSeq: 0,
    stageSeq: 0,
    chainSeq: 0,
    chainBlockSeq: 0,
    procSeq: 0,
  };
  public get previousStartPoints(): Readonly<{ [key in TDuelClockSubKey]: number }> {
    return this._previousStartPoints;
  }
  public get currentStartPoints(): Readonly<{ [key in TDuelClockSubKey]: number }> {
    return this._currentStartPoints;
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
    return this._totalProcSeq;
  }
  public get isFirstChain() {
    return this.chainSeq === 0;
  }

  public constructor() {
    this._periodKey = "end";
  }
  public readonly setPhase = async (duel: Duel, phase: TDuelPhase) => {
    const period = Object.values(duelPeriodDic)
      .filter((period) => period.phase === phase)
      .find((period) => (period.step ?? "start") === "start");

    if (!period) {
      throw new DuelError("想定されない状態", this.period, phase, duelPeriodDic);
    }

    if (phase === "draw") {
      if (this.turn > 0) {
        duel.log.info(`ターン終了。`, duel.getTurnPlayer());
      }
      this._turn++;
      this._phaseSeq = 0;
    } else {
      duel.log.info(`フェイズ移行（${this.period.name}→${period.name}）`, duel.getTurnPlayer());
      this._phaseSeq++;
    }

    this._stepSeq = 0;
    this._stageSeq = 0;
    await this.setPeriodKey(period.key);
  };
  public readonly setStep = async (duel: Duel, step: TDuelPhaseStep) => {
    const currentPhase = this.period.phase;

    const period = Object.values(duelPeriodDic)
      .filter((period) => period.phase === currentPhase)
      .find((period) => (period.step ?? "") === step);

    if (!period) {
      throw new DuelError("想定されない状態", this.period, step, duelPeriodDic);
    }

    if (this.period.name === period.name) {
      return;
    }

    duel.log.info(`ステップ移行（${this.period.name}→${period.name}）`, duel.getTurnPlayer());

    this._stepSeq++;
    this._stageSeq = 0;

    await this.setPeriodKey(period.key);
  };
  public readonly setStage = async (duel: Duel, stage: TDuelPhaseStepStage) => {
    const currentPeriod = this.period;

    const period = Object.values(duelPeriodDic)
      .filter((period) => period.phase === currentPeriod.phase)
      .filter((period) => period.step === currentPeriod.step)
      .find((period) => (period.stage ?? "") === stage);

    if (!period) {
      throw new DuelError("想定されない状態", this.period, stage, duelPeriodDic);
    }

    duel.log.info(`タイミング移行（${this.period.name}→${period.name}）`, duel.getTurnPlayer());

    this._stageSeq++;

    await this.setPeriodKey(period.key);
  };
  private readonly setPeriodKey = async (periodKey: TDuelPeriodKey) => {
    if (this._periodKey === periodKey) {
      return;
    }
    this._periodKey = periodKey;
    this._chainSeq = 0;
    this._chainBlockSeq = 0;
    this._procSeq = 0;
    await this.incrementTotalProcSeq();
  };
  public readonly incrementChainSeq = async () => {
    this._chainSeq++;
    this._chainBlockSeq = 0;
    this._procSeq = 0;
    await this.incrementTotalProcSeq();
  };
  public readonly incrementChainBlockSeq = async () => {
    this._chainBlockSeq++;
    this._procSeq = 0;
    await this.incrementTotalProcSeq();
  };
  public readonly incrementProcSeq = async () => {
    this._procSeq++;
    await this.incrementTotalProcSeq();
  };
  private readonly incrementTotalProcSeq = async () => {
    this._totalProcSeq++;

    // 開始点のセット
    let needsToSetStartPoint = true;
    duelClockSubKeys.toReversed().forEach((key) => {
      // 一つ下のレベルが0の場合、開始点として保存
      if (needsToSetStartPoint) {
        this._previousStartPoints[key] = this.currentStartPoints[key];
        this._currentStartPoints[key] = this.totalProcSeq;
      }
      // 一つ上のレベルの開始点を保存するかどうかの判定。
      needsToSetStartPoint = needsToSetStartPoint && this[key] === 0;
    });

    for (const key of duelClockSubKeys
      .toReversed()
      .filter((key) => this._currentStartPoints[key] === this.totalProcSeq)
      .filter((key) => key !== "procSeq")) {
      await this.onClockChangeEvents[key].trigger(this);
    }

    // procSeqのイベントは毎回トリガする。
    await this.onClockChangeEvents["procSeq"].trigger(this);
  };
  public readonly toFullString = () => {
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
      period: this.period,
    };
  };
  public readonly isSameTurn = (other: IDuelClock): boolean => {
    return this.turn === other.turn;
  };
  public readonly isSameChain = (other: IDuelClock): boolean => DuelClock.isSameChain(this, other);

  public readonly isPreviousChain = (other: IDuelClock): boolean => {
    return (
      this.turn === other.turn &&
      this.phaseSeq === other.phaseSeq &&
      this.stepSeq === other.stepSeq &&
      this.stageSeq === other.stageSeq &&
      this.chainSeq === other.chainSeq + 1
    );
  };
  public readonly isPreviousStage = (other: IDuelClock): boolean => {
    return this.turn === other.turn && this.phaseSeq === other.phaseSeq && this.stepSeq === other.stepSeq && this.stageSeq === other.stageSeq + 1;
  };
  public readonly isPreviousTurn = (other: IDuelClock): boolean => {
    return this.turn === other.turn + 1;
  };
  public readonly isPreviousProc = (other: IDuelClock): boolean => {
    return this.totalProcSeq === other.totalProcSeq + 1;
  };
}

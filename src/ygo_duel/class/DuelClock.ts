import StkEvent from "@stk_utils/class/StkEvent";

export interface IDuelClock {
  turn: number;
  phaseSeq: number;
  stepSeq: number;
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
  private _turn: number = 0;
  private _phaseSeq: number = 0;
  private _stepSeq: number = 0;
  private _chainSeq: number = 0;
  private _chainBlockSeq: number = 0;
  private _procSeq: number = 0;
  private _procTotalSeq: number = 0;
  public get turn() {
    return this._turn;
  }
  public get phaseSeq() {
    return this._phaseSeq;
  }
  public get stepSeq() {
    return this._stepSeq;
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
  public readonly incrementTurn = () => {
    this._turn++;
    this._phaseSeq = 0;
    this._stepSeq = 0;
    this._chainSeq = 0;
    this._chainBlockSeq = 0;
    this._procSeq = 0;
    this.incrementTotalProcSeq();
  };
  public readonly incrementPhaseSeq = () => {
    this._phaseSeq++;
    this._stepSeq = 0;
    this._chainSeq = 0;
    this._chainBlockSeq = 0;
    this._procSeq = 0;
    this.incrementTotalProcSeq();
  };
  public readonly incrementStepSeq = () => {
    this._stepSeq++;
    this._chainSeq = 0;
    this._chainBlockSeq = 0;
    this._procSeq = 0;
    this.incrementTotalProcSeq();
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
    return `${this.totalProcSeq}(t${this.turn}-p${this.phaseSeq}-ps${this.stepSeq}-c${this.chainSeq}-cb${this.chainBlockSeq}-p${this.procSeq})`;
  };
  public readonly getClone = (): IDuelClock => {
    return {
      turn: this.turn,
      phaseSeq: this.phaseSeq,
      stepSeq: this.stepSeq,
      chainSeq: this.chainSeq,
      chainBlockSeq: this.chainBlockSeq,
      procSeq: this.procSeq,
      totalProcSeq: this.totalProcSeq,
    };
  };
  public readonly isSameChain = (other: IDuelClock): boolean => {
    return this.turn === other.turn && this.phaseSeq === other.phaseSeq && this.stepSeq === other.stepSeq && this.chainSeq === other.chainSeq;
  };
  public readonly isPreviousChain = (other: IDuelClock): boolean => {
    return this.turn === other.turn && this.phaseSeq === other.phaseSeq && this.stepSeq === other.stepSeq && this.chainSeq === other.chainSeq + 1;
  };
  public readonly isPreviousProc = (other: IDuelClock): boolean => {
    return this.totalProcSeq === other.totalProcSeq + 1;
  };
}

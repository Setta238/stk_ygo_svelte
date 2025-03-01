export class DuelClock {
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
  public get procTotalSeq() {
    return this._procTotalSeq;
  }
  public readonly incrementTurn = () => {
    this._turn++;
    this._phaseSeq = 0;
    this._stepSeq = 0;
    this._chainSeq = 0;
    this._chainBlockSeq = 0;
    this._procSeq = 0;
  };
  public readonly incrementPhaseSeq = () => {
    this._phaseSeq++;
    this._stepSeq = 0;
    this._chainSeq = 0;
    this._chainBlockSeq = 0;
    this._procSeq = 0;
  };
  public readonly incrementStepSeq = () => {
    this._stepSeq++;
    this._chainSeq = 0;
    this._chainBlockSeq = 0;
    this._procSeq = 0;
  };
  public readonly incrementChainSeq = () => {
    this._chainSeq++;
    this._chainBlockSeq = 0;
    this._procSeq = 0;
  };
  public readonly incrementChainBlockSeq = () => {
    this._chainBlockSeq++;
    this._procSeq = 0;
  };
  public readonly incrementProcSeq = () => {
    this._procSeq++;
    this._procTotalSeq++;
  };
}

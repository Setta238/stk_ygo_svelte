import { SystemError, type Duel } from "@ygo_duel/class/Duel";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { TDuelPhase } from "@ygo_duel/class/DuelPeriod";
import { DuelFacilitatorBase } from "@ygo_duel/class_facilitator/DuelFacilitatorBase";
import { DuelFacilitator_MainPhase } from "./DuelFacilitator_MainPhase";

export class DuelFacilitator_StandbyPhase extends DuelFacilitatorBase {
  public get nextPhaseList(): TDuelPhase[] {
    return ["main1"];
  }
  public get attackingMonster(): DuelEntity | undefined {
    return undefined;
  }
  public get targetForAttack(): DuelEntity | undefined {
    return undefined;
  }
  public constructor(duel: Duel) {
    super(duel, "standby");
  }

  public override readonly declareAttack = () => {
    throw new SystemError(`バトルフェイズ以外で攻撃宣言を実行した。${this.duel.clock.period.key}`);
  };
  protected override readonly _proceed = async (): Promise<DuelFacilitatorBase> => {
    // フェイズ強制処理
    await this.procSpellSpeed1();

    return new DuelFacilitator_MainPhase(this.duel, "main1");
  };
}

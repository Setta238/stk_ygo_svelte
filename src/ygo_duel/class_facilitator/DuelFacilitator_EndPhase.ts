import { type Duel } from "@ygo_duel/class/Duel";
import { DuelError } from "@ygo_duel/class_error/DuelError";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { TDuelPhase } from "@ygo_duel/class/DuelPeriod";
import { DuelFacilitatorBase } from "@ygo_duel/class_facilitator/DuelFacilitatorBase";
import { DuelFacilitator_DrawPhase } from "./DuelFacilitator_DrawPhase";

export class DuelFacilitator_EndPhase extends DuelFacilitatorBase {
  public get nextPhaseList(): TDuelPhase[] {
    return ["draw"];
  }

  public get attackingMonster(): DuelEntity | undefined {
    return undefined;
  }

  public get targetForAttack(): DuelEntity | undefined {
    return undefined;
  }

  public constructor(duel: Duel) {
    super(duel, "end");
  }

  public override readonly declareAttack = () => {
    throw new DuelError(`バトルフェイズ以外で攻撃宣言を実行した。${this.duel.clock.period.key}`);
  };

  protected override readonly _proceed = async (): Promise<DuelFacilitatorBase> => {
    // フェイズ強制処理
    await this.procSpellSpeed1();

    while (true) {
      const hand = this.turnPlayer.getHandCell();
      const qty = hand.cardEntities.length;
      if (qty < 7) {
        break;
      }
      await this.turnPlayer.discard(qty - 6, "Rule");
      // TODO トリガー効果のみ発動可能
    }

    this.turnPlayer.writeInfoLog(`ターン終了。`);
    // このタイミングではフリーチェーンを発動できない。
    return new DuelFacilitator_DrawPhase(this.duel);
  };
}

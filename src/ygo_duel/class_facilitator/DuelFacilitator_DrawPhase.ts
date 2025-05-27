import { SystemError, type Duel } from "@ygo_duel/class/Duel";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { TDuelPhase } from "@ygo_duel/class/DuelPeriod";
import { DuelFacilitatorBase } from "@ygo_duel/class_facilitator/DuelFacilitatorBase";
import { DuelFacilitator_StandbyPhase } from "./DuelFacilitator_StandbyPhase";

export class DuelFacilitator_DrawPhase extends DuelFacilitatorBase {
  public get nextPhaseList(): TDuelPhase[] {
    return ["standby"];
  }
  public get attackingMonster(): DuelEntity | undefined {
    return undefined;
  }
  public get targetForAttack(): DuelEntity | undefined {
    return undefined;
  }
  public constructor(duel: Duel) {
    super(duel, "draw");
  }

  public override readonly declareAttack = () => {
    throw new SystemError(`バトルフェイズ以外で攻撃宣言を実行した。${this.duel.clock.period.key}`);
  };

  protected override readonly _proceed = async () => {
    Object.values(this.duel.duelists).forEach((duelist) => duelist.initForDrawPhase());
    this.turnPlayer.writeInfoLog("ドローフェイズ開始。");
    if (this.duel.clock.turn === 1) {
      this.turnPlayer.writeInfoLog("先攻プレイヤーはドローできない。");
    } else {
      await this.turnPlayer.draw(1, undefined, undefined);
      // エクゾディア判定
      for (const afterChainBlockEffect of this.turnPlayer.getEnableActions(["Exodia"], ["Normal"], [])) {
        await afterChainBlockEffect.action.directExecute(this.turnPlayer, undefined, false);
      }
    }
    this.duel.field.getCardsOnFieldStrictly().forEach((m) => m.initForTurn());
    // フェイズ強制処理
    await this.procSpellSpeed1();

    return new DuelFacilitator_StandbyPhase(this.duel);
  };
}

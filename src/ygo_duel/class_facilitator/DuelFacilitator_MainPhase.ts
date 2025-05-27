import { SystemError, type Duel } from "@ygo_duel/class/Duel";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import type { TDuelPhase } from "@ygo_duel/class/DuelPeriod";
import { DuelFacilitatorBase } from "@ygo_duel/class_facilitator/DuelFacilitatorBase";
import { DuelFacilitator_BattlePhase } from "./DuelFacilitator_BattlePhase";
import { DuelFacilitator_EndPhase } from "./DuelFacilitator_EndPhase";

export class DuelFacilitator_MainPhase extends DuelFacilitatorBase {
  public get nextPhaseList(): TDuelPhase[] {
    return this.duel.phase === "main1" ? ["battle1", "end"] : ["end"];
  }
  public get attackingMonster(): DuelEntity | undefined {
    return undefined;
  }
  public get targetForAttack(): DuelEntity | undefined {
    return undefined;
  }
  public constructor(duel: Duel, phase: "main1" | "main2") {
    super(duel, phase);
  }

  public override readonly declareAttack = () => {
    throw new SystemError(`バトルフェイズ以外で攻撃宣言を実行した。${this.duel.clock.period.key}`);
  };
  protected override readonly _proceed = async (): Promise<DuelFacilitatorBase> => {
    while (true) {
      this.priorityHolder = this.turnPlayer;

      // ユーザー入力を待つ。
      const response = await this.duel.view.waitFieldAction(
        this.priorityHolder.getEnableActions(
          [
            "NormalSummon",
            "SpellTrapSet",
            "SpecialSummon",
            "FlipSummon",
            "ChangeBattlePosition",
            "IgnitionEffect",
            "QuickEffect",
            "CardActivation",
            "LingeringEffect",
          ],
          ["Normal", "Quick", "Counter"],
          []
        )
      );

      if (response.actionInfo) {
        // ユーザー入力がカードアクションだった場合、チェーン処理へ
        const result = await this.procChain({ activator: this.priorityHolder, actionInfo: response.actionInfo }, undefined);
        if (result === "cancel") {
          continue;
        }

        await this.procFreeChain();

        continue;
      }

      const nextPhase = response.phaseChange;
      // フェイズ移行前に、相手に優先権が移る。
      if (nextPhase) {
        this.priorityHolder = this.nonTurnPlayer;
        let result = "done" as "done" | "pass" | "cancel";
        while (true) {
          const actionInfo = await this.duel.view.waitQuickEffect(
            this.priorityHolder,
            this.priorityHolder.getEnableActions(["QuickEffect", "CardActivation"], ["Quick", "Counter"], []),
            [],
            `相手がフェイズを終了しようとしている。`,
            true
          );

          // 相手が行動した場合、フェイズ移行はキャンセル。
          if (actionInfo) {
            result = await this.procChain({ activator: this.priorityHolder, actionInfo }, undefined);
            if (result === "done") {
              break;
            }
          }

          return nextPhase === "battle1" ? new DuelFacilitator_BattlePhase(this.duel, nextPhase) : new DuelFacilitator_EndPhase(this.duel);
        }
        if (result === "done") {
          await this.procFreeChain();
          continue;
        }
      }
    }
  };
}

import type { ChainBlockInfo } from "./DuelCardAction";
import { CardActionBase, type CardActionDefinitionBase } from "./DuelCardActionBase";
import type { DuelEntity } from "./DuelEntity";

export type SubstituteEffectDefinition = CardActionDefinitionBase & {
  isApplicableTo: (
    effect: SubstituteEffect,
    destroyType: "BattleDestroy" | "EffectDestroy",
    targets: DuelEntity[],
    chainBlockInfo: ChainBlockInfo<unknown>
  ) => DuelEntity[];
  substitute: (
    effect: SubstituteEffect,
    destroyType: "BattleDestroy" | "EffectDestroy",
    targets: DuelEntity[],
    chainBlockInfo: ChainBlockInfo<unknown>
  ) => Promise<DuelEntity[]>;
};

export class SubstituteEffect extends CardActionBase {
  public static readonly createNew = (entity: DuelEntity, definition: SubstituteEffectDefinition) => {
    return new SubstituteEffect("AutoSeq", entity, definition);
  };
  protected override get definition() {
    return super.definition as SubstituteEffectDefinition;
  }
  public readonly isApplicableTo = (destroyType: "BattleDestroy" | "EffectDestroy", targets: DuelEntity[], chainBlockInfo: ChainBlockInfo<unknown>) => {
    console.log(this.entity.toString(), this, destroyType, targets);
    const actionCount = this.entity.counterHolder.getActionCount(this);
    if (this.isOnlyNTimesPerTurnIfFaceup > 0 && actionCount >= this.isOnlyNTimesPerTurnIfFaceup) {
      this.entity.counterHolder.incrementActionCountPerTurn(this);
    } else if (this.isOnlyNTimesIfFaceup > 0 && actionCount >= this.isOnlyNTimesIfFaceup) {
      this.entity.counterHolder.incrementActionCount(this);
    }

    return this.definition.isApplicableTo(this, destroyType, targets, chainBlockInfo);
  };
  public readonly substitute = async (destroyType: "BattleDestroy" | "EffectDestroy", targets: DuelEntity[], chainBlockInfo: ChainBlockInfo<unknown>) => {
    const result = await this.definition.substitute(this, destroyType, targets, chainBlockInfo);
    if (this.isOnlyNTimesPerTurnIfFaceup > 0) {
      this.entity.counterHolder.incrementActionCountPerTurn(this);
    } else if (this.isOnlyNTimesIfFaceup > 0) {
      this.entity.counterHolder.incrementActionCount(this);
    }
    return result;
  };

  public readonly getClone = () => {
    return new SubstituteEffect(this.seq, this.entity, this.definition);
  };
}

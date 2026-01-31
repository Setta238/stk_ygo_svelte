import { EntityActionBase, type EntityActionDefinitionBase, type EntityActionExecuteInfo } from "@ygo_duel/class/DuelEntityActionBase";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";

export type SubstituteEffectDefinition = EntityActionDefinitionBase & {
  isApplicableTo: (effect: SubstituteEffect, ...args: Parameters<typeof SubstituteEffect.prototype.isApplicableTo>) => DuelEntity[];
  substitute: (effect: SubstituteEffect, ...args: Parameters<typeof SubstituteEffect.prototype.substitute>) => Promise<DuelEntity[]>;
};

export class SubstituteEffect extends EntityActionBase {
  public static readonly createNew = (entity: DuelEntity, definition: SubstituteEffectDefinition) => {
    return new SubstituteEffect("AutoSeq", entity, definition);
  };
  protected override get definition() {
    return super.definition as SubstituteEffectDefinition;
  }
  public readonly isApplicableTo = (...args: Parameters<typeof SubstituteEffect.prototype.substitute>) => {
    const actionCount = this.entity.counterHolder.getActionCount(this);
    if (this.isOnlyNTimesPerTurnIfFaceup > 0 && actionCount >= this.isOnlyNTimesPerTurnIfFaceup) {
      this.entity.counterHolder.incrementActionCountPerTurn(this);
    } else if (this.isOnlyNTimesIfFaceup > 0 && actionCount >= this.isOnlyNTimesIfFaceup) {
      this.entity.counterHolder.incrementActionCount(this);
    }

    return this.definition.isApplicableTo(this, ...args);
  };
  public readonly substitute = async (destroyType: "Battle" | "Effect", targets: DuelEntity[], chainBlockInfo: EntityActionExecuteInfo) => {
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

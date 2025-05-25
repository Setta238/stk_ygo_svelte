import type { DuelEntity, MoveParameters } from "@ygo_duel/class/DuelEntity";
import { EntityActionBase, type EntityActionDefinitionBase } from "@ygo_duel/class/DuelEntityActionBase";
export type ImmediatelyActionDefinition = Omit<EntityActionDefinitionBase, "isMandatory" | "executableDuelistTypes" | "playType"> & {
  execute: (
    action: ImmediatelyAction,
    ...args: Parameters<typeof ImmediatelyAction.prototype.execute>
  ) => ReturnType<typeof ImmediatelyAction.prototype.execute>;
};

export class ImmediatelyAction extends EntityActionBase {
  public static readonly createNew = (entity: DuelEntity, definition: ImmediatelyActionDefinition) => {
    return new ImmediatelyAction("AutoSeq", entity, definition);
  };

  public override get definition() {
    return super.definition as Readonly<ImmediatelyActionDefinition & EntityActionDefinitionBase>;
  }
  public get playType() {
    return this.definition.playType;
  }

  public readonly toString = () => {
    return this.title;
  };
  public readonly toFullString = () => {
    return `${this.entity.toString()}の${this.toString()}`;
  };

  protected constructor(seq: "AutoSeq" | number, entity: DuelEntity, definition: ImmediatelyActionDefinition) {
    super(seq, entity, { ...definition, playType: "ContinuousEffect", isMandatory: false, executableDuelistTypes: ["Controller"] });
  }

  public readonly execute = async (triggerEntity?: DuelEntity, moveParam?: MoveParameters): Promise<"RemoveMe" | undefined> => {
    if (!this.canExecute()) {
      return;
    }

    const result = await this.definition.execute(this, triggerEntity, moveParam);

    if (result === "RemoveMe") {
      this.entity.immediatelyActions.reset(...this.entity.immediatelyActions.filter((item) => item !== this));
    }

    return result;
  };
}

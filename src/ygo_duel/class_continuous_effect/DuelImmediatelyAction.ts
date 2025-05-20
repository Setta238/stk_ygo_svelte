import { StickyEffectOperatorBase, StickyEffectOperatorBundle, StickyEffectOperatorPool, type StickyEffectOperatorArgs } from "./DuelStickyEffectOperatorBase";
import { type DuelEntity, type TDuelCauseReason } from "../class/DuelEntity";

export class ImmediatelyActionPool extends StickyEffectOperatorPool<ImmediatelyAction, ImmediatelyActionBundle> {
  protected afterDistributeAll = () => true;
}

export class ImmediatelyActionBundle extends StickyEffectOperatorBundle<ImmediatelyAction> {
  protected beforePush = () => {};
  public readonly act = async (triggerEntity?: DuelEntity, movedAs?: TDuelCauseReason[]) => {
    const seqList: number[] = [];
    for (const operator of this.effectiveOperators) {
      const result = await operator.act(this.entity, triggerEntity, movedAs);
      if (result === "RemoveMe") {
        seqList.push(operator.seq);
      }
    }
    seqList.forEach(this.removeItem);
  };
}

export type ImmediatelyActionArgs = StickyEffectOperatorArgs & {
  act: typeof ImmediatelyAction.prototype.act;
};

export class ImmediatelyAction extends StickyEffectOperatorBase {
  public beforeRemove: () => void = () => {};
  public readonly act: (bundleOwner: DuelEntity, ...args: Parameters<typeof ImmediatelyActionBundle.prototype.act>) => Promise<"RemoveMe" | undefined>;

  public constructor(args: ImmediatelyActionArgs) {
    super(args);
    this.act = args.act;
  }
}

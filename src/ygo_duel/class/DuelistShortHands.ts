import type { MaterialInfo } from "@ygo_duel/cards/CardDefinitions";
import type { CardActionDefinitionAttr } from "./DuelCardAction";
import { type TSummonRuleCauseReason, type TDuelCauseReason, DuelEntity } from "./DuelEntity";
import { Duelist } from "./Duelist";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { DuelFieldCell } from "./DuelFieldCell";

declare module "./Duelist" {
  interface Duelist {
    summon(
      summonType: TSummonRuleCauseReason,
      moveAs: TDuelCauseReason[],
      actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
      monster: DuelEntity,
      posList: Readonly<TBattlePosition[]>,
      cells: DuelFieldCell[],
      materialInfos: MaterialInfo[],
      cancelable: boolean
    ): Promise<DuelEntity | undefined>;
  }
}

Duelist.prototype.summon = async function (
  summonType: TSummonRuleCauseReason,
  moveAs: TDuelCauseReason[],
  actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
  monster: DuelEntity,
  posList: Readonly<TBattlePosition[]>,
  cells: DuelFieldCell[],
  materialInfos: MaterialInfo[],
  cancelable: boolean
): Promise<DuelEntity | undefined> {
  const monsters =
    (await this.summonMany(
      this,
      summonType,
      moveAs,
      actDefAttr,
      [{ monster, posList, cells }],
      materialInfos,
      false,
      (selected) => selected.length === 1,
      cancelable
    )) ?? [];
  return monsters[0];
};

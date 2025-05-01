import type { CardActionDefinitionAttr, SummonMaterialInfo } from "./DuelCardAction";
import { type TSummonKindCauseReason, type TDuelCauseReason, DuelEntity } from "./DuelEntity";
import { Duelist } from "./Duelist";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import type { DuelFieldCell } from "./DuelFieldCell";

declare module "./Duelist" {
  interface Duelist {
    summon(
      summonKind: TSummonKindCauseReason,
      movedAs: TDuelCauseReason[],
      actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
      monster: DuelEntity,
      posList: Readonly<TBattlePosition[]>,
      cells: DuelFieldCell[],
      materialInfos: SummonMaterialInfo[],
      cancelable: boolean
    ): Promise<DuelEntity | undefined>;
    waitSelectEntities(
      choises: DuelEntity[],
      qty: number | undefined,
      validator: (selected: DuelEntity[]) => boolean,
      message: string,
      cancelable: boolean
    ): Promise<DuelEntity[] | undefined>;
    waitSelectEntity(choises: DuelEntity[], message: string, cancelable: boolean): Promise<DuelEntity | undefined>;
  }
}

Duelist.prototype.summon = async function (
  summonKind: TSummonKindCauseReason,
  movedAs: TDuelCauseReason[],
  actDefAttr: CardActionDefinitionAttr & { entity: DuelEntity },
  monster: DuelEntity,
  posList: Readonly<TBattlePosition[]>,
  cells: DuelFieldCell[],
  materialInfos: SummonMaterialInfo[],
  cancelable: boolean
): Promise<DuelEntity | undefined> {
  const monsters =
    (await this.summonMany(
      this,
      summonKind,
      movedAs,
      actDefAttr,
      [{ monster, posList, cells }],
      materialInfos,
      false,
      1,
      (selected) => selected.length === 1,
      cancelable
    )) ?? [];
  return monsters[0];
};

Duelist.prototype.waitSelectEntities = function (
  choices: DuelEntity[],
  qty: number | undefined,
  validator: (selected: DuelEntity[]) => boolean,
  message: string,
  cancelable: boolean = false
): Promise<DuelEntity[] | undefined> {
  return this.duel.view.waitSelectEntities(this, { choices, qty, validator, cancelable }, message);
};

Duelist.prototype.waitSelectEntity = async function (choices: DuelEntity[], message: string, cancelable: boolean = false): Promise<DuelEntity | undefined> {
  const selected = await this.waitSelectEntities(choices, 1, (selected) => selected.length === 1, message, cancelable);
  return selected ? selected[0] : undefined;
};

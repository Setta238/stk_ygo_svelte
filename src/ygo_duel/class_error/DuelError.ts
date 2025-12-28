import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { IsChainBlockInfo, type ChainBlockInfo, type ChainBlockInfoBase, type ChainBlockInfoPreparing } from "@ygo_duel/class/DuelEntityAction";
import type { Duelist } from "@ygo_duel/class/Duelist";

export class DuelEnd extends Error {
  public readonly winner: Duelist | undefined;
  public readonly message: string;
  public constructor(winner: Duelist | undefined, message: string) {
    super(winner ? `デュエルが終了した。勝者：${winner.profile.name}` : "デュエルが終了した。ドロー。");
    this.winner = winner;
    this.message = message;
  }
}
export class DuelError extends Error {
  public readonly message: string;
  public readonly items: unknown[];
  public readonly viteBuildTimestamp = import.meta.env.VITE_BUILD_TIMESTAMP;
  public constructor(message: string, ...items: unknown[]) {
    super(message);
    this.message = message;
    this.items = items;
  }
}

export class IllegalCancelError extends DuelError {
  public constructor(...items: unknown[]) {
    super("キャンセル不可のアクションがキャンセルされた。", ...items);
  }
}

export type TIllegalActionType = "UnexpectedSituation" | "IllegalActionCopy" | "IllegalActionCancel" | "IllegalActionCost" | "IlligalActionData";

export class IllegalActionError extends DuelError {
  public constructor(illegalActionType: TIllegalActionType, chainBlockInfo: ChainBlockInfoBase<any> | ChainBlockInfo<any>, ...items: unknown[]) {
    let msg = `${illegalActionType} duelist:${chainBlockInfo.activator.name} entity:${chainBlockInfo.action.entity.toString()} action:${chainBlockInfo.action.definition.title}`;
    if (IsChainBlockInfo(chainBlockInfo)) {
      msg += ` targets:${chainBlockInfo.selectedEntities}`;
    }
    if (illegalActionType === "IlligalActionData") {
      msg += ` data:${chainBlockInfo.data}`;
    }
    super(msg, [chainBlockInfo, ...items]);
  }
}

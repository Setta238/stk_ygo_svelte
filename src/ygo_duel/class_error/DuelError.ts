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

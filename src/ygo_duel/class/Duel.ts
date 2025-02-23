import DeckInfo from "@ygo/class/DeckInfo";
import Duelist, { type TDuelistType } from "@ygo_duel/class/Duelist";
import DuelistProfile from "@ygo/class/DuelistProfile";
import { DuelField } from "./DuelField";
import DuelLog from "@ygo_duel/class/DuelLog";
import StkEvent from "@stk_utils/class/StkEvent";
import type DuelEntity from "@ygo_duel/class/DuelEntity";
import { cardActionChainBlockTypes, type CardAction, type TCardActionType, type TSpellSpeed } from "@ygo_duel/class/DuelEntity";
import type { DuelFieldCell } from "./DuelFieldCell";
import { modalController } from "@ygo_duel_modal/class/ModalController";
export type ProcKey = { turn: number; seq: number; chain: number };
export type TDuelPhase = "draw" | "standby" | "main1" | "battle" | "main2" | "end";
export type TDuelPhaseStep = "start" | "battle" | "damage" | "end" | undefined;
export type TDuelWaitMode = "None" | "CardAction" | "EntitiesSelect" | "SubActionSelect";
export const seats = ["Above", "Below"] as const;
export type TSeat = (typeof seats)[number];
export type DuelistAction = {
  phaseChange?: TDuelPhase;
  selectedEntities?: DuelEntity[];
  surrender?: boolean;
  sendMessage?: string;
  action?: CardAction;
  cell?: DuelFieldCell;
};

export class DuelEnd extends Error {
  public readonly winner: Duelist | undefined;
  public constructor(winner?: Duelist) {
    const message = winner ? `デュエルが終了した。勝者：${winner.profile.name}` : "デュエルが終了した。ドロー。";
    super(message);
    this.winner = winner;
  }
}
export class Duel {
  private onDuelUpdateEvent = new StkEvent<void>();
  public get onDuelUpdate() {
    return this.onDuelUpdateEvent.expose();
  }
  public readonly requireUpdate = () => {
    this.onDuelUpdateEvent.trigger();
  };
  private onWaitStartEvent = new StkEvent<{ resolve: (action: DuelistAction) => void; entitiesValidator: (selectedEntities: DuelEntity[]) => boolean }>();
  public get onWaitStart() {
    return this.onWaitStartEvent.expose();
  }
  private onWaitEndEvent = new StkEvent<void>();
  public get onWaitEnd() {
    return this.onWaitEndEvent.expose();
  }
  public readonly log: DuelLog;
  public procKey: ProcKey;
  public turn: number;
  public phase: TDuelPhase;
  public phaseStep: TDuelPhaseStep;
  public message: string;
  public waitMode: TDuelWaitMode;
  public readonly enableCardPlayTypes: TCardActionType[];
  public readonly enableSpellSpeeds: TSpellSpeed[];
  public readonly enableActions: CardAction[];

  public nextPhaseList: TDuelPhase[];
  public field: DuelField;
  public readonly duelists: { [key in TSeat]: Duelist };
  public readonly firstPlayer: Duelist;
  public readonly secondPlayer: Duelist;
  public priorityHolder: Duelist;
  public isEnded: boolean;
  public constructor(
    duelist1: DuelistProfile,
    duelist1Type: TDuelistType,
    deck1: DeckInfo,
    duelist2: DuelistProfile,
    duelist2Type: TDuelistType,
    deck2: DeckInfo
  ) {
    this.turn = 0;
    this.phase = "end";
    this.procKey = { turn: 0, seq: 0, chain: 0 };
    this.nextPhaseList = [];
    this.message = "";
    this.waitMode = "None";
    this.enableCardPlayTypes = [];
    this.enableSpellSpeeds = [];
    this.enableActions = [];
    this.isEnded = false;
    const coin = Math.random() > 0.5;

    this.duelists = {
      Below: new Duelist(this, "Below", duelist1, duelist1Type, deck1),
      Above: new Duelist(this, "Above", duelist2, duelist2Type, deck2),
    };
    this.firstPlayer = coin ? this.duelists.Below : this.duelists.Above;
    this.secondPlayer = !coin ? this.duelists.Below : this.duelists.Above;

    this.priorityHolder = this.firstPlayer;

    this.log = new DuelLog(this);
    this.log.write(`先攻：${this.firstPlayer.profile.name}`);
    this.field = new DuelField(this);

    Object.values(this.duelists).forEach(this.field.pushDeck);
    Object.values(this.duelists).forEach(this.field.shuffleDeck);
    Object.values(this.duelists).forEach(this.field.prepareHands);

    this.moveNextPhase("draw");
  }

  public readonly getTurnPlayer = (): Duelist => {
    return this.turn % 2 === 0 ? this.secondPlayer : this.firstPlayer;
  };
  public readonly getOpponentPlayer = (duelist: Duelist): Duelist => {
    return this.firstPlayer === duelist ? this.secondPlayer : this.firstPlayer;
  };
  public readonly getNonTurnPlayer = (): Duelist => {
    return this.turn % 2 === 0 ? this.firstPlayer : this.secondPlayer;
  };

  public readonly main = async () => {
    console.log("main start!");

    try {
      while (!this.isEnded) {
        if (this.phase === "draw") {
          await this.procDrawPhase();
        } else if (this.phase === "standby") {
          await this.procStanbyPhase();
        } else if (this.phase === "main1") {
          await this.procMainPhase();
        } else if (this.phase === "battle") {
          await this.procBattlePhase();
        } else if (this.phase === "main2") {
          await this.procMainPhase();
        } else if (this.phase === "end") {
          await this.procEndPhase();
        }
        if (this.turn > 1000) {
          break;
        }
      }
    } catch (error) {
      if (error instanceof DuelEnd) {
        console.log(error);
        this.isEnded = true;
        this.log.write(error.winner ? `デュエル終了。勝者${error.winner.profile.name}` : "引き分け");
      } else {
        throw error;
      }
    }
  };

  public readonly moveNextPhase = (next: TDuelPhase) => {
    if (this.turn < 1) {
      this.log.write("【デュエル開始】");
    } else if (next === "draw") {
      this.log.write(`ターン終了。`, this.getTurnPlayer());
    } else {
      this.log.write(`フェイズ移行（${this.phase}→${next}）`, this.getTurnPlayer());
    }
    this.phase = next;
    this.phaseStep = undefined;
    if (this.phase === "main2" || this.turn === 1) {
      this.nextPhaseList = ["end"];
    } else if (this.phase === "battle") {
      this.nextPhaseList = ["main2"];
    } else if (this.phase === "main1") {
      this.nextPhaseList = ["battle", "end"];
    } else {
      this.nextPhaseList = [];
    }
  };

  public readonly moveNextStep = (next: TDuelPhaseStep) => {
    this.phaseStep = next;
  };

  private readonly procDrawPhase = async () => {
    this.turn++;
    this.procKey.turn = this.turn;
    this.procKey.seq = 0;
    this.procKey.chain = 0;
    this.getTurnPlayer().normalSummonCount = 0;
    this.log.write("ドローフェイズ開始。", this.getTurnPlayer());
    if (this.turn === 1) {
      this.log.write("先攻プレイヤーはドローできない。", this.getTurnPlayer());
    } else {
      this.field.draw(this.getTurnPlayer(), 1);
    }
    this.moveNextPhase("standby");
  };
  private readonly procStanbyPhase = async () => {
    this.moveNextPhase("main1");
  };
  private readonly procMainPhase = async () => {
    const action = await this.waitUserAction(
      this.getTurnPlayer(),
      ["Summon", "ChangeBattlePosition", "IgnitionEffect", "QuickEffect"],
      ["Normal", "Quick", "Counter"]
    );
    if (action.action) {
      this.procKey.seq++;
      this.procKey.chain = ([...cardActionChainBlockTypes] as TCardActionType[]).includes(action.action.playType) ? 1 : 0;
      console.log(action.action);
      await action.action.execute(action.cell);
    } else if (action.phaseChange) {
      //todo 優先権
      this.moveNextPhase(action.phaseChange);
      return;
    }
  };
  private readonly procBattlePhase = async () => {
    await this.procBattlePhaseStartStep();
    await this.procBattlePhaseBattleStep();
    await this.procBattlePhaseEndStep();
  };
  private readonly procBattlePhaseStartStep = async () => {
    this.phaseStep = "start";

    const action = await this.waitUserQuickEffect(
      this.getTurnPlayer(),
      ["QuickEffect"],
      ["Normal", "Quick", "Counter"],
      "スタートステップです。効果を発動しますか？"
    );

    //todo クイックエフェクト

    if (!action) {
      return;
    }
  };
  private readonly procBattlePhaseBattleStep = async () => {
    while (true) {
      this.phaseStep = "battle";
      const action = await this.waitUserAction(this.getTurnPlayer(), ["Battle", "QuickEffect"], ["Normal", "Quick", "Counter"]);
      if (action.phaseChange) {
        return;
      }
    }
  };
  private readonly procBattlePhaseEndStep = async () => {
    this.phaseStep = "end";
    //todo 優先権
    this.moveNextPhase("end");
  };
  private readonly procEndPhase = async () => {
    while (true) {
      const hand = this.field.getHandCell(this.getTurnPlayer());
      if (hand.entities.length < 7) {
        break;
      }
      await this.field.discard(this.getTurnPlayer(), hand.entities.length - 6, ["Rule"]);
    }
    this.moveNextPhase("draw");
    return;
  };

  public readonly waitUserSelectEntitiesOnField = async (
    duelist: Duelist,
    entities: DuelEntity[],
    qty: number,
    validator: (selected: DuelEntity[]) => boolean,
    cancelable: boolean, //TODO
    message: string
  ): Promise<DuelEntity[] | undefined> => {
    let selected: DuelEntity[] = [];

    if (duelist.duelistType === "NPC") {
      // NPCはランダムに選択する
      while (!validator(selected)) {
        // 一個も選択しないパターンは最初にチェックするので、それ以外をランダムに試行する。
        const _qty = qty > 0 ? qty : Math.floor(Math.random() * entities.length) + 1;
        selected = entities.randomPick(_qty);
      }
      return selected;
    }

    this.field.getAllEntities().forEach((e) => (e.isSelectable = entities.includes(e)));

    this.waitMode = "EntitiesSelect";
    this.message = message;
    const userAction: DuelistAction = await new Promise<DuelistAction>((resolve) => {
      this.onDuelUpdateEvent.trigger();
      this.onWaitStartEvent.trigger({
        resolve: (tmp) => {
          resolve(tmp);
        },
        entitiesValidator: validator,
      });
    });
    this.waitMode = "None";
    this.onWaitEndEvent.trigger();
    if (userAction.surrender) {
      throw new DuelEnd(this.duelists.Above);
    }
    if (userAction.selectedEntities) {
      return userAction.selectedEntities;
    }
    return;
  };

  private readonly waitUserAction = async (
    priorityHolder: Duelist,
    enableCardPlayTypes: TCardActionType[],
    enableSpellSpeeds: TSpellSpeed[]
  ): Promise<DuelistAction> => {
    const actions = this._prepareUserAction(priorityHolder, enableCardPlayTypes, enableSpellSpeeds);

    if (priorityHolder.duelistType === "NPC") {
      const action = actions.find((act) => act.playType === "Summon");
      return action
        ? { action: action }
        : {
            phaseChange: this.nextPhaseList[0],
          };
    }
    this.message = `あなたの行動順です。`;
    return await this._waitUserAction(priorityHolder, "CardAction");
  };
  public readonly waitUserSubAction = async (duelist: Duelist, enableActions: CardAction[], message: string): Promise<DuelistAction> => {
    this.enableCardPlayTypes.reset();
    this.enableSpellSpeeds.reset();
    this.enableActions.reset(...enableActions);
    this.message = message;
    return await this._waitUserAction(duelist, "SubActionSelect");
  };

  private readonly waitUserQuickEffect = async (
    priorityHolder: Duelist,
    enableCardPlayTypes: TCardActionType[],
    enableSpellSpeeds: TSpellSpeed[],
    title: string
  ): Promise<{ action: CardAction; cell?: DuelFieldCell } | undefined> => {
    const actions = this._prepareUserAction(priorityHolder, enableCardPlayTypes, enableSpellSpeeds);
    if (actions.length === 0) {
      return;
    }
    const promise1 = modalController
      .selectAction(this, {
        title: title,
        actions: actions,
        cancelable: true,
      })
      .then((action) => {
        return action && ({ action: action, cell: undefined } as { action: CardAction; cell?: DuelFieldCell });
      });
    const promise2 = this._waitUserAction(priorityHolder, "SubActionSelect").then((result) => {
      return { action: result.action, cell: result.cell } as { action: CardAction; cell?: DuelFieldCell } | undefined;
    });
    return await Promise.any([promise1, promise2]);
  };

  private readonly _prepareUserAction = (priorityHolder: Duelist, enableCardPlayTypes: TCardActionType[], enableSpellSpeeds: TSpellSpeed[]): CardAction[] => {
    this.priorityHolder = priorityHolder;
    this.enableCardPlayTypes.reset(...enableCardPlayTypes);
    this.enableSpellSpeeds.reset(...enableSpellSpeeds);
    const result = this.field
      .getAllEntities()
      .filter((entity) => entity.controller === priorityHolder)
      .map((entity) => entity.actions)
      .flat()
      .filter((action) => this.enableCardPlayTypes.includes(action.playType))
      .filter((action) => this.enableSpellSpeeds.includes(action.spellSpeed))
      .filter((action) => action.validate());
    this.enableActions.reset(...result);
    return result;
  };

  private readonly _waitUserAction = async (duelist: Duelist, waitMode: TDuelWaitMode): Promise<DuelistAction> => {
    this.waitMode = waitMode;

    const userAction: DuelistAction = await new Promise<DuelistAction>((resolve) => {
      this.onDuelUpdateEvent.trigger();
      this.onWaitStartEvent.trigger({ resolve, entitiesValidator: () => false });
    });

    this.waitMode = "None";
    this.onWaitEndEvent.trigger();
    if (userAction.surrender) {
      throw new DuelEnd(this.duelists.Above);
    }
    return userAction;
  };
}

import { generateCardDefinitions } from "./DuelEntityDefinition";
import { type IDeckInfo } from "@ygo/class/DeckInfo";
import { Duelist, type TDuelistType } from "@ygo_duel/class/Duelist";
import { type IDuelistProfile } from "@ygo/class/DuelistProfile";
import { DuelField } from "./DuelField";
import DuelLog from "@ygo_duel/class/DuelLog";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { DuelViewController } from "@ygo_duel_view/class/DuelViewController";
import { DuelClock } from "./DuelClock";
import DuelChainBlockLog from "./DuelChainBlockLog";
import { type EntityAction, type ChainBlockInfo } from "./DuelEntityAction";
import type { TDuelPhase } from "./DuelPeriod";
import { StkEvent } from "@stk_utils/class/StkEvent";
import type { TBattlePosition } from "@ygo/class/YgoTypes";
import { type DuelFieldCell } from "./DuelFieldCell";
import type { EntityDefinition } from "./DuelEntityDefinition";
import { DuelFacilitatorBase } from "@ygo_duel/class_facilitator/DuelFacilitatorBase";
import { DuelFacilitator_EndPhase } from "@ygo_duel/class_facilitator/DuelFacilitator_EndPhase";
import { DuelEnd } from "@ygo_duel/class_error/DuelError";
import { loadTextData } from "@ygo/class/CardInfo";
export const duelStartModes = ["PlayFirst", "DrawFirst", "Random"] as const;
export type TDuelStartMode = (typeof duelStartModes)[number];
export const duelStartModeDic: { [key in TDuelStartMode]: string } = {
  PlayFirst: "先攻",
  DrawFirst: "後攻",
  Random: "ランダム",
};
export const seats = ["Above", "Below"] as const;
export type TSeat = (typeof seats)[number];

export type ResponseActionInfo = {
  action: EntityAction<unknown>;
  dest?: DuelFieldCell;
  battlePosition?: TBattlePosition;
  originSeq: number;
};

export type DuelistResponse = {
  phaseChange?: TDuelPhase;
  selectedEntities?: DuelEntity[];
  sendMessage?: string;
  actionInfo?: ResponseActionInfo;
  cancel?: boolean;
  surrender?: boolean;
};

export class Duel {
  private readonly onDuelEndEvent = new StkEvent<void>();
  public get onDuelEnd() {
    return this.onDuelEndEvent.expose();
  }
  public readonly view: DuelViewController;
  public readonly log: DuelLog;
  public readonly chainBlockLog: DuelChainBlockLog;
  public field: DuelField;
  public clock: DuelClock;

  public get phase() {
    return this.clock.period.phase;
  }
  public get step() {
    return this.clock.period.step;
  }
  public get stage() {
    return this.clock.period.stage;
  }

  public get nextPhaseList() {
    return this.facilitator.nextPhaseList;
  }
  public get chainBlockInfos() {
    return this.facilitator.chainBlockInfos as Readonly<ChainBlockInfo<unknown>[]>;
  }
  public get attackingMonster() {
    return this.facilitator.attackingMonster;
  }
  public get targetForAttack() {
    return this.facilitator.targetForAttack;
  }
  public readonly duelists: { [key in TSeat]: Duelist };
  public get firstPlayer() {
    return this.coin ? this.duelists.Below : this.duelists.Above;
  }
  public get secondPlayer() {
    return !this.coin ? this.duelists.Below : this.duelists.Above;
  }

  private _facilitator: DuelFacilitatorBase;
  public get facilitator() {
    return this._facilitator;
  }

  public isEnded: boolean;
  public winner: Duelist | undefined;
  public reasonOfEnd: string = "";
  public twitterShareText: string = "";
  private coin = false;
  private readonly startMode: TDuelStartMode;
  public constructor(
    duelist1: IDuelistProfile,
    duelist1Type: TDuelistType,
    deck1: IDeckInfo,
    hand1: string[] = [],
    duelist2: IDuelistProfile,
    duelist2Type: TDuelistType,
    deck2: IDeckInfo,
    hand2: string[] = [],
    startMode: TDuelStartMode = "Random"
  ) {
    this.clock = new DuelClock();
    this.isEnded = false;
    this.startMode = startMode;
    this.duelists = {
      Below: new Duelist(this, "Below", duelist1, duelist1Type, deck1, hand1),
      Above: new Duelist(this, "Above", duelist2, duelist2Type, deck2, hand2),
    };
    this.field = new DuelField(this);
    this.clock.onStageChange.append(this.executeAutomaticPeriodActions);

    this.view = new DuelViewController(this);
    this.log = new DuelLog(this);
    this.chainBlockLog = new DuelChainBlockLog(this);
    this._facilitator = new DuelFacilitator_EndPhase(this);
  }
  public readonly declareAttack = (...args: Parameters<typeof DuelFacilitatorBase.prototype.declareAttack>) => this._facilitator.declareAttack(...args);

  public readonly getTurnPlayer = (): Duelist => {
    return this.clock.turn % 2 === 0 ? this.secondPlayer : this.firstPlayer;
  };
  public readonly getNonTurnPlayer = (): Duelist => {
    return this.clock.turn % 2 === 0 ? this.firstPlayer : this.secondPlayer;
  };

  public readonly main = async () => {
    console.info("main start!");

    this.coin = this.startMode === "PlayFirst" ? true : this.startMode === "DrawFirst" ? false : Math.random() > 0.5;

    const cardDefinitionsDic = (
      await Array.fromAsync(
        generateCardDefinitions(
          ...Object.values(this.duelists)
            .flatMap((duelist) => duelist.deckInfo.cardNames)
            .getDistinct()
        )
      )
    ).reduce(
      (wip, definition) => {
        wip[definition.name] = definition;
        return { ...wip };
      },
      {} as { [name: string]: EntityDefinition }
    );

    for (const duelist of Object.values(this.duelists)) {
      duelist.pushDeck(cardDefinitionsDic);
      duelist.getDeckCell().shuffle();
      if (duelist.initHand.length) {
        duelist.initHand.forEach((name) => {
          const card = duelist.getDeckCell().cardEntities.find((card) => card.origin.name === name);
          if (!card) {
            this.log.info(`初手操作により${name}を手札に加えようとしたが、デッキに存在しない。`);
            return;
          }
          card.addToHand(["System"], undefined, undefined);
          this.log.info(`初手操作により${card.toString()}を手札に加えた`, duelist);
        });
      }
      await duelist.draw(5 - duelist.getHandCell().cardEntities.length, undefined, undefined);
    }

    this.log.info(`【デュエル開始】${this.firstPlayer.profile.name} V.S. ${this.secondPlayer.profile.name}`);
    this.log.info(`先攻：${this.firstPlayer.profile.name} 後攻：${this.secondPlayer.profile.name}`);

    try {
      // エクゾディア判定
      for (const duelist of Object.values(this.duelists)) {
        for (const afterChainBlockEffect of duelist.getEnableActions(["Exodia"], ["Normal"], [])) {
          await afterChainBlockEffect.action.directExecute(duelist, undefined, false);
        }
      }
      while (!this.isEnded) {
        this._facilitator = await this._facilitator.proceed();
        if (this.clock.turn > 1000) {
          break;
        }
      }
    } catch (error) {
      if (error instanceof DuelEnd) {
        this.chainBlockLog.records.forEach((record) => {
          if (record.chainBlockInfo.state === "ready") {
            record.chainBlockInfo.state = "failed";
          } else if (record.chainBlockInfo.state === "processing") {
            record.chainBlockInfo.state = "done";
          }
        });
        await this.clock.incrementChainSeq();
        console.info(error);
        this.isEnded = true;
        this.winner = error.winner;
        this.reasonOfEnd = error.message;
        if (this.winner) {
          const winner = this.winner;
          if (this.winner.duelistType === "Player" && this.winner.getOpponentPlayer().profile.npcType === "FtkChallenge") {
            this.twitterShareText = `ワンターンキル成功！ 使用デッキ：${this.winner.deckInfo.name}`;
            // FtkChallengeでは相手のチェーンブロックに乗る効果はすべて妨害のはず。
            const qty = this.chainBlockLog.records
              .filter((rec) => rec.chainBlockInfo.activator === winner.getOpponentPlayer())
              .filter((rec) => rec.chainBlockInfo.action.entity.owner === winner.getOpponentPlayer())
              .filter((rec) => rec.chainBlockInfo.action.isWithChainBlock).length;
            if (qty) {
              this.twitterShareText += ` 妨害貫通：${qty}枚 我こそそりてあを極めし者なり！`;
            }
          }
        }
        this.log.info(error.winner ? `デュエル終了。勝者${error.winner.profile.name}。${error.message}` : `デュエル終了。引き分け。${error.message}`);
        this.view.requireUpdate();
        this.onDuelEndEvent.trigger();
      } else if (error instanceof Error) {
        console.info(error);
        this.log.error(error);
        console.info(error);
      }
    } finally {
      this.log.dispose();
    }
  };

  private readonly executeAutomaticPeriodActions = async () => {
    let needsIncrementChainSeq = false;
    for (const info of Object.values(this.duelists).flatMap((duelist) =>
      duelist.getEnableActions(["SystemPeriodAction"], ["Normal"], []).map((info) => ({ duelist, ...info }))
    )) {
      needsIncrementChainSeq = true;
      await info.action.directExecute(info.duelist, undefined, false);
    }

    for (const info of [this.getTurnPlayer(), this.getNonTurnPlayer()].flatMap((duelist) =>
      duelist.getEnableActions(["ContinuousPeriodAction"], ["Normal"], []).map((info) => ({ duelist, ...info }))
    )) {
      needsIncrementChainSeq = true;
      await info.action.directExecute(info.duelist, undefined, false);
    }

    if (needsIncrementChainSeq) {
      await this.clock.incrementChainSeq();
    }
  };
}

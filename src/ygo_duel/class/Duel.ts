import DeckInfo from "@ygo/class/DeckInfo";
import Duelist, { type TDuelistType } from "@ygo_duel/class/Duelist";
import DuelistProfile from "@ygo/class/DuelistProfile";
import { DuelField } from "./DuelField";
import DuelLog from "@ygo_duel/class/DuelLog";
import { DuelEntity } from "@ygo_duel/class/DuelEntity";
import {
  cardActionChainBlockTypes,
  cardActionNonChainBlockTypes,
  type CardAction,
  type CardActionWIP,
  type TCardActionType,
  type TSpellSpeed,
} from "@ygo_duel/class/DuelEntity";
import { DuelViewController } from "@ygo_duel_view/class/DuelViewController";
export type ProcKey = { turn: number; seq: number; chain: number };
export type TDuelPhase = "draw" | "standby" | "main1" | "battle" | "main2" | "end";
export type TDuelPhaseStep = "start" | "battle" | "damage" | "end" | undefined;
export const seats = ["Above", "Below"] as const;
export type TSeat = (typeof seats)[number];
export type DuelistAction = {
  phaseChange?: TDuelPhase;
  selectedEntities?: DuelEntity[];
  sendMessage?: string;
  actionWIP?: CardActionWIP<unknown>;
  attack?: [DuelEntity, DuelEntity | undefined];
  cancel?: boolean;
  surrender?: boolean;
  retry?: boolean;
};

export class DuelEnd extends Error {
  public readonly winner: Duelist | undefined;
  public constructor(winner?: Duelist) {
    const message = winner ? `デュエルが終了した。勝者：${winner.profile.name}` : "デュエルが終了した。ドロー。";
    super(message);
    this.winner = winner;
  }
}
export class SystemError extends Error {
  public readonly message: string;
  public readonly items: unknown[];
  public constructor(message: string, ...items: unknown[]) {
    super("message");
    this.message = message;
    this.items = items;
  }
}
export class Duel {
  public readonly view: DuelViewController;
  public readonly log: DuelLog;
  public procKey: ProcKey;
  public turn: number;
  public phase: TDuelPhase;
  public phaseStep: TDuelPhaseStep;
  public nextPhaseList: TDuelPhase[];
  public field: DuelField;
  public attackingMonster: DuelEntity | undefined;
  public targetForAttack: DuelEntity | undefined;
  public readonly duelists: { [key in TSeat]: Duelist };
  public get firstPlayer() {
    return this.coin ? this.duelists.Below : this.duelists.Above;
  }
  public get secondPlayer() {
    return !this.coin ? this.duelists.Below : this.duelists.Above;
  }
  public priorityHolder: Duelist;

  public isEnded: boolean;
  private coin = false;
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
    this.isEnded = false;
    this.duelists = {
      Below: new Duelist(this, "Below", duelist1, duelist1Type, deck1),
      Above: new Duelist(this, "Above", duelist2, duelist2Type, deck2),
    };
    this.priorityHolder = this.firstPlayer;

    this.view = new DuelViewController(this);
    this.field = new DuelField(this);
    this.log = new DuelLog(this);
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

    this.coin = Math.random() > 0.5;

    this.priorityHolder = this.firstPlayer;
    this.log.info("【デュエル開始】");
    this.log.info(`先攻：${this.firstPlayer.profile.name}`);

    Object.values(this.duelists).forEach(this.field.pushDeck);
    Object.values(this.duelists).forEach(this.field.shuffleDeck);
    Object.values(this.duelists).forEach(this.field.prepareHands);

    this.moveNextPhase("draw");

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
        this.log.info(error.winner ? `デュエル終了。勝者${error.winner.profile.name}` : "引き分け");
      } else if (error instanceof Error) {
        this.log.error(error);
      }
    } finally {
      this.view.requireUpdate();
      this.view.dispose();
      this.log.dispose();
    }
  };

  public readonly moveNextPhase = (next: TDuelPhase) => {
    if (this.turn < 1) {
      this.phase = "draw";
    } else if (next === "draw") {
      this.log.info(`ターン終了。`, this.getTurnPlayer());
    } else {
      this.log.info(`フェイズ移行（${this.phase}→${next}）`, this.getTurnPlayer());
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

  public readonly declareAnAttack = (attacker: DuelEntity, defender?: DuelEntity): void => {
    this.attackingMonster = attacker;
    this.targetForAttack = defender;
    attacker.status.attackCount++;
    this.log.info(
      `攻撃宣言：${attacker.status.name} ⇒ ${defender?.status.name || this.getOpponentPlayer(attacker.controller).profile.name}`,
      attacker.controller
    );
  };

  private readonly procDrawPhase = async () => {
    this.turn++;
    this.procKey.turn = this.turn;
    this.procKey.seq = 0;
    this.procKey.chain = 0;
    this.getTurnPlayer().normalSummonCount = 0;
    this.log.info("ドローフェイズ開始。", this.getTurnPlayer());
    if (this.turn === 1) {
      this.log.info("先攻プレイヤーはドローできない。", this.getTurnPlayer());
    } else {
      this.field.draw(this.getTurnPlayer(), 1);
    }
    // TODO フェイズ強制処理
    this.procFreeAction(true);
    this.field.getMonstersOnField().forEach((m) => {
      m.status.attackCount = 0;
      m.status.battlePotisionChangeCount = 0;
    });
    this.moveNextPhase("standby");
  };
  private readonly procStanbyPhase = async () => {
    // TODO フェイズ強制処理

    this.procFreeAction(true);
    this.moveNextPhase("main1");
  };
  private readonly procMainPhase = async () => {
    while (true) {
      this.priorityHolder = this.getTurnPlayer();
      const action = await this.view.waitFieldAction(
        this.getEnableActions(["Summon", "ChangeBattlePosition", "IgnitionEffect", "QuickEffect"], ["Normal", "Quick", "Counter"]),
        "あなたの手番です。"
      );
      if (action.actionWIP) {
        if (([...cardActionNonChainBlockTypes] as string[]).includes(action.actionWIP.playType)) {
          console.log("hoge", action);
          this.procKey.seq++;
          this.procKey.chain = ([...cardActionChainBlockTypes] as TCardActionType[]).includes(action.actionWIP.playType) ? 1 : 0;
          await action.actionWIP.execute(action.actionWIP.cell);
          this.procFreeAction(true);
        } else {
          this.procChain(action.actionWIP);
          this.procFreeAction(true);
        }
        continue;
      }

      const nextPhase = action.phaseChange;
      // フェイズ移行前に、相手に優先権が移る。
      if (nextPhase) {
        this.priorityHolder = this.getNonTurnPlayer();
        const action = await this.view.waitQuickEffect(this.getEnableActions(["QuickEffect", "TriggerEffect"], ["Quick", "Counter"]), "", true);

        // 相手が行動した場合、フェイズ移行はキャンセル。
        if (action) {
          this.procChain(action);
          continue;
        }
        this.moveNextPhase(nextPhase);
        return;
      }
    }
  };
  private readonly procBattlePhase = async () => {
    await this.procBattlePhaseStartStep();
    await this.procBattlePhaseBattleStep();
    await this.procBattlePhaseEndStep();
  };
  private readonly procBattlePhaseStartStep = async () => {
    this.phaseStep = "start";
    this.priorityHolder = this.getTurnPlayer();

    this.attackingMonster = undefined;
    this.targetForAttack = undefined;

    // TODO ステップ強制処理
    this.procFreeAction(true);
  };
  private readonly procBattlePhaseBattleStep = async () => {
    while (true) {
      this.phaseStep = "battle";
      this.priorityHolder = this.getTurnPlayer();
      const action = await this.view.waitFieldAction(this.getEnableActions(["Battle"], ["Normal"]), "攻撃モンスターと対象を選択。");
      if (action.phaseChange) {
        return;
      }
      if (action.actionWIP) {
        await action.actionWIP.execute(action.actionWIP.cell);
        await this.procFreeAction(true);
        await this.procBattlePhaseDamageStep();
      }
    }
  };
  private readonly procBattlePhaseDamageStep = async () => {
    this.phaseStep = "damage";
    const attacker = this.attackingMonster;
    const defender = this.targetForAttack;

    if (!attacker || !attacker.status.attack) {
      throw new SystemError("想定されない状態", this.attackingMonster, this.targetForAttack);
    }

    //ダメージステップ開始時
    this.log.info("ダメージステップ開始時", this.getTurnPlayer());
    //TODO エフェクト処理

    //ダメージ計算前
    this.log.info("ダメージ計算前", this.getTurnPlayer());
    if (defender?.battlePotion === "Set") {
      defender.setBattlePosition("Defense");
    }
    //TODO エフェクト処理

    //ダメージ計算時
    this.log.info("ダメージ計算時", this.getTurnPlayer());
    //TODO エフェクト処理

    //ダメージ計算
    const atkPoint = attacker.status.attack;
    const defPoint = (defender?.battlePotion === "Attack" ? defender.status.attack : defender?.status.defense) || 0;
    if (!defender) {
      this.getOpponentPlayer(attacker.controller).battleDamage(atkPoint - defPoint, attacker);
    } else if (atkPoint > 0 && atkPoint > defPoint) {
      if (defender.battlePotion === "Attack") {
        this.getOpponentPlayer(attacker.controller).battleDamage(attacker.status.attack - defPoint, attacker);
      }
      this.field.destroyMany([defender], ["Battle"], attacker);
    } else if (defender && atkPoint < defPoint) {
      // 絶対防御将軍などを考慮
      if (attacker.battlePotion === "Attack") {
        attacker.controller.battleDamage(defPoint - attacker.status.attack, defender);
      }
      if (defender.battlePotion === "Attack") {
        this.field.destroyMany([attacker], ["Battle"], defender);
      }
    }

    const losers = Object.values(this.duelists).filter((duelist) => duelist.lp <= 0);

    if (losers.length > 0) {
      throw new DuelEnd(
        Object.values(this.duelists)
          .filter((duelist) => !losers.includes(duelist))
          .pop()
      );
    }

    //ダメージ計算後
    this.log.info("ダメージ計算後", this.getTurnPlayer());
    //TODO エフェクト処理

    //ダメージステップ終了時
    this.log.info("ダメージステップ終了時", this.getTurnPlayer());
    //TODO エフェクト処理
  };
  private readonly procBattlePhaseEndStep = async () => {
    this.phaseStep = "end";
    this.priorityHolder = this.getTurnPlayer();

    // TODO ステップ強制処理
    this.procFreeAction(true);
    this.moveNextPhase("main2");
  };
  private readonly procEndPhase = async () => {
    // TODO フェイズ強制処理
    this.procFreeAction(true);
    while (true) {
      const hand = this.field.getHandCell(this.getTurnPlayer());
      if (hand.entities.length < 7) {
        break;
      }
      await this.field.discard(this.getTurnPlayer(), hand.entities.length - 6, ["Rule"]);
      // TODO トリガー効果のみ発動可能
    }

    // このタイミングではフリーチェーンを発動できない。

    this.moveNextPhase("draw");
    return;
  };
  private readonly procFreeAction = async (loop: boolean) => {
    while (loop) {
      // 優先権はターンプレイヤーが行動する限り持ち続ける。
      this.priorityHolder = this.getTurnPlayer();
      while (loop) {
        const action = await this.view.waitQuickEffect(
          this.getEnableActions(["QuickEffect"], ["Normal", "Quick", "Counter"]),
          "クイックエフェクト発動タイミング。効果を発動しますか？",
          true
        );
        if (!action) {
          break;
        }
        await this.procChain(action);
        if (!loop) {
          return;
        }
      }

      // ターンプレイヤーが優先権を放棄したときのみ、非ターンプレイヤーが優先権を持つ。
      this.priorityHolder = this.getNonTurnPlayer();
      const action = await this.view.waitQuickEffect(
        this.getEnableActions(["QuickEffect"], ["Normal", "Quick", "Counter"]),
        "クイックエフェクト発動タイミング。効果を発動しますか？",
        true
      );

      // どちらのプレイヤーも行動しなかった場合、次のステップへ。
      if (!action) {
        break;
      }

      await this.procChain(action);
    }
  };

  private readonly procChain = async (action: CardActionWIP<unknown>) => {
    this.stackTriggerEffects();
    console.log(action);

    this.procKey.seq++;
    this.procKey.chain = 0;
    //TODO チェーン処理
    throw new SystemError("Not implemented");
  };

  private readonly stackTriggerEffects = async (): Promise<void> => {
    //両方のプレイヤーの誘発効果を収集する。
    const triggerEffects: CardAction<unknown>[] = Object.values(this.duelists).flatMap((duelist) => {
      this.priorityHolder = duelist;
      return this.getEnableActions(["TriggerMandatoryEffect", "TriggerEffect"], ["Normal"]);
    });

    // 誘発効果の処理順に従ってチェーンブロックを積み上げる。
    for (const triggerType of ["TriggerMandatoryEffect", "TriggerEffect"] as TCardActionType[]) {
      for (const duelist of [this.getTurnPlayer(), this.getNonTurnPlayer()]) {
        // 誘発効果を抽出
        this.priorityHolder = duelist;
        const effects = triggerEffects.filter((effect) => effect.playType === triggerType && effect.entity.controller === duelist);

        // なくなるまでループ
        while (effects.length > 0) {
          // 強制効果が残り１の場合、選択をスキップ
          if (effects.length === 1 && triggerType === "TriggerMandatoryEffect") {
            const effect = effects[0] as CardActionWIP<unknown>;
            this.addChainStack(effect);
            break;
          }
          // 任意効果の場合、スキップ可能
          const effect = await this.view.waitQuickEffect(effects, "効果を選択。", triggerType === "TriggerEffect");
          if (!effect) {
            continue;
          }

          // 抽出配列から削除してもう一回 ※seqでないと一致比較できない
          effects.filter((e) => e.seq !== e.seq);
          this.addChainStack(effect);
        }
      }
      continue;
    }
  };

  private readonly addChainStack = async (action: CardActionWIP<unknown>) => {
    console.log(action);

    //TODO チェーン処理

    this.procKey.chain++;
    throw new SystemError("Not implemented");
  };

  private readonly getEnableActions = (enableCardPlayTypes: TCardActionType[], enableSpellSpeeds: TSpellSpeed[]): CardAction<unknown>[] => {
    return this.field
      .getAllEntities()
      .filter((entity) => entity.controller === this.priorityHolder)
      .map((entity) => entity.actions)
      .flat()
      .filter((action) => enableCardPlayTypes.includes(action.playType))
      .filter((action) => enableSpellSpeeds.includes(action.spellSpeed))
      .filter((action) => action.validate());
  };
}

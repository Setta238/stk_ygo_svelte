import { isNameTypeFusionMaterialInfo, type EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { IllegalCancelError, DuelError, IllegalActionError } from "@ygo_duel/class_error/DuelError";

import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";
import { StatusOperator } from "@ygo_duel/class_continuous_effect/DuelStatusOperator";
export default function* generate(): Generator<EntityProcDefinition> {
  yield {
    name: "Ｅ・ＨＥＲＯ プリズマー",
    actions: [
      {
        title: "リフレクト・チェンジ",
        isMandatory: false,
        playType: "IgnitionEffect",
        spellSpeed: "Normal",
        executableCells: ["MonsterZone"],
        executablePeriods: ["main1", "main2"],
        executableDuelistTypes: ["Controller"],
        executableFaces: ["FaceUp"],
        isOnlyNTimesPerTurnIfFaceup: 1,
        needsToPayRegularCost: true,
        canPayCosts: (myInfo) => {
          const names = myInfo.activator
            .getExtraDeck()
            .cardEntities.flatMap((monster) => monster.fusionMaterialInfos)
            .filter(isNameTypeFusionMaterialInfo)
            .map((info) => info.cardName)
            .getDistinct();

          return myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => names.includes(card.nm))
            .some((card) => card.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, "SendToGraveyardAsCost", myInfo.action));
        },
        canExecute: (myInfo) => myInfo.action.entity.face === "FaceUp",
        payCosts: async (myInfo, chainBlockInfos, cancelable) => {
          const names = myInfo.activator
            .getExtraDeck()
            .cardEntities.flatMap((monster) => monster.fusionMaterialInfos)
            .filter(isNameTypeFusionMaterialInfo)
            .map((info) => info.cardName)
            .getDistinct();
          const choices = myInfo.activator
            .getDeckCell()
            .cardEntities.filter((card) => names.includes(card.nm))
            .filter((card) => card.canBeSentToGraveyard(myInfo.activator, myInfo.action.entity, "SendToGraveyardAsCost", myInfo.action));
          if (choices.length === 0) {
            throw new IllegalActionError("UnexpectedSituation", myInfo);
          }

          const cost = await myInfo.activator.waitSelectEntity(choices, "墓地に送るモンスターを選択", cancelable);
          if (!cost) {
            if (!cancelable) {
              throw new IllegalCancelError(myInfo);
            }
            return;
          }

          const fusionMonsters = myInfo.activator
            .getExtraDeck()
            .cardEntities.filter((monster) => monster.fusionMaterialInfos.filter(isNameTypeFusionMaterialInfo).some((info) => info.cardName === cost.nm));

          const fusionMonster = await myInfo.activator.waitSelectEntity(fusionMonsters, "公開するモンスターを選択", cancelable);

          if (!fusionMonster) {
            throw new IllegalActionError("UnexpectedSituation", myInfo);
          }

          myInfo.activator.writeInfoLog(`公開：${fusionMonster.toString()}`);
          const costInfo = { cost, cell: cost.cell };
          await cost.sendToGraveyard(["Effect"], myInfo.action.entity, myInfo.activator);
          myInfo.activator.getDeckCell().shuffle();
          return { sendToGraveyard: [costInfo] };
        },
        prepare: defaultPrepare,
        execute: async (myInfo) => {
          const costInfos = myInfo.costInfo.sendToGraveyard;
          if (!costInfos || !costInfos.length) {
            throw new IllegalActionError("IllegalActionCost", myInfo);
          }
          const cost = costInfos[0].cost;
          myInfo.action.entity.statusOperatorBundle.push(
            new StatusOperator({
              title: myInfo.action.title,
              validateAlive: (ope) => ope.duel.clock.isSameTurn(ope.isSpawnedAt),
              isContinuous: false,
              isSpawnedBy: myInfo.action.entity,
              actionAttr: myInfo.action,
              isApplicableTo: (ope, target) => target.isOnFieldAsMonsterStrictly && target.face === "FaceUp",
              statusCalculator: () => {
                return { name: cost.origin.name };
              },
            })
          );
          return true;
        },
        settle: async () => true,
      },
    ],
  };
}

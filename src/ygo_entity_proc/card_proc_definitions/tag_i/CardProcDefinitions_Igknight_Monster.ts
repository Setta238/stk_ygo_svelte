import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { defaultContinuousSpellCardActivateAction } from "../../card_actions/CardActions_Spell";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
export default function* generate(): Generator<EntityProcDefinition> {
  yield* [
    "イグナイト・イーグル",
    "イグナイト・マグナム",
    "イグナイト・ドラグノフ",
    "イグナイト・マスケット",
    "イグナイト・デリンジャー",
    "イグナイト・ライオット",
    "イグナイト・ウージー",
    "イグナイト・キャリバー",
  ].map((name): EntityProcDefinition => {
    return {
      name: name,
      actions: [
        defaultContinuousSpellCardActivateAction,
        {
          title: "①サーチ",
          isMandatory: false,
          playType: "IgnitionEffect",
          spellSpeed: "Normal",
          executableCells: ["SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          executableFaces: ["FaceUp"],
          fixedTags: ["Destroy", "DestroyMultiple", "DestroyMultipleOnField", "DestroySpellTrapOnField", "DestroySpellTrapsOnField"],
          meetsConditions: (myInfo) => {
            const theOther = myInfo.activator.getPendulumScaleMonsters().find((ps) => ps !== myInfo.action.entity);

            if (!theOther) {
              return false;
            }

            if (!theOther.status.nameTags?.includes("イグナイト")) {
              return false;
            }
            return true;
          },
          canExecute: (myInfo) => myInfo.activator.getDeckCell().cardEntities.some((card) => card.status.nameTags?.includes("イグナイト")),
          prepare: async (myInfo) => {
            return {
              selectedEntities: [],
              chainBlockTags: ["SearchFromDeck", ...myInfo.action.calcChainBlockTagsForDestroy(myInfo.activator, myInfo.activator.getPendulumScaleMonsters())],
              prepared: undefined,
            };
          },
          execute: async (myInfo) => {
            const destroyed = await DuelEntityShortHands.tryDestroy(myInfo.activator.getPendulumScaleMonsters(), myInfo);

            if (!destroyed.length) {
              return false;
            }

            const choices = myInfo.activator.getDeckCell().cardEntities.filter((card) => card.status.nameTags?.includes("イグナイト"));

            if (!choices.length) {
              return false;
            }

            const seleceted = await myInfo.activator.waitSelectEntity(choices, "手札に加えるカードを選択。", false);

            if (!seleceted) {
              return false;
            }

            await seleceted.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);

            return true;
          },
          settle: async () => true,
        },
      ],
    };
  });
}

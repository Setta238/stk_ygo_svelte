import { IllegalCancelError } from "@ygo_duel/class/Duel";
import { type CardActionDefinition } from "@ygo_duel/class/DuelEntityAction";
import { defaultPrepare } from "@ygo_entity_proc/card_actions/CardActions";

const commonFallenOfAlbazSpellTrapSalvageActionCash: { [titlePrefix: string]: CardActionDefinition<unknown> } = {};

export const getCommonFallenOfAlbazSpellTrapSalvageAction = (titlePrefix: string): CardActionDefinition<unknown> => {
  if (!commonFallenOfAlbazSpellTrapSalvageActionCash[titlePrefix]) {
    commonFallenOfAlbazSpellTrapSalvageActionCash[titlePrefix] = {
      title: `${titlePrefix}自己セット`,
      isMandatory: false,
      playType: "IgnitionEffect",
      spellSpeed: "Normal",
      executableCells: ["Graveyard"],
      executablePeriods: ["end"],
      executableDuelistTypes: ["Controller"],
      executableFaces: ["FaceUp"],
      isOnlyNTimesPerTurn: 1,
      isNoticedForcibly: true,
      meetsConditions: (myInfo) => {
        const record = myInfo.action.entity.moveLog.latestRecord;
        if (!record.movedAs.includes("Cost")) {
          return false;
        }
        if (record.movedBy?.nm !== "アルバスの落胤") {
          return false;
        }
        if (!myInfo.activator.duel.clock.isSameTurn(record.movedAt)) {
          return false;
        }
        return true;
      },
      canExecute: (myInfo) => {
        if (!myInfo.activator.getAvailableSpellTrapZones().length) {
          return false;
        }
        return myInfo.activator.canSet;
      },
      prepare: defaultPrepare,
      execute: async (myInfo) => {
        if (myInfo.action.entity.wasMovedAfter(myInfo.isActivatedAt)) {
          return false;
        }
        const cells = myInfo.activator.getAvailableSpellTrapZones();
        if (!cells.length) {
          return false;
        }

        if (!myInfo.activator.canSet) {
          return false;
        }

        const cell = await myInfo.activator.duel.view.waitSelectDestination(
          myInfo.activator,
          myInfo.action.entity,
          cells,
          "セットする場所を選択。",
          "セット",
          false
        );
        if (!cell) {
          throw new IllegalCancelError("配置場所選択", myInfo);
        }

        await myInfo.action.entity.setAsSpellTrap(cell, myInfo.action.entity.origin.kind, ["Effect"], myInfo.action.entity, myInfo.activator);
        return true;
      },
      settle: async () => true,
    };
  }
  return commonFallenOfAlbazSpellTrapSalvageActionCash[titlePrefix];
};

import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CardActions_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { DuelEntityShortHands } from "@ygo_duel/class/DuelEntityShortHands";
import type { DuelEntity } from "@ygo_duel/class/DuelEntity";
import { getSingleTargetActionPartical } from "@ygo_entity_proc/card_actions/CardActions";
import { IllegalActionError } from "@ygo_duel/class_error/DuelError";

export default function* generate(): Generator<EntityProcDefinition> {
  const props: { name: string; filter: (card: DuelEntity) => boolean; discard: boolean }[] = [
    { name: "魔法石の採掘", filter: () => true, discard: true },
    { name: "魔法再生", filter: (card) => card.kind === "Spell", discard: false },
  ];
  for (const item of props) {
    yield {
      name: item.name,
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          fixedTags: ["AddToHandFromGraveyard"],
          canPayCosts: (myInfo) => myInfo.activator.getHandCell().cardEntities.filter(item.filter).length > 1,
          payCosts: async (myInfo, chainBlockInfos, cancelable) => {
            const cards = myInfo.activator.getHandCell().cardEntities.filter(item.filter);
            const costs = await myInfo.activator.waitSelectEntities(cards, 2, (selected) => selected.length === 2, "コストとするカードを選択", cancelable);
            if (!costs) {
              return;
            }

            const costInfo = costs.map((cost) => ({ cost, cell: cost.cell }));

            if (item.discard) {
              await DuelEntityShortHands.discardManyForTheSameReason(costs, ["Cost"], myInfo.action.entity, myInfo.activator);
              return { discard: costInfo };
            }

            await DuelEntityShortHands.sendManyToGraveyardForTheSameReason(costs, ["Cost"], myInfo.action.entity, myInfo.activator);
            return { sendToGraveyard: costInfo };
          },
          ...getSingleTargetActionPartical((myInfo) => myInfo.activator.getGraveyard().cardEntities.filter((card) => card.kind === "Spell"), {
            message: "手札に加える魔法カードを選択",
          }),
          execute: async (myInfo) => {
            if (!myInfo.selectedEntities.length) {
              throw new IllegalActionError("UnexpectedSituation", myInfo);
            }

            const target = myInfo.selectedEntities[0];

            if (target.wasMovedAfter(myInfo.isActivatedAt)) {
              return false;
            }

            await target.addToHand(["Effect"], myInfo.action.entity, myInfo.activator);
            return true;
          },
          settle: async () => true,
        },
        defaultSpellTrapSetAction,
      ],
    };
  }
}

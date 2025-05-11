import { defaultSpellTrapSetAction } from "@ygo_entity_proc/card_actions/CommonCardAction_Spell";

import type { EntityProcDefinition } from "@ygo_duel/class/DuelEntityDefinition";
import { getDefaultRitualSummonActionPartical } from "@ygo_entity_proc/card_actions/CommonCardAction_RitualSpell";

export default function* generate(): Generator<EntityProcDefinition> {
  for (const item of [
    { spellName: "カオスの儀式", monsterName: "カオス・ソルジャー" },
    { spellName: "仮面魔獣の儀式", monsterName: "仮面魔獣マスクド・ヘルレイザー" },
    { spellName: "亀の誓い", monsterName: "クラブ・タートル" },
    { spellName: "ジャベリンビートルの契約", monsterName: "ジャベリンビートル" },
    { spellName: "ゼラの儀式", monsterName: "ゼラ" },
    { spellName: "カオス－黒魔術の儀式", monsterName: "マジシャン・オブ・ブラックカオス" },
    { spellName: "ガルマソードの誓い", monsterName: "ガルマソード" },
    { spellName: "ライオンの儀式", monsterName: "スーパー・ウォー・ライオン" },
    { spellName: "チャクラの復活", monsterName: "チャクラ" },
    { spellName: "要塞クジラの誓い", monsterName: "要塞クジラ" },
    { spellName: "ローの祈り", monsterName: "ローガーディアン" },
    { spellName: "スカルライダーの復活", monsterName: "スカルライダー" },
    { spellName: "踊りによる誘発", monsterName: "ダンシング・ソルジャー" },
    { spellName: "悪魔鏡の儀式", monsterName: "デビルズ・ミラー" },
    { spellName: "ハンバーガーのレシピ", monsterName: "ハングリーバーガー" },
  ]) {
    yield {
      name: item.spellName,
      actions: [
        {
          title: "発動",
          isMandatory: false,
          playType: "CardActivation",
          spellSpeed: "Normal",
          executableCells: ["Hand", "SpellAndTrapZone"],
          executablePeriods: ["main1", "main2"],
          executableDuelistTypes: ["Controller"],
          ...getDefaultRitualSummonActionPartical(
            ["Hand"],
            (monster) => monster.nm === item.monsterName,
            ["Hand", "MonsterZone", "ExtraMonsterZone"],
            () => true,
            "OrMore"
          ),
        },
        defaultSpellTrapSetAction,
      ],
    };
  }
}

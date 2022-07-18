UPDATE pure_colo_skill_names
SET
    skill_type = newVals.skill_type
FROM (
    VALUES 
    ('号令ハ疾風ノ加護トナル', 'wind buff'), -- Gale blessing, wind buff
    ('囁キハ流水ノ加護トナル', 'water buff'), -- Aqueous blessing, water buff
    ('怒号ハ炎熱ノ加護トナル', 'fire buff'), -- Combustive blessing, fire buff
    ('警鐘ハ散華ノ飛沫ヲ呼ブ', 'water bell'), -- For whom the bell splashes, water bell
    ('警鐘ハ散華ノ風ヲ呼ブ', 'wind bell'), -- Bell sounds a storm, wind bell
    ('警鐘ハ散華ノ火花ヲ呼ブ', 'fire bell'), -- The bell souds a wildfire, fire bell
    ('ハローキティのスキル', 'fire buff'), -- Hello Kitty's skill, fire buff
    ('マイメロディのスキル', 'fire bell'), -- My melody's skill, unique variant of fire bell effect
    ('警鐘ﾊ散華ﾉ火花ｦ呼ﾌﾞ', 'fire bell'), -- Unknown EN name, Fire bell effect
    ('警鐘ﾊ散華ﾉ風ｦ呼ﾌﾞ', 'wind bell'), -- Unknown EN name, Wind bell effect
    ('警鐘ﾊ散華ﾉ飛沫ｦ呼ﾌﾞ', 'water bell'), -- Unknown EN name, Water bell effect
    ('偽リハ堅牢ナ鎧トナル', 'pdef only buff'), -- false robustness
    ('偽リハ鋭利ナ刃トナル', 'patk only buff'), -- false blade
    ('唱歌ハ必勝ノ刃トナル', 'double atk buff'), -- victorious melody
    ('偽リハ武具ヲ破壊スル', 'patk only debuff'), -- smash the fake weapon
    ('偽リハ鎧ヲ破壊スル', 'pdef only debuff'), -- false destruction
    ('唱歌ハ忠義ノ刃トナル', 'double atk buff'), -- song of camaraderie
    ('唱歌ハ裏切リノ刃トナル', 'double atk buff'), -- song of betrayal
    ('怨嗟ハ刃ヲ脆ク鈍ラセル', 'double atk debuff'), -- begrudging blade
    ('怨嗟ハ剣ヲ脆ク鈍ラセル', 'double atk debuff'), --begrudging sword
    ('慟哭ハ砦ヲ縛ル枷トナル', 'double def debuff'), -- fort of lamentation
    ('慟哭ハ鎧ヲ縛ル枷トナル', 'double def debuff'), -- armour of lamentation
    ('祝福ハ堅固ナ鎧トナル', 'double def buff'), -- blessed armour
    ('祝福ハ強固ナ鎧トナル', 'double def buff'), -- enchanted armour
    ('真実ハ魔術ノ贄トナル', 'matk only buff'), -- sacrifice of truth
    ('真実ハ魔壁ヲ破壊スル', 'mdef only debuff'), -- destruction of truth
    ('真実ハ魔術ヲ打チ消ス', 'matk only debuff'), -- negating truth
    ('慟哭ハ砦ヲ縛ル枷トナル', 'double def debuff'), -- fort of lamentation
    ('真実ハ魔壁ノ贄トナル', 'mdef only buff'), -- wall sacrifice
    ('祝福ハ堅牢ナ鎧トナル', 'double def buff'), -- blessed fort
    ('ポチャッコのスキル', 'double def buff'), -- pochaco's skill
    ('氾濫スル浄化ハ命ニ集ウ', 'heal to lf conversion'), -- daphne's skill
    ('クロミのコロシアムスキル', 'heal to lf conversion'), -- kuromi's skill
    ('シナモロールのスキル', 'inc. blade effect'), -- cinnamoroll's skill
    ('鼓舞ハ剣戟ノ加護トナル', 'inc. blade effect'), -- insight is a boon in swordplay
    ('水精ハ魔力ヲ供給スル', 'water sp reduce'), -- tidal fairy magic
    ('水精ハ魔力ヲ掌握スル', 'water sp reduce'), -- tidal fairy master
    ('炎精ハ魔力ヲ供給スル', 'fire sp reduce'), -- infernal fairy magic
    ('炎精ハ魔力ヲ掌握スル', 'fire sp reduce'), -- infernal fairy master
    ('風精ハ魔力ヲ供給スル', 'wind sp reduce'), -- zephyr fairy magic
    ('風精ハ魔力ヲ掌握スル', 'wind sp reduce') -- zephyr fairy master
) AS newVals (jp_colo_skill_name, skill_type)
WHERE pure_colo_skill_names.jp_colo_skill_name = newVals.jp_colo_skill_name;
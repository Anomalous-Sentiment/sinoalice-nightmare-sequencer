INSERT INTO skill_tag_relations (sub_tag_id, art_unique_id)
VALUES
    (2, 1090), -- False robustness, pdef buff
    (0, 1086), -- False blade, patk buff
    (0, 4), -- Victorious melody, patk buff
    (1, 4), -- Victorious melody, matk buff
    (19, 1095), -- Smash the fake weapon, patk debuff
    (21, 1099), -- False destruction, pdef debuff
    (27, 18), -- Engulfing shout, reduce fire
    (26, 3), -- Gale blessing, wind buff
    (28, 22), -- Cry of the damned, reduce water
    (29, 15), -- Soothing command, reduce wind
    (16, 17), -- Defiant roar, disadvantage
    -- (0, 4), -- Song of camaraderie, patk buff (Should be included in victorious melody id)
    --(1, '唱歌ハ忠義ノ刃トナル'), -- Song of camaraderie, matk buff (same reason as above)
    (0, 1111), -- Song of betrayal, patk buff
    (1, 1111), -- Song of betrayal, matk buff
    (18, 20), -- Hindering wail, support skill rate down
    (25, 2), -- Aqueous blessing, water buff
    (4, 11), -- Fairy king magic, reduce sp
    (24, 1), -- Combustive blessing, fire buff
    (19, 8), -- Begrudging blade, patk reduce
    (20, 8), -- Begrudging blade, matk reduce
    (19, 1113), -- Begrudging sword, patk reduce
    (20, 1113), -- Begrudging sword, matk reduce
    (21, 1114), -- Fort of lamentation, pdef reduce
    (22, 1114), -- Fort of lamentation, mdef reduce
    (21, 31), -- Armor of lamentation, pdef reduce
    (22, 31), -- Armor of lamentation, mdef reduce
    (45, 1125), -- Rematch at the last bell/shield, gear reset
    (46, 1124), -- Rematch at the last bell/spear, gear reset
    (45, 40), -- Smoke signals a rechallenge, gear reset
    (46, 40), -- Smoke signals a rechallenge, gear reset
    (17, 12), -- Uplifting chant, support skill rate up
    (31, 7), -- Tidal fairy magic, sp reduce
    --(31, 7), -- Tidal fairy master, sp reduce
    (30, 6), -- Infernal fairy magic, sp reduce
    (2, 5), -- Blessed armour, pdef buff
    (3, 5), -- Blessed armour, mdef buff
    (32, 9), -- Zephyr fairy magic, sp reduce
    --(2, 5), -- Enchanted armor, pdef buff
    --(3, 5), -- Enchanted armor, mdef buff
    (42, 1067), -- World of silence, instru wep effect down
    -- (30, 6), -- Infernal fairy master, sp reduce
    --(32, '風精ハ魔力ヲ掌握スル'), -- Zephyr fairy mastery (master)?, sp reduce
    (41, 1068), -- World of ignorance, tome wep effect reduce
    (40, 1069), -- World of order, staff wep effect reduce
    (10, 1082), -- For whom the bell splashes, water bell
    (34, 1074), -- Reversal magic, sp recover
    (1, 1088), -- Sacrifice of truth, matk buff
    (35, 1075), -- Magic order, sp recover
    (11, 1084), -- Bell sounds a storm, wind bell
    (36, 1103), -- Rejecting the slash, blade hammer reduce
    (37, 1103), -- Rejecting the slash, blade hammer reduce
    (22, 1101), -- Destruction of truth, mdef reduce
    (20, 1097), -- Negating truth, matk reduce
    (38, 1104), -- Rejecting the charge, reduce range, polearm
    (39, 1104), -- Rejecting the charge, reduce range, polearm
    (9, 1080), -- The bell souds a wildfire, fire bell
    (21, 1114), -- Fort of lamentation, pdef reduce
    (22, 1114), -- Fort of lamentation, mdef reduce
    (33, 1078), -- Magical torrent, all sp recover
    (3, 1092), -- Wall sacrifice, mdef buff
--    (0, '聖霊ハ逆刻ノ鐘ヲ鳴ラス'), -- Spiritual reverse, other?
    (2, 1112), -- Blessed fort, pdef up
    (3, 1112), -- Blessed fort, mdef up
--    (0, '祖ハ順刻ノ魔笛ヲ鳴ラス'), -- Magic flute's whistle, other?
    (44, 1065), -- Order is a boon in gunplay, increase ranged effectiveness
    (43, 1063) -- Insight is a boon in swordplay, increase blade effectiveness
--    (0, '魔鏡ハ敵手ヲ影写スル'), -- Malice mirrored, other?
    --(36, '黒キ魔獣ハ憎悪ニ吼エル'), -- Roar of the black mabeat's hatred, reduce blade & hammer effect
    --(37, '黒キ魔獣ハ憎悪ニ吼エル'), -- Roar of the black mabeat's hatred, reduce blade & hammer effect
--    (0, '紫煙ハ瞬刻ヲ告ゲル'), -- Haze heralds the moment, other?
--    (0, '黒煙ハ鈍重ナ呪縛トナル'); -- Smoke-dulled malediction, other?
    --(24, 'ハローキティのスキル'), -- Hello Kitty's skill, fire buff
    --(2, 'ポチャッコのスキル'), -- Pochaco's skill, pdef buff
    --(3, 'ポチャッコのスキル'), -- Pochaco's skill, mdef buff
    --(33, 'ポムポムプリンのスキル'), -- Pompom Purin's skill, sp recover
    --(9, 'マイメロディのスキル'), -- My melody's skill, unique variant of bell effect
--    (0, 'クロミのコロシアムスキル'), -- Kuromi's skill, Same as daphne, converts heals to lf
    --(43, 'シナモロールのスキル'), -- Cinnamoroll's skill, increase blade effectiveness
    --(9, '警鐘ﾊ散華ﾉ火花ｦ呼ﾌﾞ'), -- Unknown EN name, Fire bell effect
    --(11, '警鐘ﾊ散華ﾉ風ｦ呼ﾌﾞ'), -- Unknown EN name, Wind bell effect
    --(10, '警鐘ﾊ散華ﾉ飛沫ｦ呼ﾌﾞ') -- Unknown EN name, Water bell effect
ON CONFLICT (sub_tag_id, art_unique_id) DO NOTHING;


UPDATE pure_colo_skills
SET
    skill_type = newVals.skill_type
FROM (
    VALUES 
    (3, 'wind buff'), -- Gale blessing, wind buff
    (2, 'water buff'), -- Aqueous blessing, water buff
    (1, 'fire buff'), -- Combustive blessing, fire buff
    (1082, 'water bell'), -- For whom the bell splashes, water bell
    (1084, 'wind bell'), -- Bell sounds a storm, wind bell
    (1080, 'fire bell'), -- The bell souds a wildfire, fire bell
    --('ハローキティのスキル', 'fire buff'), -- Hello Kitty's skill, fire buff
    --('マイメロディのスキル', 'fire bell'), -- My melody's skill, unique variant of fire bell effect
    --('警鐘ﾊ散華ﾉ火花ｦ呼ﾌﾞ', 'fire bell'), -- Unknown EN name, Fire bell effect
    --('警鐘ﾊ散華ﾉ風ｦ呼ﾌﾞ', 'wind bell'), -- Unknown EN name, Wind bell effect
    --('警鐘ﾊ散華ﾉ飛沫ｦ呼ﾌﾞ', 'water bell'), -- Unknown EN name, Water bell effect
    (1090, 'pdef only buff'), -- false robustness
    (1086, 'patk only buff'), -- false blade
    (4, 'double atk buff'), -- victorious melody
    (1095, 'patk only debuff'), -- smash the fake weapon
    (1099, 'pdef only debuff'), -- false destruction
    --(4, 'double atk buff'), -- song of camaraderie
    (1111, 'double atk buff'), -- song of betrayal
    (8, 'double atk debuff'), -- begrudging blade
    (1113, 'double atk debuff'), --begrudging sword
    (1114, 'double def debuff'), -- fort of lamentation
    (31, 'double def debuff'), -- armour of lamentation
    (5, 'double def buff'), -- blessed armour
    (5, 'double def buff'), -- enchanted armour
    (1088, 'matk only buff'), -- sacrifice of truth
    (1101, 'mdef only debuff'), -- destruction of truth
    (1097, 'matk only debuff'), -- negating truth
    (1114, 'double def debuff'), -- fort of lamentation
    (1092, 'mdef only buff'), -- wall sacrifice
    (1112, 'double def buff'), -- blessed fort
    --('ポチャッコのスキル', 'double def buff'), -- pochaco's skill
    --('氾濫スル浄化ハ命ニ集ウ', 'heal to lf conversion'), -- daphne's skill
    --('クロミのコロシアムスキル', 'heal to lf conversion'), -- kuromi's skill
    --('シナモロールのスキル', 'inc. blade effect'), -- cinnamoroll's skill
    --('鼓舞ハ剣戟ノ加護トナル', 'inc. blade effect'), -- insight is a boon in swordplay
    (7, 'water sp reduce'), -- tidal fairy magic
    --(7, 'water sp reduce'), -- tidal fairy master
    (6, 'fire sp reduce'), -- infernal fairy magic
    --(6, 'fire sp reduce'), -- infernal fairy master
    (9, 'wind sp reduce') -- zephyr fairy magic
    --('風精ハ魔力ヲ掌握スル', 'wind sp reduce') -- zephyr fairy master
) AS newVals (art_unique_id, skill_type)
WHERE pure_colo_skills.art_unique_id = newVals.art_unique_id;

UPDATE pure_colo_skills
SET
    active_colour = newVals.active_colour
FROM (
    VALUES
    (18, '#750000'), -- Engulfing shout, reduce fire
    (3, '#32CD32'), -- Gale blessing, wind buff
    (22, '#000075'), -- Cry of the damned, reduce water
    (15, '#175E17'), -- Soothing command, reduce wind
    (2, '#0000FF'), -- Aqueous blessing, water buff
    (1, '#FF0000'), -- Combustive blessing, fire buff
    (7, '#8A8AFF'), -- Tidal fairy magic, sp reduce
    --(7, '#8A8AFF'), -- Tidal fairy master, sp reduce
    (6, '#FF8A8A'), -- Infernal fairy magic, sp reduce
    (9, '#A1E8A1'), -- Zephyr fairy magic, sp reduce
    (6, '#FF8A8A'), -- Infernal fairy master, sp reduce
    --('風精ハ魔力ヲ掌握スル', '#A1E8A1'), -- Zephyr fairy mastery (master)?, sp reduce
    (1082, '#0000FF'), -- For whom the bell splashes, water bell
    (1084, '#32CD32'), -- Bell sounds a storm, wind bell
    (1080, '#FF0000') -- The bell souds a wildfire, fire bell
    --('ハローキティのスキル', '#FF0000'), -- Hello Kitty's skill, fire buff
    --('マイメロディのスキル', '#FF0000'), -- My melody's skill, unique variant of fire bell effect
    --('警鐘ﾊ散華ﾉ火花ｦ呼ﾌﾞ', '#FF0000'), -- Unknown EN name, Fire bell effect
    --('警鐘ﾊ散華ﾉ風ｦ呼ﾌﾞ', '#32CD32'), -- Unknown EN name, Wind bell effect
    --('警鐘ﾊ散華ﾉ飛沫ｦ呼ﾌﾞ', '#0000FF') -- Unknown EN name, Water bell effect
) AS newVals (art_unique_id, active_colour)
WHERE pure_colo_skills.art_unique_id = newVals.art_unique_id;
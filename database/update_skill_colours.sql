UPDATE pure_colo_skill_names
SET
    active_colour = newVals.active_colour
FROM (
    VALUES
    ('叫声ハ炎熱ノ壁トナル', '#750000'), -- Engulfing shout, reduce fire
    ('号令ハ疾風ノ加護トナル', '#32CD32'), -- Gale blessing, wind buff
    ('呟キハ流水ノ壁トナル', '#000075'), -- Cry of the damned, reduce water
    ('命令ハ疾風ノ壁トナル', '#175E17'), -- Soothing command, reduce wind
    ('囁キハ流水ノ加護トナル', '#0000FF'), -- Aqueous blessing, water buff
    ('怒号ハ炎熱ノ加護トナル', '#FF0000'), -- Combustive blessing, fire buff
    ('水精ハ魔力ヲ供給スル', '#8A8AFF'), -- Tidal fairy magic, sp reduce
    ('水精ハ魔力ヲ掌握スル', '#8A8AFF'), -- Tidal fairy master, sp reduce
    ('炎精ハ魔力ヲ供給スル', '#FF8A8A'), -- Infernal fairy magic, sp reduce
    ('風精ハ魔力ヲ供給スル', '#A1E8A1'), -- Zephyr fairy magic, sp reduce
    ('炎精ハ魔力ヲ掌握スル', '#FF8A8A'), -- Infernal fairy master, sp reduce
    ('風精ハ魔力ヲ掌握スル', '#A1E8A1'), -- Zephyr fairy mastery (master)?, sp reduce
    ('警鐘ハ散華ノ飛沫ヲ呼ブ', '#0000FF'), -- For whom the bell splashes, water bell
    ('警鐘ハ散華ノ風ヲ呼ブ', '#32CD32'), -- Bell sounds a storm, wind bell
    ('警鐘ハ散華ノ火花ヲ呼ブ', '#FF0000'), -- The bell souds a wildfire, fire bell
    ('ハローキティのスキル', '#FF0000'), -- Hello Kitty's skill, fire buff
    ('マイメロディのスキル', '#FF0000'), -- My melody's skill, unique variant of fire bell effect
    ('警鐘ﾊ散華ﾉ火花ｦ呼ﾌﾞ', '#FF0000'), -- Unknown EN name, Fire bell effect
    ('警鐘ﾊ散華ﾉ風ｦ呼ﾌﾞ', '#32CD32'), -- Unknown EN name, Wind bell effect
    ('警鐘ﾊ散華ﾉ飛沫ｦ呼ﾌﾞ', '#0000FF') -- Unknown EN name, Water bell effect
) AS newVals (jp_colo_skill_name, active_colour)
WHERE pure_colo_skill_names.jp_colo_skill_name = newVals.jp_colo_skill_name;
/*
ON CONFLICT (jp_colo_skill_name) 
    DO UPDATE SET active_colour = EXCLUDED.active_colour, en_colo_skill_name = prev.en_colo_skill_name;

UPDATE pure_colo_skill_names
SET active_colour = '#750000'
WHERE jp_colo_skill_name = '叫声ハ炎熱ノ壁トナル';

UPDATE pure_colo_skill_names
SET active_colour = '#32CD32'
WHERE jp_colo_skill_name = '号令ハ疾風ノ加護トナル' OR jp_colo_skill_name = '警鐘ハ散華ノ風ヲ呼ブ' OR jp_colo_skill_name = '警鐘ﾊ散華ﾉ風ｦ呼ﾌﾞ';

UPDATE pure_colo_skill_names
SET active_colour = '#000075'
WHERE jp_colo_skill_name = '呟キハ流水ノ壁トナル';

UPDATE pure_colo_skill_names
SET active_colour = '#175E17'
WHERE jp_colo_skill_name = '命令ハ疾風ノ壁トナル';

UPDATE pure_colo_skill_names
SET active_colour = '#0000FF'
WHERE jp_colo_skill_name = '囁キハ流水ノ加護トナル' OR jp_colo_skill_name = '警鐘ハ散華ノ飛沫ヲ呼ブ' OR jp_colo_skill_name = '警鐘ﾊ散華ﾉ飛沫ｦ呼ﾌﾞ';

UPDATE pure_colo_skill_names
SET active_colour = '#FF0000'
WHERE jp_colo_skill_name = '怒号ハ炎熱ノ加護トナル' OR jp_colo_skill_name = '警鐘ハ散華ノ火花ヲ呼ブ' OR jp_colo_skill_name = 'ハローキティのスキル' OR jp_colo_skill_name = 'マイメロディのスキル' OR jp_colo_skill_name = '警鐘ﾊ散華ﾉ火花ｦ呼ﾌﾞ';


UPDATE pure_colo_skill_names
SET active_colour = '#8A8AFF'
WHERE jp_colo_skill_name = '水精ハ魔力ヲ供給スル' OR jp_colo_skill_name = '水精ハ魔力ヲ掌握スル';

UPDATE pure_colo_skill_names
SET active_colour = '#FF8A8A'
WHERE jp_colo_skill_name = '水精ハ魔力ヲ供給スル' OR jp_colo_skill_name = '水精ハ魔力ヲ掌握スル';
*/
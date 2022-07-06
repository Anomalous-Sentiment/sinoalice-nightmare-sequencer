
-- Initialise element_attributes table
INSERT INTO element_attributes (attribute_id, attribute)
VALUES
    (1, 'Fire'),
    (2, 'Water'),
    (3, 'Wind')
ON CONFLICT (attribute_id) DO NOTHING;


-- Initialise rarities table
INSERT INTO rarities (rarity_id, rarity)
VALUES
    (3, 'A'),
    (4, 'S'),
    (5, 'SS/SR'),
    (6, 'L')
ON CONFLICT (rarity_id) DO NOTHING;

-- Initialise tags table. If conflict, update the tag name and description
INSERT INTO major_categories (major_tag_id, major_tag, description)
VALUES
    (0, 'Buff', 'Buffs or increases one or more stats'),
    (1, 'Debuff', 'Debuffs or decreases one or more stats'),
    (2, 'Elemental Buff', 'Increases effectiveness of weapons of a specified element'),
    (3, 'Elemental Debuff', 'Decreases effectiveness of weapons of a specified element'),
    (4, 'Elemental Bell', 'Increases element effectiveness and increases damage from opposing element'),
    (5, 'Support Skill Rate Up', 'Increases activation rate of colosseum support skills'),
    (6, 'Support Skill Rate Down', 'Decreases activation rate of colosseum support skills'),
    (7, 'Gear Reset', 'Increases number of times players can change gear sets'),
    (8, 'SP Recovery', 'Recovers SP'),
    (9, 'SP Reduction', 'Reduces SP usage'),
    (10, 'Increase Weapon Effect', 'Increases effectiveness of a weapon type'),
    (11, 'Reduce Weapon Effect', 'Decreases effectiveness of a weapon type'),
    (12, 'Disadvantage', 'Effective only when at a disadvantage')
ON CONFLICT (major_tag_id) 
    DO UPDATE SET major_tag = EXCLUDED.major_tag, description = EXCLUDED.description;

-- Initialise tags table. If conflict, update the tag name and description
INSERT INTO sub_categories (sub_tag_id, major_tag_id, sub_tag, description)
VALUES
    (0, 0, 'P.Atk Buff', 'Buffs or increases physical attack'),
    (1, 0, 'M.Atk Buff', 'Buffs or increases magical attack'),
    (2, 0, 'P.Def Buff', 'Buffs or increases physical defense'),
    (3, 0, 'M.Def Buff', 'Buffs or increases magical defense'),
    (4, 9, '-', ''),
    (5, 8, '-', ''),
    (6, 0, '-', ''),
    (7, 1, '-', ''),
    (8, 4, '-', ''),
    (9, 4, 'Fire Bell', 'Increases fire weapon effectiveness and increases damage received from water weapons'),
    (10, 4, 'Water Bell', 'Increases water weapon effectiveness and increases damage received from wind weapons'),
    (11, 4, 'Wind Bell', 'Increases wind weapon effectiveness and increases damage received from fire weapons'),
    (12, 11, '-', ''),
    (13, 10, '-', ''),
    (14, 2, '-', ''),
    (15, 3, '-', ''),
    (16, 12, 'Disadvantage', 'Effective only when at a disadvantage'),
    (17, 5, 'Support Skill Rate Up', 'Increases activation rate of colosseum support skills'),
    (18, 6, 'Support Skill Rate Down', 'Decreases activation rate of colosseum support skills'),
    (19, 1, 'P.Atk Debuff', 'Debuffs or decreases physical attack'),
    (20, 1, 'M.Atk Debuff', 'Debuffs or decreases magical attack'),
    (21, 1, 'P.Def Debuff', 'Debuffs or decreases physical defense'),
    (22, 1, 'M.Def Debuff', 'Debuffs or decreases magical defense'),
    (23, 7, '-', ''),
    (24, 2, 'Fire Buff', 'Increases fire weapon effectiveness'),
    (25, 2, 'Water Buff', 'Increases water weapon effectiveness'),
    (26, 2, 'Wind Buff', 'Increases wind weapon effectiveness'),
    (27, 3, 'Fire Debuff', 'Decreases fire weapon effectiveness'),
    (28, 3, 'Water Debuff', 'Decreases water weapon effectiveness'),
    (29, 3, 'Wind Debuff', 'Decreases wind weapon effectiveness'),
    (30, 9, 'Fire SP Reduction', 'Reduces Fire SP usage'),
    (31, 9, 'Water SP Reduction', 'Reduces Water SP usage'),
    (32, 9, 'Wind SP Reduction', 'Reduces Wind SP usage'),
    (33, 8, 'All SP Recover', 'Recovers all allies SP'),
    (34, 8, 'Support SP Recovery', 'Recovers SP for support classes'),
    (35, 8, 'Vanguard SP Recovery', 'Recovers SP for vanguard classes'),
    (36, 11, 'Reduce Blade Effect', 'Decreases effectiveness of blade weapons'),
    (37, 11, 'Reduce Hammer Effect', 'Decreases effectiveness of hammer weapons'),
    (38, 11, 'Reduce Ranged Effect', 'Decreases effectiveness of a ranged weapons'),
    (39, 11, 'Reduce Polearm Effect', 'Decreases effectiveness of a polearm weapons'),
    (40, 11, 'Reduce Staff Effect', 'Decreases effectiveness of a staff weapons'),
    (41, 11, 'Reduce Tome Effect', 'Decreases effectiveness of a tome weapons'),
    (42, 11, 'Reduce Instrument Effect', 'Decreases effectiveness of a instrument weapons'),
    (43, 10, 'Increase Blade Effect', 'Increases effectiveness of blade weapons'),
    (44, 10, 'Increase Ranged Effect', 'Increases effectiveness of a ranged weapons'),
    (45, 7, 'Support Gear Reset', 'Resets number of times supports can change gear sets'),
    (46, 7, 'Vanguard Gear Reset', 'Resets number of times vanguards can change gear sets')
ON CONFLICT (sub_tag_id) 
    DO UPDATE SET major_tag_id = EXCLUDED.major_tag_id, sub_tag = EXCLUDED.sub_tag, description = EXCLUDED.description;


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
INSERT INTO tags (tag_id, tag, description)
VALUES
    (0, 'P.Atk Buff', 'Buffs or increases physical attack'),
    (1, 'M.Atk Buff', 'Buffs or increases magical attack'),
    (2, 'P.Def Buff', 'Buffs or increases physical defense'),
    (3, 'M.Def Buff', 'Buffs or increases magical defense'),
    (4, 'SP Reduction', 'Reduces SP usage'),
    (5, 'SP Recovery', 'Recovers SP'),
    (6, 'Buff', 'Buffs or increases one or more stats'),
    (7, 'Debuff', 'Debuffs or decreases one or more stats'),
    (8, 'Elemental Bell', 'Increases element effectiveness and increases damage from opposing element'),
    (9, 'Fire Bell', 'Increases fire weapon effectiveness and increases damage received from water weapons'),
    (10, 'Water Bell', 'Increases water weapon effectiveness and increases damage received from wind weapons'),
    (11, 'Wind Bell', 'Increases wind weapon effectiveness and increases damage received from fire weapons'),
    (12, 'Reduce Weapon Effect', 'Decreases effectiveness of a weapon type'),
    (13, 'Increase Weapon Effect', 'Increases effectiveness of a weapon type'),
    (14, 'Elemental Buff', 'Increases effectiveness of weapons of a specified element'),
    (15, 'Elemental Debuff', 'Decreases effectiveness of weapons of a specified element'),
    (16, 'Disadvantage', 'Effective only when at a disadvantage'),
    (17, 'Support Skill Rate Up', 'Increases activation rate of colosseum support skills'),
    (18, 'Support Skill Rate Down', 'Decreases activation rate of colosseum support skills'),
    (19, 'P.Atk Debuff', 'Debuffs or decreases physical attack'),
    (20, 'M.Atk Debuff', 'Debuffs or decreases magical attack'),
    (21, 'P.Def Debuff', 'Debuffs or decreases physical defense'),
    (22, 'M.Def Debuff', 'Debuffs or decreases magical defense'),
    (23, 'Gear Reset', 'Increases number of times players can change gear sets'),
    (24, 'Fire Buff', 'Increases fire weapon effectiveness'),
    (25, 'Water Buff', 'Increases water weapon effectiveness'),
    (26, 'Wind Buff', 'Increases wind weapon effectiveness'),
    (27, 'Fire Debuff', 'Decreases fire weapon effectiveness'),
    (28, 'Water Debuff', 'Decreases water weapon effectiveness'),
    (29, 'Wind Debuff', 'Decreases wind weapon effectiveness')
ON CONFLICT (tag_id) 
    DO UPDATE SET tag = EXCLUDED.tag, description = EXCLUDED.description;


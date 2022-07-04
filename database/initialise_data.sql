
-- Initialise element_attributes table
INSERT INTO element_attributes (attribute_id, attribute)
VALUES
    (1, 'Fire'),
    (2, 'Water'),
    (3, 'Wind');

-- Initialise rarities table
INSERT INTO rarities (rarity_id, rarity)
VALUES
    (3, 'A'),
    (4, 'S'),
    (5, 'SS/SR'),
    (6, 'L');

-- Initialise tags table
INSERT INTO tags (tag_id, tag, description)
VALUES
    (0, 'P.Atk Buff', 'Buffs or increases physical attack'),
    (1, 'M.Atk Buff', 'Buffs or increases magical attack'),
    (2, 'P.Def Buff', 'Buffs or increases physical defense'),
    (3, 'M.Def Buff', 'Buffs or increases magical defense'),
    (4, 'P.Def Buff', 'Buffs or increases physical defense'),
    (5, 'SP Reduction', 'Reduces SP usage'),
    (6, 'SP Recovery', 'Recovers SP'),
    (7, 'Buff', 'Buffs or increases one or more stats'),
    (8, 'Debuff', 'Debuffs or decreases one or more stats'),
    (9, 'Elemental Bell', 'Increases element effectiveness and increases damage from opposing element'),
    (10, 'Fire Bell', 'Increases fire weapon effectiveness and increases damage received from water weapons'),
    (11, 'Water Bell', 'Increases water weapon effectiveness and increases damage received from wind weapons'),
    (12, 'Wind Bell', 'Increases wind weapon effectiveness and increases damage received from fire weapons'),
    (13, 'Reduce Weapon Effect', 'Decreases effectiveness of a weapon type'),
    (14, 'Increase Weapon Effect', 'Increases effectiveness of a weapon type'),
    (15, 'Elemental Buff', 'Increases effectiveness of weapons of a specified element'),
    (16, 'Elemental Debuff', 'Decreases effectiveness of weapons of a specified element'),
    (17, 'Disadvantage', 'Effective only when at a disadvantage'),
    (18, 'Support Skill Rate Up', 'Increases activation rate of colosseum support skills'),
    (19, 'Support Skill Rate Down', 'Decreases activation rate of colosseum support skills');

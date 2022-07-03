
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
INSERT INTO tags (tag, description)
VALUES
    ('P.Atk Buff', 'Buffs or increases physical attack'),
    ('M.Atk Buff', 'Buffs or increases magical attack'),
    ('M.Def Buff', 'Buffs or increases magical defense'),
    ('P.Def Buff', 'Buffs or increases physica defense');

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
    ('test', 'test description'),
    ('test2', 'test2 description');
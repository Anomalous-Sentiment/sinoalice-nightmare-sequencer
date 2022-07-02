SET TIMEZONE ='Etc/GMT+8';  

DROP TABLE IF EXISTS pure_colo_skill_names;
CREATE TABLE pure_colo_skill_names
(
    jp_colo_skill_name varchar,
    en_colo_skill_name varchar,
    UNIQUE (en_colo_skill_name),
    PRIMARY KEY (jp_colo_skill_name)
);

DROP TABLE IF EXISTS element_attributes;
CREATE TABLE element_attributes
(
    attribute_id SMALLINT,
    attribute VARCHAR,
    PRIMARY KEY (attribute_id)
);

DROP TABLE IF EXISTS tags;
CREATE TABLE tags
(
    tag VARCHAR,
    description VARCHAR,
    PRIMARY KEY (tag)
);

DROP TABLE IF EXISTS ranks;
CREATE TABLE ranks
(
    jp_rank VARCHAR,
    en_rank VARCHAR,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Etc/GMT+8'),
    PRIMARY KEY (jp_rank)
);

DROP TABLE IF EXISTS rarities;
CREATE TABLE rarities
(
    rarity_id SMALLINT,
    rarity VARCHAR,
    PRIMARY KEY (rarity_id)
);

DROP TABLE IF EXISTS colosseum_skills;
CREATE TABLE colosseum_skills
(
    jp_colo_skill_name VARCHAR,
    jp_colo_skill_desc TEXT,
    prep_time SMALLINT,
    effective_time SMALLINT,
    jp_rank VARCHAR,
    en_colo_skill_desc TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Etc/GMT+8'),
    CONSTRAINT fk_jp_skill_name
        FOREIGN KEY (jp_colo_skill_name) REFERENCES pure_colo_skill_names (jp_colo_skill_name),
    CONSTRAINT fk_skill_rank
        FOREIGN KEY (jp_rank) REFERENCES ranks (jp_rank),
    PRIMARY KEY (jp_colo_skill_name, jp_rank)
);


DROP TABLE IF EXISTS nightmares;
CREATE TABLE nightmares
(
    jp_name VARCHAR,
    en_name VARCHAR,
    jp_icon_url TEXT,
    en_icon_url TEXT,
    jp_colo_skill_name VARCHAR,
    jp_rank varchar,
    attribute_id SMALLINT,
    rarity_id SMALLINT,
    colo_sp SMALLINT,
    global BOOLEAN,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Etc/GMT+8'),
    CONSTRAINT fk_nightmare_skill
        FOREIGN KEY (jp_colo_skill_name, jp_rank) REFERENCES colosseum_skills (jp_colo_skill_name, jp_rank),
    CONSTRAINT fk_nightmare_attribute
        FOREIGN KEY (attribute_id) REFERENCES element_attributes (attribute_id),
    CONSTRAINT fk_nightmare_rarity
        FOREIGN KEY (rarity_id) REFERENCES rarities (rarity_id),
    PRIMARY KEY (jp_name, rarity_id)
);

DROP TABLE IF EXISTS nightmare_tag_relations;
CREATE TABLE nightmare_tag_relations
(
    tag VARCHAR,
    jp_name VARCHAR,
    rarity_id SMALLINT,
    CONSTRAINT fk_nightmare_relation_tag
        FOREIGN KEY (tag) REFERENCES tags (tag),
    CONSTRAINT fk_nightmare_relation_nightmare
        FOREIGN KEY (jp_name, rarity_id) REFERENCES nightmares (jp_name, rarity_id),
    PRIMARY KEY (tag, jp_name, rarity_id)
);

DROP TABLE IF EXISTS skill_tag_relations;
CREATE TABLE skill_tag_relations
(
    tag VARCHAR,
    en_colo_skill_name VARCHAR,
    CONSTRAINT fk_skill_relation_tag
        FOREIGN KEY (tag) REFERENCES tags (tag),
    CONSTRAINT fk_skill_relation_skill
        FOREIGN KEY (en_colo_skill_name) REFERENCES pure_colo_skill_names (en_colo_skill_name),
    PRIMARY KEY (tag, en_colo_skill_name)
);

SET TIMEZONE ='Etc/GMT+8';  

DROP TABLE IF EXISTS skill_groups;
CREATE TABLE skill_groups
(
  skill_type VARCHAR NOT NULL,
  PRIMARY KEY (skill_type)
);

DROP TABLE IF EXISTS pure_colo_skill_names;
CREATE TABLE pure_colo_skill_names
(
    art_unique_id INTEGER NOT NULL,
    active_colour VARCHAR DEFAULT '#f598f2' NOT NULL,
    skill_type VARCHAR NOT NULL DEFAULT 'unique',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Etc/GMT+8'),
    CONSTRAINT fk_skill_type
        FOREIGN KEY (skill_type) REFERENCES skill_groups (skill_type),
    PRIMARY KEY (art_unique_id)
);

DROP TABLE IF EXISTS element_attributes;
CREATE TABLE element_attributes
(
    attribute_id SMALLINT NOT NULL,
    attribute VARCHAR NOT NULL,
    PRIMARY KEY (attribute_id)
);

DROP TABLE IF EXISTS general_categories;
CREATE TABLE general_categories
(
    general_tag_id SMALLINT NOT NULL,
    general_tag VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    PRIMARY KEY (general_tag_id)
);

DROP TABLE IF EXISTS major_categories;
CREATE TABLE major_categories
(
    major_tag_id SMALLINT NOT NULL,
    general_tag_id SMALLINT NOT NULL,
    major_tag VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    CONSTRAINT fk_general_tag
        FOREIGN KEY (general_tag_id) REFERENCES general_categories (general_tag_id),
    PRIMARY KEY (major_tag_id)
);

DROP TABLE IF EXISTS sub_categories;
CREATE TABLE sub_categories
(
    sub_tag_id SMALLINT NOT NULL,
    major_tag_id SMALLINT NOT NULL,
    sub_tag VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    CONSTRAINT fk_major_tag
        FOREIGN KEY (major_tag_id) REFERENCES major_categories (major_tag_id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (sub_tag_id)
);

DROP TABLE IF EXISTS ranks;
CREATE TABLE ranks
(
    jp_rank VARCHAR NOT NULL,
    en_rank VARCHAR NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Etc/GMT+8'),
    PRIMARY KEY (jp_rank)
);

DROP TABLE IF EXISTS rarities;
CREATE TABLE rarities
(
    rarity_id SMALLINT NOT NULL,
    rarity VARCHAR NOT NULL,
    PRIMARY KEY (rarity_id)
);

DROP TABLE IF EXISTS colosseum_skills;
CREATE TABLE colosseum_skills
(
    art_mst_id INTEGER NOT NULL,
    art_unique_id INTEGER NOT NULL,
    jp_colo_skill_name VARCHAR NOT NULL,
    en_colo_skill_name VARCHAR NOT NULL,
    jp_colo_skill_desc TEXT NOT NULL,
    prep_time SMALLINT NOT NULL,
    effective_time SMALLINT NOT NULL,
    jp_rank VARCHAR NOT NULL,
    en_colo_skill_desc TEXT NOT NULL,
    colo_sp SMALLINT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Etc/GMT+8'),
    CONSTRAINT fk_jp_skill_name
        FOREIGN KEY (art_unique_id) REFERENCES pure_colo_skill_names (art_unique_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_skill_rank
        FOREIGN KEY (jp_rank) REFERENCES ranks (jp_rank) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (art_mst_id)
);


DROP TABLE IF EXISTS nightmares;
CREATE TABLE nightmares
(
    card_mst_id INTEGER NOT NULL,
    art_mst_id INTEGER NOT NULL,
    jp_name VARCHAR NOT NULL,
    en_name VARCHAR NOT NULL,
    jp_icon_url TEXT NOT NULL,
    en_icon_url TEXT NOT NULL,
    jp_rank varchar NOT NULL,
    attribute_id SMALLINT NOT NULL,
    rarity_id SMALLINT NOT NULL,
    global BOOLEAN NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Etc/GMT+8'),
    CONSTRAINT fk_nightmare_skill
        FOREIGN KEY (art_mst_id) REFERENCES colosseum_skills (art_mst_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_nightmare_attribute
        FOREIGN KEY (attribute_id) REFERENCES element_attributes (attribute_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_nightmare_rarity
        FOREIGN KEY (rarity_id) REFERENCES rarities (rarity_id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (card_mst_id)
);

DROP TABLE IF EXISTS skill_tag_relations;
CREATE TABLE skill_tag_relations
(
    sub_tag_id SMALLINT NOT NULL,
    art_unique_id INTEGER NOT NULL,
    CONSTRAINT fk_skill_relation_tag
        FOREIGN KEY (sub_tag_id) REFERENCES sub_categories (sub_tag_id),
    CONSTRAINT fk_skill_relation_skill  
        FOREIGN KEY (art_unique_id) REFERENCES pure_colo_skill_names (art_unique_id),
    PRIMARY KEY (sub_tag_id, art_unique_id)
);

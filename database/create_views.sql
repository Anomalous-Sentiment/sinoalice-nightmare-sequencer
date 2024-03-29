
DROP VIEW IF EXISTS allJpnightmaredetails;
-- Same as above, joining all tables to see applied tags, but also include non-taggged nightmares and have tag if instead of tag name
CREATE OR REPLACE VIEW allJpNightmareDetails AS
    SELECT nm.card_mst_id, pure_skills.art_unique_id, nm.nm_name, nm.icon_url, nm.rarity_id, attr.attribute_id, skills.skill_name, skills.skill_desc, pure_skills.active_colour, skills.prep_time, skills.effective_time, pure_skills.skill_type, ARRAY_REMOVE(ARRAY_AGG (tagTable.sub_tag), NULL) applied_tags, ARRAY_REMOVE(ARRAY_AGG (DISTINCT major.major_tag), NULL) major_tags, ARRAY_REMOVE(ARRAY_AGG(gen.general_tag), NULL) general_tags
    FROM jp_nightmares nm
    INNER JOIN element_attributes attr USING (attribute_id)
    INNER JOIN jp_colo_skills skills USING (art_mst_id)
    INNER JOIN pure_colo_skills pure_skills USING (art_unique_id)
    LEFT JOIN skill_tag_relations tagRel USING (art_unique_id)
    LEFT JOIN sub_categories tagTable USING (sub_tag_id)
    LEFT JOIN major_categories major USING (major_tag_id)
    LEFT JOIN general_categories gen USING (general_tag_id)
    GROUP BY nm.card_mst_id, pure_skills.art_unique_id, nm.nm_name, nm.icon_url, nm.rarity_id, attr.attribute_id, skills.art_mst_id, skills.jp_rank, tagRel.art_unique_id, pure_skills.active_colour, pure_skills.skill_type;
    
DROP VIEW IF EXISTS allEnnightmaredetails;
-- Same as above, joining all tables to see applied tags, but also include non-taggged nightmares and have tag if instead of tag name
CREATE OR REPLACE VIEW allEnNightmareDetails AS
    SELECT nm.card_mst_id, pure_skills.art_unique_id, nm.nm_name, nm.icon_url, nm.rarity_id, attr.attribute_id, skills.skill_name, skills.skill_desc, pure_skills.active_colour, skills.prep_time, skills.effective_time, pure_skills.skill_type, ARRAY_REMOVE(ARRAY_AGG (tagTable.sub_tag), NULL) applied_tags, ARRAY_REMOVE(ARRAY_AGG (DISTINCT major.major_tag), NULL) major_tags, ARRAY_REMOVE(ARRAY_AGG(gen.general_tag), NULL) general_tags
    FROM en_nightmares nm
    INNER JOIN element_attributes attr USING (attribute_id)
    INNER JOIN en_colo_skills skills USING (art_mst_id)
    INNER JOIN pure_colo_skills pure_skills USING (art_unique_id)
    LEFT JOIN skill_tag_relations tagRel USING (art_unique_id)
    LEFT JOIN sub_categories tagTable USING (sub_tag_id)
    LEFT JOIN major_categories major USING (major_tag_id)
    LEFT JOIN general_categories gen USING (general_tag_id)
    GROUP BY nm.card_mst_id, pure_skills.art_unique_id, nm.nm_name, nm.icon_url, nm.rarity_id, attr.attribute_id, skills.art_mst_id, skills.jp_rank, tagRel.art_unique_id, pure_skills.active_colour, pure_skills.skill_type;
     

DROP VIEW IF EXISTS major_sub_relationships;
-- View for getting all sub tags associated with a major tag
CREATE VIEW major_sub_relationships AS
    SELECT mj.major_tag_id, mj.major_tag, mj.description, gen.general_tag, ARRAY_REMOVE(ARRAY_AGG(sb.sub_tag), NULL) sub_tags
    FROM major_categories mj 
    LEFT JOIN sub_categories sb USING (major_tag_id)
    LEFT JOIN general_categories gen USING (general_tag_id)
    GROUP BY mj.major_tag_id, gen.general_tag;

DROP VIEW IF EXISTS general_major_relationships;
-- View for getting all major tags associated with a general tag
CREATE VIEW general_major_relationships AS
    SELECT gen.general_tag_id, gen.general_tag, gen.description, ARRAY_REMOVE(ARRAY_AGG(mj.major_tag), NULL) major_tags
    FROM general_categories gen 
    LEFT JOIN major_categories mj USING (general_tag_id)
    GROUP BY gen.general_tag_id;
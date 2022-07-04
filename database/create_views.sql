DROP VIEW IF EXISTS nightmareswithtags;

-- Join tables to see nightmares that have tags applied to them, and aggregate all tags in the applied_tags column of view
CREATE OR REPLACE VIEW nightmaresWithTags AS
    SELECT nm.jp_name, nm.en_name, nm.jp_icon_url, nm.en_icon_url, attr.attribute, pure_skills.jp_colo_skill_name, combined_skills.jp_colo_skill_desc, pure_skills.en_colo_skill_name,combined_skills.en_colo_skill_desc, rk.jp_rank, rk.en_rank, nm.global, ARRAY_AGG (tagTable.tag) applied_tags
    FROM nightmares nm
    INNER JOIN rarities rare USING (rarity_id)
    INNER JOIN element_attributes attr USING (attribute_id)
    INNER JOIN colosseum_skills combined_skills USING (jp_colo_skill_name, jp_rank)
    INNER JOIN ranks rk USING (jp_rank)
    INNER JOIN pure_colo_skill_names pure_skills USING (jp_colo_skill_name)
    INNER JOIN skill_tag_relations tagRel USING (jp_colo_skill_name)
    INNER JOIN tags tagTable USING (tag_id)
    GROUP BY nm.jp_name, nm.rarity_id, attr.attribute_id, combined_skills.jp_colo_skill_name, combined_skills.jp_rank, pure_skills.jp_colo_skill_name, rk.jp_rank, tagRel.jp_colo_skill_name;

DROP VIEW IF EXISTS allnightmaredetails;
-- Same as above, joining all tables to see applied tags, but also include non-taggged nightmares and have tag if instead of tag name
CREATE OR REPLACE VIEW allNightmareDetails AS
    SELECT nm.jp_name, nm.en_name, nm.jp_icon_url, nm.en_icon_url, attr.attribute, pure_skills.jp_colo_skill_name, combined_skills.jp_colo_skill_desc, pure_skills.en_colo_skill_name,combined_skills.en_colo_skill_desc, rk.jp_rank, rk.en_rank, combined_skills.prep_time, combined_skills.effective_time, nm.global, ARRAY_REMOVE(ARRAY_AGG (tagTable.tag), NULL) applied_tags
    FROM nightmares nm
    INNER JOIN rarities rare USING (rarity_id)
    INNER JOIN element_attributes attr USING (attribute_id)
    INNER JOIN colosseum_skills combined_skills USING (jp_colo_skill_name, jp_rank)
    INNER JOIN ranks rk USING (jp_rank)
    INNER JOIN pure_colo_skill_names pure_skills USING (jp_colo_skill_name)
    LEFT JOIN skill_tag_relations tagRel USING (jp_colo_skill_name)
    LEFT JOIN tags tagTable USING (tag_id)
    GROUP BY nm.jp_name, nm.rarity_id, attr.attribute_id, combined_skills.jp_colo_skill_name, combined_skills.jp_rank, pure_skills.jp_colo_skill_name, rk.jp_rank, tagRel.jp_colo_skill_name;

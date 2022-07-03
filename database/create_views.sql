CREATE OR REPLACE VIEW nightmaresWithTags AS
    SELECT nm.jp_name, nm.en_name, nm.jp_icon_url, nm.en_icon_url, attr.attribute, pure_skills.jp_colo_skill_name, combined_skills.jp_colo_skill_desc, pure_skills.en_colo_skill_name,combined_skills.en_colo_skill_desc, rk.jp_rank, rk.en_rank, nm.global, ARRAY_AGG (tagRel.tag) applied_tags, tag_table.description
    FROM nightmares nm
    INNER JOIN rarities rare USING (rarity_id)
    INNER JOIN element_attributes attr USING (attribute_id)
    INNER JOIN colosseum_skills combined_skills USING (jp_colo_skill_name, jp_rank)
    INNER JOIN ranks rk USING (jp_rank)
    INNER JOIN pure_colo_skill_names pure_skills USING (jp_colo_skill_name)
    INNER JOIN skill_tag_relations tagRel USING (jp_colo_skill_name)
    INNER JOIN tags tag_table USING (tag)
    GROUP BY nm.jp_name, nm.rarity_id, attr.attribute_id, combined_skills.jp_colo_skill_name, combined_skills.jp_rank, pure_skills.jp_colo_skill_name, rk.jp_rank, tagRel.jp_colo_skill_name;
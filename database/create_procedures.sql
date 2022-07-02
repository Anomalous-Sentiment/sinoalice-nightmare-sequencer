CREATE OR REPLACE PROCEDURE insert_tag_relations(
    inTag varchar,
    en_colo_skill varchar
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Join tables on jp name for rows where en name matches with parameters
    INSERT INTO nightmare_tag_relations (tag, jp_name, rarity_id)
    SELECT inTag, nm.jp_name, nm.rarity_id
    FROM nightmares nm
    INNER JOIN colosseum_skills colo_skills
    USING (jp_colo_skill_name)
    -- only join when the en colo skill name contains parameter as substring
    WHERE colo_skills.en_colo_skill_name LIKE '%' || en_colo_skill || '%';

END; $$ 

-- Procedure used when skill-tag relation is deleted. Need to delete all related tags from nightmare-tag relation table
CREATE OR REPLACE PROCEDURE delete_tag_relations(
    inTag varchar,
    en_colo_skill varchar
)
LANGUAGE plpgsql
AS $$
DECLARE
    curr_row RECORD;
BEGIN
    -- Join tables on jp name for rows where en name matches with parameters
    DELETE FROM nightmare_tag_relations
    WHERE (inTag, jp_name, rarity_id) 
    IN (
        SELECT inTag, nm.jp_name, nm.rarity_id
        FROM nightmares nm
        INNER JOIN colosseum_skills colo_skills
        USING (jp_colo_skill_name)
        -- only join when the en colo skill name contains parameter as substring
        WHERE colo_skills.en_colo_skill_name LIKE '%' || en_colo_skill || '%'
    );

END; $$
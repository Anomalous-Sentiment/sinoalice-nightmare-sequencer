CREATE POLICY anon_element_attributes_read ON element_attributes
    FOR SELECT 
    TO 'anon'
    USING (true);

CREATE POLICY anon_rarities_read ON rarities
    FOR SELECT 
    TO 'anon'
    USING (true);

CREATE POLICY anon_base_skills_read ON pure_colo_skill_names
    FOR SELECT 
    TO 'anon'
    USING (true);
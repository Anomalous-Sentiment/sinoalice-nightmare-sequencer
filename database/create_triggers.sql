DROP TRIGGER IF EXISTS on_nightmare_update ON nightmares;

-- Trigger for updating the update_at field when nightmare row is updated
CREATE TRIGGER on_nightmare_update
    BEFORE UPDATE ON nightmares
    FOR EACH ROW
    WHEN ( OLD.* IS DISTINCT FROM NEW.* )
    EXECUTE PROCEDURE public.update_nightmare_time_column();


DROP TRIGGER IF EXISTS on_rank_update ON ranks;

-- Trigger for updating the update_at field when rank row is updated
CREATE TRIGGER on_rank_update
    BEFORE UPDATE ON ranks
    FOR EACH ROW
    WHEN ( OLD.* IS DISTINCT FROM NEW.* )
    EXECUTE PROCEDURE public.update_rank_time_column();

DROP TRIGGER IF EXISTS on_base_skill_update ON pure_colo_skill_names;

-- Trigger for updating the update_at field when rank base skills are updated
CREATE TRIGGER on_base_skill_update
    BEFORE UPDATE ON pure_colo_skill_names
    FOR EACH ROW
    WHEN ( OLD.* IS DISTINCT FROM NEW.* )
    EXECUTE PROCEDURE public.update_skill_time_column();

DROP TRIGGER IF EXISTS on_nightmare_update ON nightmares;

-- Trigger for updating the update_at field when nightmare row is updated
CREATE TRIGGER on_nightmare_update
    AFTER UPDATE ON nightmares
    FOR EACH ROW
    WHEN ( OLD.* IS DISTINCT FROM NEW.* )
    EXECUTE PROCEDURE public.update_nightmare_time_column();


DROP TRIGGER IF EXISTS on_rank_update ON ranks;

-- Trigger for updating the update_at field when rank row is updated
CREATE TRIGGER on_rank_update
    AFTER UPDATE ON ranks
    FOR EACH ROW
    WHEN ( OLD.* IS DISTINCT FROM NEW.* )
    EXECUTE PROCEDURE public.update_rank_time_column();

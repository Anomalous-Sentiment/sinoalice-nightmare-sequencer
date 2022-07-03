CREATE OR REPLACE FUNCTION update_nightmare_time_column() RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE nightmares
    SET updated_at = (NOW() AT TIME ZONE 'Etc/GMT+8')
    WHERE jp_name = NEW.jp_name AND jp_rank = NEW.jp_rank;
END $$ ;


CREATE OR REPLACE FUNCTION update_rank_time_column() RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE nightmares
    SET updated_at = (NOW() AT TIME ZONE 'Etc/GMT+8')
    WHERE jp_rank = NEW.jp_rank;
END $$ ;
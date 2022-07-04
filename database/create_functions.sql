CREATE OR REPLACE FUNCTION update_nightmare_time_column() RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = (NOW() AT TIME ZONE 'Etc/GMT+8');
    RETURN NEW;
END $$ ;


CREATE OR REPLACE FUNCTION update_rank_time_column() RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = (NOW() AT TIME ZONE 'Etc/GMT+8');
    RETURN NEW;
END $$ ;

CREATE OR REPLACE FUNCTION update_skill_time_column() RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = (NOW() AT TIME ZONE 'Etc/GMT+8');
    RETURN NEW;
END $$ ;
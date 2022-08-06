CREATE TABLE skill_groups
(
  skill_type VARCHAR NOT NULL,
  PRIMARY KEY (skill_type)
);

INSERT INTO skill_groups (skill_type)
VALUES
  ('unique'),
  ('double atk buff'),
  ('patk only buff'),
  ('matk only buff'),
  ('double def buff'),
  ('pdef only buff'),
  ('mdef only buff'),
  ('double def debuff'),
  ('pdef only debuff'),
  ('mdef only debuff'),
  ('double atk debuff'),
  ('patk only debuff'),
  ('matk only debuff'),  
  ('fire bell'),  
  ('water bell'),  
  ('wind bell'),  
  ('heal to lf conversion'),
  ('fire buff'),
  ('water buff'),
  ('wind buff'),
  ('inc. blade effect'),
  ('fire sp reduce'),
  ('water sp reduce'),
  ('wind sp reduce')
ON CONFLICT (skill_type) DO NOTHING;

ALTER TABLE pure_colo_skill_names
  ADD COLUMN "skill_type" VARCHAR NOT NULL DEFAULT 'unique',
  ADD CONSTRAINT fk_skill_type
  FOREIGN KEY (skill_type)
  REFERENCES skill_groups;


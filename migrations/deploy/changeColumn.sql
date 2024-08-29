-- Deploy CGT-back:changeColumn to pg

BEGIN;

ALTER TABLE "user"
DROP COLUMN IF EXISTS center_has_activity_id;

ALTER TABLE "user"
ADD COLUMN activity_id INT NOT NULL REFERENCES "activity"("id") DEFAULT 47;

COMMIT;

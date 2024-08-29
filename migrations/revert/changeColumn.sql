-- Revert CGT-back:changeColumn from pg

BEGIN;

ALTER TABLE "user"
DROP COLUMN IF EXISTS activity_id;

ALTER TABLE "user"
ADD COLUMN center_has_activity_id INT NOT NULL REFERENCES "center_has_activity"("id") DEFAULT 1;


COMMIT;

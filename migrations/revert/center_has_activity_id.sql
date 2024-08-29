-- Revert CGT-back:center_has_activity_id from pg

BEGIN;

ALTER TABLE "user"
DROP COLUMN IF EXISTS center_has_activity_id;

COMMIT;

-- Revert CGT-back:V3 from pg

BEGIN;

ALTER TABLE "center_has_activity"
DROP CONSTRAINT unique_center_activity

ALTER TABLE "user_has_role"
DROP CONSTRAINT unique_user_role


COMMIT;

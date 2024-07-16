-- Deploy CGT-back:V3 to pg

BEGIN;

ALTER TABLE "center_has_activity"
ADD CONSTRAINT unique_center_activity UNIQUE ("center_id", "activity_id");

ALTER TABLE "user_has_role"
ADD CONSTRAINT unique_user_role UNIQUE ("role_id", "user_id");


COMMIT;

-- Deploy CGT-back:center_has_activity_id to pg

BEGIN;

ALTER TABLE "user" ADD COLUMN center_has_activity_id INT NOT NULL REFERENCES "center_has_activity"("id") DEFAULT 1;

COMMIT;

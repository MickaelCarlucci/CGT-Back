-- Revert CGT-back:add_email_constraint from pg

BEGIN;

ALTER TABLE "user"
DROP CONSTRAINT IF EXISTS valid_email;

COMMIT;

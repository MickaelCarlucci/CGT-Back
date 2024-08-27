-- Revert CGT-back:add_email_constraint from pg

BEGIN;

ALTER TABLE your_table_name
DROP CONSTRAINT IF EXISTS valid_email;

COMMIT;

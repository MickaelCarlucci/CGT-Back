-- Revert CGT-back:phone_column from pg

BEGIN;

ALTER TABLE "user" 
DROP CONSTRAINT IF EXISTS phone_format,
DROP COLUMN IF EXISTS phone;

COMMIT;

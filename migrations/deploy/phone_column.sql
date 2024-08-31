-- Deploy CGT-back:phone_column to pg

BEGIN;

ALTER TABLE "user" 
ADD COLUMN phone VARCHAR(20),
ADD CONSTRAINT phone_format CHECK (phone ~ '^[0-9]+$');

COMMIT;

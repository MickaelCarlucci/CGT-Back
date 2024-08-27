-- Deploy CGT-back:add_email_constraint to pg

BEGIN;

ALTER TABLE "user"
ADD CONSTRAINT valid_email
CHECK (mail ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

COMMIT;

-- Deploy CGT-back:V2 to pg

BEGIN;

ALTER TABLE "user" ALTER COLUMN "first_answer" TYPE TEXT;
ALTER TABLE "user" ALTER COLUMN "second_answer" TYPE TEXT;

COMMIT;

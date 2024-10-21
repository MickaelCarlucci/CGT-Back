-- Revert CGT-back:V2 from pg

BEGIN;

ALTER TABLE "user" ALTER COLUMN "first_answer" TYPE VARCHAR(50);
ALTER TABLE "user" ALTER COLUMN "first_answer" SET NOT NULL;

ALTER TABLE "user" ALTER COLUMN "second_answer" TYPE VARCHAR(50);
ALTER TABLE "user" ALTER COLUMN "second_answer" SET NOT NULL;
COMMIT;

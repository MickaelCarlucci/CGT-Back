-- Revert CGT-back:V6.1 from pg

BEGIN;

ALTER TABLE "user" DROP COLUMN emailVerified;
ALTER TABLE "user"
ADD COLUMN first_question TEXT,
ADD COLUMN first_answer TEXT,
ADD COLUMN second_question TEXT,
ADD COLUMN second_answer TEXT;

COMMIT;

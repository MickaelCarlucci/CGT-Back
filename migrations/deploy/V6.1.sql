-- Deploy CGT-back:V6.1 to pg

BEGIN;

ALTER TABLE "user" 
DROP COLUMN first_question,
DROP COLUMN first_answer,
DROP COLUMN second_question,
DROP COLUMN second_answer;
ALTER TABLE "user" ADD COLUMN emailVerified BOOLEAN DEFAULT false;

COMMIT;

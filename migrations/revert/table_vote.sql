-- Revert CGT-back:table_vote from pg

BEGIN;

DROP TABLE "votes";

COMMIT;

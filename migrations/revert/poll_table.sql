-- Revert CGT-back:poll_table from pg

BEGIN;

DROP TABLE "poll";

COMMIT;

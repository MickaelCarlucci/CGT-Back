-- Revert CGT-back:V6.2 from pg

BEGIN;

TRUNCATE TABLE "user_has_role" CASCADE;


COMMIT;
